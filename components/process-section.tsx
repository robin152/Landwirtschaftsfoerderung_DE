"use client"

import { GlassCard } from "./glass-card"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ContactFormModal } from "./contact-form-modal"
import { useState, useRef } from "react"
import { motion } from "framer-motion"

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  )
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
    </svg>
  )
}

const steps = [
  {
    number: "1",
    icon: ClipboardIcon,
    title: "Detailanalyse & Dokumentation",
    description:
      "Wir prüfen Ihre Projekte auf Frascati-Konformität, erstellen die technische Projektbeschreibung und berechnen Ihre maximale Fördersumme — so, dass die BSFZ ja sagt.",
    duration: "2-3 Wochen",
    deliverable: "Vollständige Antragsdokumentation",
    nutzen: "Null Aufwand für Sie — wir machen die Arbeit",
  },
  {
    number: "2",
    icon: SendIcon,
    title: "BSFZ-Antragstellung",
    description:
      "Wir reichen den Antrag bei der Bescheinigungsstelle ein und begleichen den Prozess bis zur positiven Bescheinigung. Bei Rückfragen stehen wir der BSFZ Rede und Antwort.",
    duration: "4-8 Wochen",
    deliverable: "BSFZ-Bescheinigung",
    nutzen: "98% Erfolgsquote bei unseren Anträgen",
  },
  {
    number: "3a",
    icon: WalletIcon,
    title: "Finanzamt-Unterlagen",
    description:
      "Mit der BSFZ-Bescheinigung erstellen wir alle notwendigen Unterlagen für Ihren Steuerberater. Eine detaillierte Anleitung liegt bei.",
    duration: "Sofort nach BSFZ-Bescheid",
    deliverable: "Steuerberater-Paket",
    nutzen: "Ihr StB kann direkt loslegen",
  },
  {
    number: "3b",
    icon: WalletIcon,
    title: "Auszahlung",
    description:
      "Ihr Steuerberater beantragt die Forschungszulage beim Finanzamt. Die Erstattung erfolgt mit dem nächsten Steuerbescheid.",
    duration: "Mit Steuerbescheid",
    deliverable: "Förderung auf Ihrem Konto",
    nutzen: "Enge Verzahnung — schnelle Auszahlung",
  },
]

export function ProcessSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <section id="ablauf" className="py-20 sm:py-32" ref={containerRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
              In 3 Schritte zur <span className="gradient-text">zertifizierten Förderbescheinigung</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Minimaler Aufwand für Sie, maximale Förderung. Wir übernehmen das komplette Verfahren.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                >
                  <GlassCard hover className="relative h-full">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                          className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0"
                        >
                          <step.icon className="w-6 h-6 text-white" />
                        </motion.div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm text-primary font-bold">Schritt {step.number}</span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-semibold text-foreground">{step.title}</h3>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span className="text-muted-foreground">
                            Dauer: <span className="text-foreground">{step.duration}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span className="text-muted-foreground">
                            Ergebnis: <span className="text-foreground">{step.deliverable}</span>
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-accent font-medium">{step.nutzen}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <GlassCard className="p-8 border-2 border-violet-500/20" glow="primary">
                <h3 className="text-2xl font-bold mb-3">In 3 Schritten zur zertifizierten Förderbescheinigung</h3>
                <p className="text-muted-foreground mb-6">
                  Minimaler Aufwand für Sie. Wir übernehmen das komplette Verfahren. Starten Sie jetzt mit dem
                  kostenfreien Erstgespräch.
                </p>
                <Button
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="gradient-primary text-white border-0 hover:opacity-90 transition-all h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold group glow-primary"
                >
                  Anspruch prüfen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Button>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
