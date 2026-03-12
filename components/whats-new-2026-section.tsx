"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Sparkles, TrendingUp, MapPin, Leaf, Building2, Clock, ArrowRight, Check, Recycle, Calculator, Zap } from "lucide-react"
import { PersonalizedCallout } from "@/components/personalized-callout"

const newsItems = [
  {
    icon: TrendingUp,
    label: "Maximale Förderquote",
    oldValue: "45%",
    newValue: "65%",
    change: "+20%",
    description: "Bis zu 65% Förderung für Erneuerbare Energie und Umweltschutz (Kleinunternehmen)",
    benefit: "Ihr Vorteil: 100.000 EUR mehr Zuschuss pro 500.000 EUR Klima-Investment",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
  },
  {
    icon: MapPin,
    label: "D-Gebiet De-minimis",
    oldValue: "20%/10%",
    newValue: "50%/40%",
    change: "+30%",
    description: "D-Gebiete erhalten mit De-minimis-Aufschlag deutlich höhere Quoten",
    benefit: "Ihr Vorteil: Auch in nationalen Ergänzungsgebieten attraktive Förderung",
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Leaf,
    label: "4 Förderpfade",
    oldValue: "1 Pfad",
    newValue: "4 Pfade",
    change: "NEU",
    description: "Pfad A (Regional), B (Erneuerbare), C1 (Umwelt), C2 (Energieeffizienz)",
    benefit: "Ihr Vorteil: Optimale Förderung je nach Investitionsart wählbar",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Recycle,
    label: "Gebrauchte Güter",
    oldValue: "Ausgeschlossen",
    newValue: "Förderfähig",
    change: "NEU",
    description: "KMU können jetzt auch gebrauchte Maschinen und Anlagen fördern lassen",
    benefit: "Ihr Vorteil: Günstigere Anschaffung + Förderung = maximale Rendite",
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-50",
  },
  {
    icon: Calculator,
    label: "Investitionsobergrenzen",
    oldValue: "Niedrig",
    newValue: "Bis 100 Mio€",
    change: "ERHÖHT",
    description: "Umwelt/EE: 30 Mio€ Beihilfe, 46-100 Mio€ Invest. D-Gebiet KMU: 8,25 Mio€",
    benefit: "Konkret: Auch große Transformationsprojekte sind jetzt förderfähig",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50",
  },
  {
    icon: Zap,
    label: "Produktivitätspfad",
    oldValue: "Nur Jobs",
    newValue: "+10% Produktivität",
    change: "NEU",
    description: "Förderung ohne neue Arbeitsplätze möglich - nur Produktivitätssteigerung nötig",
    benefit: "Ihr Vorteil: Automatisierung und Digitalisierung jetzt förderfähig",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-50",
  },
]

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Use useEffect to properly handle the animation
  useState(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
      const duration = 1500
      const steps = 60
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  })

  // Simpler approach - just animate when in view
  if (isInView && displayValue === 0 && !hasAnimated) {
    setHasAnimated(true)
    let current = 0
    const increment = value / 60
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, 25)
  }

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  )
}

