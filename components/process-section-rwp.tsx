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
  AlertTriangle
} from "lucide-react"
import { LeadCaptureModal } from "./lead-capture-modal"

// ============================================
// TEMPLATE ANLEITUNG: PROZESS / ABLAUF (TIMELINE)
// ============================================
// SALES-FUNNEL STAGE: Objections Handling & Trust Building
// ZWECK: Zeige den kompletten Weg von Start bis Geld → Demystifizierung
// VERKAUFSLOGIK: Klare Steps → "Ich weiß genau, was passiert" → Psychologische Sicherheit
// KONVERSIONSROUTE: ✓ "Das ist transparent & einfach" → Ready to move forward
// ============================================
//
// WAS REIN MUSS:
// 1. 4-5 PROZESSSCHRITTE (nicht mehr!)
//    - Jeder Step sollte EINE klare Aktion sein
//    - Zeitrahmen / Dauer
//    - "Key Fact" pro Step (was ist das Besondere?)
//
// 2. STRUKTUR JEDES STEPS:
//    {
//      number: "01",
//      icon: IconName,
//      title: "[Schritt kurz & prägnant]",
//      description: "[2-3 Sätze, was genau passiert]",
//      duration: "[Wie lange dauert es]",
//      result: "[Was ist das Ergebnis]",
//      keyFact: "[Das Besondere an diesem Step]",
//      keyFactIcon: IconName,
//      color: "teal",  // für visual variety
//      warning: "[Optional: Was kann schief gehen?]",
//      highlight: "[Optional: Neu/Wichtig/Game-Changer]",
//    }
//
// VERKAUFS-TIPP:
// - Steps sollten PSYCHOLOGISCH progressiv wirken: "Fast geschafft!"
// - Key Facts = Mini Unique Selling Points
// - Warnings = Trust Building (we care about your risks)
// - Highlight = Neu/Besonderheit (z.B. "Sofortiger Start möglich!")

const steps = [
  {
    number: "01",
    icon: FileSearch,
    title: "Rechner ausfüllen (45 Sekunden)",
    description: "Bundesland, Vorhaben, Investitionsvolumen, Alter – fertig. Du siehst sofort deinen vorläufigen Förderbetrag. Kein Blabla, keine versteckten Kosten.",
    duration: "Kostenlos & sofort",
    result: "Dein vorläufiger Förderbetrag steht",
    keyFact: "Kostenlos & unverbindlich",
    keyFactIcon: Check,
    color: "teal",
  },
  {
    number: "02",
    icon: FileCheck,
    title: "Persönlichen Maximal-Check sichern",
    description: "Klick auf 'Persönlichen Check' und schick mir deine groben Pläne. Ich prüfe Prosperitätsgrenze, Einkommensnachweis, Maßnahmentyp und alles, was 70 % der Anträge killt.",
    duration: "1–2 Werktage",
    result: "Klares Go / No-Go + Optimierungspotenzial",
    keyFact: "Ich verhindere Ablehnungen",
    keyFactIcon: Shield,
    color: "blue",
    warning: "Wichtig: KEINEN Auftrag vergeben, solange der Bescheid noch nicht da ist – sonst kein Cent!",
  },
  {
    number: "03",
    icon: Upload,
    title: "Antrag einreichen – und starten",
    description: "Ich übernehme den kompletten Papierkram: Antrag, Portal (ELAN, BayFöG etc.), Nachweise, Kostenplan. Du unterschreibst einmal. Nach Einreichung: Maßnahmenbeginn erlaubt!",
    duration: "Sofort nach Einreichung starten",
    result: "Bescheid in 6–12 Wochen",
    keyFact: "Maßnahmenbeginn sofort möglich",
    keyFactIcon: Zap,
    color: "emerald",
    highlight: "NEU 2026: In vielen Bundesländern kein Warten auf Bewilligungsbescheid mehr!",
  },
  {
    number: "04",
    icon: Banknote,
    title: "Bauen & Abschlagszahlungen kassieren",
    description: "Während du baust, fließen bereits Abschlagszahlungen. Ich begleite dich bei Zwischenberichten und Nachweisen – du konzentrierst dich auf deinen Betrieb.",
    duration: "Projektlaufzeit 6–36 Monate",
    result: "Laufende Auszahlungen sichern Liquidität",
    keyFact: "Abschlagszahlungen möglich",
    keyFactIcon: CircleDollarSign,
    color: "violet",
    highlight: "Bis zu 3 Abschlagszahlungen während der Bauphase – keine Vorfinanzierung nötig",
  },
  {
    number: "05",
    icon: Shield,
    title: "Abschluss & Zweckbindung",
    description: "Nach Fertigstellung: Verwendungsnachweis einreichen, Restzahlung kassieren. Danach 5 Jahre Zweckbindung – das geförderte Asset bleibt im Betrieb.",
    duration: "5 Jahre Zweckbindung",
    result: "Voller Zuschuss aufs Konto",
    keyFact: "Ich erledige die Abrechnung",
    keyFactIcon: AlertTriangle,
    color: "slate",
    highlight: "Zweckbindung 5 Jahre: Keine Veräußerung, Verlagerung oder Nutzungsänderung",
  },
]

