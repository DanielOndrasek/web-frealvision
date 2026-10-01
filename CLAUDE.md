# CLAUDE.md — web Františka Kroupy (F·Real Vision s.r.o.)

Pokyny pro Claude Code. Čti před každou změnou.

@AGENTS.md

---

## Co stavíme

Prezentační web realitního makléře Františka Kroupy, firma F-Real Vision s.r.o.
Nabídka nemovitostí z Nemo1, reference klientů, odhad zdarma, kontaktní formuláře.

Vychází ze šablony `web-danielondrasek` (stejný stack, stejná integrace
s Nemo1), vizuál je vlastní: černobílý podle loga.

**Stav a co chybí: `docs/stav-prace.md`. Napojení na Nemo1: `docs/napojeni-nemo1.md`.**

---

## Nepřekročitelné pravidlo: web nemá databázi

| Data | Zdroj |
|---|---|
| Nemovitosti (aktivní i uzavřené) | feed `web-advert-feed` z Nemo1, ISR 5 min |
| Uzavřené, které z feedu zmizely | `content/archiv-nemo1/` (`npm run archiv:feed`) |
| Výjimky stavu (rezervace, skrýt) | `content/stavy-nabidek.json` |
| Reference klientů | `content/recenze.json` |
| Statistiky | `content/statistiky.json` |
| Texty o makléři | `lib/profile.ts` |
| Kontakty, IČO, sídlo | `lib/site.ts` |
| Poptávky | POST do `website-lead-webhook` v Nemo1 (HMAC) |

Nepřidávej Supabase, Prisma ani žádné úložiště.

**Web nabízí jen prodej, ne pronájem.** Pronájmy z feedu se na web vůbec
nedostanou (`lib/properties/scope.ts`), v textech se pronájem nenabízí.

---

## Vizuál — černobílý základ, žlutá pro rozjasnění

- Barvy jen přes tokeny v `app/globals.css`. Základ je černobílý jako logo,
  plochy mají teplý papírový tón (`surface-subtle`), ne studenou šedou.
- **Jediná barva je slunečná žlutá `sun`** — lišta nahoře, hlavní tlačítka
  (`Button` primary), pruh s odhadem a statistikami, zvýraznění slova
  (`highlight`), plocha za portrétem. Žlutá nikdy není barva textu na bílé
  (1,5 : 1), text na žluté je černý.
- Fotografie — nabídky i portrét — se nikdy neodbarvují (přání klienta).
- `danger` jen pro chyby formulářů.
- Grafické motivy: čtvercová tečka z loga (`eyebrow`), kóta
  (`components/ui/Dimension.tsx`), ořezové značky (`CropMarks`), rýsovací
  mřížka (`drafting-grid`), výkres domu (`ElevationDrawing`).
- Písma: Inter Tight (nadpisy), Inter (text), Instrument Serif kurzívou
  jen na jednotlivá slova a pořadová čísla.
- Ostré hrany: rádiusy 2 px, tlačítka bez zaoblení.
- Logo je vektor v `components/layout/logo-paths.ts`, kreslí se `currentColor`.

---

## Obsah

- **Recenze a statistiky nikdy nevymýšlej.** Patří sem jen skutečné, převzaté
  z profilu makléře. Bez dat se sekce na webu nevykreslí.
- Hodnocení z vlastního webu nedávej do structured data (`AggregateRating`) —
  Google je bere jako self-serving.
- Texty v `lib/profile.ts` vycházejí z textu, který dodal makléř. Nová fakta
  (roky praxe, lokality, počty obchodů) doplňuj jen potvrzená jím.
- Reference jsou doslovné. Zkrácený text značí `[…]`, nic se nedopisuje.

---

## Konvence

Stejné jako v šabloně: UI česky, kód anglicky, `<html lang="cs">`,
komponenty `PascalCase.tsx`, ostatní `kebab-case.ts`, obrázky přes
`next/image`, alt nikdy název souboru, slugy jen `a-z0-9-`, čísla
`tabular-nums` a formátování přes `lib/format.ts`.

Nepřidávej závislosti bez ptaní. Testy běží na vestavěném `node --test`.

---

## SEO — povinné u každé stránky

1. `generateMetadata`/`metadata` s titulkem do 60 a popisem do 155 znaků.
2. Titulek nemovitosti vždy s lokalitou (`lib/properties/normalize.ts`).
3. Detail nemovitosti má `RealEstateListing` + `Offer`.
4. Každá stránka je dosažitelná odkazem a je v `app/sitemap.ts`.

---

## Kontrola před předáním

```bash
npm run check   # tsc + lint + testy + slugy + obsah
npm run build
```
