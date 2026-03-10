"use client"

import { motion } from "framer-motion"
import { XCircle, AlertTriangle, Info } from "lucide-react"

const EXCLUSIONS = [
  {
    label: "Reine Ersatzinvestitionen",
    detail: "1:1-Austausch ohne messbaren Mehrwert oder Verbesserung",
    icon: XCircle,
    type: "hard",
  },
  {
    label: "Gebrauchte Maschinen & Anlagen",
    detail: "Gebrauchtgut ist generell nicht förderfähig, unabhängig vom Kaufpreis",
    icon: XCircle,
    type: "hard",
  },
  {
    label: "Landankauf",
    detail: "Grundstücks- und Bodenerwerb ist explizit ausgeschlossen",
    icon: XCircle,
    type: "hard",
  },
  {
    label: "Tiere, Produktionsrechte, Gesellschaftsanteile",
    detail: "Lebendvieh, Milchquoten, Beteiligungen an anderen Unternehmen",
    icon: XCircle,
    type: "hard",
  },
  {
    label: "EEG-geförderte Energieanlagen",
    detail: "Photovoltaik und Biogasanlagen, die nach dem EEG vergütet werden",
    icon: XCircle,
    type: "hard",
  },
  {
    label: "Vorzeitiger Maßnahmenbeginn",
    detail: "Vertragsabschluss oder Baubeginn VOR dem offiziellen Förderbescheid",
    icon: AlertTriangle,
    type: "hard",
  },
  {
    label: "Laufende Betriebsausgaben",
    detail: "Umsatzsteuer, Leasing, Wartungsverträge, Personalkosten",
    icon: XCircle,
    type: "hard",
  },
  {
    label: "Schweinehaltungs-Neubauten",
    detail: "In vielen Bundesländern bis 31.12.2027 ausgeschlossen – prüfe dein Bundesland",
    icon: AlertTriangle,
    type: "conditional",
  },
  {
    label: "Reine Basisförderung in Bayern / BW",
    detail: "Bayern und Baden-Württemberg fördern nur noch Premium-Tierwohl und SIUK – keine Basismaßnahmen",
    icon: AlertTriangle,
    type: "conditional",
  },
]

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const item = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export function ExclusionsSection() {
  const hard = EXCLUSIONS.filter((e) => e.type === "hard")
  const conditional = EXCLUSIONS.filter((e) => e.type === "conditional")

  return (
    <section id="exclusions" className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-4">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-700 uppercase tracking-wide">Nicht förderfähig</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 text-balance">
            Was der Staat definitiv <span className="text-red-600">nicht</span> bezahlt
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Diese Ausschlüsse kosten Antragsteller jährlich Millionen — weil sie es erst nach Ablehnung erfahren.
            Kennst du sie vorher, planst du von Anfang an korrekt.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">

          {/* Hard exclusions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Generelle Ausschlüsse</h3>
            </div>
            <motion.ul
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-2"
            >
              {hard.map((e) => {
                const Icon = e.icon
                return (
                  <motion.li
                    key={e.label}
                    variants={item}
                    className="group flex items-start gap-3 p-3.5 rounded-xl bg-red-50/60 border border-red-100 hover:border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 leading-snug">{e.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{e.detail}</p>
                    </div>
                  </motion.li>
                )
              })}
            </motion.ul>
          </div>

          {/* Conditional exclusions + CTA */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Bundesland-abhängig</h3>
              </div>
              <motion.ul
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-2"
              >
                {conditional.map((e) => {
                  const Icon = e.icon
                  return (
                    <motion.li
                      key={e.label}
                      variants={item}
                      className="group flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 hover:border-amber-200 hover:bg-amber-50 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-snug">{e.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{e.detail}</p>
                      </div>
                    </motion.li>
                  )
                })}
              </motion.ul>
            </div>

            {/* Info callout */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-start gap-3"
            >
              <Info className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-800 mb-1">
                  Nicht sicher, ob deine Investition förderfähig ist?
                </p>
                <p className="text-xs text-green-700 leading-relaxed">
                  Patrick Starkmann prüft das kostenlos in einem kurzen Erstgespräch — bevor du einen Euro investierst.
                  98 % der Projekte, die er bewertet, sind förderfähig oder werden förderfähig gemacht.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
