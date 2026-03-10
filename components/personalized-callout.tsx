"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useCompany } from "@/contexts/company-context"
import { Sparkles, ArrowRight, Building2, MapPin, TrendingUp, Lightbulb } from "lucide-react"

// Clean up AI-generated text: remove brackets, trim, ensure proper ending
function cleanText(text: string | undefined | null, maxLength?: number): string {
  if (!text) return ""
  let cleaned = text
    // Remove square brackets and their placeholder content
    .replace(/\[([^\]]+)\]/g, "$1")
    // Remove curly braces placeholders
    .replace(/\{([^}]+)\}/g, "$1")
    // Remove double quotes around phrases
    .replace(/^["']|["']$/g, "")
    // Clean multiple spaces
    .replace(/\s+/g, " ")
    // Remove trailing incomplete sentences (ending with common cut-off patterns)
    .replace(/\s+(und|oder|sowie|mit|für|bei|zu|in|an|auf|über|unter|durch|nach|vor|bis|gegen|ohne|um|aus)\s*$/i, "")
    .trim()
  
  // Apply max length with smart truncation at sentence/word boundary
  if (maxLength && cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength)
    // Find last complete sentence or phrase
    const lastPeriod = cleaned.lastIndexOf(".")
    const lastComma = cleaned.lastIndexOf(",")
    const lastSpace = cleaned.lastIndexOf(" ")
    
    if (lastPeriod > maxLength * 0.6) {
      cleaned = cleaned.substring(0, lastPeriod + 1)
    } else if (lastComma > maxLength * 0.7) {
      cleaned = cleaned.substring(0, lastComma)
    } else if (lastSpace > maxLength * 0.8) {
      cleaned = cleaned.substring(0, lastSpace) + "..."
    } else {
      cleaned += "..."
    }
  }
  
  return cleaned
}

type CalloutVariant = 
  | "whats-new" 
  | "strategic-paths" 
  | "assets" 
  | "regions" 
  | "eligibility" 
  | "process"
  | "calculator"
  | "faq"

interface PersonalizedCalloutProps {
  variant: CalloutVariant
  className?: string
}

