/**
 * Kontrola obsahu před nasazením: recenze a statistiky ve správném tvaru.
 *
 * Spustit: npm run check:content
 *
 * Prázdné soubory jsou platné (sekce se pak na webu neukážou), ale skript
 * na ně upozorní — web bez referencí není hotový.
 */
import { readFileSync } from "node:fs";
import { parseReviews, parseStats } from "../lib/content/schema.ts";

const read = (file: string): unknown =>
  JSON.parse(readFileSync(`content/${file}`, "utf8"));

const reviews = parseReviews(read("recenze.json"));
const stats = parseStats(read("statistiky.json"));
const errors = [...reviews.errors, ...stats.errors];

for (const error of errors) console.error(`✗ ${error}`);

console.log(`${reviews.value.length} referencí, ${stats.value.items.length} statistik`);
if (!reviews.value.length) console.warn("! content/recenze.json je prázdný");
if (!stats.value.items.length) console.warn("! content/statistiky.json je prázdný");

if (errors.length) process.exit(1);
