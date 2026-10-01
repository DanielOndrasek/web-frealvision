import type { Photo } from "./types";

/**
 * Půdorysy mezi fotkami.
 *
 * Nemo1 posílá půdorys jako obyčejnou fotku s kategorií „2D půdorys“ —
 * samostatné pole `floor_plans` je v praxi prázdné. V galerii se výkres
 * ořezával na 16:10 a 4:3 a usekl se kus dispozice. Detail nabídky mu
 * proto dává vlastní sekci a galerie ani karty ve výpisu ho nevidí.
 *
 * Pozná se jen podle textu, který k fotce někdo napsal: kategorie a popis
 * z Nemo1 a název souboru. Podle obsahu obrázku se
 * nehádá — půdorys nahraný jako „Nezařazeno“ a bez popisu zůstane v galerii
 * a je potřeba mu v Nemo1 nastavit kategorii.
 */
const FLOOR_PLAN = /p[uů]dorys/i;

export function looksLikeFloorPlan(
  ...texts: Array<string | null | undefined>
): boolean {
  return texts.some((text) => text != null && FLOOR_PLAN.test(text));
}

/** Půdorys, o kterém víme jen adresu — z pole `floor_plans` nebo `floorPlan`. */
export function floorPlanFromUrl(url: string): Photo {
  return { url, description: null, category: null, is_cover: false };
}

/**
 * Rozdělí fotky na galerii a půdorysy. Pořadí v obou zůstává z inzerátu.
 * Půdorysy z odděleného pole se přidají na konec, bez duplicit.
 */
export function splitFloorPlans(
  photos: Photo[],
  isFloorPlan: (photo: Photo) => boolean,
  separate: Photo[] = [],
): { photos: Photo[]; floorPlans: Photo[] } {
  const gallery: Photo[] = [];
  const floorPlans: Photo[] = [];
  for (const photo of photos) {
    (isFloorPlan(photo) ? floorPlans : gallery).push(photo);
  }

  const known = new Set(floorPlans.map((p) => p.url));
  for (const plan of separate) {
    if (known.has(plan.url)) continue;
    known.add(plan.url);
    floorPlans.push(plan);
  }

  return { photos: gallery, floorPlans };
}

/**
 * Titulní fotka. Karta ve výpisu má ukázat nemovitost, ne výkres — i když
 * je půdorys v Nemo1 omylem označený jako titulní. Půdorys se použije, jen
 * když nabídka žádnou jinou fotku nemá.
 */
export function pickCover(photos: Photo[], floorPlans: Photo[]): Photo | null {
  return photos.find((p) => p.is_cover) ?? photos[0] ?? floorPlans[0] ?? null;
}
