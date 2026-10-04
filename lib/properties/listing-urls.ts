import type { Advert, Listing } from "./types";

/** Tělo hlášení pro `web-advert-listing` v Nemo1. */
export interface ListingUrlReport {
  advert_id: string;
  url: string;
  reported_at: string;
}

/**
 * Adresy detailů, které web hlásí do Nemo1.
 *
 * Hlásí se jen inzerát, který je ve feedu `active` — u staženého Nemo1
 * odkaz maže samo a hlášení s adresou by odmítlo. Výjimka `"stav":
 * "aktivni"` proto nehlásí nic; `"skryto"` ani pronájem (`scope.ts`)
 * v `listings` vůbec nejsou.
 *
 * Bez importů hodnot, aby šel modul testovat přímo v Node (`npm test`).
 *
 * Adresa musí vést na tenhle inzerát: `getListing(slug)` bere první
 * nabídku s daným slugem, takže při shodě slugů se hlásí jen ta první.
 *
 * `reported_at` je čas poslední změny inzerátu z feedu (zahrnuje
 * i zveřejnění). Opakované hlášení je pak pro Nemo1 `unchanged` a nic
 * nezapíše; po změně titulku nebo novém zveřejnění čas povyroste
 * a nová adresa se uloží.
 */
export function listingUrlReports(
  adverts: ReadonlyArray<Pick<Advert, "id" | "status" | "updated_at">>,
  listings: ReadonlyArray<Pick<Listing, "id" | "slug">>,
  siteUrl: string,
): ListingUrlReport[] {
  const firstBySlug = new Map<string, string>();
  const slugById = new Map<string, string>();
  for (const listing of listings) {
    if (!firstBySlug.has(listing.slug)) firstBySlug.set(listing.slug, listing.id);
    if (!slugById.has(listing.id)) slugById.set(listing.id, listing.slug);
  }

  return adverts.flatMap((advert) => {
    if (advert.status !== "active") return [];
    const slug = slugById.get(advert.id);
    if (!slug || firstBySlug.get(slug) !== advert.id) return [];
    if (!Number.isFinite(Date.parse(advert.updated_at))) return [];
    return [
      {
        advert_id: advert.id,
        url: `${siteUrl}/nemovitosti/${slug}`,
        reported_at: advert.updated_at,
      },
    ];
  });
}
