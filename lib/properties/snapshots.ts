import "server-only";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { Advert } from "./types";

/**
 * Otisky stažených inzerátů z Nemo1.
 *
 * Feed drží stažený inzerát jako `status: inactive` — dokud ho tam Nemo1
 * posílá, web z něj skládá uzavřenou nabídku sám. Jakmile ho ale někdo
 * v Nemo1 smaže nebo překlopí na `draft`, z feedu zmizí úplně (draft se
 * nikdy neexportuje) a s ním by zmizela i URL, na kterou vedou odkazy.
 *
 * `npm run archiv:feed` proto inzerát zapíše sem, do gitu. Soubor je
 * celý `Advert` tak, jak přišel z feedu, takže se vykreslí přesně stejnou
 * cestou jako živá nabídka. Stav mu přiřadí `feed.ts` — stejně jako
 * tombstonu ve feedu, ať se pravidlo neurčuje na dvou místech.
 *
 * Fotky zůstávají na Supabase Storage v Nemo1. Otisk je udrží na webu
 * i po smazání inzerátu, ale kdyby zmizely i fotky, zůstane nabídka
 * bez galerie. Tohle je hranice toho, co jde udělat bez databáze.
 */
const DIR = path.join(process.cwd(), "content", "archiv-nemo1");

let cache: Advert[] | null = null;

export async function getSnapshotAdverts(): Promise<Advert[]> {
  if (cache) return cache;

  let files: string[];
  try {
    files = (await readdir(DIR)).filter((f) => f.endsWith(".json"));
  } catch {
    // Adresář nemusí existovat, dokud skript poprvé neproběhne.
    cache = [];
    return cache;
  }

  const adverts = await Promise.all(
    files.map(
      async (file) =>
        JSON.parse(await readFile(path.join(DIR, file), "utf8")) as Advert,
    ),
  );

  cache = adverts.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  return cache;
}
