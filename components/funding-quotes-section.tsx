"use client"

import { motion } from "framer-motion"
import { MapPin, TrendingUp, Leaf } from "lucide-react"
import { LeadCaptureModal } from "./lead-capture-modal"
import { useState } from "react"

// ============================================
// TEMPLATE ANLEITUNG: FÖRDERQUOTEN / PRICING TABLE
// ============================================
// SALES-FUNNEL STAGE: Value Proposition / Trust Building
// ZWECK: Besucher sollen verstehen, WIE VIEL sie bekommen können (Concrete Value)
// VERKAUFSLOGIK: Konkrete Zahlen → Emotionale Response ("Wow, bis 65%!")
// 
// WAS REIN MUSS:
// 1. FUNDING TABLE mit Regionen/Kategorien & Förderquoten (2-3 Rows)
// 2. BONUS-KARTEN (2-3 Stück) mit Icon + % 
// 3. HIGHLIGHT-BOX mit MAXIMUM Quote

const fundingData = [
  { bl: "NRW",               maxInvest: "1,2 Mio.",    basis: "20 %", tierwohl: "40 %",   siuk: "50 %",   kombi: "40 %",  jung: "+10 %", note: "Kälbermatten-Aufschlag befristet" },
  { bl: "Niedersachsen/HB/HH", maxInvest: "1,5 Mio.", basis: "20 %", tierwohl: "40 %",   siuk: "40 %",   kombi: "40 %",  jung: "+10 %", note: "Mobilställe explizit förderfähig" },
  { bl: "Bayern",            maxInvest: "1,2 Mio.",    basis: "20 %", tierwohl: "25 %",   siuk: "40 %",   kombi: "40 %",  jung: "+10 %", note: "Meister +15 PP, Öko-Bonus" },
  { bl: "Baden-Württemberg", maxInvest: "2,0 Mio.",    basis: "20 %", tierwohl: "30–40 %",siuk: "40 %",   kombi: "40 %",  jung: "+10 %", note: "Schweine ab Sept. 2026 wieder" },
  { bl: "Hessen",            maxInvest: "5,0 Mio.",    basis: "20 %", tierwohl: "40 %",   siuk: "75 %",   kombi: "50 %",  jung: "+10 %", note: "Höchste SIUK-Sätze bundesweit", highlight: true },
  { bl: "Sachsen-Anhalt",    maxInvest: "5,0 Mio.",    basis: "20 %", tierwohl: "40 %",   siuk: "40 %",   kombi: "40 %",  jung: "+10 %", note: "Höchste Prosper.-Grenze neue BL" },
  { bl: "Brandenburg (+BE)", maxInvest: "5,0 Mio.",    basis: "40 %", tierwohl: "65 %",   siuk: "65 %",   kombi: "65 %",  jung: "+10 %", note: "Sehr hohe Sätze", highlight: true },
  { bl: "Sachsen",           maxInvest: "5,0 Mio.",    basis: "20 %", tierwohl: "40 %",   siuk: "65 %",   kombi: "50 %",  jung: "+10 %", note: "GV/ha-Grenze < 2,0 beachten" },
  { bl: "Thüringen",         maxInvest: "5,0 Mio.",    basis: "20 %", tierwohl: "40 %",   siuk: "40 %",   kombi: "40 %",  jung: "+10 %", note: "Extra-Öko-Bonus" },
  { bl: "Rheinland-Pfalz",   maxInvest: "k.A. (min. 50k)", basis: "20 %", tierwohl: "40 %", siuk: "40 %", kombi: "40 %", jung: "+10 %", note: "Diversifizierung stark" },
  { bl: "Saarland",          maxInvest: "3,0 Mio.",    basis: "25 %", tierwohl: "40 %",   siuk: "40 %",   kombi: "40 %",  jung: "+10 %", note: "Gülleabdeckung bis 90 %" },
  { bl: "MV / SH / SL",     maxInvest: "1–5 Mio.",    basis: "20 %", tierwohl: "40 %",   siuk: "40–65 %",kombi: "40–50 %",jung: "+10 %", note: "Mobilställe & SIUK stark" },
]

