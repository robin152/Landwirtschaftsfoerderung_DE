"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sprout,
  Hammer,
  CircleDollarSign,
  ShoppingBasket,
  ChevronRight,
  Sparkles,
  ArrowDown
} from "lucide-react"

interface Phase {
  id: string
  icon: typeof Sprout
  title: string
  subtitle: string
  description: string
  color: string
  bgColor: string
  borderColor: string
  hoverBorder: string
  iconBg: string
  examples: string[]
}

const PHASES: Phase[] = [
  {
    id: "start",
    icon: Sprout,
    title: "Ich starte durch",
    subtitle: "Hofübernahme & Gründung",
    description: "Sie übernehmen einen Hof, gründen neu oder sind unter 40 Jahren in der Landwirtschaft aktiv.",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    hoverBorder: "hover:border-violet-400",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    examples: ["Junglandwirt-Bonus", "Niederlassungsbeihilfe", "Beratungsförderung"]
  },
  {
    id: "build",
    icon: Hammer,
    title: "Ich baue um oder neu",
    subtitle: "Investition in Gebäude & Technik",
    description: "Sie planen einen Stallbau, Umbau, neue Technik oder Umweltinvestitionen.",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    hoverBorder: "hover:border-emerald-400",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
    examples: ["Stallbau bis 65 %", "Güllelager", "Energieeffizienz"]
  },
  {
    id: "optimize",
    icon: CircleDollarSign,
    title: "Ich optimiere den Cashflow",
    subtitle: "Flächenprämien & Umweltprogramme",
    description: "Sie möchten jährliche Einnahmen durch Ökolandbau, Agrarumweltmaßnahmen oder Prämienprogramme steigern.",
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    hoverBorder: "hover:border-sky-400",
    iconBg: "bg-gradient-to-br from-sky-500 to-blue-600",
    examples: ["Ökolandbau", "Weideprämie", "Smart Farming"]
  },
  {
    id: "diversify",
    icon: ShoppingBasket,
    title: "Ich schaffe ein zweites Standbein",
    subtitle: "Diversifizierung & Vermarktung",
    description: "Sie möchten einen Hofladen, Ferienwohnungen, Gastronomie oder andere Einnahmequellen aufbauen.",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    hoverBorder: "hover:border-amber-400",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
    examples: ["Hofladen", "Urlaub auf dem Hof", "Soziale Landwirtschaft"]
  }
]

export function PhaseSelectorQuiz() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const handlePhaseSelect = useCallback((phaseId: string) => {
    try {
      setSelectedPhase(phaseId)
      setHasInteracted(true)
      setIsNavigating(true)

      // Smooth scroll to the lifecycle section with the correct phase pre-selected
      const targetSection = document.getElementById("lebensphasen")
      
      if (targetSection) {
        // Dispatch custom event to set the active phase in FarmLifecycleSection
        const event = new CustomEvent("setActivePhase", { detail: { phaseId } })
        window.dispatchEvent(event)

        // Smooth scroll with offset for header
        const yOffset = -80
        const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset
        
        window.scrollTo({ top: y, behavior: "smooth" })
        
        // Reset navigation state after scroll completes
        setTimeout(() => {
          setIsNavigating(false)
        }, 800)
      } else {
        setIsNavigating(false)
      }
    } catch (error) {
      console.error("[PhaseSelectorQuiz] Error during phase selection:", error)
      setIsNavigating(false)
    }
  }, [])

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && selectedPhase) {
        handlePhaseSelect(selectedPhase)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedPhase, handlePhaseSelect])

  return (
    <section 
      id="phase-quiz"
      aria-labelledby="quiz-heading"
      className="py-16 sm:py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ihr persönlicher Förderweg
          </motion.div>

          <h2 
            id="quiz-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 tracking-tight text-balance"
          >
            In welcher Phase befindet sich Ihr Hof?
          </h2>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Wählen Sie Ihre aktuelle Situation und erhalten Sie nur die Förderungen, die für Sie relevant sind.
          </p>
        </motion.div>

        {/* Phase Cards Grid */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
          role="radiogroup"
          aria-labelledby="quiz-heading"
        >
          {PHASES.map((phase, idx) => {
            const Icon = phase.icon
            const isSelected = selectedPhase === phase.id
            
            return (
              <motion.button
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => handlePhaseSelect(phase.id)}
                disabled={isNavigating}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${phase.title}: ${phase.description}`}
                className={`
                  relative group text-left w-full
                  rounded-2xl border-2 p-5 sm:p-6
                  transition-all duration-300 ease-out
                  ${isSelected 
                    ? `${phase.bgColor} ${phase.borderColor} shadow-lg ring-2 ring-offset-2 ${phase.borderColor.replace('border-', 'ring-')}` 
                    : `bg-white border-slate-200 ${phase.hoverBorder} hover:shadow-md hover:-translate-y-0.5`
                  }
                  ${isNavigating ? "opacity-70 cursor-wait" : "cursor-pointer"}
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500
                `}
              >
                {/* Selection indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`w-4 h-4 rounded-full ${phase.iconBg}`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`
                    w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0
                    transition-all duration-300
                    ${isSelected ? phase.iconBg : "bg-slate-100 group-hover:bg-slate-200"}
                  `}>
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${isSelected ? "text-white" : "text-slate-500 group-hover:text-slate-700"}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`
                      font-bold text-base sm:text-lg mb-1 transition-colors duration-200
                      ${isSelected ? phase.color : "text-slate-900"}
                    `}>
                      {phase.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-slate-500 mb-2.5">
                      {phase.subtitle}
                    </p>

                    <p className="text-sm text-slate-600 leading-relaxed mb-3 hidden sm:block">
                      {phase.description}
                    </p>

                    {/* Example tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {phase.examples.map((example) => (
                        <span 
                          key={example}
                          className={`
                            text-xs px-2.5 py-1 rounded-full font-medium transition-colors duration-200
                            ${isSelected 
                              ? `${phase.bgColor} ${phase.color}` 
                              : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                            }
                          `}
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <ChevronRight className={`
                    w-5 h-5 flex-shrink-0 mt-1 transition-all duration-200
                    ${isSelected 
                      ? `${phase.color} translate-x-1` 
                      : "text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1"
                    }
                  `} />
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Bottom indicator / scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 sm:mt-10"
        >
          <AnimatePresence mode="wait">
            {!hasInteracted ? (
              <motion.div
                key="hint"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-col items-center gap-2 text-slate-400"
              >
                <span className="text-sm">Wählen Sie Ihre Phase für personalisierte Infos</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </motion.div>
            ) : (
              <motion.div
                key="selected"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center justify-center gap-2 text-emerald-600 font-medium text-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Zeige passende Förderungen...
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  )
}
