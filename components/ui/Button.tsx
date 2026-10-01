import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "solid" | "secondary" | "ghost" | "onDark" | "inverse";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold " +
  "transition-[opacity,transform,background-color,color,border-color] duration-150 " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Hlavní výzva: žlutá plocha, černý text — nejjasnější místo stránky
  primary: "bg-sun text-ink hover:bg-sun-strong",
  // Plná černá: odeslání formuláře, akce na žluté ploše
  solid: "bg-accent text-ink-inverse hover:bg-accent-hover",
  // Vedlejší akce: černý obrys, při najetí se vyplní
  secondary: "border border-ink bg-transparent text-ink hover:bg-ink hover:text-ink-inverse",
  ghost: "text-ink underline-offset-4 hover:underline",
  // Obrysové tlačítko na černé ploše nebo přes fotku
  onDark: "border border-white/60 text-white hover:border-white hover:bg-white hover:text-ink",
  // Plné bílé tlačítko na tmavé ploše
  inverse: "bg-surface text-ink hover:bg-accent-strong",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-[0.9375rem]",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    if (external) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
