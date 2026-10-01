/**
 * Typy odpovídají `contract/export.schema.json` (verze 1.0).
 * Feed posílá výčty jako slugy — překlad na české popisky dělá `dictionary.ts`.
 */

export type AdType = "prodej" | "pronajem";
export type PropertyKind = "byt" | "dum" | "pozemek" | "komercni" | "ostatni";
export type AdvertStatus = "active" | "inactive";

export interface Broker {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export interface Photo {
  url: string;
  description: string | null;
  category: string | null;
  is_cover: boolean | null;
}

/** Jeden inzerát tak, jak přijde z `web-advert-feed`. */
export interface Advert {
  id: string;
  status: AdvertStatus;
  updated_at: string;
  url: string | null;
  broker: Broker;

  ad_type: AdType | null;
  property_kind: PropertyKind | null;
  property_category: string | null;
  disposition: string | null;
  title: string | null;
  description: string | null;

  price: number | null;
  currency: string | null;
  price_on_request: boolean | null;
  commission: string | null;

  address: string | null;
  street: string | null;
  street_number: string | null;
  orientation_number: string | null;
  city: string | null;
  city_part: string | null;
  zip: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  object_location: string | null;
  surroundings: string | null;

  usable_area: number | null;
  total_area: number | null;
  built_up_area: number | null;
  land_area: number | null;
  balcony_area: number | null;
  terrace_area: number | null;
  loggia_area: number | null;
  cellar_area: number | null;
  pool_area: number | null;
  floor: number | null;
  total_floors: number | null;
  flat_floor: string | null;

  building_type: string | null;
  building_condition: string | null;
  ownership_type: string | null;
  house_type: string | null;
  energy_rating: string | null;
  furnished: string | null;
  parking: string | null;
  garage_count: number | null;
  parking_spots: number | null;
  construction_year: number | null;
  reconstruction_year: number | null;
  approval_year: number | null;
  available_from: string | null;
  sale_start_date: string | null;
  construction_start_date: string | null;
  construction_end_date: string | null;

  balcony: boolean | null;
  terrace: boolean | null;
  loggia: boolean | null;
  elevator: boolean | null;
  cellar: boolean | null;
  garden: boolean | null;
  garage: boolean | null;
  pool: boolean | null;
  barrier_free: boolean | null;
  solar_panels: boolean | null;
  photovoltaics: boolean | null;
  low_energy: boolean | null;

  heating: string[] | null;
  heating_body: string[] | null;
  hot_water_source: string[] | null;
  water: string[] | null;
  well_type: string[] | null;
  sewage: string[] | null;
  gas: string[] | null;
  telecomunication: string[] | null;
  transport: string[] | null;
  access_road: string[] | null;
  /** Legacy, významem shodné s access_road. Nemusí přijít. */
  road_type?: string[] | null;
  orientation: string[] | null;

  photos: Array<Photo | string> | null;
  floor_plans: string[] | null;
  video_url: string | null;
  youtube_url: string | null;
  virtual_tour_url: string | null;
  maps_panorama_url: string | null;
  energy_certificate_url: string | null;
}

export interface AdvertFeed {
  version: string;
  generated_at: string;
  adverts: Advert[];
}

/**
 * Stav nabídky pro web. Feed rozlišuje jen active/inactive, „prodáno“
 * a „rezervováno“ drží archiv v `content/archiv/`.
 */
export type ListingState = "active" | "reserved" | "sold";

/** Nabídka připravená k vykreslení — normalizovaná, se slugem a odvozenými hodnotami. */
export interface Listing {
  id: string;
  slug: string;
  state: ListingState;
  updatedAt: string;

  title: string;
  /** Titulek se zaručenou lokalitou — do <title> a <h1>. */
  seoTitle: string;
  description: string | null;
  /** Popis zkrácený na hranici věty do 155 znaků. */
  metaDescription: string;

  adType: AdType;
  kind: PropertyKind;
  disposition: string | null;

  price: number | null;
  priceOnRequest: boolean;
  currency: string;
  pricePerSqm: number | null;

  locality: string | null;
  address: string | null;
  city: string | null;
  cityPart: string | null;
  region: string | null;
  zip: string | null;
  coords: { lat: number; lng: number } | null;

  area: number | null;
  landArea: number | null;
  floor: number | null;
  totalFloors: number | null;
  energyRating: string | null;

  photos: Photo[];
  cover: Photo | null;
  /** Půdorysy — v galerii nejsou, detail je ukazuje ve vlastní sekci. */
  floorPlans: Photo[];
  tourUrl: string | null;
  videoUrl: string | null;

  features: string[];
  specs: Array<{ label: string; value: string }>;
  broker: Broker;
  raw: Advert;
}
