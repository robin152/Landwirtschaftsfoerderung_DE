'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Target, MapPin, Euro, CheckCircle } from 'lucide-react'
import { LeadCaptureModal } from './lead-capture-modal'

interface FAQCategory {
  id: string
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
  faqs: Array<{ question: string; answer: string }>
}

// TEMPLATE ANLEITUNG: FAQ - CATEGORIES & QUESTIONS
// ===============================================
// Kategorien: Grundlagen, Gebiete, Quoten, Was wird gefördert
// Pro Kategorie: 5-6 FAQs mit häufigen Objections
const faqCategories: FAQCategory[] = [
  {
    id: "basics",
    label: "[KATEGORIE 1: Grundlagen]",
    icon: Target,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    faqs: [
      { question: "[FRAGE 1]", answer: "[ANTWORT 1]" },
      { question: "[FRAGE 2]", answer: "[ANTWORT 2]" },
      { question: "[FRAGE 3]", answer: "[ANTWORT 3]" },
      { question: "[FRAGE 4]", answer: "[ANTWORT 4]" },
      { question: "[FRAGE 5]", answer: "[ANTWORT 5]" },
    ]
  },
  {
    id: "regions",
    label: "[KATEGORIE 2: Fördergebiete]",
    icon: MapPin,
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    faqs: [
      { question: "[FRAGE 1]", answer: "[ANTWORT 1]" },
      { question: "[FRAGE 2]", answer: "[ANTWORT 2]" },
      { question: "[FRAGE 3]", answer: "[ANTWORT 3]" },
      { question: "[FRAGE 4]", answer: "[ANTWORT 4]" },
      { question: "[FRAGE 5]", answer: "[ANTWORT 5]" },
    ]
  },
  {
    id: "quotes",
    label: "[KATEGORIE 3: Förderquoten]",
    icon: Euro,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    faqs: [
      { question: "[FRAGE 1]", answer: "[ANTWORT 1]" },
      { question: "[FRAGE 2]", answer: "[ANTWORT 2]" },
      { question: "[FRAGE 3]", answer: "[ANTWORT 3]" },
      { question: "[FRAGE 4]", answer: "[ANTWORT 4]" },
      { question: "[FRAGE 5]", answer: "[ANTWORT 5]" },
    ]
  },
  {
    id: "eligible",
    label: "[KATEGORIE 4: Was wird gefördert?]",
    icon: CheckCircle,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    faqs: [
      { question: "[FRAGE 1]", answer: "[ANTWORT 1]" },
      { question: "[FRAGE 2]", answer: "[ANTWORT 2]" },
      { question: "[FRAGE 3]", answer: "[ANTWORT 3]" },
      { question: "[FRAGE 4]", answer: "[ANTWORT 4]" },
      { question: "[FRAGE 5]", answer: "[ANTWORT 5]" },
    ]
  },
]

interface FAQAccordionItemProps {
  question: string
  answer: string
  index: number
  isOpen: boolean
  onToggle: () => void
}

function FAQAccordionItem({ question, answer, index, isOpen, onToggle }: FAQAccordionItemProps) {
  return (
    <motion.div
      initial={false}
      animate={{ backgroundColor: isOpen ? "rgba(0,0,0,0.02)" : "transparent" }}
      className="border-b border-slate-100 last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors text-left"
      >
        <span className="text-sm sm:text-base font-medium text-slate-900 flex-1 text-pretty">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50/50 text-sm sm:text-base text-slate-600 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQMegaSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].id)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (question: string) => {
    setOpenItems(prev => ({ ...prev, [question]: !prev[question] }))
  }

  const currentCategory = faqCategories.find(c => c.id === activeCategory)!

  return (
    <>
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-slate-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs sm:text-sm font-semibold text-slate-700 mb-3 sm:mb-4">
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              [BADGE: z.B. "Häufige Fragen"]
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              [HEADLINE: Alles zu [Thema]]
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              [SUBHEADLINE: Ihre Fragen beantwortet]
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="mb-6 sm:mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex sm:flex-wrap gap-2 overflow-x-auto pb-3 sm:pb-0 sm:justify-center scrollbar-hide">
              {faqCategories.map((category) => {
                const Icon = category.icon
                const isActive = activeCategory === category.id
                
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id)
                      setOpenItems({})
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all ${
                      isActive
                        ? `${category.bgColor} ${category.color} shadow-sm`
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="whitespace-nowrap">{category.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* FAQ Content Card */}
          <motion.div
            layout
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 overflow-hidden"
          >
            {/* Category Header */}
            <div className={`${currentCategory.bgColor} px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200/50`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/80 flex items-center justify-center ${currentCategory.color}`}>
                  <currentCategory.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-base sm:text-lg ${currentCategory.color}`}>
                    {currentCategory.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">{currentCategory.faqs.length} Fragen</p>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div>
              {currentCategory.faqs.map((faq, index) => (
                <FAQAccordionItem
                  key={`${currentCategory.id}-${index}`}
                  question={faq.question}
                  answer={faq.answer}
                  index={index}
                  isOpen={openItems[`${currentCategory.id}-${index}`] || false}
                  onToggle={() => toggleItem(`${currentCategory.id}-${index}`)}
                />
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 sm:mt-12 text-center"
          >
            <p className="text-slate-600 mb-4">
              Ihre Frage ist nicht dabei?
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors"
            >
              Kostenlose Beratung buchen
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
