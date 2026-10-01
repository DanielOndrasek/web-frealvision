import { PropertyGalleryGrid } from "@/components/property/PropertyGalleryGrid";
import type { Listing, Photo } from "@/lib/properties/types";

/**
 * AI vizualizace se musí poznat od fotky. U nabídky za desítky milionů je
 * nerozlišený render riziko důvěryhodnosti.
 */
export function isVisualization(photo: Photo): boolean {
  const haystack = `${photo.category ?? ""} ${photo.description ?? ""} ${photo.url}`.toLowerCase();
  return /vizualizace|render|chatgpt|ai[-_ ]image|_ai\./.test(haystack);
}

function altFor(photo: Photo, listing: Listing, index: number): string {
  const described = photo.description?.trim();
  // Nikdy nepoužij název souboru — alt „IMG_2242“ nikomu nic neřekne.
  if (described && !/^(img|dsc|photo|image|group)[-_ ]?\d/i.test(described)) {
    return described;
  }
  const place = listing.locality ? `, ${listing.locality}` : "";
  return `${listing.title}${place} — fotografie ${index + 1}`;
}

/**
 * Fotogalerie detailu nabídky.
 *
 * Zůstává serverová a klientovi předává jen to, co mřížka a prohlížeč
 * potřebují. Kdyby se celá překlopila na `"use client"`, letěl by do RSC
 * payloadu celý `listing` včetně `raw`, tedy surový inzerát z feedu.
 *
 * Alt texty se počítají tady, ne v prohlížeči: musí být v HTML, které vidí
 * vyhledávač, a zároveň v prohlížeči fotek, ať je popis fotky na obou
 * místech stejný.
 */
export function PropertyGallery({ listing }: { listing: Listing }) {
  const photos = listing.photos;
  if (photos.length === 0) return null;

  return (
    <PropertyGalleryGrid
      photos={photos}
      alts={photos.map((photo, i) => altFor(photo, listing, i))}
      visualizations={photos.flatMap((photo, i) => (isVisualization(photo) ? [i] : []))}
    />
  );
}
