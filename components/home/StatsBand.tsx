import { Container } from "@/components/ui/Container";
import { getStats } from "@/lib/content/load";

/**
 * Čísla na pruhu v barvě značky. Bez dat se sekce nevykreslí vůbec — vymyšlená
 * statistika je horší než žádná.
 */
export async function StatsBand() {
  const stats = await getStats();
  if (!stats.items.length) return null;

  return (
    <section aria-label="Výsledky v číslech" className="bg-brand text-ink">
      <Container size="wide">
        <dl className="grid grid-cols-2 gap-y-10 py-14 sm:py-16 lg:grid-flow-col lg:grid-cols-none">
          {stats.items.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse gap-2 border-l border-ink/25 pr-4 pl-5 sm:pl-7"
            >
              <dt className="text-sm leading-snug text-brand-ink-muted">{stat.label}</dt>
              <dd className="tnum font-display text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
        {stats.note ? (
          <p className="border-t border-ink/25 py-4 text-xs text-brand-ink-muted">
            {stats.note}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