export function PersonalizedCallout({ variant, className = "" }: PersonalizedCalloutProps) {
  const { company, analysis } = useCompany()
  
  // Only show if we have company data
  if (!company || !analysis) return null
  
  const ownerFirstName = analysis.owner?.firstName || "Sie"
  const companyName = company.name
  const industry = cleanText(analysis.companyProfile?.industry || company.industry)
  const city = company.city
  const foerdergebiet = analysis.fundingPotential?.foerdergebiet || "Fördergebiet"
  const maxQuote = analysis.fundingPotential?.maxQuote || 40
  const regionalBonus = analysis.fundingPotential?.regionalBonus || 0
  const mainActivity = cleanText(analysis.companyProfile?.mainActivity, 120)
  const investmentIdeas = analysis.investmentIdeas || []
  
  // Generate personalized content based on variant
  const getContent = () => {
    switch (variant) {
      case "whats-new":
        return {
          icon: Sparkles,
          title: `${ownerFirstName}, das bedeutet für ${companyName}:`,
          content: analysis.fundingPotential?.foerdergebietCode === "N"
            ? `Dieses Programm passt nicht zu Ihrem Standort ${city} – aber es gibt attraktive Alternativen! Wir zeigen ${companyName} in einem kurzen Gespräch, welche Förderprogramme genau zu Ihnen passen und oft sogar höhere Quoten bieten.`
            : regionalBonus > 0 
              ? `Als ${industry}-Unternehmen in ${city} (${foerdergebiet}) profitieren Sie von ${regionalBonus}% Regionalbonus. Mit dem neuen Klimabonus erreichen Sie bis zu ${maxQuote}% Förderquote.`
              : `Als ${industry}-Unternehmen profitieren Sie von den erhöhten Basisquoten. Mit Klimaschutz-Investitionen erreichen Sie bis zu ${maxQuote}% Förderquote.`,
          highlight: `Ihre maximale Förderquote: ${maxQuote}%`,
          color: "purple"
        }
        
      case "strategic-paths":
        const recommendedPath = (mainActivity || "").toLowerCase().includes("produktion") || 
                               (mainActivity || "").toLowerCase().includes("fertigung") ||
                               (industry || "").toLowerCase().includes("maschinenbau")
          ? "productivity"
          : "jobs"
        return {
          icon: TrendingUp,
          title: `Empfehlung für ${companyName}:`,
          content: recommendedPath === "productivity"
            ? `Für ${industry}-Unternehmen wie Ihres empfehlen wir den Produktivitätspfad. Sie können Automatisierung und Digitalisierung fördern lassen, ohne neue Arbeitsplätze schaffen zu müssen.`
            : `Bei geplanter Expansion empfehlen wir den Arbeitsplatzpfad. Kombinieren Sie Kapazitätserweiterung mit Förderung und sichern Sie sich maximale Zuschüsse.`,
          highlight: recommendedPath === "productivity" 
            ? "Empfohlen: Produktivitätspfad" 
            : "Empfohlen: Arbeitsplatzpfad",
          color: recommendedPath === "productivity" ? "violet" : "purple"
        }
        
      case "assets":
        const topInvestment = investmentIdeas[0]
        const cleanedTitle = cleanText(topInvestment?.title, 80)
        const cleanedDescription = cleanText(topInvestment?.description, 150)
        const cleanedFunding = cleanText(topInvestment?.potentialFunding)
        return {
          icon: Building2,
          title: `Konkret für ${companyName}:`,
          content: topInvestment 
            ? `Basierend auf Ihrer Branche ${cleanText(industry)} wäre z.B. ein ${cleanedTitle} förderfähig. ${cleanedDescription}`
            : `Als ${cleanText(industry)}-Unternehmen können Sie Produktionsmaschinen, Anlagen, IT-Systeme und Energietechnik fördern lassen.`,
          highlight: topInvestment 
            ? `Beispiel-Förderung: ${cleanedFunding}` 
            : `Förderquote: bis zu ${maxQuote}%`,
          color: "violet"
        }
        
      case "regions":
        const foerdergebietCode = analysis.fundingPotential?.foerdergebietCode || ""
        return {
          icon: MapPin,
          title: `Ihr Standortvorteil in ${city}:`,
          content: foerdergebietCode === "C+"
            ? `${city} liegt im C+-Fördergebiet mit Grenzzuschlag. Das bedeutet für ${companyName}: +10 Prozentpunkte auf den C-Gebietssatz! KU erhalten bis zu 45% regionale Förderung.`
            : foerdergebiet.includes("C-Fördergebiet")
            ? `${city} liegt im C-Fördergebiet mit erhöhten Basisquoten. Das bedeutet für ${companyName}: höhere Förderquoten als in D-Gebieten.`
            : foerdergebiet === "D-Fördergebiet"
            ? `${city} liegt im D-Fördergebiet. Mit dem De-minimis-Aufschlag (+20%) erreichen Sie als ${industry}-Unternehmen bis zu ${maxQuote}% Förderung.`
            : `Für ${city} gibt es andere Förderprogramme, die häufig sogar attraktivere Konditionen bieten. Lassen Sie uns gemeinsam die besten Optionen für ${companyName} finden!`,
          highlight: foerdergebietCode === "C+" ? `C+-Grenzzuschlag: +10 PP` 
            : foerdergebietCode === "N" ? `Alternative Programme mit starken Konditionen` 
            : `Ihr Regionalbonus: +${regionalBonus}%`,
          color: foerdergebietCode === "C+" ? "violet" : foerdergebietCode === "C" ? "violet" : foerdergebietCode === "D" ? "blue" : "teal"
        }
        
      case "eligibility":
        return {
          icon: Lightbulb,
          title: `${ownerFirstName}, Ihre Förderfähigkeit:`,
          content: `${companyName} als ${industry}-Unternehmen erfüllt die Grundvoraussetzungen für die Regional-Förderung. ${mainActivity ? `Mit Ihrer Tätigkeit im Bereich ${mainActivity} gehören Sie zur Zielgruppe des Programms.` : ""}`,
          highlight: "Status: Grundsätzlich förderfähig",
          color: "purple"
        }
        
      case "process":
        return {
          icon: ArrowRight,
          title: `So geht es für ${companyName} weiter:`,
          content: `Nach der kostenlosen Erstberatung prüfen wir Ihr konkretes Vorhaben und bereiten den Antrag vor. Bei ${industry}-Projekten in ${city} rechnen wir aktuell mit 8-12 Wochen bis zur Bewilligung.`,
          highlight: "Nächster Schritt: Kostenlose Erstberatung",
          color: "purple"
        }
        
      case "calculator":
        const exampleInvestment = 250000
        const funding = Math.round(exampleInvestment * maxQuote / 100)
        return {
          icon: TrendingUp,
          title: `Rechenbeispiel für ${companyName}:`,
          content: `Bei einer Investition von ${exampleInvestment.toLocaleString("de-DE")} EUR in ${city} (${foerdergebiet}) erhalten Sie mit ${maxQuote}% Förderquote einen Zuschuss von ${funding.toLocaleString("de-DE")} EUR.`,
          highlight: `${funding.toLocaleString("de-DE")} EUR Zuschuss möglich`,
          color: "violet"
        }
        
      case "faq":
        return {
          icon: Lightbulb,
          title: `Häufige Fragen für ${industry}:`,
          content: `Viele ${industry}-Unternehmen fragen uns: "Können wir auch ohne neue Mitarbeiter gefördert werden?" Ja! Der neue Produktivitätspfad macht das für ${companyName} möglich.`,
          highlight: "Antwort: Ja, Förderung ohne neue Jobs möglich",
          color: "violet"
        }
        
      default:
        return null
    }
  }
  
  const content = getContent()
  if (!content) return null
  
  const colorClasses = {
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "bg-purple-100 text-purple-600",
      title: "text-purple-900",
      text: "text-purple-800",
      highlight: "bg-purple-600 text-white"
    },
    violet: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      icon: "bg-violet-100 text-violet-600",
      title: "text-violet-900",
      text: "text-violet-800",
      highlight: "bg-violet-600 text-white"
    },
    violet: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      icon: "bg-violet-100 text-violet-600",
      title: "text-violet-900",
      text: "text-violet-800",
      highlight: "bg-violet-600 text-white"
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "bg-blue-100 text-blue-600",
      title: "text-blue-900",
      text: "text-blue-800",
      highlight: "bg-blue-600 text-white"
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-200",
      icon: "bg-teal-100 text-teal-600",
      title: "text-teal-900",
      text: "text-teal-800",
      highlight: "bg-teal-600 text-white"
    },
    slate: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      icon: "bg-slate-100 text-slate-600",
      title: "text-slate-900",
      text: "text-slate-700",
      highlight: "bg-slate-600 text-white"
    }
  }
  
  const colors = colorClasses[content.color as keyof typeof colorClasses] || colorClasses.purple
  const Icon = content.icon
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`${colors.bg} ${colors.border} border rounded-2xl p-6 ${className}`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl ${colors.icon} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">
                Personalisiert für Sie
              </span>
            </div>
            <h4 className={`font-bold ${colors.title} mb-2`}>
              {content.title}
            </h4>
            <p className={`text-sm ${colors.text} leading-relaxed mb-3`}>
              {content.content}
            </p>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${colors.highlight}`}>
              {content.highlight}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
