import { isVisualization } from "@/components/property/PropertyGallery";
import { PropertyFloorPlanGrid } from "@/components/property/PropertyFloorPlanGrid";
import type { Listing, Photo } from "@/lib/properties/types";

/**
 * Titulek pod půdorysem z popisu v Nemo1. „Půdorys přízemí“ → „Přízemí“ —
 * slovo „půdorys“ už nese nadpis sekce. Samotný „Půdorys“ titulek nemá.
 */
function caption(plan: Photo): string | null {
  const rest = plan.description?.replace(/^\s*p[uů]dorys\s*[-–:,]?\s*/i, "").trim();
  if (!rest) return null;
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

function altFor(plan: Photo, listing: Listing, index: number, total: number): string {
  const floor = caption(plan);
  const which = floor ? ` – ${floor.toLowerCase()}` : total > 1 ? ` ${index + 1}` : "";
  return `Půdorys${which}, ${listing.title}`;
}

/**
 * Sekce „Půdorys“ v detailu nabídky.
 *
 * Výkres se neořezává: bílá plocha a celý obrázek uvnitř, bez ohledu na
 * poměr stran. V galerii to nešlo — ta ořezává na 16:10 a 4:3, což u fotky
 * pokoje nevadí, ale z půdorysu usekne kus dispozice.
 *
 * Jako galerie zůstává serverová a klientovi předává jen to, co mřížka
 * a prohlížeč potřebují — ne celý `listing` včetně surového inzerátu.
 */
export function PropertyFloorPlans({ listing }: { listing: Listing }) {
  const plans = listing.floorPlans;
  if (plans.length === 0) return null;

  return (
    <section aria-labelledby="pudorys">
      <h2 id="pudorys" className="text-2xl font-semibold tracking-tight">
        {plans.length > 1 ? "Půdorysy" : "Půdorys"}
      </h2>
      <PropertyFloorPlanGrid
        plans={plans}
        alts={plans.map((plan, i) => altFor(plan, listing, i, plans.length))}
        captions={plans.map(caption)}
        visualizations={plans.flatMap((plan, i) => (isVisualization(plan) ? [i] : []))}
      />
    </section>
  );
}
