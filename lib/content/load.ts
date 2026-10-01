import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  parseReviews,
  parseStats,
  type ClientReview,
  type StatsFile,
} from "./schema";

const DIR = path.join(process.cwd(), "content");

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(path.join(DIR, file), "utf8"));
}

/**
 * Chybný obsah shodí build se srozumitelnou hláškou. Tiše vynechaná
 * recenze by se nikdo nedozvěděl — `npm run check` to ale chytí dřív.
 */
function orThrow<T>(result: { value: T; errors: string[] }): T {
  if (result.errors.length) {
    throw new Error(`Chybný obsah:\n${result.errors.join("\n")}`);
  }
  return result.value;
}

let reviews: ClientReview[] | null = null;
let stats: StatsFile | null = null;

/** Reference klientů v pořadí, v jakém jsou v souboru. */
export async function getClientReviews(): Promise<ClientReview[]> {
  reviews ??= orThrow(parseReviews(await readJson("recenze.json")));
  return reviews;
}

export async function getStats(): Promise<StatsFile> {
  stats ??= orThrow(parseStats(await readJson("statistiky.json")));
  return stats;
}
