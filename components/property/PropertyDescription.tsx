/**
 * Popis nabídky rozdělený na odstavce.
 *
 * Texty inzerátů mívají podnadpisy jen jako krátký řádek nad
 * odstavcem. Bez rozlišení by se vykreslily jako součást věty, proto
 * krátký první řádek bez tečky bereme jako podnadpis.
 */
function isHeading(line: string): boolean {
  const text = line.trim();
  return (
    text.length > 0 &&
    text.length <= 70 &&
    !/[.!?:;,]$/.test(text) &&
    // Věta by měla víc než pár slov; podnadpis bývá kratší
    text.split(/\s+/).length <= 9
  );
}

type Block =
  | { kind: "heading"; text: string; body: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] };

/**
 * Víc samostatných krátkých řádků za sebou není série podnadpisů, ale
 * výčet parametrů („6. patro“, „výtah“, „parkovací stání“). Takové řádky
 * slučujeme do jednoho seznamu, jinak by stránka vypadala jako hromada
 * nadpisů pod sebou.
 */
function toBlocks(text: string): Block[] {
  const raw = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const blocks: Block[] = [];
  for (const block of raw) {
    const [first, ...rest] = block.split("\n");
    const body = rest.join(" ").trim();

    if (isHeading(first) && !body) {
      const last = blocks[blocks.length - 1];
      if (last?.kind === "list") {
        last.items.push(first.trim());
      } else if (last?.kind === "heading" && !last.body) {
        blocks[blocks.length - 1] = { kind: "list", items: [last.text, first.trim()] };
      } else {
        blocks.push({ kind: "heading", text: first.trim(), body: "" });
      }
      continue;
    }

    if (isHeading(first) && body) {
      blocks.push({ kind: "heading", text: first.trim(), body });
      continue;
    }

    blocks.push({ kind: "paragraph", text: block.replace(/\n/g, " ") });
  }
  return blocks;
}

export function PropertyDescription({ text }: { text: string }) {
  const blocks = toBlocks(text);

  return (
    <div className="max-w-2xl">
      {blocks.map((block, index) => {
        const gap = index === 0 ? "" : "mt-6";

        if (block.kind === "list") {
          return (
            <ul key={index} className={`${gap} flex flex-col gap-2 text-lg text-ink`}>
              {block.items.map((item, i) => (
                <li key={i} className="flex items-baseline gap-3">
                  <span aria-hidden className="size-1.5 shrink-0 translate-y-[-0.2em] bg-dot" />
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        if (block.kind === "heading") {
          return (
            <div key={index} className={index === 0 ? "" : "mt-8"}>
              <h3 className="text-xl font-semibold">{block.text}</h3>
              {block.body ? (
                <p className="mt-2 text-lg leading-relaxed text-ink-muted">{block.body}</p>
              ) : null}
            </div>
          );
        }

        return (
          <p key={index} className={`text-lg leading-relaxed text-ink-muted ${gap}`}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
