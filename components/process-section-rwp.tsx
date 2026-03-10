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
  ChevronRight,
} from "lucide-react"
import { LeadCaptureModal } from "./lead-capture-modal"

const steps = [
  {
    number: "01",
    icon: FileSearch,
    title: "Rechner ausfüllen",
    sub: "45 Sekunden",
    description: "Bundesland, Vorhaben, Volumen, Alter – fertig. Dein Förderbetrag erscheint sofort.",
    duration: "Kostenlos & sofort",
    result: "Vorläufiger Förderbetrag",
    keyFact: "Kostenlos & unverbindlich",
    keyFactIcon: Check,
    accent: "emerald",
    warning: null,
    highlight: null,
  },
  {
    number: "02",
    icon: FileCheck,
    title: "Persönlicher Check",
    sub: "1–2 Werktage",
    description: "Ich prüfe Prosperitätsgrenze, Maßnahmentyp und alles, was 70 % der Anträge killt.",
    duration: "1–2 Werktage",
    result: "Go / No-Go + Optimierung",
    keyFact: "Ablehnungen verhindern",
    keyFactIcon: Shield,
    accent: "blue",
    warning: "Keinen Auftrag vergeben, solange der Bescheid noch aussteht!",
    highlight: null,
  },
  {
    number: "03",
    icon: Upload,
    title: "Antrag einreichen",
    sub: "Sofort starten",
    description: "Ich übernehme Antrag, Portal, Nachweise, Kostenplan. Du unterschreibst einmal.",
    duration: "Nach Einreichung starten",
    result: "Bescheid in 6–12 Wochen",
    keyFact: "Sofortiger Maßnahmenbeginn",
    keyFactIcon: Zap,
    accent: "teal",
    warning: null,
    highlight: "NEU 2026: In vielen Bundesländern kein Warten auf Bewilligungsbescheid mehr!",
  },
  {
    number: "04",
    icon: Banknote,
    title: "Bauen & kassieren",
    sub: "6–36 Monate",
    description: "Während du baust, fließen schon Abschlagszahlungen. Ich kümmere mich um Zwischenberichte.",
    duration: "6–36 Monate Laufzeit",
    result: "Laufende Auszahlungen",
    keyFact: "Bis zu 3 Abschläge",
    keyFactIcon: CircleDollarSign,
    accent: "amber",
    warning: null,
    highlight: "Keine Vorfinanzierung der vollen Summe nötig",
  },
  {
    number: "05",
    icon: Shield,
    title: "Abschluss & Zahlung",
    sub: "Voller Betrag",
    description: "Verwendungsnachweis einreichen, Restzahlung kassieren. 5 Jahre Zweckbindung.",
    duration: "5 Jahre Zweckbindung",
    result: "Voller Zuschuss aufs Konto",
    keyFact: "Ich erledige die Abrechnung",
    keyFactIcon: Check,
    accent: "green",
    warning: null,
    highlight: null,
  },
]

