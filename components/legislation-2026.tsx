"use client"

import { GlassCard } from "./glass-card"
import { TrendingUp, Scale, Clock, Briefcase, AlertCircle, ArrowRight } from "lucide-react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ContactFormModal } from "./contact-form-modal"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    filter: "blur(12px)",
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
}

const headingVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
}

export function Legislation2026() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const keyChanges = [
    {
      icon: TrendingUp,
      label: "Bemessungsgrundlage",
      oldValue: "10 Mio. €",
      newValue: "12 Mio. €",
      impact: "4,2 Mio. €",
      impactLabel: "max. Rückerstattung für KMU",
      description: "Die Obergrenze steigt von 10 auf 12 Millionen Euro pro Jahr",
      benefit: "Bis zu 20% mehr Fördervolumen für Ihr Unternehmen",
      userValue: "Das bedeutet für Sie: Bis zu 4,2 Mio. € Steuererstattung direkt auf Ihr Konto!",
    },
    {
      icon: Scale,
      label: "Gemeinkostenpauschale",
      oldValue: "0%",
      newValue: "20%",
      impact: "+20%",
      impactLabel: "auf alle F&E-Lohnkosten",
      description: "Pauschale deckt Miete, Energie, IT-Infrastruktur — ohne Einzelnachweis",
      benefit: "Ihre effektive Bemessungsgrundlage: Personalkosten × 1,2",
      userValue:
        "Das bedeutet für Sie: 20% mehr Fördersumme durch revisionssichere Pauschalierung zur Reduktion bürokratischer Hürden!",
    },
    {
      icon: Briefcase,
      label: "Unternehmerlohn",
      oldValue: "70 €/h",
      newValue: "100 €/h",
      impact: "62.400 €",
      impactLabel: "pro Jahr zusätzlich",
      description: "Marktgerechte Bewertung Ihrer persönlichen Entwicklungsarbeit",
      benefit: "Ihre eigene Entwicklungszeit wird endlich fair vergütet",
      userValue: "Das bedeutet für Sie: 62.400 € mehr pro Jahr für Ihre eigene Entwicklungsarbeit!",
    },
    {
      icon: Clock,
      label: "Rückwirkende Beantragung",
      oldValue: "—",
      newValue: "Bis 2022",
      impact: "4 Jahre",
      impactLabel: "nachträglich möglich",
      description: "Projekte ab 2022 können noch beantragt werden: 2022-2023 mit 25%, ab April 2024 mit 35% (KMU)",
      benefit: "Sichern Sie sich Ihre Ansprüche für Innovationsleistungen rückwirkend bis 2022",
      userValue:
        "Das bedeutet für Sie: Bis zu 4 Jahre rückwirkend Geld zurückholen – 2022-2023 mit 25%, ab April 2024 mit 35% Förderquote für KMU!",
    },
  ]

  return (
    <>
      <section id="gesetzeslage-2026" ref={ref} className="py-20 sm:py-32 overflow-hidden relative">
        {/* Cinematischer Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-violet-500/5 to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-cyan-500/5 to-transparent" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"
          />
          <div className="blueprint-grid opacity-20 absolute inset-0" />
        </div>

        <div className="container-responsive relative">
          {/* Header with blur animations */}
          <motion.div
            className="text-center mb-16 sm:mb-20"
            variants={headingVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                  : { opacity: 0, scale: 0.8, filter: "blur(8px)" }
              }
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 mb-6"
            >
              <Scale className="w-5 h-5 text-violet-400" />
              <span className="text-base font-semibold text-violet-300">Wachstumschancengesetz 2026</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={
                isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(10px)" }
              }
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance"
            >
              Sichern Sie sich jetzt <span className="gradient-text">bis zu 20% mehr Fördervolumen</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={
                isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(8px)" }
              }
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Das Wachstumschancengesetz 2026 bringt massive Verbesserungen: höhere Bemessungsgrundlage, 100 €/h
              Eigenleistung, 20% Gemeinkostenpauschale. Nutzen Sie diese Chancen jetzt für maximale Liquidität.
            </motion.p>
          </motion.div>

          {/* Changes Grid with staggered blur animations */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {keyChanges.map((change, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <GlassCard className="p-6 sm:p-8" hover glow="none">
                  {/* Icon & Label */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center"
                      >
                        <change.icon className="w-6 h-6 text-violet-400" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-foreground">{change.label}</h3>
                    </div>
                  </div>

                  {/* Old vs New */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wide">Bisher</div>
                      <div className="text-2xl font-bold text-muted-foreground line-through">{change.oldValue}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/30">
                      <div className="text-sm text-violet-300 mb-1 uppercase tracking-wide">Ab 2026</div>
                      <div className="text-2xl font-bold gradient-text">{change.newValue}</div>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-accent mb-0.5">{change.impact}</div>
                        <div className="text-sm text-muted-foreground">{change.impactLabel}</div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-accent opacity-50" />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-base text-muted-foreground mb-3 leading-relaxed">{change.description}</p>

                  {/* Benefit */}
                  <div className="pt-4 border-t border-border/50 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <p className="text-base text-cyan-300 font-medium">{change.benefit}</p>
                    </div>
                  </div>

                  {/* User Value */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-violet-500/10 via-cyan-500/5 to-violet-500/10 border-2 border-violet-500/30">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <ArrowRight className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <div className="text-sm text-violet-300 font-semibold mb-1 uppercase tracking-wide">
                          Ihr konkreter Nutzen
                        </div>
                        <p className="text-base font-bold text-foreground leading-relaxed">{change.userValue}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA Box with blur animation */}
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(15px)", scale: 0.95 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
                : { opacity: 0, y: 50, filter: "blur(15px)", scale: 0.95 }
            }
            transition={{ duration: 0.9, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <GlassCard className="p-8 sm:p-10 text-center border-2 border-violet-500/30" glow="primary">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Scale className="w-8 h-8 text-violet-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-1">Gilt auch rückwirkend</h3>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    KMU können für Projekte ab <span className="text-accent font-semibold">2022</span> nachträglich die
                    Förderung nutzen: <span className="text-accent font-semibold">25%</span> für 2022-2023,{" "}
                    <span className="text-accent font-semibold">35%</span> ab April 2024
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-border/50 mb-6">
                <p className="text-base text-muted-foreground">
                  Wichtig: Die Anrechnung erfolgt auf die Einkommen- oder Körperschaftssteuer. Sie erhalten echtes Geld
                  zurück, keine Steuergutschrift.
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto gradient-primary text-white border-0 hover:opacity-90 transition-all h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold group glow-primary"
              >
                Anspruch prüfen
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </Button>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
