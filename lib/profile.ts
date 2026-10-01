/**
 * Texty o makléři na jednom místě — úvodní stránka i stránka O mně
 * berou odsud.
 *
 * Zdroj: text, který František dodal 1. 10. 2026 (původně ve třetí osobě,
 * z profilu u Archer Reality). Tady je převedený do první osoby, aby
 * ladil se zbytkem webu („Napište mi“, „Ozvu se“) — obsah ani tvrzení
 * se neměnily.
 */
export const profile = {
  headline: "Prodej nemovitosti s jasnou",
  /** Slovo sázené serifovou kurzívou — ozvěna „Vision“ z loga. */
  headlineAccent: "vizí.",
  /** Věta, kterou se František představuje. */
  tagline: "Stratég, vyjednavač, marketér a profesionál s důrazem na detail.",
  lead: "Stratég, vyjednavač, marketér a profesionál s důrazem na detail. Každý prodej stavím na promyšleném postupu a jasně nastaveném cíli.",

  strategyTitle: "Strategie místo nahodilosti.",
  strategy:
    "Jsem analytik a stratég. Každý prodej stavím na promyšleném postupu, důsledném vyhodnocení situace a jasně nastaveném cíli. Neprodávám jen nemovitost — hledám nejlepší cestu k dosažení nejlepšího výsledku.",

  /** Co do spolupráce přináší, v pořadí podle dodaného textu. */
  qualities: [
    {
      title: "Technické uvažování a praktický pohled",
      text: "Díky zkušenostem z vedení továrny na nábytek mám silné technické zázemí, smysl pro design, konstrukční řešení i funkčnost prostoru. Na nemovitost se proto dívám nejen obchodně, ale i prakticky a technicky.",
    },
    {
      title: "Silné obchodní zkušenosti",
      text: "Působení na pozicích obchodního ředitele několika firem mi dalo vyjednávací dovednosti, orientaci na výsledek a schopnost hájit zájmy klienta. Umím pracovat s argumentací i emocemi trhu tak, aby obchod vedl k úspěšnému výsledku.",
    },
    {
      title: "Marketing, který zaujme",
      text: "Zkušenosti z role kreativního ředitele eventové agentury mi přinesly smysl pro prezentaci, práci s emocí, vizí a celkovým dojmem. Vím, jak nemovitost odlišit, správně ji představit trhu a zvýšit její atraktivitu pro správného kupujícího.",
    },
    {
      title: "Lidský přístup",
      text: "Reality pro mě nejsou jen obchod. Za každou nemovitostí stojí konkrétní lidé, jejich životní příběhy i důležitá rozhodnutí. Proto kladu důraz na důvěru, otevřenou komunikaci a respekt.",
    },
    {
      title: "Preciznost a důraz na detail",
      text: "Jako vystudovaný violoncellista přináším do své práce disciplínu, soustředění, smysl pro detail i schopnost dovést jemnou a náročnou práci až do perfektního finále.",
    },
  ],

  summaryTitle: "Komplexní přístup",
  summary:
    "Spojuji analytické myšlení, technické znalosti, obchodní zkušenosti, marketingový přesah a precizní provedení. Díky tomu dávám klientům víc než běžné zprostředkování — strategicky vedenou spolupráci, která má jasný směr i výsledek.",
} as const;
