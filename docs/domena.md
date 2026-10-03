# Doména f-realvision.cz

Zjištěno 3. 10. 2026 z veřejného DNS.

## Současný stav

DNS spravuje **Web4U** (`ns.web4u.cz`, `ns2.web4u.cz`). Web zatím míří na
hosting Web4U, e-mail běží na **Google Workspace**.

| Záznam | Hodnota | Co s ním |
|---|---|---|
| A `@` | `81.91.86.14` | **nahradit** |
| AAAA `@` | `2001:1568::14` | **smazat** — jinak by návštěvníci přes IPv6 skončili na starém hostingu |
| A `www` | `81.91.86.14` | **smazat** (nahradí ho CNAME) |
| AAAA `www` | `2001:1568::14` | **smazat** |
| MX `@` | `1 smtp.google.com` | nechat — e-mail |
| TXT `@` | `v=spf1 include:_spf.google.com ~all` | nechat — e-mail |
| TXT `@` | `google-site-verification=…` | nechat |

## Nové záznamy pro Vercel

| Typ | Název | Hodnota |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns-0.com` |

Hodnoty podle dokumentace Vercelu. Když Vercel po přidání domény
(Settings → Domains) ukáže jiné, platí ty z Vercelu. Nameservery zůstávají
u Web4U.

Hlavní adresa je `www.f-realvision.cz`, holá `f-realvision.cz` se na ni
přesměrovává (nastavuje se ve Vercelu u domény).

`f-realvision.com` je taky u Web4U a míří na stejný hosting. Pokud má
přesměrovat na web, dostane stejné dva záznamy a ve Vercelu se přidá jako
přesměrování na `www.f-realvision.cz`.

## Ostrý start

Až bude napojené Nemo1 a doplněné IČO a sídlo, nastavit ve Vercelu
(Production) `NEXT_PUBLIC_SITE_URL=https://www.f-realvision.cz` a spustit
Redeploy. Do té doby má web na doméně `noindex` (viz `proxy.ts`).