const colorClasses = {
  teal: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    icon: "bg-teal-100 text-teal-600",
    dot: "bg-teal-500",
    badge: "bg-teal-100 text-teal-700",
    highlight: "bg-teal-500/10 border-teal-500/30 text-teal-700",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "bg-blue-100 text-blue-600",
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700",
    highlight: "bg-amber-500/10 border-amber-500/30 text-amber-700",
    warning: "bg-red-50 border-red-200 text-red-700",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "bg-emerald-100 text-emerald-600",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
    highlight: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700",
  },
  violet: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    icon: "bg-violet-100 text-violet-600",
    dot: "bg-violet-500",
    badge: "bg-violet-100 text-violet-700",
    highlight: "bg-violet-500/10 border-violet-500/30 text-violet-700",
  },
  slate: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    icon: "bg-slate-100 text-slate-600",
    dot: "bg-slate-500",
    badge: "bg-slate-100 text-slate-700",
    highlight: "bg-slate-500/10 border-slate-500/30 text-slate-700",
  },
}

function ProcessStep({ step, index }: { step: typeof steps[0]; index: number }) {
  const [ref, inView] = useInView({ 
    triggerOnce: true, 
    threshold: 0.2,
    rootMargin: "-50px 0px" 
  })
  
  const colors = colorClasses[step.color as keyof typeof colorClasses]
  const isEven = index % 2 === 0

  return (
    <div ref={ref} className="relative">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex gap-4"
        >
          {/* Timeline */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
              className={`w-12 h-12 rounded-full ${colors.dot} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
            >
              {step.number}
            </motion.div>
            {index < steps.length - 1 && (
              <motion.div 
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-0.5 flex-1 bg-gradient-to-b from-slate-300 to-slate-200 origin-top mt-2"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`${colors.bg} ${colors.border} border rounded-2xl p-5`}
            >
              {/* Key Fact Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.5 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 ${colors.badge} rounded-full text-xs font-semibold mb-3`}
              >
                <step.keyFactIcon className="w-3 h-3" />
                {step.keyFact}
              </motion.div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">{step.title}</h3>
              <p className="text-sm text-slate-600 mb-3">{step.description}</p>
              
              {/* Warning if exists */}
              {step.warning && (
                <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-700 font-medium flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    {step.warning}
                  </p>
                </div>
              )}
              
              {/* Highlight if exists */}
              {step.highlight && (
                <div className={`mb-3 p-2.5 ${colors.highlight} border rounded-lg`}>
                  <p className="text-xs font-medium">{step.highlight}</p>
                </div>
              )}

              {/* Meta */}
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {step.duration}
                </div>
                <div className="flex items-center gap-1.5 text-teal-600 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  {step.result}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className={`grid grid-cols-[1fr,80px,1fr] gap-8 items-center min-h-[220px] ${
          index < steps.length - 1 ? "pb-8" : ""
        }`}>
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={isEven ? "" : "order-3"}
          >
            {isEven && (
              <div className={`${colors.bg} ${colors.border} border rounded-2xl p-6 ml-auto max-w-lg`}>
                <StepContent step={step} inView={inView} colors={colors} />
              </div>
            )}
          </motion.div>

          {/* Center Timeline */}
          <div className="flex flex-col items-center order-2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={inView ? { scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
              className={`relative w-16 h-16 rounded-full ${colors.dot} flex items-center justify-center text-white font-bold text-xl shadow-xl z-10`}
            >
              {step.number}
              {/* Pulse ring */}
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                className={`absolute inset-0 rounded-full ${colors.dot}`}
              />
            </motion.div>
            {index < steps.length - 1 && (
              <motion.div 
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="w-1 flex-1 bg-gradient-to-b from-slate-300 via-slate-200 to-slate-300 origin-top mt-4"
              />
            )}
          </div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={isEven ? "order-3" : ""}
          >
            {!isEven && (
              <div className={`${colors.bg} ${colors.border} border rounded-2xl p-6 mr-auto max-w-lg`}>
                <StepContent step={step} inView={inView} colors={colors} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function StepContent({ step, inView, colors }: { step: typeof steps[0]; inView: boolean; colors: typeof colorClasses.teal }) {
  return (
    <>
      {/* Key Fact Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.4 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${colors.badge} rounded-full text-xs font-semibold mb-3`}
      >
        <step.keyFactIcon className="w-3.5 h-3.5" />
        {step.keyFact}
      </motion.div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
      <p className="text-sm sm:text-base text-slate-600 mb-3">{step.description}</p>
      
      {/* Warning if exists */}
      {step.warning && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs sm:text-sm text-red-700 font-medium flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {step.warning}
          </p>
        </div>
      )}
      
      {/* Highlight if exists */}
      {step.highlight && (
        <div className={`mb-3 p-3 ${colors.highlight} border rounded-lg`}>
          <p className="text-xs sm:text-sm font-medium">{step.highlight}</p>
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-sm">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="w-4 h-4" />
          {step.duration}
        </div>
        <div className="flex items-center gap-1.5 text-teal-600 font-medium">
          <Check className="w-4 h-4" />
          {step.result}
        </div>
      </div>
    </>
  )
}

