import "server-only";
import { FEED_URL, INTEGRATION_ID, SECRET, isConfigured } from "@/lib/nemo1";
import sample from "./contract/sample.json";
import { toListing } from "./normalize";
import { getListingOverrides, type ListingOverride } from "./overrides";
import { getSnapshotAdverts } from "./snapshots";
import { isOfferedOnWeb } from "./scope";
import type { Advert, AdvertFeed, Listing, ListingState } from "./types";

/**
 * Feed se přenačítá po pěti minutách. Nemo1 web o exportu ani deaktivaci
 * neupozorní (`/api/revalidate` z Nemo1 nikdo nevolá), takže tohle je
 * jediné, co určuje, jak rychle se deaktivovaný inzerát překlopí na
 * „Prodáno“. Stránky, které feed čtou, mají stejné `revalidate`.
 */
const REVALIDATE_SECONDS = 300;

/**
 * Ukázka z datového kontraktu je jen pro `next dev` bez přístupu k Nemo1.
 * Nasazený web bez napojení ukáže prázdnou nabídku — ukázkový byt by
 * návštěvník bral jako skutečnou nemovitost.
 */
const usingFixtures = !isConfigured && process.env.NODE_ENV === "development";

const EMPTY_FEED: AdvertFeed = { version: "", generated_at: "", adverts: [] };

async function fetchFeed(): Promise<AdvertFeed> {
  if (usingFixtures) return sample as unknown as AdvertFeed;
  if (!isConfigured) return EMPTY_FEED;

  /**
   * Autentizace podle `_shared/webIntegrationAuth.ts` v Nemo1: veřejné
   * UUID integrace v hlavičce a sdílené tajemství jako Bearer.
   * Tajemství nikdy nesmí být v URL — jinak skončí v logu CDN.
   */
  const res = await fetch(FEED_URL, {
    headers: {
      "X-Nemo1-Integration-Id": INTEGRATION_ID!,
      Authorization: `Bearer ${SECRET}`,
      Accept: "application/json",
    },
    next: { revalidate: REVALIDATE_SECONDS, tags: ["adverts"] },
  });

  if (!res.ok) {
    throw new Error(
      `web-advert-feed odpovědel ${res.status} ${res.statusText}`,
    );
  }

  return (await res.json()) as AdvertFeed;
}

/** Inzeráty přesně tak, jak je poslal feed — pro hlášení odkazů do Nemo1. */
export async function getFeedAdverts(): Promise<Advert[]> {
  return (await fetchFeed()).adverts;
}

type Overrides = Map<string, ListingOverride>;

/**
 * Inzerát, který se vůbec smí dostat na web.
 *
 * Stav se tu neřeší. Feed rozlišuje jen `active` a `inactive` a `inactive`
 * neznamená „zahoď“ — viz `closedState()`. Nadobro sundá nabídku zápis
 * `"stav": "skryto"` v `content/stavy-nabidek.json` — a pronájem, který
 * web nenabízí vůbec (`scope.ts`).
 */
function isPublishable(advert: Advert, overrides: Overrides): boolean {
  return (
    Boolean(advert.title) &&
    isOfferedOnWeb(advert) &&
    overrides.get(advert.id) !== "skryto"
  );
}

/**
 * Nabídka, která se na webu chová jako živá.
 *
 * Kromě aktivních inzerátů sem patří i deaktivovaný inzerát s výjimkou
 * `"stav": "aktivni"` — nemovitost se pořád prodává, jen ten konkrétní
 * inzerát v Nemo1 neběží. Viz `content/stavy-nabidek.json`.
 */
function isLive(advert: Advert, overrides: Overrides): boolean {
  return advert.status === "active" || overrides.get(advert.id) === "aktivni";
}

/**
 * Stav deaktivované nabídky.
 *
 * Deaktivace inzerátu v Nemo1 znamená, že obchod dopadl — nabídka proto
 * dostane „Prodáno“ / „Pronajato“ a z webu nikdy nezmizí. Feed rozlišuje
 * jen `active` a `inactive`, takže víc než tohle sám neurčí.
 *
 * Když nemovitost zatím jen leží v rezervaci nebo na web vůbec nepatří,
 * řekne to `content/stavy-nabidek.json`.
 */
