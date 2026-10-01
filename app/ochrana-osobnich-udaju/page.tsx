import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { controller, CONSENT_VERSION } from "@/lib/gdpr";
import { site } from "@/lib/site";
import { isEmailConfigured } from "@/lib/email/resend";

export const metadata: Metadata = {
  title: "Zpracování osobních údajů",
  description:
    "Jaké údaje o vás zpracovávám, proč, jak dlouho a komu je předávám. Stručně a bez právničiny.",
  alternates: { canonical: "/ochrana-osobnich-udaju" },
};

const rights = [
  ["na přístup", "můžete chtít vědět, co o vás vedu"],
  ["na opravu", "když je něco špatně, opravím to"],
  ["na výmaz", "smažu vše, co nemusím ze zákona držet"],
  ["na omezení zpracování", "můžete ho pozastavit, dokud se něco nevyjasní"],
  ["na přenositelnost", "pošlu vám vaše údaje ve strojově čitelné podobě"],
  ["vznést námitku", "proti zpracování z oprávněného zájmu"],
  ["odvolat souhlas", "kdykoliv, jedním e-mailem, bez udání důvodu"],
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Právní informace"
        title="Zpracování osobních údajů"
        lead="Co o vás vedu, proč to potřebuji a jak dlouho si to nechávám. Bez zbytečné právničiny."
      />

      <Container size="narrow">
        <div className="py-16 text-lg leading-relaxed sm:py-20">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              Kdo údaje zpracovává
            </h2>
            <p className="mt-4">
              Správcem je společnost <strong>{controller.name}</strong>
              {controller.ico ? (
                <>
                  , IČO <span className="tnum">{controller.ico}</span>
                </>
              ) : null}
              {controller.address ? <>, se sídlem {controller.address}</> : null}
              . Pověřence pro ochranu osobních údajů ustanoveného nemáme — ve
              všem se obracejte přímo na mě.
            </p>
            <p className="mt-4">
              E-mail{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-medium text-accent-text underline underline-offset-4"
              >
                {site.email}
              </a>
              , telefon{" "}
              <a
                href={site.phoneHref}
                className="tnum font-medium text-accent-text underline underline-offset-4"
              >
                {site.phone}
              </a>
              .
            </p>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">
              Jaké údaje a proč
            </h2>
            <p className="mt-4">
              Když mi pošlete poptávku, zpracovávám <strong>jméno</strong>,{" "}
              <strong>e-mail</strong>, <strong>telefon</strong> a{" "}
              <strong>text zprávy</strong>. K tomu čas odeslání a adresu
              stránky, ze které jste formulář odeslali — abych věděl, které
              nemovitosti se dotaz týká.
            </p>
            <p className="mt-4">
              Jediný účel je <strong>vyřídit vaši poptávku</strong> a ozvat se
              vám zpět. K ničemu jinému údaje nepoužívám a nikomu je neprodávám.
            </p>
            <p className="mt-4">
              Právním základem je{" "}
              <strong>váš souhlas</strong> u formuláře, případně{" "}
              <strong>jednání o smlouvě</strong>, pokud spolupráce naváže.
            </p>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">
              Jak dlouho si je nechávám
            </h2>
            <p className="mt-4">
              Poptávku, která nevedla ke spolupráci, mažu{" "}
              <strong>po {controller.retention}</strong>. Když spolupráce
              vznikne, drží se údaje po dobu jejího trvání a pak po zákonné
              lhůty, které mi ukládají daňové a účetní předpisy.
            </p>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">
              Komu se údaje dostanou
            </h2>
            <p className="mt-4">
              Jen zpracovatelům, bez kterých by web a evidence poptávek
              nefungovaly:
            </p>
            <ul className="mt-5 flex list-disc flex-col gap-2 pl-6 marker:text-dot">
              <li>
                <strong>Vercel</strong> — provoz tohoto webu
              </li>
              <li>
                <strong>Nemo1</strong> — systém pro evidenci klientů a nabídek,
                ve kterém poptávka skončí (běží na infrastruktuře Supabase)
              </li>
              {isEmailConfigured ? (
                <li>
                  <strong>Resend</strong> — záložní e-mail, kdyby se poptávka
                  do systému nedostala
                </li>
              ) : null}
            </ul>
            <p className="mt-5">
              Nikomu dalšímu údaje nepředávám ani neprodávám.
            </p>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">Cookies</h2>
            <p className="mt-4">
              Web <strong>neměří návštěvnost</strong>, nemá reklamní kódy
              a sám žádné cookies neukládá.
            </p>
            <p className="mt-4">
              Mapa u nabídky se načítá z <strong>Mapy.com</strong>, případně
              z <strong>OpenStreetMap</strong>. Fotografie nemovitostí
              a reference klientů jsou součástí webu, žádná další služba se
              při jejich zobrazení nevolá.
            </p>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">
              Jaká máte práva
            </h2>
            <dl className="mt-5 flex flex-col gap-3">
              {rights.map(([name, text]) => (
                <div key={name}>
                  <dt className="inline font-semibold">Právo {name}</dt>
                  <dd className="inline text-ink-muted"> — {text}.</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6">
              Stačí napsat na{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-medium text-accent-text underline underline-offset-4"
              >
                {site.email}
              </a>
              . Ozvu se do jednoho měsíce. Když budete mít pocit, že s vašimi
              údaji nakládám špatně, můžete se obrátit na{" "}
              <a
                href="https://uoou.gov.cz"
                target="_blank"
                rel="noopener"
                className="font-medium text-accent-text underline underline-offset-4"
              >
                Úřad pro ochranu osobních údajů
              </a>
              .
            </p>
          </section>

          <p className="mt-16 border-t border-line pt-6 text-sm text-ink-subtle">
            Znění <span className="tnum">{CONSENT_VERSION}</span>, účinné od{" "}
            <time dateTime="2026-10-01">1. října 2026</time>.
          </p>
        </div>
      </Container>
    </>
  );
}
