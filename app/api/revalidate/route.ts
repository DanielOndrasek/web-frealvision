import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * „Nabídky se změnily, zahoď cache“ — pro ruční nebo budoucí automatické
 * volání.
 *
 * Nemo1 web dnes samo neupozorňuje (integrace je jen pull), takže se feed
 * přenačítá po pěti minutách (viz lib/properties/feed.ts). Tímhle se dá
 * změna dostat na web hned, třeba po úpravě inzerátu před prohlídkou.
 *
 * Autentizace: sdílené tajemství v hlavičce Authorization. Nikdy v URL —
 * skončilo by v logu CDN. Endpoint je záměrně jen POST, aby ho neodpálil
 * prefetch ani crawler.
 */

export const dynamic = "force-dynamic";

const SECRET = process.env.NEMO1_REVALIDATE_SECRET;

/**
 * Porovnání v konstantním čase. Obě strany se nejdřív zahašují, aby
 * timingSafeEqual dostal stejně dlouhé vstupy a neprozradila se ani délka.
 */
function matches(provided: string, expected: string): boolean {
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function authorized(request: Request): boolean {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return false;
  return matches(token, SECRET!);
}

export async function POST(request: Request) {
  if (!SECRET) {
    console.error("[revalidate] chybí NEMO1_REVALIDATE_SECRET");
    return Response.json(
      { error: "Revalidace není nastavená." },
      { status: 503 },
    );
  }

  if (!authorized(request)) {
    return Response.json({ error: "Neautorizováno." }, { status: 401 });
  }

  /**
   * Tag shodí uloženou odpověď feedu, cesty pak stránky, které z něj čerpají.
   *
   * `expire: 0` znamená „od téhle chvíle se stará kopie nesmí použít“ —
   * bez toho by první návštěvník ještě dostal starý seznam a obnova by se
   * spustila až na pozadí. Kvůli tomu tenhle endpoint existuje.
   */
  revalidateTag("adverts", { expire: 0 });
  revalidatePath("/");
  revalidatePath("/nemovitosti");
  revalidatePath("/nemovitosti/[slug]", "page");
  revalidatePath("/sitemap.xml");

  return Response.json({ ok: true, revalidated_at: new Date().toISOString() });
}
