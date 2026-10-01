import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CropMarks } from "@/components/ui/CropMarks";
import { Portrait } from "@/components/about/Portrait";
import { site } from "@/lib/site";
import { profile } from "@/lib/profile";

/**
 * Úvod: velká typografie na rýsovací mřížce a vedle ní barevný portrét
 * v ořezových značkách — jediná barva v jinak černobílém úvodu.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="drafting-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />

      <Container size="wide">
        <div className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div>
            <p className="eyebrow">
              {site.name} · {site.tagline}
            </p>
            <h1 className="mt-7 text-[2.75rem] leading-[1.02] font-semibold sm:text-7xl">
              {profile.headline}{" "}
              <em className="highlight font-serif font-normal tracking-normal italic">
                {profile.headlineAccent}
              </em>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">
              {profile.lead}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/nemovitosti" size="lg">
                Aktuální nabídka
              </Button>
              <Button href="/odhad-zdarma" size="lg" variant="secondary">
                Odhad zdarma
              </Button>
            </div>
          </div>

          {/* Žlutá plocha odsazená za portrétem — barva, která úvod rozjasní */}
          <div className="relative mx-auto w-full max-w-[440px]">
            <div aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 bg-sun sm:translate-x-6 sm:translate-y-6" />
            <CropMarks className="relative bg-surface p-3 sm:p-4">
              <Portrait priority />
            </CropMarks>
          </div>
        </div>
      </Container>
    </section>
  );
}
