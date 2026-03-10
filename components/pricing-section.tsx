"use client"

import { GlassCard } from "./glass-card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Shield, FileCheck, Phone, Award, Rocket } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ContactFormModal } from "./contact-form-modal"

export function PricingSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const phases = [
    {
      phase: 1,
      title: "Kostenfreies Erstgespräch",
      subtitle: "Unverbindlich",
      price: "0",
      priceLabel: "EUR",
      originalPrice: "499",
      valueTag: "Wirtschaftsbooster",
      highlight: true,
      highlightText: "Jetzt starten",
      icon: Phone,
      color: "from-emerald-500 to-cyan-500",
      features: [
        {
          title: "Schnelle Klarheit",
          description: "Sie wissen danach, ob Ihre Projekte einen Rechtsanspruch auf Förderung haben.",
        },
        {
          title: "Ihr Förderpotenzial beziffert",
          description: "Sie erhalten eine erste Einschätzung, welche Summe für Ihr Unternehmen realistisch ist.",
        },
        {
          title: "Transparenz ohne Fachjargon",
          description: "Sie verstehen den gesamten Ablauf — verständlich erklärt, ohne juristisches Kauderwelsch.",
        },
        {
          title: "Null Risiko, null Verpflichtung",
          description: "Sie entscheiden danach in Ruhe. Kein Druck, kein Kleingedrucktes.",
        },
      ],
      cta: "Anspruch prüfen",
      ctaSubline: "Kostenlos prüfen, ob sich das lohnt.",
    },
    {
      phase: 2,
      title: "Technisches Vor-Audit",
      subtitle: "Antrags-Setup & BSFZ-Dokumentation",
      price: "Festpreis (erhalten Sie im Erstgespräch)",
      priceLabel: "EUR",
      originalPrice: "-",
      valueTag: "Wird verrechnet",
      highlight: false,
      icon: FileCheck,
      color: "from-violet-500 to-purple-500",
      features: [
        {
          title: "Maximale Fördersumme identifiziert",
          description: "Wir finden alle förderfähigen Elemente Ihrer Projekte — oft mehr, als Sie erwarten.",
        },
        {
          title: "Behördensichere Antragsunterlagen",
          description: "Sie erhalten Dokumente, die den BSFZ-Anforderungen entsprechen — kein Nacharbeiten nötig.",
        },
        {
          title: "Revisionssicher dokumentiert",
          description: "Ihre Innovationshöhe ist wasserdicht belegt — Sicherheit bei Betriebsprüfungen.",
        },
        {
          title: "Kein finanzielles Risiko",
          description: "Diese 1.500 EUR werden bei Erfolg zu 100% auf die Vergütung angerechnet.",
        },
      ],
      badge: "Wird verrechnet",
    },
    {
      phase: 3,
      title: "Erfolgsbasierte Vergütung",
      subtitle: "Nur bei positivem BSFZ-Bescheid",
      price: "Individuell",
      priceLabel: "",
      originalPrice: "",
      valueTag: "Kein Risiko",
      highlight: false,
      icon: Award,
      color: "from-cyan-500 to-blue-500",
      features: [
        {
          title: "Sie zahlen nur bei Erfolg",
          description:
            "Vergütung fällt erst an, wenn Ihr Bescheid positiv ist — vorher entstehen keine weiteren Kosten.",
        },
        {
          title: "Fertige Unterlagen für Ihren StB",
          description:
            "Sie erhalten alles für die Steuererklärung — die Finanzamtsphase erledigen Sie mit Ihrem Steuerberater.",
        },
        {
          title: "Jahrelang profitieren",
          description: "Wir begleiten Sie auch bei Folgeanträgen — jedes Jahr neue Förderung möglich.",
        },
        {
          title: "Volle Kostenkontrolle",
          description: "Wird Ihr Antrag abgelehnt, entstehen keine weiteren Kosten. Punkt.",
        },
      ],
      badge: "Kein Risiko",
    },
  ]

  return (
    <>
      <section id="honorar" ref={ref} className="py-16 sm:py-24 overflow-hidden relative bg-secondary/20">
        <div className="container-responsive relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Transparentes Honorarmodell</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">
              In nur 3 Schritten zu Ihrer <span className="gradient-text">Förderbescheinigung</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Starten Sie risikofrei mit einem kostenfreien Erstgespräch. Sie zahlen erst, wenn Sie überzeugt sind.
            </p>
          </motion.div>

          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                  animate={
                    isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 50, filter: "blur(10px)" }
                  }
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                  className="relative"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.15, type: "spring" }}
                    className={`absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                  >
                    {phase.phase}
                  </motion.div>

                  <GlassCard
                    className={`p-6 sm:p-8 pt-10 h-full ${phase.highlight ? "border-2 border-emerald-500/50 relative overflow-hidden" : ""}`}
                    hover
                  >
                    {phase.highlight && (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 pointer-events-none" />
                    )}

                    {phase.badge && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                          {phase.badge}
                        </span>
                      </div>
                    )}

                    {phase.highlightText && (
                      <div className="absolute top-4 right-4">
                        <motion.span
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold"
                        >
                          {phase.highlightText}
                        </motion.span>
                      </div>
                    )}

                    <div className="relative">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${phase.color} bg-opacity-20 flex items-center justify-center mb-4`}
                      >
                        <phase.icon className="w-7 h-7 text-white" />
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold mb-1">{phase.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{phase.subtitle}</p>

                      <div className="flex items-baseline gap-2 mb-6">
                        {phase.originalPrice && (
                          <span className="text-lg text-slate-500 line-through">{phase.originalPrice} €</span>
                        )}
                        <span className={`text-3xl sm:text-4xl font-bold ${phase.highlight ? "text-emerald-400" : ""}`}>
                          {phase.price}
                        </span>
                        {phase.priceLabel && <span className="text-lg text-muted-foreground">{phase.priceLabel}</span>}
                        {phase.valueTag && (
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                            {phase.valueTag}
                          </span>
                        )}
                      </div>

                      <ul className="space-y-3 mb-6">
                        {phase.features.map((feature, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                            transition={{ duration: 0.3, delay: 0.5 + index * 0.15 + i * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle2
                              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${phase.highlight ? "text-emerald-400" : "text-accent"}`}
                            />
                            <div>
                              <div className="font-semibold text-sm text-foreground">{feature.title}</div>
                              <p className="text-sm text-slate-400">{feature.description}</p>
                            </div>
                          </motion.li>
                        ))}
                      </ul>

                      {phase.cta && (
                        <div className="pt-4 border-t border-border">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              size="lg"
                              onClick={() => setIsModalOpen(true)}
                              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 hover:opacity-90 transition-all h-12 sm:h-14 text-sm sm:text-base font-bold group shadow-lg shadow-emerald-500/20 whitespace-normal"
                            >
                              {phase.cta}
                              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                            </Button>
                          </motion.div>
                          <p className="text-xs text-center text-slate-400 mt-3">{phase.ctaSubline}</p>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 sm:mt-16 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-cyan-500/5 border border-accent/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">Starten Sie jetzt mit Schritt 1</p>
                  <p className="text-sm text-muted-foreground">Kostenfrei & unverbindlich</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="gradient-primary text-white border-0 hover:opacity-90 h-11 sm:h-12 px-4 sm:px-6 font-bold group whitespace-normal text-sm sm:text-base"
                >
                  Anspruch prüfen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Button>
                <a
                  href="tel:+49208780125778"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-accent/30 text-accent hover:bg-accent/5 transition-colors font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  Direkt anrufen
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
