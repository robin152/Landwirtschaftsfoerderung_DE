"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, CheckCircle, Shield, Clock, Euro, Sparkles, TrendingUp, Star, Factory, Building2, Cpu, Zap, Users, CalendarCheck } from "lucide-react"
import { useCompany } from "@/contexts/company-context"
import { LeadCaptureModal } from "./lead-capture-modal"
import { HeroCompanySearch } from "./hero-company-search"
import { GoogleReviewsSlider } from "@/components/google-reviews-slider"

// Animated words for headline
const animatedWords = [
  "Maschinen",
  "Anlagen", 
  "Gebäude",
  "IT-Systeme",
  "Fahrzeuge",
  "Digitalisierung"
]

// Region detection types
interface LocationData {
  city: string
  region: string
  regionType: "C" | "C+" | "D" | "none" | "foreign"
  bonus: number
  maxQuote: number
  loading: boolean
  country: string
  error?: string | null
  foerdergebietCode?: "N" | "C" | "C+" | "D"
}

function getRegionType(code: string): "C" | "C+" | "D" | "none" {
  if (code === "C+") return "C+"
  if (code === "C") return "C"
  if (code === "D") return "D"
  return "none"
}

function getRegionLabel(code: string): string {
  switch (code) {
    case "C": return "C-Fördergebiet"
    case "C+": return "C-Fördergebiet (Grenzzuschlag)"
    case "D": return "D-Fördergebiet"
    default: return "Standardgebiet"
  }
}

function getMaxQuote(code: string): number {
  switch (code) {
    case "C+": return 55
    case "C": return 50
    case "D": return 50
    case "N": return 0
    default: return 40
  }
}

// Key Benefits - Clear purchase arguments with specific amounts
const keyBenefits = [
  { 
    icon: Euro, 
    title: "Bis zu 65% Zuschuss", 
    desc: "Echter Zuschuss - KEINE Rückzahlung", 
    highlight: "Direkt auf Ihr Firmenkonto",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50"
  },
  { 
    icon: Factory, 
    title: "Was wird gefördert", 
    desc: "Maschinen, Anlagen, Gebäude, IT, Energie", 
    highlight: "CNC, Robotik, PV, Wärmepumpen, Software",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  { 
    icon: Zap, 
    title: "+10% Klimabonus", 
    desc: "Für Investitionen in Energieeffizienz", 
    highlight: "PV, Wärmepumpen, Speicher, E-Mobilität",
    color: "text-teal-500",
    bgColor: "bg-teal-50"
  },
  { 
    icon: Users, 
    title: "Unsere Beratung", 
    desc: "Erfolgsbasiert - nur bei Bewilligung", 
    highlight: "98% Erfolgsquote",
    color: "text-rose-500",
    bgColor: "bg-rose-50"
  },
]

// Investment Calculator Component
function InvestmentCalculator({ 
  maxQuote, 
  loading,
  city,
  regionType,
  onOpenModal,
}: { 
  maxQuote: number
  loading: boolean
  city: string
  regionType: string
  onOpenModal: () => void
}) {
  const [investmentAmount, setInvestmentAmount] = useState(750000)
  
  const fundingAmount = investmentAmount * (maxQuote / 100)
  const formattedInvestment = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(investmentAmount) + " EUR"
  const formattedFunding = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(fundingAmount)

  return (
    <div className="space-y-4">
      {/* Company Input — full Places-API search with analysis */}
      <div>
        <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">
          Ihr Unternehmen
        </div>
        <HeroCompanySearch />
      </div>

      {/* Investment Slider */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            Geplante Investition
          </div>
          <motion.div
            key={investmentAmount}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-lg font-bold text-slate-900"
          >
            {formattedInvestment}
          </motion.div>
        </div>
        <input
          type="range"
          min={100000}
          max={5000000}
          step={50000}
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(Number(e.target.value))}
          className="funding-slider w-full"
          style={{
            touchAction: "none",
            "--slider-progress": `${((investmentAmount - 100000) / (5000000 - 100000)) * 100}%`,
          } as React.CSSProperties}
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
          <span>100 T€</span>
          <span>2,5 Mio. €</span>
          <span>5 Mio. €</span>
        </div>
      </div>

      {/* Location indicator */}
      <div className="flex items-center gap-2 py-2 px-3 bg-slate-100 rounded-lg">
        <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
        <span className="text-xs text-slate-600">
          <span className="font-medium text-slate-900">Standort:</span>{" "}
          {loading ? (
            <span className="inline-block w-20 h-3 bg-slate-300 rounded animate-pulse align-middle" />
          ) : (
            <span className={regionType !== "none" && regionType !== "foreign" ? "text-violet-600 font-semibold" : "text-slate-600"}>
              {city || "Deutschland"}{regionType !== "none" && regionType !== "foreign" ? " — förderfähig" : ""}
            </span>
          )}
        </span>
      </div>

      {/* Big Funding Amount — lila, scharf, glänzend */}
      <div className="pt-1">
        <div className="text-[10px] text-violet-500 uppercase tracking-[0.2em] font-black mb-1.5">
          Ihr möglicher Zuschuss
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={fundingAmount}
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="relative"
          >
            {loading ? (
              <span className="inline-block w-44 h-14 bg-slate-200 rounded-xl animate-pulse" />
            ) : (
              <div className="relative">
                {/* Glow — hinter dem Text, nicht drüber */}
                <div
                  aria-hidden
                  className="absolute -inset-3 rounded-2xl pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(139,92,246,0.22) 0%, transparent 70%)",
                  }}
                />
                {/* Zahl: harter Gradient, scharf, klar */}
                <span
                  className="relative block text-5xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-violet-600 via-violet-500 to-purple-600 bg-clip-text text-transparent"
                >
                  {formattedFunding}
                </span>
                {/* Shine-Sweep — auf overflow:hidden Container */}
                <span className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                  <motion.span
                    animate={{ x: ["-150%", "250%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-20deg]"
                  />
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <p className="text-xs text-slate-500 mt-2">
          Bis zu{" "}
          <span className="font-bold text-violet-600">{loading ? "..." : `${maxQuote}%`}</span>{" "}
          — nicht rückzahlbar, direkt auf Ihr Konto
        </p>
      </div>
    </div>
  )
}

// Mini Google Reviews Badge
function GoogleReviewsBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <span className="text-xs font-semibold text-slate-900">4.9</span>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <span className="text-[10px] text-slate-500">(127)</span>
    </div>
  )
}

// Animated Word Component
function AnimatedWord() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animatedWords.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <span className="relative inline-block min-w-[200px] sm:min-w-[280px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -20, rotateX: 90 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute left-0 text-violet-600"
        >
          {animatedWords[currentIndex]}
        </motion.span>
      </AnimatePresence>
      {/* Invisible placeholder to maintain height */}
      <span className="invisible">{animatedWords[0]}</span>
    </span>
  )
}

