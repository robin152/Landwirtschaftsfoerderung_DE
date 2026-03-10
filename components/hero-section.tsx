import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Clock, TrendingUp, Play, Zap, Award, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <>
      {/* Hero Main */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text & CTA */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              {/* HORMOZI HEADLINE: Specific Outcome */}
              <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold mb-6 bg-gradient-to-br from-slate-900 via-green-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                Der Staat zahlt dir 20–50 % für deinen nächsten Stall, Güllelager oder Klimaschutz
              </h1>

              {/* SUBHEADLINE: Mechanism */}
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                Gib in 45 Sekunden dein Bundesland und dein Vorhaben ein. Du siehst sofort, wie viel Geld du wirklich kriegst – und ob du zu den Gewinnern oder Verlierern gehörst. 2026 sind die Töpfe noch voll. In 3–6 Monaten wahrscheinlich nicht mehr.
              </p>

              {/* SOCIAL PROOF: Why Now */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start lg:justify-start gap-4 mb-10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700"><span className="font-semibold">400+ Landwirte</span> haben schon kassiert</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700"><span className="font-semibold">45 Sek</span> Prüfung</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="text-slate-700"><span className="font-semibold">Erfolgsbasiert</span></span>
                </div>
              </div>

              {/* CTA SECTION */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center lg:justify-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="gap-2 bg-green-600 hover:bg-green-500 text-base h-12 px-8 w-full sm:w-auto"
                    onClick={() => document.getElementById("rechner")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    JETZT GRATIS BERECHNEN
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-2 text-base h-12 px-8 w-full sm:w-auto"
                  >
                    Persönliche Beratung
                  </Button>
                </motion.div>
              </div>

              {/* OBJECTION HANDLER */}
              <p className="text-sm text-slate-500">
                100 % kostenlos & unverbindlich  •  Ich bin der Typ, der die Ablehnungen verhindert
              </p>
            </motion.div>

            {/* Right: Video Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center">
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="relative w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all group"
                >
                  <Play className="w-8 h-8 text-white fill-white ml-1 group-hover:scale-110 transition-transform" />
                </button>
                <p className="absolute bottom-6 left-6 right-6 text-white text-sm font-medium">
                  Sehen Sie, wie einfach die Förderung funktioniert
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Warum Landwirte mit uns mehr rausholen
            </h2>
            <p className="text-lg text-slate-600">
              Wir kennen das AFP in- und auswendig – und verhindern die Fehler, die 70 % der Anträge killen
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "In 45 Sek. weißt du es",
                description: "Unser Rechner gibt dir sofort deinen exakten Förderbetrag – kein Blabla, keine versteckten Kosten."
              },
              {
                icon: Award,
                title: "Ich verhindere Ablehnungen",
                description: "Prosperitätsgrenze, vorzeitiger Maßnahmenbeginn, falsche Kostenart – ich checke das alles vorher. Punkt."
              },
              {
                icon: BarChart3,
                title: "20–50 % statt gar nichts",
                description: "Tierwohl-Premium, SIUK-Bonus, Junglandwirt-Zuschlag, regionale Boni – wir finden alles, was dir zusteht."
              }
            ].map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsVideoOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <span className="text-white text-2xl">×</span>
            </button>
            
            {/* Placeholder: Replace with your actual video */}
            <div className="relative bg-gradient-to-br from-purple-900 to-violet-900 aspect-video flex items-center justify-center">
              <div className="text-center">
                <Play className="w-20 h-20 text-white/50 mx-auto mb-4" />
                <p className="text-white/70 text-lg">[Ihr Video hier einbinden]</p>
                <p className="text-white/50 text-sm mt-2">z.B. YouTube iframe oder eigenes Video</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
