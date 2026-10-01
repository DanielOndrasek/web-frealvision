/**
 * Kontrola, že slugy nevyrábějí percent-encoding — `m²` by v URL skončilo jako
 * (`/nemovitosti/prodej-bytu-3kk-85m%c2%b2-praha-6-vokovice/`).
 *
 * Spustit: node --experimental-strip-types scripts/check-slugs.ts
 */
import { listingSlug } from "../lib/properties/slug.ts";

const cases = [
  { title: "Prodej bytu 3+kk 85m² Praha 6 Vokovice", city: null, cityPart: null },
  { title: "Prodej bytu 3+kk 87 m²", city: "Praha", cityPart: "Vokovice" },
  { title: "3+kk, velká terasa s nekonečným výhledem", city: "Praha", cityPart: "Dolní Měcholupy" },
  { title: "Prodej domu Skorkov: 7+1, zahrada 859 m² a garáž", city: "Skorkov", cityPart: null },
  { title: "Pronájem bytu 2+kk 64 m²", city: "Praha", cityPart: "Dejvice" },
];

let failed = 0;
for (const input of cases) {
  const slug = listingSlug(input);
  const safe = /^[a-z0-9-]+$/.test(slug) && slug === encodeURIComponent(slug);
  if (!safe) failed++;
  console.log(`${safe ? "✓" : "✗"} ${slug}`);
}

if (failed) {
  console.error(`\n${failed} slug(ů) není bezpečných pro URL.`);
  process.exit(1);
}
console.log("\nVšechny slugy jsou čisté ASCII.");
