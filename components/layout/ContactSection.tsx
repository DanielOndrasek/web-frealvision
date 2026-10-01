import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/forms/LeadForm";
import { ContactLinks } from "./ContactLinks";
import { SocialIcons, hasSocialProfiles } from "./SocialIcons";

/** Kontaktní sekce na spodku stránek. */
export function ContactSection({
  title = "Máte dotaz nebo potřebujete poradit?",
  tone = "subtle",
}: {
  title?: string;
  tone?: "subtle" | "default";
}) {
  return (
    <section
      id="kontakt"
      className={tone === "subtle" ? "bg-surface-subtle" : "bg-surface"}
    >
      <Container size="wide">
        <div className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="eyebrow">Kontakt</p>
            <h2 className="mt-6 text-3xl font-semibold sm:text-5xl sm:leading-[1.08]">
              {title}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
              Napište mi přes formulář a ozvu se co nejdřív. Pokud
              potřebujete odpověď hned, raději zavolejte.
            </p>

            <div className="mt-8">
              <ContactLinks />
            </div>

            {hasSocialProfiles ? (
              <>
                <h3 className="eyebrow mt-10">Sledujte mě</h3>
                <SocialIcons className="mt-4" />
              </>
            ) : null}
          </div>

          <div className="border border-ink bg-surface p-6 sm:p-9">
            <LeadForm kind="contact" submitLabel="Odeslat zprávu" />
          </div>
        </div>
      </Container>
    </section>
  );
}
