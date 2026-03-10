"use client"

import { motion } from "framer-motion"
import {
  X,
  Check,
  Truck,
  ShoppingCart,
  Building2,
  Stethoscope,
  Tractor,
  ArrowRight,
} from "lucide-react"

export function EligibilitySection() {
  const negativListe = [
    {
      id: "retail",
      icon: ShoppingCart,
      title: "Einzelhandel",
      reason: "Kaufkraft-Umverteilung innerhalb der Region",
      exception: "Reiner Versandhandel (E-Commerce ohne stationäre Präsenz) kann förderfähig sein",
    },
    {
      id: "construction",
      icon: Building2,
      title: "Baugewerbe",
      wzCode: "WZ 41-43",
      reason: "Ortsgebundene Leistungserbringung ohne Exportcharakter",
      exception: null,
    },
    {
      id: "transport",
      icon: Truck,
      title: "Transportwesen",
      reason: "Reine Transportvorgänge nicht förderfähig",
      items: ["Taxiunternehmen", "Speditionen (reiner Transport)", "ÖPNV"],
    },
    {
      id: "health",
      icon: Stethoscope,
      title: "Gesundheits- & Sozialwesen",
      reason: "Keine gewerbliche Investitionsförderung",
      exception: "Ggf. über Infrastrukturprogramme adressierbar",
    },
    {
      id: "agriculture",
      icon: Tractor,
      title: "Landwirtschaft",
      reason: "Eigene EU-Agrarfonds (ELER) zuständig",
      exception: null,
    },
  ]

  return (
    <section
      id="eligibility"
      className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <svg className="w-full h-full">
          <pattern id="grid-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-lg shadow-slate-200/50 border border-slate-100 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-700">WZ-Klassifikation 2026</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Negativliste:{" "}
            <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Diese Branchen sind ausgeschlossen
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Die folgenden Branchen sind von der Regionalförderung ausgeschlossen. Prüfen Sie hier, ob Ihr Unternehmen 
            betroffen ist und welche Alternativen es gibt.
          </p>
        </motion.div>

        {/* Negativliste Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {negativListe.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white rounded-3xl border-2 border-red-200 overflow-hidden hover:border-red-300 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300">
                {/* Red stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500" />

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">{category.title}</h3>
                      {"wzCode" in category && category.wzCode && (
                        <span className="text-xs text-slate-500">{category.wzCode}</span>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <X className="w-4 h-4 text-red-600" strokeWidth={3} />
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-red-700 font-medium">
                      <span className="font-bold">Grund:</span> {category.reason}
                    </p>
                  </div>

                  {"items" in category && category.items && (
                    <div className="space-y-2 mb-4">
                      {category.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <X className="w-3 h-3 text-red-400" />
                          {item}
                        </div>
                      ))}
                    </div>
                  )}

                  {category.exception && (
                    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-700">
                          <span className="font-semibold">Ausnahme:</span> {category.exception}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="text-left">
              <p className="font-semibold text-slate-900">Nicht sicher, ob Ihre Branche förderfähig ist?</p>
              <p className="text-sm text-slate-500">Wir prüfen Ihren WZ-Code kostenfrei.</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40">
              Branche prüfen lassen
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
