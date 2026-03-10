"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Shield, TrendingUp } from "lucide-react"
import { MagneticButton } from "@/components/magnetic-button"
import { MaskedBlurHeadline } from "@/components/masked-blur-headline"
import { GoogleReviewsSlider } from "@/components/google-reviews-slider"

export function HeroSectionPremium() {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Aurora Mesh Background */}
      <div className="absolute inset-0 animate-aurora-mesh bg-gradient-to-br from-accent/5 via-primary/5 to-white" />

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(8,145,178,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(3,105,161,0.06),transparent_50%)]" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect-premium mb-8"
          >
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Offiziell vom Staat • Keine Rückzahlung</span>
          </motion.div>

          {/* Headline with Masked Blur Animation */}
          <MaskedBlurHeadline className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
            Bis zu{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              65% Ihrer Investitionskosten
            </span>{" "}
            zurück
          </MaskedBlurHeadline>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-2xl md:text-3xl font-semibold mb-4 text-balance"
          >
            Geschenktes Kapital statt teurer Kredite
          </motion.h2>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-balance"
          >
            Nutzen Sie die neue Richtlinie 2026 zur Regional-Förderung. Bis zu 65% für Erneuerbare Energien, bis zu 50% für Maschinen und Anlagen.
            Wir holen Ihren maximalen, nicht rückzahlbaren Zuschuss.
          </motion.p>

          {/* Benefit Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {["Keine Rückzahlung", "Offiziell vom Staat", "Full-Service Abwicklung"].map((tag, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 glass-effect rounded-full">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="font-medium">{tag}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <MagneticButton onClick={scrollToCalculator} className="text-lg px-10 py-6">
              Jetzt Gratis-Fördercheck starten
              <ArrowRight className="ml-2 w-5 h-5" />
            </MagneticButton>

            <MagneticButton
              onClick={scrollToCalculator}
              className="bg-white/40 backdrop-blur-xl border-2 border-accent/30 text-accent hover:border-accent/50 shadow-lg"
            >
              <TrendingUp className="mr-2 w-5 h-5" />
              Förderrechner starten
            </MagneticButton>
          </motion.div>

          {/* Google Reviews Slider */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <GoogleReviewsSlider />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
