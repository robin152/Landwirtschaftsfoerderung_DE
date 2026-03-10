"use client"

import { motion } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "Wie hoch ist die Forschungszulage?",
    answer:
      "Die Forschungszulage beträgt 25% der förderfähigen Aufwendungen, maximal 4 Mio. € pro Unternehmen und Wirtschaftsjahr.",
  },
  {
    question: "Welche Kosten sind förderfähig?",
    answer:
      "Förderfähig sind Personalkosten für F&E-Mitarbeiter, Auftragsforschung, sowie 60% der Kosten für Prototypen und Pilotanlagen.",
  },
  {
    question: "Wie lange dauert die Bearbeitung?",
    answer:
      "Nach Einreichung der technischen Zertifizierung beim Projektträger (DLR) erfolgt die Bescheinigung in der Regel innerhalb von 4-6 Wochen.",
  },
  {
    question: "Muss ich die Förderung zurückzahlen?",
    answer:
      "Nein, die Forschungszulage ist ein nicht rückzahlbarer Zuschuss und wird direkt mit der Steuerlast verrechnet oder ausgezahlt.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent"
        >
          Häufige Fragen
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl bg-white/80 backdrop-blur border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold pr-8">{faq.question}</span>
                {openIndex === idx ? (
                  <Minus className="w-6 h-6 text-purple-600 flex-shrink-0" />
                ) : (
                  <Plus className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === idx ? "auto" : 0,
                  opacity: openIndex === idx ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 text-gray-600">{faq.answer}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