// Animated CTA Button with pulse ring and auto-close tooltip
function HeroCTAButton({ onClick }: { onClick: () => void }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowTooltip(true)
      hideRef.current = setTimeout(() => setShowTooltip(false), 2000)
    }, 1500)
    return () => {
      clearTimeout(showTimer)
      if (hideRef.current) clearTimeout(hideRef.current)
    }
  }, [])

  return (
    <div className="relative">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.94 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 z-20 w-[90vw] sm:w-auto pointer-events-none"
          >
            <div className="flex items-start gap-3 bg-slate-900 border border-slate-700/60 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl max-w-xs sm:max-w-sm">
              <span className="relative flex h-2 w-2 mt-0.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="leading-snug">Jetzt eintragen für das kostenlose Erstgespräch — wir sichern Ihre Förderung.</span>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outer pulse ring */}
      <motion.div
        animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.15, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-2xl bg-violet-500 pointer-events-none"
      />

      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.975 }}
        className="group relative w-full py-5 sm:py-6 px-8 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 hover:from-violet-500 hover:via-purple-500 hover:to-violet-500 text-white font-bold text-base sm:text-lg lg:text-xl rounded-2xl shadow-2xl shadow-violet-500/35 transition-colors duration-300 overflow-hidden"
      >
        {/* Continuous shine sweep */}
        <motion.span
          aria-hidden
          animate={{ x: ["-150%", "250%"] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] pointer-events-none"
        />

        <span className="relative flex items-center justify-center gap-3">
          <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          Jetzt kostenlose Erstberatung sichern
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex-shrink-0"
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.span>
        </span>
      </motion.button>

      <p className="text-center text-slate-500 text-xs sm:text-sm mt-3">
        Unverbindlich · In 2 Minuten erfahren Sie Ihr Förderpotential · 98% Erfolgsquote
      </p>
    </div>
  )
}

