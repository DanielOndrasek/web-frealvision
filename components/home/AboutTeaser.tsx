import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CropMarks } from "@/components/ui/CropMarks";
import { ElevationDrawing } from "./ElevationDrawing";
import { profile } from "@/lib/profile";

/**
 * „Strategie místo nahodilosti“ s výkresem domu — technický pohled na
 * nemovitost je jedna z věcí, kterými se František představuje.
 */
export function AboutTeaser() {
  return (
    <section className="bg-surface-subtle py-16 sm:py-24">
      <Container size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div className="lg:order-2">
            <p className="eyebrow">O mně</p>
            <h2 className="mt-6 text-3xl font-semibold sm:text-5xl sm:leading-[1.08]">
              {profile.strategyTitle}
            </h2>

            <div className="mt-7 flex max-w-xl flex-col gap-5 text-lg leading-relaxed text-ink-muted">
              <p>{profile.strategy}</p>
              <p>{profile.summary}</p>
            </div>

            <div className="mt-10">
              <Button href="/o-mne" size="lg" variant="secondary">
                Více o mně
              </Button>
            </div>
          </div>

          <CropMarks className="hidden bg-surface p-8 sm:block sm:p-12 lg:order-1">
            <ElevationDrawing className="h-auto w-full text-ink" />
          </CropMarks>
        </div>
      </Container>
    </section>
  );
}
