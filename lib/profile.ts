/**
 * Texty o makléři na jednom místě — úvodní stránka i stránka O mně
 * berou odsud.
 *
 * Koncept k odsouhlasení: záměrně bez čísel a tvrzení (roky praxe, počet
 * obchodů, lokality), dokud je makléř nepotvrdí. Doložitelná čísla patří
 * do `content/statistiky.json`, kde se ukazují i se zdrojem.
 */
export const profile = {
  headline: "Prodej nemovitosti s jasnou",
  /** Slovo sázené serifovou kurzívou — ozvěna „Vision“ z loga. */
  headlineAccent: "vizí.",
  lead: "Jsem František Kroupa, realitní makléř. Provedu vás prodejem, koupí i pronájmem — od stanovení ceny přes prezentaci až po předání klíčů.",

  aboutTitle: "Každý obchod začíná jasným plánem.",
  about: [
    "Pomáhám lidem prodat, koupit nebo pronajmout nemovitost tak, aby v každé fázi věděli, co se děje a proč. Bez tlaku, bez zbytečných slibů a s důrazem na detail.",
    "Na první schůzce spolu projdeme nemovitost, vaše cíle i časový rámec. Z toho vznikne plán — cena, prezentace, harmonogram — a ten pak dotáhnu až do předání klíčů.",
  ],

  process: [
    {
      title: "Konzultace a cena",
      text: "Projdeme nemovitost a vaše záměry. Cenu stanovím z dat o skutečných prodejích v okolí, ne z inzertních přání.",
    },
    {
      title: "Příprava a prezentace",
      text: "Fotografie, půdorys a popis, který nemovitost ukáže v nejlepším světle. Inzerce tam, kde jsou vaši kupující.",
    },
    {
      title: "Prohlídky a vyjednávání",
      text: "Prohlídky organizuji a vedu sám. Zájemce prověřím a vyjednám pro vás co nejlepší podmínky.",
    },
    {
      title: "Smlouvy a předání",
      text: "Rezervační a kupní smlouva, úschova kupní ceny, předávací protokol. Jsem u toho až do předání klíčů.",
    },
  ],
} as const;
