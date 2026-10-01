/**
 * Tvar a kontrola obsahu v `content/*.json` — recenzí a statistik.
 *
 * Soubory píše člověk, takže je to neověřený vstup: překlep v klíči by
 * jinak tiše vyrobil prázdnou kartu. Modul je bez importů, aby ho mohl
 * použít i `scripts/check-content.ts` spouštěný přímo v Node.
 */

/** Reference klienta. Převzaté z profilu makléře, nikdy vymyšlené. */
export interface ClientReview {
  id: string;
  author: string;
  text: string;
  /** Čeho se spolupráce týkala — „Prodej bytu 3+kk, Praha 4“. */
  context: string | null;
  /** 1–5, jen když ho zdroj uvádí. */
  rating: number | null;
  /** ISO datum nebo jen rok a měsíc („2025-03“), když ho zdroj uvádí. */
  date: string | null;
}

export interface Stat {
  /** Číslo tak, jak ho chceme ukázat — „120+“, „98 %“. Text, ne number. */
  value: string;
  label: string;
}

export interface StatsFile {
  /** Odkud čísla jsou. Ukazuje se pod nimi drobným písmem. */
  note: string | null;
  items: Stat[];
}

type Result<T> = { value: T; errors: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function parseReviews(raw: unknown): Result<ClientReview[]> {
  const errors: string[] = [];
  if (!Array.isArray(raw)) {
    return { value: [], errors: ["recenze.json: čekám pole recenzí"] };
  }

  const seen = new Set<string>();
  const value: ClientReview[] = [];

  raw.forEach((item, i) => {
    const where = `recenze.json[${i}]`;
    if (!isRecord(item)) {
      errors.push(`${where}: není objekt`);
      return;
    }

    const id = optionalString(item.id);
    const author = optionalString(item.author);
    const text = optionalString(item.text);
    const validId = Boolean(id && /^[a-z0-9-]+$/.test(id));
    if (!validId) errors.push(`${where}: id musí být [a-z0-9-]`);
    const duplicate = Boolean(id && seen.has(id));
    if (duplicate) errors.push(`${where}: id „${id}“ už je použité`);
    if (!author) errors.push(`${where}: chybí author`);
    if (!text) errors.push(`${where}: chybí text`);

    const rating = item.rating ?? null;
    const validRating =
      rating === null ||
      (typeof rating === "number" && Number.isInteger(rating) && rating >= 1 && rating <= 5);
    if (!validRating) errors.push(`${where}: rating je 1–5 nebo null`);

    const date = optionalString(item.date);
    if (date && !/^\d{4}-\d{2}(-\d{2})?$/.test(date)) {
      errors.push(`${where}: date je RRRR-MM nebo RRRR-MM-DD`);
    }

    if (!id || !validId || duplicate || !author || !text || !validRating) return;
    seen.add(id);
    value.push({
      id,
      author,
      text,
      context: optionalString(item.context),
      rating: typeof rating === "number" ? rating : null,
      date,
    });
  });

  return { value, errors };
}

export function parseStats(raw: unknown): Result<StatsFile> {
  const empty: StatsFile = { note: null, items: [] };
  if (!isRecord(raw) || !Array.isArray(raw.items)) {
    return { value: empty, errors: ["statistiky.json: čekám { note, items: [] }"] };
  }

  const errors: string[] = [];
  const items: Stat[] = [];
  raw.items.forEach((item, i) => {
    const value = isRecord(item) ? optionalString(item.value) : null;
    const label = isRecord(item) ? optionalString(item.label) : null;
    if (!value || !label) {
      errors.push(`statistiky.json items[${i}]: chybí value nebo label`);
      return;
    }
    items.push({ value, label });
  });

  return { value: { note: optionalString(raw.note), items }, errors };
}
