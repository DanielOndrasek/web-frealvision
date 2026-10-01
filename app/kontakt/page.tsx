import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactSection } from "@/components/layout/ContactSection";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { JsonLd, realEstateAgentSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Zavolejte nebo napište. Na telefonu jsem hned, na zprávy z formuláře odpovídám co nejdřív.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  const company = [
    site.company,
    site.legal.ico ? `IČO ${site.legal.ico}` : null,
    site.legal.address,
  ].filter(Boolean);

  return (
    <>
      <JsonLd data={realEstateAgentSchema()} />

      <PageHeader
        eyebrow="Kontakt"
        title="Ozvěte se"
        lead="Prodáváte, kupujete, nebo jen potřebujete poradit? Zavolejte, napište, nebo vyplňte formulář."
      />

      <ContactSection tone="default" title="Napište mi" />

      <section className="border-t border-line">
        <Container size="wide">
          <dl className="grid gap-8 py-12 text-sm sm:grid-cols-3">
            <div>
              <dt className="eyebrow">Fakturační údaje</dt>
              <dd className="mt-3 leading-relaxed text-ink-muted">
                {company.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </Container>
      </section>
    </>
  );
}
