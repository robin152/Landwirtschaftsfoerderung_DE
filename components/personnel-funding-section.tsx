"use client"

import { useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Users, GraduationCap, Rocket, Euro, ArrowRight, Check, Sparkles, Calculator } from "lucide-react"
import { LeadCaptureModal } from "./lead-capture-modal"

const benefits = [
  {
    id: "lohnkosten",
    icon: Users,
    badge: "bis 35%",
    badgeColor: "bg-emerald-500",
    title: "Lohnkosten-Cashback",
    subtitle: "Zuschuss auf neue Stellen",
    description: "Sie müssen sich nicht auf Maschinen beschränken. Berechnen Sie den Zuschuss auf Basis der Lohnkosten für neue Mitarbeiter.",
    highlight: "42.000 € pro neuer Stelle",
    highlightSub: "bei 60.000 € Jahresgehalt",
    details: [
      "Bruttolohnkosten für 2 Jahre als Förderbasis",
      "Gilt für alle neu geschaffenen Dauerarbeitsplätze",
      "Kombinierbar mit Sachinvestitionen",
      "Ideal für personalintensive Wachstumsprojekte"
    ],
    example: {
      label: "Rechenbeispiel",
      calc: "5 neue Stellen × 60.000 € × 2 Jahre = 600.000 € Förderbasis",
      result: "Bei 35% Quote = 210.000 € Zuschuss"
    },
    color: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    borderColor: "border-emerald-200"
  },
  {
    id: "schulungen",
    icon: GraduationCap,
    badge: "bis 40%",
    badgeColor: "bg-blue-500",
    title: "Interne Stunden fördern",
    subtitle: "Lohnersatz für Schulungen",
    description: "Ihre bestehenden Mitarbeiter auf Schulung? Die Regional-Förderung übernimmt bis zu 40% der Lohnfortzahlung während der Qualifizierung.",
    highlight: "bis 50.000 € Erstattung",
    highlightSub: "pro Qualifizierungsmaßnahme",
    details: [
      "Lohnfortzahlung während Schulungen gefördert",
      "Für Transformations- und Technologie-Schulungen",
      "Interne Lohnstunden werden zu 'echtem Cash'",
      "Ideal bei Digitalisierung & Automatisierung"
    ],
    example: {
      label: "Rechenbeispiel",
      calc: "10 Mitarbeiter × 2 Wochen Schulung × 3.000 € Lohn = 30.000 €",
      result: "Bei 40% Quote = 12.000 € Erstattung"
    },
    color: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-50 to-indigo-50",
    borderColor: "border-blue-200"
  },
  {
    id: "innovation",
    icon: Rocket,
    badge: "bis 50%",
    badgeColor: "bg-violet-500",
    title: "Innovations-Bonus",
    subtitle: "Markteinführung gefördert",
    description: "KMU mit innovativen Produkten erhalten bis zu 50% Zuschuss auf Markteinführungskosten - inklusive Personal für den Markteinstieg.",
    highlight: "bis 400.000 € Zuschuss",
    highlightSub: "für Markteinführungsprojekte",
    details: [
      "Messeauftritte und Marketing gefördert",
      "Personelle Projektressourcen eingeschlossen",
      "Höchste Förderquote in der Regional-Förderung",
      "Speziell für innovative KMU-Produkte"
    ],
    example: {
      label: "Rechenbeispiel",
      calc: "Markteinführung neues Produkt: 500.000 € Projektkosten",
      result: "Bei 50% Quote = 250.000 € Zuschuss"
    },
    color: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
    borderColor: "border-violet-200"
  }
]

export function PersonnelFundingSection() {
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <>
      <section ref={ref} className="py-20 lg:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">Geheimtipp: Personal als Projektkosten</span>
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6">
              Nicht nur Maschinen —{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                auch Personal fördern lassen
              </span>
            </h2>
            
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Die Regional-Förderung 2026 bietet einen massiven Hebel für Personalkosten. Ideal für Unternehmen, 
              die wachsen wollen, aber keine riesigen Maschinenparks brauchen.
            </p>
          </motion.div>

          {/* Benefit Cards */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              const isActive = activeCard === benefit.id
              
              return (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                  onMouseEnter={() => setActiveCard(benefit.id)}
                  onMouseLeave={() => setActiveCard(null)}
                  className={`group relative bg-white rounded-2xl border-2 ${benefit.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer`}
                >
                  {/* Top Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 ${benefit.badgeColor} rounded-full`}>
                    <span className="text-white text-sm font-bold">{benefit.badge}</span>
                  </div>

                  {/* Card Content */}
                  <div className={`p-6 lg:p-8 bg-gradient-to-br ${benefit.bgGradient}`}>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-5 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{benefit.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">{benefit.subtitle}</p>
                    
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {benefit.description}
                    </p>

                    {/* Highlight Box */}
                    <div className={`p-4 bg-white rounded-xl border ${benefit.borderColor} mb-6`}>
                      <div className="flex items-center gap-3">
                        <Euro className={`w-8 h-8 bg-gradient-to-br ${benefit.color} text-white rounded-lg p-1.5`} />
                        <div>
                          <div className="text-2xl font-bold text-slate-900">{benefit.highlight}</div>
                          <div className="text-xs text-slate-500">{benefit.highlightSub}</div>
                        </div>
                      </div>
                    </div>

                    {/* Details List */}
                    <ul className="space-y-2 mb-6">
                      {benefit.details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 + i * 0.05 }}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            benefit.id === "lohnkosten" ? "text-emerald-500" :
                            benefit.id === "schulungen" ? "text-blue-500" : "text-violet-500"
                          }`} />
                          <span>{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Example Calculation - Expandable */}
                  <motion.div
                    initial={false}
                    animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={`p-5 bg-gradient-to-r ${benefit.color} text-white`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Calculator className="w-4 h-4" />
                        <span className="text-sm font-semibold">{benefit.example.label}</span>
                      </div>
                      <p className="text-sm text-white/90 mb-2">{benefit.example.calc}</p>
                      <p className="text-lg font-bold">{benefit.example.result}</p>
                    </div>
                  </motion.div>

                  {/* Mobile: Always show example */}
                  <div className="lg:hidden p-5 bg-slate-50 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-semibold text-slate-600">{benefit.example.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-1">{benefit.example.calc}</p>
                    <p className={`text-sm font-bold bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent`}>
                      {benefit.example.result}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Summary Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 lg:p-10 text-white"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                  Personal-Update für Ihre Förderung
                </h3>
                <p className="text-slate-300 mb-6">
                  Die Kombination aus Sachinvestitionen und Personalförderung maximiert Ihren Förderbetrag. 
                  Wir analysieren, welcher Mix für Ihr Vorhaben optimal ist.
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-400">35%</div>
                    <div className="text-xs text-slate-400">Lohnkosten-Cashback</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-blue-400">40%</div>
                    <div className="text-xs text-slate-400">Schulungsförderung</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-violet-400">50%</div>
                    <div className="text-xs text-slate-400">Innovations-Bonus</div>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Personal-Förderung prüfen
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl" />
                  
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="text-sm text-slate-400 mb-4">Ihr Vorteil auf einen Blick</div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-slate-300">Lohnkosten-Cashback</span>
                        <span className="font-bold text-emerald-400">bis 35% Zuschuss</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-slate-300">Schulungsförderung</span>
                        <span className="font-bold text-blue-400">bis 40% Lohnersatz</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-slate-300">Innovations-Bonus</span>
                        <span className="font-bold text-violet-400">bis 50% Erstattung</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-slate-400">
                        Tipp: Kombinieren Sie alle drei Fördertöpfe für maximale Rendite
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
