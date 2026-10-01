import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/format";
import { label } from "@/lib/properties/dictionary";
import { stateBadge } from "@/lib/properties/state";
import type { Listing } from "@/lib/properties/types";

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function PropertyCard({
  listing,
  priority = false,
}: {
  listing: Listing;
  priority?: boolean;
}) {
  const state = stateBadge(listing);
  const price = listing.priceOnRequest
    ? "Cena na vyžádání"
    : (formatPrice(listing.price, listing.currency) ?? "Cena na vyžádání");

  const meta = [
    label("ad_type", listing.adType),
    label("property_kind", listing.kind),
    listing.disposition,
  ].filter(Boolean);

  return (
    <article className="group relative flex w-full flex-col">
      <div className="relative aspect-4/3 overflow-hidden rounded-md bg-surface-subtle">
        {listing.cover ? (
          <Image
            src={listing.cover.url}
            /* Alt nikdy není název souboru, vždy popis */
            alt={
              listing.cover.description?.trim() ||
              `${listing.title}${listing.locality ? `, ${listing.locality}` : ""}`
            }
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          // Zástupný obrázek, ať jsou všechny karty ve výpisu stejně vysoké
          <div className="grid h-full place-items-center text-ink-subtle">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M3 10.5 12 3l9 7.5V21H3z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <Badge tone={state.tone}>{state.text}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
          {meta.join(" · ")}
        </p>

        <h3 className="mt-2 text-lg leading-snug font-semibold text-balance">
          <Link href={`/nemovitosti/${listing.slug}`} className="after:absolute after:inset-0">
            {listing.title}
          </Link>
        </h3>

        {listing.address || listing.locality ? (
          <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-muted">
            <span className="mt-0.5 shrink-0 text-accent">
              <PinIcon />
            </span>
            <span>{listing.address ?? listing.locality}</span>
          </p>
        ) : null}

        {/*
         * Cena a odkaz na jednom řádku. Plné tlačítko tu soupeřilo s cenou
         * a bylo nejnápadnějším prvkem karty, přestože klikací je celá.
         * Kliknutí obsluhuje odkaz v titulku roztažený přes kartu — tohle
         * je jen vizuální vodítko, proto span, ne další odkaz.
         */}
        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-4 border-t border-line pt-3.5">
            <p className="tnum font-display text-xl font-semibold text-accent">{price}</p>

            <span
              aria-hidden
              className="inline-flex shrink-0 items-center gap-1.5 pb-0.5 text-sm font-medium text-accent-text"
            >
              Detail
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-150 group-hover:translate-x-1"
              >
                <path
                  d="M5 12h13m0 0-5-5m5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
