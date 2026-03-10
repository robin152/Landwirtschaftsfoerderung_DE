"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useCompany } from "@/contexts/company-context"
import { TrendingUp, Sparkles, Building2, MapPin, Euro, ArrowRight, Loader2, XCircle, AlertTriangle, CheckCircle, Phone, HelpCircle, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { LeadCaptureModal } from "./lead-capture-modal"
import Image from "next/image"
import confetti from "canvas-confetti"

export function PersonalizedBenefitsSection() {
  const { company, analysis, isAnalyzing } = useCompany()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPositiveMessage, setShowPositiveMessage] = useState(false)
  const confettiTriggered = useRef(false)

  const eligibilityStatus = analysis?.eligibility?.status || "unknown"
  const isEligible = eligibilityStatus === "positive"
  const isConditional = eligibilityStatus === "conditional"
  const isRejected = eligibilityStatus === "negative"
  const isSpecialIndustry = eligibilityStatus === "special" // z.B. Landwirtschaft - eigene Förderung verfügbar

  // Trigger confetti when positive eligibility is confirmed (including special industries like agriculture)
  useEffect(() => {
    if ((isEligible || isSpecialIndustry) && analysis && !confettiTriggered.current && !isAnalyzing) {
      confettiTriggered.current = true
      setShowPositiveMessage(true)
      
      // Fire confetti
      const duration = 3000
      const end = Date.now() + duration
      
      const colors = ["#9333ea", "#a855f7", "#c084fc", "#8b5cf6", "#7c3aed"]
      
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
      
      // Hide message after 5 seconds
      setTimeout(() => setShowPositiveMessage(false), 5000)
    }
  }, [isEligible, isSpecialIndustry, analysis, isAnalyzing])

  // Reset confetti trigger when company changes
  useEffect(() => {
    confettiTriggered.current = false
    setShowPositiveMessage(false)
  }, [company?.name])

  // Only show if company is selected
  if (!company) return null

  return (
    <>
      <section id="personalized-analysis" ref={ref} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,rgb(255_255_255/0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${
          isRejected ? "bg-red-500/10" : isConditional ? "bg-amber-500/10" : "bg-purple-500/10"
        }`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${
          isRejected ? "bg-red-500/5" : isConditional ? "bg-amber-500/5" : "bg-violet-500/10"
        }`} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          {/* Positive Eligibility Celebration Banner */}
          <AnimatePresence>
            {showPositiveMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-green-500/20 border-2 border-purple-400/50 rounded-xl sm:rounded-2xl text-center"
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                  <PartyPopper className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                  <h3 className="text-lg sm:text-2xl font-bold text-white">Ausgezeichnete Nachricht!</h3>
                  <PartyPopper className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 scale-x-[-1]" />
                </div>
                <p className="text-purple-300 text-sm sm:text-lg">
                  <span className="font-bold text-purple-200">{company.name}</span> ist grundsätzlich förderfähig!
                </p>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2">
                  Sie erfüllen alle Grundvoraussetzungen für bis zu 65% Zuschuss.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 ${
              isRejected 
                ? "bg-red-500/20 text-red-400" 
                : isConditional 
                  ? "bg-amber-500/20 text-amber-400"
                  : isSpecialIndustry
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-purple-500/20 text-purple-400"
            }`}>
              {isRejected ? (
                <XCircle className="w-4 h-4" />
              ) : isConditional ? (
                <AlertTriangle className="w-4 h-4" />
              ) : isSpecialIndustry ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isRejected 
                ? "Förderfähigkeit: Nicht erfüllt" 
                : isConditional 
                  ? "Förderfähigkeit: Prüfung erforderlich"
                  : isSpecialIndustry
                    ? "Gute Nachricht: Spezialförderung verfügbar!"
                    : isEligible
                      ? "Nicht auf der Negativliste: Förderfähig"
                      : "Ihr Unternehmen. Ihre Förderung."}
            </div>
            
            {/* Personalized greeting with owner name */}
            {analysis?.owner?.name ? (
              <>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                  {analysis.owner.name}, Ihre persönliche Analyse
                </h2>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
                    isRejected 
                      ? "from-red-400 to-orange-400" 
                      : isConditional 
                        ? "from-amber-400 to-yellow-400"
                        : "from-purple-400 to-violet-400"
                  }`}>
                    für {company.name}
                  </span>
                </h3>
                {analysis.owner.role && (
                  <p className="text-slate-400 text-sm">
                    Als {analysis.owner.role} profitieren Sie besonders von der Regional-Förderung 2026
                  </p>
                )}
              </>
            ) : (
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                Analyse für{" "}
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isRejected 
                    ? "from-red-400 to-orange-400" 
                    : isConditional 
                      ? "from-amber-400 to-yellow-400"
                      : "from-purple-400 to-violet-400"
                }`}>
                  {company.name}
                </span>
              </h2>
            )}
          </motion.div>

          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
              <p className="text-slate-400">Analysiere Ihr Unternehmen und prüfe Förderfähigkeit...</p>
            </div>
          ) : analysis ? (
            <>
              {/* REJECTED STATE */}
              {isRejected && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="max-w-3xl mx-auto"
                >
                  {/* Rejection Card */}
                  <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl border border-red-500/30 p-8 mb-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-7 h-7 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Leider nicht förderfähig nach Regional-Förderung 2026
                        </h3>
                        <p className="text-slate-300">
                          Branche: <span className="text-red-400 font-medium">{analysis.eligibility?.industry || analysis.companyProfile?.industry}</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-xl p-5 mb-6">
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-red-400" />
                        Warum ist {company.name} nicht förderfähig?
                      </h4>
                      <p className="text-slate-300 leading-relaxed">
                        {analysis.rejectionReason || analysis.eligibility?.reason}
                      </p>
                    </div>

                    <p className="text-slate-400 mb-6">
                      {analysis.personalizedMessage}
                    </p>

                    {/* Alternative message */}
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-5">
                      <p className="text-purple-300 font-medium mb-2">Aber es gibt Alternativen!</p>
                      <p className="text-slate-300 text-sm">
                        {analysis.alternativeMessage || "Es gibt möglicherweise andere Förderprogramme, die für Ihr Unternehmen in Frage kommen. Patrick Starkmann prüft gerne kostenlos Ihre individuellen Möglichkeiten."}
                      </p>
                    </div>
                  </div>

                  {/* CTA for rejected */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-purple-500 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/patrick-starkmann.webp"
                          alt="Patrick Starkmann"
                          width={80}
                          height={80}
                          className="object-cover object-top w-full h-full"
                        />
                      </div>
                      <div className="text-center md:text-left flex-1">
                        <h4 className="text-white font-semibold text-lg mb-1">Patrick Starkmann</h4>
                        <p className="text-purple-400 text-sm mb-2">Fördermittelexperte</p>
                        <p className="text-slate-400 text-sm">
                          Lassen Sie uns gemeinsam prüfen, welche alternativen Förderprogramme für {company.name} in Frage kommen.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button
                          onClick={() => setIsModalOpen(true)}
                          className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 text-white font-semibold px-6 py-3 rounded-xl"
                        >
                          Kostenlose Alternativprüfung
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <a 
                          href="tel:+4920878012578"
                          className="flex items-center justify-center gap-2 text-slate-400 hover:text-purple-400 transition-colors text-sm"
                        >
                          <Phone className="w-4 h-4" />
                          +49 208 780 125 78
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CONDITIONAL STATE */}
              {isConditional && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="max-w-3xl mx-auto"
                >
                  {/* Conditional Card */}
                  <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 backdrop-blur-sm rounded-2xl border border-amber-500/30 p-8 mb-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-7 h-7 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Förderfähigkeit unter Vorbehalt
                        </h3>
                        <p className="text-slate-300">
                          Branche: <span className="text-amber-400 font-medium">{analysis.eligibility?.industry || analysis.companyProfile?.industry}</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-xl p-5 mb-6">
                      <h4 className="text-white font-semibold mb-2">Bedingung für Förderfähigkeit:</h4>
                      <p className="text-amber-300 leading-relaxed mb-4">
                        {analysis.eligibility?.condition || analysis.conditionMessage}
                      </p>
                      
                      {analysis.eligibility?.checkQuestion && (
                        <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
                          <p className="text-white font-medium text-sm">
                            Entscheidende Frage: {analysis.eligibility.checkQuestion}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Potential funding if eligible */}
                    {analysis.fundingPotential && (
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-5">
                        <p className="text-purple-300 font-medium mb-2">Bei positiver Prüfung möglich:</p>
                        <div className="flex items-center gap-4">
                          <span className="text-4xl font-bold text-white">{analysis.fundingPotential.maxQuote}%</span>
                          <span className="text-slate-400">maximale Förderquote</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA for conditional */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-amber-500 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/patrick-starkmann.webp"
                          alt="Patrick Starkmann"
                          width={80}
                          height={80}
                          className="object-cover object-top w-full h-full"
                        />
                      </div>
                      <div className="text-center md:text-left flex-1">
                        <h4 className="text-white font-semibold text-lg mb-1">Individuelle Prüfung erforderlich</h4>
                        <p className="text-slate-400 text-sm">
                          Patrick Starkmann klärt in einem kurzen Gespräch, ob {company.name} die Voraussetzungen für die Regional-Förderung erfüllt.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button
                          onClick={() => setIsModalOpen(true)}
                          className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-semibold px-6 py-3 rounded-xl"
                        >
                          Kostenlose Prüfung
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <a 
                          href="tel:+4920878012578"
                          className="flex items-center justify-center gap-2 text-slate-400 hover:text-amber-400 transition-colors text-sm"
                        >
                          <Phone className="w-4 h-4" />
                          +49 208 780 125 78
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SPECIAL INDUSTRY STATE (e.g. Agriculture - has alternative funding) */}
              {isSpecialIndustry && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="max-w-3xl mx-auto"
                >
                  {/* Special Industry Celebration Card */}
                  <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-8 mb-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-7 h-7 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Hervorragende Nachricht für {company.name}!
                        </h3>
                        <p className="text-slate-300">
                          Branche: <span className="text-emerald-400 font-medium">{analysis.eligibility?.specialIndustry?.industry || analysis.companyProfile?.industry}</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-xl p-5 mb-6">
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Spezialisierte Förderprogramme für Sie verfügbar
                      </h4>
                      <p className="text-emerald-300 leading-relaxed mb-3">
                        {analysis.eligibility?.specialIndustry?.alternativeFunding || "Förderung für die Landwirtschaft (ELER, GAP)"}
                      </p>
                      <p className="text-slate-300 leading-relaxed">
                        {analysis.eligibility?.reason || "Landwirtschaftliche Betriebe können zwar nicht über die Regional-Förderung gefördert werden, aber es gibt spezialisierte Agrarförderprogramme mit oft sogar höheren Förderquoten!"}
                      </p>
                    </div>

                    {/* Key Benefits for Agriculture */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-emerald-400 mb-1">40-65%</div>
                        <div className="text-xs text-slate-400">Typische Förderquote</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-emerald-400 mb-1">FfdL</div>
                        <div className="text-xs text-slate-400">Förderung für die Landwirtschaft</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-emerald-400 mb-1">ELER</div>
                        <div className="text-xs text-slate-400">EU-Ländlicher Raum</div>
                      </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                      <p className="text-emerald-300 font-medium mb-2">Wir beraten auch landwirtschaftliche Betriebe!</p>
                      <p className="text-slate-300 text-sm">
                        Unser Experte Patrick Starkmann kennt die Agrarförderprogramme und prüft kostenlos, welche Förderung für Ihre geplante Investition optimal ist.
                      </p>
                    </div>
                  </div>

                  {/* CTA for special industries */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-emerald-500 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/patrick-starkmann.webp"
                          alt="Patrick Starkmann"
                          width={80}
                          height={80}
                          className="object-cover object-top w-full h-full"
                        />
                      </div>
                      <div className="text-center md:text-left flex-1">
                        <h4 className="text-white font-semibold text-lg mb-1">Patrick Starkmann</h4>
                        <p className="text-emerald-400 text-sm mb-2">Fördermittelexperte</p>
                        <p className="text-slate-400 text-sm">
                          Ich zeige Ihnen, welche Agrarförderprogramme für {company.name} die besten Konditionen bieten.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button
                          onClick={() => setIsModalOpen(true)}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold px-6 py-3 rounded-xl"
                        >
                          {analysis.eligibility?.specialIndustry?.ctaText || "Förderung prüfen"}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <a 
                          href="tel:+4920878012578"
                          className="flex items-center justify-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-sm"
                        >
                          <Phone className="w-4 h-4" />
                          +49 208 780 125 78
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* POSITIVE/ELIGIBLE STATE */}
              {isEligible && (
                <>
                  {/* Personalized Greeting Banner */}
                  {analysis.bonusExplanation?.personalGreeting && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6 }}
                      className="mb-8 p-6 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl border border-slate-600/50"
                    >
                      <p className="text-lg text-slate-200 leading-relaxed">
                        {analysis.bonusExplanation.personalGreeting}
                      </p>
                      {analysis.bonusExplanation?.standortAnalyse && (
                        <p className="mt-3 text-slate-300 leading-relaxed">
                          {analysis.bonusExplanation.standortAnalyse}
                        </p>
                      )}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Company Profile Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Förderfähig</h3>
                          <p className="text-sm text-purple-400">{analysis.companyProfile?.industry || company.industry}</p>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                        {analysis.companyProfile?.summary}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span>{company.city}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    analysis.fundingPotential?.foerdergebietCode === "C+" 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : "bg-purple-500/20 text-purple-400"
                  }`}>
                    {analysis.fundingPotential?.foerdergebietCode === "C+" 
                      ? "C+-Gebiet" 
                      : analysis.fundingPotential?.foerdergebiet?.split(" ")[0] || ""}
                  </span>
                      </div>
                    </motion.div>

                    {/* Funding Potential Card - Updated with 65% max */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/30 flex items-center justify-center">
                          <Euro className="w-5 h-5 text-purple-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Maximale Quote</h3>
                          <p className="text-sm text-purple-300">Pfad B: Erneuerbare Energie</p>
                        </div>
                      </div>

                      <div className="text-5xl font-bold text-white mb-2">
                        {analysis.fundingPotential?.maxQuote || 65}%
                      </div>
                      <p className="text-xs text-slate-400 mb-4">Kleinunternehmen / EE-Erzeugung</p>

                      <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                        <div className="flex justify-between text-slate-300">
                          <span>Basis Erneuerbare Energie</span>
                          <span className="text-white font-medium">45%</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>KMU-Bonus</span>
                          <span className="text-purple-400 font-medium">+20%</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Industry Benefits Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Branchenvorteile</h3>
                          <p className="text-sm text-slate-400">{analysis.companyProfile?.industry}</p>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {analysis.industryBenefits || analysis.bonusExplanation?.branchenVorteile}
                      </p>
                    </motion.div>
                  </div>

                  {/* Simplified: Just show the recommendation, not all pathways */}
                  {analysis.bonusExplanation?.empfohlenerPfad && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.35 }}
                      className="mt-6 p-5 bg-purple-500/10 border border-purple-500/30 rounded-xl"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-purple-300 font-semibold mb-1">Unsere Empfehlung für {company.name}:</p>
                          <p className="text-slate-300 text-sm leading-relaxed">{analysis.bonusExplanation.empfohlenerPfad}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Investment Ideas */}
                  {analysis?.investmentIdeas && analysis.investmentIdeas.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="mt-8"
                    >
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        Passende Investitionsideen für {company.name}
                      </h3>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        {analysis.investmentIdeas.slice(0, 3).map((idea: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-colors"
                          >
                            <span className="inline-block px-2 py-1 bg-purple-500/20 rounded text-purple-400 text-xs font-medium mb-2">
                              {idea.fundingPath}
                            </span>
                            <h4 className="font-semibold text-white mb-1">{idea.title}</h4>
                            <p className="text-sm text-slate-400 mb-3">{idea.description}</p>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Investment</span>
                              <span className="text-white font-medium">{idea.estimatedInvestment}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Förderung</span>
                              <span className="text-purple-400 font-bold">{idea.potentialFunding}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* CTA for eligible with next steps */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-10"
                  >
                    {/* Personalized message */}
                    <div className="text-center mb-8">
                      <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
                        {analysis.personalizedMessage}
                      </p>
                    </div>

                    {/* Next Steps */}
                    {analysis.bonusExplanation?.konkreteSchritte && analysis.bonusExplanation.konkreteSchritte.length > 0 && (
                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8 max-w-2xl mx-auto">
                        <h4 className="text-white font-semibold mb-4 text-center">
                          {analysis.owner?.firstName ? `${analysis.owner.firstName}, Ihre` : "Ihre"} nächsten Schritte:
                        </h4>
                        <div className="space-y-3">
                          {analysis.bonusExplanation.konkreteSchritte.map((step: string, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-purple-400 text-sm font-bold">{index + 1}</span>
                              </div>
                              <p className="text-slate-300 text-sm">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-center">
                      <Button
                        size="lg"
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 text-white font-semibold px-8 py-6 rounded-xl"
                      >
                        {analysis.owner?.firstName ? `${analysis.owner.firstName}, jetzt Förderung sichern` : "Jetzt Förderung sichern"}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <p className="mt-4 text-slate-500 text-sm">
                        Kostenlose Erstberatung mit Patrick Starkmann
                      </p>
                    </div>
                  </motion.div>
                </>
              )}
            </>
          ) : null}
        </div>
      </section>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
