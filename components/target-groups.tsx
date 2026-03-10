"use client"

import { motion } from "framer-motion"
import { Building2, Factory, Zap } from "lucide-react"

export function TargetGroups() {
  const groups = [
    {
      icon: Building2,
      title: "Maschinenbau",
      description: "Innovative Entwicklungen für Produktionsanlagen und Automatisierung",
    },
    {
      icon: Factory,
      title: "Produktionstechnik",
      description: "Verfahrensentwicklung und Prozessoptimierung",
    },
    {
      icon: Zap,
      title: "Energietechnik",
      description: "Nachhaltige Energie- und Antriebssysteme",
    },
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent"
        >
          Ihre Branche. Ihre Förderung.
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {groups.map((group, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 hover:border-purple-300 transition-all hover:shadow-xl"
            >
              <group.icon className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">{group.title}</h3>
              <p className="text-gray-600">{group.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