const accentMap: Record<string, { dot: string; ring: string; badge: string; badgeText: string; border: string; iconBg: string; iconText: string; highlight: string }> = {
  emerald: {
    dot:       "bg-emerald-500",
    ring:      "ring-emerald-300",
    badge:     "bg-emerald-100",
    badgeText: "text-emerald-700",
    border:    "border-emerald-200",
    iconBg:    "bg-emerald-100",
    iconText:  "text-emerald-600",
    highlight: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  blue: {
    dot:       "bg-blue-500",
    ring:      "ring-blue-300",
    badge:     "bg-blue-100",
    badgeText: "text-blue-700",
    border:    "border-blue-200",
    iconBg:    "bg-blue-100",
    iconText:  "text-blue-600",
    highlight: "bg-blue-50 border-blue-200 text-blue-700",
  },
  teal: {
    dot:       "bg-teal-500",
    ring:      "ring-teal-300",
    badge:     "bg-teal-100",
    badgeText: "text-teal-700",
    border:    "border-teal-200",
    iconBg:    "bg-teal-100",
    iconText:  "text-teal-600",
    highlight: "bg-teal-50 border-teal-200 text-teal-700",
  },
  amber: {
    dot:       "bg-amber-500",
    ring:      "ring-amber-300",
    badge:     "bg-amber-100",
    badgeText: "text-amber-700",
    border:    "border-amber-200",
    iconBg:    "bg-amber-100",
    iconText:  "text-amber-600",
    highlight: "bg-amber-50 border-amber-200 text-amber-700",
  },
  green: {
    dot:       "bg-green-600",
    ring:      "ring-green-300",
    badge:     "bg-green-100",
    badgeText: "text-green-700",
    border:    "border-green-200",
    iconBg:    "bg-green-100",
    iconText:  "text-green-600",
    highlight: "bg-green-50 border-green-200 text-green-700",
  },
}

function StepCard({ step, index, total }: { step: typeof steps[0]; index: number; total: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
  const a = accentMap[step.accent]
  const Icon = step.icon
  const KeyIcon = step.keyFactIcon

  return (
    <div ref={ref} className="relative flex flex-col">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.09, ease: "easeOut" }}
        className={`relative flex flex-col h-full bg-white rounded-2xl border ${a.border} shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group`}
      >
        {/* Top accent stripe */}
        <div className={`h-1 w-full ${a.dot}`} />

        <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.09 + 0.15, type: "spring", stiffness: 260 }}
              className={`w-11 h-11 rounded-xl ${a.iconBg} ${a.iconText} flex items-center justify-center flex-shrink-0`}
            >
              <Icon className="w-5 h-5" />
            </motion.div>

            {/* Step number */}
            <span className="text-3xl font-black text-slate-100 select-none leading-none">{step.number}</span>
          </div>

          {/* Title + sub */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{step.title}</h3>
            <p className={`text-xs font-semibold mt-0.5 ${a.iconText}`}>{step.sub}</p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed flex-1">{step.description}</p>

          {/* Warning */}
          {step.warning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={inView ? { opacity: 1, height: "auto" } : {}}
              transition={{ duration: 0.4, delay: index * 0.09 + 0.35 }}
              className="flex items-start gap-1.5 bg-red-50 border border-red-200 rounded-lg px-2.5 py-2 text-xs text-red-700"
            >
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{step.warning}</span>
            </motion.div>
          )}

          {/* Highlight */}
          {step.highlight && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={inView ? { opacity: 1, height: "auto" } : {}}
              transition={{ duration: 0.4, delay: index * 0.09 + 0.35 }}
              className={`rounded-lg px-2.5 py-2 text-xs border ${a.highlight}`}
            >
              {step.highlight}
            </motion.div>
          )}

          {/* Footer meta */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              {step.duration}
            </span>
            <span className={`flex items-center gap-1 text-[11px] font-medium ${a.iconText}`}>
              <Check className="w-3 h-3" />
              {step.result}
            </span>
          </div>
        </div>

        {/* Hover shimmer */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent" />
        </div>
      </motion.div>

      {/* Arrow connector — between cards in same row (hidden after last in row) */}
      {index < total - 1 && (
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: index * 0.09 + 0.4 }}
          className={`
            hidden lg:flex
            absolute -right-4 top-1/2 -translate-y-1/2 z-10
            w-8 h-8 items-center justify-center
          `}
          style={{ right: "-1.15rem" }}
        >
          <ChevronRight className="w-5 h-5 text-slate-300" strokeWidth={2.5} />
        </motion.div>
      )}
    </div>
  )
}

export function ProcessSectionRWP() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section id="ablauf" className="py-14 sm:py-20 bg-slate-50 overflow-hidden">
      <div className="page-container px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-3">
            Der Ablauf
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 text-balance">
            Von der Idee bis zum Geld auf dem Konto –<br className="hidden sm:block" /> in 5 klaren Schritten
          </h2>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            Ich begleite dich von der ersten Berechnung bis zur Schlusszahlung.
          </p>

          {/* Pill tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {[
              { icon: Zap,              text: "45 Sek. bis zum Ergebnis",      cls: "bg-emerald-100 text-emerald-700" },
              { icon: CircleDollarSign, text: "Abschlagszahlungen möglich",    cls: "bg-amber-100  text-amber-700"   },
              { icon: Upload,           text: "Sofort nach Einreichung starten", cls: "bg-teal-100  text-teal-700"    },
            ].map(({ icon: PillIcon, text, cls }) => (
              <span key={text} className={`inline-flex items-center gap-1.5 px-3 py-1 ${cls} text-xs font-medium rounded-full`}>
                <PillIcon className="w-3 h-3" />
                {text}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Steps grid — 3 cols on lg, 2 on sm, 1 on xs — with col-gap for arrows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 relative mb-10">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} total={steps.length} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-7 py-4 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 transition-all duration-200 group hg-btn relative overflow-hidden"
          >
            Förderung kostenlos berechnen
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs text-slate-400 mt-2.5">
            Kostenlos · Unverbindlich · Nur für Vorhaben ab 20.000 €
          </p>
        </motion.div>
      </div>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
