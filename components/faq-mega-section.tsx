'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Target, Tractor, Euro, Gavel, ShieldAlert, Sprout } from 'lucide-react'
import { LeadCaptureModal } from './lead-capture-modal'

interface FAQCategory {
  id: string
  label: string
  shortLabel: string
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
  range: string
  faqs: Array<{ question: string; answer: string }>
}

const faqCategories: FAQCategory[] = [
  {
    id: "grundlagen",
    label: "Strategische Grundlagen & Antragsberechtigung",
    shortLabel: "Grundlagen",
    icon: Target,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    range: "1 – 20",
    faqs: [
      {
        question: "Wer ist im Sinne der Richtlinien 2026 antragsberechtigt?",
        answer: "Antragsberechtigt sind landwirtschaftliche Unternehmer, deren Betrieb die Mindestgröße nach dem Gesetz über die Alterssicherung der Landwirte (ALG) erreicht. Die Eskalator AG führt für Sie vorab einen Struktur-Check durch, um sicherzustellen, dass Ihre Rechtsform (GbR, GmbH, Einzelunternehmen) die Kriterien erfüllt.",
      },
      {
        question: "Welche Rolle spielt der KMU-Status?",
        answer: "Förderung ist primär für kleine und mittlere Unternehmen (KMU) gedacht. Wir prüfen Ihre Mitarbeiterzahl und Umsätze, damit Sie nicht aufgrund von Verflechtungen mit anderen Firmen den Förderanspruch verlieren.",
      },
      {
        question: "Wie hoch ist die Mindestinvestitionssumme?",
        answer: "Die meisten Programme (wie das AFP) starten bei 20.000 € Netto. Die Eskalator AG hilft Ihnen, Einzelmaßnahmen strategisch so zu bündeln, dass diese Schwelle sicher überschritten wird.",
      },
      {
        question: "Gibt es eine Altersgrenze für die Förderung?",
        answer: "Grundsätzlich nein. Aber: Junglandwirte unter 40 erhalten durch die Eskalator AG oft Zugang zu erhöhten Fördersätzen (+10–15 %).",
      },
      {
        question: "Wie funktioniert das Ranking-Verfahren der LWK?",
        answer: "Geld wird nicht nach Eingang, sondern nach Punkten vergeben. Wir optimieren Ihr Projekt so, dass es im Wettbewerb um Tierwohl und Innovation die höchste Punktzahl erreicht.",
      },
      {
        question: "Sind Nebenerwerbslandwirte förderfähig?",
        answer: "Ja, sofern mindestens 25 % der Gesamteinkünfte aus der Landwirtschaft stammen. Die Eskalator AG erstellt hierfür den notwendigen Rentabilitätsnachweis.",
      },
      {
        question: "Wird die Umsatzsteuer gefördert?",
        answer: "Nein. Förderung bezieht sich immer auf den Netto-Rechnungsbetrag. Die Vorsteuer ist Ihr durchlaufender Posten.",
      },
      {
        question: "Kann ich mehrere Projekte gleichzeitig fördern lassen?",
        answer: "Ja, sofern die Förderhöchstgrenzen (Deckel) pro Förderperiode nicht überschritten werden. Die Eskalator AG behält Ihr Kontingent im Auge.",
      },
      {
        question: "Gilt die Förderung auch für Pachtflächen?",
        answer: "Ja, solange die Pachtdauer die Zweckbindungsfrist (meist 12 Jahre) abdeckt. Wir prüfen Ihre Verträge auf Förderkonformität.",
      },
      {
        question: "Muss mein Betriebssitz in Deutschland liegen?",
        answer: "Ja, und die Investition muss in der Regel im jeweiligen Bundesland (z. B. NRW oder Sachsen) getätigt werden.",
      },
      {
        question: "Was ist der Unterschied zwischen 1. und 2. Säule?",
        answer: "Die 1. Säule sind Direktzahlungen pro Hektar; die 2. Säule (unser Fokus bei der Eskalator AG) sind gezielte Projektzuschüsse für Investitionen und Umwelt.",
      },
      {
        question: "Was bedeutet 'GAK-Rahmenplan'?",
        answer: "Dies ist das Fundament der deutschen Agrarförderung. Wir nutzen diesen Rahmen, um das Maximum für Ihren Betrieb zu extrahieren.",
      },
      {
        question: "Ist eine bestehende Verschuldung ein Ausschlusskriterium?",
        answer: "Nicht zwingend, aber die Kapitaldienstgrenze muss gewahrt bleiben. Die Eskalator AG analysiert Ihre Bilanz für die Bankbestätigung.",
      },
      {
        question: "Wie aktuell sind die Daten der Eskalator AG?",
        answer: "Wir arbeiten tagesaktuell nach den Richtlinien von 2026.",
      },
      {
        question: "Was ist ein Wirtschaftlichkeitsnachweis?",
        answer: "Ein detaillierter Plan, der zeigt, dass Ihre Investition den Betrieb stärkt. Wir erstellen dieses Dokument professionell für Sie.",
      },
      {
        question: "Wird Eigenleistung als Eigenkapital anerkannt?",
        answer: "Meist nicht. Die Förderung bezieht sich auf bezahlte Rechnungen. Wir optimieren stattdessen Ihre Cash-Quote.",
      },
      {
        question: "Sind Stiftungen förderfähig?",
        answer: "Unter speziellen Bedingungen ja, wenn sie landwirtschaftlich tätig sind.",
      },
      {
        question: "Gilt das Regionalprinzip?",
        answer: "Ja, einige Töpfe sind nur für benachteiligte Gebiete. Wir finden diese Nischen gezielt für Sie.",
      },
      {
        question: "Was ist die 'Angemessenheit der Kosten'?",
        answer: "Der Staat will Marktpreise sehen. Wir helfen bei der Einholung der drei notwendigen Vergleichsangebote.",
      },
      {
        question: "Brauche ich ein separates Bankkonto?",
        answer: "Nein, aber alle Zahlungen müssen unbar und lückenlos nachweisbar sein.",
      },
    ],
  },
  {
    id: "stallbau",
    label: "Stallbau, Tierwohl & Anlage 1",
    shortLabel: "Stallbau & Tierwohl",
    icon: Sprout,
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    range: "21 – 40",
    faqs: [
      {
        question: "Was ist die 'Anlage 1' im AFP?",
        answer: "Das sind die strengen Vorgaben für besonders tiergerechte Haltung. Wer hier mit der Eskalator AG plant, sichert sich bis zu 40 % Zuschuss.",
      },
      {
        question: "Werden Melkroboter gefördert?",
        answer: "Ja, sofern sie die Arbeitsbedingungen verbessern oder in ein Tierwohl-Gesamtkonzept eingebettet sind.",
      },
      {
        question: "Ist Außenklimakontakt Pflicht?",
        answer: "Für die Höchstförderung im Rinder- und Schweinebereich meist ja. Wir planen den Auslauf rechtssicher mit ein.",
      },
      {
        question: "Wird die Sanierung alter Ställe bezahlt?",
        answer: "Ja, oft sogar lieber als Neubauten, um Flächenversiegelung zu vermeiden.",
      },
      {
        question: "Wie viel Platz braucht eine Kuh für die Förderung?",
        answer: "Meist deutlich mehr als der gesetzliche Standard. Wir kennen die exakten m²-Vorgaben pro Tier.",
      },
      {
        question: "Sind Güllegruben-Abdeckungen förderfähig?",
        answer: "Ja, sie sind sogar Pflicht für neue Lagerkapazitäten, um Emissionen zu senken.",
      },
      {
        question: "Wird die Belegung von Dächern mit PV gefördert?",
        answer: "Über das AFP nicht direkt, aber wir nutzen Kombi-Programme für Energieeffizienz.",
      },
      {
        question: "Was ist mit Kälber-Iglus?",
        answer: "Einzel-Iglus sind out; gefördert werden Gruppenhaltung und innovative Belüftungssysteme.",
      },
      {
        question: "Sind Spaltenböden noch erlaubt?",
        answer: "Nur mit Gummiauflage oder als Teil eines emissionsarmen Festmist-Systems.",
      },
      {
        question: "Wie lange ist die Zweckbindung bei Ställen?",
        answer: "In der Regel 12 Jahre. Die Eskalator AG begleitet Sie über diesen gesamten Zeitraum.",
      },
      {
        question: "Was passiert bei Tierbestand-Reduzierung?",
        answer: "Das kann die Förderung gefährden. Wir erstellen Konzepte, die Ihren Bestand flexibel halten.",
      },
      {
        question: "Werden automatische Einstreusysteme gefördert?",
        answer: "Ja, sie gelten als arbeitswirtschaftliche Erleichterung und Tierwohl-Plus.",
      },
      {
        question: "Gibt es Geld für Scheuerbürsten und Spielmaterial?",
        answer: "Als Teil einer Gesamteinrichtung ja, meist jedoch nicht als Einzelmaßnahme.",
      },
      {
        question: "Wird der Umbau zur muttergebundenen Kälberaufzucht gefördert?",
        answer: "Ja, dies ist ein Fokus der aktuellen Tierwohl-Milliarde.",
      },
      {
        question: "Sind Schlachthof-Beteiligungen förderfähig?",
        answer: "Nein, nur Investitionen auf dem eigenen Betriebsgelände.",
      },
      {
        question: "Wird Heutrocknung kofinanziert?",
        answer: "Ja, wenn sie die Futterqualität bei extensiver Haltung massiv steigert.",
      },
      {
        question: "Was ist mit Silo-Platten?",
        answer: "Nur unter strengen Auflagen zum Gewässerschutz (JGS-Anlagen).",
      },
      {
        question: "Werden mobile Hühnerställe gefördert?",
        answer: "Ja, oft mit sehr hohen Sätzen, da sie als besonders tiergerecht gelten.",
      },
      {
        question: "Ist ein Brandschutzgutachten förderfähig?",
        answer: "Als Teil der Baunebenkosten ja (bis zu einer gewissen Deckelung).",
      },
      {
        question: "Kann ich den Stall später erweitern?",
        answer: "Ja, aber jeder Bauabschnitt braucht einen neuen Antrag. Die Eskalator AG plant Ihre Phasen voraus.",
      },
    ],
  },
  {
    id: "technik",
    label: "Technik, Umwelt & Digitalisierung",
    shortLabel: "Technik & Digital",
    icon: Tractor,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    range: "41 – 60",
    faqs: [
      {
        question: "Wird ein Standardschlepper gefördert?",
        answer: "Nein. Nur Spezialschlepper oder E-Modelle. Wir suchen für Sie die Ausnahmen.",
      },
      {
        question: "Was ist mit Pflanzenschutzspritzen?",
        answer: "Nur bei 90 % Abdriftminderung oder modernster Einzeldüsenschaltung (Spot-Spraying).",
      },
      {
        question: "Wird Hacktechnik gefördert?",
        answer: "Ja, mechanische Beikrautregulierung ist ein Kernziel der aktuellen Umweltpolitik.",
      },
      {
        question: "Sind GPS-Lenksysteme förderfähig?",
        answer: "Ja, als Beitrag zur Präzisionslandwirtschaft und Ressourceneffizienz.",
      },
      {
        question: "Werden Drohnen zur Rehkitzrettung bezahlt?",
        answer: "Ja, über das BMEL-Sonderprogramm. Wir haben hier 100 % Erfolgsquote.",
      },
      {
        question: "Gibt es Geld für Gülle-Injektoren?",
        answer: "Ja, bodennahe Ausbringung ist ein 'Muss' für Förderung im Pflanzenbau.",
      },
      {
        question: "Was ist mit NIRS-Sensoren auf dem Güllefass?",
        answer: "Ja, diese Hochtechnologie wird zur Nährstoffoptimierung stark bezuschusst.",
      },
      {
        question: "Wird Bewässerungstechnik gefördert?",
        answer: "Nur bei nachgewiesener Wassereinsparung von mindestens 20 %. Wir rechnen das vor.",
      },
      {
        question: "Sind Wetterstationen für den Acker förderfähig?",
        answer: "Ja, im Paket 'Digitales Management'.",
      },
      {
        question: "Werden Reifen-Druckregelanlagen gefördert?",
        answer: "Ja, zum Schutz des Bodens vor Verdichtung.",
      },
      {
        question: "Was ist mit Smart-Farming-Software?",
        answer: "Ja, Lizenzgebühren und Einrichtung sind oft Teil von Digitalzuschüssen.",
      },
      {
        question: "Wird die Werkstatteinrichtung gefördert?",
        answer: "Definitiv nein.",
      },
      {
        question: "Gibt es Geld für E-Hoflader?",
        answer: "Ja, aufgrund der Emissionsminderung im Stallbereich.",
      },
      {
        question: "Werden Futter-Anschieberoboter gefördert?",
        answer: "Ja, als arbeitswirtschaftliche Maßnahme.",
      },
      {
        question: "Was ist mit Forsttechnik?",
        answer: "Nur über spezielle GAK-Mittel für den Waldumbau. Wir beraten auch hier.",
      },
      {
        question: "Wird die Reinigung von Getreide gefördert?",
        answer: "Ja, wenn es der Vermarktung dient.",
      },
      {
        question: "Sind Smart-Home-Lösungen für Ställe förderfähig?",
        answer: "Ja, unter dem Aspekt der Tierüberwachung und des Energiemanagements.",
      },
      {
        question: "Wird Stickstoff-Sensorik gefördert?",
        answer: "Ja, zur bedarfsgerechten Düngung (Precision Farming).",
      },
      {
        question: "Gibt es Geld für autonome Feldroboter?",
        answer: "Ja, diese werden als Innovationsprojekte oft mit Höchstsätzen gefördert.",
      },
      {
        question: "Wird die Umstellung auf LED-Licht bezahlt?",
        answer: "Ja, wenn die Energieersparnis signifikant ist (Energieaudit erforderlich).",
      },
    ],
  },
  {
    id: "finanzen",
    label: "Finanzen, Recht & Risiko",
    shortLabel: "Finanzen & Recht",
    icon: Euro,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    range: "61 – 80",
    faqs: [
      {
        question: "Darf ich vor dem Bescheid unterschreiben?",
        answer: "NEIN. Das ist der 'Förder-Tod'. Die Eskalator AG gibt das Signal zum Kauf erst nach dem 'Go' der Behörde.",
      },
      {
        question: "Was ist ein vorzeitiger Vorhabensbeginn?",
        answer: "Eine Genehmigung, auf eigenes Risiko früher zu starten. Wir beantragen das für Sie.",
      },
      {
        question: "Wie lange dauert die Bearbeitung?",
        answer: "Rechnen Sie mit 4 bis 8 Monaten. Wir beschleunigen durch lückenlose Anträge.",
      },
      {
        question: "Wann wird der Zuschuss ausgezahlt?",
        answer: "Nach Abschluss der Investition und Prüfung des Verwendungsnachweises.",
      },
      {
        question: "Sind Abschlagszahlungen möglich?",
        answer: "In großen Bauprojekten ja, nach Erreichen definierter Meilensteine.",
      },
      {
        question: "Muss ich den Zuschuss versteuern?",
        answer: "Ja, er erhöht den steuerpflichtigen Gewinn. Ihr Steuerberater sollte das einplanen.",
      },
      {
        question: "Was passiert bei einer Betriebsprüfung?",
        answer: "Die Eskalator AG bereitet Ihre Akten so vor, dass jede Prüfung (EU/Land) problemlos verläuft.",
      },
      {
        question: "Wie hoch muss das Eigenkapital sein?",
        answer: "Die Bank muss die Gesamtfinanzierung bestätigen. Wir helfen beim Bankgespräch.",
      },
      {
        question: "Was ist die 'Behaltefrist'?",
        answer: "Meist 5 Jahre für Technik und 12 Jahre für Gebäude. In dieser Zeit darf nichts verkauft werden.",
      },
      {
        question: "Kann die Förderung zurückgefordert werden?",
        answer: "Nur bei schweren Verstößen gegen Auflagen. Unser Monitoring verhindert das.",
      },
      {
        question: "Muss ich drei Angebote einholen?",
        answer: "Ja, für jede Position über 5.000 € (je nach Bundesland).",
      },
      {
        question: "Gilt das Billigstbieter-Prinzip?",
        answer: "Nicht zwingend. Wir begründen für Sie, warum Qualität manchmal mehr kostet.",
      },
      {
        question: "Was ist mit Leasing?",
        answer: "Leasing ist meist nicht förderfähig, da Sie nicht Eigentümer werden. Mietkauf ist oft möglich.",
      },
      {
        question: "Zählt Barzahlung?",
        answer: "NEIN. Nur Überweisungen vom Firmenkonto werden anerkannt.",
      },
      {
        question: "Sind Architektenkosten förderfähig?",
        answer: "Ja, bis zu einem Deckel von meist 7–10 % der Bausumme.",
      },
      {
        question: "Wird die Beratung der Eskalator AG gefördert?",
        answer: "Ja, viele Bundesländer bieten Beratungsschecks (bis zu 80 %) an.",
      },
      {
        question: "Was ist De-Minimis?",
        answer: "Ein Deckel für Kleinförderungen (300.000 € in 3 Jahren). Wir prüfen Ihr Limit.",
      },
      {
        question: "Sind Skonti abzuziehen?",
        answer: "Ja, die Förderung berechnet sich vom tatsächlich gezahlten Netto-Betrag.",
      },
      {
        question: "Was ist ein Verwendungsnachweis?",
        answer: "Die finale Abrechnung. Die Eskalator AG erstellt dieses komplexe Dokument für Sie.",
      },
      {
        question: "Muss ich ein Bauschild aufstellen?",
        answer: "Ja, die EU-Publizitätspflicht ist ernst zu nehmen. Wir sagen Ihnen, was drauf muss.",
      },
    ],
  },
  {
    id: "diversifizierung",
    label: "Diversifizierung, Erbe & Strategie",
    shortLabel: "Diversifizierung",
    icon: Gavel,
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    range: "81 – 100",
    faqs: [
      {
        question: "Wird ein Hofladen gefördert?",
        answer: "Ja, über das Programm 'Verarbeitung und Vermarktung' oder die ländliche Entwicklung.",
      },
      {
        question: "Gibt es Geld für Verkaufsautomaten?",
        answer: "Ja, sie sind ein Trend in der Direktvermarktung und hochgradig förderfähig.",
      },
      {
        question: "Wird 'Urlaub auf dem Bauernhof' unterstützt?",
        answer: "Ja, die Umnutzung alter Gebäude zu Ferienwohnungen wird oft massiv bezuschusst.",
      },
      {
        question: "Was ist mit Bauernhof-Kitas?",
        answer: "Soziale Landwirtschaft ist ein Förderschwerpunkt für 2026.",
      },
      {
        question: "Wird eine eigene Hofkäserei gefördert?",
        answer: "Ja, als Teil der Wertschöpfungskette auf dem Betrieb.",
      },
      {
        question: "Gibt es Geld für professionelles Marketing?",
        answer: "Im Rahmen von Diversifizierungsprojekten sind Logos, Websites und Branding oft förderfähig.",
      },
      {
        question: "Wird die Umstellung auf Bio-Landbau belohnt?",
        answer: "Ja, durch jährliche Umstellungs- und Beibehaltungsprämien pro Hektar.",
      },
      {
        question: "Gibt es Förderung für Agroforst-Systeme?",
        answer: "Ja, eine sehr spannende neue Nische für den Klimaschutz.",
      },
      {
        question: "Was ist mit der Hofnachfolge-Beratung?",
        answer: "Wir bieten Mediation und Konzepte an, die oft über Beratungsgutscheine kofinanziert werden.",
      },
      {
        question: "Wird Weinbau-Technik gefördert?",
        answer: "Ja, über spezifische Weinbau-Investitionsprogramme.",
      },
      {
        question: "Gibt es Geld für den Gartenbau (Gewächshäuser)?",
        answer: "Ja, insbesondere für Energieeffizienz und moderne Bewässerung.",
      },
      {
        question: "Werden regenerative Energien für den Eigenbedarf gefördert?",
        answer: "Ja, kleine Biogasanlagen (Güllebündelung) sind im Fokus.",
      },
      {
        question: "Was ist, wenn ich den Betriebszweig wechsle?",
        answer: "Die Eskalator AG prüft, ob alte Förderungen dadurch gefährdet werden.",
      },
      {
        question: "Wird die Teichwirtschaft gefördert?",
        answer: "Ja, über den EMFAF-Fonds (Fischereiförderung).",
      },
      {
        question: "Was ist mit Blühstreifen?",
        answer: "Das sind jährliche Prämien (AUKM), keine einmaligen Investitionszuschüsse.",
      },
      {
        question: "Wird die Digitalisierung der Verwaltung gefördert?",
        answer: "Ja, oft über regionale 'Digital-Boni'.",
      },
      {
        question: "Kann ich gebrauchte Komponenten einbauen?",
        answer: "Nein, für Förderung muss alles fabrikneu sein.",
      },
      {
        question: "Wie sicher ist die Zusage?",
        answer: "Es gibt keinen Rechtsanspruch. Aber mit der Eskalator AG liegt Ihre Erfolgschance bei nahezu 100 %.",
      },
      {
        question: "Was kostet die Beratung der Eskalator AG?",
        answer: "Wir arbeiten transparent. Oft amortisiert sich unser Honorar bereits durch die erste Förderrate.",
      },
      {
        question: "Warum sollte ich jetzt starten?",
        answer: "Weil die Töpfe für 2026 gefüllt sind und die Planungsphase für Großprojekte jetzt beginnen muss. Wer wartet, verliert.",
      },
    ],
  },
]

