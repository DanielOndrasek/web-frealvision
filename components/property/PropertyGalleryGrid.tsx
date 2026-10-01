"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { PropertyLightbox } from "@/components/property/PropertyLightbox";
import type { Photo } from "@/lib/properties/types";

/** Kolik fotek stojí v náhledu. Zbytek je za prohlížečem, ne nedostupný. */
const NAHLED = 9;

/**
 * Skloňování počtu. Čeština má tři tvary a strojové „+2 dalších" nebo
 * „všech 3 fotografií" čte klient jako chybu webu, ne jako detail.
 */
function dalsich(n: number): string {
  return n < 5 ? `+${n} další` : `+${n} dalších`;
}

function vsechnyFotografie(n: number): string {
  if (n < 5) return `Zobrazit všechny fotografie (${n})`;
  return `Zobrazit všech ${n} fotografií`;
}

function Dlazdice({
  photo,
  alt,
  jeVizualizace,
  onOpen,
  className,
  sizes,
  priority = false,
  prekryv,
}: {
  photo: Photo;
  alt: string;
  jeVizualizace: boolean;
  onOpen: () => void;
  className?: string;
  sizes: string;
  priority?: boolean;
  /** Text přes fotku u poslední dlaždice („+12 dalších“). */
  prekryv?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      // Popisek říká, co se stane, ne co je na fotce — alt obrázku nese popis
      // a odečítač obrazovky by jinak přečetl totéž dvakrát.
      aria-label={prekryv ? "Zobrazit všechny fotografie" : `Zobrazit fotografii: ${alt}`}
      className={`group relative cursor-zoom-in overflow-hidden rounded-md bg-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text ${className ?? ""}`}
    >
      <Image
        src={photo.url}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      {prekryv ? (
        <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-base font-semibold text-white">
          {prekryv}
        </span>
      ) : null}
      {jeVizualizace && !prekryv ? (
        <span className="absolute bottom-2 left-2">
          <Badge tone="dark">Vizualizace</Badge>
        </span>
      ) : null}
    </button>
  );
}

export function PropertyGalleryGrid({
  photos,
  alts,
  visualizations,
}: {
  photos: Photo[];
  alts: string[];
  visualizations: number[];
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  const [first, ...rest] = photos;
  if (!first) return null;

  // Pořadí z inzerátu se nikde nepřerovnává — `i + 1` je skutečný index
  // fotky v poli, takže kliknutí na dlaždici otevře přesně tu fotku.
  const male = rest.slice(0, NAHLED - 1);
  // Poslední dlaždice svou fotku zakryje překryvem, takže „dalších" se počítá
  // od ní včetně. Kdyby se počítalo od konce náhledu, slibovalo by o jednu
  // fotku méně, než kolik je za překryvem schovaných.
  const zaPrekryvem = photos.length > NAHLED ? photos.length - (NAHLED - 1) : 0;

  return (
    <section aria-label="Fotogalerie">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Dlazdice
          photo={first}
          alt={alts[0]}
          jeVizualizace={visualizations.includes(0)}
          onOpen={() => setOpenAt(0)}
          priority
          className="col-span-2 aspect-16/10 sm:col-span-4"
          sizes="(max-width: 640px) 100vw, 1200px"
        />
        {male.map((photo, i) => {
          const index = i + 1;
          const posledni = i === male.length - 1 && zaPrekryvem > 0;
          return (
            // Klíč nese index, ne URL. Feed umí poslat tutéž fotku dvakrát
            // a dvě stejné URL by Reactu spadly na duplicitním klíči.
            <Dlazdice
              key={`${index}-${photo.url}`}
              photo={photo}
              alt={alts[index]}
              jeVizualizace={visualizations.includes(index)}
              onOpen={() => setOpenAt(index)}
              className="aspect-4/3"
              sizes="(max-width: 640px) 50vw, 300px"
              prekryv={posledni ? dalsich(zaPrekryvem) : undefined}
            />
          );
        })}
      </div>

      {photos.length > 1 ? (
        <button
          type="button"
          onClick={() => setOpenAt(0)}
          className="mt-3 rounded-md border border-line-strong px-4 py-2 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
        >
          {vsechnyFotografie(photos.length)}
        </button>
      ) : null}

      {openAt !== null ? (
        <PropertyLightbox
          photos={photos}
          alts={alts}
          visualizations={visualizations}
          initialIndex={openAt}
          onClose={() => setOpenAt(null)}
        />
      ) : null}
    </section>
  );
}
