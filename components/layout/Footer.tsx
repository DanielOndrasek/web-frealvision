import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "./Logo";
import { ContactLinks } from "./ContactLinks";
import { SocialIcons } from "./SocialIcons";

/**
 * Černá patička s velkou slovní značkou přes celou šířku — nejvýraznější
 * použití loga na webu, nahoře v hlavičce je logo záměrně malé.
 */
export function Footer() {
  const legal = [
    site.company,
    site.legal.ico ? `IČO ${site.legal.ico}` : null,
    site.legal.address,
  ].filter(Boolean);

  return (
    <footer className="border-t-4 border-sun bg-surface-footer text-ink-inverse">
      <Container size="wide">
        <div className="grid gap-12 pt-16 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl font-semibold tracking-[-0.02em]">
              {site.name}
            </p>
            <p className="mt-1 text-sm text-ink-inverse-muted">
              {site.tagline} · {site.company}
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-inverse-muted">
              {site.description}
            </p>
          </div>

          <nav aria-label="Patička">
            <h2 className="eyebrow text-ink-inverse-muted">Stránky</h2>
            <ul className="mt-5 flex flex-col gap-2.5 text-sm">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline hover:underline-offset-4">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-ink-inverse-muted">Kontakt</h2>
            <ContactLinks inverse className="mt-5" />
            <SocialIcons inverse className="mt-6" />
          </div>
        </div>

        <Wordmark
          withSuffix
          className="w-full text-ink-inverse opacity-[0.12]"
        />

        <div className="flex flex-col gap-3 border-t border-line-inverse py-6 text-xs text-ink-inverse-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {legal.join(" · ")}
          </p>
          <p>
            <Link
              href="/ochrana-osobnich-udaju"
              className="hover:text-ink-inverse"
            >
              Zpracování osobních údajů
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
