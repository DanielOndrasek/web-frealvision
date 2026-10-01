import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Dimension } from "@/components/ui/Dimension";

/** Výzva k odhadu na pruhu v barvě značky — hlavní konverze webu, nejjasnější místo. */
export function ValuationCta() {
  return (
    <section className="bg-brand text-ink">
      <Container size="wide">
        <div className="grid items-end gap-10 py-16 sm:py-24 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow text-ink">Odhad zdarma</p>
            <h2 className="mt-6 text-3xl font-semibold sm:text-6xl sm:leading-[1.05]">
              Kolik má vaše nemovitost{" "}
              <em className="font-serif font-normal tracking-normal italic">skutečnou</em>{" "}
              hodnotu?
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-brand-ink-muted">
              Cenová mapa ukáže jen rozpětí. Já se podívám na konkrétní
              nemovitost, srovnatelné prodeje a aktuální poptávku.
            </p>
            <div className="mt-8">
              <Button href="/odhad-zdarma" size="lg" variant="solid">
                Chci odhad zdarma
              </Button>
            </div>
          </div>
        </div>
        <Dimension className="pb-10 [&>span]:bg-ink/40" />
      </Container>
    </section>
  );
}