export function WhatsNew2026Section() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [activeCard, setActiveCard] = useState<number | null>(null)

  return (
    <section
      id="neu-2026"
      className="py-24 lg:py-32 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-conic from-teal-500/10 via-transparent to-purple-500/10 blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,23,42,0.8)_70%)]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative" ref={containerRef}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full border border-purple-500/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Revision 2026</span>
          </motion.div>

          {/* Info-Box: Was ist Regionalförderung */}
          <div className="mb-8 max-w-3xl mx-auto p-6 bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/40 rounded-2xl backdrop-blur-sm">
            <p className="text-lg text-purple-100 leading-relaxed">
              <span className="font-bold text-white">Was ist Regionalförderung?</span> Ein nicht rückzahlbarer Zuschuss vom Bund und den Ländern - echtes Geld, das Sie behalten.
              <span className="block mt-2 text-purple-200">Für das, was Sie eh gerade planen, aber noch nicht begonnen haben.</span>
            </p>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-6">
            Die wichtigsten Änderungen{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                der Richtlinie
              </span>
              <motion.span
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute bottom-2 left-0 h-3 bg-gradient-to-r from-purple-500/30 to-violet-500/30 -z-0"
              />
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto">
            auf einen Blick
          </p>
        </motion.div>

        {/* Main Stats Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16 lg:mb-24"
        >
          <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl border border-slate-700/50 p-8 lg:p-12 overflow-hidden backdrop-blur-sm">
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent blur-sm" />

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Before */}
              <div className="text-center lg:text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  Bisher (2023)
                </span>
                <div className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-600 line-through decoration-red-500/50 decoration-4">
                  25%
                </div>
                <span className="text-slate-500 text-sm">Maximale Basisförderung</span>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex items-center gap-4"
                >
                  <div className="hidden lg:block w-24 h-0.5 bg-gradient-to-r from-slate-700 to-purple-500" />
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-500"
                  >
                    <ArrowRight className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="hidden lg:block w-24 h-0.5 bg-gradient-to-r from-purple-500 to-slate-700" />
                </motion.div>
              </div>

              {/* After */}
              <div className="text-center lg:text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2 block">
                  Neu ab 2026
                </span>
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1, type: "spring", stiffness: 200 }}
                  className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
                >
                  <AnimatedCounter value={45} suffix="%" />
                </motion.div>
                <span className="text-purple-400/80 text-sm">Maximale Gesamtförderung</span>
              </div>
            </div>

            {/* Bonus breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-8 pt-8 border-t border-slate-700/50"
            >
              <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-6 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full">
                  <span className="text-slate-400 text-sm">Basis:</span>
                  <span className="font-bold text-white">30%</span>
                </div>
                <span className="text-slate-600">+</span>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/30">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-400 text-sm">C-Gebiet:</span>
                  <span className="font-bold text-blue-400">+10%</span>
                </div>
                <span className="text-slate-600">+</span>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/30">
                  <Leaf className="w-4 h-4 text-green-400" />
                  <span className="text-slate-400 text-sm">Klima:</span>
                  <span className="font-bold text-green-400">+10%</span>
                </div>
                <span className="text-slate-600">=</span>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full border border-purple-500/50">
                  <span className="font-bold text-purple-400">45% Gesamt</span>
                </div>
              </div>
              
              {/* Explanations when bonuses apply */}
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-blue-300 text-sm">Wann gilt +10% C-Gebiet?</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ihr Investitionsstandort liegt in einem strukturschwachen Gebiet (z.B. Ruhrgebiet, Ostdeutschland). Im Erstgespräch prüfen wir Ihre PLZ kostenlos.
                  </p>
                </div>
                <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-4 h-4 text-green-400" />
                    <span className="font-semibold text-green-300 text-sm">Wann gilt +10% Klima?</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ihre Investition verbessert Energieeffizienz um 20%+ oder beinhaltet PV, Wärmepumpe, E-Mobilität, Kreislaufwirtschaft oder CO2-Reduktion.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* News Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              className="group relative"
            >
              <div
                className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 h-full transition-all duration-500 ${activeCard === index ? "border-purple-500/50 shadow-lg shadow-purple-500/10" : ""}`}
              >
                {/* Animated border glow */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 1 : 0 }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-transparent to-violet-500/10 -z-10"
                />

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} mb-4`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </motion.div>

                {/* Change Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1, type: "spring" }}
                  className="absolute top-4 right-4"
                >
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      item.change === "NEU"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    }`}
                  >
                    {item.change === "NEU" ? <Sparkles className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    {item.change}
                  </span>
                </motion.div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2">{item.label}</h3>

                {/* Value comparison */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-slate-500 line-through text-sm">{item.oldValue}</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                  <span className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.newValue}
                  </span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-3">{item.description}</p>

                {/* User Benefit Highlight */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="p-3 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-lg border border-purple-500/20"
                >
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-purple-300 font-medium leading-relaxed">
                      {item.benefit}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Personalized Callout */}
        <div className="mt-12">
          <PersonalizedCallout variant="whats-new" />
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 mb-6">Profitieren Sie jetzt von den verbesserten Förderkonditionen</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300"
          >
            Meine Förderhöhe berechnen
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
