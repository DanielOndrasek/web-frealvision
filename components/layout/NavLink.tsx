"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function NavLink({
  href,
  children,
  onClick,
  className,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const active =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 xl:px-3",
        active ? "text-ink" : "text-ink-muted hover:text-ink",
        // Aktivní položku značí linka v barvě značky — stav nese i aria-current
        active &&
          "after:absolute after:inset-x-2.5 after:-bottom-0.5 after:h-[3px] after:bg-brand xl:after:inset-x-3",
        className,
      )}
    >
      {children}
    </Link>
  );
}
