"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { 
  Sprout,
  Hammer,
  CircleDollarSign,
  ShoppingBasket,
  Check,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Building2,
  Leaf,
  ShoppingBag,
  Sun,
  Droplets,
  Cpu,
  Tractor,
  CloudRain,
  Factory,
  Wheat,
  Users,
  Coffee,
  TreePine,
  Zap,
  PiggyBank,
  ArrowRight
} from "lucide-react"

interface LifecyclePhase {
  id: string
  icon: typeof Sprout
  title: string
  subtitle: string
  color: string
  bgColor: string
  borderColor: string
  iconBg: string
  pillars: {
    name: string
    icon: typeof GraduationCap
    items: string[]
  }[]
}

const LIFECYCLE_PHASES: LifecyclePhase[] = [
  {
    id: "start",
    icon: Sprout,
    title: "Ich starte durch",
    subtitle: "Niederlassung, Beratung & Wissen",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    pillars: [
      {
        name: "Junglandwirte-Prämie",
        icon: GraduationCap,
        items: [
          "Niederlassungsbeihilfe bis 70.000 Euro Einmalzahlung",
          "Jährlicher Zuschlag auf die Basisprämie pro Hektar",
          "Bonus für Gründer unter 40 Jahren (max. 5 Jahre)",
          "+10 % Aufschlag auf alle Investitionsförderungen"
        ]
      },
      {
        name: "Beratungsförderung",
        icon: Users,
        items: [
          "Strategieberatung: 80 % Zuschuss zur Neuausrichtung",
          "Antragsbegleitung: 60 % Zuschuss für Fachplanung",
          "Übergabeberatung: Mediation und Hofnachfolge-Konzepte",
          "Zuschüsse zu Meisterkursen und Fortbildungen"
        ]
      }
    ]
  },
  {
    id: "build",
    icon: Hammer,
    title: "Ich baue um oder neu",
    subtitle: "Investitionen in Gebäude, Technik & Umwelt",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
    pillars: [
      {
        name: "Stallbau & Tierwohl",
        icon: Building2,
        items: [
          "Neubau, Umbau oder Erweiterung von Ställen",
          "Besonders tiergerechte Haltung (20 % mehr Platz, Tageslicht)",
          "Auslauf, Weidezugang, Außenklimabereich",
          "Fördersätze: 20 % bis 40 %, in manchen Ländern bis 65 %"
        ]
      },
      {
        name: "Klima- & Emissionsschutz",
        icon: Leaf,
        items: [
          "Güllelagerung mit gasdichter Abdeckung",
          "Abluftreinigungsanlagen und Güllekühlung",
          "Emissionsarme Stallböden und Ausbringtechnik",
          "Mechanische Unkrautbekämpfung und Direktsaat"
        ]
      },
      {
        name: "Energieeffizienz",
        icon: Zap,
        items: [
          "Hocheffiziente Elektromotoren und Ventilatoren",
          "Vorkühler für Milch mit Wärmerückgewinnung",
          "LED-Beleuchtungssysteme für Ställe und Hallen",
          "Isolierung von Kühlräumen und Stallgebäuden"
        ]
      },
      {
        name: "Lagerung & Aufbereitung",
        icon: Factory,
        items: [
          "Klimatisierte Lagerhallen für Obst, Gemüse, Kartoffeln",
          "Grobfutterlagerung bei Tierwohl-Umstellung",
          "Getreidetrocknung (energieeffizient)",
          "Kontrollierte Atmosphäre für längere Haltbarkeit"
        ]
      }
    ]
  },
  {
    id: "optimize",
    icon: CircleDollarSign,
    title: "Ich optimiere den Cashflow",
    subtitle: "Flächenprämien, Umweltprogramme & Ökolandbau",
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    iconBg: "bg-gradient-to-br from-sky-500 to-blue-600",
    pillars: [
      {
        name: "Ökologischer Landbau",
        icon: Leaf,
        items: [
          "Einführungsprämie in der Umstellungsphase (sehr hoch)",
          "Beibehaltungsprämie für dauerhafte Öko-Bewirtschaftung",
          "Zusätzlicher Aufschlag auf Investitionsförderungen",
          "Jährliche Zahlungen pro Hektar"
        ]
      },
      {
        name: "Ackerbauliche Vielfalt",
        icon: Wheat,
        items: [
          "Anbau von mindestens 5 verschiedenen Kulturen",
          "Leguminosen-Anbau: Erbsen, Bohnen, Luzerne",
          "Blühflächen und Uferrandstreifen",
          "Artenschonendes Mähen und Extensivierung"
        ]
      },
      {
        name: "Dauergrünland & Weide",
        icon: Sun,
        items: [
          "Erhalt von Dauergrünland in sensiblen Gebieten",
          "Weidegang-Prämien für Sommerweidehaltung",
          "Verzicht auf Pflanzenschutzmittel (Teilflächen)",
          "Verzicht auf mineralischen Dünger"
        ]
      },
      {
        name: "Präzision & Schutz",
        icon: CloudRain,
        items: [
          "Hagelschutznetze und Frostschutzberegnung",
          "Tröpfchenbewässerung mit 15 % Wassereinsparung",
          "GPS-gestützte Präzisionstechnik",
          "Bodenfeuchte-Sensorik und Smart Farming"
        ]
      }
    ]
  },
  {
    id: "diversify",
    icon: ShoppingBasket,
    title: "Ich schaffe ein zweites Standbein",
    subtitle: "Direktvermarktung, Tourismus & Soziales",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
    pillars: [
      {
        name: "Verarbeitung & Vermarktung",
        icon: ShoppingBag,
        items: [
          "Hofkäserei, Fleischzerlegung, eigene Molkerei",
          "Hofläden für landwirtschaftliche Erzeugnisse",
          "Verkaufsautomaten: Milchtankstellen, Regiomaten",
          "Mobile Schlachtung und Verarbeitung"
        ]
      },
      {
        name: "Tourismus & Gastronomie",
        icon: Coffee,
        items: [
          "Urlaub auf dem Bauernhof (Ferienwohnungen)",
          "Hofcafés und Erlebnisgastronomie",
          "Erlebnisangebote für Besucher",
          "Eventflächen und Hofführungen"
        ]
      },
      {
        name: "Soziale Landwirtschaft",
        icon: Users,
        items: [
          "Bauernhofkindergärten auf dem Hof",
          "Senioren-Tagespflege in ländlicher Umgebung",
          "Therapeutische Angebote mit Tieren",
          "Inklusive Arbeitsplätze auf dem Hof"
        ]
      },
      {
        name: "Forstwirtschaft",
        icon: TreePine,
        items: [
          "Wiederaufforstung nach Borkenkäfer oder Sturm",
          "Waldumbau zu klimaresilienten Mischwäldern",
          "Holzvermarktung und Brennholzverkauf",
          "Agroforstsysteme als Kombination"
        ]
      }
    ]
  }
]

