"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Factory, 
  ShoppingBag, 
  Cpu, 
  ChevronRight,
  Sparkles,
  Check,
  ArrowRight,
  Eye
} from "lucide-react"
import type { SVGProps } from "react"

type IconComponent = React.ComponentType<SVGProps<SVGSVGElement> & { className?: string }>

// Custom Horse icon since Lucide doesn't have one
function HorseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 8c-2 0-3-1-3-3 0 2-1 3-3 3s-3-1-3-3c0 2-1 3-3 3-3 0-4-2-4-4l-2 3v5l3 2v6h3v-4l2-1 4 5h3v-6l2-2V8z" />
      <path d="M3 7l-1 4" />
      <circle cx="4" cy="5" r="1" />
    </svg>
  )
}

interface HiddenChance {
  id: string
  icon: IconComponent
  title: string
  subtitle: string
  badge: string
  badgeColor: string
  description: string
  items: string[]
  tip?: string
  warning?: string
}

const HIDDEN_CHANCES: HiddenChance[] = [
  {
    id: "praevention",
    icon: CloudRain,
    title: "Prävention & Resilienz",
    subtitle: "Schutz gegen Wetterextreme",
    badge: "bis 40 %",
    badgeColor: "bg-sky-600",
    description: "Die meisten denken bei der Förderung nur an Stall und Gülle. Aber Punkt 9.4.1b fördert massiv den Schutz gegen Klimawandel-Schäden.",
    items: [
      "Frostschutzberegnung im Obstbau",
      "Hagelschutzsysteme & Netzkonstruktionen",
      "Starkregenschutz gegen Überflutung & Erosion",
      "Windschutzanlagen für Sonderkulturen"
    ],
    tip: "Hier gibt es oft glatte 40 %, ohne dass man einen ganzen Stall bauen muss."
  },
  {
    id: "speziallager",
    icon: Thermometer,
    title: "Spezial-Lagerung",
    subtitle: "Über den Standard hinaus",
    badge: "bis 35 %",
    badgeColor: "bg-amber-600",
    description: "Oft wird nur „Lagerhalle" gesagt (meist ausgeschlossen). Aber spezielle klimatisierte Lager für Qualitätserhalt sind förderfähig.",
    items: [
      "Klimatisierte Lagerräume für Obst, Gemüse & Sonderkulturen",
      "Grobfutter-Lagerräume (Heu/Silage) bei Tierwohl-Umstellung",
      "Kartoffellagerung mit Klimatechnik zur Verlustreduzierung",
      "Kontrollierte Atmosphäre (CA-Lager) für längere Haltbarkeit"
    ],
    warning: "Reine Ersatz-Lagerhallen sind ausgeschlossen — der Clou liegt in der Spezialfunktion."
  },
  {
    id: "umweltschutz",
    icon: Factory,
    title: "Präzisions-Umweltschutz",
    subtitle: "Quick Wins für Ackerbauern",
    badge: "bis 40 %",
    badgeColor: "bg-emerald-600",
    description: "Das sind die Quick Wins für Ackerbauern, die keinen Stall bauen. Anlage 3 bietet spezifische Umweltschutz-Förderungen.",
    items: [
      "Biobett-Systeme zur biologischen Reinigung von Spritzen-Spülwasser",
      "Reinigungsplätze für Pflanzenschutzgeräte mit Auffangsystemen",
      "Güllekühlung & emissionsarme Böden — auch bei Nachrüstung",
      "Abluftreinigung ohne Stallneubau (wichtig für Schweinehalter!)"
    ],
    tip: "Besonders relevant für Schweinehalter, da Stallneubau aktuell gestoppt ist."
  },
  {
    id: "bewaesserung",
    icon: Droplets,
    title: "Bewässerungs-Management",
    subtitle: "Hochaktuell seit 2024",
    badge: "bis 35 %",
    badgeColor: "bg-blue-600",
    description: "Die Richtlinie ist hier extrem detailliert (Festlegung 2024). Nicht nur Hardware, auch Software wird gefördert.",
    items: [
      "Steuerungssoftware für intelligente Bewässerung",
      "Sensorik zur Bodenfeuchtemessung",
      "Tröpfchen- & Unterfluranlagen",
      "Wasserrückgewinnungssysteme"
    ],
    warning: "Voraussetzung: 15–25 % Wassereinsparung nachweisen. Einzelne Brunnenbohrungen sind meist nicht förderfähig."
  },
  {
    id: "direktvermarktung",
    icon: ShoppingBag,
    title: "Anhang-I-Erzeugnisse",
    subtitle: "Direktvermarktung & Verarbeitung",
    badge: "bis 30 %",
    badgeColor: "bg-purple-600",
    description: "Viele denken, die Förderung ist nur für Urproduktion. Aber Verarbeitung und Direktvermarktung sind ebenfalls förderfähig.",
    items: [
      "Hofkäserei & Fleischzerlegung (eigene Produkte)",
      "Verkaufsautomaten: Milchtankstellen, Regiomaten",
      "Hofläden für Anhang-I-Produkte",
      "Mobile Schlachtung & Verarbeitung"
    ],
    tip: "Das zieht eine ganz neue Zielgruppe: junge, innovative Landwirte mit Vermarktungsideen."
  },
  {
    id: "pferde",
    icon: HorseIcon,
    title: "Pferdezucht-Nische",
    subtitle: "Der vergessene Markt",
    badge: "bis 30 %",
    badgeColor: "bg-rose-600",
    description: "In der Primärquelle wird Pferdezucht explizit erwähnt. Viele Berater klammern das aus, weil es oft als „Hobby" gilt.",
    items: [
      "Stallungen für landwirtschaftliche Pferdezuchtbetriebe",
      "Reithallen mit landwirtschaftlicher Nutzung",
      "Weidewirtschaft & Auslaufflächen",
      "Zuchtausstattung & Tierhaltungstechnik"
    ],
    tip: "Ein riesiger, zahlungskräftiger Markt — aber nur für echte Zuchtbetriebe, nicht reine Pensionsställe."
  },
  {
    id: "smartfarming",
    icon: Cpu,
    title: "Digitale Transformation",
    subtitle: "Smart Farming der Zukunft",
    badge: "bis 40 %",
    badgeColor: "bg-indigo-600",
    description: "Unter „Verbesserung der Produktionsbedingungen" laufen moderne Digitalisierungsinvestitionen mit Top-Fördersätzen.",
    items: [
      "Herdenmanagement-Systeme: Software & Sensorik",
      "Halsbänder & Pedometer zur Tierüberwachung",
      "Melkroboter (AMS) & automatische Fütterungssysteme",
      "GPS-gestützte Präzisionslandwirtschaft"
    ],
    tip: "Hauptargument für die Förderung: Arbeitswirtschaft & Tierwohl-Verbesserung."
  }
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
}

