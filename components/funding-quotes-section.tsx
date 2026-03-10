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
  { region: "Neue Bundesländer (BB, SN, ST, TH, MV)", kmu: "bis 75 %", grossunternehmen: "bis 65 %", examples: "Brandenburg, Sachsen, Thüringen, Sachsen-Anhalt, Mecklenburg-Vorpommern" },
  { region: "Westdeutsche Regionen (NRW, NDS, BY, BW …)", kmu: "bis 50 %", grossunternehmen: "bis 40 %", examples: "NRW, Niedersachsen, Bayern, Baden-Württemberg, Hessen" },
  { region: "Alle Bundesländer – Basis-Satz", kmu: "20 %", grossunternehmen: "20 %", examples: "Gilt immer als Mindestförderung ohne Boni" },
]

const bonuses = [
  { name: "Tierwohl-Premium (Anlage 2)", value: "+20 %", icon: Leaf, color: "text-green-600", bg: "bg-green-50" },
  { name: "Junglandwirt-Bonus (≤ 40 Jahre)", value: "+10 %", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
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

        {/* Förderquoten Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-8"
        >
          {fundingData.map((row, idx) => (
            <div key={idx} className={`p-4 sm:p-6 ${idx !== fundingData.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                <div className="font-semibold text-slate-900">{row.region}</div>
                <div className="text-center">
                  <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 font-bold rounded-lg text-sm">
                    {row.kmu}
                  </span>
                </div>
                <div className="text-center text-sm text-slate-600">{row.grossunternehmen}</div>
                <div className="text-sm text-slate-500">{row.examples}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bonus Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          {bonuses.map((bonus) => {
            const Icon = bonus.icon
            return (
              <div key={bonus.name} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex items-center gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${bonus.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${bonus.color}`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm sm:text-base">{bonus.name}</div>
                  <div className="text-xs sm:text-sm text-slate-500">oben drauf möglich</div>
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
          <div className="text-sm sm:text-base opacity-90 mb-1">Maximum AFP-Fördersatz (Hessen SIUK + Tierwohl + Junglandwirt)</div>
          <div className="text-4xl sm:text-5xl font-bold mb-2">bis 75 %</div>
          <div className="text-sm opacity-80">Hessen, ohne Einkommensgrenze, Tierwohl-Maßnahme + Junglandwirt-Bonus</div>
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
            Jetzt meinen genauen Fördersatz berechnen
          </button>
          <p className="text-sm text-slate-500 mt-2">Kostenlos • 45 Sekunden • Brutal ehrlich</p>
        </motion.div>
      </div>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
