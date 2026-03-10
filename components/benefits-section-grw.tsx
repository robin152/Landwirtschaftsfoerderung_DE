"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Zap, Users, TrendingUp, Clock } from "lucide-react"

const benefits = [
  {
    title: "Finanzielle Unterstützung",
    description: "Bis zu 200.000€ Gründungszuschuss für Ihre Infrastrukturinvestitionen",
    icon: Zap,
  },
  {
    title: "Fachberatung",
    description: "Kostenlose Unterstützung durch erfahrene Gründungsberater",
    icon: Users,
  },
  {
    title: "Geringer Eigenanteil",
    description: "Minimale Eigenmittel erforderlich für maximale Förderung",
    icon: TrendingUp,
  },
  {
    title: "Schnelle Bearbeitung",
    description: "Zügige Antragsgenehmigung mit transparentem Prozess",
    icon: Clock,
  },
]

export default function BenefitsSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section ref={ref} className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-12 md:space-y-16"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Warum die Regional-Förderung?</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Vier Gründe, warum Sie heute starten sollten
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -8, boxShadow: "0 20px 60px rgba(8, 145, 178, 0.1)" }}
                  className="p-6 md:p-8 rounded-xl border border-border bg-white transition-all duration-300"
                >
                  <div className="mb-4 p-3 w-fit rounded-lg bg-accent/10">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{benefit.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
