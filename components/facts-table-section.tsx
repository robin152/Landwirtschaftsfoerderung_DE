"use client"

import { motion } from "framer-motion"
import { TrendingUp, Building2, MapPin, Leaf, Users, Euro } from "lucide-react"

const facts = [
  {
    category: "Pfad A: Regionale Investition (Art. 14/17)",
    items: [
      { label: "C-Gebiet Typ A (Klein)", value: "35-50%", sublabel: "Basis 35% + Boni möglich" },
      { label: "C-Gebiet Typ B (Klein)", value: "30-50%", sublabel: "Basis 30% + Boni möglich" },
      { label: "C+-Gebiet (Grenzzuschlag)", value: "45/35/25%", sublabel: "C-Basis + 10 PP (KU/MU/GU)" },
      { label: "D-Gebiet + De-minimis", value: "50/40/30%", sublabel: "Klein/Mittel/Groß mit +20% Aufschlag" },
    ],
  },
  {
    category: "Pfad B: Erneuerbare Energie (Art. 41)",
    items: [
      { label: "PV, Wind, Wärmepumpen", value: "65/55/45%", sublabel: "Klein/Mittel/Groß - gebietsunabhängig" },
      { label: "Stromspeicher (≥75% EE)", value: "50/40/30%", sublabel: "Klein/Mittel/Groß - gebietsunabhängig" },
    ],
  },
  {
    category: "Pfad C: Umwelt & Effizienz (Art. 36/38)",
    items: [
      { label: "Umweltschutz (C-Gebiet)", value: "65/55/45%", sublabel: "Klein/Mittel/Groß - mit +5% C-Bonus" },
      { label: "Energieeffizienz (C-Gebiet)", value: "55/45/35%", sublabel: "Klein/Mittel/Groß - mit +5% C-Bonus" },
    ],
  },
]

const kpis = [
  { icon: Euro, label: "Max. Förderquote", value: "65%", desc: "EE-Erzeugung / Umwelt (KU)" },
  { icon: Building2, label: "Max. Beihilfe Umwelt/EE", value: "30 Mio€", desc: "Pro Vorhaben (Art. 4)" },
  { icon: MapPin, label: "De-minimis Obergrenze", value: "300k€", desc: "Über 3 Jahre rollierend" },
  { icon: Users, label: "D-Gebiet KMU Max", value: "8,25 Mio€", desc: "Pro Unternehmen+Vorhaben" },
  { icon: Leaf, label: "Max. Invest De-minimis", value: "600k-1M€", sublabel: "Je nach Größe", desc: "Je nach Größe" },
  { icon: TrendingUp, label: "Einzelnotifizierung ab", value: "55 Mio€", desc: "EU-Genehmigung nötig" },
]

export function FactsTableSection() {
  return (
    <section id="facts" className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-purple-600 mb-4">
            Die Fakten
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Regional-Förderung 2026 im Überblick
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Alle wichtigen Zahlen und Konditionen der aktuellen Förderrichtlinie.
          </p>
        </motion.div>

        {/* KPI Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16"
        >
          {kpis.map((kpi, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-5 text-center hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mx-auto mb-3">
                <kpi.icon className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{kpi.value}</div>
              <div className="text-xs font-semibold text-slate-700 mb-1">{kpi.label}</div>
              <div className="text-xs text-slate-500">{kpi.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Detailed Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-6 py-4 text-sm font-semibold">Kategorie</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Kriterium</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold">Förderquote</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {facts.map((section, sectionIndex) =>
                  section.items.map((item, itemIndex) => (
                    <tr
                      key={`${sectionIndex}-${itemIndex}`}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${itemIndex === 0 ? "border-t-2 border-t-slate-200" : ""}`}
                    >
                      {itemIndex === 0 && (
                        <td
                          rowSpan={section.items.length}
                          className="px-6 py-4 font-semibold text-slate-900 bg-slate-50 align-top border-r border-slate-100"
                        >
                          {section.category}
                        </td>
                      )}
                      <td className="px-6 py-4 font-medium text-slate-800">{item.label}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 font-bold rounded-full text-sm">
                          {item.value}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{item.sublabel}</td>
                    </tr>
                  )),
                )}
                {/* Max Row */}
                <tr className="bg-purple-50 border-t-2 border-purple-200">
                  <td className="px-6 py-4 font-bold text-purple-800">Maximale Förderung</td>
                  <td className="px-6 py-4 font-medium text-purple-800">Kleinunternehmen + C-Gebiet + Klimaschutz</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-4 py-2 bg-purple-600 text-white font-bold rounded-full">
                      bis 45%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-purple-700 text-sm font-medium">30% + 10% + 10% kombiniert</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-sm text-slate-500 mt-6"
        >
          Stand: Richtlinie Regional-Förderung 2026. Änderungen vorbehalten.
        </motion.p>
      </div>
    </section>
  )
}
