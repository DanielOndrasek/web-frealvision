/**
 * Číselníky formuláře pro odhad. Vychází z formuláře na původním webu,
 * ale dispozice i konstrukce se ptají jen tam, kde dávají smysl —
 * u pozemku se na cihlu nebo panel nikdo ptát nemá.
 */

export type PropertyKind = "byt" | "dum" | "pozemek" | "komercni" | "ostatni";

export const KINDS: Array<{
  value: PropertyKind;
  label: string;
  hint: string;
  /** Plocha, na kterou se u tohohle druhu ptáme. */
  areaLabel: string;
  asksDisposition: boolean;
  asksConstruction: boolean;
}> = [
  {
    value: "byt",
    label: "Byt",
    hint: "V bytovém domě",
    areaLabel: "Užitná plocha",
    asksDisposition: true,
    asksConstruction: true,
  },
  {
    value: "dum",
    label: "Dům",
    hint: "Rodinný nebo řadový",
    areaLabel: "Užitná plocha",
    asksDisposition: true,
    asksConstruction: true,
  },
  {
    value: "pozemek",
    label: "Pozemek",
    hint: "Stavební i ostatní",
    areaLabel: "Výměra pozemku",
    asksDisposition: false,
    asksConstruction: false,
  },
  {
    value: "komercni",
    label: "Komerční",
    hint: "Kanceláře, sklad, provozovna",
    areaLabel: "Podlahová plocha",
    asksDisposition: false,
    asksConstruction: true,
  },
  {
    value: "ostatni",
    label: "Ostatní",
    hint: "Garáž, chata, jiné",
    areaLabel: "Plocha",
    asksDisposition: false,
    asksConstruction: false,
  },
];

export const DISPOSITIONS = [
  "1+kk", "1+1", "2+kk", "2+1", "3+kk", "3+1", "4+kk", "4+1", "5+kk a větší", "Jiná",
];

export const CONSTRUCTIONS = [
  "Cihlová", "Panelová", "Dřevěná", "Kamenná", "Montovaná", "Smíšená", "Jiná",
];

export const CONDITIONS = [
  "Novostavba",
  "Po rekonstrukci",
  "Velmi dobrý",
  "Průměrný",
  "Špatný",
  "K rekonstrukci",
  "K demolici",
];

/** Doplňky, které cenu posouvají a lidé je zapomínají zmínit. */
export const FEATURES = [
  "Balkon",
  "Lodžie",
  "Terasa",
  "Zahrada",
  "Sklep",
  "Garáž",
  "Parkovací stání",
  "Výtah",
  "Bazén",
];

export function kindOf(value: PropertyKind) {
  return KINDS.find((k) => k.value === value) ?? KINDS[0];
}
