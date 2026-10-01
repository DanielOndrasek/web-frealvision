import { formatPrice, formatPricePerSqm } from "@/lib/format";
import type { Listing } from "@/lib/properties/types";

/**
 * Parametry v mřížce, ne jako odrážkový seznam. Lidé je skenují očima,
 * nečtou je po řádcích.
 */
export function PropertySpecs({ listing }: { listing: Listing }) {
  const price = listing.priceOnRequest
    ? "Cena na vyžádání"
    : formatPrice(listing.price, listing.currency);
  const perSqm = listing.priceOnRequest
    ? null
    : formatPricePerSqm(listing.price, listing.area, listing.currency);

  if (!listing.specs.length && !price) return null;

  return (
    <section aria-labelledby="parametry">
      <h2 id="parametry" className="text-2xl font-semibold tracking-tight">
        Technické parametry
      </h2>

      <dl className="mt-6 grid gap-x-8 gap-y-0 sm:grid-cols-2">
        {/* Cena se opakuje i tady — kdo dočte inzerát až sem, nemusí
            rolovat zpátky k hlavičce */}
        {price ? (
          <div className="flex justify-between gap-4 border-b border-line py-3 sm:col-span-2">
            <dt className="font-medium">Cena</dt>
            <dd className="tnum text-right text-lg font-semibold">
              {price}
              {perSqm ? (
                <span className="block text-sm font-normal text-ink-muted">
                  {perSqm}
                </span>
              ) : null}
            </dd>
          </div>
        ) : null}

        {listing.specs.map((spec) => (
          <div
            key={spec.label}
            className="flex justify-between gap-4 border-b border-line py-3 text-sm"
          >
            <dt className="text-ink-muted">{spec.label}</dt>
            <dd className="tnum text-right font-medium">{spec.value}</dd>
          </div>
        ))}
      </dl>

      {listing.features.length ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {listing.features.map((feature) => (
            <li
              key={feature}
              className="border border-line px-3 py-1 text-sm text-ink-muted"
            >
              {feature}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
