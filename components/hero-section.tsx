"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { TractorIcon, WheatIcon, MoneyBagIcon, BarnIcon, ShieldCheckAgriIcon } from "@/components/agri-icons"
import { LeadCaptureModal } from "@/components/lead-capture-modal"

export function HeroSection() {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      {/* Hero Main */}
      <section className="relative flex items-center justify-center px-4 pt-20 pb-8 md:min-h-[90svh] md:pt-24 md:pb-10 overflow-hidden" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 30%, #f8fafc 60%, #f0fdf4 100%)" }}>
        {/* Background light orbs for glass depth */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-green-400/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-teal-200/20 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

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

        <div className="page-container relative w-full">

          {/* Row 1: Full-width headline — glass card */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4 md:mb-6"
          >
            {/* Glass headline card */}
            <div className="relative inline-block w-full mb-3">
              {/* Glass panel behind headline */}
              <div className="relative rounded-2xl md:rounded-3xl px-4 py-5 md:px-8 md:py-7"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(240,253,244,0.55) 50%, rgba(255,255,255,0.62) 100%)",
                  backdropFilter: "blur(20px) saturate(1.6)",
                  WebkitBackdropFilter: "blur(20px) saturate(1.6)",
                  border: "1px solid rgba(255,255,255,0.75)",
                  boxShadow: "0 4px 32px rgba(16,120,56,0.08), 0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(255,255,255,0.3) inset",
                }}
              >
                {/* Glass shine streak */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-sm pointer-events-none" />

                <div className="inline-flex flex-wrap items-center gap-2 bg-green-600/10 border border-green-400/30 rounded-full px-3 py-1 mb-3 backdrop-blur-sm">
                  <WheatIcon className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
                  <span className="text-xs font-semibold text-green-800">
                    AFP – <span className="font-normal text-green-700">Agrarinvestitionsförderungsprogramm</span> 2023–2027
                  </span>
                </div>

                <h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] text-balance mb-2 md:mb-3"
                  style={{
                    background: "linear-gradient(135deg, #0f2e18 0%, #14532d 25%, #166534 50%, #15803d 70%, #1a3a22 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.12))",
                  }}
                >
                  Der Staat zahlt dir{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #16a34a 0%, #15803d 40%, #22c55e 70%, #16a34a 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 12px rgba(22,163,74,0.35))",
                    }}
                  >
                    bis 50&thinsp;%
                  </span>{" "}
                  für deinen nächsten Stall, Güllelager oder Klimaschutz
                </h1>
              </div>
            </div>

            <p className="text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Gib in 45 Sekunden dein Bundesland und dein Vorhaben ein — du siehst sofort, wie viel Geld du wirklich kriegst.
            </p>
          </motion.div>

          {/* Row 2: Two-column grid — image left, benefits right */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-5 md:mb-6 items-stretch">

            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative flex items-center justify-center"
            >
              {/* Mobile: simple image, no crop */}
              <div className="relative w-full">
                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-400/25 to-green-600/15 blur-2xl scale-105" />
                <img
                  src="/hero-foerderung.webp"
                  alt="Bis zu 50 % staatliche AFP-Förderung für Landwirte – Stallbau, Tierwohl, Umwelttechnik"
                  className="relative rounded-xl md:rounded-2xl shadow-xl w-full object-contain ring-1 ring-white/20"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-3 right-3 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-1.5 ring-1 ring-emerald-100"
                >
                  <MoneyBagIcon className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide leading-none mb-0.5">Zuschuss</p>
                    <p className="text-base font-extrabold text-emerald-700 leading-none">bis 50 %</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Benefits / Kaufargumente */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-3 justify-center"
            >
              {[
                {
                  icon: TractorIcon,
                  label: "In 45 Sek. weißt du es",
                  desc: "Unser Rechner gibt dir sofort deinen exakten Förderbetrag — kein Blabla, keine versteckten Kosten.",
                  accent: "bg-green-600",
                },
                {
                  icon: ShieldCheckAgriIcon,
                  label: "Ablehnungen werden verhindert",
                  desc: "Prosperitätsgrenze, vorzeitiger Maßnahmenbeginn, falsche Kostenart — ich checke das alles vorher.",
                  accent: "bg-emerald-600",
                },
                {
                  icon: MoneyBagIcon,
                  label: "Maximale Förderquote sichern",
                  desc: "Tierwohl-Premium, SIUK-Bonus, Junglandwirt-Zuschlag und regionale Boni — wir finden alles, was dir zusteht.",
                  accent: "bg-teal-600",
                },
                {
                  icon: BarnIcon,
                  label: "400+ Landwirte gefördert",
                  desc: "98 % Erfolgsquote. Bundesweite Erfahrung in allen 16 Bundesländern.",
                  accent: "bg-green-700",
                },
              ].map(({ icon: Icon, label, desc, accent }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
                  className="flex items-start gap-3 bg-white border border-slate-100 rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`${accent} rounded-lg w-9 h-9 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm leading-snug">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
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
