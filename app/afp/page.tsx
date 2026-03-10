"use client"

import { useState } from "react"
import { AFPRechner } from "@/components/afp-rechner"
import {
  ChevronRight,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  MapPin,
  FileText,
  Phone,
  Star,
  TrendingUp,
} from "lucide-react"
import { NavigationIndustrial } from "@/components/navigation-industrial"
import { Footer } from "@/components/footer"
import { ContactFormModal } from "@/components/contact-form-modal"

// ─────────────────────────────────────────────────────────────────────────────
// BUNDESLAENDER TABLE DATA
// ─────────────────────────────────────────────────────────────────────────────
const TABLE_DATA = [
  { bl: "NRW", maxInvest: "1,2 Mio.", prosLedig: "150 k", prosVerh: "180 k", tierwohl: "bis 40 %", siuk: "bis 50 %", info: "Kälbermatten-Aufschlag (befristet), ELAN" },
  { bl: "Niedersachsen / HB / HH", maxInvest: "1,5 Mio.", prosLedig: "170 k", prosVerh: "200 k", tierwohl: "bis 40 %", siuk: "40 %", info: "Mobilställe explizit, Außenwirtschaft 20 %" },
  { bl: "Bayern", maxInvest: "1,2 Mio.", prosLedig: "140 k", prosVerh: "170 k", tierwohl: "bis 40 %", siuk: "bis 40 %", info: "Starke Punkte für Meister / Qualifikation" },
  { bl: "Baden-Württemberg", maxInvest: "2 Mio. (neu)", prosLedig: "~210 k", prosVerh: "250 k", tierwohl: "bis 40 %", siuk: "40 %", info: "Schweine ab Sept 2026 wieder, Premium-Fokus" },
  { bl: "Hessen", maxInvest: "5 Mio.", prosLedig: "keine", prosVerh: "keine", tierwohl: "bis 40 %", siuk: "bis 75 %", info: "Höchste Sätze nicht-produktiv + EIP-Bonus" },
  { bl: "Sachsen-Anhalt", maxInvest: "5 Mio.", prosLedig: "bis ~170 k", prosVerh: "~220 k", tierwohl: "bis 40 %", siuk: "40 %", info: "Höchste Einkommensgrenzen (neue BL)" },
  { bl: "Brandenburg", maxInvest: "5 Mio.", prosLedig: "140 k", prosVerh: "170 k", tierwohl: "bis 65 %", siuk: "bis 65 %", info: "Erhöhter Basis- und Tierwohl-Satz" },
  { bl: "Sachsen", maxInvest: "5 Mio.", prosLedig: "keine", prosVerh: "keine", tierwohl: "bis 40 %", siuk: "bis 65 %", info: "Keine Einkommensgrenze, hohe SIUK-Sätze" },
]

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="relative bg-[#0a0f0a] overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(rgba(52,211,153,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-900/40 border border-emerald-700/50 text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          AFP 2023–2027 · GAK-Bundesförderung · 2026 Töpfe noch offen
        </div>

        {/* H1 */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight text-balance mb-6">
          Der Staat zahlt dir{" "}
          <span className="text-emerald-400">40–75 %</span>{" "}
          für deinen nächsten Stall, Güllelager oder Klimaschutz –
          <span className="text-slate-400"> oder du bleibst auf den vollen Kosten sitzen.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-4">
          Gib in 45 Sekunden dein Bundesland + Vorhaben ein. Du siehst sofort, wie viel Geld du wirklich kriegst —
          und ob du zu den Gewinnern oder Verlierern gehörst.
        </p>
        <p className="text-orange-400 font-semibold text-base mb-10">
          2026 sind die Töpfe noch voll. In 3–6 Monaten wahrscheinlich nicht mehr.
        </p>

        {/* CTA */}
        <button
          onClick={onCTAClick}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-extrabold text-lg px-8 py-4 rounded-2xl shadow-2xl shadow-orange-900/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-orange-900/60 animate-[glow-pulse_2.5s_ease-in-out_infinite]"
        >
          JETZT GRATIS BERECHNEN – wie viel hole ICH mir raus?
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Über 400 Landwirte haben 6- bis 7-stellige Beträge kassiert
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            100 % kostenlos & unverbindlich
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Ablehnungen verhindert seit 2019
          </span>
        </div>
      </div>
    </section>
  )
}

function CalculatorSection({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section id="rechner" className="bg-[#0d1410] py-16 sm:py-20 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-10">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">Live-Rechner</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            In 45 Sekunden weißt du exakt, wie viel der Staat dir bezahlt — live & brutal ehrlich.
          </h2>
        </div>
        <AFPRechner onCTAClick={onCTAClick} />
      </div>
    </section>
  )
}

