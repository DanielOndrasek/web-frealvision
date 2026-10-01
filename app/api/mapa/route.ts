/**
 * Statická mapa z Mapy.com.
 *
 * Jde přes vlastní endpoint, aby API klíč zůstal na serveru — kdyby byl
 * přímo v adrese obrázku, přečte ho každý, kdo si zobrazí zdroj stránky,
 * a může ho vyčerpat.
 */
const API_KEY = process.env.MAPY_API_KEY;

export const revalidate = 86400;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export async function GET(request: Request) {
  if (!API_KEY) {
    return new Response("Mapy.com nejsou nakonfigurované.", { status: 503 });
  }

  const params = new URL(request.url).searchParams;
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return new Response("Chybí souřadnice.", { status: 400 });
  }

  // Mapy.com nepřijmou rozměr přes 1024 px a vrátí chybu, ne menší obrázek.
  // Ostrost dorovnává scale=2, takže výsledek je fakticky 2048 px široký.
  const zoom = clamp(Number(params.get("zoom")) || 16, 1, 19);
  const width = clamp(Number(params.get("w")) || 1024, 100, 1024);
  const height = clamp(Number(params.get("h")) || 576, 100, 1024);

  const upstream = new URL("https://api.mapy.com/v1/static/map");
  upstream.searchParams.set("mapset", "basic");
  upstream.searchParams.set("lon", String(lon));
  upstream.searchParams.set("lat", String(lat));
  upstream.searchParams.set("zoom", String(zoom));
  upstream.searchParams.set("width", String(width));
  upstream.searchParams.set("height", String(height));
  upstream.searchParams.set("scale", "2");
  upstream.searchParams.set("markers", `color:red;size:normal;${lon},${lat}`);
  upstream.searchParams.set("apikey", API_KEY);

  const res = await fetch(upstream, { next: { revalidate } });

  if (!res.ok) {
    // Důvod odmítnutí patří do logu, jinak se chyba hledá naslepo
    const reason = await res.text().catch(() => "");
    console.error(
      `[mapa] Mapy.com odpovědělo ${res.status}: ${reason.slice(0, 200)}`,
    );
    return new Response("Mapu se nepodařilo načíst.", { status: 502 });
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "image/png",
      // Mapa u nabídky se nemění, ať se netahá pořád dokola
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
    },
  });
}
