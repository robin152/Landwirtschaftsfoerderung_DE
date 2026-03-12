"use client"

import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion"
import { useRef, useEffect } from "react"
import { TractorIcon, WheatIcon, FieldRowsIcon } from "@/components/agri-icons"

// Animated counter hook
function useCounter(to: number, inView: boolean, decimals = 0) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!inView || !nodeRef.current) return
    const node = nodeRef.current
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        node.textContent = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("de-DE")
      },
    })
    return () => controls.stop()
  }, [to, inView, decimals])
  return nodeRef
}

const STATS = [
  {
    prefix: "+",
    value: 47,
    suffix: " %",
    label: "Baukosten seit 2020",
    detail: "Ein Milchvieh-Stall für 120 Kühe kostet heute 1,8–2,5 Mio. €. Vor vier Jahren war es die Hälfte. Stahl, Beton, Handwerker — alles explodiert.",
    color: "#dc2626",
    border: "#dc262622",
  },
  {
    prefix: "",
    value: 340,
    suffix: "+",
    label: "Seiten Förder-Richtlinien",
    detail: "Jedes Bundesland, eigene Formulare, eigene Fristen. Ein Fehler im Kostenplan, eine falsche Unterschrift — der Bescheid landet im Papierkorb.",
    color: "#d97706",
    border: "#d9770622",
  },
  {
    prefix: "",
    value: 22,
    suffix: " Monate",
    label: "max. Bearbeitungszeit",
    detail: "Bis der Bescheid kommt, hat sich die Welt dreimal gedreht. Der Betrieb läuft weiter. Der Druck bleibt.",
    color: "#2563eb",
    border: "#2563eb22",
  },
  {
    prefix: "Ø ",
    value: 280000,
    suffix: " €",
    label: "entgangene Förderung pro Betrieb",
    detail: "70 % aller förderfähigen Betriebe stellen keinen Antrag — weil sie nicht wissen, dass sie berechtigt sind.",
    color: "#16a34a",
    border: "#16a34a22",
  },
]

function StatBlock({ stat, index }: { stat: (typeof STATS)[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const counterRef = useCounter(stat.value, inView)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col gap-2 p-4 sm:p-5 bg-white rounded-xl overflow-hidden"
      style={{
        border: `1px solid ${stat.border}`,
        borderLeft: `3px solid ${stat.color}`,
      }}
    >
      {/* Stat number + Label inline */}
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-0 leading-none" style={{ color: stat.color }}>
          <span className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {stat.prefix}
            <span ref={counterRef}>0</span>
            {stat.suffix}
          </span>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-right" style={{ color: `${stat.color}99` }}>
          {stat.label}
        </p>
      </div>

      {/* Detail text — more compact */}
      <p className="text-xs text-slate-600 leading-relaxed">{stat.detail}</p>
    </motion.div>
  )
}

export function ProblemSection() {
  const headlineRef = useRef(null)
  const headlineInView = useInView(headlineRef, { once: true, margin: "-40px" })
  const bridgeRef = useRef(null)
  const bridgeInView = useInView(bridgeRef, { once: true, margin: "-60px" })

  return (
    <>
      <section
        className="relative py-12 sm:py-16 overflow-hidden"
        style={{ background: "#f5f2eb" }}
      >
        {/* Warm grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.035,
            backgroundImage:
              "linear-gradient(to right, #3a5c2f 1px, transparent 1px), linear-gradient(to bottom, #3a5c2f 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Field-rows watermark */}
        <div className="absolute top-6 right-6 opacity-[0.05] pointer-events-none hidden lg:block">
          <FieldRowsIcon className="w-56 h-56 text-[#3a5c2f]" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

          {/* === HEADLINE — editorial, not SaaS === */}
          <motion.div
            ref={headlineRef}
            className="mb-8 sm:mb-10 max-w-4xl"
          >
            {/* Eyebrow line */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={headlineInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.45 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-px bg-red-500" />
              <TractorIcon className="w-4 h-4 text-red-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-red-500">
                Die Realität auf deutschen Höfen
              </span>
            </motion.div>

            {/* Main headline — two lines, refined */}
            <div className="overflow-hidden mb-2">
              <motion.h2
                initial={{ y: "100%" }}
                animate={headlineInView ? { y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1f0e] leading-[1.1] tracking-tight"
              >
                Sie investieren alles.
              </motion.h2>
            </div>
            <div className="overflow-hidden mb-6">
              <motion.h2
                initial={{ y: "100%" }}
                animate={headlineInView ? { y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.13, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#6b7059] leading-[1.1] tracking-tight"
              >
                Und kämpfst trotzdem.
              </motion.h2>
            </div>

            {/* Sub — left-aligned, clear */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={headlineInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-base sm:text-lg text-[#4a4a3a] leading-relaxed max-w-2xl"
            >
              Steigende Kosten, volle Schreibtische, leere Antworten vom Amt —
              wir hören diese vier Geschichten jeden Tag.
            </motion.p>
          </motion.div>

          {/* === 4-STAT GRID === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 sm:mb-14">
            {STATS.map((s, i) => (
              <StatBlock key={i} stat={s} index={i} />
            ))}
          </div>

          {/* === PULL QUOTE — editorial stripe === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 px-6 sm:px-8 py-6 rounded-2xl overflow-hidden"
            style={{ background: "#1a1f0e" }}
          >
            {/* Gold left line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
              style={{ background: "linear-gradient(to bottom, #b8860b, #d4a017)" }}
            />
            <WheatIcon className="w-8 h-8 flex-shrink-0 ml-2" style={{ color: "#d4a017" }} />
            <div>
              <blockquote className="text-base sm:text-lg font-semibold text-white italic leading-relaxed text-balance">
                "Ich wusste nicht mal, dass ich Anspruch hatte. Vier Jahre lang hab ich das Geld liegen lassen."
              </blockquote>
              <p className="mt-2 text-xs font-medium" style={{ color: "#d4a017" }}>
                — Milchviehhalter, Bayern, 2024
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* === BRIDGE === */}
      <div
        ref={bridgeRef}
        className="relative border-t py-14 sm:py-20 overflow-hidden"
        style={{ background: "#fff", borderColor: "#e2ddd3" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={bridgeInView ? { scaleY: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="w-px h-12 mx-auto mb-8 origin-top"
            style={{ background: "linear-gradient(to bottom, #e2ddd3, #3a5c2f)" }}
          />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={bridgeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.28 }}
            className="text-[11px] font-black uppercase tracking-[0.22em] mb-5"
            style={{ color: "#3a5c2f" }}
          >
            Die gute Nachricht
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={bridgeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.4 }}
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1a1f0e] leading-snug text-balance"
          >
            Für all das gibt es staatliche Förderung —{" "}
            <span style={{ color: "#3a5c2f" }}>und wir holen sie für Sie.</span>
          </motion.h2>
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={bridgeInView ? { scaleY: 1, opacity: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.68 }}
            className="w-px h-10 mx-auto mt-8 origin-top"
            style={{ background: "linear-gradient(to bottom, #3a5c2f, #e2ddd3)" }}
          />
        </div>
      </div>
    </>
  )
}
