import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Portrait } from "@/components/about/Portrait";
import { profile } from "@/lib/profile";

export function AboutTeaser() {
  return (
    <section className="bg-surface-subtle py-16 sm:py-24">
      <Container size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <Portrait className="mx-auto w-full max-w-[460px]" />

          <div>
            <p className="eyebrow">O mně</p>
            <h2 className="mt-6 text-3xl font-semibold sm:text-5xl sm:leading-[1.08]">
              {profile.aboutTitle}
            </h2>

            <div className="mt-7 flex max-w-xl flex-col gap-5 text-lg leading-relaxed text-ink-muted">
              {profile.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10">
              <Button href="/o-mne" size="lg" variant="secondary">
                Více o mně
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
