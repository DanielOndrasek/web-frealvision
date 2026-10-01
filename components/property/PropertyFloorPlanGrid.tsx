"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { PropertyLightbox } from "@/components/property/PropertyLightbox";
import type { Photo } from "@/lib/properties/types";

export function PropertyFloorPlanGrid({
  plans,
  alts,
  captions,
  visualizations,
}: {
  plans: Photo[];
  alts: string[];
  captions: Array<string | null>;
  visualizations: number[];
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const single = plans.length === 1;

  return (
    <>
      {/* Dva půdorysy (přízemí a patro) vedle sebe, ať jdou porovnat. */}
      <div className={`mt-6 grid gap-4 ${single ? "" : "sm:grid-cols-2"}`}>
        {plans.map((plan, index) => (
          // Klíč nese index, ne URL — feed umí poslat tutéž fotku dvakrát.
          <figure key={`${index}-${plan.url}`}>
            <button
              type="button"
              onClick={() => setOpenAt(index)}
              aria-label={`Zvětšit: ${alts[index]}`}
              className="group relative block aspect-4/3 w-full cursor-zoom-in overflow-hidden rounded-md border border-line bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
            >
              <Image
                src={plan.url}
                alt={alts[index]}
                fill
                sizes={single ? "(max-width: 1024px) 100vw, 800px" : "(max-width: 640px) 100vw, 400px"}
                // Padding drží čáry výkresu od rámečku. `object-contain`
                // pracuje s obsahovou plochou, takže se obrázek jen zmenší.
                className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
              />
              {visualizations.includes(index) ? (
                <span className="absolute bottom-2 left-2">
                  <Badge tone="dark">Vizualizace</Badge>
                </span>
              ) : null}
            </button>
            {captions[index] ? (
              <figcaption className="mt-2 text-sm text-ink-muted">
                {captions[index]}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {openAt !== null ? (
        <PropertyLightbox
          photos={plans}
          alts={alts}
          visualizations={visualizations}
          initialIndex={openAt}
          onClose={() => setOpenAt(null)}
          varianta="pudorys"
        />
      ) : null}
    </>
  );
}
