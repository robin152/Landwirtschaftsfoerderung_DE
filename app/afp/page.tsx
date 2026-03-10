"use client"

import { useState } from "react"
import { AFPRechner } from "@/components/afp-rechner"
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FileText,
  Phone,
  Star,
  TrendingUp,
  Clock,
  Euro,
  Users,
  Leaf,
  Building2,
  Tractor,
  AlertTriangle,
  MapPin,
  Shield,
} from "lucide-react"
import { NavigationIndustrial } from "@/components/navigation-industrial"
import { Footer } from "@/components/footer"
import { ContactFormModal } from "@/components/contact-form-modal"

// ─────────────────────────────────────────────────────────────────────────────
// BUNDESLAENDER TABLE DATA
// ─────────────────────────────────────────────────────────────────────────────
const TABLE_DATA = [
  {
    bl: "Nordrhein-Westfalen",
    maxInvest: "1,2 Mio.",
    prosLedig: "150.000",
    prosVerh: "180.000",
    tierwohl: "bis 40 %",
    siuk: "bis 50 %",
    info: "Kälbermatten-Aufschlag (befristet), ELAN-Portal, Rangfolge-Verfahren",
    highlight: false,
  },
  {
    bl: "Niedersachsen / HB / HH",
    maxInvest: "1,5 Mio.",
    prosLedig: "170.000",
    prosVerh: "200.000",
    tierwohl: "bis 40 %",
    siuk: "40 %",
    info: "Mobilställe explizit förderfähig, Außenwirtschaft 20 %, höchste Prosper.-Grenze West",
    highlight: false,
  },
  {
    bl: "Bayern",
    maxInvest: "1,2 Mio.",
    prosLedig: "140.000",
    prosVerh: "170.000",
    tierwohl: "bis 40 %",
    siuk: "bis 40 %",
    info: "Qualifikations-Punkte für Meister/Landwirt stark gewichtet, Öko-Bonus",
    highlight: false,
  },
  {
    bl: "Baden-Württemberg",
    maxInvest: "2,0 Mio. (neu)",
    prosLedig: "~210.000",
    prosVerh: "~250.000",
    tierwohl: "bis 40 %",
    siuk: "40 %",
    info: "Schweine ab Sept. 2026 wieder, höchstes Max-Invest West, Premium-Fokus",
    highlight: true,
  },
  {
    bl: "Hessen",
    maxInvest: "5,0 Mio.",
    prosLedig: "keine",
    prosVerh: "keine",
    tierwohl: "bis 40 %",
    siuk: "bis 75 %",
    info: "Höchste SIUK-Sätze bundesweit, keine Einkommensgrenze, EIP-Innovation-Bonus",
    highlight: true,
  },
  {
    bl: "Rheinland-Pfalz",
    maxInvest: "1,2 Mio.",
    prosLedig: "150.000",
    prosVerh: "180.000",
    tierwohl: "bis 40 %",
    siuk: "40 %",
    info: "Weinbau & Naturgefahren-Prämie, GAK-Standard",
    highlight: false,
  },
  {
    bl: "Schleswig-Holstein",
    maxInvest: "1,2 Mio.",
    prosLedig: "150.000",
    prosVerh: "180.000",
    tierwohl: "bis 40 %",
    siuk: "40 %",
    info: "Fokus Küstenschutz & Resilienz, Sonderregelung Milchvieh",
    highlight: false,
  },
  {
    bl: "Saarland",
    maxInvest: "1,2 Mio.",
    prosLedig: "150.000",
    prosVerh: "180.000",
    tierwohl: "bis 40 %",
    siuk: "40 %",
    info: "GAK-Standard, kleinste Agrarfläche Deutschlands",
    highlight: false,
  },
  {
    bl: "Brandenburg",
    maxInvest: "5,0 Mio.",
    prosLedig: "140.000",
    prosVerh: "170.000",
    tierwohl: "bis 65 %",
    siuk: "bis 65 %",
    info: "Stark erhöhte Basis- & Tierwohlsätze (neue Bundesländer-Bonus)",
    highlight: true,
  },
  {
    bl: "Sachsen",
    maxInvest: "5,0 Mio.",
    prosLedig: "keine",
    prosVerh: "keine",
    tierwohl: "bis 40 %",
    siuk: "bis 65 %",
    info: "Keine Einkommensgrenze, innovative Tierwohlprogramme, hohe SIUK-Sätze",
    highlight: true,
  },
  {
    bl: "Sachsen-Anhalt",
    maxInvest: "5,0 Mio.",
    prosLedig: "~170.000",
    prosVerh: "~220.000",
    tierwohl: "bis 40 %",
    siuk: "40 %",
    info: "Höchste Einkommensgrenzen in neuen Bundesländern",
    highlight: false,
  },
  {
    bl: "Thüringen",
    maxInvest: "5,0 Mio.",
    prosLedig: "keine",
    prosVerh: "keine",
    tierwohl: "bis 40 %",
    siuk: "40 %",
    info: "Keine Einkommensgrenze, hohe Flexibilität bei Maßnahmenplanung",
    highlight: false,
  },
  {
    bl: "Mecklenburg-Vorpommern",
    maxInvest: "5,0 Mio.",
    prosLedig: "keine",
    prosVerh: "keine",
    tierwohl: "bis 40 %",
    siuk: "40 %",
    info: "Schwerpunkt Milchvieh & Großbetriebe, erhöhter Basis-Satz 25 %",
    highlight: false,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: HERO
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section
      className="relative bg-[#060d08] overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28"
      aria-label="Hero"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(52,211,153,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-900/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" aria-hidden="true" />
          AFP 2023–2027 · GAK-Bundesförderung · Töpfe 2026 noch offen
        </div>

        {/* H1 — exakt aus Briefing */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight text-balance mb-6">
          Der Staat zahlt dir{" "}
          <span className="text-emerald-400">40–75 %</span>{" "}
          für deinen nächsten Stall, Güllelager oder Klimaschutz —{" "}
          <span className="text-slate-400">
            oder du bleibst auf den vollen Kosten sitzen.
          </span>
        </h1>

        {/* Subheadline — exakt aus Briefing */}
        <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-3">
          Gib in 45 Sekunden dein Bundesland + Vorhaben ein.
          Du siehst sofort, wie viel Geld du wirklich kriegst — und ob du zu den Gewinnern oder Verlierern gehörst.
        </p>
        <p className="text-orange-400 font-bold text-base sm:text-lg mb-10">
          2026 sind die Töpfe noch voll. In 3–6 Monaten wahrscheinlich nicht mehr.
        </p>

        {/* CTA — exakt aus Briefing */}
        <button
          onClick={onCTAClick}
          className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-extrabold text-lg px-8 py-5 rounded-2xl shadow-2xl shadow-orange-900/50 transition-all duration-200 hover:-translate-y-1 animate-pulse-slow"
          aria-label="Jetzt gratis AFP-Förderung berechnen"
        >
          JETZT GRATIS BERECHNEN — wie viel Zuschuss hole ICH mir raus?
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Trust-Signale — exakt aus Briefing */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-8 text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" aria-hidden="true" />
            Über 400 Landwirte haben schon 6- bis 7-stellige Beträge kassiert
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" aria-hidden="true" />
            100 % kostenlos &amp; unverbindlich
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" aria-hidden="true" />
            Ich bin der Typ, der die Ablehnungen verhindert
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto">
          {[
            { value: "75 %", label: "Max. Fördersatz (Hessen SIUK)" },
            { value: "5 Mio.", label: "Max. förderfähiges Invest" },
            { value: "+10 %", label: "Junglandwirt-Bonus bis 40 J." },
            { value: "12 J.", label: "Zweckbindung Gebäude" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-4"
            >
              <p className="text-2xl font-extrabold text-emerald-400 leading-none">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: KALKULATOR
// ─────────────────────────────────────────────────────────────────────────────
function CalculatorSection({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section
      id="rechner"
      className="bg-[#0a1209] py-16 sm:py-20 border-t border-slate-800"
      aria-label="AFP Förderrechner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-10">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">
            Live-Rechner · AFP 2026
          </p>
          {/* Überschrift exakt aus Briefing */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            In 45 Sekunden weißt du exakt, wie viel der Staat dir dein Vorhaben bezahlt — live &amp; brutal ehrlich.
          </h2>
          <p className="text-slate-400 mt-3 text-sm max-w-xl mx-auto leading-relaxed">
            Alle Werte basieren auf dem AFP-Rahmenplan GAK 2023–2027 und den aktuellen Länder-Förderrichtlinien. Stand: 2026.
          </p>
        </div>
        <AFPRechner onCTAClick={onCTAClick} />
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: PAIN & AGITATION
// ─────────────────────────────────────────────────────────────────────────────
function PainSection() {
  return (
    <section
      className="bg-[#060d08] py-16 sm:py-20 border-t border-slate-800"
      aria-label="Pain Agitation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-10">
          <p className="text-red-400 text-sm font-bold uppercase tracking-widest mb-3">
            Der blinde Fleck
          </p>
          {/* Überschrift exakt aus Briefing */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            Die meisten Landwirte verlieren hier{" "}
            <span className="text-red-400">30.000–80.000 €</span> — und merken es erst, wenn es zu spät ist.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Pain copy — exakt aus Briefing */}
          <div className="space-y-5 text-slate-300 leading-relaxed text-base">
            <p>
              Du willst endlich einen Stall, der den Tieren wirklich guttut.
              Oder Gülle lagern, ohne dass die Behörde dir auf die Füße tritt.
              Oder Technik, die Wasser spart und Ertrag bringt.
            </p>
            <p>
              Aber die Baukosten sind explodiert.
              Die Vorschriften werden immer verrückter.
              Und ohne den richtigen Zuschuss rechnet sich das alles nicht.
            </p>
            <p>
              Viele Kollegen bauen trotzdem — und zahlen alles selbst.
              Oder sie beantragen und bekommen nur 20 % oder gar nichts, weil sie die versteckten Regeln nicht kannten.
            </p>
            <p className="font-bold text-white text-lg">
              Das Ergebnis? Sie schuften weiter für die Bank statt für sich.
            </p>
            <p className="text-slate-300">
              Du willst das nicht mehr. Du willst das Maximum. Und zwar jetzt.
            </p>
          </div>

          {/* Fehler-Box — exakt aus Briefing */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-1">
              5 Fehler, die 70 % der Anträge killen
            </p>
            {[
              "Nur alte Maschinen austauschen (kein Mehrwert)",
              "Vertrag unterschrieben, bevor der Zuschuss genehmigt ist",
              "Einkommen zu hoch (Prosperitätsgrenze überschritten)",
              "Kein echter Tier- oder Klimanutzen über Mindeststandard",
              "Gebrauchte Sachen oder reiner Landkauf beantragt",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-slate-700">
              <p className="text-emerald-400 text-sm font-bold">
                Ich checke das alles vorher. Punkt.
              </p>
            </div>
          </div>
        </div>

        {/* Was ist AFP */}
        <div className="mt-14 grid sm:grid-cols-3 gap-5">
          {[
            {
              icon: Building2,
              title: "Was ist das AFP?",
              desc: "Das Agrarinvestitionsförderungsprogramm (AFP) ist das zentrale bundesweite Investitionsförderinstrument für landwirtschaftliche Betriebe — finanziert über die Gemeinschaftsaufgabe Agrarstruktur und Küstenschutz (GAK). Laufzeit 2023–2027.",
            },
            {
              icon: Tractor,
              title: "Wer wird gefördert?",
              desc: "Landwirtschaftliche Unternehmen mit Schwerpunkt Tierhaltung, Pflanzenbau oder Diversifizierung. Bedingung: KMU-Eigenschaft, Fachausbildung des Betriebsleiters, kein vorzeitiger Maßnahmenbeginn.",
            },
            {
              icon: Euro,
              title: "Wie viel ist drin?",
              desc: "Bundesweit 20–75 % Zuschuss auf das förderungsfähige Investitionsvolumen. Je nach Bundesland, Maßnahmenprofil und Junglandwirt-Status. Einmalig pro Förderperiode — nicht rückzahlbar.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <item.icon className="w-5 h-5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                <p className="text-white font-bold text-sm">{item.title}</p>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: LÖSUNG
// ─────────────────────────────────────────────────────────────────────────────
function SolutionSection({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section
      className="bg-[#0a1209] py-16 sm:py-20 border-t border-slate-800"
      aria-label="Die Lösung"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-10">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">
            Warum genau wir
          </p>
          {/* Überschrift exakt aus Briefing */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            Ich bin der Förder-Typ, der Landwirten wie dir jedes Jahr Millionen extra holt.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Value-Stack — exakt aus Briefing */}
          <div className="space-y-3">
            {[
              "In 45 Sekunden siehst du exakt deinen Betrag — kein Blabla",
              "Ich prüfe, ob dein Vorhaben wirklich passt (die 90 % der Kollegen scheitern hier)",
              "Ich optimiere deine Pläne auf den höchsten Prozentsatz (40–75 % statt 20 %)",
              "Ich übernehme den ganzen Papierkram — du musst nur unterschreiben",
              "Du bekommst Geld, das du sonst nie gesehen hättest",
              "Und das alles kostenlos, bis du »Ja« sagst",
            ].map((v) => (
              <div
                key={v}
                className="flex items-start gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-slate-200 text-sm leading-relaxed">{v}</span>
              </div>
            ))}

            {/* Kleiner Text exakt aus Briefing */}
            <div className="mt-4 bg-emerald-950/30 border border-emerald-800/30 rounded-xl px-4 py-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                Ich verdiene erst, wenn du Geld bekommst.
                Deshalb arbeite ich nur mit Fällen, die ich auch wirklich gewinne.
              </p>
            </div>
          </div>

          {/* Expert Card */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950/20 border border-emerald-800/30 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-14 h-14 bg-emerald-800 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl flex-shrink-0"
                aria-hidden="true"
              >
                PS
              </div>
              <div>
                <p className="text-white font-bold">Patrick Starkmann</p>
                <p className="text-emerald-400 text-sm">AFP-Förderspezialist · seit 2019</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              Seit 2019 begleite ich ausschließlich landwirtschaftliche Betriebe
              bei AFP-, GAK- und ELER-Anträgen. Ich kenne jeden Fallstrick, jeden
              Bundesland-Unterschied, jedes Ranking-System. Mein Versprechen: Ich
              hole dir das Maximum — oder ich sage dir ehrlich, wenn es keinen
              Sinn macht.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { value: "400+", label: "Landwirte" },
                { value: "16", label: "Bundesländer" },
                { value: "Mio. €", label: "vermittelt" },
              ].map((s) => (
                <div key={s.label} className="bg-slate-800/60 rounded-lg p-2 text-center">
                  <p className="text-emerald-400 font-extrabold text-base">{s.value}</p>
                  <p className="text-slate-500 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={onCTAClick}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm"
            >
              Jetzt persönlichen Check sichern
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: BUNDESLÄNDER-VERGLEICH
// ─────────────────────────────────────────────────────────────────────────────
function TableSection({ onCTAClick }: { onCTAClick: () => void }) {
  const [activeRow, setActiveRow] = useState<string | null>(null)

  return (
    <section
      className="bg-[#060d08] py-16 sm:py-20 border-t border-slate-800"
      aria-label="Bundesländer-Vergleich AFP"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-10">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">
            Bundesländer-Vergleich
          </p>
          {/* Überschrift exakt aus Briefing */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            Manche Bundesländer zahlen deutlich mehr als andere — siehst du deins?
          </h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto text-sm leading-relaxed">
            Klicke eine Zeile für Details zu Besonderheiten 2026.
            Alle Werte basieren auf dem AFP-Rahmenplan GAK 2023–2027.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-700 shadow-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700">
                <th scope="col" className="text-left px-4 py-3 text-slate-300 font-bold">Bundesland</th>
                <th scope="col" className="text-right px-4 py-3 text-slate-300 font-bold">Max. Invest</th>
                <th scope="col" className="text-right px-4 py-3 text-slate-300 font-bold">Prosperität ledig / verh.</th>
                <th scope="col" className="text-center px-4 py-3 text-slate-300 font-bold">Tierwohl</th>
                <th scope="col" className="text-center px-4 py-3 text-slate-300 font-bold">SIUK / Klima</th>
                <th scope="col" className="text-left px-4 py-3 text-slate-300 font-bold">Besonderheiten 2026</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_DATA.map((row, i) => (
                <tr
                  key={row.bl}
                  onClick={() => setActiveRow(activeRow === row.bl ? null : row.bl)}
                  className={`border-b border-slate-800 cursor-pointer transition-colors ${
                    row.highlight ? "bg-emerald-950/20" : i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-900/10"
                  } ${
                    activeRow === row.bl
                      ? "!bg-emerald-900/25 border-l-2 border-l-emerald-500"
                      : "hover:bg-slate-800/40"
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-white">
                    <span className="flex items-center gap-2">
                      {row.bl}
                      {row.highlight && (
                        <span className="text-xs bg-emerald-900/60 text-emerald-400 border border-emerald-700/40 px-1.5 py-0.5 rounded-full">
                          Top
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-200 font-medium">{row.maxInvest} €</td>
                  <td className="px-4 py-3 text-right text-slate-300 text-xs">
                    {row.prosLedig === "keine" ? (
                      <span className="text-emerald-400 font-semibold">keine Grenze</span>
                    ) : (
                      <span>{row.prosLedig} € / {row.prosVerh} €</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-emerald-900/40 text-emerald-300 text-xs px-2 py-1 rounded-full border border-emerald-700/30">
                      {row.tierwohl}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-blue-900/40 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-700/30">
                      {row.siuk}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs leading-relaxed">{row.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {TABLE_DATA.map((row) => (
            <div
              key={row.bl}
              className={`border rounded-xl p-4 ${
                row.highlight ? "bg-emerald-950/20 border-emerald-700/30" : "bg-slate-900 border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white text-sm">
                  {row.bl}
                  {row.highlight && (
                    <span className="ml-2 text-xs bg-emerald-900/60 text-emerald-400 border border-emerald-700/40 px-1.5 py-0.5 rounded-full">
                      Top
                    </span>
                  )}
                </span>
                <span className="text-xs text-slate-400">Max: {row.maxInvest}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-emerald-900/50 text-emerald-300 text-xs px-2 py-1 rounded-full border border-emerald-700/40">
                  Tierwohl: {row.tierwohl}
                </span>
                <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-700/40">
                  SIUK: {row.siuk}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{row.info}</p>
              {row.prosLedig === "keine" ? (
                <p className="text-emerald-400 text-xs mt-2 font-semibold">Keine Einkommensgrenze</p>
              ) : (
                <p className="text-slate-500 text-xs mt-2">
                  Prosperität: {row.prosLedig} € (ledig) / {row.prosVerh} € (verh.)
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-center text-xs text-slate-600">
            Quelle: AFP-Förderrichtlinien 2023–2027, GAK-Rahmenplan, Landesrichtlinien. Angaben ohne Gewähr.
          </p>
          <button
            onClick={onCTAClick}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 text-sm"
          >
            Mein Bundesland im Detail prüfen lassen
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: ABLAUF
// ─────────────────────────────────────────────────────────────────────────────
function ProcessSection({ onCTAClick }: { onCTAClick: () => void }) {
  const steps = [
    {
      n: "01",
      icon: TrendingUp,
      title: "Du füllst den Rechner aus",
      desc: "Bundesland, Vorhaben und Investitionssumme — fertig in 45 Sekunden. Sofortige Berechnung, keine Registrierung nötig.",
    },
    {
      n: "02",
      icon: Phone,
      title: "Du klickst auf »Persönlichen Check« und schickst mir deine groben Pläne",
      desc: "Kein Aufsatz, keine Unterlagen vorab. Ich melde mich innerhalb von 24 Stunden.",
    },
    {
      n: "03",
      icon: FileText,
      title: "Ich rechne dir das Maximum aus",
      desc: "Ich analysiere Förderfähigkeit, prüfe die Prosperitätsgrenze, Ranking-Kriterien und identifiziere alle Bonus-Hebel — Junglandwirt, Tierwohl-Premium, SIUK.",
    },
    {
      n: "04",
      icon: CheckCircle2,
      title: "Du unterschreibst — ich erledige den Rest",
      desc: "Portal, Antrag, Nachweise, Bankbestätigung — alles in meiner Hand.",
    },
  ]

  return (
    <section
      className="bg-[#0a1209] py-16 sm:py-20 border-t border-slate-800"
      aria-label="Ablauf"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">Ablauf</p>
          {/* Überschrift exakt aus Briefing */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            Von der Idee bis zum Geld auf dem Konto — in 4 einfachen Schritten
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {steps.map((step) => (
            <div
              key={step.n}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-5 flex flex-col gap-4 hover:border-emerald-700/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-5xl font-black text-slate-800 leading-none" aria-hidden="true">
                  {step.n}
                </span>
                <step.icon className="w-6 h-6 text-emerald-400 flex-shrink-0" aria-hidden="true" />
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-1 leading-snug">{step.title}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-950/30 border border-amber-700/30 rounded-xl p-4 flex gap-3 mb-10">
          <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-amber-300 font-bold text-sm">Wichtig: Vorlaufzeit beachten</p>
            <p className="text-amber-400/80 text-xs mt-1 leading-relaxed">
              Der AFP-Antragsprozess braucht mindestens 6–12 Monate Vorlaufzeit (Baugenehmigung,
              Buchführungsnachweis, Bankbestätigung). Kein vorzeitiger Maßnahmenbeginn vor Bescheid —
              auch kein Vertragsabschluss. Wer jetzt anfängt, kann die 2026er Auswahlrunde noch mitnehmen.
            </p>
          </div>
        </div>

        <div className="text-center">
          {/* Ergebnis-Satz exakt aus Briefing */}
          <p className="text-white font-extrabold text-xl mb-6">
            Ergebnis: Geld vom Staat. Du baust. Du gewinnst.
          </p>
          <button
            onClick={onCTAClick}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 text-base hover:-translate-y-0.5"
          >
            Jetzt kostenlos starten
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: AUSSCHLUSSKRITERIEN
// ─────────────────────────────────────────────────────────────────────────────
function ExclusionsSection() {
  const exclusions = [
    {
      title: "Nur alte Maschinen austauschen (kein Mehrwert)",
      desc: "Der 1:1-Austausch ohne technologischen Sprung, Tierwohl- oder Klimaverbesserung gilt nicht. Das Vorhaben muss Additionality nachweisen — messbar über gesetzlichen Mindeststandard hinaus.",
    },
    {
      title: "Vertrag unterschrieben, bevor der Zuschuss genehmigt ist",
      desc: "Selbst das Unterschreiben eines Liefervertrags gilt als Maßnahmenbeginn. Nur Planung und behördliche Genehmigungen dürfen vorab erfolgen. Verstoß = sofortige Ablehnung.",
    },
    {
      title: "Einkommen zu hoch (Prosperitätsgrenze)",
      desc: "Überschreitet das Ø-Einkommen der letzten 3 Jahre die Ländergrenze (z. B. 150.000 € ledig in NRW), entfällt die Förderung vollständig. Es gibt keine Teilförderung.",
    },
    {
      title: "Kein echter Tier- oder Klimanutzen",
      desc: "Die Investition muss die Haltungsbedingungen signifikant über den gesetzlichen Mindeststandard anheben — mit messbaren Parametern (Fläche/Tier, Lux, Schadgas-Reduktion in %).",
    },
    {
      title: "Gebrauchte Sachen oder reiner Landkauf",
      desc: "Gebrauchtmaschinen sind grundsätzlich ausgeschlossen. Bodenkauf wird nicht gefördert. Nur neue, innovative Investitionen in Gebäude, Technik und Prozesse sind antragsfähig.",
    },
  ]

  return (
    <section
      className="bg-[#060d08] py-16 sm:py-20 border-t border-slate-800"
      aria-label="Ausschlusskriterien"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-10">
          <p className="text-orange-400 text-sm font-bold uppercase tracking-widest mb-3">
            Wofür es kein Geld gibt
          </p>
          {/* Überschrift exakt aus Briefing */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            Das sind die 5 Fehler, die 70 % der Anträge killen — ich lasse dich nicht reinfallen.
          </h2>
        </div>
        <div className="space-y-3">
          {exclusions.map((ex) => (
            <div
              key={ex.title}
              className="bg-slate-900 border border-slate-700 hover:border-red-800/30 rounded-xl p-4 flex gap-4 transition-colors"
            >
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-white font-semibold text-sm">{ex.title}</p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{ex.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-emerald-950/30 border border-emerald-700/30 rounded-xl p-5">
          <p className="text-emerald-300 font-bold text-sm mb-2">
            Ich checke das alles vorher. Punkt.
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            Bevor wir den Antrag einreichen, überprüfe ich jeden dieser Punkte systematisch.
            Ich sage dir offen, wenn ein Vorhaben nicht förderfähig ist — lieber vorher als nach der Ablehnung.
            Mein Ziel: Null Ablehnungen.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: SOCIAL PROOF
// ─────────────────────────────────────────────────────────────────────────────
function SocialProofSection() {
  const testimonials = [
    {
      // exakt aus Briefing
      quote: "Dank ihm 68.000 € mehr als erwartet in Bayern",
      detail:
        "Er wusste genau, welche Nachweise ich für den Qualifikationsbonus brauchte. Der Öko-Aufschlag kam noch on top — mit alleine wäre ich bei 25 % geblieben.",
      name: "M. Huber",
      role: "Milchviehhalter, Oberbayern",
      invest: "Stallumbau 170.000 €",
      amount: "68.000 €",
      extra: "extra Zuschuss",
    },
    {
      // exakt aus Briefing
      quote: "In Hessen 75 % rausgeholt — ohne ihn wäre ich bei 35 % geblieben",
      detail:
        "Das ist ein Unterschied von über 120.000 €. Er hat die Kombination aus Abluftfilter und Güllekühlung als eine Maßnahme gebündelt — das war der Trick.",
      name: "K. Schneider",
      role: "Schweinehalter, Nordhessen",
      invest: "Emissionsschutz 480.000 €",
      amount: "120.000 €",
      extra: "mehr als allein",
    },
    {
      // exakt aus Briefing
      quote: "NRW: Von 20 % auf 48 % hochoptimiert. 42.000 € extra",
      detail:
        "Der Junglandwirt-Bonus war mir vorher nicht mal bekannt. Der Kälbermatten-Aufschlag hat noch mal draufgelegt. Hätte ich selbst nie so kombiniert.",
      name: "T. Müller",
      role: "Junglandwirt, Münsterland",
      invest: "Tierwohl-Stallerneuerung 210.000 €",
      amount: "42.000 €",
      extra: "Junglandwirt-Bonus + NRW-Aufschlag",
    },
  ]

  return (
    <section
      className="bg-[#0a1209] py-16 sm:py-20 border-t border-slate-800"
      aria-label="Kundenstimmen"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">
            Social Proof
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            Echte Landwirte. Echte Zahlen.
          </h2>
          <p className="text-slate-400 mt-3 text-sm">
            Namen und Standorte anonymisiert — Zahlen sind reale Förderergebnisse.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-slate-900 border border-slate-700 hover:border-emerald-700/30 rounded-2xl p-5 flex flex-col gap-4 transition-colors"
            >
              <div className="flex gap-1" aria-label="5 von 5 Sternen">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>
              {/* Headline-Zitat exakt aus Briefing */}
              <p className="text-white font-bold text-sm leading-snug">{`„${t.quote}"`}</p>
              <p className="text-slate-400 text-xs leading-relaxed flex-1">{t.detail}</p>
              <div className="border-t border-slate-700 pt-4">
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-slate-500 text-xs">{t.role}</p>
                <p className="text-slate-600 text-xs">{t.invest}</p>
                <div className="mt-3 bg-emerald-900/30 border border-emerald-700/30 rounded-lg px-3 py-2">
                  <span className="text-emerald-400 font-extrabold text-lg">{t.amount}</span>
                  <span className="text-slate-400 text-xs ml-2">{t.extra}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "400+", label: "Erfolgreich begleitete Anträge" },
            { value: "0", label: "Ablehnungen durch Formalfehler" },
            { value: "Ø 38 %", label: "Durchschnittlicher Fördersatz" },
            { value: "6–12 Wo.", label: "Ø Bearbeitungszeit Antrag" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-4 text-center">
              <p className="text-2xl font-extrabold text-white leading-none">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: FINALER CTA
// ─────────────────────────────────────────────────────────────────────────────
function FinalCTASection({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section
      className="bg-[#060d08] py-20 sm:py-28 border-t border-slate-800"
      aria-label="Abschluss CTA"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 bg-orange-950/40 border border-orange-700/40 text-orange-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
          2026 — Töpfe begrenzt · Jetzt handeln
        </div>

        {/* H2 exakt aus Briefing */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight text-balance mb-6">
          2026 ist das Jahr, in dem du endlich richtig{" "}
          <span className="text-emerald-400">abkassierst</span> — oder wieder zuschaust.
        </h2>

        <p className="text-slate-400 text-lg mb-4 max-w-xl mx-auto leading-relaxed">
          Der AFP-Antragsprozess braucht mindestens 6–12 Monate Vorlauf:
          Baugenehmigung, Buchführungsnachweis, Bankbestätigung, Fachberatung.
          Wer jetzt anfängt, kann die 2026er Auswahlrunde noch mitnehmen.
        </p>
        <p className="text-orange-400 font-bold text-base mb-10">
          In 3–6 Monaten sind die Kontingente weg. Warten ist keine Option.
        </p>

        {/* Button exakt aus Briefing */}
        <button
          onClick={onCTAClick}
          className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-extrabold text-lg px-9 py-5 rounded-2xl shadow-2xl shadow-orange-900/40 transition-all duration-200 hover:-translate-y-1 mb-4"
          aria-label="Jetzt gratis AFP-Förderung berechnen und persönlichen Maximal-Check holen"
        >
          JETZT GRATIS BERECHNEN &amp; PERSÖNLICHEN MAXIMAL-CHECK HOLEN
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Unterzeile exakt aus Briefing */}
        <p className="text-slate-500 text-sm mb-14">
          Kostenlos · Unverbindlich · Nur für ernsthafte Vorhaben ab 20.000 €
        </p>

        {/* Trust-Icons */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Shield,
              title: "Keine Vorleistung",
              desc: "Ich verdiene erst, wenn du Geld bekommst. Kein Honorar vorab.",
            },
            {
              icon: MapPin,
              title: "Alle 16 Bundesländer",
              desc: "Jedes Landesrecht, jede Antragsstelle, jede Besonderheit.",
            },
            {
              icon: CheckCircle2,
              title: "Null Ablehnungen",
              desc: "Durch Formalfehler oder falsches Timing verliere ich keinen Antrag.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center"
            >
              <item.icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" aria-hidden="true" />
              <p className="text-white font-bold text-sm mb-1">{item.title}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AFPPage() {
  const [modalOpen, setModalOpen] = useState(false)

  const scrollToRechner = () => {
    const el = document.getElementById("rechner")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <>
      <NavigationIndustrial />
      <main>
        <HeroSection onCTAClick={scrollToRechner} />
        <CalculatorSection onCTAClick={() => setModalOpen(true)} />
        <PainSection />
        <SolutionSection onCTAClick={() => setModalOpen(true)} />
        <TableSection onCTAClick={() => setModalOpen(true)} />
        <ProcessSection onCTAClick={() => setModalOpen(true)} />
        <ExclusionsSection />
        <SocialProofSection />
        <FinalCTASection onCTAClick={() => setModalOpen(true)} />
      </main>
      <Footer />
      <ContactFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        source="AFP-Landingpage"
      />
    </>
  )
}
