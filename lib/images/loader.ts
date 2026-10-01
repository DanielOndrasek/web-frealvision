/**
 * Vlastní loader pro `next/image`.
 *
 * Proč nestačí ten vestavěný: optimalizace obrázků na Vercelu má měsíční
 * limit a po jeho vyčerpání vrací `/_next/image` na každý nový rozměr
 * `402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`. Fotka se pak nenačte
 * vůbec — zůstane jen alt text. Ověřeno 20. 9. 2026 na ostrém webu.
 *
 * Fotky nabídek proto zmenšuje Supabase Storage, kde stejně leží:
 * `/object/public/` jen vydá originál, `/render/image/public/` ho přepočítá
 * na zadanou šířku. Z fotky za 615 kB je tak 38 kB — a Vercel do toho
 * vůbec nevstupuje.
 *
 * Obrázky v `public/` (portrét, logo) se vracejí beze změny.
 * Servíruje je CDN Vercelu jako statické soubory, průměr je 204 kB
 * a žádný limit se na ně nevztahuje.
 */
const SUPABASE_OBJECT = "/storage/v1/object/public/";
const SUPABASE_RENDER = "/storage/v1/render/image/public/";

/** Supabase přijímá kvalitu 20–100, `next/image` posílá výchozích 75. */
const DEFAULT_QUALITY = 75;

/**
 * Supabase odmítne šířku nad 2500 px (400), `next/image` ale na velkých
 * displejích žádá až 3840. Větší fotku stejně nemáme.
 */
const MAX_WIDTH = 2500;

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.includes(SUPABASE_OBJECT)) return src;

  const rendered = src.replace(SUPABASE_OBJECT, SUPABASE_RENDER);
  const q = Math.min(100, Math.max(20, quality ?? DEFAULT_QUALITY));

  const w = Math.min(width, MAX_WIDTH);

  /*
   * `resize=contain` je nutné. Výchozí `cover` při zadané jen šířce nechá
   * výšku originálu a z fotky vyřízne úzký vysoký pruh ze středu — karta
   * ho pak ořízne ještě jednou na 16:10 a zbude přiblížený detail
   * (zjištěno 25. 9. 2026 na webu, ze kterého tenhle vychází). `contain` jen zmenší, poměr stran
   * zůstane a ořez dělá až `object-cover` v komponentě.
   */
  return `${rendered}?width=${w}&resize=contain&quality=${q}`;
}
