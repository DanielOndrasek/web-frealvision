import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/home/Hero";
import { StatsBand } from "@/components/home/StatsBand";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Process } from "@/components/home/Process";
import { ValuationCta } from "@/components/home/ValuationCta";
import { ContactSection } from "@/components/layout/ContactSection";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { ReviewList } from "@/components/reviews/ReviewList";
import { getListings } from "@/lib/properties/feed";
import { getClientReviews } from "@/lib/content/load";
import { JsonLd, realEstateAgentSchema } from "@/lib/seo/schema";

// Stejně jako feed nabídek — viz lib/properties/feed.ts.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Realitní makléř — prodej bytů, domů a pozemků",
  description:
    "Prodej, koupě i pronájem nemovitosti s jasným plánem. Odhad ceny zdarma, profesionální prezentace a péče až do předání klíčů.",
  alternates: { canonical: "/" },
};

/** Kolik referencí ukázat na úvodu. Zbytek je na /reference. */
const REVIEWS_ON_HOME = 6;

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
    >
      {children}
      <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

export default async function HomePage() {
  const [listings, reviews] = await Promise.all([getListings(), getClientReviews()]);

  return (
    <>
      <JsonLd data={realEstateAgentSchema()} />

      <Hero />
      <StatsBand />

      <Section
        index="01"
        eyebrow="Nabídka"
        title="Aktuálně nabízím"
        containerSize="wide"
        action={<MoreLink href="/nemovitosti">Celá nabídka</MoreLink>}
      >
        <PropertyGrid listings={listings.slice(0, 6)} />
      </Section>

      <AboutTeaser />

      <Section
        index="02"
        eyebrow="Jak pracuji"
        title="Od první schůzky po předání klíčů"
        containerSize="wide"
      >
        <Process />
      </Section>

      {reviews.length ? (
        <Section
          index="03"
          eyebrow="Reference"
          title="Co říkají klienti"
          tone="subtle"
          containerSize="wide"
          action={
            reviews.length > REVIEWS_ON_HOME ? (
              <MoreLink href="/reference">Všech {reviews.length} referencí</MoreLink>
            ) : undefined
          }
        >
          <ReviewList reviews={reviews.slice(0, REVIEWS_ON_HOME)} />
        </Section>
      ) : null}

      <ValuationCta />
      <ContactSection tone="default" />
    </>
  );
}
