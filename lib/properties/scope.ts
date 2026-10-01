import type { Advert } from "./types";

/**
 * Co web nabízí. František pronájmy na webu nenabízí — jen prodej
 * (rozhodnutí z 1. 10. 2026). Pronájem exportovaný z Nemo1 na portál
 * „Osobní web makléře“ se proto na web nedostane vůbec: ani jako živá
 * nabídka, ani jako „Pronajato“.
 *
 * Inzerát bez vyplněného typu se bere jako prodej, stejně jako
 * v `normalize.ts`.
 *
 * Bez importů hodnot, aby šel modul testovat přímo v Node (`npm test`).
 */
export function isOfferedOnWeb(advert: Pick<Advert, "ad_type">): boolean {
  return advert.ad_type !== "pronajem";
}
