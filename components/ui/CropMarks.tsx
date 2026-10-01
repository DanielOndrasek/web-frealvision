import { cn } from "@/lib/cn";

/**
 * Ořezové značky v rozích — rámeček jako na tiskovém archu nebo výkresu.
 * Obalí libovolný obsah; samy jsou jen dekorace.
 */
export function CropMarks({
  children,
  className,
  inverse = false,
}: {
  children: React.ReactNode;
  className?: string;
  inverse?: boolean;
}) {
  const mark = cn(
    "pointer-events-none absolute size-4",
    inverse ? "border-ink-inverse-muted" : "border-ink",
  );

  return (
    <div className={cn("relative", className)}>
      <span aria-hidden className={cn(mark, "-top-px -left-px border-t border-l")} />
      <span aria-hidden className={cn(mark, "-top-px -right-px border-t border-r")} />
      <span aria-hidden className={cn(mark, "-bottom-px -left-px border-b border-l")} />
      <span aria-hidden className={cn(mark, "-right-px -bottom-px border-r border-b")} />
      {children}
    </div>
  );
}
