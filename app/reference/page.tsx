import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatsBand } from "@/components/home/StatsBand";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ContactSection } from "@/components/layout/ContactSection";
import { getClientReviews } from "@/lib/content/load";
import { JsonLd, breadcrumbSchema } from "@/lib/seo/schema";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Reference klientů",
  description:
    "Co o spolupráci říkají klienti, kterým jsem pomohl prodat nebo koupit nemovitost.",
  alternates: { canonical: "/reference" },
};

/*
 * Bez AggregateRating ve structured datech: hodnocení na vlastním webu
 * Google považuje za „self-serving“ a hvězdičky z nich neukáže. Reference
 * jsou tu pro lidi, ne pro výsledky vyhledávání.
 */
export default async function ReferencesPage() {
  const reviews = await getClientReviews();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Úvod", path: "/" },
          { name: "Reference", path: "/reference" },
        ])}
      />

      <PageHeader
        eyebrow="Reference"
        title="Co říkají klienti"
        lead="Zkušenosti lidí, se kterými jsem prodával a kupoval nemovitosti."
      />

      <StatsBand />

      <section className="bg-surface-subtle py-16 sm:py-24">
        <Container size="wide">
          {reviews.length ? (
            <>
              <ReviewList reviews={reviews} />
              <p className="mt-4 text-sm text-ink-subtle">{profile.reviewsNote}</p>
            </>
          ) : (
            <p className="border border-dashed border-line-strong px-6 py-16 text-center text-ink-muted">
              Reference právě doplňujeme.
            </p>
          )}
        </Container>
      </section>

      <ContactSection tone="default" title="Chcete zažít totéž?" />
    </>
  );
}