export function ProcessSectionRWP() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section id="ablauf" className="py-16 sm:py-20 lg:py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-4">
            Der Ablauf
          </span>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Von der Idee bis zum Geld auf dem Konto – in 5 klaren Schritten
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            Ich begleite dich von der ersten Berechnung bis zur Schlusszahlung – du baust, ich mach den Kram.
          </p>
          
          {/* Key Facts Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
              <Zap className="w-3 h-3" />
              45 Sek. bis zum Ergebnis
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
              <CircleDollarSign className="w-3 h-3" />
              Abschlagszahlungen möglich
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              <Upload className="w-3 h-3" />
              Sofort nach Einreichung starten
            </span>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {steps.map((step, index) => (
            <ProcessStep key={step.number} step={step} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 sm:mt-14 text-center"
        >
          {/* TEMPLATE: Final CTA am Ende des Prozesses */}
          {/* ANLEITUNG:
             - Button-Text: Action-Oriented
             - z.B. "Jetzt beginnen", "Kostenlose Beratung starten", "Mein Angebot prüfen"
             - Sub-Copy: Removal von Friction ("Keine Kosten", "Unverbindlich")
          */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl shadow-lg transition-all group"
          >
            Jetzt kostenlos Förderbetrag berechnen
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-slate-500 mt-3">Kostenlos • Unverbindlich • Nur für ernsthafte Vorhaben ab 20.000 €</p>
        </motion.div>
      </div>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
