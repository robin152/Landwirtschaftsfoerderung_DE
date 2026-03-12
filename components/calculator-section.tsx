"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Calculator } from "lucide-react"

// Dynamic import to reduce initial bundle size
const RWPPrecisionCalculator = dynamic(() => import("@/components/rwp-precision-calculator"), {
  loading: () => (
    <div className="flex items-center justify-center py-24">
      <Calculator className="w-12 h-12 text-primary animate-pulse" />
    </div>
  ),
  ssr: false,
})

export function CalculatorSection() {
  return (
    <section id="calculator" className="py-16 sm:py-24 bg-gradient-to-b from-card to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-xs sm:text-sm font-mono text-primary mb-3 sm:mb-4 block">Interaktiver Förderrechner</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-foreground mb-4 sm:mb-6">
            Berechnen Sie Ihre Förderhöhe
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Präzise Förderindikation in 7 Schritten. Basierend auf der aktuellen Richtlinie 2024.
          </p>
        </motion.div>

        <RWPPrecisionCalculator />
      </div>
    </section>
  )
}
