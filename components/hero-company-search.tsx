"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Building2, MapPin, Loader2, Check, X, Sparkles, ArrowRight, AlertTriangle } from "lucide-react"
import { useCompany } from "@/contexts/company-context"

interface Prediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export function HeroCompanySearch() {
  const [query, setQuery] = useState("")
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [showHighlight, setShowHighlight] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [analysisError, setAnalysisError] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { company, analysis, isAnalyzing, setCompany, setAnalysis, setIsLoading, setIsAnalyzing, clearCompany } = useCompany()
  
  const hideTimerRef = useRef<NodeJS.Timeout>()

  // Show tooltip after 2s, auto-hide after 3s more
  useEffect(() => {
    if (hasInteracted || company) return
    const showTimer = setTimeout(() => {
      setShowHighlight(true)
      hideTimerRef.current = setTimeout(() => setShowHighlight(false), 3000)
    }, 2000)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimerRef.current)
    }
  }, [hasInteracted, company])

  const handleFocus = () => {
    setIsFocused(true)
    setHasInteracted(true)
    setShowHighlight(false)
  }

  // Debounced search
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
      setPredictions([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      searchCompanies(query)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, searchCompanies])

  const selectCompany = async (prediction: Prediction) => {
    setQuery(prediction.structured_formatting.main_text)
    setPredictions([])
    setIsFocused(false)
    setIsLoading(true)
    setAnalysisError(false)

    try {
      const detailsResponse = await fetch(`/api/places/details?placeId=${prediction.place_id}`)
      if (!detailsResponse.ok) {
        throw new Error(`Details request failed: ${detailsResponse.status}`)
      }
      const detailsData = await detailsResponse.json()

      if (detailsData.company) {
        setCompany(detailsData.company)
        setIsLoading(false)
        
        setIsAnalyzing(true)
        try {
          const analysisResponse = await fetch("/api/analyze-company", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company: detailsData.company }),
          })
          
          if (!analysisResponse.ok) {
            throw new Error(`Analysis request failed: ${analysisResponse.status}`)
          }
          
          const analysisData = await analysisResponse.json()
          
          if (analysisData.analysis) {
            // Validate critical fields before setting state
            const safeAnalysis = {
              ...analysisData.analysis,
              investmentIdeas: Array.isArray(analysisData.analysis.investmentIdeas) 
                ? analysisData.analysis.investmentIdeas.map((idea: any) => {
                    if (typeof idea === "string") {
                      return { title: idea, description: "", estimatedInvestment: "", potentialFunding: "", fundingPath: "" }
                    }
                    return {
                      title: idea?.title || "Investitionsvorschlag",
                      description: idea?.description || "",
                      estimatedInvestment: idea?.estimatedInvestment || "",
                      potentialFunding: idea?.potentialFunding || "",
                      fundingPath: idea?.fundingPath || ""
                    }
                  })
                : [],
              personalizedMessage: analysisData.analysis.personalizedMessage || "",
              nextSteps: Array.isArray(analysisData.analysis.nextSteps) ? analysisData.analysis.nextSteps : []
            }
            setAnalysis(safeAnalysis)
          } else {
            // API returned but no analysis - show soft error
            setAnalysisError(true)
          }
        } catch (analysisErr) {
          console.error("[HeroCompanySearch] Analysis error:", analysisErr)
          setAnalysisError(true)
        }
      } else {
        setAnalysisError(true)
      }
    } catch (error) {
      console.error("[HeroCompanySearch] Error:", error)
      setAnalysisError(true)
    } finally {
      setIsLoading(false)
      setIsAnalyzing(false)
    }
  }

  // If company is selected, show clear feedback message
  if (company) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Selected company state - responsive padding */}
        <div className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border shadow-sm transition-all ${
          isAnalyzing 
            ? "bg-amber-50 border-amber-200" 
            : analysis 
              ? "bg-teal-50 border-teal-200" 
              : "bg-white border-slate-200"
        }`}>
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
            isAnalyzing 
              ? "bg-amber-500" 
              : analysis 
                ? "bg-teal-500" 
                : "bg-slate-500"
          }`}>
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
            ) : analysis ? (
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            ) : (
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-slate-900 block text-sm sm:text-base truncate">{company.name}</span>
            {isAnalyzing ? (
              <span className="text-xs sm:text-sm text-amber-700 font-medium">
                KI analysiert...
              </span>
            ) : analysis ? (
              <span className="text-xs sm:text-sm text-teal-700 font-medium">
                <span className="hidden sm:inline">Unternehmen erfasst - </span>Scrollen Sie nach unten
              </span>
            ) : (
              <span className="text-xs sm:text-sm text-slate-500 truncate">{company.city}</span>
            )}
          </div>
          <button
            onClick={() => {
              clearCompany()
              setQuery("")
              setAnalysisError(false)
              setTimeout(() => inputRef.current?.focus(), 100)
            }}
            className="p-2 rounded-full hover:bg-white/50 transition-colors group"
            aria-label="Neue Firma suchen"
            title="Anderes Unternehmen suchen"
          >
            <X className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        </div>
        
        {/* Error state - graceful fallback */}
        {analysisError && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-800 font-medium">
                  Die automatische Analyse konnte nicht abgeschlossen werden.
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Kein Problem - lassen Sie sich kostenlos von Patrick Starkmann beraten.
                </p>
                <button
                  onClick={() => {
                    document.getElementById("expert-section")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="mt-2 text-xs font-medium text-amber-700 hover:text-amber-900 underline underline-offset-2"
                >
                  Zur kostenlosen Beratung
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success message with scroll hint - clickable */}
        {analysis && !isAnalyzing && !analysisError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 space-y-2"
          >
            <button
              onClick={() => document.getElementById("personalized-analysis")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full flex items-center justify-center gap-2 text-teal-700 hover:text-teal-800 transition-colors cursor-pointer group"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium group-hover:underline">
                Ihre persönliche Analyse ist bereit - hier klicken
              </span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-lg"
              >
                ↓
              </motion.span>
            </button>
            
            {/* Button to search for a new company */}
            <button
              onClick={() => {
                clearCompany()
                setQuery("")
                setTimeout(() => inputRef.current?.focus(), 100)
              }}
              className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer text-sm py-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Anderes Unternehmen analysieren</span>
            </button>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="relative">
      {/* Attention-Grabbing Animated Tooltip */}
      <AnimatePresence>
        {showHighlight && !isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-50"
          >
            <motion.div 
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Glowing background pulse */}
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 20px 5px rgba(139, 92, 246, 0.3)",
                    "0 0 30px 10px rgba(139, 92, 246, 0.5)",
                    "0 0 20px 5px rgba(139, 92, 246, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-xl"
              />
              
              <div className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 text-white px-5 py-3 rounded-xl shadow-2xl border border-purple-400/30">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                  <div>
                    <p className="font-bold text-sm whitespace-nowrap">
                      Jetzt Firma eingeben
                    </p>
                    <p className="text-xs text-purple-200 whitespace-nowrap">
                      Ihre persönliche Fördersumme berechnen
                    </p>
                  </div>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-white"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
              
              {/* Arrow pointing down */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-2">
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-purple-600"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input field with enhanced highlight ring when tooltip is shown */}
      <div className={`relative transition-all duration-300 ${isFocused ? "scale-[1.02]" : ""}`}>
        {/* Pulsing border animation when highlight is shown */}
        {showHighlight && !isFocused && (
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 0 3px rgba(139, 92, 246, 0.2)",
                "0 0 0 6px rgba(139, 92, 246, 0.4)",
                "0 0 0 3px rgba(139, 92, 246, 0.2)"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-xl pointer-events-none"
          />
        )}
        
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 animate-spin" />
          ) : (
            <Search className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${showHighlight && !isFocused ? "text-purple-500" : "text-slate-400"}`} />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Firmennamen eingeben..."
          className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3.5 sm:py-4 bg-white border-2 rounded-xl text-slate-900 text-sm sm:text-base placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all touch-target no-tap-zoom ${
            showHighlight && !isFocused 
              ? "border-purple-400 ring-4 ring-purple-500/20" 
              : "border-slate-200"
          }`}
          aria-label="Firmennamen suchen"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>

      {/* Autocomplete dropdown - optimized for touch */}
      <AnimatePresence>
        {isFocused && predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1.5 sm:mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden max-h-[60vh] overflow-y-auto"
          >
            {predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                onClick={() => selectCompany(prediction)}
                className="w-full px-3 sm:px-4 py-3 sm:py-3.5 flex items-center gap-2.5 sm:gap-3 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left border-b border-slate-100 last:border-b-0 touch-target no-tap-zoom"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-900 truncate text-sm sm:text-base">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 truncate">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint text - more emotional when highlight is shown */}
      <motion.p 
        animate={showHighlight && !isFocused ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className={`mt-2 text-xs transition-colors ${
          showHighlight && !isFocused 
            ? "text-purple-600 font-medium" 
            : "text-slate-400"
        }`}
      >
        {showHighlight && !isFocused 
          ? "Tragen Sie Ihren Firmennamen ein und erhalten Sie sofort Ihre individuelle Fördersumme"
          : "Firmennamen eingeben für personalisierte Branchenanalyse"
        }
      </motion.p>
    </div>
  )
}
