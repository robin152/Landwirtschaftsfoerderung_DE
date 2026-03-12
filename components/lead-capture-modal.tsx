"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, ArrowRight, Building2, Euro, MapPin, Mail, Shield, User, Loader2, Sparkles, Clock, TrendingUp, Search, Phone } from "lucide-react"
import { PhoneInput } from "@/components/phone-input"
import confetti from "canvas-confetti"
import Image from "next/image"
import { collectTrackingData, type TrackingData } from "@/lib/tracking-utils"
import { useCompany } from "@/contexts/company-context"

interface Prediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

interface LeadCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  source?: string
  prefilledData?: {
    investment?: number
    plz?: string
    company?: string
    ownerFirstName?: string
    ownerLastName?: string
    industry?: string
    ownerRole?: string
    mainActivity?: string
    // Rechner-Daten
    investitionsart?: string
    investitionsartLabel?: string
    bundesland?: string
    foerdersatz?: number
    foerderbetrag?: number
    istJunglandwirt?: boolean
    istOeko?: boolean
  }
}

const fundingRegions: Record<string, { region: string; type: "C" | "D" | "none"; bonus: number }> = {
  "44": { region: "Dortmund", type: "C", bonus: 10 },
  "45": { region: "Essen/Mülheim", type: "C", bonus: 10 },
  "46": { region: "Oberhausen/Bottrop", type: "C", bonus: 10 },
  "47": { region: "Duisburg", type: "C", bonus: 10 },
  "58": { region: "Hagen/Iserlohn", type: "C", bonus: 10 },
  "59": { region: "Hamm/Unna", type: "D", bonus: 5 },
  "06": { region: "Halle/Dessau", type: "C", bonus: 10 },
  "07": { region: "Gera/Jena", type: "C", bonus: 10 },
  "08": { region: "Zwickau/Plauen", type: "C", bonus: 10 },
  "09": { region: "Chemnitz", type: "C", bonus: 10 },
  "01": { region: "Dresden", type: "C", bonus: 10 },
  "02": { region: "Görlitz/Bautzen", type: "C", bonus: 10 },
  "03": { region: "Cottbus", type: "C", bonus: 10 },
  "04": { region: "Leipzig", type: "C", bonus: 10 },
  "14": { region: "Potsdam", type: "D", bonus: 5 },
  "15": { region: "Frankfurt/Oder", type: "C", bonus: 10 },
  "16": { region: "Oranienburg", type: "D", bonus: 5 },
  "17": { region: "Neubrandenburg", type: "C", bonus: 10 },
  "18": { region: "Rostock", type: "C", bonus: 10 },
  "19": { region: "Schwerin", type: "C", bonus: 10 },
  "38": { region: "Wolfsburg/Braunschweig", type: "D", bonus: 5 },
  "39": { region: "Magdeburg", type: "C", bonus: 10 },
  "98": { region: "Suhl/Ilmenau", type: "C", bonus: 10 },
  "99": { region: "Erfurt", type: "C", bonus: 10 },
}

// Investment range presets for card selection
const investmentRanges = [
  { label: "100k - 250k", value: 175000, min: "100.000", max: "250.000" },
  { label: "250k - 500k", value: 375000, min: "250.000", max: "500.000" },
  { label: "500k - 1 Mio", value: 750000, min: "500.000", max: "1.000.000" },
  { label: "1 Mio - 5 Mio", value: 3000000, min: "1.000.000", max: "5.000.000" },
  { label: "5 Mio +", value: 7500000, min: "5.000.000", max: "" },
]

// Mobile keyboard handling - scroll input into view
const scrollInputIntoView = (element: HTMLElement | null) => {
  if (!element) return
  setTimeout(() => {
    element.scrollIntoView({ behavior: "smooth", block: "center" })
  }, 100)
}

const WEBHOOK_URL = "/api/leads"

const WHATSAPP_NUMBER = "41763616062"
const WHATSAPP_MESSAGE = encodeURIComponent("Guten Tag, wir müssen investieren und hätten dafür gerne Fördermittel! :-) ")
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

