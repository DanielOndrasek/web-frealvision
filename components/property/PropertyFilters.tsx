import { Button } from "@/components/ui/Button";
import type { Listing } from "@/lib/properties/types";

export interface FilterValues {
  druh?: string;
  lokalita?: string;
  cena?: string;
  stav?: string;
}

/** Stavy tak, jak jim rozumí návštěvník — ne jak se jmenují v datech. */
export const STATE_FILTER: Record<string, Listing["state"]> = {
  aktivni: "active",
  rezervace: "reserved",
  ukonceno: "sold",
};

const fieldClass =
  "h-10 w-full rounded-sm border border-line bg-surface px-3 text-sm text-ink " +
  "focus:border-accent focus:ring-2 focus:ring-accent-subtle focus:outline-none";

/**
 * Filtry jsou obyčejný GET formulář. Stav je v URL, takže se dá sdílet,
 * funguje bez JavaScriptu a stránka zůstává statická.
 */
export function PropertyFilters({
  values,
  listings,
}: {
  values: FilterValues;
  listings: Listing[];
}) {
  const cities = [...new Set(listings.map((l) => l.city).filter(Boolean))].sort(
    (a, b) => a!.localeCompare(b!, "cs"),
  ) as string[];

  const hasFilters = Object.values(values).some(Boolean);

  return (
    <form
      method="get"
      className="grid gap-3 rounded-lg border border-line bg-surface-subtle p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(4,1fr)_auto]"
    >
      <div>
        <label htmlFor="stav" className="sr-only">
          Stav nabídky
        </label>
        <select id="stav" name="stav" defaultValue={values.stav ?? ""} className={fieldClass}>
          <option value="">Všechny stavy</option>
          <option value="aktivni">Aktivní</option>
          <option value="rezervace">Rezervace</option>
          <option value="ukonceno">Ukončeno</option>
        </select>
      </div>

      <div>
        <label htmlFor="druh" className="sr-only">
          Druh nemovitosti
        </label>
        <select id="druh" name="druh" defaultValue={values.druh ?? ""} className={fieldClass}>
          <option value="">Všechny druhy</option>
          <option value="byt">Byt</option>
          <option value="dum">Dům</option>
          <option value="pozemek">Pozemek</option>
          <option value="komercni">Komerční</option>
        </select>
      </div>

      <div>
        <label htmlFor="lokalita" className="sr-only">
          Lokalita
        </label>
        <select
          id="lokalita"
          name="lokalita"
          defaultValue={values.lokalita ?? ""}
          className={fieldClass}
        >
          <option value="">Všechny lokality</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cena" className="sr-only">
          Cena do
        </label>
        <select id="cena" name="cena" defaultValue={values.cena ?? ""} className={fieldClass}>
          <option value="">Cena bez omezení</option>
          <option value="3000000">do 3 mil. Kč</option>
          <option value="5000000">do 5 mil. Kč</option>
          <option value="8000000">do 8 mil. Kč</option>
          <option value="12000000">do 12 mil. Kč</option>
          <option value="20000000">do 20 mil. Kč</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="submit">Filtrovat</Button>
        {hasFilters ? (
          <Button href="/nemovitosti" variant="secondary">
            Zrušit
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export function applyFilters(listings: Listing[], values: FilterValues): Listing[] {
  const maxPrice = values.cena ? Number(values.cena) : null;

  const state = values.stav ? STATE_FILTER[values.stav] : null;

  return listings.filter((l) => {
    if (state && l.state !== state) return false;
    if (values.druh && l.kind !== values.druh) return false;
    if (values.lokalita && l.city !== values.lokalita) return false;
    if (maxPrice && Number.isFinite(maxPrice)) {
      if (l.price == null || l.price > maxPrice) return false;
    }
    return true;
  });
}
