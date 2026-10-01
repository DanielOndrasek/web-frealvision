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

## Doplněno 1. 10. 2026

- Telefon, e-mail a portrét (`public/foto/frantisek-kroupa.webp`, výřez 4 : 5
  z dodané fotky, na webu barevně).
- Text o Františkovi (`lib/profile.ts`) — převedený do první osoby, obsah beze
  změny. Vymyšlený postup „Jak pracuji“ z první verze je pryč.
- 26 referencí z profilu na archer-reality.cz (`content/recenze.json`).

## Chybí — web bez toho nejde spustit

Lišta nahoře na webu je vypisuje, dokud nejsou doplněné.

| Co | Kam | Zdroj |
|---|---|---|
| Statistiky | `content/statistiky.json` | profil na archer-reality.cz |
| IČO a sídlo F-Real Vision s.r.o. | `lib/site.ts` → `legal` | ARES |
| Doména | `NEXT_PUBLIC_SITE_URL` ve Vercelu | František |
| Napojení na Nemo1 | `NEMO1_INTEGRATION_ID`, `NEMO1_FEED_SECRET` | `docs/napojeni-nemo1.md` |
| Odkazy na sociální sítě | `lib/site.ts` → `social` | František |

## K rozhodnutí

- **Negativní recenze Pavla Stupky** (Kladno, byty) na webu není. Je to jediná
  záporná z 27. Jestli ji tam František chce, stačí ji doplnit do
  `content/recenze.json`. Pod referencemi stojí, že jde o výběr z profilu.
- **E-mail:** na webu je `fr.kroupa@gmail.com`. Adresa `@archer-reality.cz`
  patří kanceláři, vlastní doména by působila lépe než Gmail.
- **14 referencí je zkrácených** — slider na profilu ukazoval jen začátek
  („číst dále“). Konec je označený `[…]`, nic není dopsané. Plné znění
  doplnit u: Pavlovská, Břízek, Kafkovi, Ryšavá, Lebeda, Plachý, Kučerová,
  Pulkrábková, Pírová, Kubíková, Čermák, Cao, Kalaš, Hamarová. U Záruby
  skončil viditelný text podpisem — ověřit, jestli za ním nic není.
- Texty recenzí jsou doslovné včetně překlepů a chybějící diakritiky.

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

- Převod textu o Františkovi do první osoby (`lib/profile.ts`) — ať si ho
  přečte. Kdyby chtěl třetí osobu jako na profilu, je to úprava jednoho souboru.
- Zásady zpracování osobních údajů jsou upravené ze šablony — před
  spuštěním je ať projde člověk, který za ně odpovídá.
- Odhad pro nemajitele: šablona uváděla cenu 4 990 Kč, tady je
  „dle domluvy“, dokud František neřekne vlastní podmínky.