// Psychological micro-confirmations - tailored to Landwirtschaft / AFP
const stepConfirmations = (firstName?: string, industry?: string) => [
  null, // Step 0
  {
    text: firstName ? `Willkommen, ${firstName}!` : "Super!",
    subtext: firstName
      ? "Schön, dass Sie den nächsten Schritt gehen – Patrick freut sich auf Ihre Anfrage."
      : "Wir bereiten Ihre persönliche Förderanalyse vor...",
  },
  {
    text: "Perfekt!",
    subtext: industry
      ? `Betriebe aus dem Bereich ${industry} sichern sich aktuell bis zu 50 % Zuschuss.`
      : "Landwirtschaftliche Betriebe mit Ihrem Profil erhalten oft maximale Förderquoten.",
  },
  {
    text: firstName ? `Sehr gut, ${firstName}!` : "Hervorragend!",
    subtext: "Patrick Starkmann wird Ihre Anfrage priorisiert bearbeiten – meist am gleichen Werktag.",
  },
  {
    text: "Wichtiger Schritt!",
    subtext: "Ein kurzes Telefongespräch verhindert 70 % der häufigsten Antragsfehler.",
  },
  {
    text: "Fast geschafft!",
    subtext: industry
      ? `Mehrere ${industry}-Betriebe haben 2026 bereits ihren Förderbescheid erhalten.`
      : "Ihr Standort wird auf volle Förderfähigkeit geprüft...",
  },
  null, // Final step - no confirmation
]

// Industry-specific social proof messages
const getIndustrySocialProof = (industry?: string): string => {
  if (!industry) return "Betriebe in Ihrer Branche"
  
  const industryLower = industry.toLowerCase()
  if (industryLower.includes("maschinenbau") || industryLower.includes("metall")) {
    return "Maschinenbau-Betriebe wie Ihrer"
  }
  if (industryLower.includes("it") || industryLower.includes("software")) {
    return "IT-Betriebe wie Ihrer"
  }
  if (industryLower.includes("elektro")) {
    return "Elektrotechnik-Betriebe"
  }
  if (industryLower.includes("kunststoff") || industryLower.includes("plastik")) {
    return "Kunststoffverarbeiter"
  }
  if (industryLower.includes("lebensmittel") || industryLower.includes("food")) {
    return "Lebensmittelproduzenten"
  }
  return `${industry}-Betriebe`
}

