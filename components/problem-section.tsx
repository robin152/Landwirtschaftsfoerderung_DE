"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { TrendingUp, FileText, Clock, Euro } from "lucide-react"
import { TractorIcon, WheatIcon, FieldRowsIcon } from "@/components/agri-icons"

const problems = [
  {
    icon: TrendingUp,
    stat: "+47 %",
    statLabel: "Baukosten seit 2020",
    title: "Der neue Stall frisst den Gewinn von 10 Jahren.",
    body: "Ein moderner Milchvieh-Stall für 120 Kühe kostet heute 1,8 bis 2,5 Mio. Euro. Vor vier Jahren war es noch die Hälfte. Stahl, Beton, Handwerker — alles explodiert. Gleichzeitig drücken Milchpreise, Energiekosten und neue Haltungsauflagen auf die Marge.",
    accent: "border-l-red-500",
    statColor: "text-red-600",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    icon: FileText,
    stat: "340+",
    statLabel: "Seiten Förder-Richtlinien",
    title: "Du führst einen Betrieb. Nicht ein Amt.",
    body: "Jedes Bundesland hat eigene Formulare, eigene Fristen, eigene Anforderungen. Manche Anträge laufen über 4 verschiedene Behörden. Ein Fehler im Kostenplan, eine fehlende Unterschrift, ein falscher Maßnahmencode — und der Bescheid landet im Papierkorb. Ohne Begründung.",
    accent: "border-l-amber-500",
    statColor: "text-amber-600",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: Clock,
    stat: "14–22",
    statLabel: "Monate Bearbeitungszeit",
    title: "Bis der Bescheid kommt, hat sich die Welt dreimal gedreht.",
    body: "Du hast die Idee, die Fläche, den Plan. Aber dann: Warten. Nachfragen. Wieder warten. Manche Landwirte warten über eineinhalb Jahre auf ihren Bescheid — und erfahren dann, dass ein formaler Fehler alles zunichte macht. Der Betrieb läuft weiter, der Druck bleibt.",
    accent: "border-l-blue-500",
    statColor: "text-blue-600",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Euro,
    stat: "Ø 280.000 €",
    statLabel: "entgangene Förderung pro Betrieb",
    title: "Das Geld liegt auf dem Tisch. Niemand sagt dir, dass du es nehmen kannst.",
    body: "70 % aller förderfähigen Betriebe stellen keinen Antrag — weil sie nicht wissen, dass sie berechtigt sind. Oder weil der letzte Versuch scheiterte. Oder weil kein Berater in der Nähe ist, der das Thema wirklich kennt.",
    accent: "border-l-emerald-600",
    statColor: "text-emerald-700",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
]

function ProblemCard({ problem, index }: { problem: (typeof problems)[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const Icon = problem.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative bg-white rounded-2xl border border-[#e2ddd3] border-l-4 ${problem.accent} shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden`}
    >
      <div className="p-6 sm:p-8">
        {/* Stat + icon row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className={`text-3xl sm:text-4xl font-black ${problem.statColor} leading-none tracking-tight`}>
              {problem.stat}
            </div>
            <div className="text-xs text-[#6b7059] font-semibold mt-1 uppercase tracking-wider">
              {problem.statLabel}
            </div>
          </div>
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${problem.iconBg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${problem.iconColor}`} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#1a1f0e] leading-snug mb-3 text-balance">
          {problem.title}
        </h3>

        {/* Body — was text-slate-500, now dark enough for contrast */}
        <p className="text-sm sm:text-base text-[#3d3d2e] leading-relaxed">{problem.body}</p>
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
      {/* Problem Section — warm straw-field background, not cold slate */}
      <section className="relative py-20 sm:py-28 overflow-hidden" style={{ background: "#f5f2eb" }}>
        {/* Agri field-row texture — warm olive lines, not cold slate grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #3a5c2f 1px, transparent 1px), linear-gradient(to bottom, #3a5c2f 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        {/* Subtle WheatIcon watermark top-right */}
        <div className="absolute top-8 right-8 opacity-[0.06] pointer-events-none hidden lg:block">
          <FieldRowsIcon className="w-48 h-48 text-[#3a5c2f]" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Headline */}
          <motion.div
            ref={headlineRef}
            initial={{ opacity: 0, y: 24 }}
            animate={headlineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65 }}
            className="text-center mb-14 sm:mb-20"
          >
            {/* Eyebrow with TractorIcon */}
            <div className="inline-flex items-center gap-2 mb-5">
              <TractorIcon className="w-5 h-5 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                Die Realität auf deutschen Höfen
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1f0e] leading-[1.1] text-balance mb-5">
              Du investierst alles —{" "}
              <span className="text-[#6b7059]">und kämpfst trotzdem</span>
              <br className="hidden sm:block" /> gegen steigende Kosten, volle Schreibtische
              <br className="hidden sm:block" /> und leere Antworten vom Amt.
            </h2>
            <p className="text-base sm:text-lg text-[#4a4a3a] max-w-2xl mx-auto leading-relaxed">
              Wir sprechen täglich mit Landwirten. Immer wieder hören wir dieselben vier Geschichten.
            </p>
          </motion.div>

          {/* 2×2 Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
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
            {/* Agri gold divider */}
            <div className="flex items-center gap-3 mb-6 justify-center">
              <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to right, transparent, #b8860b66)" }} />
              <WheatIcon className="w-5 h-5 text-[#b8860b] opacity-70" />
              <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to left, transparent, #b8860b66)" }} />
            </div>
            <blockquote className="text-xl sm:text-2xl font-semibold text-[#2a2a1a] italic leading-relaxed text-balance">
              "Ich wusste nicht mal, dass ich Anspruch hatte. Vier Jahre lang hab ich das Geld liegen lassen."
            </blockquote>
            <p className="mt-4 text-sm text-[#6b7059] font-medium">— Milchviehhalter, Bayern, 2024</p>
          </motion.div>
        </div>
      </section>

      {/* Bridge to solution */}
      <div ref={bridgeRef} className="relative bg-white border-t border-[#e2ddd3] py-16 sm:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={bridgeInView ? { scaleY: 1, opacity: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="w-px h-12 mx-auto mb-8 origin-top"
            style={{ background: "linear-gradient(to bottom, #e2ddd3, #3a5c2f)" }}
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={bridgeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#3a5c2f] mb-5"
          >
            Die gute Nachricht
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={bridgeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.4 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a1f0e] leading-tight text-balance"
          >
            Für all das gibt es staatliche Förderung —
            <br />
            <span className="text-[#3a5c2f]">und wir holen sie für dich.</span>
          </motion.h2>
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={bridgeInView ? { scaleY: 1, opacity: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.65 }}
            className="w-px h-10 mx-auto mt-8 origin-top"
            style={{ background: "linear-gradient(to bottom, #3a5c2f, #e2ddd3)" }}
          />
        </div>
      </div>
    </>
  )
}