export function HeroIndustrialLuxury() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const { company } = useCompany()
  const [location, setLocation] = useState<LocationData>({
    city: "",
    region: "",
    regionType: "none",
    bonus: 0,
    maxQuote: 35,
    loading: true,
    country: ""
  })

  // PLZ resolution
  const resolvePlz = async (plz: string) => {
    setLocation(prev => ({ ...prev, loading: true, error: null }))
    try {
      const response = await fetch(`/api/foerdergebiet?plz=${plz}`)
      const data = await response.json()
      const code = data.code || "N"
      const regionType = getRegionType(code)
      
      let cityLabel = `PLZ ${plz}`
      try {
        const geoResponse = await fetch(`/api/places/geocode?plz=${plz}`)
        const geoData = await geoResponse.json()
        if (geoData.city) cityLabel = geoData.city
      } catch {}
      
      setLocation({
        city: cityLabel,
        region: getRegionLabel(code),
        regionType,
        bonus: data.regionalBonus || 0,
        maxQuote: getMaxQuote(code),
        loading: false,
        country: "Deutschland",
        foerdergebietCode: code as "N" | "C" | "C+" | "D"
      })
    } catch {
      setLocation({
        city: `PLZ ${plz}`,
        region: "Standardgebiet",
        regionType: "none",
        bonus: 0,
        maxQuote: 40,
        loading: false,
        country: "Deutschland",
        foerdergebietCode: "N"
      })
    }
  }

  useEffect(() => {
    if (company?.plz) resolvePlz(company.plz)
  }, [company?.plz])

  // GeoIP detection
  useEffect(() => {
    if (company?.plz) return
    
    const detectLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()
        
        if (data.country_code !== "DE") {
          setLocation({
            city: data.city || data.country_name || "Ausland",
            region: "Nicht förderfähig",
            regionType: "foreign",
            bonus: 0,
            maxQuote: 0,
            loading: false,
            country: data.country_name
          })
          return
        }
        
        if (data.postal && data.postal.length >= 4) {
          try {
            const fgResponse = await fetch(`/api/foerdergebiet?plz=${data.postal}`)
            const fgData = await fgResponse.json()
            const code = fgData.code || "N"
            
            setLocation({
              city: data.city || "Deutschland",
              region: getRegionLabel(code),
              regionType: getRegionType(code),
              bonus: fgData.regionalBonus || 0,
              maxQuote: getMaxQuote(code),
              loading: false,
              country: "Deutschland",
              foerdergebietCode: code as "N" | "C" | "C+" | "D"
            })
            return
          } catch {}
        }
        
        setLocation({
          city: data.city || "Deutschland",
          region: "Standort prüfen",
          regionType: "none",
          bonus: 0,
          maxQuote: 35,
          loading: false,
          country: "Deutschland"
        })
      } catch {
        setLocation({
          city: "Deutschland",
          region: "Standort prüfen",
          regionType: "none",
          bonus: 0,
          maxQuote: 35,
          loading: false,
          country: "Deutschland"
        })
      }
    }
    
    detectLocation()
  }, [company?.plz])

  // Cycle through benefits highlight
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % keyBenefits.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <section className="relative min-h-screen min-h-dvh bg-white overflow-hidden">
        {/* Premium White Background with Subtle Grid */}
        <div className="absolute inset-0">
          {/* Fine Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40" />
          {/* Larger Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:12rem_12rem] opacity-20" />
          {/* Subtle Gradient Accents */}
          <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-violet-50/50 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-teal-50/30 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
          {/* Trust Badge Row - Above the fold */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              NEU 2026
            </span>
            <GoogleReviewsBadge />
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              <Clock className="w-3 h-3" />
              Budgets begrenzt
            </span>
          </motion.div>

          {/* Centered Headline with Animated Word */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center max-w-4xl mx-auto mb-6 sm:mb-8"
          >
            <h1 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
              Wir verhelfen Ihnen zu bis zu <span className="text-violet-600">65% Zuschuss</span> für Ihre <AnimatedWord />
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Wenn Sie Ihre geplante Investition in wenigen Sätzen beschreiben können, übernehmen unsere Experten den Rest. Minimaler Aufwand für Sie, Ergebnis in Minuten – bei 98% Erfolgsquote und erfolgsbasierter Abrechnung.
            </p>
          </motion.div>

          {/* MOBILE: Video + CTA stacked, then Benefits below */}
          {/* DESKTOP: Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 sm:mb-10">
            {/* LEFT: VSL Video */}
            <div className="flex flex-col gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-200"
              >
                <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                  <iframe 
                    src="https://player.vimeo.com/video/1170209912?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    title="Regionalförderung für Unternehmen"
                  />
                </div>
              </motion.div>

              {/* CTA directly under Video - visible on mobile, hidden on desktop */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:hidden"
              >
                <HeroCTAButton onClick={() => setIsModalOpen(true)} />
              </motion.div>
            </div>

            {/* RIGHT: Live-Rechner + Benefits */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-4"
            >
              {/* Live-Zuschuss-Rechner */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-slate-900 font-bold text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-500" />
                    Ihr Live-Zuschuss-Rechner 2026
                  </h2>
                </div>
                <div className="p-4 sm:p-5">
                  <InvestmentCalculator
                    maxQuote={location.maxQuote}
                    loading={location.loading}
                    city={company?.city ? `${company.city}` : location.city}
                    regionType={location.regionType}
                    onOpenModal={() => setIsModalOpen(true)}
                  />
                </div>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                  <p className="text-center text-slate-400 text-xs">
                    Kostenlos & unverbindlich
                  </p>
                </div>
              </div>


            </motion.div>
          </div>

          {/* Big CTA - Desktop Full Width only (mobile has CTA under video) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="hidden lg:block mb-8 sm:mb-10"
          >
            <HeroCTAButton onClick={() => setIsModalOpen(true)} />
          </motion.div>

          {/* Google Reviews Slider — direkt unter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <GoogleReviewsSlider />
          </motion.div>

          {/* Trust Logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 sm:mt-10 text-center"
          >
            <p className="text-slate-400 text-xs mb-3">Bereits über 500 Unternehmen erfolgreich gefördert</p>
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
              {["Maschinenbau", "IT & Software", "Produktion", "Logistik", "Energie"].map((industry) => (
                <span key={industry} className="text-xs text-slate-500 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                  {industry}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
