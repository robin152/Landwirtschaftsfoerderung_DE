"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { TractorIcon, WheatIcon, MoneyBagIcon, BarnIcon, ShieldCheckAgriIcon } from "@/components/agri-icons"
import { LeadCaptureModal } from "@/components/lead-capture-modal"

export function HeroSection() {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      {/* Hero Main */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-12 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
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

        <div className="container max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text & CTA */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              {/* Agri badge */}
              <div className="inline-flex flex-wrap items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-5">
                <WheatIcon className="w-4 h-4 text-green-700 flex-shrink-0" />
                <span className="text-sm font-semibold text-green-800">
                  AFP – <span className="font-normal text-green-700">Agrarinvestitionsförderungsprogramm</span> 2023–2027
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 bg-gradient-to-br from-slate-900 via-green-800 to-slate-700 bg-clip-text text-transparent leading-tight text-balance">
                Der Staat zahlt dir 20–50 % für deinen nächsten Stall, Güllelager oder Klimaschutz
              </h1>

              <p className="text-base md:text-lg text-slate-600 mb-7 leading-relaxed">
                Gib in 45 Sekunden dein Bundesland und dein Vorhaben ein. Du siehst sofort, wie viel Geld du wirklich kriegst. 2026 sind die Töpfe noch voll.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 mb-8">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700"><span className="font-semibold">400+</span> Landwirte gefördert</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-slate-700"><span className="font-semibold">45 Sek</span> Prüfung</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700"><span className="font-semibold">98 %</span> Erfolgsquote</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-5 justify-center lg:justify-start">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="relative overflow-hidden gap-2 bg-green-600 hover:bg-green-500 text-base h-14 px-8 w-full sm:w-auto rounded-xl font-bold shadow-lg shadow-green-900/25 hg-btn"
                    onClick={() => document.getElementById("rechner")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <TractorIcon className="w-5 h-5 text-white" />
                    Förderung kostenlos berechnen
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 text-base h-14 px-8 w-full sm:w-auto rounded-xl border-green-300 text-green-800 hover:bg-green-50 font-semibold"
                    onClick={() => setShowModal(true)}
                  >
                    <WheatIcon className="w-5 h-5 text-green-700" />
                    Persönliche Beratung
                  </Button>
                </motion.div>
              </div>

              <p className="text-sm text-slate-500 text-center lg:text-left">
                100 % kostenlos &amp; unverbindlich</p>
            </motion.div>

            {/* Right: Hero Image + floating badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative flex items-center justify-center mt-8 lg:mt-0"
            >
              <div className="relative w-full max-w-md mx-auto">
                {/* Hochglanz-Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/30 to-green-600/20 blur-3xl scale-110" />
                <img
                  src="/hero-foerderung.webp"
                  alt="Bis zu 50 % staatliche Förderung für Landwirte – Stallbau, Tierwohl, Umwelttechnik"
                  className="relative rounded-2xl shadow-2xl w-full object-cover ring-1 ring-white/20"
                />
                {/* Floating award badge — kein Netzwerk nötig */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-5 -right-4 sm:-top-6 sm:-right-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 ring-1 ring-emerald-100"
                >
                  <MoneyBagIcon className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide leading-none mb-0.5">Staatlicher Zuschuss</p>
                    <p className="text-xl font-extrabold text-emerald-700 leading-none">bis 50 %</p>
                  </div>
                </motion.div>
                {/* Bottom badge */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-5 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 ring-1 ring-green-100"
                >
                  <TractorIcon className="w-7 h-7 text-green-700 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide leading-none mb-0.5">Landwirte gefördert</p>
                    <p className="text-xl font-extrabold text-green-700 leading-none">400+</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-balance">
              Warum Landwirte mit uns mehr rausholen
            </h2>
            <p className="text-lg text-slate-600">
              Wir kennen das AFP in- und auswendig – und verhindern die Fehler, die 70 % der Anträge killen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                AgriIcon: TractorIcon,
                title: "In 45 Sek. weißt du es",
                description: "Unser Rechner gibt dir sofort deinen exakten Förderbetrag – kein Blabla, keine versteckten Kosten.",
                color: "from-green-600 to-emerald-600",
              },
              {
                AgriIcon: ShieldCheckAgriIcon,
                title: "Ich verhindere Ablehnungen",
                description: "Prosperitätsgrenze, vorzeitiger Maßnahmenbeginn, falsche Kostenart – ich checke das alles vorher. Punkt.",
                color: "from-teal-600 to-green-700",
              },
              {
                AgriIcon: MoneyBagIcon,
                title: "20–50 % statt gar nichts",
                description: "Tierwohl-Premium, SIUK-Bonus, Junglandwirt-Zuschlag, regionale Boni – wir finden alles, was dir zusteht.",
                color: "from-amber-600 to-green-600",
              },
            ].map((benefit, index) => {
              const { AgriIcon } = benefit
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-white border border-slate-100 hg-card hg-card-animated-border hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <AgriIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Lead Modal — sekundärer CTA "Persönliche Beratung" */}
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
