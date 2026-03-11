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
    accent: "#16a34a",
    accentLight: "#dcfce7",
    accentText: "#15803d",
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
    accent: "#2563eb",
    accentLight: "#dbeafe",
    accentText: "#1d4ed8",
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
    accent: "#0d9488",
    accentLight: "#ccfbf1",
    accentText: "#0f766e",
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
    accent: "#d97706",
    accentLight: "#fef3c7",
    accentText: "#b45309",
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
    accent: "#16a34a",
    accentLight: "#dcfce7",
    accentText: "#15803d",
    warning: null,
    highlight: null,
  },
]

function StepCard({ step, index, isLast }: { step: typeof steps[0]; index: number; isLast: boolean }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const Icon = step.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.52, delay: index * 0.08, ease: "easeOut" }}
      className="relative group"
    >
      {/* Card */}
      <div
        className="relative flex flex-col h-full rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
          border: `1.5px solid ${step.accent}33`,
          boxShadow: `0 4px 32px ${step.accent}18`,
        }}
      >
        {/* Top glow bar */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${step.accent}, ${step.accent}66)` }}
        />

        <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
          {/* Step number + icon row */}
          <div className="flex items-start justify-between">
            {/* Icon circle */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 + 0.18, type: "spring", stiffness: 240 }}
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: `${step.accent}22` }}
            >
              <Icon className="w-5 h-5" style={{ color: step.accent }} />
            </motion.div>

            {/* Large step number — always visible, high contrast */}
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.35, delay: index * 0.08 + 0.1 }}
              className="text-5xl font-black leading-none select-none tabular-nums"
              style={{
                color: step.accent,
                opacity: 0.22,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {step.number}
            </motion.span>
          </div>

          {/* Readable step number badge */}
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-black"
              style={{ background: step.accent, color: "#fff" }}
            >
              {index + 1}
            </span>
            <span className="text-xs font-semibold" style={{ color: step.accent }}>
              {step.sub}
            </span>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{step.title}</h3>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-400 leading-relaxed flex-1">{step.description}</p>

          {/* Warning */}
          {step.warning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 + 0.4 }}
              className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs"
              style={{ background: "#7f1d1d22", border: "1px solid #f87171aa", color: "#fca5a5" }}
            >
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{step.warning}</span>
            </motion.div>
          )}

          {/* Highlight */}
          {step.highlight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 + 0.4 }}
              className="rounded-lg px-3 py-2.5 text-xs font-medium"
              style={{
                background: `${step.accent}18`,
                border: `1px solid ${step.accent}55`,
                color: step.accent,
              }}
            >
              {step.highlight}
            </motion.div>
          )}

          {/* Footer */}
          <div
            className="flex flex-wrap gap-x-4 gap-y-1 pt-3 mt-auto"
            style={{ borderTop: "1px solid #ffffff0f" }}
          >
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Clock className="w-3 h-3" />
              {step.duration}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: step.accent }}>
              <Check className="w-3 h-3" />
              {step.result}
            </span>
          </div>
        </div>
      </div>

      {/* Arrow connector between cards (desktop only, not after last) */}
      {!isLast && (
        <div className="hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 items-center justify-center">
          <ChevronRight className="w-5 h-5 text-slate-600" strokeWidth={2.5} />
        </div>
      )}
    </motion.div>
  )
}

export function ProcessSectionRWP() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section id="ablauf" className="py-16 sm:py-24 overflow-hidden" style={{ background: "#020617" }}>
      <div className="page-container px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: "#16a34a22", color: "#4ade80", border: "1px solid #16a34a44" }}>
            Der Ablauf
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
            Von der Idee bis zum Geld auf dem Konto –
            <br className="hidden sm:block" />
            <span style={{ color: "#4ade80" }}> in 5 klaren Schritten</span>
          </h2>
          <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Ich begleite dich von der ersten Berechnung bis zur Schlusszahlung —
            du unterschreibst nur einmal.
          </p>

          {/* Step progress pills */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 flex-wrap">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{ background: `${s.accent}20`, color: s.accent, border: `1px solid ${s.accent}44` }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                    style={{ background: s.accent }}
                  >
                    {i + 1}
                  </span>
                  {s.title}
                </span>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Steps grid — 5 cols xl, 3 cols lg, 2 cols sm, 1 col xs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 xl:gap-6 relative">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} isLast={i === steps.length - 1} />
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
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 text-white font-bold text-base sm:text-lg rounded-2xl transition-all duration-200 group relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              boxShadow: "0 8px 32px #16a34a44",
            }}
          >
            <span className="relative z-10">Förderung kostenlos berechnen</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            {/* Shimmer on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" }} />
          </button>
          <p className="mt-3 text-xs text-slate-500">
            Kostenlos · Unverbindlich · Nur für Vorhaben ab 20.000 €
          </p>
        </motion.div>

      </div>
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