function closedState(advert: Advert, overrides: Overrides): ListingState {
  return overrides.get(advert.id) === "reserved" ? "reserved" : "sold";
}

/** Aktivní nabídky z Nemo1, nejnovější první. */
export async function getListings(): Promise<Listing[]> {
  const [feed, overrides] = await Promise.all([
    fetchFeed(),
    getListingOverrides(),
  ]);

  return feed.adverts
    .filter((a) => isLive(a, overrides) && isPublishable(a, overrides))
    .map((a) => toListing(a, "active"))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/**
 * Nabídky stažené z inzerce — uzavřené obchody a rezervace.
 *
 * Deaktivace inzerátu v Nemo1 nabídku z webu nesmaže, jen ji překlopí na
 * „Prodáno“ / „Pronajato“: URL zůstane žít, odkazy na ni nepadají na 404
 * a realizovaný obchod zůstane vidět. Výjimky — rezervace, nebo nabídka,
 * která na web vůbec nepatří — řeší `content/stavy-nabidek.json`.
 *
 * Dva zdroje, v tomhle pořadí přednosti:
 *
 *   feed                   `status: inactive` — nejčerstvější podoba inzerátu
 *   content/archiv-nemo1/  otisky z `npm run archiv:feed`, když už ve feedu není
 */
export async function getClosedListings(): Promise<Listing[]> {
  const [feed, snapshots, overrides] = await Promise.all([
    fetchFeed(),
    getSnapshotAdverts(),
    getListingOverrides(),
  ]);

  const fromFeed = feed.adverts
    .filter((a) => !isLive(a, overrides) && isPublishable(a, overrides))
    .map((a) => toListing(a, closedState(a, overrides)));

  // Otisk a tombstone je tentýž inzerát, dokud ho feed posílá. Párujeme
  // podle `id` z Nemo1, protože slug se dá změnit úpravou titulku.
  const knownIds = new Set(feed.adverts.map((a) => a.id));
  const fromSnapshots = snapshots
    .filter((a) => !knownIds.has(a.id) && isPublishable(a, overrides))
    .map((a) => toListing(a, closedState(a, overrides)));

  return [...fromFeed, ...fromSnapshots].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

/**
 * Všechny nabídky včetně uzavřených — pro výpis, kde se filtruje stavem.
 * Prodané zůstávají dohledatelné, ale řadí se za živé.
 */
export async function getAllListings(): Promise<Listing[]> {
  const [live, closed] = await Promise.all([
    getListings(),
    getClosedListings(),
  ]);

  // Živá nabídka vyhrává nad uzavřenou se stejným slugem — jinak by na
  // jednu URL vedly dvě různé nabídky a `generateStaticParams` by je
  // vygeneroval dvakrát.
  const liveSlugs = new Set(live.map((l) => l.slug));

  const rank = { active: 0, reserved: 1, sold: 2 } as const;
  return [...live, ...closed.filter((l) => !liveSlugs.has(l.slug))].sort(
    (a, b) =>
      rank[a.state] - rank[b.state] || b.updatedAt.localeCompare(a.updatedAt),
  );
}

/** Nabídka podle slugu — živá i uzavřená. */
export async function getListing(slug: string): Promise<Listing | null> {
  const listings = await getAllListings();
  return listings.find((l) => l.slug === slug) ?? null;
}

/**
 * Podobné nabídky. Posledních pár přidaných by člověku, který si prohlíží
 * dům za Prahou, nabídlo garsonku v centru — řadíme proto podle shody
 * lokality, druhu nemovitosti a blízkosti ceny.
 */
export async function getRelatedListings(
  current: Listing,
  limit = 3,
): Promise<Listing[]> {
  const all = await getListings();

  return all
    .filter((l) => l.id !== current.id)
    .map((l) => {
      let score = 0;
      if (l.city && l.city === current.city) score += 3;
      if (l.cityPart && l.cityPart === current.cityPart) score += 2;
      if (l.kind === current.kind) score += 2;
      if (l.adType === current.adType) score += 1;

      if (l.price && current.price) {
        const ratio = Math.abs(l.price - current.price) / current.price;
        if (ratio <= 0.25) score += 2;
        else if (ratio <= 0.5) score += 1;
      }

      return { listing: l, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.listing);
}
