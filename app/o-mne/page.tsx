import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CropMarks } from "@/components/ui/CropMarks";
import { Portrait } from "@/components/about/Portrait";
import { Qualities } from "@/components/about/Qualities";
import { SummaryBand } from "@/components/about/SummaryBand";
import { StatsBand } from "@/components/home/StatsBand";
import { ContactSection } from "@/components/layout/ContactSection";
import { profile } from "@/lib/profile";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbSchema, realEstateAgentSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "O mně",
  description:
    "František Kroupa, realitní makléř. Zkušenosti z vedení výroby, obchodu i marketingu — a důraz na detail, který vede k nejlepšímu výsledku.",
  alternates: { canonical: "/o-mne" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={realEstateAgentSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Úvod", path: "/" },
          { name: "O mně", path: "/o-mne" },
        ])}
      />

      <section className="drafting-grid border-b border-line">
        <Container size="wide">
          <div className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
            <div>
              <p className="eyebrow">O mně</p>
              <h1 className="mt-6 text-5xl font-semibold sm:text-7xl sm:leading-[1.02]">
                {site.name}
              </h1>
              <p className="mt-6 max-w-xl font-serif text-2xl leading-snug italic sm:text-3xl">
                {profile.tagline}
              </p>

              <h2 className="mt-12 text-2xl font-semibold sm:text-3xl">
                {profile.strategyTitle}
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
                {profile.strategy}
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="/kontakt" size="lg">
                  Domluvit schůzku
                </Button>
                <Button href="/reference" size="lg" variant="secondary">
                  Reference klientů
                </Button>
              </div>
            </div>

            <CropMarks className="mx-auto w-full max-w-[440px] p-3 sm:p-4">
              <Portrait priority />
            </CropMarks>
          </div>
        </Container>
      </section>

      <StatsBand />

      <Section eyebrow="Co přináším" title="Zkušenosti, které se při prodeji hodí" containerSize="wide">
        <Qualities />
      </Section>

      <SummaryBand />

      <ContactSection tone="default" title="Pojďme se potkat" />
    </>
  );
}