export function FarmLifecycleSection() {
  const [activePhase, setActivePhase] = useState<string>("build")
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const active = LIFECYCLE_PHASES.find(p => p.id === activePhase)!

  return (
    <section 
      ref={sectionRef}
      id="lebensphasen" 
      className="py-20 sm:py-28 bg-white relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold mb-5 shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Dein Partner auf dem ganzen Weg
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight text-balance leading-tight">
            Förderung für jede{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Lebensphase
              </span>
              <motion.span 
                className="absolute -bottom-1 left-0 right-0 h-3 bg-emerald-100 rounded-full -z-0"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left" }}
              />
            </span>
            {" "}deines Hofes
          </h2>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Landwirte denken in Generationen — wir auch. Egal wo du heute stehst: 
            Wir begleiten dich über die nächsten 10 Jahre mit passenden Förderprogrammen.
          </p>
        </motion.div>

        {/* Phase Selector Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14"
        >
          {LIFECYCLE_PHASES.map((phase, idx) => {
            const Icon = phase.icon
            const isActive = activePhase === phase.id
            return (
              <motion.button
                key={phase.id}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + idx * 0.08 }}
                onClick={() => setActivePhase(phase.id)}
                className={`
                  relative flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl 
                  font-semibold text-sm transition-all duration-300
                  ${isActive 
                    ? `${phase.bgColor} ${phase.color} ${phase.borderColor} border-2 shadow-lg` 
                    : "bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100 hover:text-slate-900"
                  }
                `}
              >
                <span className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                  ${isActive ? phase.iconBg : "bg-slate-200"}
                `}>
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                </span>
                <span className="hidden sm:inline">{phase.title}</span>
                <span className="sm:hidden text-xs">{phase.title.split(" ").slice(1).join(" ")}</span>
                
                {/* Active indicator dot */}
                {isActive && (
                  <motion.span 
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-current"
                  />
                )}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Active Phase Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Phase Header Card */}
            <div className={`
              rounded-2xl ${active.bgColor} border ${active.borderColor} p-6 sm:p-8 mb-6
            `}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className={`
                  w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${active.iconBg} 
                  flex items-center justify-center shadow-lg flex-shrink-0
                `}>
                  <active.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl sm:text-2xl font-bold ${active.color} mb-1`}>
                    {active.title}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base">
                    {active.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-slate-200/50">
                  <PiggyBank className={`w-5 h-5 ${active.color}`} />
                  <span className="text-sm font-bold text-slate-900">
                    {active.id === "start" ? "bis 80 %" : active.id === "build" ? "bis 65 %" : active.id === "optimize" ? "jährlich/ha" : "bis 40 %"} Zuschuss
                  </span>
                </div>
              </div>
            </div>

            {/* Pillars Grid */}
            <div className={`
              grid gap-4 sm:gap-5
              ${active.pillars.length === 2 ? "grid-cols-1 sm:grid-cols-2" : ""}
              ${active.pillars.length === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : ""}
              ${active.pillars.length === 4 ? "grid-cols-1 sm:grid-cols-2" : ""}
            `}>
              {active.pillars.map((pillar, idx) => {
                const PillarIcon = pillar.icon
                return (
                  <motion.div
                    key={pillar.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`
                      bg-white rounded-2xl border border-slate-200 p-5 sm:p-6
                      hover:shadow-lg hover:border-slate-300 transition-all duration-300
                      hover:-translate-y-0.5
                    `}
                  >
                    {/* Pillar Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`
                        w-10 h-10 rounded-xl ${active.bgColor} border ${active.borderColor}
                        flex items-center justify-center
                      `}>
                        <PillarIcon className={`w-5 h-5 ${active.color}`} />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {pillar.name}
                      </h4>
                    </div>

                    {/* Pillar Items */}
                    <ul className="space-y-2.5">
                      {pillar.items.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 + i * 0.04 }}
                          className="flex items-start gap-2.5"
                        >
                          <span className={`
                            w-5 h-5 rounded-full ${active.bgColor} border ${active.borderColor}
                            flex items-center justify-center flex-shrink-0 mt-0.5
                          `}>
                            <Check className={`w-3 h-3 ${active.color}`} />
                          </span>
                          <span className="text-sm text-slate-600 leading-relaxed">
                            {item}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 sm:mt-16"
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
            
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Egal wo du stehst — wir begleiten dich
                </h3>
                <p className="text-slate-400 text-sm sm:text-base">
                  Finde in 45 Sekunden heraus, welche Förderung zu deiner aktuellen Situation passt.
                </p>
              </div>
              <button
                onClick={() => document.getElementById("rechner")?.scrollIntoView({ behavior: "smooth" })}
                className="
                  relative inline-flex items-center gap-2 px-6 py-4 
                  bg-gradient-to-r from-emerald-500 to-teal-500 
                  hover:from-emerald-400 hover:to-teal-400
                  text-white font-bold rounded-xl text-sm 
                  transition-all duration-300 
                  shadow-lg shadow-emerald-900/30 hover:shadow-xl hover:shadow-emerald-900/40
                  hover:-translate-y-0.5
                  overflow-hidden group
                  flex-shrink-0
                "
              >
                {/* Shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  Kostenlos Förderpotenzial prüfen
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
