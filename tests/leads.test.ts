import { test } from "node:test";
import assert from "node:assert/strict";
import { parseLeadRequest, toNemo1Payload } from "../lib/leads/lead.ts";
import { deliverLead, signBody } from "../lib/leads/nemo1-webhook.ts";
import type { Nemo1LeadPayload } from "../lib/leads/lead.ts";

const ADVERT = "3f2a9c10-1b2c-4d3e-8f40-123456789abc";

const valid = {
  kind: "viewing",
  fullName: "Jana Nováková",
  email: "jana@example.com",
  phone: "",
  message: "Hodí se mi úterý.",
  consent: true,
  advertId: ADVERT,
  sourceUrl: "https://example.cz/nemovitosti/byt",
};

function payload(overrides: Partial<Nemo1LeadPayload> = {}): Nemo1LeadPayload {
  return {
    external_id: "web-viewing-1",
    advert_id: ADVERT,
    form_kind: "viewing",
    full_name: "Jana Nováková",
    email: "jana@example.com",
    phone: null,
    message: null,
    gdpr_consent: true,
    gdpr_consent_version: "test-v1",
    submitted_at: "2026-10-01T10:00:00.000Z",
    source_url: null,
    ...overrides,
  };
}

/** Falešný fetch: vrací stavy v daném pořadí a zapisuje, co dostal. */
function fakeFetch(statuses: Array<number | "throw">) {
  const calls: Array<{ headers: Record<string, string>; body: string }> = [];
  const impl = (async (_url: string, init: RequestInit) => {
    calls.push({
      headers: init.headers as Record<string, string>,
      body: init.body as string,
    });
    const next = statuses.shift();
    if (next === undefined) throw new Error("nečekané volání");
    if (next === "throw") throw new Error("síť");
    return new Response(null, { status: next });
  }) as unknown as typeof fetch;
  return { impl, calls };
}

const options = (impl: typeof fetch) => ({
  url: "https://nemo1.test/website-lead-webhook",
  integrationId: "00000000-0000-4000-8000-000000000000",
  secret: "tajemstvi",
  fetchImpl: impl,
  retryDelayMs: 0,
});

test("platná rezervace prohlídky projde s inzerátem", () => {
  const parsed = parseLeadRequest(valid);
  assert.equal(parsed.status, "ok");
  if (parsed.status !== "ok") return;
  assert.equal(parsed.lead.kind, "viewing");
  assert.equal(parsed.lead.advertId, ADVERT);
  assert.equal(parsed.lead.phone, null);
});

test("prohlídka bez platného inzerátu je obecný dotaz", () => {
  const parsed = parseLeadRequest({ ...valid, advertId: "neni-uuid" });
  assert.equal(parsed.status, "ok");
  if (parsed.status !== "ok") return;
  assert.equal(parsed.lead.kind, "contact");
  assert.equal(parsed.lead.advertId, null);
});

test("kontakt nenese inzerát, ani když ho formulář pošle", () => {
  const parsed = parseLeadRequest({ ...valid, kind: "contact" });
  assert.equal(parsed.status === "ok" && parsed.lead.advertId, null);
});

test("neznámý nebo nepodporovaný druh formuláře je kontakt", () => {
  for (const kind of ["newsletter", "advert", "cokoliv", undefined]) {
    const parsed = parseLeadRequest({ ...valid, kind, advertId: undefined });
    assert.equal(parsed.status === "ok" && parsed.lead.kind, "contact");
  }
});

test("chybí jméno, kontakt i souhlas", () => {
  const parsed = parseLeadRequest({ fullName: "J", consent: false });
  assert.equal(parsed.status, "invalid");
  if (parsed.status !== "invalid") return;
  assert.deepEqual(Object.keys(parsed.errors).sort(), ["consent", "email", "fullName"]);
});

test("souhlas musí být přesně true, ne řetězec", () => {
  const parsed = parseLeadRequest({ ...valid, consent: "on" });
  assert.equal(parsed.status, "invalid");
});

