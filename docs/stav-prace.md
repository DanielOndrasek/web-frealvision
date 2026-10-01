# Stav práce

Poslední aktualizace: 1. 10. 2026.

## Hotovo

- Kostra ze šablony `web-danielondrasek`: Next.js 16, React 19, Tailwind v4,
  TypeScript strict. Bez WordPressových archivů, blogu, newsletteru a bridge
  kontaktů — nic z toho tenhle web nepotřebuje.
- Černobílý vizuál podle loga, logo převedené do vektoru, favicon „F·“,
  náhled pro sdílení.
- Stránky: úvod, nabídka a detail, O mně, Reference, Odhad zdarma, Kontakt,
  Zpracování osobních údajů.
- Nabídky z Nemo1 (`web-advert-feed`), poptávky přímo do Nemo1
  (`website-lead-webhook`) s podpisem, idempotencí a záchranou poptávky
  ke staženému inzerátu. Testy v `tests/`.

## Chybí — web bez toho nejde spustit

Lišta nahoře na webu je vypisuje, dokud nejsou doplněné. `npm run check`
upozorní na prázdné reference a statistiky.

| Co | Kam | Zdroj |
|---|---|---|
| Reference klientů — všechny ze slideru | `content/recenze.json` | profil na archer-reality.cz |
| Statistiky | `content/statistiky.json` | profil na archer-reality.cz |
| Telefon, e-mail | `lib/site.ts` | František |
| IČO a sídlo F-Real Vision s.r.o. | `lib/site.ts` → `legal` | ARES |
| Portrét (4 : 5, stačí barevný — web ho odbarví) | `public/foto/`, cesta do `lib/site.ts` → `portrait` | František |
| Doména | `NEXT_PUBLIC_SITE_URL` ve Vercelu | František |
| Napojení na Nemo1 | `NEMO1_INTEGRATION_ID`, `NEMO1_FEED_SECRET` | `docs/napojeni-nemo1.md` |
| Odkazy na sociální sítě | `lib/site.ts` → `social` | František |

Profil `https://www.archer-reality.cz/kroupafrantisek` se 1. 10. 2026 nedal
stáhnout — síť prostředí, ve kterém web vznikal, doménu blokovala.

## Formát referencí

```json
[
  {
    "id": "jana-novakova",
    "author": "Jana Nováková",
    "text": "Celý text recenze tak, jak je na profilu.",
    "context": "Prodej bytu 2+kk, Praha 4",
    "rating": 5,
    "date": "2025-03"
  }
]
```

`context`, `rating` a `date` jsou volitelné (`null`). Pořadí v souboru
je pořadí na webu. Formát statistik:

```json
{
  "note": "Výsledky z profilu na archer-reality.cz",
  "items": [{ "value": "120+", "label": "prodaných nemovitostí" }]
}
```

## K odsouhlasení

- Texty v `lib/profile.ts` (úvod, O mně, postup spolupráce) jsou koncept
  bez konkrétních tvrzení. František by je měl přečíst a doplnit fakta.
- Zásady zpracování osobních údajů jsou upravené ze šablony — před
  spuštěním je ať projde člověk, který za ně odpovídá.
- Odhad pro nemajitele: šablona uváděla cenu 4 990 Kč, tady je
  „dle domluvy“, dokud František neřekne vlastní podmínky.