const expandVariants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: { 
    opacity: 1, 
    height: "auto", 
    marginTop: 16,
    transition: { 
      duration: 0.4, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  },
  exit: { 
    opacity: 0, 
    height: 0, 
    marginTop: 0,
    transition: { 
      duration: 0.3, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
}

export function HiddenChancesSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section 
      ref={sectionRef}
      id="hidden-chances"
      className="py-20 sm:py-28 lg:py-32 bg-white relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hidden-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hidden-grid)" />
        </svg>
      </div>

      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

      <div className="page-container px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ 
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              border: "1px solid #d4a01755",
              boxShadow: "0 2px 12px rgba(180, 134, 11, 0.15)"
            }}
          >
            <Eye className="w-4 h-4 text-amber-700" />
            <span className="text-sm font-semibold text-amber-800 tracking-wide">
              Die versteckten 40%-Chancen
            </span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-5 tracking-tight text-balance leading-tight">
            7 Förder-Nischen, die{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                kaum einer kennt
              </span>
              <motion.span 
                className="absolute -bottom-1 left-0 right-0 h-3 bg-emerald-100 rounded-full -z-0"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left" }}
              />
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Diese Themen sind echte Lead-Magneten — viele Landwirte wissen gar nicht, 
            dass es dafür Geld gibt. Von Hagelschutz über Verkaufsautomaten bis zur Pferdezucht.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6"
        >
          {HIDDEN_CHANCES.map((chance) => {
            const Icon = chance.icon
            const isExpanded = expandedId === chance.id

            return (
              <motion.article
                key={chance.id}
                variants={itemVariants}
                className="group relative"
              >
                <div 
                  className={`
                    relative bg-white rounded-2xl border-2 overflow-hidden
                    transition-all duration-300 ease-out
                    ${isExpanded 
                      ? "border-emerald-300 shadow-xl shadow-emerald-900/10" 
                      : "border-slate-200 hover:border-slate-300 hover:shadow-lg shadow-sm"
                    }
                  `}
                >
                  {/* Card Header */}
                  <button
                    onClick={() => toggleExpand(chance.id)}
                    className="w-full text-left p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-t-2xl"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div 
                        className={`
                          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                          transition-all duration-300
                          ${isExpanded 
                            ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30" 
                            : "bg-slate-100 group-hover:bg-slate-200"
                          }
                        `}
                      >
                        <Icon 
                          className={`w-6 h-6 transition-colors duration-300 ${isExpanded ? "text-white" : "text-slate-600"}`} 
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
                            {chance.title}
                          </h3>
                          <span 
                            className={`
                              text-xs font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0
                              ${chance.badgeColor}
                            `}
                          >
                            {chance.badge}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                          {chance.subtitle}
                        </p>
                      </div>

                      {/* Chevron */}
                      <ChevronRight 
                        className={`
                          w-5 h-5 text-slate-400 flex-shrink-0 mt-1
                          transition-transform duration-300
                          ${isExpanded ? "rotate-90 text-emerald-600" : "group-hover:translate-x-0.5"}
                        `}
                      />
                    </div>
                  </button>

                  {/* Expandable Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        variants={expandVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-0">
                          {/* Divider */}
                          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-5" />

                          {/* Description */}
                          <p className="text-sm text-slate-600 leading-relaxed mb-5">
                            {chance.description}
                          </p>

                          {/* Items */}
                          <div className="space-y-2.5 mb-5">
                            {chance.items.map((item, idx) => (
                              <motion.div
                                key={item}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.3 }}
                                className="flex items-start gap-3"
                              >
                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                                </div>
                                <span className="text-sm text-slate-700 leading-snug">
                                  {item}
                                </span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Tip or Warning */}
                          {chance.tip && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                              <div className="flex items-start gap-2.5">
                                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                                  <span className="font-bold">Pro-Tipp:</span> {chance.tip}
                                </p>
                              </div>
                            </div>
                          )}

                          {chance.warning && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mt-3">
                              <p className="text-xs text-amber-800 leading-relaxed">
                                <span className="font-bold">Achtung:</span> {chance.warning}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 sm:mt-16 lg:mt-20 text-center"
        >
          <div 
            className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-xl shadow-slate-200/50"
          >
            <div className="text-center sm:text-left">
              <p className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                Passt dein Vorhaben in eine dieser Nischen?
              </p>
              <p className="text-sm text-slate-500">
                Wir prüfen kostenlos, ob du für versteckte Fördertöpfe qualifiziert bist.
              </p>
            </div>
            <button
              onClick={() => document.getElementById("rechner")?.scrollIntoView({ behavior: "smooth" })}
              className="
                relative inline-flex items-center gap-2 px-6 py-3.5 
                bg-gradient-to-r from-emerald-600 to-teal-600 
                hover:from-emerald-500 hover:to-teal-500
                text-white font-bold rounded-xl text-sm 
                transition-all duration-300 
                shadow-lg shadow-emerald-900/25 hover:shadow-xl hover:shadow-emerald-900/30
                hover:-translate-y-0.5
                overflow-hidden group
              "
            >
              {/* Shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-2">
                Förderpotenzial prüfen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
