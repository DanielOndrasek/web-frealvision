/**
 * Poptávka z formuláře: kontrola vstupu a převod na payload pro
 * `website-lead-webhook` v Nemo1.
 *
 * Bez importů, aby šel modul testovat přímo v Node (`npm test`).
 * Pravidla kopírují `parseWebsiteLead` v Nemo1 (`_shared/websiteLead.ts`)
 * — co projde tady, Nemo1 neodmítne kvůli tvaru dat.
 */

/** Hodnoty `form_kind`, které zná Nemo1. Nesmí se rozejít. */
export const LEAD_KINDS = [
  "advert",
  "viewing",
  "contact",
  "valuation",
  "newsletter",
] as const;

export type LeadKind = (typeof LEAD_KINDS)[number];

/** Formuláře, které tenhle web má. Newsletter ani obecný `advert` ne. */
export type WebLeadKind = Extract<LeadKind, "viewing" | "contact" | "valuation">;

const WEB_KINDS: ReadonlySet<string> = new Set<WebLeadKind>([
  "viewing",
  "contact",
  "valuation",
]);

export const KIND_LABEL: Record<LeadKind, string> = {
  advert: "Poptávka k nemovitosti",
  viewing: "Rezervace prohlídky",
  contact: "Zpráva z kontaktního formuláře",
  valuation: "Žádost o odhad ceny",
  newsletter: "Přihlášení k odběru novinek",
};

export const MESSAGE_LIMIT = 5000;

export interface Lead {
  kind: WebLeadKind;
  fullName: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  /** UUID inzerátu z Nemo1 — jen u rezervace prohlídky. */
  advertId: string | null;
  sourceUrl: string | null;
}

export type ParsedLead =
  | { status: "ok"; lead: Lead }
  | { status: "invalid"; errors: Record<string, string> }
  /** Vyplněný honeypot. Odpovídá se úspěchem, nic se neposílá. */
  | { status: "spam" };

function text(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

/** Nemo1 přijme jen http(s) do 2 048 znaků, jinak celou poptávku odmítne. */
function safeSourceUrl(value: unknown): string | null {
  const raw = text(value, 2048);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function parseLeadRequest(body: unknown): ParsedLead {
  const input = (typeof body === "object" && body !== null ? body : {}) as Record<
    string,
    unknown
  >;

  // Boti vyplní všechno včetně skrytého pole.
  if (text(input.website, 100)) return { status: "spam" };

  const fullName = text(input.fullName, 200);
  const email = text(input.email, 320);
  const phone = text(input.phone, 50);
  const message = text(input.message, MESSAGE_LIMIT);

  const errors: Record<string, string> = {};
  if (fullName.length < 2) errors.fullName = "Napište prosím své jméno.";
  if (!email && !phone) errors.email = "Vyplňte e-mail nebo telefon.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "E-mail nevypadá správně.";
  }
  if (phone && phone.replace(/\D/g, "").length < 6) {
    errors.phone = "Telefon nevypadá správně.";
  }
  if (input.consent !== true) {
    errors.consent = "Bez souhlasu vám bohužel nemůžu odpovědět.";
  }
  if (Object.keys(errors).length) return { status: "invalid", errors };

  const requested = typeof input.kind === "string" ? input.kind : "";
  const advertId = text(input.advertId, 64);
  const hasAdvert = isUuid(advertId);

  // Prohlídka bez inzerátu by v Nemo1 neprošla — je to obyčejný dotaz.
  let kind: WebLeadKind = WEB_KINDS.has(requested)
    ? (requested as WebLeadKind)
    : "contact";
  if (kind === "viewing" && !hasAdvert) kind = "contact";

  return {
    status: "ok",
    lead: {
      kind,
      fullName,
      email: email || null,
      phone: phone || null,
      message: message || null,
      advertId: kind === "viewing" ? advertId.toLowerCase() : null,
      sourceUrl: safeSourceUrl(input.sourceUrl),
    },
  };
}

/** Tělo pro `website-lead-webhook` — názvy polí podle Nemo1, ne podle webu. */
export interface Nemo1LeadPayload {
  external_id: string;
  advert_id?: string;
  form_kind: LeadKind;
  full_name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  gdpr_consent: true;
  gdpr_consent_version: string;
  submitted_at: string;
  source_url: string | null;
}

export function toNemo1Payload(
  lead: Lead,
  meta: { externalId: string; submittedAt: string; consentVersion: string },
): Nemo1LeadPayload {
  return {
    // Klíč idempotence: opakované odeslání téže poptávky Nemo1 nezdvojí.
    external_id: meta.externalId,
    ...(lead.advertId ? { advert_id: lead.advertId } : {}),
    form_kind: lead.kind,
    full_name: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    gdpr_consent: true,
    gdpr_consent_version: meta.consentVersion,
    submitted_at: meta.submittedAt,
    source_url: lead.sourceUrl,
  };
}
