import "server-only";

import { site } from "@/lib/site";
import { KIND_LABEL, type Lead } from "@/lib/leads/lead";
import { sendEmail, type SendResult } from "./resend";

/**
 * Záložní e-mail makléři, když se poptávku nepodařilo uložit do Nemo1.
 *
 * Při úspěšném doručení e-mail nechodí: Nemo1 makléři o poptávce
 * z osobního webu napíše samo (šablona `website_lead_agent`) a dva
 * e-maily o téže věci by se brzy začaly přehlížet.
 */

/** Kam notifikace chodí. Do prostředí jen, když má chodit jinam než na kontakt z webu. */
const NOTIFY_TO = process.env.LEAD_NOTIFY_TO || site.email;

const DASH = "—";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rows(lead: Lead, submittedAt: string): [string, string][] {
  return [
    ["Formulář", KIND_LABEL[lead.kind]],
    ["Jméno", lead.fullName],
    ["E-mail", lead.email ?? DASH],
    ["Telefon", lead.phone ?? DASH],
    ["Zpráva", lead.message ?? DASH],
    ["Odesláno ze stránky", lead.sourceUrl ?? DASH],
    ...(lead.advertId
      ? ([["ID inzerátu", lead.advertId]] as [string, string][])
      : []),
    ["Čas", submittedAt],
  ];
}

const WARNING =
  "Poptávku se nepodařilo uložit do Nemo1. Nikde jinde není — ozvi se z tohohle e-mailu.";

function textBody(lead: Lead, submittedAt: string): string {
  return [
    WARNING,
    "",
    ...rows(lead, submittedAt).map(([label, value]) => `${label}: ${value}`),
  ].join("\n");
}

function htmlBody(lead: Lead, submittedAt: string): string {
  const cells = rows(lead, submittedAt)
    .map(
      ([label, value]) => `
        <tr>
          <th align="left" style="padding:6px 16px 6px 0;vertical-align:top;color:#666666;font-weight:600;white-space:nowrap;">${escapeHtml(label)}</th>
          <td style="padding:6px 0;vertical-align:top;color:#0a0a0a;white-space:pre-wrap;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="cs"><body style="margin:0;padding:24px;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:15px;line-height:1.5;">
  <div style="max-width:600px;margin:0 auto;padding:28px;background:#ffffff;">
    <h1 style="margin:0 0 20px;font-size:19px;color:#0a0a0a;">${escapeHtml(KIND_LABEL[lead.kind])}</h1>
    <p style="margin:0 0 20px;padding:12px 16px;border-left:4px solid #0a0a0a;background:#f4f4f4;font-weight:600;">${escapeHtml(WARNING)}</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${cells}</table>
  </div>
</body></html>`;
}

/** Best-effort — chyba se jen zaloguje a vrátí, request kvůli ní nepadá. */
export async function notifyUndeliveredLead(
  lead: Lead,
  submittedAt: string,
): Promise<SendResult> {
  const result = await sendEmail({
    to: NOTIFY_TO,
    replyTo: lead.email ?? undefined,
    subject: `${KIND_LABEL[lead.kind]}: ${lead.fullName} (NEDORAZILO DO NEMO1)`,
    text: textBody(lead, submittedAt),
    html: htmlBody(lead, submittedAt),
  });

  if (!result.ok) {
    // Obsah poptávky do logu nepatří, jen důvod selhání.
    console.error(`[poptavka] záložní e-mail neodešel: ${result.error}`);
  }

  return result;
}
