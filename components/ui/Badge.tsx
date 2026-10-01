import { cn } from "@/lib/cn";

export type BadgeTone =
  | "active"
  | "reserved"
  | "sold"
  | "neutral"
  | "accent"
  | "dark";

/*
 * Stavy se v černobílém webu rozlišují plochou: aktivní je plná černá,
 * rezervace bílá s obrysem, uzavřená šedá. Text štítku stav říká vždy
 * i slovy, takže se nespoléhá jen na vzhled.
 */
const tones: Record<BadgeTone, string> = {
  active: "bg-status-active-bg text-status-active",
  reserved: "border border-ink bg-status-reserved-bg text-status-reserved",
  sold: "bg-status-sold-bg text-status-sold",
  neutral: "bg-surface-subtle text-ink-muted",
  accent: "bg-accent-subtle text-accent-text",
  dark: "bg-surface/95 text-ink backdrop-blur-sm",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
