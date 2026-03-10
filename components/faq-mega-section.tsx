'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Target, MapPin, Euro, CheckCircle, Gavel, ShieldAlert } from 'lucide-react'
import { LeadCaptureModal } from './lead-capture-modal'

interface FAQCategory {
  id: string
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
  faqs: Array<{ question: string; answer: string }>
}

const faqCategories: FAQCategory[] = [
  {
    id: "grundlagen",
    label: "Grundlagen",
    icon: Target,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    faqs: [
      {
        question: "Was ist das Ziel dieser Investitionszuschüsse?",
        answer: "Die Förderung soll landwirtschaftliche Betriebe bei der Modernisierung unterstützen, Wettbewerbsfähigkeit stärken und gleichzeitig höhere Standards bei Tierwohl, Umwelt- und Klimaschutz ermöglichen. Sie lenkt Investitionen in Bereiche, die ohne Zuschuss oft unrentabel wären."
      },
      {
        question: "Wie lange läuft das Programm noch?",
        answer: "Die Förderperiode endet am 31.12.2027. Das maximale Investitionsvolumen kann nur einmal pro Betrieb in dieser gesamten Zeit ausgeschöpft werden."
      },
      {
        question: "Gibt es ein Gesamtbudget pro Jahr?",
        answer: "Ja, jedes Bundesland hat ein eigenes Budget. Beispiel: Niedersachsen, Bremen und Hamburg haben 2026 zusammen 18 Mio. € zur Verfügung. Hohe Nachfrage führt zu Ranking-Verfahren – wer zu spät kommt, geht leer aus."
      },
      {
        question: "Wird die Förderung als Zuschuss oder Darlehen gewährt?",
        answer: "Es handelt sich ausschließlich um einen nicht rückzahlbaren Zuschuss. Nach Bewilligung und Schlussabrechnung fließt das Geld direkt auf dein Konto."
      },
      {
        question: "Muss ich Eigenkapital nachweisen?",
        answer: "Ja. Bei Investitionen über 200.000 € wird in den meisten Ländern die Eigenkapitalbildung der letzten Jahre geprüft. Eine aktuelle Kreditbereitschaftserklärung der Hausbank ist fast immer Pflicht."
      },
    ]
  },
  {
    id: "voraussetzungen",
    label: "Voraussetzungen",
    icon: CheckCircle,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    faqs: [
      {
        question: "Wer ist förderberechtigt?",
        answer: "Landwirtschaftliche KMU, die mehr als 25 % Umsatz aus Primärproduktion erzielen, die ALG-Mindestgröße erfüllen und deren Betriebsleiter eine abgeschlossene landwirtschaftliche Ausbildung oder ein Studium hat."
      },
      {
        question: "Was passiert, wenn mein Einkommen die Prosperitätsgrenze überschreitet?",
        answer: "Dann gibt es keinen Zuschuss. Aktuelle Grenzen (März 2026): NRW 150.000/180.000 €, Niedersachsen 170.000/200.000 €, Bayern 140.000/170.000 €, BW 210.000/250.000 €. Bei Überschreitung ist eine Optimierung nur in Ausnahmefällen möglich."
      },
      {
        question: "Gelten für Junglandwirte besondere Regeln?",
        answer: "Ja. Bis 40 Jahre + Erstniederlassung in den letzten 5 Jahren: +10 % Zuschuss (max. 20.000 €, Gesamtsatz meist ≤ 50 %)."
      },
      {
        question: "Darf ich als juristische Person (GmbH, GbR) beantragen?",
        answer: "Ja, wenn mindestens ein Mitglied der Geschäftsführung die Qualifikation erfüllt und der Betrieb landwirtschaftlich geprägt ist."
      },
      {
        question: "Muss der Betrieb in Deutschland liegen?",
        answer: "Ja. Der Sitz des Betriebes bestimmt das Bundesland und damit die geltenden Regeln. Grenzbetriebe können nur im eigenen Land beantragen."
      },
    ]
  },
  {
    id: "technik",
    label: "Technische Anforderungen",
    icon: MapPin,
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    faqs: [
      {
        question: "Welche Maßnahmen werden grundsätzlich gefördert?",
        answer: "Stallbau mit Tierwohl-Standards, emissionsmindernde Technik (SIUK), Gülle- und Festmistlager mit Abdeckung, Präzisionstechnik, Bewässerung mit ≥ 15 % Einsparung, Naturgefahrenvorsorge und Kälbermatten."
      },
      {
        question: "Welche Tageslicht-Anforderungen gelten für Tierwohl-Ställe?",
        answer: "Mindestens 3 % der Stallgrundfläche bei Schweinen/Geflügel und 5 % bei Rindern – das ist Voraussetzung für den Premium-Satz."
      },
      {
        question: "Muss ich bei Schweineställen bestimmte Platzvorgaben einhalten?",
        answer: "Ja. Mindestens 20 % mehr nutzbare Fläche als gesetzlich vorgeschrieben plus weiche Liegefläche, Beschäftigungsmaterial und offene Tränken."
      },
      {
        question: 'Was genau bedeutet "feste Abdeckung" beim Güllelager?',
        answer: "Eine feste, gasdichte Abdeckung plus mindestens 2 Monate zusätzliche Lagerkapazität über dem gesetzlichen Minimum – dann gibt es 40 % Zuschuss."
      },
      {
        question: "Werden gebrauchte Maschinen gefördert?",
        answer: "Nein. Nur Neugeräte. Selbstfahrende Maschinen sind in der Außenwirtschaft meist ausgeschlossen."
      },
    ]
  },
  {
    id: "quoten",
    label: "Förderquoten & Boni",
    icon: Euro,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    faqs: [
      {
        question: "Wie hoch sind die möglichen Zuschussquoten?",
        answer: "Basis: 20 %. Tierwohl-Premium: 35–40 % (Bayern nur 25 %). SIUK/Klima: bis 75 % (Hessen), Kombi bis 50 %. BW und Niedersachsen haben 2026 angepasste Sätze."
      },
      {
        question: "Wie hoch ist das maximale Investitionsvolumen?",
        answer: "NRW & Bayern: 1,2 Mio. €. Niedersachsen: 1,5 Mio. €. BW: seit 2026 einheitlich 2 Mio. €. Ostländer & Hessen: 5 Mio. €."
      },
      {
        question: "Gibt es einen Junglandwirt-Zuschlag?",
        answer: "Ja, überall +10 % (max. 20.000 €). In Bayern gibt es zusätzlich Punkte für Meister/Agrarbetriebswirt."
      },
      {
        question: "Wie hoch ist der Kälbermatten-Zuschlag?",
        answer: "30 % + 10 % Aufschlag in vielen Ländern – befristet bis Ende 2025/2026."
      },
      {
        question: "Kann ich mehrere Maßnahmen kombinieren?",
        answer: "Ja. Tierwohl + SIUK ergibt oft den höchsten Satz (bis 50 %)."
      },
    ]
  },
  {
    id: "antrag",
    label: "Antragsverfahren",
    icon: Gavel,
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    faqs: [
      {
        question: "Wie läuft der Antrag ab?",
        answer: "Vollständig digital über Landesportale (ELAN NRW, iBALIS Bayern, INET Niedersachsen). Baugenehmigung und Bankbestätigung müssen bei Antragstellung vorliegen."
      },
      {
        question: "Gibt es Stichtage oder laufende Anträge?",
        answer: "Meist Ranking-Verfahren mit festen Auswahlrunden. Niedersachsen 2026: Anträge 9.–23. März möglich."
      },
      {
        question: "Was ist das Punktesystem?",
        answer: "Anträge werden nach Tierwohl-, Klima- und Struktur-Punkten gereiht. Nur wer die Mindestpunktzahl erreicht, wird bewilligt."
      },
      {
        question: "Brauche ich ein Investitionskonzept?",
        answer: "Ja. Technischer Teil (Pläne, Kosten) + betriebswirtschaftliche Planrechnung. Für kleine Vorhaben bis 150.000 € gibt es in Niedersachsen ein vereinfachtes Konzept."
      },
      {
        question: "Wann beginnt der Maßnahmenbeginn?",
        answer: "Bereits mit dem ersten Vertrag oder der ersten Bestellung. Nur Planung und Genehmigungen dürfen vorher laufen – sonst verlierst du den gesamten Anspruch."
      },
    ]
  },
  {
    id: "risiken",
    label: "Ausschlüsse & Risiken",
    icon: ShieldAlert,
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    faqs: [
      {
        question: "Welche Investitionen sind definitiv ausgeschlossen?",
        answer: "Reine Ersatzinvestitionen, gebrauchte Maschinen, Landkauf, EEG-Anlagen, Tiere, Gesellschaftsanteile und vorzeitiger Maßnahmenbeginn."
      },
      {
        question: "Wie lange gilt die Zweckbindung?",
        answer: "Gebäude 12 Jahre, Maschinen 5 Jahre, EDV 3 Jahre. Bei Verkauf oder Zweckentfremdung droht anteilige Rückforderung."
      },
      {
        question: "Was passiert bei Ablehnung?",
        answer: "Du kannst in der nächsten Runde neu einreichen oder das Vorhaben anpassen. Keine automatische Begründungspflicht, aber oft hilft eine Nachfrage beim Amt."
      },
      {
        question: "Wie lange muss ich Unterlagen aufbewahren?",
        answer: "Mindestens 12 Jahre nach Ende der Zweckbindung – das gilt für alle Förderunterlagen."
      },
      {
        question: "Kann ich die Förderung mit anderen Programmen kombinieren?",
        answer: "Ja, aber nur, wenn die Gesamtförderung die beihilferechtlichen Obergrenzen (meist 50–75 %) nicht überschreitet. Eine Doppelförderung desselben Postens ist verboten."
      },
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
              Häufige Fragen
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Alles zu den staatlichen Zuschüssen für landwirtschaftliche Investitionen 2023–2027
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              30 Fragen beantwortet – 100 % faktenbasiert nach offiziellen Länder-Richtlinien (Stand März 2026)
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
              Deine Frage ist nicht dabei? Ich beantworte sie persönlich.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-colors"
            >
              Kostenlose Beratung buchen
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
