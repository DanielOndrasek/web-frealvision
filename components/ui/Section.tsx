import { cn } from "@/lib/cn";
import { Container } from "./Container";

export function Section({
  children,
  title,
  eyebrow,
  index,
  lead,
  action,
  className,
  containerSize = "default",
  tone = "default",
  align = "left",
  id,
}: {
  children: React.ReactNode;
  title?: string;
  /** Štítek nad nadpisem se čtvercovou tečkou */
  eyebrow?: string;
  /** Pořadové číslo sekce („01“) — číslování jako na výkresové sadě */
  index?: string;
  lead?: string;
  /** Odkaz vpravo vedle nadpisu, např. „Celá nabídka →“ */
  action?: React.ReactNode;
  className?: string;
  containerSize?: "default" | "narrow" | "wide";
  tone?: "default" | "subtle" | "dark";
  align?: "left" | "center";
  id?: string;
}) {
  const tones = {
    default: "bg-surface",
    subtle: "bg-surface-subtle",
    dark: "bg-surface-dark text-ink-inverse",
  };
  const dark = tone === "dark";

  return (
    <section id={id} className={cn("py-16 sm:py-24", tones[tone], className)}>
      <Container size={containerSize}>
        {title ? (
          <header
            className={cn(
              "flex flex-wrap items-end justify-between gap-x-10 gap-y-6",
              lead ? "mb-12" : "mb-10",
              align === "center" && "justify-center text-center",
            )}
          >
            <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
              {eyebrow ? (
                <p
                  className={cn(
                    "eyebrow mb-5",
                    dark && "text-ink-inverse-muted",
                    align === "center" && "justify-center",
                  )}
                >
                  {index ? <span className="tnum">{index}</span> : null}
                  {index ? <span aria-hidden>—</span> : null}
                  {eyebrow}
                </p>
              ) : null}
              <h2 className="text-3xl font-semibold sm:text-[2.75rem] sm:leading-[1.1]">
                {title}
              </h2>
              {lead ? (
                <p
                  className={cn(
                    "mt-4 text-lg leading-relaxed",
                    dark ? "text-ink-inverse-muted" : "text-ink-muted",
                  )}
                >
                  {lead}
                </p>
              ) : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </header>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
