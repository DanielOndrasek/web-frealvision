import { randomUUID } from "node:crypto";
import { CONSENT_VERSION } from "@/lib/gdpr";
import { INTEGRATION_ID, LEAD_WEBHOOK_URL, SECRET, isConfigured } from "@/lib/nemo1";
import { parseLeadRequest, toNemo1Payload } from "@/lib/leads/lead";
import { deliverLead } from "@/lib/leads/nemo1-webhook";
import { isEmailConfigured } from "@/lib/email/resend";
import { notifyUndeliveredLead } from "@/lib/email/lead-notification";

/**
 * Příjem poptávek z formulářů → `website-lead-webhook` v Nemo1.
 *
 * Veřejný endpoint: návštěvník se neautentizuje, chrání ho honeypot
 * a limity Nemo1 (120 požadavků za minutu na integraci a IP). Web nic
 * neukládá — poptávka žije v Nemo1. Když se ji tam nepodaří dostat,
 * odejde makléři záložní e-mail, aby se kontakt neztratil.
 */

const FAILED =
  "Poptávku se nepodařilo odeslat. Zkuste to prosím znovu, nebo zavolejte.";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  const parsed = parseLeadRequest(body);
  // Robotovi se tváříme, že se to povedlo.
  if (parsed.status === "spam") return Response.json({ ok: true });
  if (parsed.status === "invalid") {
    return Response.json({ errors: parsed.errors }, { status: 422 });
  }

  const { lead } = parsed;
  const submittedAt = new Date().toISOString();

  if (isConfigured) {
    const result = await deliverLead(
      toNemo1Payload(lead, {
        externalId: `web-${lead.kind}-${randomUUID()}`,
        submittedAt,
        consentVersion: CONSENT_VERSION,
      }),
      { url: LEAD_WEBHOOK_URL, integrationId: INTEGRATION_ID!, secret: SECRET! },
    );

    if (result.stored) return Response.json({ ok: true });
    console.error(`[poptavka] ${result.reason}`);
  } else {
    console.error("[poptavka] Nemo1 není nakonfigurované, poptávka jde jen e-mailem");
  }

  if (isEmailConfigured && (await notifyUndeliveredLead(lead, submittedAt)).ok) {
    return Response.json({ ok: true });
  }

  // Radši to přiznat, než poptávku tiše zahodit.
  return Response.json(
    {
      error: isConfigured
        ? FAILED
        : "Formulář zatím není napojený. Zavolejte prosím, nebo napište e-mail.",
    },
    { status: isConfigured ? 502 : 503 },
  );
}
