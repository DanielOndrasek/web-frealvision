import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyFloorPlans } from "@/components/property/PropertyFloorPlans";
import { PropertySpecs } from "@/components/property/PropertySpecs";
import { PropertyMap } from "@/components/property/PropertyMap";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyDescription } from "@/components/property/PropertyDescription";
import { LeadForm } from "@/components/forms/LeadForm";
import { ContactSection } from "@/components/layout/ContactSection";
import {
  getAllListings,
  getListing,
  getRelatedListings,
} from "@/lib/properties/feed";
import { label } from "@/lib/properties/dictionary";
import { stateBadge } from "@/lib/properties/state";
import { formatPrice, formatPricePerSqm, formatArea } from "@/lib/format";
import {
  JsonLd,
  breadcrumbSchema,
  realEstateListingSchema,
} from "@/lib/seo/schema";
import { site } from "@/lib/site";

// Stejně jako feed nabídek — viz lib/properties/feed.ts.
export const revalidate = 300;

export async function generateStaticParams() {
  const listings = await getAllListings();
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListing(slug);
  if (!listing) return { title: "Nabídka nenalezena" };

  const canonical = `/nemovitosti/${listing.slug}`;

  return {
    // Titulek vždy s lokalitou — viz lib/properties/normalize.ts
    title: listing.seoTitle,
    description: listing.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: listing.seoTitle,
      description: listing.metaDescription,
      url: canonical,
      locale: site.locale,
      images: listing.cover ? [{ url: listing.cover.url }] : undefined,
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListing(slug);
  if (!listing) notFound();

  const related =
    listing.state === "sold" ? [] : await getRelatedListings(listing);
  const state = stateBadge(listing);
  const price = listing.priceOnRequest
    ? "Cena na vyžádání"
    : (formatPrice(listing.price, listing.currency) ?? "Cena na vyžádání");
  const perSqm = listing.priceOnRequest
    ? null
    : formatPricePerSqm(listing.price, listing.area, listing.currency);

  return (
    <>
      <JsonLd data={realEstateListingSchema(listing)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Úvod", path: "/" },
          { name: "Nemovitosti", path: "/nemovitosti" },
          { name: listing.title, path: `/nemovitosti/${listing.slug}` },
        ])}
      />

      <div className="py-10 sm:py-14">
        <Container size="wide">
          <nav aria-label="Drobečková navigace" className="text-sm text-ink-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-ink">
                  Úvod
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/nemovitosti" className="hover:text-ink">
                  Nemovitosti
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink">{listing.title}</li>
            </ol>
          </nav>

          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={state.tone}>{state.text}</Badge>
              <Badge tone="neutral">
                {label("ad_type", listing.adType)} ·{" "}
                {label("property_kind", listing.kind)}
                {listing.disposition ? ` · ${listing.disposition}` : ""}
              </Badge>
            </div>

            <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {listing.title}
            </h1>

            {listing.address || listing.locality ? (
              <p className="mt-3 flex items-start gap-1.5 text-lg text-ink-muted">
                <span className="mt-1 shrink-0 text-accent">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                </span>
                {listing.address ?? listing.locality}
              </p>
            ) : null}

            {/*
             * Klíčová čísla jako vodorovný pruh pod titulkem. Předtím
             * stála ve sloupci vpravo se zarovnáním nahoru, takže se
             * u víceřádkového titulku odskočila a visela ve vzduchu.
             */}
            <dl className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-line py-5">
              <div>
                <dt className="sr-only">Cena</dt>
                <dd className="tnum text-3xl font-semibold sm:text-4xl">{price}</dd>
              </div>

              {perSqm ? (
                <div>
                  <dt className="sr-only">Cena za metr čtvereční</dt>
                  <dd className="tnum text-lg text-ink-muted">{perSqm}</dd>
                </div>
              ) : null}

              {listing.area ? (
                <div className="flex items-baseline gap-1.5">
                  <dt className="text-sm text-ink-subtle">Užitná plocha</dt>
                  <dd className="tnum text-lg font-medium">
                    {formatArea(listing.area)}
                  </dd>
                </div>
              ) : null}

              {listing.landArea ? (
                <div className="flex items-baseline gap-1.5">
                  <dt className="text-sm text-ink-subtle">Pozemek</dt>
                  <dd className="tnum text-lg font-medium">
                    {formatArea(listing.landArea)}
                  </dd>
                </div>
              ) : null}
            </dl>
          </header>

          <div className="mt-10">
            <PropertyGallery listing={listing} />
          </div>

          <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_20rem]">
            <div className="flex flex-col gap-14">
              {listing.description ? (
                <section aria-labelledby="popis">
                  <h2 id="popis" className="sr-only">
                    Popis nabídky
                  </h2>
                  <PropertyDescription text={listing.description} />
                </section>
              ) : null}

              {/* Za popisem: kdo dočetl text, chce vidět dispozici. */}
              <PropertyFloorPlans listing={listing} />
              <PropertySpecs listing={listing} />
              <PropertyMap listing={listing} />
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="border border-ink bg-surface p-6">
                {listing.state === "sold" ? (
                  <>
                    <h2 className="text-lg font-semibold">Nabídka je uzavřená</h2>
                    <p className="mt-2 text-sm text-ink-muted">
                      {listing.adType === "pronajem"
                        ? "Tuhle nemovitost už jsem pronajal."
                        : "Tuhle nemovitost už jsem prodal."}{" "}
                      Hledáte něco podobného? Ozvěte se, často mám nabídky
                      ještě před zveřejněním.
                    </p>
                  </>
                ) : listing.state === "reserved" ? (
                  /*
                   * Rezervace se nedotáhne pokaždé. Formulář tu proto
                   * zůstává — jen nesmí předstírat, že je nemovitost volná.
                   */
                  <>
                    <h2 className="text-lg font-semibold">
                      Nemovitost je v rezervaci
                    </h2>
                    <p className="mt-2 text-sm text-ink-muted">
                      Momentálně se na ní pracuje, takže ji už nenabízím.
                      Rezervace ale občas padají — napište si a ozvu se,
                      kdyby se uvolnila. Stejně tak u podobných nabídek.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold">Rezervovat prohlídku</h2>
                    <p className="mt-2 text-sm text-ink-muted">
                      Ozvu se hned, jak to půjde. Nebo rovnou zavolejte a
                      domluvíme termín na místě.
                    </p>
                  </>
                )}

                <div className="mt-5 flex flex-col gap-2">
                  <Button href={site.phoneHref} size="lg">
                    {site.phone}
                  </Button>
                  <Button href={`mailto:${site.email}`} variant="secondary">
                    Napsat e-mail
                  </Button>
                </div>

                {/* U uzavřené nabídky nemá smysl nabízet prohlídku */}
                {listing.state !== "sold" ? (
                  <div className="mt-8 border-t border-line pt-6">
                    {/*
                      * Prohlídku přijme Nemo1 jen u aktivního inzerátu.
                      * U rezervace jde o obecný dotaz — stránku, ze které
                      * přišel, nese `sourceUrl`.
                      */}
                    <LeadForm
                      kind={listing.state === "active" ? "viewing" : "contact"}
                      advertId={listing.state === "active" ? listing.id : undefined}
                      submitLabel={
                        listing.state === "reserved"
                          ? "Dejte mi vědět"
                          : "Rezervovat prohlídku"
                      }
                      messagePlaceholder={
                        listing.state === "reserved"
                          ? "Co hledáte? Ozvu se, kdyby rezervace padla."
                          : "Kdy by se vám hodila prohlídka?"
                      }
                      compact
                    />
                  </div>
                ) : null}

                <div className="mt-6 border-t border-line pt-5 text-sm">
                  <p className="font-semibold">
                    {listing.broker.name ?? site.name}
                  </p>
                  <p className="text-ink-muted">Realitní makléř</p>
                </div>
              </div>
            </aside>
          </div>

          {related.length ? (
            <section aria-labelledby="podobne" className="mt-20">
              <h2
                id="podobne"
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Podobné nabídky
              </h2>
              <p className="mt-2 text-ink-muted">
                Vybrané podle lokality, druhu a cenové hladiny.
              </p>
              <div className="mt-8">
                <PropertyGrid listings={related} />
              </div>
              <div className="mt-10 flex justify-center">
                <Button href="/nemovitosti" size="lg">
                  Zobrazit všechny nabídky
                </Button>
              </div>
            </section>
          ) : null}
        </Container>
      </div>

      {/* Druhý formulář pod inzerátem — kdo dočte až sem, nemusí rolovat zpět */}
      <ContactSection
        title={
          listing.state === "sold"
            ? "Hledáte něco podobného?"
            : "Zaujala vás tahle nemovitost?"
        }
      />
    </>
  );
}
