"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import type { Photo } from "@/lib/properties/types";

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={direction === "left" ? "" : "rotate-180"}
    >
      <path
        d="M15 5 8 12l7 7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Šipka nad fotkou. Sedí na kraji snímku, ne pod ním — na mobilu se palec
 * nemusí stěhovat přes celou obrazovku a na počítači je ovládání tam, kam
 * se člověk dívá.
 *
 * Tap na šipku doputuje i na plochu pod ní, kde visí přejetí prstem. Nevadí:
 * klepnutí nikam neujede a prahová vzdálenost gesto zahodí.
 */
function Sipka({
  smer,
  popis,
  onClick,
}: {
  smer: "left" | "right";
  popis: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={popis}
      className={`absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-12 ${
        smer === "left" ? "left-2 sm:left-4" : "right-2 sm:right-4"
      }`}
    >
      <Chevron direction={smer} />
    </button>
  );
}

/**
 * Co se v prohlížeči zobrazuje. Půdorysy jsou většinou PNG s průhledným
 * pozadím a černými čarami — na černé ploše by z nich nebylo vidět nic,
 * proto dostanou bílou.
 */
const VARIANTY = {
  fotografie: {
    dialog: "Prohlížeč fotografií",
    zpet: "Předchozí fotografie",
    dal: "Další fotografie",
    plocha: "",
  },
  pudorys: {
    dialog: "Prohlížeč půdorysů",
    zpet: "Předchozí půdorys",
    dal: "Další půdorys",
    plocha: "bg-white",
  },
} as const;

/**
 * Prohlížeč fotek na celou obrazovku.
 *
 * Postavený na nativním `<dialog>`: `showModal()` dává past na fokus,
 * zavření Escapem a inertní pozadí bez jediné řádky navíc. Knihovna na
 * lightbox by kvůli tomuhle přinesla desítky kilobajtů a vlastní a11y bugy.
 *
 * Komponenta žije jen po dobu, kdy je prohlížeč otevřený — mřížka ji odmountuje
 * při zavření. Díky tomu si výchozí fotku vezme `useState` při vzniku a není
 * potřeba ji dosazovat efektem; `setState` v efektu React 19 zakazuje a stálo
 * by to kaskádu překreslení.
 *
 * Pořadí fotek je pořadí z inzerátu — indexy míří přímo do `photos`, nikde
 * se nepřerovnává ani nefiltruje. Kdyby se tu cokoli přeskládalo, rozešel by
 * se náhled s prohlížečem a klient by po kliknutí na třetí fotku uviděl jinou.
 */
export function PropertyLightbox({
  photos,
  alts,
  visualizations,
  initialIndex,
  onClose,
  varianta = "fotografie",
}: {
  photos: Photo[];
  /** Alt texty ze sazby — počítá je server, ať jsou v HTML i v prohlížeči stejné. */
  alts: string[];
  /** Indexy fotek, které jsou AI vizualizace. */
  visualizations: number[];
  /** Fotka, na které se prohlížeč otevře. */
  initialIndex: number;
  onClose: () => void;
  varianta?: keyof typeof VARIANTY;
}) {
  const texty = VARIANTY[varianta];
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(initialIndex);
  const dotyk = useRef<number | null>(null);

  // `onClose` chodí z mřížky jako nová funkce při každém překreslení. Kdyby
  // viselo v závislostech efektu, efekt by běžel pořád dokola a `showModal()`
  // na už otevřeném dialogu vyhodí InvalidStateError.
  const zavrit = useRef(onClose);
  useEffect(() => {
    zavrit.current = onClose;
  });

  /**
   * Jediná cesta ven. Zavře dialog i stav v mřížce.
   *
   * Na událost `close` se nedá spolehnout: nebublá, takže ji delegovaný
   * posluchač Reactu nechytí, a některé prohlížeče (mimo jiné ten
   * v našem náhledu) ji po `close()` nevyvolají vůbec. Kdyby stav v mřížce
   * viselo jen na ní, Escape by prohlížeč zavřel očima, ale `openAt` by
   * zůstalo nastavené — galerie by šla otevřít jen jednou a stránka by
   * zůstala zamčená proti rolování.
   */
  const zavri = useCallback(() => {
    dialog.current?.close();
    zavrit.current();
  }, []);

  const pocet = photos.length;
  const dal = useCallback(() => setIndex((i) => (i + 1) % pocet), [pocet]);
  const zpet = useCallback(() => setIndex((i) => (i - 1 + pocet) % pocet), [pocet]);

  // Otevřít modálně a zamknout rolování stránky za sebou. `<dialog>` sice
  // pozadí zneaktivní, ale scroll pod ním nechá běžet a na mobilu to působí
  // jako rozbité.
  //
  // Nativní `close` je tu jen pojistka pro cesty, které si prohlížeč zavře
  // sám. Hlavní cesta ven je `zavri`.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;

    el.showModal();
    const puvodni = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const naZavreni = () => zavrit.current();
    el.addEventListener("close", naZavreni);
    return () => {
      el.removeEventListener("close", naZavreni);
      document.body.style.overflow = puvodni;
    };
  }, []);

  if (pocet === 0) return null;

  return (
    <dialog
      ref={dialog}
      aria-label={texty.dialog}
      onKeyDown={(e) => {
        // Escape obsloužíme sami, ať jde zavření pokaždé přes `zavri`.
        // `keydown` bublá, takže tenhle posluchač Escape spolehlivě dostane.
        if (e.key === "Escape") {
          e.preventDefault();
          zavri();
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          dal();
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          zpet();
        }
      }}
      className="h-full max-h-full w-full max-w-full bg-transparent backdrop:bg-black/90"
    >
      <div className="flex h-full flex-col bg-black/90 text-white">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <p className="text-sm tabular-nums" aria-live="polite">
            {index + 1} / {pocet}
          </p>
          <button
            type="button"
            onClick={zavri}
            className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Zavřít
          </button>
        </div>

        <div
          className={`relative min-h-0 flex-1 ${texty.plocha}`}
          // Přejetí prstem na mobilu. Prahová hodnota je schválně vysoká:
          // menší pohyb bývá nepovedený klik, ne gesto.
          onTouchStart={(e) => {
            dotyk.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const od = dotyk.current;
            const kam = e.changedTouches[0]?.clientX;
            dotyk.current = null;
            if (od === null || kam === undefined) return;
            if (Math.abs(kam - od) < 50) return;
            if (kam < od) dal();
            else zpet();
          }}
        >
          <Image
            key={photos[index].url}
            src={photos[index].url}
            alt={alts[index] ?? ""}
            fill
            sizes="100vw"
            // Bez `eager` se fotka nenačte vůbec. `next/image` dává obrázkům
            // `loading="lazy"` a línému načítání se `<dialog>` v top layeru
            // vyhodnotí jako neviditelný — prohlížeč fotku ani nezažádá
            // a klient kouká na černou plochu. Tady je líné načítání stejně
            // k ničemu: vykresluje se jen fotka, na kterou se právě dívá.
            loading="eager"
            className="object-contain"
          />
          {visualizations.includes(index) ? (
            <div className="absolute bottom-3 left-3">
              <Badge tone="dark">Vizualizace</Badge>
            </div>
          ) : null}
          {pocet > 1 ? (
            <>
              <Sipka smer="left" popis={texty.zpet} onClick={zpet} />
              <Sipka smer="right" popis={texty.dal} onClick={dal} />
            </>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
