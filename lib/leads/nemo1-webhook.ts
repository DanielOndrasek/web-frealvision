import { createHmac } from "node:crypto";
import type { Nemo1LeadPayload } from "./lead";

/**
 * Doručení poptávky do `website-lead-webhook` v Nemo1.
 *
 * Autentizace podle `_shared/webIntegrationAuth.ts`: veřejné ID integrace
 * v hlavičce a HMAC-SHA256 nad PŘESNÝMI bajty těla, klíčem je stejné
 * tajemství, jakým se web prokazuje u feedu. Tělo se proto serializuje
 * jednou a stejný řetězec se podepíše i odešle.
 *
 * Závislosti se předávají parametrem, aby šel modul testovat bez sítě.
 */

export function signBody(raw: string, secret: string): string {
  return `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}`;
}

export type DeliveryResult =
  | {
      stored: true;
      /** Nemo1 už poptávku se stejným `external_id` má. */
      duplicate: boolean;
      /** Inzerát mezitím zmizel, poptávka odešla jako obecný dotaz. */
      downgraded: boolean;
    }
  | { stored: false; reason: string };

export interface DeliveryOptions {
  url: string;
  integrationId: string;
  secret: string;
  fetchImpl?: typeof fetch;
  /** Pauza před opakováním po 429 / 5xx. */
  retryDelayMs?: number;
}

type Attempt = { status: number } | { status: "network" };

async function post(
  payload: Nemo1LeadPayload,
  options: DeliveryOptions,
): Promise<Attempt> {
  const raw = JSON.stringify(payload);
  const doFetch = options.fetchImpl ?? fetch;
  try {
    const res = await doFetch(options.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Nemo1-Integration-Id": options.integrationId,
        "X-Nemo1-Signature": signBody(raw, options.secret),
      },
      body: raw,
    });
    return { status: res.status };
  } catch {
    return { status: "network" };
  }
}

function retryable(attempt: Attempt): boolean {
  return (
    attempt.status === "network" ||
    attempt.status === 429 ||
    attempt.status >= 500
  );
}

/**
 * Jeden pokus a nanejvýš jedno opakování — formulář čeká na odpověď,
 * delší fronta patří na stranu Nemo1, ne do požadavku návštěvníka.
 *
 * 404 u poptávky s inzerátem znamená, že inzerát mezi vykreslením stránky
 * a odesláním přestal být aktivní (stránky se obnovují po pěti minutách).
 * Kontakt se kvůli tomu nesmí ztratit: odejde znovu jako obecný dotaz,
 * adresa stránky v `source_url` řekne, o kterou nemovitost šlo.
 */
export async function deliverLead(
  payload: Nemo1LeadPayload,
  options: DeliveryOptions,
): Promise<DeliveryResult> {
  let current = payload;
  let downgraded = false;
  let retried = false;

  for (;;) {
    const attempt = await post(current, options);

    if (attempt.status === 200 || attempt.status === 201) {
      return { stored: true, duplicate: attempt.status === 200, downgraded };
    }

    if (attempt.status === 404 && current.advert_id && !downgraded) {
      const general: Nemo1LeadPayload = { ...current, form_kind: "contact" };
      delete general.advert_id;
      current = general;
      downgraded = true;
      continue;
    }

    if (retryable(attempt) && !retried) {
      retried = true;
      await new Promise((resolve) => setTimeout(resolve, options.retryDelayMs ?? 400));
      continue;
    }

    return {
      stored: false,
      reason:
        attempt.status === "network"
          ? "Nemo1 nedostupné"
          : `Nemo1 odpovědělo ${attempt.status}`,
    };
  }
}
