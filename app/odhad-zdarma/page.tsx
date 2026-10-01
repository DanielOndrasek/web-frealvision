import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactSection } from "@/components/layout/ContactSection";
import { ValuationForm } from "@/components/forms/ValuationForm";

export const metadata: Metadata = {
  title: "Odhad hodnoty nemovitosti zdarma",
  description:
    "Zjistěte reálnou tržní hodnotu bytu, domu nebo pozemku. Pro majitele zdarma, důkladná analýza místo cenové mapy.",
  alternates: { canonical: "/odhad-zdarma" },
};

const tips = [
  {
    title: "Užitná plocha",
    text: "Uvádějte jen plochu určenou k bydlení. Balkon, terasu ani sklep do ní nepočítejte — uvedete je zvlášť.",
  },
  {
    title: "Pravdivé údaje",
    text: "Vyplňte skutečný stav nemovitosti. Přikrášlený vstup dá přikrášlený odhad, se kterým se pak nedá pracovat.",
  },
  {
    title: "Důležité detaily",
    text: "Napište všechno, co může cenu ovlivnit: velikost balkonu, garážové stání, ale i nedostatky.",
  },
];

export default function ValuationPage() {
  return (
    <>
      {/* Úvod zarovnaný vlevo jako na ostatních podstránkách */}
      <PageHeader
        eyebrow="Odhad zdarma"
        title="Chcete znát hodnotu vaší nemovitosti?"
        lead="Správné ocenění je základ úspěšného prodeje. Cenová mapa vám dá hrubou představu o rozpětí — ale nespoléhejte se na ni."
      />

      {/* Zbytek stránky na střed */}
      <Container>
        <div className="py-16 text-center sm:py-20">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ink-muted">
            Důkladná analýza trvá i několik hodin. Je potřeba projít víc zdrojů,
            zkoumat nabývací tituly konkrétních nemovitostí, porovnávat je mezi
            sebou a hlavně znát aktuální situaci na trhu. To žádný online
            nástroj neudělá.
          </p>

          <div className="mx-auto mt-10 max-w-xl border border-ink px-6 py-5">
            <p className="font-semibold">
              Jste-li majitel nemovitosti, odhad připravím zdarma.
            </p>
          </div>
        </div>
      </Container>

      <section className="border-y border-line bg-surface-subtle">
        <Container>
          <div className="py-16 text-center sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Co mi o nemovitosti napsat
            </h2>

            <dl className="mt-12 grid gap-10 md:grid-cols-3">
              {tips.map((tip) => (
                <div key={tip.title}>
                  <dt className="text-lg font-semibold">{tip.title}</dt>
                  <dd className="mx-auto mt-2 max-w-xs leading-relaxed text-ink-muted">
                    {tip.text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <Container size="narrow">
        <section id="formular" className="py-16 sm:py-20">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Požádat o odhad
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-ink-muted">
              Čtyři krátké kroky. Čím víc vyplníte, tím přesnější odhad
              připravím — povinná je jen plocha, lokalita a kontakt.
            </p>
          </div>

          <div className="mt-10">
            <ValuationForm />
          </div>
        </section>
      </Container>

      <ContactSection title="Raději si zavolat?" />
    </>
  );
}
