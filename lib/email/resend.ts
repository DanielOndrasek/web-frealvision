import "server-only";

/**
 * Odesílání e-mailů přes Resend. Záměrně bez balíčku `resend` — potřebujeme
 * jediné volání a web má držet závislosti na minimu.
 *
 * Volitelné: bez `RESEND_API_KEY` a `EMAIL_FROM` se e-maily neposílají
 * a volající to musí umět přežít.
 */

const API_URL = "https://api.resend.com/emails";

/** Musí být adresa v doméně ověřené u Resendu, jinak Resend odpoví 403. */
const FROM_ADDRESS = process.env.EMAIL_FROM;

export const isEmailConfigured = Boolean(process.env.RESEND_API_KEY && FROM_ADDRESS);

export type SendResult = { ok: true } | { ok: false; error: string };

export async function sendEmail(input: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  /** Aby šlo odpovědět rovnou zájemci. */
  replyTo?: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !FROM_ADDRESS) {
    return { ok: false, error: "RESEND_API_KEY nebo EMAIL_FROM není nastavený" };
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        text: input.text,
        ...(input.html ? { html: input.html } : {}),
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `Resend odpověděl ${res.status}` };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "neznámá chyba",
    };
  }
}
