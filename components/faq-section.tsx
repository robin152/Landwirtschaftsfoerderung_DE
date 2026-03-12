"use client"

import { motion } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "Wie hoch ist die Foerderung fuer landwirtschaftliche Investitionen?",
    answer:
      "Je nach Bundesland und Massnahme sind Zuschüsse von 20 % bis 65 % moeglich. Tierwohl-Stallbauten werden besonders stark gefoerdert, ebenso Junglandwirte mit bis zu +10 % Bonus.",
  },
  {
    question: "Welche Kosten sind foerderfaehig?",
    answer:
      "Foerderfaehig sind u.a. Stallbau und -umbau, Technik fuer Tierwohl und Umweltschutz, Guellelagerung, Energieeffizienz-Massnahmen sowie Diversifizierungsprojekte wie Hoflaeden oder Ferienwohnungen.",
  },
  {
    question: "Wie lange dauert die Bearbeitung?",
    answer:
      "Von der Antragstellung bis zum Bescheid vergehen je nach Bundesland 3-6 Monate. Wir bereiten alles so vor, dass der Antrag beim ersten Einreichen sitzt und keine Nachfragen entstehen.",
  },
  {
    question: "Muss ich die Foerderung zurueckzahlen?",
    answer:
      "Nein, AFP-Zuschüsse und die meisten Agrarfoerderungen sind nicht rueckzahlbare Zuschüsse. Nur bei Verstößen gegen Auflagen kann es zu Rueckforderungen kommen.",
  },
  {
    question: "Was kostet die Beratung durch Ihre Experten?",
    answer:
      "Das Erstgespraech und die Foerderpotenzial-Analyse sind 100 % kostenlos und unverbindlich. Erst wenn wir gemeinsam einen Antrag stellen, berechnen wir ein Erfolgshonorar.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-10 sm:mb-16 text-slate-900"
        >
          Haeufige Fragen
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
                className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm sm:text-base lg:text-lg font-bold pr-4 sm:pr-8">{faq.question}</span>
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
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm sm:text-base text-slate-600 leading-relaxed">{faq.answer}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
