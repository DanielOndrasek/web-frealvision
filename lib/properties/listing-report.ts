import "server-only";
import { signBody } from "@/lib/leads/nemo1-webhook";
import {
  INTEGRATION_ID,
  LISTING_REPORT_URL,
  SECRET,
} from "@/lib/nemo1";
import { site } from "@/lib/site";
import { getAllListings, getFeedAdverts } from "./feed";
import { listingUrlReports, type ListingUrlReport } from "./listing-urls";

/**
 * web → Nemo1: adresa detailu nabídky.
 *
 * Slug skládá web, Nemo1 ho z feedu nezná. Bez hlášení nemá tisková karta
 * QR kód na web a v přehledu zveřejnění ani v reportu pro majitele chybí
 * odkaz. Kontrakt: tenant-case-stream/docs/stone-and-belter-integration.md,
 * kapitola 4.
 *
 * Web nemá databázi, takže si nepamatuje, co už nahlásil — hlásí pokaždé
 * všechny živé nabídky. Nemo1 opakované hlášení pozná podle `reported_at`
 * (viz `listingUrlReports`) a nic nezapisuje.
 */

const LOG = "[nemo1-odkazy]";

async function send(
  report: ListingUrlReport,
  integrationId: string,
  secret: string,
): Promise<number> {
  // Podpis musí sedět na přesné bajty těla — serializuje se jednou.
  const body = JSON.stringify(report);
  const res = await fetch(LISTING_REPORT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Nemo1-Integration-Id": integrationId,
      "X-Nemo1-Signature": signBody(body, secret),
    },
    body,
  });
  return res.status;
}

/** Chyba, po které nemá smysl posílat zbytek dávky. */
function stopsBatch(status: number): boolean {
  return status === 401 || status === 403 || status === 429 || status >= 500;
}

/**
 * Adresa webu je skutečná doména. Dokud `NEXT_PUBLIC_SITE_URL` není
 * nastavená, platí localhost (viz `lib/site.ts`) a takový odkaz do Nemo1
 * nepatří.
 */
function hasPublicDomain(): boolean {
  try {
    const { protocol, hostname } = new URL(site.url);
    return protocol === "https:" && hostname !== "localhost";
  } catch {
    return false;
  }
}

/**
 * Nahlásí adresy všech živých nabídek. Nikdy nevyhazuje — volá se přes
 * `after()` a nepovedené hlášení se zopakuje při další obnově stránky.
 */
export async function reportListingUrls(): Promise<void> {
  const integrationId = INTEGRATION_ID;
  const secret = SECRET;
  // Jen produkce: náhled nebo lokální build s jiným slugem by nahlásil
  // adresu, která na ostrém webu neexistuje.
  if (
    !integrationId ||
    !secret ||
    process.env.VERCEL_ENV !== "production" ||
    !hasPublicDomain()
  ) {
    return;
  }

  try {
    const [adverts, listings] = await Promise.all([
      getFeedAdverts(),
      getAllListings(),
    ]);
    const reports = listingUrlReports(adverts, listings, site.url);

    for (const report of reports) {
      const status = await send(report, integrationId, secret);
      if (status === 200) continue;
      if (stopsBatch(status)) {
        console.error(`${LOG} Nemo1 odpovědělo ${status}, zkusí se při další obnově`);
        return;
      }
      // 404/409: Nemo1 už inzerát na webu nemá, feed v cache je o chvíli starší.
      console.warn(`${LOG} inzerát ${report.advert_id}: Nemo1 odpovědělo ${status}`);
    }
  } catch (error) {
    console.error(
      `${LOG} hlášení selhalo:`,
      error instanceof Error ? error.message : "neznámá chyba",
    );
  }
}
