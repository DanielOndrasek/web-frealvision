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

## Odkaz na nabídku zpátky do Nemo1 (automaticky)

Nemo1 adresu stránky nabídky na webu nezná — slug skládá web. Web ji proto
sám nahlásí podepsaným POSTem na `web-advert-listing` (stejné ID integrace
a tajemství jako feed). Nemo1 pak odkaz ukáže u inzerátu a v reportu pro
majitele a QR kód na tiskové kartě vede sem. Nic dalšího se nenastavuje.

- **Kdy:** po buildu, po každé obnově úvodní stránky (nejvýš jednou za pět
  minut) a po `/api/revalidate`. Kód: `lib/properties/listing-report.ts`.
- **Co:** jen prodeje, které jsou ve feedu `active` a web je ukazuje.
  Staženým inzerátům Nemo1 odkaz maže samo.
- **Kolikrát:** web si nic nepamatuje, hlásí pokaždé všechno. Jako
  `reported_at` posílá `updated_at` z feedu, takže opakované hlášení Nemo1
  pozná a nic nezapíše.
- **Jen ostrý web:** hlásí se jen při `VERCEL_ENV=production` a s nastavenou
  doménou v `NEXT_PUBLIC_SITE_URL` (https). Dokud doména není, nehlásí se
  nic — odkaz na localhost do Nemo1 nepatří.

Omezení: když se změní jen výpočet slugu na webu (inzerát v Nemo1 zůstane
beze změny), Nemo1 novou adresu nepřijme, dokud se inzerát neupraví.
Výjimka `"skryto"` odkaz v Nemo1 nesmaže; inzerát je potřeba stáhnout
i v Nemo1. `NEMO1_LISTING_REPORT_URL` je jen pro test proti jinému
projektu Supabase.

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
