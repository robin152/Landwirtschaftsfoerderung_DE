"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function ExpertSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-cyan-100">
              <Image src="/professional-engineer.png" alt="Expert" fill className="object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Ihr Ansprechpartner für technische F&E-Förderung
            </h2>
            <p className="text-xl text-gray-600 mb-8 italic">
              "Ingenieure verstehen Ingenieure. Wir sprechen Ihre Sprache."
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
                <p className="text-gray-700">Technische Ersteinschätzung in 30 Minuten</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2" />
                <p className="text-gray-700">98% bewilligte Anträge bei BSFZ</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
                <p className="text-gray-700">Über 100 Projekte betreut</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
