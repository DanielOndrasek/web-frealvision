import type { BadgeTone } from "@/components/ui/Badge";
import type { Listing } from "./types";

/**
 * Štítek stavu nabídky. Znění se řídí typem inzerátu — u pronájmu nedává
 * „V prodeji“ ani „Prodáno“ smysl, ale stav sám je pro obojí stejný.
 *
 * Barva na typu nezávisí: aktivní je zelená, ať se prodává, nebo pronajímá.
 */
const TEXTS: Record<Listing["adType"], Record<Listing["state"], string>> = {
  prodej: {
    active: "V prodeji",
    reserved: "Rezervováno",
    sold: "Prodáno",
  },
  pronajem: {
    active: "K pronájmu",
    reserved: "Rezervováno",
    sold: "Pronajato",
  },
};

const TONES: Record<Listing["state"], BadgeTone> = {
  active: "active",
  reserved: "reserved",
  sold: "sold",
};

export function stateBadge(
  listing: Pick<Listing, "state" | "adType">,
): { text: string; tone: BadgeTone } {
  return {
    text: TEXTS[listing.adType][listing.state],
    tone: TONES[listing.state],
  };
}
