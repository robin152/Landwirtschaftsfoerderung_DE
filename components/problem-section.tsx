"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { TrendingUp, FileText, Clock, Euro } from "lucide-react"

const problems = [
  {
    icon: TrendingUp,
    stat: "+47 %",
    statLabel: "Baukosten seit 2020",
    title: "Der neue Stall frisst den Gewinn von 10 Jahren.",
    body: "Ein moderner Milchvieh-Stall für 120 Kühe kostet heute 1,8 bis 2,5 Mio. Euro. Vor vier Jahren war es noch die Hälfte. Stahl, Beton, Handwerker — alles explodiert. Gleichzeitig drücken Milchpreise, Energiekosten und neue Haltungsauflagen auf die Marge.",
    color: "from-red-500/20 to-transparent",
    borderColor: "border-red-500/30",
    statColor: "text-red-400",
  },
  {
    icon: FileText,
    stat: "340+",
    statLabel: "Seiten Förder-Richtlinien",
    title: "Du führst einen Betrieb. Nicht ein Amt.",
    body: "Jedes Bundesland hat eigene Formulare, eigene Fristen, eigene Anforderungen. Manche Anträge laufen über 4 verschiedene Behörden. Ein Fehler im Kostenplan, eine fehlende Unterschrift, ein falscher Maßnahmencode — und der Bescheid landet im Papierkorb. Ohne Begründung.",
    color: "from-amber-500/20 to-transparent",
    borderColor: "border-amber-500/30",
    statColor: "text-amber-400",
  },
  {
    icon: Clock,
    stat: "14–22",
    statLabel: "Monate Bearbeitungszeit",
    title: "Bis der Bescheid kommt, hat sich die Welt dreimal gedreht.",
    body: "Du hast die Idee, die Fläche, den Plan. Aber dann: Warten. Nachfragen. Wieder warten. Manche Landwirte warten über eineinhalb Jahre auf ihren Bescheid — und erfahren dann, dass ein formaler Fehler alles zunichte macht. Der Betrieb läuft weiter, der Druck bleibt.",
    color: "from-blue-500/20 to-transparent",
    borderColor: "border-blue-500/30",
    statColor: "text-blue-400",
  },
  {
    icon: Euro,
    stat: "Ø 280.000 €",
    statLabel: "entgangene Förderung pro Betrieb",
    title: "Das Geld liegt auf dem Tisch. Niemand sagt dir, dass du es nehmen kannst.",
    body: "70 % aller förderfähigen Betriebe stellen keinen Antrag — weil sie nicht wissen, dass sie berechtigt sind. Oder weil der letzte Versuch scheiterte. Oder weil kein Berater in der Nähe ist, der das Thema wirklich kennt.",
    color: "from-emerald-500/20 to-transparent",
    borderColor: "border-emerald-500/30",
    statColor: "text-emerald-400",
  },
]

function ProblemCard({ problem, index }: { problem: (typeof problems)[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const Icon = problem.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative rounded-2xl border ${problem.borderColor} bg-slate-900/80 backdrop-blur-sm overflow-hidden`}
    >
      <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${problem.color} pointer-events-none`} />
      <div className="relative p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Icon className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <div className={`text-3xl sm:text-4xl font-black ${problem.statColor} leading-none`}>
              {problem.stat}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5 uppercase tracking-wider">
              {problem.statLabel}
            </div>
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-3 text-balance">
          {problem.title}
        </h3>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{problem.body}</p>
      </div>
    </motion.div>
  )
}

export function ProblemSection() {
  const headlineRef = useRef(null)
  const headlineInView = useInView(headlineRef, { once: true, margin: "-60px" })
  const bridgeRef = useRef(null)
  const bridgeInView = useInView(bridgeRef, { once: true, margin: "-60px" })

  return (
    <>
      {/* Problem Section */}
      <section className="relative bg-slate-950 py-20 sm:py-28 overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-slate-800/20 blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Headline */}
          <motion.div
            ref={headlineRef}
            initial={{ opacity: 0, y: 30 }}
            animate={headlineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-14 sm:mb-20"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-red-400 mb-5">
              Die Realität auf deutschen Höfen
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] text-balance mb-5">
              Du investierst alles —
              <span className="text-slate-400"> und kämpfst trotzdem</span>
              <br className="hidden sm:block" /> gegen steigende Kosten, volle Schreibtische
              <br className="hidden sm:block" /> und leere Antworten vom Amt.
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Wir sprechen täglich mit Landwirten. Immer wieder hören wir dieselben vier Geschichten.
            </p>
          </motion.div>

          {/* 2×2 Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {problems.map((problem, i) => (
              <ProblemCard key={i} problem={problem} index={i} />
            ))}
          </div>

          {/* Pull quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 sm:mt-20 max-w-3xl mx-auto text-center"
          >
            <div className="w-8 h-px bg-slate-700 mx-auto mb-6" />
            <blockquote className="text-xl sm:text-2xl font-semibold text-slate-300 italic leading-relaxed text-balance">
              "Ich wusste nicht mal, dass ich Anspruch hatte. Vier Jahre lang hab ich das Geld liegen lassen."
            </blockquote>
            <p className="mt-4 text-sm text-slate-600">— Milchviehhalter, Bayern, 2024</p>
          </motion.div>
        </div>
      </section>

      {/* Bridge to solution */}
      <div ref={bridgeRef} className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-50 py-20 sm:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={bridgeInView ? { scaleY: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-px h-14 bg-gradient-to-b from-slate-700 to-emerald-500 mx-auto mb-8 origin-top"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={bridgeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500 mb-5"
          >
            Die gute Nachricht
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={bridgeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight text-balance"
          >
            Für all das gibt es staatliche Förderung —
            <br />
            <span className="text-emerald-400">und wir holen sie für dich.</span>
          </motion.h2>
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={bridgeInView ? { scaleY: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="w-px h-10 bg-gradient-to-b from-emerald-500 to-slate-300 mx-auto mt-8 origin-top"
          />
        </div>
      </div>
    </>
  )
}
