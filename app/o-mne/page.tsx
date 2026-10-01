import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Portrait } from "@/components/about/Portrait";
import { StatsBand } from "@/components/home/StatsBand";
import { Process } from "@/components/home/Process";
import { ContactSection } from "@/components/layout/ContactSection";
import { profile } from "@/lib/profile";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbSchema, realEstateAgentSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "O mně",
  description:
    "František Kroupa, realitní makléř. Jak pracuji, co pro vás udělám a proč na jasném plánu záleží víc než na slibech.",
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
          <div className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div>
              <p className="eyebrow">O mně</p>
              <h1 className="mt-6 text-5xl font-semibold sm:text-7xl sm:leading-[1.02]">
                {site.name}
              </h1>
              <p className="mt-4 text-sm font-semibold tracking-[0.16em] text-ink-subtle uppercase">
                {site.tagline} · {site.company}
              </p>

              <h2 className="mt-12 text-2xl font-semibold sm:text-3xl">
                {profile.aboutTitle}
              </h2>
              <div className="mt-6 flex max-w-xl flex-col gap-5 text-lg leading-relaxed text-ink-muted">
                {profile.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="/kontakt" size="lg">
                  Domluvit schůzku
                </Button>
                <Button href="/reference" size="lg" variant="secondary">
                  Reference klientů
                </Button>
              </div>
            </div>

            <Portrait priority className="mx-auto w-full max-w-[460px]" />
          </div>
        </Container>
      </section>

      <StatsBand />

      <Section
        eyebrow="Jak pracuji"
        title="Od první schůzky po předání klíčů"
        containerSize="wide"
      >
        <Process />
      </Section>

      <ContactSection title="Pojďme se potkat" />
    </>
  );
}
