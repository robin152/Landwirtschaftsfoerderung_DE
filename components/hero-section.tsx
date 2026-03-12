"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { TractorIcon, WheatIcon, MoneyBagIcon, BarnIcon, ShieldCheckAgriIcon, SunriseIcon } from "@/components/agri-icons"
import { Shield, Landmark, Moon, FileX2, Trophy } from "lucide-react"
import { LeadCaptureModal } from "@/components/lead-capture-modal"

// Count-up animation for "2,5 Millionen €"
// Default to final value to avoid SSR/hydration showing "0"
function AnimatedAmount() {
  const [display, setDisplay] = useState("2,5")
  const ref = useRef<HTMLSpanElement>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return

    // Use IntersectionObserver so animation fires when visible
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRun.current) {
          hasRun.current = true
          observer.disconnect()

          const target = 2.5
          const duration = 1800
          const steps = 60
          const intervalMs = duration / steps
          let step = 0

          const timer = setInterval(() => {
            step++
            const eased = 1 - Math.pow(1 - step / steps, 3)
            const value = eased * target
            setDisplay(
              value >= 2.45
                ? "2,5"
                : value.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 1 })
            )
            if (step >= steps) {
              clearInterval(timer)
              setDisplay("2,5")
            }
          }, intervalMs)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <span
      ref={ref}
      style={{
        background: "linear-gradient(135deg, #16a34a 0%, #15803d 40%, #22c55e 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(0 0 10px rgba(22,163,74,0.30))",
      }}
    >
      {display} Mio.&thinsp;€
    </span>
  )
}