test("telefon s méně než šesti číslicemi neprojde", () => {
  const parsed = parseLeadRequest({ ...valid, email: "", phone: "12" });
  assert.equal(parsed.status === "invalid" && Boolean(parsed.errors.phone), true);
});

test("vyplněný honeypot je spam a nic se nekontroluje", () => {
  assert.equal(parseLeadRequest({ website: "http://spam" }).status, "spam");
});

test("source_url jen http(s) — jinak by Nemo1 celou poptávku odmítlo", () => {
  const parsed = parseLeadRequest({ ...valid, sourceUrl: "javascript:alert(1)" });
  assert.equal(parsed.status === "ok" && parsed.lead.sourceUrl, null);
});

test("payload má názvy polí podle Nemo1", () => {
  const parsed = parseLeadRequest(valid);
  assert.equal(parsed.status, "ok");
  if (parsed.status !== "ok") return;
  const body = toNemo1Payload(parsed.lead, {
    externalId: "web-viewing-x",
    submittedAt: "2026-10-01T10:00:00.000Z",
    consentVersion: "test-v1",
  });
  assert.equal(body.gdpr_consent, true);
  assert.equal(body.gdpr_consent_version, "test-v1");
  assert.equal(body.advert_id, ADVERT);
  assert.equal(body.form_kind, "viewing");
  assert.equal("consent" in body, false);
});

test("podpis je HMAC-SHA256 nad tělem (RFC 4231, případ 2)", () => {
  assert.equal(
    signBody("what do ya want for nothing?", "Jefe"),
    "sha256=5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843",
  );
});

test("odeslané tělo je přesně to, co se podepsalo", async () => {
  const { impl, calls } = fakeFetch([201]);
  const result = await deliverLead(payload(), options(impl));
  assert.deepEqual(result, { stored: true, duplicate: false, downgraded: false });
  assert.equal(calls[0].headers["X-Nemo1-Signature"], signBody(calls[0].body, "tajemstvi"));
  assert.equal(
    calls[0].headers["X-Nemo1-Integration-Id"],
    "00000000-0000-4000-8000-000000000000",
  );
});

test("200 od Nemo1 je duplicita, ne chyba", async () => {
  const { impl } = fakeFetch([200]);
  const result = await deliverLead(payload(), options(impl));
  assert.equal(result.stored && result.duplicate, true);
});

test("zmizelý inzerát (404) odejde znovu jako obecný dotaz", async () => {
  const { impl, calls } = fakeFetch([404, 201]);
  const result = await deliverLead(payload(), options(impl));
  assert.deepEqual(result, { stored: true, duplicate: false, downgraded: true });
  const second = JSON.parse(calls[1].body);
  assert.equal(second.advert_id, undefined);
  assert.equal(second.form_kind, "contact");
  // Stejný klíč idempotence — první pokus se neuložil, nic se nezdvojí
  assert.equal(second.external_id, "web-viewing-1");
});

test("404 bez inzerátu se neopakuje", async () => {
  const { impl, calls } = fakeFetch([404]);
  const result = await deliverLead(
    payload({ advert_id: undefined, form_kind: "contact" }),
    options(impl),
  );
  assert.equal(result.stored, false);
  assert.equal(calls.length, 1);
});

test("503 a výpadek sítě se zkusí ještě jednou", async () => {
  for (const first of [503, "throw"] as const) {
    const { impl, calls } = fakeFetch([first, 201]);
    const result = await deliverLead(payload(), options(impl));
    assert.equal(result.stored, true);
    assert.equal(calls.length, 2);
  }
});

test("opakuje se nanejvýš jednou", async () => {
  const { impl, calls } = fakeFetch([500, 500]);
  const result = await deliverLead(payload(), options(impl));
  assert.deepEqual(result, { stored: false, reason: "Nemo1 odpovědělo 500" });
  assert.equal(calls.length, 2);
});

test("401 je chyba konfigurace — neopakuje se", async () => {
  const { impl, calls } = fakeFetch([401]);
  const result = await deliverLead(payload(), options(impl));
  assert.equal(result.stored, false);
  assert.equal(calls.length, 1);
});
