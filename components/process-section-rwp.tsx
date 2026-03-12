"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import {
  FileSearch,
  FileCheck,
  Upload,
  Banknote,
  Shield,
  ArrowRight,
  Check,
  Clock,
  Zap,
  CircleDollarSign,
  AlertTriangle,
} from "lucide-react"
import { LeadCaptureModal } from "./lead-capture-modal"

const steps = [
  {
    number: "01",
    icon: FileSearch,
    title: "Rechner ausfuellen",
    sub: "45 Sekunden",
    description: "Bundesland, Vorhaben, Volumen, Alter - fertig. Ihr Foerderbetrag erscheint sofort.",
    duration: "Kostenlos & sofort",
    result: "Vorlaeufiger Foerderbetrag",
    accent: "#16a34a",
    warning: null,
    highlight: null,
  },
  {
    number: "02",
    icon: FileCheck,
    title: "Persoenlicher Check",
    sub: "1-2 Werktage",
    description: "Wir pruefen Ihr Jahreseinkommen, den Investitionstyp und alle Stolperfallen, die 70 % der Antraege scheitern lassen.",
    duration: "1-2 Werktage",
    result: "Go / No-Go + Optimierung",
    accent: "#5a7a4a",
    warning: "Keinen Auftrag vergeben, solange der Bescheid noch aussteht!",
    highlight: null,
  },
  {
    number: "03",
    icon: Upload,
    title: "Antrag einreichen",
    sub: "Sofort starten",
    description: "Wir uebernehmen Antrag, Portal, Nachweise, Kostenplan. Sie unterschreiben einmal.",
    duration: "Nach Einreichung starten",
    result: "Bescheid in 6-12 Wochen",
    accent: "#0d9488",
    warning: null,
    highlight: "NEU 2026: In vielen Bundeslaendern kein Warten auf Bewilligungsbescheid mehr!",
  },
  {
    number: "04",
    icon: Banknote,
    title: "Bauen & kassieren",
    sub: "6-36 Monate",
    description: "Waehrend Sie bauen, fliessen schon Abschlagszahlungen. Wir kuemmern uns um Zwischenberichte.",
    duration: "6-36 Monate Laufzeit",
    result: "Laufende Auszahlungen",
    accent: "#d97706",
    warning: null,
    highlight: "Keine Vorfinanzierung der vollen Summe noetig",
  },
  {
    number: "05",
    icon: Shield,
    title: "Abschluss & Zahlung",
    sub: "Voller Betrag",
    description: "Verwendungsnachweis einreichen, Restzahlung kassieren. 5 Jahre Zweckbindung.",
    duration: "5 Jahre Zweckbindung",
    result: "Voller Zuschuss aufs Konto",
    accent: "#16a34a",
    warning: null,
    highlight: null,
  },
]

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const Icon = step.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="relative"
    >
      {/* Card */}
      <div
        className="relative flex flex-col h-full rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full"
          style={{ background: step.accent }}
        />

        <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
          {/* Step number + icon row */}
          <div className="flex items-center justify-between">
            {/* Icon circle */}
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${step.accent}15` }}
            >
              <Icon className="w-6 h-6" style={{ color: step.accent }} />
            </div>

            {/* Step number */}
            <span
              className="text-4xl font-bold select-none"
              style={{ color: `${step.accent}25` }}
            >
              {step.number}
            </span>
          </div>

          {/* Sub badge */}
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: `${step.accent}15`, color: step.accent }}
            >
              {step.sub}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 leading-snug">{step.title}</h3>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed flex-1">{step.description}</p>

          {/* Warning */}
          {step.warning && (
            <div
              className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs bg-red-50 border border-red-200 text-red-700"
            >
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{step.warning}</span>
            </div>
          )}

          {/* Highlight */}
          {step.highlight && (
            <div
              className="rounded-lg px-3 py-2.5 text-xs font-medium"
              style={{
                background: `${step.accent}10`,
                border: `1px solid ${step.accent}30`,
                color: step.accent,
              }}
            >
              {step.highlight}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-4 mt-auto border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {step.duration}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: step.accent }}>
              <Check className="w-3.5 h-3.5" />
              {step.result}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ProcessSectionRWP() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section id="ablauf" className="py-16 sm:py-24 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-emerald-100 text-emerald-700 border border-emerald-200">
            Der Ablauf
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 text-balance">
            Von der Idee bis zum Geld auf dem Konto -
            <br className="hidden sm:block" />
            <span className="text-emerald-600"> in 5 klaren Schritten</span>
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Wir begleiten Sie von der ersten Berechnung bis zur Schlusszahlung -
            Sie unterschreiben nur einmal.
          </p>
        </motion.div>

        {/* Steps - vertical stack on mobile, horizontal on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.slice(0, 3).map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
        
        {/* Second row - 2 cards centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8 max-w-3xl mx-auto">
          {steps.slice(3, 5).map((step, i) => (
            <StepCard key={step.number} step={step} index={i + 3} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12 sm:mt-16"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-200 group bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30"
          >
            <span>Foerderung kostenlos berechnen</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-3 text-xs text-slate-500">
            Kostenlos - Unverbindlich - Nur fuer Vorhaben ab 20.000 Euro
          </p>
        </motion.div>

      </div>
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
