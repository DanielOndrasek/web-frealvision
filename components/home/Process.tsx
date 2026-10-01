import { profile } from "@/lib/profile";

/**
 * Postup spolupráce ve čtyřech krocích. Pořadová čísla serifovou
 * kurzívou — jediné místo, kde se kurzíva opakuje víckrát za sebou.
 */
export function Process() {
  return (
    <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {profile.process.map((step, i) => (
        <li key={step.title} className="border-t border-ink pt-6">
          <span aria-hidden className="tnum font-serif text-5xl leading-none italic">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
          <p className="mt-3 leading-relaxed text-ink-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
