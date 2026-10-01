import { labels } from "./dictionary";
import {
  floorPlanFromUrl,
  looksLikeFloorPlan,
  pickCover,
  splitFloorPlans,
} from "./floor-plans";
import { listingSlug } from "./slug";
import { formatArea, formatFloor } from "@/lib/format";
import type { Advert, Listing, ListingState, Photo } from "./types";

/** Popis do meta description — useknutý na hranici věty, ne uprostřed slova. */
export function toMetaDescription(text: string | null, limit = 155): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;

  const window = clean.slice(0, limit + 1);
  const sentenceEnd = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("! "),
    window.lastIndexOf("? "),
  );
  if (sentenceEnd > limit * 0.5) return clean.slice(0, sentenceEnd + 1);

  const wordEnd = window.lastIndexOf(" ");
  return `${clean.slice(0, wordEnd > 0 ? wordEnd : limit).trimEnd()}…`;
}

function normalizePhotos(photos: Advert["photos"]): Photo[] {
  if (!photos?.length) return [];
  return photos
    .map((p): Photo | null => {
      if (typeof p === "string") {
        return { url: p, description: null, category: null, is_cover: null };
      }
      return p?.url ? p : null;
    })
    .filter((p): p is Photo => p !== null);
}

/** Lokalita pro titulek: „Praha – Vokovice“, „Skorkov“. */
export function localityLabel(advert: Advert): string | null {
  const { city, city_part: part } = advert;
  if (city && part && part !== city) return `${city} – ${part}`;
  return city || part || null;
}

/**
 * Titulek se zaručenou lokalitou. U realit je to nejdůležitější věc
 * v titulku vůbec, a do názvu inzerátu ji člověk často nenapíše.
 */
function buildSeoTitle(advert: Advert, locality: string | null): string {
  const title = advert.title?.trim() || "Nabídka nemovitosti";
  if (!locality) return title;

  const haystack = title.toLowerCase();
  const alreadyThere = locality
    .split("–")
    .map((p) => p.trim().toLowerCase())
    .some((p) => p.length > 2 && haystack.includes(p));

  return alreadyThere ? title : `${title}, ${locality}`;
}

function buildFeatures(a: Advert): string[] {
  const flags: Array<[boolean | null, string]> = [
    [a.elevator, "Výtah"],
    [a.balcony, "Balkon"],
    [a.terrace, "Terasa"],
    [a.loggia, "Lodžie"],
    [a.cellar, "Sklep"],
    [a.garden, "Zahrada"],
    [a.garage, "Garáž"],
    [a.pool, "Bazén"],
    [a.barrier_free, "Bezbariérové"],
    [a.solar_panels, "Solární panely"],
    [a.photovoltaics, "Fotovoltaika"],
    [a.low_energy, "Nízkoenergetické"],
  ];
  return flags.filter(([on]) => on === true).map(([, text]) => text);
}

function buildSpecs(a: Advert): Array<{ label: string; value: string }> {
  const rows: Array<[string, string | null]> = [
    ["Dispozice", a.disposition || a.property_category],
    ["Užitná plocha", formatArea(a.usable_area)],
    ["Plocha pozemku", formatArea(a.land_area)],
    ["Terasa", formatArea(a.terrace_area)],
    ["Balkon", formatArea(a.balcony_area)],
    ["Lodžie", formatArea(a.loggia_area)],
    ["Sklep", formatArea(a.cellar_area)],
    ["Podlaží", formatFloor(a.floor, a.total_floors)],
    ["Vlastnictví", a.ownership_type],
    ["Konstrukce", a.building_type],
    ["Stav", a.building_condition],
    ["Rok stavby", a.construction_year ? String(a.construction_year) : null],
    ["Rekonstrukce", a.reconstruction_year ? String(a.reconstruction_year) : null],
    ["Energetická třída", a.energy_rating],
    ["Vybavení", a.furnished],
    ["Parkování", a.parking],
    ["Vytápění", labels("heating", a.heating).join(", ") || null],
    ["Ohřev vody", labels("hot_water_source", a.hot_water_source).join(", ") || null],
    ["Voda", labels("water", a.water).join(", ") || null],
    ["Odpad", labels("sewage", a.sewage).join(", ") || null],
    ["Plyn", labels("gas", a.gas).join(", ") || null],
    ["Telekomunikace", labels("telecomunication", a.telecomunication).join(", ") || null],
    ["Doprava", labels("transport", a.transport).join(", ") || null],
    ["Orientace", labels("orientation", a.orientation).join(", ") || null],
  ];

  return rows
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([label, value]) => ({ label, value }));
}

export function toListing(
  advert: Advert,
  state: ListingState = "active",
): Listing {
  const { photos, floorPlans } = splitFloorPlans(
    normalizePhotos(advert.photos),
    (photo) => looksLikeFloorPlan(photo.category, photo.description),
    (advert.floor_plans ?? []).map(floorPlanFromUrl),
  );
  const locality = localityLabel(advert);
  const area = advert.usable_area ?? advert.total_area ?? null;
  const price = advert.price;

  return {
    id: advert.id,
    slug: listingSlug({
      title: advert.title,
      city: advert.city,
      cityPart: advert.city_part,
    }),
    state,
    updatedAt: advert.updated_at,

    title: advert.title?.trim() || "Nabídka nemovitosti",
    seoTitle: buildSeoTitle(advert, locality),
    description: advert.description,
    metaDescription: toMetaDescription(advert.description),

    adType: advert.ad_type ?? "prodej",
    kind: advert.property_kind ?? "ostatni",
    disposition: advert.disposition || advert.property_category,

    price,
    priceOnRequest: advert.price_on_request === true,
    currency: advert.currency || "CZK",
    pricePerSqm:
      price != null && area && area > 0 ? Math.round(price / area) : null,

    locality,
    address: advert.address,
    city: advert.city,
    cityPart: advert.city_part,
    region: advert.region,
    zip: advert.zip,
    coords:
      advert.latitude != null && advert.longitude != null
        ? { lat: advert.latitude, lng: advert.longitude }
        : null,

    area,
    landArea: advert.land_area,
    floor: advert.floor,
    totalFloors: advert.total_floors,
    energyRating: advert.energy_rating,

    photos,
    cover: pickCover(photos, floorPlans),
    floorPlans,
    tourUrl: advert.virtual_tour_url,
    videoUrl: advert.youtube_url || advert.video_url,

    features: buildFeatures(advert),
    specs: buildSpecs(advert),
    broker: advert.broker,
    raw: advert,
  };
}
