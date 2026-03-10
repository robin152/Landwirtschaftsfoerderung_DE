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
      <section className="relative flex items-center justify-center px-4 pt-20 pb-8 md:min-h-[90svh] md:pt-24 md:pb-10 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
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

          {/* Row 1: Full-width headline */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4 md:mb-6"
          >
            <div className="inline-flex flex-wrap items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-3">
              <WheatIcon className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
              <span className="text-xs font-semibold text-green-800">
                AFP – <span className="font-normal text-green-700">Agrarinvestitionsförderungsprogramm</span> 2023–2027
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-slate-900 via-green-800 to-slate-700 bg-clip-text text-transparent leading-[1.15] text-balance mb-2 md:mb-3">
              Der Staat zahlt dir <span className="text-green-700">bis 50 %</span> für deinen nächsten Stall, Güllelager oder Klimaschutz
            </h1>
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

          {/* Row 3: Full-width CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="gap-2 bg-green-600 hover:bg-green-500 text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-10 w-full sm:w-auto rounded-xl font-bold shadow-lg shadow-green-900/25 hg-btn"
                onClick={() => document.getElementById("rechner")?.scrollIntoView({ behavior: "smooth" })}
              >
                <TractorIcon className="w-5 h-5 text-white" />
                Förderung kostenlos berechnen
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-10 w-full sm:w-auto rounded-xl border-green-300 text-green-800 hover:bg-green-50 font-semibold"
                onClick={() => setShowModal(true)}
              >
                <WheatIcon className="w-5 h-5 text-green-700" />
                Persönliche Beratung
              </Button>
            </motion.div>
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
