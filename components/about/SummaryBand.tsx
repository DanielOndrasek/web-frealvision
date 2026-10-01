import { Container } from "@/components/ui/Container";
import { Dimension } from "@/components/ui/Dimension";
import { profile } from "@/lib/profile";

/** Závěrečné shrnutí na světlém odstínu barvy značky — jedna věta velkým písmem. */
export function SummaryBand() {
  return (
    <section className="bg-brand-soft text-ink">
      <Container size="wide">
        <div className="py-16 sm:py-24">
          <p className="eyebrow">{profile.summaryTitle}</p>
          <p className="mt-8 max-w-5xl font-display text-2xl leading-snug font-medium tracking-[-0.02em] text-balance sm:text-4xl">
            {profile.summary}
          </p>
        </div>
        <Dimension className="pb-10" />
      </Container>
    </section>
  );
}
