import { NextResponse, type NextRequest } from "next/server";
import { site } from "@/lib/site";

/**
 * Náhledové adresy Vercelu (`*.vercel.app`) servírují kompletní kopii
 * webu — bez tohohle by je Google mohl zaindexovat jako duplicitu
 * ostré domény.
 *
 * Proto všechno, co neběží na adrese z `NEXT_PUBLIC_SITE_URL`, dostane
 * noindex. Dokud doména není nastavená, platí localhost a noindex má
 * celý nasazený web — do vyhledávání se tak nedostane rozpracovaný.
 */
const PRODUCTION_HOST = new URL(site.url).host;

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const host = request.headers.get("host") ?? "";

  if (host !== PRODUCTION_HOST) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  // Statická aktiva indexovat nejdou, tak je nemá smysl obcházet
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
