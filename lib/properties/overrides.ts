import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Ruční stavy stažených nabídek.
 *
 * Feed z Nemo1 zná jen `active` a `inactive`. Deaktivace inzerátu znamená,
 * že je obchod hotový — nabídka proto na webu **zůstane** se štítkem
 * „Prodáno“ / „Pronajato“ a nikdy nezmizí. Realizovaný obchod je reference a je to
 * i jediné, co feed umožňuje odvodit sám.
 *
 * Výjimky se zapisují sem. `content/stavy-nabidek.json`, klíčem je `id`
 * inzerátu z Nemo1:
 *
 *     [
 *       { "id": "3f2a9c10-…", "stav": "reserved", "poznamka": "zatím jen rezervace" },
 *       { "id": "7c5b1e22-…", "stav": "skryto",   "poznamka": "majitel stáhl, neprodáno" }
 *     ]
 *
 *   sold      výchozí stav deaktivovaného inzerátu, psát se nemusí
 *   reserved  obchod ještě neproběhl — štítek „Rezervováno“
 *   aktivni   nemovitost se pořád nabízí, ukaž ji jako živou nabídku
 *   skryto    na web vůbec nepatří, zmizí i s URL
 *
 * `aktivni` je jediná hodnota, která jde proti Nemo1: říká, že inzerát je
 * sice deaktivovaný, ale nemovitost se dál prodává — typicky když běží
 * pod druhým účtem v Nemo1, jehož integraci web nečte. Dokud tam řádek
 * visí, web tvrdí, že je nabídka živá. Až se doopravdy prodá, musí pryč,
 * jinak bude web lhát.
 *
 * Platí jen na inzerát, který je ve feedu. Na otisk v `content/archiv-nemo1/`
 * nemá vliv — ten je z definice uzavřený.
 */
export type ListingOverride = "sold" | "reserved" | "aktivni" | "skryto";

const VALUES: ReadonlySet<string> = new Set<ListingOverride>([
  "sold",
  "reserved",
  "aktivni",
  "skryto",
]);

const FILE = path.join(process.cwd(), "content", "stavy-nabidek.json");

interface OverrideRecord {
  id: string;
  stav: ListingOverride;
  /** Jen pro člověka, který soubor otevře za půl roku. Kód ho nečte. */
  poznamka?: string;
}

let cache: Map<string, ListingOverride> | null = null;

export async function getListingOverrides(): Promise<
  Map<string, ListingOverride>
> {
  if (cache) return cache;

  try {
    const records = JSON.parse(await readFile(FILE, "utf8")) as OverrideRecord[];
    cache = new Map(
      records
        .filter((r) => r.id && VALUES.has(r.stav))
        .map((r) => [r.id, r.stav]),
    );
  } catch {
    // Soubor nemusí existovat — prázdný seznam je legitimní stav.
    cache = new Map();
  }

  return cache;
}
