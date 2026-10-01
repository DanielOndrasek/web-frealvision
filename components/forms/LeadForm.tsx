"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CONSENT_LABEL } from "@/lib/gdpr";
import { site } from "@/lib/site";
import type { WebLeadKind } from "@/lib/leads/lead";

type Errors = Record<string, string>;

const fieldClass =
  "w-full rounded-md border border-line-strong bg-surface px-3.5 py-2.5 text-[15px] text-ink " +
  "placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-subtle focus:outline-none " +
  "aria-[invalid=true]:border-danger";

function Field({
  id,
  label,
  error,
  children,
  hint,
  required = false,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium tracking-wide text-ink-muted"
      >
        {label}
        {required ? (
          <span className="text-danger" aria-hidden>
            {" *"}
          </span>
        ) : null}
      </label>
      <div className="mt-1">{children}</div>
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1 text-[11px] text-ink-subtle">
          {hint}
        </p>
      ) : null}
      {/* role=alert, aby čtečka chybu oznámila hned, ne až při dalším tabu */}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-[11px] text-danger"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function LeadForm({
  kind,
  advertId,
  submitLabel = "Odeslat",
  messagePlaceholder = "Co potřebujete vědět?",
  compact = false,
}: {
  /**
   * Který formulář to je. Povinné — podle toho se poptávka rozliší v CRM
   * i v notifikaci, a odvozovat to z přítomnosti inzerátu se neosvědčilo.
   */
  kind: Extract<WebLeadKind, "viewing" | "contact">;
  advertId?: string;
  submitLabel?: string;
  messagePlaceholder?: string;
  /** Užší varianta do postranního panelu — pole pod sebou a menší. */
  compact?: boolean;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setErrors({});
    setFailure(null);

    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/poptavka", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        fullName: data.get("fullName"),
        email: data.get("email"),
        phone: data.get("phone"),
        message: data.get("message"),
        consent: data.get("consent") === "on",
        website: data.get("website"),
        advertId,
        sourceUrl: window.location.href,
      }),
    }).catch(() => null);

    if (!response) {
      setFailure("Spojení se nezdařilo. Zkuste to prosím znovu.");
      setState("idle");
      return;
    }

    const result = await response.json().catch(() => ({}));

    if (response.ok) {
      setState("done");
      return;
    }
    if (result.errors) {
      setErrors(result.errors);
      // Bez tohohle zůstane člověk u tlačítka a chybu nahoře nevidí
      const first = Object.keys(result.errors)[0];
      if (first) {
        window.requestAnimationFrame(() => {
          document.getElementById(first)?.focus();
        });
      }
    }
    if (result.error) setFailure(result.error);
    setState("idle");
  }

  if (state === "done") {
    return (
      <div
        role="status"
        className="rounded-md border border-ink bg-surface-subtle p-5"
      >
        <p className="font-semibold text-ink">Poptávka odešla.</p>
        <p className="mt-2 text-sm text-ink-muted">
          Ozvu se co nejdřív. Pokud to spěchá,
          zavolejte na{" "}
          <a href={site.phoneHref} className="font-medium underline">
            {site.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={state === "sending"}
      className={`relative flex flex-col ${compact ? "gap-2.5" : "gap-3.5"}`}
    >
      {/* Past na roboty. Skrytá před lidmi i před čtečkami. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="website">Nevyplňujte</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="fullName" label="Jméno a příjmení" error={errors.fullName} required>
        <input
          id="fullName"
          name="fullName"
          required
          autoComplete="name"
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          className={fieldClass}
        />
      </Field>

      <div className={compact ? "flex flex-col gap-2.5" : "grid gap-3.5 sm:grid-cols-2"}>
        <Field id="email" label="E-mail" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass}
          />
        </Field>
        <Field id="phone" label="Telefon" hint="Stačí jedno z obou.">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-describedby="phone-hint"
            className={fieldClass}
          />
        </Field>
      </div>

      <Field id="message" label="Zpráva">
        <textarea
          id="message"
          name="message"
          rows={compact ? 2 : 3}
          maxLength={5000}
          placeholder={messagePlaceholder}
          className={`${fieldClass} resize-y`}
        />
      </Field>

      <div>
        <label className="flex items-start gap-2.5 text-xs leading-relaxed">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={Boolean(errors.consent)}
            className="mt-0.5 size-3.5 shrink-0 accent-[var(--color-accent)]"
          />
          <span className="text-ink-muted">
            {CONSENT_LABEL}{" "}
            <Link
              href="/ochrana-osobnich-udaju"
              className="text-accent-text underline underline-offset-2"
            >
              Jak s nimi nakládám
            </Link>
            .
          </span>
        </label>
        {errors.consent ? (
          <p className="mt-1 text-[11px] text-danger">{errors.consent}</p>
        ) : null}
      </div>

      {failure ? (
        <p
          role="alert"
          className="rounded-sm border border-danger bg-danger-bg px-4 py-3 text-sm text-danger"
        >
          {failure}
        </p>
      ) : null}

      <div>
        <Button
          type="submit"
          variant="solid"
          size={compact ? "md" : "lg"}
          disabled={state === "sending"}
          className={compact ? "w-full justify-center" : undefined}
        >
          {state === "sending" ? "Odesílám…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
