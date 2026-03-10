"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Building2, MapPin, Globe, Phone, Loader2, Sparkles, CheckCircle2, TrendingUp, Target, ArrowRight, Zap, Users, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadCaptureModal } from "./lead-capture-modal"
import Image from "next/image"
import { useCompany } from "@/contexts/company-context"

interface Prediction {
  place_id: string
  description: string
  structured_formatting?: {
    main_text: string
    secondary_text: string
  }
}

interface CompanyData {
  name: string
  address: string
  plz: string
  city: string
  website: string | null
  phone: string | null
  industry: string
  types: string[]
  location: { lat: number; lng: number } | null
  rating: number | null
  ratingsCount: number | null
  googleMapsUrl: string | null
  foerdergebiet?: string
    foerdergebietCode?: "N" | "C" | "C+" | "D"
    foerdergebietError?: string | null
    regionalBonus?: number
  }

interface Analysis {
  companyProfile: {
    summary: string
    mainActivity: string
    employeeEstimate: string
    companyType: string
  }
  fundingPotential: {
    maxQuote: number
    baseQuote: number
    regionalBonus: number
    climateBonus: number
    foerdergebiet: string
    foerdergebietCode?: "N" | "C" | "C+" | "D"
    foerdergebietTyp?: string
    pfadAVerfuegbar?: boolean
    eligibilityScore: number
  }
  investmentIdeas: Array<{
    title: string
    description: string
    estimatedInvestment: string
    potentialFunding: string
    fundingPath: string
  }>
  personalizedMessage: string
  nextSteps: string[]
}

