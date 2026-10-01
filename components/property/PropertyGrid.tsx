import { PropertyCard } from "./PropertyCard";
import type { Listing } from "@/lib/properties/types";

export function PropertyGrid({
  listings,
  emptyTitle = "Zatím tu není žádná nabídka",
  emptyAction,
}: {
  listings: Listing[];
  emptyTitle?: string;
  emptyAction?: React.ReactNode;
}) {
  if (!listings.length) {
    return (
      <div className="rounded-lg border border-dashed border-line-strong px-6 py-16 text-center">
        <svg
          className="mx-auto text-ink-subtle"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M3 10.5 12 3l9 7.5V21H3z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <p className="mt-4 font-medium">{emptyTitle}</p>
        <p className="mt-1 text-sm text-ink-muted">
          Nové nabídky přidávám průběžně. Ozvěte se a dám vědět jako prvním.
        </p>
        {emptyAction ? <div className="mt-6">{emptyAction}</div> : null}
      </div>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing, i) => (
        <li key={listing.id} className="flex">
          <PropertyCard listing={listing} priority={i < 3} />
        </li>
      ))}
    </ul>
  );
}
