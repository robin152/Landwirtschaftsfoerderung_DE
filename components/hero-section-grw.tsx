"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { GoogleReviewsSlider } from "./google-reviews-slider"

export default function HeroSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="relative py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white via-white to-slate-50 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center space-y-6 md:space-y-8"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div
              variants={itemVariants}
              className="inline-block px-4 py-2 bg-accent/10 rounded-full border border-accent/20"
            >
              <p className="text-sm md:text-base font-semibold text-accent">Bis zu 200.000€ Zuschuss</p>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Regional-Förderung
              </span>
              <br />
              <span className="text-slate-900">für Ihr Wachstum</span>
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Infrastrukturinvestitionen mit attraktiver Förderung. Schnelle Genehmigung, professionelle Begleitung durch
            unsere Experten.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 md:pt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 md:px-8 py-3 md:py-4 bg-accent text-accent-foreground font-semibold rounded-lg shadow-premium hover:shadow-premium-lg transition-all duration-300"
            >
              Förderung beantragen
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 md:px-8 py-3 md:py-4 border-2 border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-all duration-300"
            >
              Mehr erfahren
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-8 md:pt-12 lg:pt-16 border-t border-border">
            <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 md:mb-8">
              Vertraut von Hunderten Unternehmern
            </p>
            <GoogleReviewsSlider />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
