import { test } from "node:test";
import assert from "node:assert/strict";
import { listingUrlReports } from "../lib/properties/listing-urls.ts";

const SITE = "https://www.f-realvision.cz";
const T = "2026-10-04T12:00:00.000Z";

test("živá nabídka z feedu se hlásí s adresou detailu a časem změny", () => {
  const reports = listingUrlReports(
    [{ id: "a1", status: "active", updated_at: T }],
    [{ id: "a1", slug: "prodej-bytu-2-kk-praha" }],
    SITE,
  );
  assert.deepEqual(reports, [
    { advert_id: "a1", url: `${SITE}/nemovitosti/prodej-bytu-2-kk-praha`, reported_at: T },
  ]);
});

test("stažený inzerát se nehlásí, ani když ho web drží jako živý", () => {
  const reports = listingUrlReports(
    [
      { id: "sold", status: "inactive", updated_at: T },
      { id: "forced", status: "inactive", updated_at: T },
    ],
    [
      { id: "forced", slug: "dum-skorkov" },
      { id: "sold", slug: "byt-prodany" },
    ],
    SITE,
  );
  assert.deepEqual(reports, []);
});

test("nabídka, kterou web neukazuje (skryto, pronájem), se nehlásí", () => {
  const reports = listingUrlReports(
    [{ id: "hidden", status: "active", updated_at: T }],
    [],
    SITE,
  );
  assert.deepEqual(reports, []);
});

test("při shodě slugů se hlásí jen nabídka, na kterou adresa opravdu vede", () => {
  const reports = listingUrlReports(
    [
      { id: "first", status: "active", updated_at: T },
      { id: "second", status: "active", updated_at: T },
    ],
    [
      { id: "first", slug: "stejny-slug" },
      { id: "second", slug: "stejny-slug" },
    ],
    SITE,
  );
  assert.deepEqual(reports.map((r) => r.advert_id), ["first"]);
});

test("neplatný čas změny se nehlásí — Nemo1 by ho odmítlo", () => {
  const reports = listingUrlReports(
    [{ id: "a1", status: "active", updated_at: "včera" }],
    [{ id: "a1", slug: "byt" }],
    SITE,
  );
  assert.deepEqual(reports, []);
});
