import { cn } from "@/lib/cn";

/**
 * Kóta jako na stavebním výkresu: vodorovná vlasová linka s koncovými
 * značkami a popiskem uprostřed. Jemný grafický prvek webu — odděluje
 * sekce a podtrhuje čísla, nikdy nenese informaci, kterou by jinde nebylo
 * vidět.
 */
export function Dimension({
  label,
  className,
  inverse = false,
}: {
  label?: string;
  className?: string;
  inverse?: boolean;
}) {
  const line = inverse ? "bg-line-inverse" : "bg-line-strong";
  const tick = cn("h-3 w-px shrink-0", inverse ? "bg-ink-inverse-muted" : "bg-ink-subtle");

  return (
    <div aria-hidden className={cn("flex items-center", className)}>
      <span className={tick} />
      <span className={cn("h-px flex-1", line)} />
      {label ? (
        <span
          className={cn(
            "px-3 text-[0.625rem] font-semibold tracking-[0.2em] uppercase",
            inverse ? "text-ink-inverse-muted" : "text-ink-subtle",
          )}
        >
          {label}
        </span>
      ) : null}
      {label ? <span className={cn("h-px flex-1", line)} /> : null}
      <span className={tick} />
    </div>
  );
}
