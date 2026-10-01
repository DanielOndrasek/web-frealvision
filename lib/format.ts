import { format, formatDistanceToNowStrict, parseISO } from "date-fns";
import { cs } from "date-fns/locale";

/**
 * České formátování čísel. Intl pro cs-CZ odděluje tisíce úzkou nedělitelnou
 * mezerou (U+202F), která se v některých fontech vykresluje skoro neviditelně.
 * Sjednocujeme na běžnou nedělitelnou mezeru (U+00A0).
 */
const NBSP = " ";

function normalizeSpaces(value: string): string {
  return value.replace(/[    ]/g, NBSP);
}

function czNumber(value: number, maximumFractionDigits = 0): string {
  return normalizeSpaces(
    new Intl.NumberFormat("cs-CZ", { maximumFractionDigits }).format(value),
  );
}

/** „14 490 000 Kč“ */
export function formatPrice(
  price: number | null | undefined,
  currency = "CZK",
): string | null {
  if (price == null || !Number.isFinite(price)) return null;
  const suffix = currency === "CZK" ? "Kč" : currency;
  return `${czNumber(price)}${NBSP}${suffix}`;
}

/**
 * „172 000 Kč/m²“ — číslo, které si kupující stejně spočítá sám.
 * Ušetří mu práci.
 */
export function formatPricePerSqm(
  price: number | null | undefined,
  area: number | null | undefined,
  currency = "CZK",
): string | null {
  if (price == null || area == null || area <= 0) return null;
  const suffix = currency === "CZK" ? "Kč" : currency;
  return `${czNumber(Math.round(price / area))}${NBSP}${suffix}/m²`;
}

/** „84,2 m²“ */
export function formatArea(area: number | null | undefined): string | null {
  if (area == null || !Number.isFinite(area)) return null;
  return `${czNumber(area, 1)}${NBSP}m²`;
}

/** „6. podlaží“ / „6. podlaží z 8“ */
export function formatFloor(
  floor: number | null | undefined,
  totalFloors?: number | null,
): string | null {
  if (floor == null) return null;
  const base = `${floor}.${NBSP}podlaží`;
  return totalFloors ? `${base} z${NBSP}${totalFloors}` : base;
}

function toDate(value: string | Date): Date {
  return typeof value === "string" ? parseISO(value) : value;
}

/** „25. srpna 2026“ */
export function formatDate(value: string | Date): string {
  return format(toDate(value), "d. MMMM yyyy", { locale: cs });
}

/** „25. 8. 2026“ — do tabulek a atributů */
export function formatDateShort(value: string | Date): string {
  return format(toDate(value), "d. M. yyyy", { locale: cs });
}

/** „před 3 dny“ — do title vždy doplň absolutní datum */
export function formatRelative(value: string | Date): string {
  return formatDistanceToNowStrict(toDate(value), {
    locale: cs,
    addSuffix: true,
  });
}

/** ISO datum pro <time dateTime> a structured data */
export function toIsoDate(value: string | Date): string {
  return format(toDate(value), "yyyy-MM-dd");
}
