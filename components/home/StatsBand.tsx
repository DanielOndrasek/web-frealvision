import { Container } from "@/components/ui/Container";
import { getStats } from "@/lib/content/load";

/**
 * Čísla na černém pruhu. Bez dat se sekce nevykreslí vůbec — vymyšlená
 * statistika je horší než žádná.
 */
export async function StatsBand() {
  const stats = await getStats();
  if (!stats.items.length) return null;

  return (
    <section aria-label="Výsledky v číslech" className="bg-surface-dark text-ink-inverse">
      <Container size="wide">
        <dl className="grid grid-cols-2 gap-y-10 py-14 sm:py-16 lg:grid-flow-col lg:grid-cols-none">
          {stats.items.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse gap-2 border-l border-line-inverse pr-4 pl-5 sm:pl-7"
            >
              <dt className="text-sm leading-snug text-ink-inverse-muted">{stat.label}</dt>
              <dd className="tnum font-display text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
        {stats.note ? (
          <p className="border-t border-line-inverse py-4 text-xs text-ink-inverse-muted">
            {stats.note}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
