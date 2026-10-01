import Image from "next/image";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

/**
 * Černobílý portrét makléře. Soubor je barevný, odbarvuje ho až CSS —
 * kdyby se vizuál změnil, fotka se nemusí měnit. Bez fotky stojí na jejím
 * místě monogram ve stejném poměru stran.
 */
export function Portrait({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  const initials = site.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("");

  return (
    <figure className={cn("relative aspect-4/5 overflow-hidden bg-surface-dark", className)}>
      {site.portrait ? (
        <Image
          src={site.portrait}
          alt={`${site.name}, ${site.tagline.toLowerCase()}`}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 90vw, 520px"
          className="object-cover contrast-[1.05] grayscale"
        />
      ) : (
        <div aria-hidden className="drafting-grid absolute inset-0 grid place-items-center opacity-100 [--color-line:#1f1f1f]">
          <span className="flex items-center font-display text-[7rem] leading-none font-semibold tracking-[-0.05em] text-ink-inverse sm:text-[9rem]">
            {initials[0]}
            <span className="mx-[0.12em] size-[0.18em] bg-ink-inverse" />
            {initials.slice(1)}
          </span>
        </div>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-5 pt-10 pb-4 text-xs font-semibold tracking-[0.16em] text-white uppercase">
        <span>{site.name}</span>
        <span className="hidden text-white/70 sm:inline">{site.company}</span>
      </figcaption>
    </figure>
  );
}
