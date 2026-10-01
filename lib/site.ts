/**
 * Jediné místo s kontakty a identitou. Nikdy nepiš telefon nebo e-mail
 * napřímo do komponenty — použij tohle, ať se změna dělá na jednom místě.
 *
 * Hodnoty označené v `missingIdentity()` jsou zatím zástupné. Web s nimi
 * běží, ale `npm run check` neprojde a náhled to hlásí v liště nahoře —
 * do ostrého provozu se tak nedostanou omylem.
 */

/**
 * Adresa webu. Bez ní platí localhost, a protože middleware dává noindex
 * všemu mimo tuhle adresu, nasazený web se do Googlu nedostane, dokud
 * se doména vědomě nenastaví. Viz middleware.ts.
 */
const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const site = {
  name: "František Kroupa",
  company: "F-Real Vision s.r.o.",
  tagline: "Realitní makléř",
  url,
  locale: "cs_CZ",
  description:
    "Realitní makléř František Kroupa — stratég, vyjednavač a marketér s důrazem na detail. Prodej, koupě i pronájem bytů, domů a pozemků.",

  phone: "+420 777 990 900",
  phoneHref: "tel:+420777990900",
  email: "fr.kroupa@gmail.com",

  /**
   * Portrét, cesta do `public/`, fotka v poměru 4 : 5. Odbarvuje se až
   * na webu (CSS), soubor zůstává barevný. Bez fotky se ukáže monogram.
   */
  portrait: "/foto/frantisek-kroupa.webp" as string | null,

  /** Údaje firmy do patičky a zásad zpracování osobních údajů. */
  legal: {
    ico: null as string | null,
    address: null as string | null,
  },

  /**
   * Adresy konkrétních profilů. Prázdná hodnota = ikona se na webu
   * neukáže.
   */
  social: {
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: "",
  },

  /** Horní lišta nad navigací — hlavní konverzní CTA webu. */
  banner: {
    text: "Chcete znát tržní hodnotu své nemovitosti?",
    linkText: "Odhad zdarma",
    href: "/odhad-zdarma",
  },

  nav: [
    { href: "/", label: "Úvod" },
    { href: "/nemovitosti", label: "Nabídka" },
    { href: "/o-mne", label: "O mně" },
    { href: "/reference", label: "Reference" },
    { href: "/odhad-zdarma", label: "Odhad zdarma" },
    { href: "/kontakt", label: "Kontakt" },
  ],
} as const;

/** Zástupné hodnoty, které je potřeba před spuštěním nahradit skutečnými. */
export function missingIdentity(): string[] {
  const missing: string[] = [];
  if (/^\+420 0{3} 0{3} 0{3}$/.test(site.phone)) missing.push("telefon");
  if (site.email.endsWith("@example.cz")) missing.push("e-mail");
  if (!site.legal.ico) missing.push("IČO");
  if (!site.legal.address) missing.push("sídlo firmy");
  if (!process.env.NEXT_PUBLIC_SITE_URL) missing.push("doména webu");
  return missing;
}
