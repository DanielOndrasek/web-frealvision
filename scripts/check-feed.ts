/**
 * Ověří napojení na web-advert-feed v Nemo1.
 * Tajemství se čte z .env.local a nikdy se nevypisuje.
 *
 * Spustit: npm run check:feed
 */
import { FEED_URL, INTEGRATION_ID, SECRET } from "../lib/nemo1.ts";

const url = FEED_URL;
const integrationId = INTEGRATION_ID;
const secret = SECRET;

const missing = [
  !integrationId && "NEMO1_INTEGRATION_ID",
  !secret && "NEMO1_FEED_SECRET",
].filter(Boolean);

if (missing.length) {
  console.error(`Chybí v .env.local: ${missing.join(", ")}`);
  console.error("Vzor je v .env.example.");
  process.exit(1);
}

console.log(`Volám ${url}`);
console.log(`Integrace ${integrationId}\n`);

const res = await fetch(url, {
  headers: {
    "X-Nemo1-Integration-Id": integrationId!,
    Authorization: `Bearer ${secret}`,
    Accept: "application/json",
  },
});

if (!res.ok) {
  console.error(`✗ HTTP ${res.status} ${res.statusText}`);
  if (res.status === 401) {
    console.error(
      "\n401 znamená jedno ze tří:\n" +
        "  · NEMO1_INTEGRATION_ID není ID integrace z Nemo1\n" +
        "  · credentials nejsou u portálu „Osobní web makléře“\n" +
        "    (nebo „Vlastní web“, pokud web patří celé kanceláři)\n" +
        "  · NEMO1_FEED_SECRET neodpovídá nastavenému heslu",
    );
  }
  process.exit(1);
}

const feed = await res.json();
const adverts: Array<Record<string, unknown>> = feed.adverts ?? [];
const active = adverts.filter((a) => a.status === "active");

console.log(`✓ HTTP 200, formát verze ${feed.version}`);
console.log(`  vygenerováno ${feed.generated_at}`);
console.log(`  inzerátů celkem: ${adverts.length}`);
console.log(`  z toho aktivních: ${active.length}`);
console.log(`  tombstone (inactive): ${adverts.length - active.length}\n`);

if (!adverts.length) {
  console.log(
    "Feed je prázdný. Nejčastější příčina: u inzerátů není v Nemo1\n" +
      "zapnutý export na portál „Osobní web makléře“ (krok Export v průvodci).",
  );
} else {
  for (const a of active.slice(0, 10)) {
    const photos = Array.isArray(a.photos) ? a.photos.length : 0;
    console.log(
      `  · ${String(a.title ?? "(bez titulku)").slice(0, 58)}  [${photos} foto]`,
    );
  }
}
