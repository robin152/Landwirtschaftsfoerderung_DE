"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export function FrascatiSection() {
  const criteria = [
    "Experimentelle Entwicklung mit technischer Unsicherheit",
    "Systematischer Ansatz zur Problemlösung",
    "Neue oder verbesserte Produkte, Verfahren oder Dienstleistungen",
    "Dokumentierte F&E-Aktivitäten",
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            Frascati-Kriterien
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ihre Projekte müssen die international anerkannten Frascati-Kriterien erfüllen, um förderfähig zu sein.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {criteria.map((criterion, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-4 p-6 rounded-xl bg-white/80 backdrop-blur border border-purple-200 hover:border-purple-400 transition-all"
            >
              <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <p className="text-gray-700 font-medium">{criterion}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
