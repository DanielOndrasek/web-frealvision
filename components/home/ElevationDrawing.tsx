/**
 * Pohled na dům jako na stavebním výkresu: obrys, okna, výškové kóty
 * a značky úrovní. Čistě dekorativní — kreslí se barvou textu tenkou
 * linkou, takže zůstává v černobílé paletě a nekonkuruje fotkám nabídek.
 */
export function ElevationDrawing({ className }: { className?: string }) {
  const thin = { strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const;
  const body = { strokeWidth: 1.4, vectorEffect: "non-scaling-stroke" } as const;

  return (
    <svg
      viewBox="0 0 480 400"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
    >
      {/* Terén a šrafura pod ním */}
      <path d="M20 340H460" {...body} />
      <g className="text-ink-subtle" {...thin}>
        {Array.from({ length: 22 }, (_, i) => (
          <path key={i} d={`M${30 + i * 20} 341l-10 12`} />
        ))}
      </g>

      {/* Hlavní hmota se střešní deskou */}
      <path d="M80 340V124H330V340" {...body} />
      <path d="M68 118H342V124H68Z" {...body} />

      {/* Nižší boční hmota */}
      <path d="M330 200H420V340" {...body} />
      <path d="M326 196H426" {...body} />

      {/* Patra — tenká přerušovaná linka */}
      <g className="text-ink-subtle" {...thin} strokeDasharray="3 4">
        <path d="M80 196H330" />
        <path d="M80 268H330" />
      </g>

      {/* Okna horních pater */}
      <g {...thin}>
        {[140, 212].map((y) =>
          [100, 180, 260].map((x) => (
            <g key={`${x}-${y}`}>
              <rect x={x} y={y} width="50" height="40" />
              <path d={`M${x + 25} ${y}V${y + 40}`} />
            </g>
          )),
        )}
        {/* Prosklení v přízemí a vstup */}
        <rect x="100" y="284" width="130" height="56" />
        <path d="M143 284V340M187 284V340" />
        <rect x="262" y="284" width="36" height="56" />
        <path d="M290 312h3" />
        {/* Pás oken v boční hmotě */}
        <rect x="346" y="232" width="58" height="44" />
        <path d="M375 232V276" />
      </g>

      {/* Kóta šířky */}
      <g className="text-ink-subtle" {...thin}>
        <path d="M80 112V82M420 192V82" strokeDasharray="2 3" />
        <path d="M80 88H420" />
        <path d="M75 93l10-10M415 93l10-10" />
      </g>
      <text
        x="250"
        y="80"
        textAnchor="middle"
        className="fill-ink-muted"
        stroke="none"
        fontSize="10"
        letterSpacing="1.5"
      >
        15 200
      </text>

      {/* Kóta výšky */}
      <g className="text-ink-subtle" {...thin}>
        <path d="M346 118H452M426 340H452" strokeDasharray="2 3" />
        <path d="M446 118V340" />
        <path d="M441 123l10-10M441 345l10-10" />
      </g>
      <text
        x="438"
        y="229"
        textAnchor="middle"
        className="fill-ink-muted"
        stroke="none"
        fontSize="10"
        letterSpacing="1.5"
        transform="rotate(-90 438 229)"
      >
        9 400
      </text>

      {/* Značky výškových úrovní */}
      <g {...thin}>
        <path d="M28 334l6 6 6-6Z" className="fill-ink" />
        <path d="M28 112l6 6 6-6Z" className="fill-ink" />
        <path d="M22 340H58M22 118H64" className="text-ink-subtle" strokeDasharray="2 3" />
      </g>
      <text x="22" y="328" className="fill-ink-muted" stroke="none" fontSize="9" letterSpacing="1">
        ±0,000
      </text>
      <text x="22" y="106" className="fill-ink-muted" stroke="none" fontSize="9" letterSpacing="1">
        +9,400
      </text>
    </svg>
  );
}
