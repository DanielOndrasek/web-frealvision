"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CONSENT_LABEL } from "@/lib/gdpr";
import { site } from "@/lib/site";
import {
  CONDITIONS,
  CONSTRUCTIONS,
  DISPOSITIONS,
  FEATURES,
  KINDS,
  kindOf,
  type PropertyKind,
} from "@/lib/valuation";

interface FormState {
  kind: PropertyKind;
  isOwner: boolean;
  disposition: string;
  area: string;
  construction: string;
  condition: string;
  city: string;
  street: string;
  features: string[];
  details: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const EMPTY: FormState = {
  kind: "byt",
  isOwner: true,
  disposition: "",
  area: "",
  construction: "",
  condition: "",
  city: "",
  street: "",
  features: [],
  details: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

const STEPS = ["Nemovitost", "Parametry", "Lokalita", "Kontakt"] as const;

const fieldClass =
  "w-full rounded-md border border-line-strong bg-surface px-3.5 py-2.5 text-base text-ink " +
  "placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-subtle focus:outline-none";

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium">
      {children}
    </label>
  );
}

export function ValuationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const kind = kindOf(form.kind);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  /** Každý krok se ověří sám, ať člověk nedojde na konec a teprve tam se dozví chybu. */
  function validate(index: number): boolean {
    const found: Record<string, string> = {};

    if (index === 1) {
      const area = Number(form.area.replace(",", "."));
      if (!form.area.trim()) found.area = "Bez plochy odhad nespočítám.";
      else if (!Number.isFinite(area) || area <= 0) found.area = "Zadejte plochu číslem.";
      else if (area > 100000) found.area = "To vypadá na překlep.";
      if (kind.asksDisposition && !form.disposition) {
        found.disposition = "Vyberte dispozici.";
      }
    }

    if (index === 2 && !form.city.trim()) {
      found.city = "Napište alespoň město nebo obec.";
    }

    if (index === 3) {
      if (form.firstName.trim().length < 2) found.firstName = "Napište své jméno.";
      if (!form.email.trim() && !form.phone.trim()) {
        found.email = "Vyplňte e-mail nebo telefon.";
      } else if (
        form.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())
      ) {
        found.email = "E-mail nevypadá správně.";
      }
    }

    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      window.requestAnimationFrame(() => document.getElementById(first)?.focus());
    }
    return Object.keys(found).length === 0;
  }

  function next() {
    if (validate(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate(3)) return;

    const consent = new FormData(event.currentTarget).get("consent") === "on";
    if (!consent) {
      setErrors({ consent: "Bez souhlasu vám bohužel nemůžu odpovědět." });
      return;
    }

    setSending(true);
    setFailure(null);

    // Odhad je poptávka jako každá jiná — do Nemo1 jde čitelný přehled
    const summary = [
      `Žádost o odhad — ${kind.label}`,
      form.isOwner ? "Majitel nemovitosti" : "Není majitel",
      kind.asksDisposition && form.disposition ? `Dispozice: ${form.disposition}` : "",
      `${kind.areaLabel}: ${form.area} m²`,
      kind.asksConstruction && form.construction ? `Konstrukce: ${form.construction}` : "",
      form.condition ? `Stav: ${form.condition}` : "",
      `Lokalita: ${[form.street, form.city].filter(Boolean).join(", ")}`,
      form.features.length ? `Vybavení: ${form.features.join(", ")}` : "",
      form.details ? `\nDoplnění:\n${form.details}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await fetch("/api/poptavka", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "valuation",
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        message: summary,
        consent: true,
        sourceUrl: window.location.href,
      }),
    }).catch(() => null);

    const result = response ? await response.json().catch(() => ({})) : {};

    if (response?.ok) {
      setDone(true);
      return;
    }
    setFailure(
      result.error ??
        Object.values(result.errors ?? {})[0] ??
        "Odeslání se nepodařilo. Zkuste to prosím znovu.",
    );
    setSending(false);
  }

  if (done) {
    return (
      <div
        role="status"
        className="rounded-lg border border-ink bg-surface-subtle p-8"
      >
        <p className="text-lg font-semibold text-ink">
          Žádost o odhad odešla.
        </p>
        <p className="mt-2 text-ink-muted">
          Podklady si projdu a ozvu se s termínem, kdy odhad připravím.
          Spěchá-li to, zavolejte na{" "}
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
      aria-busy={sending}
      className="relative rounded-lg border border-line bg-surface p-6 sm:p-8"
    >
      {/* Kde jsem a kolik zbývá */}
      <ol className="flex flex-wrap gap-x-2 gap-y-1 text-xs font-medium">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              aria-current={i === step ? "step" : undefined}
              className={
                i === step
                  ? "text-accent-text"
                  : i < step
                    ? "text-ink-muted"
                    : "text-ink-subtle"
              }
            >
              {i + 1}. {label}
            </span>
            {i < STEPS.length - 1 ? (
              <span aria-hidden className="text-ink-subtle">
                ·
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
        <div
          className="h-full bg-accent transition-[width] duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {step === 0 ? (
          <>
            <fieldset>
              <legend className="text-sm font-medium">Co chcete ocenit?</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {KINDS.map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer border p-3 transition-colors duration-150 ${
                      form.kind === option.value
                        ? "border-accent bg-accent-subtle"
                        : "border-line hover:border-line-strong"
                    }`}
                  >
                    <input
                      type="radio"
                      name="kind"
                      value={option.value}
                      checked={form.kind === option.value}
                      onChange={() => set("kind", option.value)}
                      className="sr-only"
                    />
                    <span className="block font-semibold">{option.label}</span>
                    <span className="mt-0.5 block text-xs text-ink-muted">
                      {option.hint}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-medium">
                Jste majitel nemovitosti?
              </legend>
              <div className="mt-3 flex gap-2">
                {[true, false].map((value) => (
                  <label
                    key={String(value)}
                    className={`cursor-pointer border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                      form.isOwner === value
                        ? "border-accent bg-accent-subtle"
                        : "border-line hover:border-line-strong"
                    }`}
                  >
                    <input
                      type="radio"
                      name="isOwner"
                      checked={form.isOwner === value}
                      onChange={() => set("isOwner", value)}
                      className="sr-only"
                    />
                    {value ? "Ano" : "Ne"}
                  </label>
                ))}
              </div>
              {/* Podmínky se mění podle odpovědi, ať to není překvapení až na konci */}
              <p className="mt-3 text-sm text-ink-muted">
                {form.isOwner
                  ? "Pro majitele připravím odhad zdarma."
                  : "Odhad pro jiné než majitele zdarma není — podmínky domluvíme předem."}
              </p>
            </fieldset>
          </>
        ) : null}

        {step === 1 ? (
          <>
            {kind.asksDisposition ? (
              <div>
                <Label htmlFor="disposition">Dispozice</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DISPOSITIONS.map((value) => (
                    <label
                      key={value}
                      className={`cursor-pointer border px-3.5 py-1.5 text-sm transition-colors duration-150 ${
                        form.disposition === value
                          ? "border-accent bg-accent text-ink-inverse"
                          : "border-line text-ink-muted hover:border-line-strong"
                      }`}
                    >
                      <input
                        type="radio"
                        name="disposition"
                        checked={form.disposition === value}
                        onChange={() => set("disposition", value)}
                        className="sr-only"
                      />
                      {value}
                    </label>
                  ))}
                </div>
                {errors.disposition ? (
                  <p className="mt-2 text-xs text-danger">
                    {errors.disposition}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div>
              <Label htmlFor="area">{kind.areaLabel}</Label>
              <div className="relative mt-1.5">
                <input
                  id="area"
                  inputMode="decimal"
                  value={form.area}
                  onChange={(e) => set("area", e.target.value)}
                  aria-invalid={Boolean(errors.area)}
                  className={`${fieldClass} tnum pr-12`}
                  placeholder="např. 68"
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-ink-subtle">
                  m²
                </span>
              </div>
              <p className="mt-1.5 text-xs text-ink-subtle">
                Jen plocha k bydlení. Balkon, terasu a sklep zaškrtnete níž.
              </p>
              {errors.area ? (
                <p className="mt-1.5 text-xs text-danger">{errors.area}</p>
              ) : null}
            </div>

            {kind.asksConstruction ? (
              <div>
                <Label htmlFor="construction">Konstrukce</Label>
                <select
                  id="construction"
                  value={form.construction}
                  onChange={(e) => set("construction", e.target.value)}
                  className={`${fieldClass} mt-1.5`}
                >
                  <option value="">Nevím / neuvádím</option>
                  {CONSTRUCTIONS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div>
              <Label htmlFor="condition">Stav</Label>
              <select
                id="condition"
                value={form.condition}
                onChange={(e) => set("condition", e.target.value)}
                className={`${fieldClass} mt-1.5`}
              >
                <option value="">Nevím / neuvádím</option>
                {CONDITIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <fieldset>
              <legend className="text-sm font-medium">
                Co k nemovitosti patří
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {FEATURES.map((value) => {
                  const active = form.features.includes(value);
                  return (
                    <label
                      key={value}
                      className={`cursor-pointer border px-3.5 py-1.5 text-sm transition-colors duration-150 ${
                        active
                          ? "border-accent bg-accent text-ink-inverse"
                          : "border-line text-ink-muted hover:border-line-strong"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() =>
                          set(
                            "features",
                            active
                              ? form.features.filter((f) => f !== value)
                              : [...form.features, value],
                          )
                        }
                        className="sr-only"
                      />
                      {value}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div>
              <Label htmlFor="city">Město nebo obec</Label>
              <input
                id="city"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                aria-invalid={Boolean(errors.city)}
                autoComplete="address-level2"
                className={`${fieldClass} mt-1.5`}
                placeholder="např. Praha 6 – Vokovice"
              />
              {errors.city ? (
                <p className="mt-1.5 text-xs text-danger">{errors.city}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="street">Ulice a číslo popisné</Label>
              <input
                id="street"
                value={form.street}
                onChange={(e) => set("street", e.target.value)}
                autoComplete="street-address"
                className={`${fieldClass} mt-1.5`}
                placeholder="nepovinné, ale odhad bude přesnější"
              />
            </div>

            <div>
              <Label htmlFor="details">Co ještě může cenu ovlivnit</Label>
              <textarea
                id="details"
                rows={4}
                value={form.details}
                onChange={(e) => set("details", e.target.value)}
                maxLength={2000}
                className={`${fieldClass} mt-1.5 resize-y`}
                placeholder="Patro, orientace, výhled, hlučná ulice, nedostatky, cokoliv dalšího."
              />
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div aria-hidden className="absolute -left-[9999px]">
              <label htmlFor="val-website">Nevyplňujte</label>
              <input id="val-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">Jméno</Label>
                <input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  aria-invalid={Boolean(errors.firstName)}
                  autoComplete="given-name"
                  className={`${fieldClass} mt-1.5`}
                />
                {errors.firstName ? (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.firstName}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="lastName">Příjmení</Label>
                <input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  autoComplete="family-name"
                  className={`${fieldClass} mt-1.5`}
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  className={`${fieldClass} mt-1.5`}
                />
                {errors.email ? (
                  <p className="mt-1.5 text-xs text-danger">{errors.email}</p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  autoComplete="tel"
                  className={`${fieldClass} mt-1.5`}
                />
              </div>
            </div>

            {/* Přehled před odesláním — ať nikdo neposílá něco, co nechtěl */}
            <dl className="rounded-md border border-line bg-surface-subtle p-4 text-sm">
              <div className="flex justify-between gap-4 py-1">
                <dt className="text-ink-muted">Nemovitost</dt>
                <dd className="text-right font-medium">
                  {kind.label}
                  {form.disposition ? `, ${form.disposition}` : ""}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <dt className="text-ink-muted">{kind.areaLabel}</dt>
                <dd className="tnum text-right font-medium">{form.area} m²</dd>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <dt className="text-ink-muted">Lokalita</dt>
                <dd className="text-right font-medium">
                  {[form.street, form.city].filter(Boolean).join(", ")}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <dt className="text-ink-muted">Cena odhadu</dt>
                <dd className="text-right font-medium">
                  {form.isOwner ? "zdarma" : "dle domluvy"}
                </dd>
              </div>
            </dl>

            <div>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  name="consent"
                  className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]"
                />
                <span className="text-ink-muted">
                  {CONSENT_LABEL}{" "}
                  <Link
                    href="/ochrana-osobnich-udaju"
                    className="text-accent-text underline underline-offset-4"
                  >
                    Jak s nimi nakládám
                  </Link>
                  .
                </span>
              </label>
              {errors.consent ? (
                <p className="mt-1.5 text-xs text-danger">{errors.consent}</p>
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
          </>
        ) : null}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm font-medium text-ink-muted disabled:invisible hover:text-ink"
        >
          ← Zpět
        </button>

        {step < STEPS.length - 1 ? (
          <Button type="button" size="lg" onClick={next}>
            Pokračovat
          </Button>
        ) : (
          <Button type="submit" variant="solid" size="lg" disabled={sending}>
            {sending ? "Odesílám…" : "Odeslat žádost"}
          </Button>
        )}
      </div>
    </form>
  );
}
