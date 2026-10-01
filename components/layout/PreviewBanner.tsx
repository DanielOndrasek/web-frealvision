import { usingFixtures } from "@/lib/properties/feed";
import { getClientReviews, getStats } from "@/lib/content/load";
import { missingIdentity } from "@/lib/site";
import { Container } from "@/components/ui/Container";

/**
 * Dokud web běží na ukázkových nabídkách nebo mu chybí podklady, řekne
 * to nahlas. Na náhledové adrese by jinak ukázkový byt v Brně nebo
 * zástupné telefonní číslo vypadaly jako skutečné.
 *
 * Až je všechno doplněné, lišta zmizí sama.
 */
export async function PreviewBanner() {
  const [reviews, stats] = await Promise.all([getClientReviews(), getStats()]);

  const missing = [
    ...missingIdentity(),
    ...(reviews.length ? [] : ["reference klientů"]),
    ...(stats.items.length ? [] : ["statistiky"]),
  ];

  if (!usingFixtures && missing.length === 0) return null;

  return (
    <div className="border-b border-ink bg-surface text-ink">
      <Container>
        <p className="py-2 text-center text-xs font-medium">
          Náhled rozpracovaného webu.
          {usingFixtures ? " Nabídky jsou ukázková data, ne skutečné nemovitosti." : ""}
          {missing.length ? ` Chybí: ${missing.join(", ")}.` : ""}
        </p>
      </Container>
    </div>
  );
}
