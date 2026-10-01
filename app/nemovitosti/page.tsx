import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import {
  PropertyFilters,
  applyFilters,
  type FilterValues,
} from "@/components/property/PropertyFilters";
import { getAllListings } from "@/lib/properties/feed";

export const metadata: Metadata = {
  title: "Nabídka nemovitostí",
  description:
    "Aktuální nabídka bytů, domů a pozemků k prodeji i pronájmu. Ověřené nabídky s kompletními podklady a osobním přístupem makléře.",
  alternates: { canonical: "/nemovitosti" },
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const read = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : undefined;

  const values: FilterValues = {
    typ: read("typ"),
    druh: read("druh"),
    lokalita: read("lokalita"),
    cena: read("cena"),
    stav: read("stav"),
  };

  const all = await getAllListings();
  const listings = applyFilters(all, values);

  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <header className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Aktuální nabídka
          </h1>
          <p className="mt-4 text-lg text-ink-muted">
            Byty, domy a pozemky, které prodávám nebo jsem prodal. Filtrem
            stavu si vyberete, co chcete vidět.
          </p>
        </header>

        <div className="mt-10">
          <PropertyFilters values={values} listings={all} />
        </div>

        <p className="mt-6 text-sm text-ink-muted" aria-live="polite">
          {listings.length === all.length
            ? `${all.length} nabídek`
            : `${listings.length} z ${all.length} nabídek`}
        </p>

        <div className="mt-6">
          {/* Neviditelný nadpis drží pořadí h1 → h2 → h3 (nadpisy karet) */}
          <h2 className="sr-only">Nabídka nemovitostí</h2>
          <PropertyGrid
            listings={listings}
            emptyTitle="Žádná nabídka neodpovídá filtru"
            emptyAction={
              <Button href="/nemovitosti" variant="secondary">
                Zobrazit všechny nabídky
              </Button>
            }
          />
        </div>
      </Container>
    </div>
  );
}
