import Image from "next/image";
import type { Listing } from "@/lib/properties/types";

const HAS_MAPY = Boolean(process.env.MAPY_API_KEY);

/**
 * Mapa u nabídky, když feed pošle souřadnice.
 *
 * Používá Mapy.com — stejný zdroj, na který je napojené Nemo1. Dokud není
 * v prostředí `MAPY_API_KEY`, spadne to zpátky na OpenStreetMap, aby
 * lokalita nezmizela úplně.
 */
export function PropertyMap({ listing }: { listing: Listing }) {
  if (!listing.coords) return null;

  const { lat, lng } = listing.coords;
  const detailUrl = `https://mapy.com/zakladni?x=${lng}&y=${lat}&z=17&source=coor&id=${lng}%2C${lat}`;

  return (
    <section aria-labelledby="mapa">
      <h2 id="mapa" className="text-2xl font-semibold tracking-tight">
        Lokalita
      </h2>
      {listing.address ? (
        <p className="mt-2 text-ink-muted">{listing.address}</p>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-lg border border-line">
        {HAS_MAPY ? (
          <a
            href={detailUrl}
            target="_blank"
            rel="noopener"
            className="relative block aspect-16/9"
          >
            <Image
              src={`/api/mapa?lat=${lat}&lon=${lng}&zoom=16`}
              alt={`Mapa okolí — ${listing.locality ?? listing.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
              unoptimized
            />
            {/* Zobrazení loga je podmínkou používání Mapy.com */}
            <span className="absolute bottom-2 left-2 rounded-sm bg-white/90 px-2 py-1 text-[11px] text-ink-muted">
              © Seznam.cz a.s. a další
            </span>
          </a>
        ) : (
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.006}%2C${lat - 0.003}%2C${lng + 0.006}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`}
            title={`Mapa — ${listing.locality ?? listing.title}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="aspect-16/9 w-full"
          />
        )}
      </div>

      <p className="mt-3 text-sm">
        <a
          href={detailUrl}
          target="_blank"
          rel="noopener"
          className="text-accent-text underline underline-offset-4"
        >
          Otevřít na Mapy.com
        </a>
      </p>
    </section>
  );
}