export function CompanySearchSection() {
  // Global context - this updates the ENTIRE page
  const { 
    company: globalCompany, 
    analysis: globalAnalysis,
    setCompany: setGlobalCompany, 
    setAnalysis: setGlobalAnalysis,
    setIsAnalyzing: setGlobalIsAnalyzing,
    clearCompany: clearGlobalCompany
  } = useCompany()
  
  // Hide this entire section when a company is already selected
  // The PersonalizedBenefitsSection handles the display of results
  if (globalCompany) {
    return null
  }
  
  const [query, setQuery] = useState("")
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  
  // Sync with global context whenever it changes (e.g. new company selected in hero)
  useEffect(() => {
    if (globalCompany) {
      setSelectedCompany({
        name: globalCompany.name,
        address: globalCompany.address,
        plz: globalCompany.plz,
        city: globalCompany.city,
        website: globalCompany.website,
        phone: globalCompany.phone,
        industry: globalCompany.industry,
        types: [],
        location: null,
        rating: null,
        ratingsCount: null,
        googleMapsUrl: null
      })
      setShowResults(true)
    } else {
      setSelectedCompany(null)
      setShowResults(false)
    }
  }, [globalCompany])

  useEffect(() => {
    if (globalAnalysis) {
      setAnalysis(globalAnalysis as Analysis)
    } else {
      setAnalysis(null)
    }
  }, [globalAnalysis])

  // Debounced search for autocomplete
  const searchCompanies = useCallback(async (input: string) => {
    if (input.length < 2) {
      setPredictions([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(input)}`)
      const data = await response.json()
      setPredictions(data.predictions || [])
    } catch (error) {
      console.error("[v0] Search error:", error)
      setPredictions([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Handle input change with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      searchCompanies(query)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, searchCompanies])

  // Fetch company details when selected
  const selectCompany = async (prediction: Prediction) => {
    setIsLoadingDetails(true)
    setPredictions([])
    setQuery(prediction.structured_formatting?.main_text || prediction.description)
    setShowResults(true)

    try {
      const response = await fetch(`/api/places/details?place_id=${prediction.place_id}`)
      const data = await response.json()
      
      if (data.company) {
        setSelectedCompany(data.company)
        // Automatically start analysis
        analyzeCompany(data.company)
      }
    } catch (error) {
      console.error("Details error:", error)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  // Analyze company with Gemini - updates GLOBAL context so entire page changes
  const analyzeCompany = async (company: CompanyData) => {
    setIsAnalyzing(true)
    setGlobalIsAnalyzing(true)
    setAnalysis(null)

    try {
      const response = await fetch("/api/analyze-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company })
      })
      const data = await response.json()
      
      if (data.analysis) {
        // Update local state
        setAnalysis(data.analysis)
        if (data.company) {
          setSelectedCompany(data.company)
        }
        
        // UPDATE GLOBAL CONTEXT - this triggers updates across the entire page
        setGlobalCompany({
          name: company.name,
          address: company.address,
          plz: company.plz,
          city: company.city,
          website: company.website,
          industry: company.industry,
          phone: company.phone,
          placeId: ""
        })
        setGlobalAnalysis(data.analysis)
      }
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
      setGlobalIsAnalyzing(false)
    }
  }

  const resetSearch = () => {
    // Clear local state
    setQuery("")
    setSelectedCompany(null)
    setAnalysis(null)
    setPredictions([])
    setShowResults(false)
    // Also clear global context so hero section resets too
    clearGlobalCompany()
    // Focus input for new search
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const getFundingPathIcon = (path: string | undefined | null) => {
    const p = (path || "").toLowerCase()
    if (p.includes("produktivität") || p.includes("pfad a") || p.includes("regional")) return <Zap className="w-4 h-4" />
    if (p.includes("wachstum") || p.includes("pfad b") || p.includes("ee") || p.includes("erneuerbar")) return <Users className="w-4 h-4" />
    if (p.includes("klima") || p.includes("pfad c") || p.includes("umwelt") || p.includes("effizienz")) return <Leaf className="w-4 h-4" />
    return <Target className="w-4 h-4" />
  }

  const getFundingPathColor = (path: string | undefined | null) => {
    const p = (path || "").toLowerCase()
    if (p.includes("produktivität") || p.includes("pfad a") || p.includes("regional")) return "from-violet-500 to-purple-500"
    if (p.includes("wachstum") || p.includes("pfad b") || p.includes("ee") || p.includes("erneuerbar")) return "from-blue-500 to-cyan-500"
    if (p.includes("klima") || p.includes("pfad c") || p.includes("umwelt") || p.includes("effizienz")) return "from-green-500 to-violet-500"
    return "from-slate-500 to-slate-600"
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            KI-gestützte Förderanalyse
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ihr Unternehmen. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Ihre Förderung.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Geben Sie Ihren Firmennamen ein und erhalten Sie eine personalisierte Förderanalyse in Sekunden.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl blur-xl opacity-20" />
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Firmenname eingeben..."
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-slate-500 text-lg focus:outline-none"
                />
                {isSearching && (
                  <Loader2 className="absolute right-4 w-5 h-5 text-purple-400 animate-spin" />
                )}
              </div>

              {/* Autocomplete Suggestions */}
              <AnimatePresence>
                {predictions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="border-t border-white/10 mt-2 pt-2 max-h-64 overflow-y-auto"
                  >
                    {predictions.map((prediction) => (
                      <button
                        key={prediction.place_id}
                        onClick={() => selectCompany(prediction)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {prediction.structured_formatting?.main_text || prediction.description}
                          </p>
                          {prediction.structured_formatting?.secondary_text && (
                            <p className="text-sm text-slate-500 truncate">
                              {prediction.structured_formatting.secondary_text}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Loading State */}
              {(isLoadingDetails || isAnalyzing) && !analysis && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 animate-pulse" />
                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {isLoadingDetails ? "Unternehmensdaten werden geladen..." : "KI analysiert Ihr Förderpotenzial..."}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {isAnalyzing ? "Website wird ausgewertet und personalisierte Empfehlungen erstellt" : "Einen Moment bitte"}
                      </p>
                      
                      {/* Progress steps */}
                      <div className="mt-8 space-y-3 w-full max-w-sm">
                {[
                  { label: "Firmendaten abgerufen", done: !isLoadingDetails },
                  { label: "Fördergebiet via API ermittelt", done: !isLoadingDetails },
                  { label: "Webseite & Geschäftsführer analysiert", done: false },
                  { label: "Branchenanalyse mit KI", done: false },
                  { label: "Förderempfehlungen generieren", done: false }
                ].map((step, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              step.done ? "bg-purple-500" : "bg-slate-700"
                            }`}>
                              {step.done ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
                              )}
                            </div>
                            <span className={`text-sm ${step.done ? "text-purple-400" : "text-slate-500"}`}>
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Info Card */}
              {selectedCompany && !isLoadingDetails && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                    {/* Company Header */}
                    <div className="p-6 border-b border-white/10">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-1">{selectedCompany.name}</h3>
                          <p className="text-slate-400 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {selectedCompany.address}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-sm">
                              {selectedCompany.industry}
                            </span>
                {selectedCompany.foerdergebietError ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                    <MapPin className="w-3.5 h-3.5" />
                    Fördergebiet konnte nicht abgerufen werden
                  </span>
                ) : selectedCompany.foerdergebiet && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCompany.foerdergebietCode === "C+"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : selectedCompany.foerdergebietCode === "C"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : selectedCompany.foerdergebietCode === "D"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  }`}>
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedCompany.foerdergebietCode === "N" ? "Andere Programme verfügbar" : selectedCompany.foerdergebiet}
                  </span>
                )}
                          </div>
                        </div>
                        {selectedCompany.website && (
                          <a
                            href={selectedCompany.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Analysis Results */}
                    {analysis && (
                      <div className="p-6 space-y-6">
                        {/* Owner Greeting */}
                        {analysis.owner?.found && analysis.owner.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                <span className="text-amber-400 font-bold text-lg">
                                  {analysis.owner.firstName?.[0] || analysis.owner.name[0]}
                                </span>
                              </div>
                              <div>
                                <p className="text-amber-200 font-semibold">
                                  Guten Tag, {analysis.owner.name}!
                                </p>
                                <p className="text-amber-300/70 text-sm">
                                  {analysis.owner.role || "Geschäftsführer"} von {selectedCompany.name}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Company Profile Summary */}
                        {analysis.companyProfile && (
                          <div className="p-4 bg-white/5 rounded-xl">
                            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-purple-400" />
                              {analysis.companyProfile.industry || selectedCompany.industry}
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed mb-3">
                              {analysis.companyProfile.summary}
                            </p>
                            {analysis.companyProfile.products && analysis.companyProfile.products.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {analysis.companyProfile.products.slice(0, 4).map((product: string, i: number) => (
                                  <span key={i} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-400">
                                    {product}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Industry Benefits - NEW */}
                        {analysis.industryBenefits && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/20"
                          >
                            <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              So profitiert Ihre Branche von der Regional-Förderung 2026
                            </h4>
                            <p className="text-blue-200/80 text-sm leading-relaxed">{analysis.industryBenefits}</p>
                          </motion.div>
                        )}

                        {/* Personalized Message */}
                        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-xl border border-purple-500/20">
                          <p className="text-purple-200 italic">"{analysis.personalizedMessage}"</p>
                        </div>

                        {/* Funding Potential */}
                        {analysis.fundingPotential.foerdergebietCode === "N" && (
                          <div className="p-5 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-xl border border-teal-500/20">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-teal-400" />
                              </div>
                              <div>
                                <p className="text-white font-semibold text-sm">Dieses Programm passt nicht -- aber wir haben bessere Optionen!</p>
                                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                  Für Ihren Standort gibt es andere Förderprogramme, die häufig sogar attraktivere Konditionen bieten. 
                                  In einem kurzen Gespräch finden wir gemeinsam die optimale Lösung für {selectedCompany?.name || "Ihr Unternehmen"}.
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => window.dispatchEvent(new CustomEvent('openLeadModal'))}
                              className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold rounded-lg transition-all shadow-lg hover:shadow-teal-500/25 cursor-pointer"
                            >
                              Jetzt kostenlose Erstberatung sichern – Alternativen prüfen
                            </button>
                          </div>
                        )}
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="bg-white/5 rounded-xl p-4 text-center">
                            <p className="text-slate-400 text-sm mb-1">Maximale Quote</p>
                            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                              {analysis.fundingPotential.maxQuote}%
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {analysis.fundingPotential.foerdergebietCode === "N" 
                                ? "Andere Programme mit Top-Konditionen möglich"
                                : `${analysis.fundingPotential.baseQuote}% Basis + ${analysis.fundingPotential.regionalBonus}% Region`
                              }
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 text-center">
                            <p className="text-slate-400 text-sm mb-1">Förder-Score</p>
                            <p className="text-4xl font-bold text-white">
                              {analysis.fundingPotential.eligibilityScore}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">von 100 Punkten</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 text-center">
                            <p className="text-slate-400 text-sm mb-1">Unternehmensgröße</p>
                            <p className="text-2xl font-bold text-white">
                              {analysis.companyProfile.companyType}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              ca. {analysis.companyProfile.employeeEstimate} MA
                            </p>
                          </div>
                        </div>

                        {/* Investment Ideas */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-400" />
                            Förderfähige Investitionsideen für {selectedCompany.name}
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {(Array.isArray(analysis.investmentIdeas) ? analysis.investmentIdeas : []).slice(0, 4).map((idea, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/20 transition-colors"
                              >
                                <div className="flex items-start gap-3 mb-3">
                                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getFundingPathColor(idea?.fundingPath)} flex items-center justify-center flex-shrink-0`}>
                                    {getFundingPathIcon(idea?.fundingPath)}
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-white">{idea?.title || "Investitionsvorschlag"}</h5>
                                    {idea?.fundingPath && <span className="text-xs text-slate-500">{idea.fundingPath}</span>}
                                  </div>
                                </div>
                                {idea?.description && <p className="text-sm text-slate-400 mb-3">{idea.description}</p>}
                                <div className="flex justify-between text-sm">
                                  {idea?.estimatedInvestment && <span className="text-slate-500">Investment: {idea.estimatedInvestment}</span>}
                                  {idea?.potentialFunding && <span className="text-purple-400 font-semibold">Förderung: {idea.potentialFunding}</span>}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-xl p-6 border border-purple-500/30">
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500 flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src="/patrick-starkmann.webp"
                                  alt="Patrick Starkmann"
                                  width={56}
                                  height={56}
                                  className="object-cover object-top w-full h-full"
                                />
                              </div>
                              <div>
                                <p className="text-white font-semibold">Persönliche Beratung anfordern</p>
                                <p className="text-sm text-purple-300">Patrick Starkmann prüft Ihre Fördermöglichkeiten</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => setIsModalOpen(true)}
                              className="bg-white hover:bg-slate-100 text-slate-900 font-semibold px-6 py-3 rounded-xl shadow-lg whitespace-nowrap"
                            >
                              Jetzt Termin sichern
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>

                        {/* Reset - more prominent button for new search */}
                        <div className="text-center pt-4 border-t border-white/10">
                          <button
                            onClick={resetSearch}
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
                          >
                            <Search className="w-4 h-4" />
                            Anderes Unternehmen analysieren
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust indicators when no search */}
        {!showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
              Kostenlos & unverbindlich
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
              Ergebnis in 30 Sekunden
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
              KI-gestützte Analyse
            </span>
          </motion.div>
        )}
      </div>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
