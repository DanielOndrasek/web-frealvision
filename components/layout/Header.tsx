import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

export function Header() {
  return (
    <header className="sticky top-0 z-50">
      {/* Konverzní lišta — hlavní CTA webu, proto nad navigací */}
      <div className="bg-brand text-ink">
        <Container>
          <p className="py-2 text-center text-[0.8125rem]">
            <span>{site.banner.text}</span>{" "}
            <Link
              href={site.banner.href}
              className="font-semibold underline decoration-1 underline-offset-4 hover:no-underline"
            >
              {site.banner.linkText} →
            </Link>
          </p>
        </Container>
      </div>

      <div className="border-b border-line bg-surface/95 backdrop-blur">
        <Container size="wide">
          <div className="flex h-[4.5rem] items-center justify-between gap-6">
            <Logo />

            <nav aria-label="Hlavní navigace" className="hidden lg:block">
              <ul className="flex items-center gap-0.5">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <NavLink href={item.href}>{item.label}</NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href={site.phoneHref}
              className="tnum hidden h-10 items-center border border-ink px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-150 hover:bg-ink hover:text-ink-inverse lg:inline-flex"
            >
              {site.phone}
            </a>

            <MobileNav />
          </div>
        </Container>
      </div>
    </header>
  );
}