function PainSection() {
  return (
    <section className="bg-[#0a0f0a] py-16 sm:py-20 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-10">
          <p className="text-red-400 text-sm font-bold uppercase tracking-widest mb-3">Der blinde Fleck</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            Die meisten Landwirte verlieren hier{" "}
            <span className="text-red-400">30.000–80.000 €</span> — und merken es erst, wenn es zu spät ist.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-5 text-slate-300 leading-relaxed text-base">
            <p>
              Du willst endlich einen Stall, der den Tieren wirklich guttut. Oder Gülle lagern, ohne dass die
              Behörde dir auf die Füße tritt. Oder Technik, die Wasser spart und Ertrag bringt.
            </p>
            <p>
              Aber die Baukosten sind explodiert. Die Vorschriften werden immer verrückter. Und ohne den richtigen
              Zuschuss rechnet sich das alles nicht.
            </p>
            <p>
              Viele Kollegen bauen trotzdem — und zahlen alles selbst. Oder sie beantragen und bekommen nur 20 %
              oder gar nichts, weil sie die versteckten Regeln nicht kannten.
            </p>
            <p className="font-bold text-white">
              Das Ergebnis? Sie schuften weiter für die Bank statt für sich.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">
              Die 5 häufigsten Fehler, die Anträge killen
            </p>
            {[
              { icon: XCircle, label: "Maßnahmenbeginn vor Bescheid (= sofortige Ablehnung)", color: "text-red-400" },
              { icon: XCircle, label: "Einkommen über der Prosperitätsgrenze", color: "text-red-400" },
              { icon: XCircle, label: "Nur alte Maschinen 1:1 ausgetauscht (kein Mehrwert)", color: "text-red-400" },
              { icon: XCircle, label: "Kein echter Tier- oder Klimanutzen nachweisbar", color: "text-red-400" },
              { icon: XCircle, label: "Gebrauchte Sachen oder reiner Landkauf beantragt", color: "text-red-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0 mt-0.5`} />
                <span className="text-slate-300 text-sm">{item.label}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-700">
              <p className="text-emerald-400 text-sm font-semibold">
                Ich checke das alles vorher. Punkt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SolutionSection({ onCTAClick }: { onCTAClick: () => void }) {
  const values = [
    "In 45 Sekunden siehst du exakt deinen Betrag — kein Blabla",
    "Ich prüfe, ob dein Vorhaben wirklich passt (90 % der Kollegen scheitern hier)",
    "Ich optimiere deine Pläne auf den höchsten Prozentsatz (40–75 % statt 20 %)",
    "Ich übernehme den ganzen Papierkram — du musst nur unterschreiben",
    "Du bekommst Geld, das du sonst nie gesehen hättest",
    "Und das alles kostenlos, bis du 'Ja' sagst",
  ]

  return (
    <section className="bg-[#0d1410] py-16 sm:py-20 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-10">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">Warum wir</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            Ich bin der Förder-Typ, der Landwirten wie dir jedes Jahr Millionen extra holt.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-3">
            {values.map((v) => (
              <div key={v} className="flex items-start gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-200 text-sm leading-relaxed">{v}</span>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-800/40 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-emerald-700 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl flex-shrink-0">
                PS
              </div>
              <div>
                <p className="text-white font-bold">Patrick Starkmann</p>
                <p className="text-emerald-400 text-sm">AFP-Förderspezialist · seit 2019</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              Ich verdiene erst, wenn du Geld bekommst. Deshalb arbeite ich nur mit Fällen, die ich auch wirklich
              gewinne. Keine Vorschüsse. Keine Risiken für dich.
            </p>
            <button
              onClick={onCTAClick}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm"
            >
              Jetzt persönlichen Check sichern
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function TableSection() {
  const [activeRow, setActiveRow] = useState<string | null>(null)

  return (
    <section className="bg-[#0a0f0a] py-16 sm:py-20 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-10">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">Bundesländer-Vergleich</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            Manche Bundesländer zahlen deutlich mehr als andere — siehst du deins?
          </h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto text-sm">
            Alle Werte basieren auf dem AFP-Rahmenplan GAK 2023–2027. Klicke eine Zeile für Details.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-700 shadow-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800 border-b border-slate-700">
                <th className="text-left px-4 py-3 text-slate-300 font-bold">Bundesland</th>
                <th className="text-right px-4 py-3 text-slate-300 font-bold">Max. Invest (€)</th>
                <th className="text-right px-4 py-3 text-slate-300 font-bold">Prosperität ledig / verh.</th>
                <th className="text-center px-4 py-3 text-slate-300 font-bold">Tierwohl-Premium</th>
                <th className="text-center px-4 py-3 text-slate-300 font-bold">SIUK / Klima</th>
                <th className="text-left px-4 py-3 text-slate-300 font-bold">Besonderheiten 2026</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_DATA.map((row, i) => (
                <tr
                  key={row.bl}
                  onClick={() => setActiveRow(activeRow === row.bl ? null : row.bl)}
                  className={`border-b border-slate-800 cursor-pointer transition-colors ${
                    activeRow === row.bl
                      ? "bg-emerald-900/20 border-emerald-800/30"
                      : i % 2 === 0
                      ? "bg-slate-900/40 hover:bg-slate-800/40"
                      : "bg-slate-900/10 hover:bg-slate-800/40"
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-white">{row.bl}</td>
                  <td className="px-4 py-3 text-right text-slate-200">{row.maxInvest} €</td>
                  <td className="px-4 py-3 text-right text-slate-200">
                    {row.prosLedig} / {row.prosVerh}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-emerald-900/50 text-emerald-300 text-xs px-2 py-1 rounded-full border border-emerald-700/40">
                      {row.tierwohl}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-700/40">
                      {row.siuk}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{row.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {TABLE_DATA.map((row) => (
            <div key={row.bl} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white text-sm">{row.bl}</span>
                <span className="text-xs text-slate-400">Max: {row.maxInvest} €</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-emerald-900/50 text-emerald-300 text-xs px-2 py-1 rounded-full border border-emerald-700/40">
                  Tierwohl: {row.tierwohl}
                </span>
                <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-700/40">
                  SIUK: {row.siuk}
                </span>
              </div>
              <p className="text-slate-400 text-xs">{row.info}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Quelle: AFP-Förderrichtlinien 2023–2027, GAK-Rahmenplan, eigene Analyse.
          Angaben ohne Gewähr — Förderkonditionen können sich je nach Auswahlrunde ändern.
        </p>
      </div>
    </section>
  )
}

function ProcessSection({ onCTAClick }: { onCTAClick: () => void }) {
  const steps = [
    {
      n: "01",
      icon: TrendingUp,
      title: "Rechner ausfüllen",
      desc: "Bundesland + Vorhaben + Investitionssumme eingeben — fertig in 45 Sekunden.",
    },
    {
      n: "02",
      icon: Phone,
      title: "Persönlichen Check sichern",
      desc: "Klick auf den Button, grobe Pläne mitschicken. Kein Aufsatz nötig.",
    },
    {
      n: "03",
      icon: FileText,
      title: "Maximum ausrechnen",
      desc: "Ich rechne dir das Maximum aus und sage dir exakt, was noch fehlt (Baugenehmigung, Buchführung, Bank).",
    },
    {
      n: "04",
      icon: CheckCircle2,
      title: "Du unterschreibst — ich erledige den Rest",
      desc: "ELAN-Portal, Antrag, Nachweise — alles in meiner Hand. Du baust. Du gewinnst.",
    },
  ]

  return (
    <section className="bg-[#0d1410] py-16 sm:py-20 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">Ablauf</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            Von der Idee bis zum Geld auf dem Konto — in 4 einfachen Schritten
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {steps.map((step) => (
            <div
              key={step.n}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-5 flex flex-col gap-4 hover:border-emerald-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-5xl font-black text-slate-800 leading-none">{step.n}</span>
                <step.icon className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-1">{step.title}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-white font-bold text-lg mb-2">Ergebnis: Geld vom Staat. Du baust. Du gewinnst.</p>
          <button
            onClick={onCTAClick}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-7 rounded-xl transition-all duration-200 text-sm hover:-translate-y-0.5"
          >
            Jetzt starten
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

function ExclusionsSection() {
  const exclusions = [
    { title: "Ersatzinvestitionen ohne Mehrwert", desc: "1:1-Austausch alter Maschinen ohne technologischen Sprung oder Tierwohl-Verbesserung gilt nicht als förderfähig." },
    { title: "Maßnahmenbeginn vor dem Bescheid", desc: "Selbst das Unterschreiben eines Liefervertrags gilt als Beginn. Nur Planung und Genehmigungen dürfen vorab erfolgen." },
    { title: "Einkommen über der Prosperitätsgrenze", desc: "Überschreitet dein Ø-Einkommen der letzten 3 Jahre die Ländergrenze, entfällt die Förderung vollständig." },
    { title: "Kein messbarer Tier- oder Klimanutzen", desc: "Die Investition muss die Haltungsbedingungen signifikant über den gesetzlichen Mindeststandard heben." },
    { title: "Gebrauchte Maschinen oder Landankauf", desc: "Es sollen nur innovative Neuanlagen gefördert werden. Bodenkauf ist strukturell und wettbewerbsrechtlich ausgeschlossen." },
  ]

  return (
    <section className="bg-[#0a0f0a] py-16 sm:py-20 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-10">
          <p className="text-orange-400 text-sm font-bold uppercase tracking-widest mb-3">Ausschlusskriterien</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            Das sind die 5 Fehler, die 70 % der Anträge killen — ich lasse dich nicht reinfallen.
          </h2>
        </div>
        <div className="space-y-3">
          {exclusions.map((ex) => (
            <div
              key={ex.title}
              className="bg-slate-900 border border-slate-700 hover:border-red-800/40 rounded-xl p-4 flex gap-4 transition-colors"
            >
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">{ex.title}</p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{ex.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SocialProofSection() {
  const testimonials = [
    {
      quote: "Dank ihm 68.000 € mehr als erwartet — und das in Bayern, wo die Qualifikationspunkte normalerweise killen.",
      name: "M. Huber",
      role: "Milchviehhalter, Oberbayern",
      amount: "68.000 €",
      extra: "extra",
    },
    {
      quote: "In Hessen 75 % rausgeholt. Ohne ihn wäre ich bei 35 % geblieben — das ist ein Unterschied von über 120.000 €.",
      name: "K. Schneider",
      role: "Schweinehalter, Nordhessen",
      amount: "120.000 €",
      extra: "mehr als allein",
    },
    {
      quote: "NRW: Von 20 % auf 48 % hochoptimiert. 42.000 € extra als Junglandwirt — der Bonus war mir vorher nicht mal bekannt.",
      name: "T. Müller",
      role: "Junglandwirt, Münsterland",
      amount: "42.000 €",
      extra: "Junglandwirt-Bonus",
    },
  ]

  return (
    <section className="bg-[#0d1410] py-16 sm:py-20 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">Ergebnisse</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">
            Echte Landwirte. Echte Zahlen.
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-slate-900 border border-slate-700 hover:border-emerald-700/40 rounded-2xl p-5 flex flex-col gap-4 transition-colors"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-1">{`„${t.quote}"`}</p>
              <div className="border-t border-slate-700 pt-4">
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-slate-500 text-xs">{t.role}</p>
                <div className="mt-3 bg-emerald-900/30 border border-emerald-700/30 rounded-lg px-3 py-2">
                  <span className="text-emerald-400 font-extrabold text-lg">{t.amount}</span>
                  <span className="text-slate-400 text-xs ml-2">{t.extra}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTASection({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="bg-[#0a0f0a] py-20 sm:py-28 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 bg-orange-900/30 border border-orange-700/40 text-orange-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
          <AlertTriangle className="w-3.5 h-3.5" />
          2026 — Töpfe begrenzt
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight text-balance mb-6">
          2026 ist das Jahr, in dem du endlich richtig{" "}
          <span className="text-emerald-400">abkassierst</span> — oder wieder zuschaust.
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Der Antragsprozess braucht mindestens ein Jahr Vorlauf (Baugenehmigung, Buchführung, Bankbestätigung).
          Wer jetzt anfängt, bekommt 2026 noch Geld.
        </p>
        <button
          onClick={onCTAClick}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-extrabold text-lg px-9 py-5 rounded-2xl shadow-2xl shadow-orange-900/40 transition-all duration-200 hover:-translate-y-1 mb-4"
        >
          JETZT GRATIS BERECHNEN & MAXIMAL-CHECK HOLEN
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-slate-600 text-sm">
          Kostenlos · Unverbindlich · Nur für ernsthafte Vorhaben ab 20.000 €
        </p>

        {/* Pflicht-Hinweise */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4 text-left">
          {[
            { icon: Shield, title: "Zweckbindung beachten", desc: "Gebäude: 12 Jahre · Maschinen: 5 Jahre · EDV: 3 Jahre nach Förderabschluss." },
            { icon: MapPin, title: "Ranking-System NRW", desc: "Anträge werden nach Punktesystem priorisiert — Tierwohl und Klima zählen am meisten." },
            { icon: FileText, title: "ELAN-Portal", desc: "NRW-Anträge laufen vollständig digital über das ELAN-Portal der Landwirtschaftskammer." },
          ].map((item) => (
            <div key={item.title} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="w-4 h-4 text-emerald-400" />
                <p className="text-white font-semibold text-xs">{item.title}</p>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function AFPLandingPage() {
  const [modalOpen, setModalOpen] = useState(false)

  const scrollToRechner = () => {
    document.getElementById("rechner")?.scrollIntoView({ behavior: "smooth" })
  }

  const openModal = () => setModalOpen(true)

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <NavigationIndustrial />

      <main>
        <HeroSection onCTAClick={scrollToRechner} />
        <CalculatorSection onCTAClick={openModal} />
        <PainSection />
        <SolutionSection onCTAClick={openModal} />
        <TableSection />
        <ProcessSection onCTAClick={openModal} />
        <ExclusionsSection />
        <SocialProofSection />
        <FinalCTASection onCTAClick={openModal} />
      </main>

      <Footer />

      {modalOpen && (
        <ContactFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
