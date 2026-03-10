"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Award, FileCheck, Building2, Phone, Linkedin, Sparkles } from "lucide-react"
import Image from "next/image"
import { useCompany } from "@/contexts/company-context"

// ============================================
// TEMPLATE ANLEITUNG: EXPERT / AUTHORITY SECTION
// ============================================
// SALES-FUNNEL STAGE: Trust Building & Authority Establishment
// ZWECK: "Wer hilft mir?" → Persönliche Vertrauensperson zeigen
// VERKAUFSLOGIK: Face + Credentials + Personal Story → Psychologische Sicherheit
// KONVERSIONSROUTE: ✓ "Diese Person kann ich trauen" → Lead Capture / Kontakt
// ============================================
//
// WAS REIN MUSS:
// 1. EXPERT/SPEZIALIST PROFIL
//    - Professionelles Foto (wichtig!)
//    - Vollständiger Name
//    - Titel/Spezialität (Was ist der Expertise?)
//    - Kurze Intro (1-2 Sätze, nicht langweilig)
//    - Kontakt-Links (LinkedIn, Phone, Email)
//
// 2. CREDENTIALS (Social Proof)
//    - 3-4 konkrete Qualifikationen/Zertifikate
//    - Anzahl Projekte / Erfolgsquote
//    - "Über XYZ bewilligte Förderung"
//    - Anerkannte Zertifizierungen (IHK, etc.)
//
// 3. PERSONALISIERTE QUOTE/ANSPRACHE
//    - Industry-specific Pain Points
//    - Was ist die aktuelle Herausforderung?
//    - Warum JETZT der richtige Zeitpunkt?
//    - Persönliche Aussage (nicht generic)
//    - Specializations die hervorgehoben werden
//
// VERKAUFS-TIPP:
// - Foto ist KRITISCH - professionell, vertrauenswürdig, nicht zu formal
// - Credentials sollten konkrete Zahlen haben (nicht "erfahren", sondern "200+ Projekte")
// - Quote sollte INDUSTRY-SPEZIFISCH sein wenn möglich (holt Besucher dort ab wo sie sind)
// - Stats = Social Proof (Erfolgsquote, Millionen EUR bewilligt, Projekte)

// Template für Industry-spezifische Pain Points
const industryHooks: Record<string, { pain: string; hook: string }> = {
  "default": {
    pain: "Die Baukosten sind explodiert. Die Vorschriften werden immer verrückter. Und ohne den richtigen Zuschuss rechnet sich das alles nicht mehr.",
    hook: "Genau deshalb bin ich hier: Ich hole dir das Maximum aus der Förderung für die Landwirtschaft – Tierwohl-Premium, SIUK-Bonus, Junglandwirt-Zuschlag. Du unterschreibst einmal, ich erledige den Rest."
  },
  "milch": {
    pain: "Milchvieh-Betriebe stehen 2026 unter Doppeldruck: neue Haltungsauflagen UND explodierende Stallbaukosten. Ohne Förderung für die Landwirtschaft rechnet sich der Umbau für die meisten nicht.",
    hook: "Ich kenne die Milchvieh-spezifischen Förderpfade in jedem Bundesland – und hole dir den maximalen Tierwohl-Satz bevor die Antragsfenster 2026 schließen."
  },
  "schwein": {
    pain: "Schweinehaltung 2026: Neue Tierwohlauflagen, enge Zeitfenster, und viele Bundesländer haben die Förderung zwischenzeitlich ausgesetzt. Ohne Experten-Begleitung riskierst du eine teure Fehlentscheidung.",
    hook: "Ich weiß genau, wo Schweinehaltung 2026 wieder förderfähig ist (z.B. Baden-Württemberg ab Sept. 2026) – und wie du das Maximum aus der Förderung für die Landwirtschaft holst."
  },
}

function getIndustryHook(industry: string | undefined): { pain: string; hook: string } {
  if (!industry) return industryHooks.default
  
  const industryLower = industry.toLowerCase()
  
  for (const [key, value] of Object.entries(industryHooks)) {
    if (industryLower.includes(key)) {
      return value
    }
  }
  
  return industryHooks.default
}

