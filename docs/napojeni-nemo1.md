# Napojení webu na Nemo1

Ověřeno 1. 10. 2026 proti kódu v `tenant-case-stream`
(`_shared/webIntegrationAuth.ts`, `_shared/webAdvertFeed.ts`,
`_shared/websiteLead.ts`).

Web s Nemo1 mluví dvěma směry a oba používají **jednu integraci** —
jedno ID a jedno tajemství:

```
            Nemo1
        │            ▲
 web-advert-feed   website-lead-webhook
  (GET, Bearer)     (POST, HMAC podpis)
        ▼            │
   web F·Real Vision (Next.js)
```

Nemo1 web nikdy samo nevolá — nabídky si web stahuje každých pět minut.

---

## Který portál

| Portál | Kde | Co exportuje | Poptávka bez inzerátu |
|---|---|---|---|
| `osobni_web` — **Osobní web makléře** | Osobní nastavení → Exporty | jen inzeráty toho makléře | e-mail makléři ✓ |
| `vlastni_web` — Vlastní web | Účet kanceláře → Exporty | inzeráty všech makléřů kanceláře | **nikomu nepřijde e-mail** |

**Pro tenhle web je správný `osobni_web`.** U `vlastni_web` Nemo1 poptávku
z kontaktního formuláře nebo odhadu uloží, ale nemá komu poslat e-mail
(nepatří k žádnému inzerátu, tedy ani makléři).

---

## Postup v Nemo1 (dělá František pod svým účtem)

1. Vygeneruj tajemství: `openssl rand -hex 32`. Nikam ho nevkládej do chatu
   ani do gitu.
2. **Osobní nastavení → Exporty → Osobní web makléře** a vyplň:

   | Pole | Hodnota |
   |---|---|
   | Název endpointu | doména webu |
   | URL endpointu | `https://jfccoykhzpnkacguosic.supabase.co/functions/v1/web-advert-feed` |
   | Login | libovolný popisek |
   | Heslo | tajemství z kroku 1 |

3. Po uložení se pod formulářem ukáže **ID integrace** — zkopíruj ho.
4. U každého inzerátu, který má být na webu, zapni v průvodci v kroku
   **Export** přepínač **Osobní web makléře**. Bez toho je feed prázdný.

## Proměnné prostředí (Vercel i `.env.local`)

```bash
NEMO1_INTEGRATION_ID=id-z-kroku-3
NEMO1_FEED_SECRET=tajemstvi-z-kroku-1
```

Ověření: `npm run check:feed` — vypíše počet inzerátů, tajemství netiskne.

---

## Smlouva — co je potřeba vědět

**Feed** (`GET`): hlavičky `X-Nemo1-Integration-Id` a
`Authorization: Bearer <tajemství>`. Posílá jen inzeráty se zapnutým
exportem a stavem `active` / `inactive`; `draft` nikdy. Stažený inzerát
přijde jako `status: inactive` a web ho ukáže jako Prodáno. **Pronájmy web
nezobrazuje vůbec** (`lib/properties/scope.ts`) — František na webu nabízí
jen prodej, i kdyby u pronájmu zapnul export.

**Webhook poptávek** (`POST`, `lib/leads/`):

- hlavičky `X-Nemo1-Integration-Id` a `X-Nemo1-Signature: sha256=<hmac>`,
  HMAC-SHA256 nad přesnými bajty těla, klíčem je stejné tajemství;
- pole `external_id` (idempotence), `form_kind`
  (`viewing` / `contact` / `valuation`), `full_name`, `email` nebo `phone`,
  `gdpr_consent: true`, `gdpr_consent_version`, `submitted_at`, `source_url`;
- `viewing` musí mít `advert_id` aktivního inzerátu, jinak 404. Web pak
  poptávku pošle znovu jako `contact` — kontakt se neztratí;
- 201 = uloženo, 200 = duplicita (stejné `external_id`), 429/5xx se jednou
  zopakuje.

Když se poptávku do Nemo1 dostat nepodaří a je nastavený Resend
(`RESEND_API_KEY`, `EMAIL_FROM`), odejde makléři záložní e-mail.
