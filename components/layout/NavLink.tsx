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
        // Aktivní položku značí čtvercová tečka z loga pod textem
        active &&
          "after:absolute after:-bottom-0.5 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:bg-dot",
        className,
      )}
    >
      {children}
    </Link>
  );
}
