"use client"

import { motion } from "framer-motion"
import { XCircle, AlertCircle, ArrowRight } from "lucide-react"

const negativeList = [
  "Klassischer Einzelhandel (Supermärkte, Bekleidung, Apotheken)",
  "Lokale Dienstleistungen (Friseure, Reinigungen, Physiotherapie)",
  "Standard-Bauwirtschaft für regionalen Markt",
  "Freie Berufe (Anwälte, Notare, Steuerberater)",
  "Gesundheit & Soziales (andere Fördertöpfe verfügbar)",
  "Primärsektor (Landwirtschaft, Forstwirtschaft, Fischerei)",
]

const grayZone = [
  {
    industry: "Großhandel",
    problem: "Gilt oft als rein lokal",
    solution: "Mit eigener Lagerlogistik oder Veredelung → Förderfähig!",
  },
  {
    industry: "E-Commerce",
    problem: "Reiner Handel ist schwierig",
    solution: "Mit eigener Software-Entwicklung oder Logistik-Hub → Förderfähig!",
  },
  {
    industry: "Baugewerbe",
    problem: "Lokal fokussiert",
    solution: "Spezialbau mit Patenten oder überregionaler Montage → Förderfähig!",
  },
]

export function IndustryEligibility() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Wer wird gefördert?{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Ihr Branchen-Check
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Nicht jede Branche erhält Zuschüsse. Die Richtlinie 2026 zur Regional-Förderung bevorzugt Unternehmen, die den Standort stärken
            und Innovationen vorantreiben.
          </p>
          <div className="mt-8 p-6 glass-effect-premium rounded-2xl max-w-2xl mx-auto">
            <p className="text-lg font-semibold text-accent">
              „Haben Sie Kunden außerhalb Ihrer Stadtgrenzen? Dann stehen die Chancen gut, dass wir Ihr nächstes
              Großprojekt mit 35% bis 45% refinanzieren können."
            </p>
          </div>
        </motion.div>

        {/* Negative List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-8 shadow-premium-lg max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-8 h-8 text-slate-600" />
              <h3 className="text-2xl font-bold text-slate-900">Negativliste</h3>
            </div>
            <p className="text-slate-700 mb-6">
              Diese Branchen stehen im lokalen Wettbewerb und sind daher nicht förderfähig (EU-Vorgabe).
            </p>

            <div className="space-y-3">
              {negativeList.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/50 rounded-lg p-3 border border-slate-300"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 mt-1">—</span>
                    <span className="text-slate-700">{item}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Gray Zone - Trust Lever */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-effect-premium rounded-3xl p-8 md:p-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <AlertCircle className="w-8 h-8 text-accent" />
            <h3 className="text-2xl md:text-3xl font-bold">Die Grauzone – Wo Experten den Unterschied machen</h3>
          </div>

          <div className="space-y-6">
            {grayZone.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid md:grid-cols-3 gap-4 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
              >
                <div>
                  <div className="text-sm font-semibold text-amber-900 mb-1">Branche</div>
                  <div className="font-bold text-lg">{item.industry}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-amber-900 mb-1">Problem</div>
                  <div className="text-muted-foreground">{item.problem}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-900 mb-1">Die Lösung für 2026</div>
                  <div className="text-green-700 font-medium flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>{item.solution}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-accent/5 border border-accent/20 rounded-xl">
            <p className="text-center text-lg font-semibold text-accent">
              Unsicher, ob Ihr Unternehmen förderfähig ist? Wir prüfen kostenlos Ihren Primäreffekt.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