export default function ExpertSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
  const { company, analysis } = useCompany()
  
  // Extract personalization data
  const ownerName = analysis?.owner?.name
  const ownerFirstName = analysis?.owner?.firstName
  const companyName = company?.name
  const industry = analysis?.companyProfile?.industry || company?.industry
  const isPersonalized = !!company && !!analysis
  
  // Get industry-specific content
  const industryContent = getIndustryHook(industry)
  
  // Build personalized salutation
  const salutation = ownerName 
    ? (ownerName.toLowerCase().includes("frau") ? `Frau ${ownerName.split(" ").pop()}` : `Herr ${ownerName.split(" ").pop()}`)
    : null

  return (
    <section ref={ref} id="experte" className="py-24 md:py-32 bg-white">
      <div className="page-container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-green-700 mb-4">
            Ihr Spezialist für Förderung in der Landwirtschaft
          </span>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Ich bin der Förder-Typ, der Landwirten wie dir jedes Jahr Millionen extra holt
          </h2>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ich verdiene erst, wenn du Geld bekommst. Deshalb arbeite ich nur mit Fällen, die ich auch wirklich gewinne.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200"
        >
          <div className="grid lg:grid-cols-12 gap-0">
            {/* Left: Expert Photo */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-100 to-slate-200 p-8 lg:p-12 flex flex-col items-center justify-center text-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6 shadow-xl shadow-slate-400/30 ring-4 ring-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/patrick-starkmann.webp"
                  alt="Patrick Starkmann – Spezialist für Förderung in der Landwirtschaft"
                  width={160}
                  height={160}
                  className="object-cover object-top w-full h-full"
                />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-1">Patrick Starkmann</h3>
              <p className="text-green-700 font-semibold mb-4">Spezialist für Förderung in der Landwirtschaft</p>

              {/* Contact Links */}
              <div className="flex gap-3 mb-6">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-green-400 hover:bg-green-50 transition-colors"
                  aria-label="Patrick Starkmann auf LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-slate-600" aria-hidden="true" />
                </a>
                <a
                  href="tel:+4920878012578"
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-green-400 hover:bg-green-50 transition-colors"
                  aria-label="Patrick Starkmann anrufen"
                >
                  <Phone className="w-5 h-5 text-slate-600" aria-hidden="true" />
                </a>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-700" aria-hidden="true" />
                  <span>Spezialist für Subventionen in der Agrarwirtschaft</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-green-700" aria-hidden="true" />
                  <span>Über 400 bewilligte Anträge</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-green-700" aria-hidden="true" />
                  <span>Alle 16 Bundesländer</span>
                </div>
              </div>
            </div>

            {/* Right: Quote and Stats */}
            <div className="lg:col-span-8 p-8 lg:p-12 bg-white">
              {/* Personalized greeting with owner name */}
              {isPersonalized && salutation && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-purple-900 text-lg">
                        {salutation}, schön dass Sie hier sind.
                      </p>
                      <p className="text-purple-700 text-sm mt-1">
                        Ich habe mir {companyName} angeschaut und sehe echtes Förderpotenzial.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Quote - personalized or generic */}
              <div className="relative mb-10">
                <svg
                  className="absolute -top-2 -left-2 w-12 h-12 text-purple-100"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z" />
                </svg>
                
                {isPersonalized ? (
                  <div className="pl-10 relative z-10 space-y-4">
                    {/* Direct address */}
                    {salutation && (
                      <p className="text-lg text-slate-500">
                        {salutation},
                      </p>
                    )}
                    
                    {/* Industry pain point */}
                    <p className="text-xl md:text-2xl text-slate-700 italic leading-relaxed">
                      {industryContent.pain}
                    </p>
                    
                    {/* Hook */}
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {industryContent.hook}
                    </p>
                    
                    {/* Personal call to action with name */}
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-lg text-purple-700 font-medium">
                        {salutation ? (
                          <>{salutation}, lassen Sie uns in einem kostenlosen Erstgespräch besprechen, wie wir {companyName} optimal fördern können.</>
                        ) : (
                          <>Lassen Sie uns in einem kostenlosen Erstgespräch besprechen, wie wir {companyName} optimal fördern können.</>
                        )}
                      </p>
                      <p className="text-slate-500 text-sm mt-2">
                        Ich freue mich auf unser Gespräch — Patrick Starkmann
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xl md:text-2xl text-slate-700 italic leading-relaxed pl-10 relative z-10">
                    "Wer im Herbst nicht sät, der erntet im Sommer nichts." Genau so ist es mit der Förderung für die Landwirtschaft: Wer seinen Antrag früh und richtig stellt, holt bis zu 50 % der Investition als Zuschuss raus. Wer zu spät kommt oder Fehler macht, zahlt alles selbst — das muss nicht sein.
                  </p>
                )}
              </div>

              {/* Specialization Tags - highlight matching industry */}
              <div className="mb-10">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  {isPersonalized ? `Erfahrung u.a. in Ihrer Branche` : "Spezialisierung"}
                </h4>
                <div className="flex flex-wrap gap-2">
                    {[
                    "Milchvieh & Rinderhaltung",
                    "Schweinehaltung",
                    "Geflügel & Freilandhaltung",
                    "Gülle & Gärrestelager",
                    "Klimaschutz & Emissionen",
                  ].map((tag) => {
                    // Check if this tag relates to the company's industry
                    const isRelevant = industry && (
                      tag.toLowerCase().includes(industry.toLowerCase().split(" ")[0]) ||
                      industry.toLowerCase().includes(tag.toLowerCase().split(/[-\s]/)[0])
                    )
                    return (
                      <span
                        key={tag}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isRelevant 
                            ? "bg-purple-100 border-2 border-purple-400 text-purple-800" 
                            : "bg-slate-100 border border-slate-200 text-slate-700"
                        }`}
                      >
                        {tag}
                        {isRelevant && <span className="ml-1 text-purple-600">*</span>}
                      </span>
                    )
                  })}
                  {/* Add company's industry if not in the default list */}
                  {isPersonalized && industry && ![
                    "maschinenbau", "produktionsanlagen", "gebäudeinvestitionen", "digitalisierung", "klimaschutz"
                  ].some(t => industry.toLowerCase().includes(t)) && (
                    <span className="px-4 py-2 bg-purple-100 border-2 border-purple-400 rounded-lg text-sm font-medium text-purple-800">
                      {industry} *
                    </span>
                  )}
                </div>
                {isPersonalized && (
                  <p className="text-xs text-slate-500 mt-2">* Relevant für {companyName}</p>
                )}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
                {/* TEMPLATE: 3 konkrete Zahlen/Stats */}
                {/* ANLEITUNG: Social Proof - was macht diese Person erfolgreich? */}
                <div>
                  <div className="text-3xl font-bold text-slate-900">98 %</div>
                  <div className="text-sm text-slate-600">Erfolgsquote</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">400+</div>
                  <div className="text-sm text-slate-600">Bewilligte Anträge</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">28 Mio. €</div>
                  <div className="text-sm text-slate-600">Bewilligte Förderung</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
