import ciselniky from "./contract/ciselniky.json";

type Section = keyof typeof ciselniky;

/**
 * Číselníky z Nemo1 jsou **pole objektů** `{ value, label }`, ne mapa
 * klíč → hodnota. Původní verze počítala s mapou, takže hledání vždycky
 * selhalo a všude se vypisovaly syrové slugy — `dum` místo „Dům“,
 * `plynovy_kondenzacni_kotel` místo „Plynový kondenzační kotel“.
 *
 * Převod na mapu se udělá jednou při načtení modulu.
 */
type Entry = { value?: unknown; label?: unknown };

const tables: Partial<Record<Section, Map<string, string>>> = {};

function tableFor(section: Section): Map<string, string> {
  const cached = tables[section];
  if (cached) return cached;

  const raw = ciselniky[section] as unknown;
  const map = new Map<string, string>();

  if (Array.isArray(raw)) {
    for (const item of raw as Entry[]) {
      if (typeof item?.value === "string" && typeof item?.label === "string") {
        map.set(item.value, item.label);
      }
    }
  } else if (raw && typeof raw === "object") {
    // Kdyby některá sekce přišla jako mapa, ať to nespadne
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof value === "string") map.set(key, value);
    }
  }

  tables[section] = map;
  return map;
}

export function label(section: Section, value: string): string {
  const found = tableFor(section).get(value);
  if (found) return found;

  // Neznámý slug radši ukaž čitelně, než abys ho zahodil
  const text = value.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function labels(
  section: Section,
  values: string[] | null | undefined,
): string[] {
  if (!values?.length) return [];
  return values.map((v) => label(section, v));
}
