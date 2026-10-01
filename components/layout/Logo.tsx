import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { LOGO_SUFFIX, LOGO_WORDMARK } from "./logo-paths";

/**
 * Slovní značka F·Real Vision. Bez dovětku „s.r.o.“ je čitelnější v malé
 * velikosti — dovětek se ukazuje jen tam, kde je logo velké.
 */
export function Wordmark({
  withSuffix = false,
  className,
}: {
  withSuffix?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox={withSuffix ? "4 4 1110 135" : "4 4 975 135"}
      aria-hidden
      className={cn("block fill-current", className)}
    >
      <path d={LOGO_WORDMARK} />
      {withSuffix ? <path d={LOGO_SUFFIX} /> : null}
    </svg>
  );
}

/**
 * Logo v hlavičce a patičce: slovní značka firmy a vedle ní, oddělené
 * vlasovou linkou, jméno makléře. Lidé hledají člověka, ne s.r.o.
 */
export function Logo({
  inverse = false,
  className,
}: {
  inverse?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name}, ${site.company} — úvodní stránka`}
      className={cn(
        "flex items-center gap-4 whitespace-nowrap",
        inverse ? "text-ink-inverse" : "text-ink",
        className,
      )}
    >
      <Wordmark className="h-[22px] w-auto sm:h-[26px]" />
      <span
        className={cn(
          "hidden h-8 border-l pl-4 leading-none sm:flex sm:flex-col sm:justify-center",
          inverse ? "border-line-inverse" : "border-line-strong",
        )}
      >
        <span className="font-display text-sm font-semibold tracking-[-0.01em]">
          {site.name}
        </span>
        <span
          className={cn(
            "mt-1 text-[0.625rem] font-semibold tracking-[0.18em] uppercase",
            inverse ? "text-ink-inverse-muted" : "text-ink-subtle",
          )}
        >
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