interface FAQAccordionItemProps {
  question: string
  answer: string
  globalIndex: number
  isOpen: boolean
  onToggle: () => void
}

function FAQAccordionItem({ question, answer, globalIndex, isOpen, onToggle }: FAQAccordionItemProps) {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full px-5 sm:px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors text-left group"
      >
        <span className="font-mono text-[11px] font-bold text-slate-300 mt-1 w-6 flex-shrink-0 group-hover:text-slate-400 transition-colors">
          {String(globalIndex).padStart(2, '0')}
        </span>
        <span className="flex-1 text-sm sm:text-base font-medium text-slate-900 leading-snug text-pretty">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-0.5"
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-14 sm:pl-16 pr-5 sm:pr-6 pb-4 sm:pb-5 text-sm text-slate-600 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQMegaSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].id)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const currentCategory = faqCategories.find(c => c.id === activeCategory)!

  // compute the global start index for this category's questions
  const categoryStartIndex = faqCategories
    .slice(0, faqCategories.findIndex(c => c.id === activeCategory))
    .reduce((acc, c) => acc + c.faqs.length, 0) + 1

  return (
    <>
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="page-container px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-10 sm:mb-14"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              100 Expertenfragen beantwortet
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 text-balance">
              Alles, was Landwirte zur Agrarförderung 2026 wissen müssen
            </h2>
            <p className="text-base sm:text-lg text-slate-500">
              100 % faktenbasiert nach den offiziellen Länder-Richtlinien. Kein Marketing, nur Klartext.
            </p>
          </motion.div>

          {/* Layout: Sidebar + Content */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

            {/* Sidebar — category tabs */}
            <div className="w-full lg:w-64 xl:w-72 flex-shrink-0">
              {/* Mobile: horizontal scroll */}
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                {faqCategories.map((cat) => {
                  const Icon = cat.icon
                  const isActive = activeCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id)
                        setOpenItems({})
                      }}
                      className={`flex-shrink-0 lg:flex-shrink w-auto lg:w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left transition-all ${
                        isActive
                          ? `${cat.bgColor} ${cat.color} font-semibold shadow-sm border ${cat.borderColor}`
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-medium'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm truncate">{cat.shortLabel}</div>
                        <div className="text-[10px] text-slate-400 font-normal">Fragen {cat.range}</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Total counter */}
              <div className="hidden lg:flex mt-6 items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">100</div>
                <div className="text-xs text-slate-500 leading-tight">Fragen &<br />Antworten gesamt</div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Category header */}
              <div className={`flex items-center gap-3 px-5 sm:px-6 py-4 rounded-t-2xl ${currentCategory.bgColor} border ${currentCategory.borderColor}`}>
                <div className={`w-9 h-9 rounded-lg bg-white/70 flex items-center justify-center ${currentCategory.color} flex-shrink-0`}>
                  <currentCategory.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className={`font-bold text-sm sm:text-base ${currentCategory.color}`}>{currentCategory.label}</div>
                  <div className="text-xs text-slate-500">Fragen {currentCategory.range} · {currentCategory.faqs.length} Antworten</div>
                </div>
              </div>

              {/* FAQ accordion */}
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white border-x border-b border-slate-200 rounded-b-2xl overflow-hidden shadow-sm"
              >
                {currentCategory.faqs.map((faq, i) => {
                  const key = `${activeCategory}-${i}`
                  return (
                    <FAQAccordionItem
                      key={key}
                      question={faq.question}
                      answer={faq.answer}
                      globalIndex={categoryStartIndex + i}
                      isOpen={!!openItems[key]}
                      onToggle={() => toggleItem(key)}
                    />
                  )
                })}
              </motion.div>
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 bg-slate-50 rounded-2xl border border-slate-200"
          >
            <div>
              <p className="font-semibold text-slate-900 text-sm sm:text-base">Ihre Frage ist nicht dabei?</p>
              <p className="text-sm text-slate-500">Ich beantworte sie persönlich — kostenlos und unverbindlich.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-shrink-0 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              Kostenlose Beratung buchen
            </button>
          </motion.div>

        </div>
      </section>
    </>
  )
}
