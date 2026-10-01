import { Container } from "./Container";
import { Dimension } from "./Dimension";

/**
 * Úvod podstránky. Pod nadpisem kóta přes celou šířku — stejný motiv,
 * který na úvodní stránce odděluje sekce.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="drafting-grid border-b border-line bg-surface">
      <Container size="wide">
        <div className="max-w-3xl pt-16 pb-12 sm:pt-24 sm:pb-16">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="mt-6 text-4xl font-semibold sm:text-6xl sm:leading-[1.05]">
            {title}
          </h1>
          {lead ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {lead}
            </p>
          ) : null}
        </div>
        <Dimension className="pb-8" />
      </Container>
    </div>
  );
}
