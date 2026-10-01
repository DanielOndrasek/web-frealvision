/**
 * Zapíše stažené inzeráty z Nemo1 do `content/archiv-nemo1/`, aby
 * uzavřené obchody zůstaly na webu i poté, co je někdo v Nemo1 smaže.
 *
 * Proč to vůbec je: feed drží stažený inzerát jako `status: inactive`
 * a web z něj skládá nabídku „Prodáno“ / „Pronajato“ sám. Jenže smazání
 * nebo překlopení na `draft` ho z feedu odstraní úplně — a s ním by
 * zmizela i URL, na kterou vedou odkazy a která má pozici ve vyhledávání.
 * Otisk v gitu je jediné trvalé místo, když web nemá databázi.
 *
 * Spustit: npm run archiv:feed        zapíše nové a aktualizuje známé
 *          npm run archiv:feed -- --vse   otiskne i aktivní nabídky
 *          npm run archiv:feed -- --nanecisto   jen vypíše, nic nezapíše
 *
 * Co skript zapíše, patří do gitu — commitni to.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { FEED_URL, INTEGRATION_ID, SECRET } from "../lib/nemo1.ts";
import { listingSlug } from "../lib/properties/slug.ts";

interface Advert {
  id: string;
  status: string;
  title: string | null;
  city: string | null;
  city_part: string | null;
  ad_type: string | null;
  updated_at: string;
  photos: unknown[] | null;
}

const DIR = path.join(process.cwd(), "content", "archiv-nemo1");
const STATES = path.join(process.cwd(), "content", "stavy-nabidek.json");

const args = new Set(process.argv.slice(2));
const includeActive = args.has("--vse");
const dryRun = args.has("--nanecisto");

const missing = [
  !INTEGRATION_ID && "NEMO1_INTEGRATION_ID",
  !SECRET && "NEMO1_FEED_SECRET",
].filter(Boolean);

if (missing.length) {
  console.error(`Chybí v .env.local: ${missing.join(", ")}`);
  console.error("Vzor je v .env.example.");
  process.exit(1);
}

const res = await fetch(FEED_URL, {
  headers: {
    "X-Nemo1-Integration-Id": INTEGRATION_ID!,
    Authorization: `Bearer ${SECRET}`,
    Accept: "application/json",
  },
});

if (!res.ok) {
  console.error(`✗ Feed odpověděl ${res.status} ${res.statusText}`);
  console.error("Diagnostika je v `npm run check:feed`.");
  process.exit(1);
}

const feed = (await res.json()) as { adverts?: Advert[] };
const adverts = feed.adverts ?? [];

/** Nabídky označené „skryto“ na web nepatří vůbec — otisk nemá smysl. */
let hidden = new Set<string>();
try {
  const records = JSON.parse(await readFile(STATES, "utf8")) as Array<{
    id: string;
    stav: string;
  }>;
  hidden = new Set(
    records.filter((r) => r.stav === "skryto").map((r) => r.id).filter(Boolean),
  );
} catch {
  // Soubor nemusí existovat.
}

const wanted = adverts.filter(
  (a) =>
    Boolean(a.title) &&
    !hidden.has(a.id) &&
    (includeActive || a.status !== "active"),
);

console.log(`Feed: ${adverts.length} inzerátů, k otisknutí ${wanted.length}`);

if (!wanted.length) {
  console.log(
    adverts.length
      ? "\nŽádný stažený inzerát ve feedu není — všechno běží dál.\n" +
          "Aktivní nabídky se otisknou přepínačem --vse."
      : "\nFeed je prázdný. Příčinu vypíše `npm run check:feed`.",
  );
  process.exit(0);
}

await mkdir(DIR, { recursive: true });
const existing = new Set(
  (await readdir(DIR).catch(() => [])).filter((f) => f.endsWith(".json")),
);

let created = 0;
let updated = 0;

for (const advert of wanted) {
  const slug = listingSlug({
    title: advert.title,
    city: advert.city,
    cityPart: advert.city_part,
  });
  const file = `${slug}.json`;
  const isNew = !existing.has(file);

  const photos = Array.isArray(advert.photos) ? advert.photos.length : 0;
  const mark = isNew ? "+" : "~";
  console.log(
    `  ${mark} ${file}  [${photos} foto${photos ? "" : " — galerie bude prázdná"}]`,
  );

  if (!dryRun) {
    // Ukládáme celý inzerát beze změn. Web ho vykreslí stejnou cestou
    // jako živou nabídku, takže jakékoli ořezání by ubralo i na webu.
    await writeFile(
      path.join(DIR, file),
      `${JSON.stringify(advert, null, 2)}\n`,
      "utf8",
    );
  }

  if (isNew) created += 1;
  else updated += 1;
}

console.log(
  `\n${dryRun ? "Nanečisto — nic se nezapsalo. " : ""}` +
    `Nových ${created}, aktualizovaných ${updated}.`,
);

if (!dryRun) {
  console.log(
    "Otisky patří do gitu:\n" +
      "  git add content/archiv-nemo1 && git commit -m 'archiv: otisk stažených nabídek'",
  );
}
