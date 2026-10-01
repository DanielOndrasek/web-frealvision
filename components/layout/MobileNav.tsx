"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { NavLink } from "./NavLink";

function headerBottom() {
  const header = document.querySelector("header");
  return header ? header.getBoundingClientRect().bottom : 0;
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  // Odsazení panelu pod hlavičku. Měříme, protože banner se na úzkém
  // displeji může zalomit do dvou řádků a pevná hodnota by nesedla.
  const [topOffset, setTopOffset] = useState(0);
  const pathname = usePathname();

  // Zavřít po přechodu na jinou stránku. Úprava stavu při renderu je
  // doporučený vzor — useEffect by tu způsobil kaskádový render.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Zamknout scroll pod otevřeným menu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => setTopOffset(headerBottom());
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const toggle = () => {
    if (!open) setTopOffset(headerBottom());
    setOpen(!open);
  };

  // Panel patří mimo hlavičku — ta má backdrop-blur, a ten vytváří
  // containing block pro position:fixed. Uvnitř by se panel scvrknul
  // na výšku hlavičky místo přes celou obrazovku.
  const panel = (
    <div
      id="mobilni-navigace"
      style={{ top: topOffset }}
      className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-line bg-surface px-5 py-6 lg:hidden"
    >
      <nav aria-label="Hlavní navigace">
        <ul className="flex flex-col gap-1">
          {site.nav.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} className="block px-0 py-3 text-lg">
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-base">
        <a href={site.phoneHref} className="font-semibold">
          {site.phone}
        </a>
        <a href={`mailto:${site.email}`} className="text-ink-muted">
          {site.email}
        </a>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="mobilni-navigace"
        className="grid h-10 w-10 place-items-center border border-line-strong text-ink"
      >
        <span className="sr-only">{open ? "Zavřít menu" : "Otevřít menu"}</span>
        <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden fill="none">
          {open ? (
            <path
              d="M1 1l16 12M17 1L1 13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M0 1h18M0 7h18M0 13h18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open ? createPortal(panel, document.body) : null}
    </div>
  );
}
