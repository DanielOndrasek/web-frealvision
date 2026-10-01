import { profile } from "@/lib/profile";

/**
 * Co makléř přináší — řádky jako v technickém listu: pořadové číslo
 * serifovou kurzívou, název, text. Na rozdíl od mřížky snese libovolný
 * počet položek i delší texty.
 */
export function Qualities() {
  return (
    <ol className="border-b border-line">
      {profile.qualities.map((quality, i) => (
        <li
          key={quality.title}
          className="grid gap-x-10 gap-y-3 border-t border-line py-8 sm:grid-cols-[4rem_1fr] lg:grid-cols-[4rem_minmax(0,0.9fr)_minmax(0,1.3fr)] lg:py-10"
        >
          <span aria-hidden className="tnum font-serif text-4xl leading-none italic">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="text-xl font-semibold sm:text-2xl lg:leading-snug">
            {quality.title}
          </h3>
          <p className="leading-relaxed text-ink-muted sm:col-start-2 lg:col-start-3 lg:row-start-1">
            {quality.text}
          </p>
        </li>
      ))}
    </ol>
  );
}
