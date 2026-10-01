import { site } from "@/lib/site";

/**
 * Identifikátor znění souhlasu. Posílá se do Nemo1 jako
 * `gdpr_consent_version`, aby šlo dohledat, s jakým textem přesně
 * návštěvník souhlasil.
 *
 * PŘI KAŽDÉ ZMĚNĚ znění checkboxu nebo zásad zvyš číslo verze.
 * Staré souhlasy se tím nezneplatní — jen se pozná, který text platil.
 */
export const CONSENT_VERSION = "web-frealvision/zasady-v1";

export const CONSENT_LABEL =
  "Souhlasím se zpracováním uvedených údajů za účelem vyřízení mé poptávky.";

/** Správce údajů — firma makléře. */
export const controller = {
  name: site.company,
  ico: site.legal.ico,
  address: site.legal.address,
  /** Jak dlouho se drží poptávky, které nevedly ke spolupráci. */
  retention: "jeden rok",
} as const;