export function LeadCaptureModal({ isOpen, onClose, onSuccess, prefilledData, source }: LeadCaptureModalProps) {
  // Use shared form data from context
  const { company: contextCompany, analysis, sharedFormData, updateSharedFormData } = useCompany()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: sharedFormData.contactName || "",
    company: prefilledData?.company || contextCompany?.name || "",
    email: sharedFormData.email || "",
    phone: sharedFormData.phone || "",
    plz: prefilledData?.plz || contextCompany?.plz || "",
    investment: sharedFormData.investment || prefilledData?.investment?.toString() || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showWebhookError, setShowWebhookError] = useState(false)
  const [estimatedFunding, setEstimatedFunding] = useState(0)
  const [showMicroConfirm, setShowMicroConfirm] = useState(false)
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [showFinalTooltip, setShowFinalTooltip] = useState(false)
  const [tooltipDismissed, setTooltipDismissed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Sync form data to shared context when it changes
  useEffect(() => {
    if (formData.name || formData.email || formData.phone || formData.investment) {
      updateSharedFormData({
        contactName: formData.name,
        email: formData.email,
        phone: formData.phone,
        investment: formData.investment,
      })
    }
  }, [formData.name, formData.email, formData.phone, formData.investment, updateSharedFormData])
  
  // Pre-fill from shared context when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || sharedFormData.contactName || "",
        email: prev.email || sharedFormData.email || "",
        phone: prev.phone || sharedFormData.phone || "",
        investment: prev.investment || sharedFormData.investment || "",
        company: prev.company || contextCompany?.name || "",
        plz: prev.plz || contextCompany?.plz || "",
      }))
    }
  }, [isOpen, sharedFormData, contextCompany])
  
  // Collect tracking data when modal opens
  useEffect(() => {
    if (isOpen && !trackingData) {
      setTrackingData(collectTrackingData())
    }
  }, [isOpen, trackingData])
  
  // Google Places autocomplete state
  const [companyQuery, setCompanyQuery] = useState(prefilledData?.company || contextCompany?.name || "")
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showPredictions, setShowPredictions] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()

  const totalSteps = 6
  
  // Debounced company search
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
    } catch {
      setPredictions([])
    } finally {
      setIsSearching(false)
    }
  }, [])
  
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (currentStep === 2 && companyQuery.length >= 2) {
        searchCompanies(companyQuery)
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [companyQuery, searchCompanies, currentStep])
  
  const selectCompanyFromPrediction = async (prediction: Prediction) => {
    setCompanyQuery(prediction.structured_formatting.main_text)
    setFormData(prev => ({ ...prev, company: prediction.structured_formatting.main_text }))
    setPredictions([])
    setShowPredictions(false)
    
    try {
      const detailsResponse = await fetch(`/api/places/details?placeId=${prediction.place_id}`)
      const detailsData = await detailsResponse.json()
      
      if (detailsData.company) {
        // Auto-fill PLZ from Google Places
        if (detailsData.company.plz) {
          setFormData(prev => ({ 
            ...prev, 
            company: detailsData.company.name || prev.company,
            plz: detailsData.company.plz 
          }))
        }
      }
    } catch {
      // Silent fail - company name is still set
    }
  }

  useEffect(() => {
    if (prefilledData) {
      // Build full name from first and last name if available
      const fullName = prefilledData.ownerFirstName && prefilledData.ownerLastName
        ? `${prefilledData.ownerFirstName} ${prefilledData.ownerLastName}`
        : ""
      
      // Sync company query field with prefilled company
      if (prefilledData.company) {
        setCompanyQuery(prefilledData.company)
      }
      
      setFormData((prev) => ({
        ...prev,
        name: fullName || prev.name,
        company: prefilledData.company || prev.company,
        plz: prefilledData.plz || prev.plz,
        investment: prefilledData.investment?.toString() || prev.investment,
      }))
    }
  }, [prefilledData])

  const calculateFunding = useCallback(() => {
    // Prefer analysis data (from webhook) when available
    const analysisQuote = analysis?.fundingPotential?.maxQuote
    let rate = analysisQuote ? analysisQuote / 100 : 0.3
    
    if (!analysisQuote && formData.plz.length >= 2) {
      // Fallback to static estimate if no analysis
      const prefix = formData.plz.substring(0, 2)
      const region = fundingRegions[prefix]
      if (region) rate += region.bonus / 100
      rate += 0.1 // climate bonus estimate
    }
    
    if (formData.investment) {
      setEstimatedFunding(Number(formData.investment) * rate)
    }
  }, [formData.plz, formData.investment, analysis?.fundingPotential?.maxQuote])

  useEffect(() => {
    calculateFunding()
  }, [calculateFunding])

  useEffect(() => {
    if (inputRef.current && !showSuccess && isOpen && !showMicroConfirm) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [currentStep, showSuccess, isOpen, showMicroConfirm])

  // Show tooltip on final step after a short delay to catch attention
  useEffect(() => {
    if (currentStep === totalSteps && isStepValid() && !tooltipDismissed) {
      const timer = setTimeout(() => {
        setShowFinalTooltip(true)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      setShowFinalTooltip(false)
    }
  }, [currentStep, totalSteps, formData.investment, tooltipDismissed])

  const triggerConfetti = () => {
    // Helper: create emoji shape for canvas-confetti
    const emojiShape = (emoji: string) => {
      const size = 24
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><text y="${size * 0.9}" font-size="${size}">${emoji}</text></svg>`
      const url = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
      return confetti.shapeFromPath
        ? undefined // fallback to text path below
        : undefined
    }

    // Burst 1 — Tiere von oben links
    confetti({
      particleCount: 18,
      spread: 55,
      origin: { x: 0.2, y: 0 },
      shapes: ["text"],
      shapeOptions: {
        text: { value: ["🐄", "🐷", "🐔"] },
      },
      scalar: 2.2,
      gravity: 0.9,
      drift: 0.4,
      ticks: 220,
      zIndex: 99999,
    } as Parameters<typeof confetti>[0])

    // Burst 2 — Tiere von oben rechts
    confetti({
      particleCount: 18,
      spread: 55,
      origin: { x: 0.8, y: 0 },
      shapes: ["text"],
      shapeOptions: {
        text: { value: ["🐄", "🐷", "🐔"] },
      },
      scalar: 2.2,
      gravity: 0.9,
      drift: -0.4,
      ticks: 220,
      zIndex: 99999,
    } as Parameters<typeof confetti>[0])

    // Burst 3 — Weizen + Geld aus Mitte oben (verzögert)
    setTimeout(() => {
      confetti({
        particleCount: 20,
        spread: 80,
        origin: { x: 0.5, y: 0.1 },
        shapes: ["text"],
        shapeOptions: {
          text: { value: ["🌾", "💰", "🚜", "🌾", "💰"] },
        },
        scalar: 1.8,
        gravity: 0.7,
        ticks: 260,
        zIndex: 99999,
      } as Parameters<typeof confetti>[0])
    }, 350)

    // Burst 4 — klassisches grünes Konfetti als Hintergrundteppich
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors: ["#16a34a", "#22c55e", "#bbf7d0", "#fbbf24", "#fef9c3"],
        gravity: 0.6,
        ticks: 200,
        zIndex: 99998,
      })
    }, 150)
  }

  const getRegionInfo = () => {
    if (formData.plz.length >= 2) {
      const prefix = formData.plz.substring(0, 2)
      return fundingRegions[prefix]
    }
    return null
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.length >= 2
      case 2:
        return formData.company.length >= 2
      case 3:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      case 4:
        // Phone validation: at least 8 digits (without dial code)
        const phoneDigits = formData.phone.replace(/\D/g, "")
        return phoneDigits.length >= 8
      case 5:
        return formData.plz.length === 5
      case 6:
        return Number(formData.investment) >= 100000
      default:
        return false
    }
  }

  const handleNext = () => {
    if (!isStepValid()) return
    
    // Show micro-confirmation for steps 1-4
    if (currentStep < totalSteps && stepConfirmations(prefilledData?.ownerFirstName, prefilledData?.industry)?.[currentStep]) {
      setShowMicroConfirm(true)
      setTimeout(() => {
        setShowMicroConfirm(false)
        if (currentStep < totalSteps) {
          setCurrentStep(currentStep + 1)
        }
      }, 1200)
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const regionInfo = getRegionInfo()
    
    // Collect fresh tracking data at submission time
    const finalTrackingData = trackingData || collectTrackingData()

    // Generate a single, stable deduplication ID for this submission.
    // This guarantees n8n and GTM/Meta receive the EXACT same string.
    const internalEventId = `fz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    
    const payload = {
      // Lead data
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      plz: formData.plz,
      investment: Number(formData.investment),
      region: regionInfo?.region || "Unbekannt",
      regionType: regionInfo?.type || "none",
      estimatedFunding: estimatedFunding,
      source: "lead-modal",
      timestamp: new Date().toISOString(),
      
      // Prefilled context (from company analysis)
      prefilled_industry: prefilledData?.industry || null,
      prefilled_owner_name: prefilledData?.ownerFirstName && prefilledData?.ownerLastName 
        ? `${prefilledData.ownerFirstName} ${prefilledData.ownerLastName}` 
        : null,
      prefilled_main_activity: prefilledData?.mainActivity || null,

      // Rechner-Auswahl (AFP-spezifisch)
      rechner_investitionsart: prefilledData?.investitionsart || null,
      rechner_investitionsart_label: prefilledData?.investitionsartLabel || null,
      rechner_bundesland: prefilledData?.bundesland || null,
      rechner_foerdersatz: prefilledData?.foerdersatz ?? null,
      rechner_foerderbetrag: prefilledData?.foerderbetrag ?? null,
      rechner_junglandwirt: prefilledData?.istJunglandwirt ?? null,
      rechner_oeko: prefilledData?.istOeko ?? null,
      
      // Facebook Pixel tracking
      fbclid: finalTrackingData.fbclid,
      fbp: finalTrackingData.fbp,
      fbc: finalTrackingData.fbc,
      
      // UTM Parameters
      utm_source: finalTrackingData.utm_source,
      utm_medium: finalTrackingData.utm_medium,
      utm_campaign: finalTrackingData.utm_campaign,
      utm_content: finalTrackingData.utm_content,
      utm_term: finalTrackingData.utm_term,
      
      // Ad Platform IDs
      ad_id: finalTrackingData.ad_id,
      adset_id: finalTrackingData.adset_id,
      campaign_id: finalTrackingData.campaign_id,
      
      // Google Ads
      gclid: finalTrackingData.gclid,
      
      // TikTok
      ttclid: finalTrackingData.ttclid,
      
      // LinkedIn
      li_fat_id: finalTrackingData.li_fat_id,
      
      // Session tracking
      browser_id: finalTrackingData.browser_id,
      session_id: finalTrackingData.session_id,
      // Stable deduplication ID – identical in webhook payload and dataLayer
      gtm_event_id: internalEventId,
      
      // Additional context
      landing_page: finalTrackingData.landing_page,
      referrer: finalTrackingData.referrer,
      user_agent: finalTrackingData.user_agent,
    }

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        console.error("Webhook error: server returned", response.status)
        setIsSubmitting(false)
        setShowWebhookError(true)
        return
      }
    } catch (error) {
      console.error("Webhook error:", error)
      setIsSubmitting(false)
      setShowWebhookError(true)
      return
    }

    // Push lead_success event to dataLayer for GTM/Meta tracking (only on success).
    // TWO-STEP push: variables first, then the event trigger.
    // This guarantees GTM DLV - email / firstName / phone are populated BEFORE the trigger fires.
    if (typeof window !== 'undefined') {
      const firstName = formData.name.split(" ")[0]
      const lastName = formData.name.split(" ").slice(1).join(" ") || undefined
      window.dataLayer = window.dataLayer || []

      // Step 1: set all variables on root so GTM DLV resolves them
      window.dataLayer.push({
        email: formData.email,
        phone: formData.phone,
        firstName,
        lastName,
        event_id: internalEventId,
        user_data: {
          email: formData.email,
          phone: formData.phone,
          firstName,
          lastName,
        },
      })

      // Step 2: fire the trigger event
      window.dataLayer.push({
        event: 'lead_success',
      })
    }

    setIsSubmitting(false)
    setShowSuccess(true)
    triggerConfetti()

    // If called from rechner unlock: reveal result in-place, no redirect
    setTimeout(() => {
      if (source === "rechner-unlock" && onSuccess) {
        onSuccess()
        resetForm()
      } else {
        onClose()
        resetForm()
        window.location.href = "/danke"
      }
    }, 1200)
  }

  const resetForm = () => {
    setCurrentStep(1)
    setFormData({ name: "", company: "", email: "", phone: "", plz: "", investment: "" })
    setShowSuccess(false)
    setShowMicroConfirm(false)
    setShowWebhookError(false)
    setShowFinalTooltip(false)
    setTooltipDismissed(false)
  }

  const regionInfo = getRegionInfo()
  const fundingChance = Math.min(95, 60 + currentStep * 7 + (regionInfo ? 10 : 0))

  if (!isOpen) return null

  const stepConfig = [
    { icon: User, label: "Name", color: "from-violet-500 to-purple-500", borderColor: "border-violet-500", ringColor: "ring-violet-500/20" },
    { icon: Building2, label: "Firma", color: "from-blue-500 to-indigo-500", borderColor: "border-blue-500", ringColor: "ring-blue-500/20" },
    { icon: Mail, label: "E-Mail", color: "from-violet-500 to-purple-500", borderColor: "border-violet-500", ringColor: "ring-violet-500/20" },
    { icon: Phone, label: "Telefon", color: "from-red-500 to-orange-500", borderColor: "border-red-500", ringColor: "ring-red-500/20" },
    { icon: MapPin, label: "PLZ", color: "from-orange-500 to-red-500", borderColor: "border-orange-500", ringColor: "ring-orange-500/20" },
    { icon: Euro, label: "Investition", color: "from-violet-500 to-cyan-500", borderColor: "border-violet-500", ringColor: "ring-violet-500/20" },
  ]

  const currentConfig = stepConfig[currentStep - 1]
  const CurrentIcon = currentConfig?.icon || User

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm safe-area-bottom"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Modal: Bottom sheet on mobile, centered on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: "calc(100dvh - env(safe-area-inset-top, 0px) - 16px)", height: "auto" }}
        >
          {/* Header - with drag handle for mobile */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-5 pt-3 sm:pt-4 pb-3 sm:pb-4">
            {/* Drag handle for mobile bottom sheet */}
            <div className="sm:hidden flex justify-center mb-2">
              <div className="w-10 h-1 bg-slate-600 rounded-full" />
            </div>
            
            <button
              onClick={onClose}
              className="absolute right-2 sm:right-3 top-2 sm:top-3 p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 touch-target"
              aria-label="Schliessen"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
              {/* Patrick mini avatar */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-purple-500 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/patrick-starkmann.webp"
                  alt="Patrick Starkmann"
                  width={40}
                  height={40}
                  className="object-cover object-top w-full h-full"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] text-green-400 font-medium">Patrick Starkmann ist online</span>
                </div>
                {/* Hyperpersonalized headline */}
                {prefilledData?.ownerFirstName && prefilledData?.ownerLastName ? (
                  <h2 className="text-base font-bold text-white">
                    {prefilledData.ownerFirstName}, Ihre Prüfung wartet
                  </h2>
                ) : prefilledData?.company ? (
                  <h2 className="text-base font-bold text-white">
                    Prüfung für {prefilledData.company}
                  </h2>
                ) : (
                  <h2 className="text-base font-bold text-white">Förderfähigkeit prüfen</h2>
                )}
              </div>
            </div>
            
            {/* Personalized industry social proof */}
            {prefilledData?.industry && (
              <div className="flex items-center gap-2 mb-2 bg-purple-500/10 rounded-lg px-3 py-1.5 border border-purple-500/20">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span className="text-[10px] text-purple-300">
                  {getIndustrySocialProof(prefilledData.industry)} erhalten aktuell bevorzugt Fördermittel
                </span>
              </div>
            )}

            {/* Progress bar */}
            <div className="flex gap-1 mb-2">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${idx < currentStep ? "bg-violet-500" : idx === currentStep - 1 ? "bg-violet-500" : "bg-slate-700"}`}
                />
              ))}
            </div>

            {/* Funding chance indicator */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Schritt {currentStep} von {totalSteps}</span>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-violet-400" />
                <span className="text-[10px] text-violet-400 font-medium">Förderchance: {fundingChance}%</span>
              </div>
            </div>
          </div>

          {/* Hidden field for GTM Event ID - GTM writes {{JS - Event ID}} here */}
          <input 
            type="hidden" 
            id="gtm_event_id" 
            name="gtm_event_id" 
            data-gtm-form-interact-field-id="gtm_event_id"
          />

          {/* Content - keyboard-aware scroll */}
          <div
            className="p-4 sm:p-5 overflow-y-auto overscroll-contain touch-scroll flex-1"
            style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))" }}
          >
            <AnimatePresence mode="wait">
              {/* Micro-confirmation overlay */}
              {showMicroConfirm && stepConfirmations(prefilledData?.ownerFirstName, prefilledData?.industry)?.[currentStep] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-14 h-14 mx-auto mb-3 rounded-full bg-violet-100 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-7 h-7 text-violet-600" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{stepConfirmations(prefilledData?.ownerFirstName, prefilledData?.industry)?.[currentStep]?.text}</h3>
                  <p className="text-sm text-slate-500">{stepConfirmations(prefilledData?.ownerFirstName, prefilledData?.industry)?.[currentStep]?.subtext}</p>
                </motion.div>
              )}

              {/* Success screen */}
              {showSuccess && !showMicroConfirm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-100 flex items-center justify-center">
                      <CheckCircle2 className="w-9 h-9 text-violet-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Anfrage erfolgreich!</h3>
                  
                  {/* Patrick confirmation */}
                  <div className="flex items-center justify-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-violet-100">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/patrick-starkmann.webp"
                        alt="Patrick Starkmann"
                        width={40}
                        height={40}
                        className="object-cover object-top w-full h-full"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-500">Patrick Starkmann</p>
                      <p className="text-sm font-medium text-slate-800">prüft Ihre Anfrage heute noch</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <p className="text-sm font-semibold text-emerald-800">Anfrage erfolgreich gesendet!</p>
                    </div>
                    <p className="text-xs text-emerald-700 text-center">
                      Patrick wird Ihre Förderfähigkeit persönlich prüfen und sich innerhalb von 24 Stunden bei Ihnen melden.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Sie werden in Kürze weitergeleitet...</span>
                  </div>
                </motion.div>
              )}

              {/* Webhook error screen with WhatsApp fallback */}
              {showWebhookError && !showMicroConfirm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-9 h-9 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Anfrage konnte nicht gesendet werden</h3>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Leider gab es ein technisches Problem beim Versenden Ihrer Anfrage. 
                    Aber kein Problem &ndash; nutzen Sie den direkten Draht zu uns per WhatsApp!
                  </p>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 w-full px-6 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current flex-shrink-0" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Per WhatsApp kontaktieren
                  </a>

                  <p className="text-xs text-slate-400 mt-4">
                    +41 76 361 60 62
                  </p>

                  <button
                    onClick={() => {
                      setShowWebhookError(false)
                      setCurrentStep(totalSteps)
                    }}
                    className="mt-4 text-sm text-violet-600 hover:text-violet-800 underline underline-offset-2 transition-colors"
                  >
                    Erneut versuchen
                  </button>
                </motion.div>
              )}

              {/* Form steps */}
              {!showSuccess && !showMicroConfirm && !showWebhookError && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Step 1: Name */}
                  {currentStep === 1 && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2 sm:mb-3">Wie heissen Sie?</label>
                      <input
                        ref={inputRef}
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleNext()}
                        onFocus={(e) => scrollInputIntoView(e.target)}
                        className="w-full px-3 sm:px-4 py-3.5 sm:py-4 text-base border-2 border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all touch-target no-tap-zoom"
                        placeholder="Max Mustermann"
                        autoComplete="name"
                        autoCapitalize="words"
                      />
                      {prefilledData?.ownerFirstName ? (
                        <p className="text-xs text-purple-600 mt-2">Name aus Firmenrecherche vorausgefüllt - Sie können ihn anpassen</p>
                      ) : (
                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                          <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Ihre Daten sind 100% sicher und werden nicht weitergegeben</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 2: Company with Google Places Autocomplete */}
                  {currentStep === 2 && (
                    <div className="relative">
                      <label className="block text-sm font-semibold text-slate-900 mb-2 sm:mb-3">
                        Für welche Firma planen Sie die Investition?
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                        <input
                          ref={inputRef}
                          type="text"
                          value={companyQuery}
                          onChange={(e) => {
                            setCompanyQuery(e.target.value)
                            setFormData({ ...formData, company: e.target.value })
                            setShowPredictions(true)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && predictions.length === 0) handleNext()
                          }}
                          onFocus={(e) => {
                            scrollInputIntoView(e.target)
                            setShowPredictions(true)
                          }}
                          onBlur={() => setTimeout(() => setShowPredictions(false), 200)}
                          className="w-full pl-10 sm:pl-12 pr-10 py-3.5 sm:py-4 text-base border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all touch-target no-tap-zoom"
                          placeholder="Firmenname eingeben..."
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                        />
                        {isSearching && (
                          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
                        )}
                      </div>
                      
                      {/* Predictions dropdown */}
                      <AnimatePresence>
                        {showPredictions && predictions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-h-48 overflow-y-auto"
                          >
                            {predictions.map((prediction) => (
                              <button
                                key={prediction.place_id}
                                type="button"
                                onClick={() => selectCompanyFromPrediction(prediction)}
                                className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-start gap-3 border-b border-slate-100 last:border-0"
                              >
                                <Building2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="font-medium text-slate-900 text-sm truncate">
                                    {prediction.structured_formatting.main_text}
                                  </p>
                                  <p className="text-xs text-slate-500 truncate">
                                    {prediction.structured_formatting.secondary_text}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {prefilledData?.company ? (
                        <p className="text-xs text-purple-600 mt-2">Firma aus Ihrer Suche vorausgefüllt - Sie können sie anpassen</p>
                      ) : (
                        <p className="text-xs text-slate-400 mt-2">Geben Sie den Firmennamen ein - PLZ wird automatisch erkannt</p>
                      )}
                    </div>
                  )}

                  {/* Step 3: Email */}
                  {currentStep === 3 && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2 sm:mb-3">
                        Wohin dürfen wir das Ergebnis senden?
                      </label>
                      <input
                        ref={inputRef}
                        type="email"
                        inputMode="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleNext()}
                        onFocus={(e) => scrollInputIntoView(e.target)}
                        className="w-full px-3 sm:px-4 py-3.5 sm:py-4 text-base border-2 border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all touch-target no-tap-zoom"
                        placeholder="ihre@email.de"
                        autoComplete="email"
                        autoCapitalize="off"
                        autoCorrect="off"
                      />
                      <div className="flex items-center gap-2 mt-3 p-2.5 bg-slate-50 rounded-lg">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/patrick-starkmann.webp"
                            alt="Patrick"
                            width={24}
                            height={24}
                            className="object-cover object-top w-full h-full"
                          />
                        </div>
                        <p className="text-xs text-slate-600">Patrick Starkmann prüft Ihre Anfrage persönlich</p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Phone - EXTREM WICHTIG */}
                  {currentStep === 4 && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-4">
                        Die beste Mobilfunknummer
                      </label>
                      <PhoneInput
                        ref={inputRef}
                        value={formData.phone}
                        onChange={(formatted, fullNumber, isValid) => {
                          setFormData({ ...formData, phone: fullNumber })
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleNext()}
                        onFocus={(e) => scrollInputIntoView(e.target as HTMLElement)}
                        showImportantBadge={true}
                        autoFocus={true}
                      />
                      <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-amber-800">Warum Ihre Mobilnummer?</p>
                            <p className="text-xs text-amber-700 mt-1">
                              Patrick Starkmann ruft Sie persönlich an - so können wir Ihren Förderanspruch 3x schneller klären als per E-Mail.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: PLZ */}
                  {currentStep === 5 && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">
                        Wo befindet sich der Investitionsstandort?
                      </label>
                      {formData.plz && formData.plz.length === 5 && (
                        <p className="text-xs text-green-700 mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          PLZ automatisch aus Firmenadresse erkannt
                        </p>
                      )}
                      <input
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        value={formData.plz}
                        onChange={(e) => setFormData({ ...formData, plz: e.target.value.replace(/\D/g, "") })}
                        onKeyDown={(e) => e.key === "Enter" && handleNext()}
                        onFocus={(e) => scrollInputIntoView(e.target)}
                        className={`w-full px-4 py-4 text-base border-2 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all touch-manipulation text-center text-xl tracking-widest font-mono ${formData.plz && formData.plz.length === 5 ? "border-green-400 bg-green-50/40" : "border-slate-200"}`}
                        placeholder="45127"
                        autoComplete="postal-code"
                      />
                      {formData.plz.length === 5 && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200"
                        >
                          <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            PLZ erkannt — Bundesland wird im Beratungsgespräch berücksichtigt
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Step 6: Investment - Card Selection */}
                  {currentStep === 6 && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">
                        Wie hoch ist Ihre geplante Investition?
                      </label>

                      {/* Vom Rechner übernommen — keine erneute Eingabe nötig */}
                      {prefilledData?.investment && (
                        <div className="mb-4 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-0.5">Aus dem Förderrechner übernommen</p>
                            <p className="text-base font-extrabold text-emerald-800">
                              {Number(prefilledData.investment).toLocaleString("de-DE")} €
                            </p>
                            {prefilledData.foerderbetrag && (
                              <p className="text-xs text-emerald-600 mt-0.5">
                                Geschätzter Förderbetrag: <span className="font-bold">{Number(prefilledData.foerderbetrag).toLocaleString("de-DE")} €</span>
                              </p>
                            )}
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, investment: "" })}
                              className="text-xs text-emerald-600 underline underline-offset-2 mt-1.5 hover:text-emerald-800 transition-colors"
                            >
                              Betrag ändern
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Karten-Auswahl — nur wenn KEIN Rechner-Wert vorhanden oder User hat "ändern" geklickt */}
                      {!prefilledData?.investment && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {investmentRanges.map((range) => (
                            <motion.button
                              key={range.label}
                              type="button"
                              onClick={() => setFormData({ ...formData, investment: range.value.toString() })}
                              className={`p-3 rounded-xl border-2 text-left transition-all touch-manipulation ${
                                Number(formData.investment) === range.value
                                  ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20"
                                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className={`text-sm font-semibold ${Number(formData.investment) === range.value ? "text-emerald-700" : "text-slate-700"}`}>
                                {range.label}
                              </span>
                              <span className="block text-xs text-slate-400 mt-0.5">EUR</span>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Datenschutz-Hinweis (nur auf letztem Schritt) */}
                  {currentStep === totalSteps && (
                    <p className="mt-5 text-center text-xs text-slate-400 leading-relaxed">
                      Mit dem Absenden stimmen Sie unserer{" "}
                      <a
                        href="/datenschutz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-violet-500 transition-colors"
                      >
                        Datenschutzerklärung
                      </a>{" "}
                      zu. Keine Weitergabe an Dritte.
                    </p>
                  )}

                  {/* CTA Button with psychological tooltip on final step */}
                  {currentStep === totalSteps ? (
                    <div className="relative mt-3">
                      {/* Psychological Tooltip - appears after delay */}
                      <AnimatePresence>
                        {showFinalTooltip && isStepValid() && !isSubmitting && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.98 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[92%] max-w-xs z-10"
                          >
                            <div className="bg-slate-900 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-xl border border-slate-700 relative">
                              <button 
                                onClick={() => setTooltipDismissed(true)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-semibold text-amber-400 mb-0.5">Fast geschafft!</p>
                                  <p className="text-slate-300 leading-snug">
                                    Mit Klick auf den Button sichern Sie sich Ihren persönlichen Beratungstermin. Patrick meldet sich innerhalb von 24h.
                                  </p>
                                </div>
                              </div>
                              {/* Arrow pointing down */}
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-900" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.button
                        onClick={handleNext}
                        disabled={!isStepValid() || isSubmitting}
                        className={`relative w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 overflow-hidden touch-manipulation transition-all ${
                          isStepValid()
                            ? "bg-gradient-to-r from-violet-600 to-purple-600 shadow-[0_0_22px_rgba(139,92,246,0.55)]"
                            : "bg-slate-300 cursor-not-allowed"
                        }`}
                        animate={
                          isStepValid() && !isSubmitting
                            ? {
                                scale: [1, 1.025, 1],
                                boxShadow: [
                                  "0 0 18px rgba(139,92,246,0.45)",
                                  "0 0 36px rgba(139,92,246,0.85)",
                                  "0 0 18px rgba(139,92,246,0.45)",
                                ],
                              }
                            : {}
                        }
                        transition={
                          isStepValid() && !isSubmitting
                            ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                            : {}
                        }
                        whileTap={isStepValid() ? { scale: 0.97 } : {}}
                      >
                        {/* Shine sweep */}
                        {isStepValid() && !isSubmitting && (
                          <motion.span
                            className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
                            aria-hidden="true"
                          >
                            <motion.span
                              className="absolute top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                              animate={{ x: ["-150%", "350%"] }}
                              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
                            />
                          </motion.span>
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Wird gesendet...
                            </>
                          ) : (
                            <>
                              Jetzt Beratungstermin sichern
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </span>
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      onClick={handleNext}
                      disabled={!isStepValid() || isSubmitting}
                      className={`w-full mt-5 py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all touch-manipulation ${
                        isStepValid()
                          ? `bg-gradient-to-r ${currentConfig.color} hover:opacity-90 shadow-lg shadow-violet-500/20`
                          : "bg-slate-300 cursor-not-allowed"
                      }`}
                      whileTap={isStepValid() ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Wird gesendet...
                        </>
                      ) : (
                        <>
                          Weiter
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  )}

                  {/* Trust elements */}
                  {currentStep === totalSteps && (
                    <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL-verschlüsselt</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Antwort in 24h</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
