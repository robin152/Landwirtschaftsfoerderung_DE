"use client"

import { useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { 
  XCircle, 
  ShoppingCart, 
  HardHat, 
  Truck, 
  Car, 
  Heart, 
  Tractor,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ExternalLink
} from "lucide-react"
import { LeadCaptureModal } from "./lead-capture-modal"

// ============================================
// TEMPLATE ANLEITUNG: NEGATIVLISTE / NICHT FÖRDERFÄHIG
// ============================================
// SALES-FUNNEL STAGE: Objection Handling & Qualification
// ZWECK: Lead-Segmentierung - "Passt mein Unternehmen?" 
// VERKAUFSLOGIK: Negative Case aufzeigen → "Wenn Sie hier NICHT stehen → wir helfen Ihnen"
// ALTERNATIVE: Show paths for NOT eligible (upsell!)
// ============================================
//
// WAS REIN MUSS:
// 1. AUSGESCHLOSSENE BRANCHEN (5-7 Stück)
//    - Icon pro Branche
//    - Branchenname
//    - Grund für Ausschluss (kurz & prägnant)
//    - Ggf. ALTERNATIVE/Exception zeigen (Cross-Sell)
//
// 2. HEADER: Klare Nachricht
//    - "Diese Branchen sind ausgeschlossen..."
//    - Aber: "Nicht auf der Liste? Dann haben Sie gute Chancen!"
//
// VERKAUFS-TIPP:
// - Diese Sektion ist LEAD-QUALIFIER: "Bin ich überhaupt förderfähig?"
// - Exceptions/Alternativen sind CROSS-SELL-Möglichkeiten
// - Call-to-Action sollte: "Lassen Sie uns prüfen, auch wenn Sie hier stehen"

const excludedIndustries = [
  {
    id: "[ID-1]",
    icon: ShoppingCart,
    title: "[BRANCHE 1: z.B. 'Einzelhandel']",
    reason: "[GRUND FÜR AUSSCHLUSS]",
    exception: "[OPTIONAL: Gibt es eine Exception? z.B. 'E-Commerce ohne Laden']",
    hasAlternative: true,
  },
  {
    id: "[ID-2]",
    icon: HardHat,
    title: "[BRANCHE 2]",
    reason: "[GRUND]",
    exception: null,
    hasAlternative: false,
  },
  {
    id: "[ID-3]",
    icon: Truck,
    title: "[BRANCHE 3]",
    reason: "[GRUND]",
    exception: null,
    hasAlternative: false,
  },
]

export function NegativlisteSection() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <>
      <section ref={ref} className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full mb-5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">Nicht Förderfähig</span>
            </div>
            
            {/* TEMPLATE ÜBERSCHRIFT: "Nicht Förderfähig" als Qualifier */}
            {/* ANLEITUNG: Klare Message - aber mit Hoffnung ("Nicht hier? Dann haben Sie gute Chancen!") */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">
              Nicht Förderfähig
            </h2>
            
            {/* SUBHEADLINE: Erklärt die Logik & gibt Hoffnung */}
            {/* ANLEITUNG: "Diese Branchen sind ausgeschlossen, aber NICHT auf der Liste? Dann haben Sie gute Chancen!" */}
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Diese Branchen sind von der Förderung ausgeschlossen. Nicht auf der Liste? Ihre Chancen sind hoch – lassen Sie uns prüfen.
            </p>
          </motion.div>

          {/* Industries Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
            {excludedIndustries.map((industry, index) => {
              const Icon = industry.icon
              const isExpanded = expandedCard === industry.id
              const isLandwirtschaft = industry.id === "landwirtschaft"
              
              return (
                <motion.div
                  key={industry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                  className={`relative bg-white rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                    isLandwirtschaft 
                      ? "border-amber-300 ring-2 ring-amber-100" 
                      : "border-red-200 hover:border-red-300"
                  } ${isExpanded ? "shadow-lg" : "shadow-sm hover:shadow-md"}`}
                >
                  {/* Special Badge for Landwirtschaft */}
                  {isLandwirtschaft && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-bl-lg">
                      Alternatives Programm
                    </div>
                  )}
                  
                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : industry.id)}
                    className="w-full text-left"
                  >
                    <div className="p-5 sm:p-6">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isLandwirtschaft ? "bg-amber-100" : "bg-red-100"
                        }`}>
                          <Icon className={`w-6 h-6 ${isLandwirtschaft ? "text-amber-600" : "text-red-600"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-lg">{industry.title}</h3>
                          {industry.wzCode && (
                            <span className="text-xs text-slate-500 font-mono">{industry.wzCode}</span>
                          )}
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
                          isExpanded ? "rotate-90" : ""
                        }`} />
                      </div>
                      
                      {/* Reason */}
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-600">{industry.reason}</p>
                      </div>
                    </div>
                  </button>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`px-5 pb-5 sm:px-6 sm:pb-6 border-t ${
                        isLandwirtschaft ? "border-amber-200 bg-amber-50/50" : "border-red-100 bg-red-50/30"
                      }`}
                    >
                      <div className="pt-4 space-y-3">
                        {industry.examples && (
                          <div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Beispiele:</span>
                            <ul className="mt-1 space-y-1">
                              {industry.examples.map((ex, i) => (
                                <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                  <span className="w-1 h-1 bg-slate-400 rounded-full" />
                                  {ex}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {industry.exception && (
                          <div className={`p-3 rounded-lg ${isLandwirtschaft ? "bg-amber-100" : "bg-green-50 border border-green-200"}`}>
                            <span className={`text-xs font-semibold uppercase tracking-wide ${isLandwirtschaft ? "text-amber-700" : "text-green-700"}`}>
                              Ausnahme:
                            </span>
                            <p className={`text-sm mt-1 ${isLandwirtschaft ? "text-amber-800" : "text-green-800"}`}>
                              {industry.exception}
                            </p>
                          </div>
                        )}
                        
                        {industry.specialNote && (
                          <div className="p-3 bg-amber-100 rounded-lg border border-amber-200">
                            <div className="flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-xs font-bold text-amber-700 uppercase">Tipp:</span>
                                <p className="text-sm text-amber-800 mt-1">{industry.specialNote}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {industry.hasAlternative && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsModalOpen(true)
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Alternative prüfen lassen
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-slate-900 rounded-xl sm:rounded-2xl p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-14 h-14 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-7 h-7 text-teal-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg sm:text-xl mb-2">
                  Unsicher, ob Ihre Branche förderfähig ist?
                </h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  Viele Branchen sind auf den ersten Blick ausgeschlossen, aber es gibt Ausnahmen und alternative Programme. 
                  Wir prüfen Ihren individuellen Fall kostenlos.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex-shrink-0 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-colors"
              >
                Kostenlos prüfen
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