export function HeroSection() {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      {/* Hero Main */}
      <section className="relative flex items-center justify-center px-4 pt-28 pb-8 md:min-h-[90svh] md:pt-32 md:pb-10 overflow-hidden bg-white">
        {/* Subtle background orbs — very light, non-green */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-100/40 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-slate-50/80 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

        {/* Subtle wheat pattern background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <WheatIcon
              key={i}
              className="absolute text-green-900"
              style={{
                width: 120,
                height: 120,
                top: `${10 + i * 15}%`,
                left: `${i % 2 === 0 ? 2 + i * 3 : 88 - i * 3}%`,
                transform: `rotate(${i * 12 - 20}deg)`,
              }}
            />
          ))}
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Row 1: Full-width headline — glass card */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4 md:mb-6"
          >
            <h1
              className="text-2xl sm:text-3xl md:text-[2.25rem] lg:text-[2.75rem] xl:text-[3rem] font-bold leading-[1.15] text-balance mb-2 md:mb-3"
              style={{
                background: "linear-gradient(135deg, #166534 0%, #15803d 30%, #7c3aed 65%, #6d28d9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Sichern Sie sich bis zu{" "}
              <AnimatedAmount />{" "}
              Fördermittel für Ihren Hof – ohne einen Finger für den Papierkram zu rühren.
            </h1>

            <p className="text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed max-w-5xl mx-auto">
              Wir holen für Sie das absolute Maximum an staatlichen Zuschüssen heraus (bis zu{" "}
              <span className="font-semibold text-green-700">50 % Ihrer Investition</span>
              ), während Sie sich voll auf Ihren Betrieb konzentrieren. Wir übernehmen die komplette Abwicklung vom ersten Antrag bis zur finalen Auszahlung auf Ihr Konto.{" "}
              <span className="font-semibold text-slate-800">Kein Risiko, kein Behörden-Stress</span> – wir liefern den Bescheid, Sie bauen die Zukunft.
            </p>
          </motion.div>

          {/* Row 2: Two-column grid — constrained width, centred */}
          <div className="max-w-6xl mx-auto w-full grid md:grid-cols-[auto_1fr] gap-4 md:gap-8 lg:gap-10 mb-5 md:mb-6 items-start">

            {/* Left: Image — fixed size, no crop */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative flex items-start justify-center md:w-[300px] lg:w-[340px] xl:w-[380px] flex-shrink-0"
            >
              <div className="relative w-full">
                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-400/25 to-green-600/15 blur-2xl scale-105" />
                <img
                  src="/hero-foerderung.webp"
                  alt="Bis zu 50 % staatliche Förderung für die Landwirtschaft – Stallbau, Tierwohl, Umwelttechnik"
                  className="relative rounded-xl md:rounded-2xl shadow-xl w-full max-h-48 md:max-h-none object-contain ring-1 ring-white/20"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-3 right-3 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-1.5 ring-1 ring-emerald-100"
                >
                  <MoneyBagIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide leading-none mb-0.5">Zuschuss</p>
                    <p className="text-sm font-extrabold text-emerald-700 leading-none">bis 50 %</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: 4 Nutzenbotschaften — Warum Sie mit uns gewinnen */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-2.5"
            >
              {/* Header */}
              <div className="mb-1">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#7c3aed" }}>Warum Sie mit uns gewinnen</p>
              </div>

              {[
                {
                  icon: Shield,
                  text: "Sichern Sie Ihr Lebenswerk für Ihre Kinder.",
                  accent: "#16a34a",
                  bg: "rgba(22,163,74,0.06)",
                  border: "rgba(22,163,74,0.15)",
                },
                {
                  icon: Landmark,
                  text: "Machen Sie sich endlich unabhängig von Banken.",
                  accent: "#7c3aed",
                  bg: "rgba(124,58,237,0.05)",
                  border: "rgba(124,58,237,0.15)",
                },
                {
                  icon: Moon,
                  text: "Schlafen Sie ruhig durch garantierte Rechtssicherheit.",
                  accent: "#16a34a",
                  bg: "rgba(22,163,74,0.06)",
                  border: "rgba(22,163,74,0.15)",
                },
                {
                  icon: FileX2,
                  text: "Seien Sie wieder Landwirt statt geplagter Aktenfresser.",
                  accent: "#7c3aed",
                  bg: "rgba(124,58,237,0.05)",
                  border: "rgba(124,58,237,0.15)",
                },
                {
                  icon: Trophy,
                  text: "Sichern Sie sich staatlich finanzierten Wettbewerbsvorsprung.",
                  accent: "#16a34a",
                  bg: "rgba(22,163,74,0.06)",
                  border: "rgba(22,163,74,0.15)",
                },
              ].map(({ icon: Icon, text, accent, bg, border }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.3 + i * 0.06 }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 cursor-default hover:shadow-sm"
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="font-semibold text-slate-800 text-sm leading-snug">{text}</p>
                </motion.div>
              ))}

              {/* Social proof strip */}
              <div className="flex items-center gap-4 mt-1 pt-2.5 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-700">400+ Landwirte gefördert</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#7c3aed", animationDelay: "0.5s" }} />
                  <span className="text-xs font-semibold text-slate-700">98 % Erfolgsquote</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" style={{ animationDelay: "1s" }} />
                  <span className="text-xs font-semibold text-slate-700">alle 16 Bundesländer</span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Row 3: Full-width CTA — liquid glass buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            {/* Primary CTA — liquid green glass */}
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="relative w-full sm:w-auto overflow-hidden rounded-xl h-12 sm:h-14 px-6 sm:px-10 font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, rgba(22,163,74,0.92) 0%, rgba(21,128,61,0.88) 50%, rgba(20,83,45,0.85) 100%)",
                backdropFilter: "blur(12px) saturate(1.8)",
                WebkitBackdropFilter: "blur(12px) saturate(1.8)",
                border: "1px solid rgba(255,255,255,0.35)",
                boxShadow: "0 8px 32px rgba(22,163,74,0.35), 0 1px 0 rgba(255,255,255,0.45) inset, 0 -1px 0 rgba(0,0,0,0.15) inset",
                color: "white",
              }}
              onClick={() => document.getElementById("rechner")?.scrollIntoView({ behavior: "smooth" })}
            >
              {/* Shine streak */}
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-xl pointer-events-none" />
              <TractorIcon className="w-5 h-5 text-white relative z-10" />
              <span className="relative z-10">Förderung kostenlos berechnen</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
            </motion.button>

            {/* Secondary CTA — liquid white glass */}
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="relative w-full sm:w-auto overflow-hidden rounded-xl h-12 sm:h-14 px-6 sm:px-10 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(240,253,244,0.65) 50%, rgba(255,255,255,0.70) 100%)",
                backdropFilter: "blur(16px) saturate(1.6)",
                WebkitBackdropFilter: "blur(16px) saturate(1.6)",
                border: "1px solid rgba(134,239,172,0.5)",
                boxShadow: "0 8px 32px rgba(16,120,56,0.10), 0 1px 0 rgba(255,255,255,0.95) inset, 0 -1px 0 rgba(134,239,172,0.2) inset",
                color: "#166534",
              }}
              onClick={() => setShowModal(true)}
            >
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-xl pointer-events-none" />
              <WheatIcon className="w-5 h-5 relative z-10" style={{ color: "#16a34a" }} />
              <span className="relative z-10">Persönliche Beratung</span>
            </motion.button>

            <p className="text-xs text-slate-400 sm:ml-2 text-center sm:text-left flex-shrink-0">
              100 % kostenlos &amp; unverbindlich
            </p>
          </motion.div>

        </div>
      </section>

      {/* Lead Modal */}
      {showModal && (
        <LeadCaptureModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          source="hero-beratung"
        />
      )}
    </>
  )
}
