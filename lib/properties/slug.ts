/**
 * Slugy jsou jen [a-z0-9-]. Jinak by se v URL `m²` zakódovalo jako
 * `m%c2%b2`.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // odstranit diakritiku
    .toLowerCase()
    .replace(/²/g, "2")
    .replace(/³/g, "3")
    .replace(/\+/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/g, "");
}

/**
 * Slug nabídky. Musí být stabilní — jakmile je nabídka jednou venku,
 * URL se nesmí změnit, jinak přijdeme o odkazy a pozice.
 *
 * Když titulek neobsahuje lokalitu, doplní se, protože právě podle ní
 * lidé hledají.
 */
export function listingSlug(input: {
  title: string | null;
  city: string | null;
  cityPart: string | null;
}): string {
  const title = input.title?.trim() || "nemovitost";
  const base = slugify(title);

  const locality = [input.cityPart, input.city]
    .filter((v): v is string => Boolean(v))
    .map(slugify)
    .find((v) => v && !base.includes(v));

  return locality ? `${base}-${locality}` : base;
}