export function FundingQuotesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section id="funding-quotes" className="py-14 sm:py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full text-xs sm:text-sm font-semibold text-green-700 mb-4">
            <MapPin className="w-3.5 h-3.5" />
            Dein Bundesland entscheidet
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Manche Bundesländer zahlen deutlich mehr – siehst du deins?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Der AFP-Fördersatz hängt von Standort, Maßnahme und deinen Boni ab. Hier der Überblick – ohne Weichzeichner.
          </p>
        </motion.div>

        {/* Förderquoten Table — vollständig je Bundesland */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-8"
        >
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-0 bg-slate-800 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide">
            <div className="col-span-2 px-3 sm:px-4 py-3">Bundesland</div>
            <div className="px-1 sm:px-2 py-3 text-center leading-tight">
              Basis
              <span className="block text-slate-400 font-normal normal-case text-[9px] sm:text-[10px] tracking-normal">Grundsatz</span>
            </div>
            <div className="px-1 sm:px-2 py-3 text-center leading-tight">
              Tierwohl
              <span className="block text-slate-400 font-normal normal-case text-[9px] sm:text-[10px] tracking-normal">Stall &amp; Haltung</span>
            </div>
            <div className="px-1 sm:px-2 py-3 text-center leading-tight">
              Klima max.
              <span className="block text-slate-400 font-normal normal-case text-[9px] sm:text-[10px] tracking-normal">SIUK Emissionen</span>
            </div>
            <div className="px-1 sm:px-2 py-3 text-center leading-tight">
              Kombi max.
              <span className="block text-slate-400 font-normal normal-case text-[9px] sm:text-[10px] tracking-normal">Tierwohl + Klima</span>
            </div>
            <div className="px-1 sm:px-2 py-3 text-center leading-tight">
              Jung
              <span className="block text-slate-400 font-normal normal-case text-[9px] sm:text-[10px] tracking-normal">≤ 40 Jahre</span>
            </div>
          </div>
          {fundingData.map((row, idx) => (
            <div
              key={row.bl}
              className={`grid grid-cols-7 gap-0 text-sm border-b border-slate-100 last:border-0 transition-colors ${
                "highlight" in row && row.highlight ? "bg-emerald-50" : idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              }`}
            >
              <div className="col-span-2 px-4 py-3">
                <span className={`font-semibold ${"highlight" in row && row.highlight ? "text-emerald-800" : "text-slate-900"}`}>
                  {row.bl}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">{row.note}</p>
              </div>
              <div className="px-2 py-3 text-center font-medium text-slate-700">{row.basis}</div>
              <div className={`px-2 py-3 text-center font-semibold ${"highlight" in row && row.highlight ? "text-emerald-700" : "text-slate-700"}`}>
                {row.tierwohl}
              </div>
              <div className={`px-2 py-3 text-center font-bold ${"highlight" in row && row.highlight ? "text-emerald-700" : "text-slate-800"}`}>
                {row.siuk}
              </div>
              <div className="px-2 py-3 text-center font-semibold text-slate-700">{row.kombi}</div>
              <div className="px-2 py-3 text-center font-medium text-amber-600">{row.jung}</div>
            </div>
          ))}
        </motion.div>

        {/* Legende — Abkürzungen erklärt */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8 px-1">
          {[
            { term: "Basis",        desc: "Grundförderquote — gilt für alle förderfähigen Investitionen" },
            { term: "Tierwohl",     desc: "Stall-Umbau über Mindeststandard: mehr Platz, Licht, Laufhöfe (Anlage 1 + 2)" },
            { term: "SIUK",         desc: "Stallbau, Infrastruktur, Umwelt & Klima — z.B. Abluftreinigung, Güllekühlung, Biogasanlage (Anlage 3B)" },
            { term: "Kombi",        desc: "Kombination Tierwohl + SIUK in einem Vorhaben — ergibt den höchsten Gesamtsatz" },
            { term: "Jung +10 %",   desc: "Junglandwirt-Bonus für Betriebsinhaber bis 40 Jahre, max. 20.000 € Aufschlag" },
          ].map(({ term, desc }) => (
            <div key={term} className="flex items-start gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 whitespace-nowrap">{term}:</span>
              <span>{desc}</span>
            </div>
          ))}
        </div>

        {/* Bonus Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          {[
            { name: "Tierwohl-Premium (Anlage 2)", value: "bis +20 %", icon: Leaf, color: "text-green-600", bg: "bg-green-50", hint: "Stallumbau mit mehr Platz, Licht & Außenklima" },
            { name: "Junglandwirt-Bonus (≤ 40 Jahre)", value: "+10 %", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", hint: "Max. 20.000 € Aufschlag auf Basis-Zuschuss" },
          ].map((bonus) => {
            const Icon = bonus.icon
            return (
              <div key={bonus.name} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex items-center gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${bonus.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${bonus.color}`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm sm:text-base">{bonus.name}</div>
                  <div className="text-xs sm:text-sm text-slate-500">{bonus.hint}</div>
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${bonus.color}`}>{bonus.value}</div>
              </div>
            )
          })}
        </motion.div>

        {/* Maximum Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center text-white mb-8"
        >
          <div className="text-sm sm:text-base opacity-90 mb-1">Maximum AFP-Fördersatz (Tierwohl + Junglandwirt-Bonus)</div>
          <div className="text-4xl sm:text-5xl font-bold mb-2">bis 50 %</div>
          <div className="text-sm opacity-80">Basis 20 % + Tierwohl-Premium 20 % + Junglandwirt-Bonus 10 % = 50 % (alle Bundesländer)</div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
          >
            Förderung kostenlos berechnen
          </button>
          <p className="text-sm text-slate-500 mt-2">Kostenlos • 45 Sekunden • Brutal ehrlich</p>
        </motion.div>
      </div>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
