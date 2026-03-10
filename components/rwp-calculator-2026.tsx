"use client"

import React, { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  MapPin,
  Leaf,
  Calculator,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Euro,
  Info,
  HelpCircle,
  Sparkles,
  Factory,
  Users,
  TrendingUp,
  Shield,
  Battery,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadCaptureModal } from "./lead-capture-modal"
import { useCompany } from "@/contexts/company-context"

// ============================================================================
// Regional-Förderung 2026 TYPES
// ============================================================================

type CompanySize = "KU" | "MU" | "GU" // Klein, Mittel, Groß
type FundingRegion = "C" | "C+" | "D" | "NONE" // C-Gebiet, C+-Gebiet (Grenzzuschlag), D-Gebiet, Kein Fördergebiet
type ProjectType = "REGIONAL" | "UMWELT" | "ENERGIE" | "EE" | "EE_SPEICHER" // Pfade: Regional (A), Umweltschutz (C1), Energieeffizienz (C2), Erneuerbare Energie (B), EE-Speicher (B)

interface CalculatorState {
  // Step 1: Company Size
  employees: number
  revenue: number // in Mio €
  balanceSheet: number // in Mio €
  
  // Step 2: Location
  plz: string
  region: FundingRegion
  city: string
  isAAngrenzend: boolean // A-Angrenzungsbonus (nur C-Gebiete)
  hasBevoelkerungsBonus: boolean // Bevölkerungsbonus +5 PP
  
  // Step 3: Project Type
  projectType: ProjectType
  isGUDiversification: boolean // Only for GU: new site or diversification?
  
  // Step 4: Investment
  investmentAmount: number
  avgDepreciation: number // Durchschnittliche AfA der letzten 3 Jahre
  
  // Calculated
  companySize: CompanySize | null
}

interface CalculationResult {
  isEligible: boolean
  rejectionReason: string | null
  quote: number
  maxCap: number | null
  rawSubsidy: number
  finalSubsidy: number
  warnings: string[]
  minInvestRequired: number
  investmentSurplus: number
}

// ============================================================================
// Regional-Förderung 2026 CALCULATION LOGIC (EXACT AS PER DOCUMENTATION)
// ============================================================================

const determineCompanySize = (employees: number, revenue: number, balanceSheet: number): CompanySize => {
  // KU: <50 MA, ≤10 Mio Umsatz ODER ≤10 Mio Bilanzsumme
  if (employees < 50 && (revenue <= 10 || balanceSheet <= 10)) {
    return "KU"
  }
  // MU: <250 MA, ≤50 Mio Umsatz ODER ≤43 Mio Bilanzsumme
  if (employees < 250 && (revenue <= 50 || balanceSheet <= 43)) {
    return "MU"
  }
  // GU: Everything else
  return "GU"
}

const calculateRWP2026 = (state: CalculatorState): CalculationResult => {
  const warnings: string[] = []
  const size = state.companySize || determineCompanySize(state.employees, state.revenue, state.balanceSheet)
  
  // ============================================
  // STEP 1: CHECK ELIGIBILITY (GATEKEEPER)
  // ============================================
  
  // 1a: Investment threshold check (AfA-Hürde)
  let minInvestMultiplier = 1.50 // Standard: +50% über AfA
  const isClimateProject = state.projectType !== "REGIONAL" // EE, EE_SPEICHER, UMWELT, ENERGIE
  if (size === "KU" || isClimateProject) {
    minInvestMultiplier = 1.25 // KU oder Klima-/Energieprojekte: nur +25%
  }
  
  const minInvestRequired = Math.round(state.avgDepreciation * minInvestMultiplier)
  const investmentSurplus = state.investmentAmount - minInvestRequired
  
  if (state.investmentAmount < minInvestRequired && state.avgDepreciation > 0) {
    return {
      isEligible: false,
      rejectionReason: `Investition liegt unter der Mindestgrenze. Sie müssen mindestens ${minInvestRequired.toLocaleString("de-DE")} € investieren (${Math.round((minInvestMultiplier - 1) * 100)}% über Ihrem AfA-Durchschnitt von ${state.avgDepreciation.toLocaleString("de-DE")} €).`,
      quote: 0,
      maxCap: null,
      rawSubsidy: 0,
      finalSubsidy: 0,
      warnings: ["Diese Investition gilt als reine Ersatzinvestition und ist nicht förderfähig."],
      minInvestRequired,
      investmentSurplus,
    }
  }
  
  // 1b: GU Restrictions
  if (size === "GU" && !state.isGUDiversification && state.projectType === "REGIONAL") {
    return {
      isEligible: false,
      rejectionReason: "Großunternehmen erhalten keine Förderung für reine Kapazitätserweiterungen. Nur Diversifizierung oder neue Betriebsstätten sind förderfähig.",
      quote: 0,
      maxCap: null,
      rawSubsidy: 0,
      finalSubsidy: 0,
      warnings: [],
      minInvestRequired,
      investmentSurplus,
    }
  }
  
  if (size === "GU" && state.region === "D" && state.projectType === "REGIONAL") {
    return {
      isEligible: false,
      rejectionReason: "Großunternehmen im D-Gebiet sind für Standard-Projekte ausgeschlossen. Nur Klima-/Energieprojekte (Umweltschutz, Energieeffizienz, Erneuerbare Energien) sind hier förderfähig.",
      quote: 0,
      maxCap: null,
      rawSubsidy: 0,
      finalSubsidy: 0,
      warnings: [],
      minInvestRequired,
      investmentSurplus,
    }
  }
  
  // Region check
  if (state.region === "NONE") {
    return {
      isEligible: false,
      rejectionReason: "Ihr Standort liegt nicht in einem Fördergebiet. Die Regional-Förderung gilt nur für C-, C+- und D-Fördergebiete in Deutschland.",
      quote: 0,
      maxCap: null,
      rawSubsidy: 0,
      finalSubsidy: 0,
      warnings: [],
      minInvestRequired,
      investmentSurplus,
    }
  }
  
  // Normalize C+ to C for isCGebiet checks (C+ is a C-Gebiet with extra bonus)
  const isCGebiet = state.region === "C" || state.region === "C+"
  const isCPlusGebiet = state.region === "C+"
  
  // ============================================
  // STEP 2: DETERMINE FUNDING QUOTE (WAHRHEITSTABELLE)
  // ============================================
  
  let quote = 0
  let maxQuote = 65 // Absolute maximum (Umweltschutz Klein in C-Gebiet)
  
  if (state.projectType === "EE") {
    // PFAD B: Erneuerbare Energie - Erzeugung (Art. 41 AGVO) - GEBIETSUNABHÄNGIG!
    // Energieerzeugung (PV, Wind, Wärmepumpe): Basis 45%
    // KEIN C-Gebiets-Bonus bei Art. 41!
    switch (size) {
      case "KU": quote = 65; break // 45% + 20% KMU-Bonus
      case "MU": quote = 55; break // 45% + 10% KMU-Bonus
      case "GU": quote = 45; break
    }
    warnings.push("Erneuerbare Energien - Erzeugung: Gilt gebietsunabhängig in C- und D-Fördergebieten.")
    maxQuote = 65
    
  } else if (state.projectType === "EE_SPEICHER") {
    // PFAD B: Erneuerbare Energie - Stromspeicher (Art. 41 AGVO) - GEBIETSUNABHÄNGIG!
    // Stromspeicher (≥75% aus EE): Basis 30%
    // KEIN C-Gebiets-Bonus bei Art. 41!
    switch (size) {
      case "KU": quote = 50; break // 30% + 20% KMU-Bonus
      case "MU": quote = 40; break // 30% + 10% KMU-Bonus
      case "GU": quote = 30; break
    }
    warnings.push("Stromspeicher muss zu mind. 75% aus erneuerbaren Quellen gespeist werden.")
    maxQuote = 50
    
  } else if (state.projectType === "UMWELT") {
    // PFAD C1: Umweltschutz (Art. 36 AGVO) - Nr. 2.4.3.1
    // Basis: 40%, +20% für Klein, +10% für Mittel
    // C/C+-Gebiet: +5% Bonus (C+ ist ein C-Gebiet)
    const cBonus = isCGebiet ? 5 : 0
    switch (size) {
      case "KU": quote = 60 + cBonus; break // 40% + 20% = 60%, max 65% in C
      case "MU": quote = 50 + cBonus; break // 40% + 10% = 50%, max 55% in C
      case "GU": quote = 40 + cBonus; break // 40%, max 45% in C
    }
    warnings.push("Umweltschutz: Nur Mehrkosten gegenüber Standardinvestition förderfähig.")
    maxQuote = 65
    
  } else if (state.projectType === "ENERGIE") {
    // PFAD C2: Energieeffizienz (Art. 38 AGVO) - Nr. 2.4.3.2
    // Basis: 30%, +20% für Klein, +10% für Mittel
    // C/C+-Gebiet: +5% Bonus (C+ ist ein C-Gebiet)
    const cBonus = isCGebiet ? 5 : 0
    switch (size) {
      case "KU": quote = 50 + cBonus; break // 30% + 20% = 50%, max 55% in C
      case "MU": quote = 40 + cBonus; break // 30% + 10% = 40%, max 45% in C
      case "GU": quote = 30 + cBonus; break // 30%, max 35% in C
    }
    warnings.push("Energieeffizienz: Nur Mehrkosten gegenüber Standardinvestition förderfähig.")
    maxQuote = 55
    
  } else {
    // PFAD A: REGIONALE INVESTITIONSBEIHILFEN (Nr. 2.4.1/2.4.2)
    // Wahrheitstabelle: D-Gebiet hat feste Werte, C-Gebiet basiert auf Groß + Aufschläge
    
    if (state.region === "D") {
      // D-GEBIET: PFAD D De-minimis Förderung (VO 2023/2831)
      // Basis: 30%/20%/10% + De-minimis-Aufschlag +20% = 50%/40%/30%
      // Max. Investitionen: Klein 600k€, Mittel 750k€, Groß 1.000k€
      
      const deMinimisLimits: Record<CompanySize, number> = {
        KU: 600000,
        MU: 750000,
        GU: 1000000,
      }
      const maxInvestForDeMinimis = deMinimisLimits[size]
      const isDeMinimisEligible = state.investmentAmount <= maxInvestForDeMinimis
      
      // Basis-Werte (Nr. 2.5.1 Abs. 1b)
      const basisQuotes: Record<CompanySize, number> = {
        KU: 30,
        MU: 20,
        GU: 10,
      }
      
      if (isDeMinimisEligible) {
        // Mit De-minimis Aufschlag (+20%)
        quote = basisQuotes[size] + 20
        warnings.push(`De-minimis aktiv: Basis ${basisQuotes[size]}% + 20% Aufschlag = ${quote}%. Max. Beihilfe: 300.000€/3 Jahre.`)
        maxQuote = 50
      } else {
        // Ohne De-minimis - nur Art. 17 AGVO Basis
        switch (size) {
          case "KU": quote = 20; break
          case "MU": quote = 10; break
          case "GU": quote = 0; break // GU in D ohne De-minimis = nicht förderfähig
        }
        if (size === "GU") {
          warnings.push("Großunternehmen in D-Gebieten: Nur über Klima-/Energieprojekte förderfähig.")
        } else {
          warnings.push(`Investment über De-minimis-Grenze (${maxInvestForDeMinimis.toLocaleString("de-DE")}€): Reduzierte Quote nach Art. 17.`)
        }
        maxQuote = 20
      }
      
    } else if (isCGebiet) {
      // C/C+-GEBIET: Wahrheitstabelle Fall 4-7
      // Basis: Großunternehmen-Wert, dann +10 PP für Mittel, +20 PP für Klein
      
      // Basiswert für Groß bestimmen (Fall 4 oder 5)
      let basisGross = 15 // Standard C-Gebiet ohne A-Angrenzung (meist 10-15%)
      
      if (state.isAAngrenzend) {
        basisGross = 20 // Fall 5: A-Angrenzungs-Bonus hebt Basis für Groß auf ~20%
        warnings.push("A-Angrenzungs-Bonus aktiv: Erhöhter Basiswert für Großunternehmen")
      }
      
      // Grenzzuschlag (+10 PP) bei C+-Gebiet (gem. Rn. 184 Regionalbeihilfeleitlinien)
      const grenzzuschlag = isCPlusGebiet ? 10 : 0
      
      // Bevölkerungsbonus (+5 PP) wenn aktiviert
      const bevoelkerungsBonus = state.hasBevoelkerungsBonus ? 5 : 0
      
      switch (size) {
        case "GU": 
          quote = basisGross + grenzzuschlag + bevoelkerungsBonus // Fall 4/5 + C+ Zuschlag
          break
        case "MU": 
          quote = basisGross + 10 + grenzzuschlag + bevoelkerungsBonus // Fall 6: Groß + 10 PP + C+ Zuschlag
          break
        case "KU": 
          quote = basisGross + 20 + grenzzuschlag + bevoelkerungsBonus // Fall 7: Groß + 20 PP + C+ Zuschlag
          break
      }
      
      if (isCPlusGebiet) {
        warnings.push(`C+-Grenzzuschlag (+10 PP) aktiv gem. Rn. 184 Regionalbeihilfeleitlinien`)
      }
      if (state.hasBevoelkerungsBonus) {
        warnings.push("Bevölkerungsbonus (+5 PP) aktiv")
      }
      
      maxQuote = isCPlusGebiet ? 55 : 50 // Max für C+-Gebiet bzw. C-Gebiet
    }
  }
  
  // Hard cap check
  if (quote > maxQuote) {
    quote = maxQuote
    warnings.push(`Förderquote auf maximal ${maxQuote}% begrenzt (EU-Beihilferecht)`)
  }
  
  // ============================================
  // STEP 3: CALCULATE SUBSIDY & APPLY CAPS
  // ============================================
  
  const rawSubsidy = Math.round(state.investmentAmount * (quote / 100))
  let finalSubsidy = rawSubsidy
  let maxCap: number | null = null
  
  // Apply caps based on project type and company size
  if (state.projectType !== "REGIONAL") {
    // Umwelt/Effizienz/EE: Max 30 Mio€ Beihilfe pro Vorhaben
    maxCap = 30000000
    if (rawSubsidy > maxCap) {
      finalSubsidy = maxCap
      warnings.push(`Förderung auf ${maxCap.toLocaleString("de-DE")} € gedeckelt (Obergrenze Umwelt/EE nach Art. 4(1)s AGVO)`)
    }
  } else if (size !== "GU" && state.region === "D") {
    // D-Gebiet KMU: Max 8,25 Mio€ pro Unternehmen+Vorhaben
    maxCap = 8250000
    if (rawSubsidy > maxCap) {
      finalSubsidy = maxCap
      warnings.push(`Förderung auf ${maxCap.toLocaleString("de-DE")} € gedeckelt (D-Gebiet KMU-Maximum nach Art. 17)`)
    }
  } else if (size === "GU" && state.region === "C") {
    // C-Gebiet GU: Einzelnotifizierung ab 55 Mio€ Beihilfe
    if (rawSubsidy > 55000000) {
      warnings.push("Hinweis: Bei Beihilfen ab 55 Mio€ ist eine EU-Einzelnotifizierung erforderlich (Nr. 2.5.1 Fußn. 33)")
    }
  }
  
  // De-minimis cap check (Pfad D)
  // Max. Investitionen bei De-minimis: Klein 600k€, Mittel 750k€, Groß 1.000k€
  if (state.region === "D" && state.projectType === "REGIONAL") {
    const deMinimisInvestLimits: Record<CompanySize, number> = {
      KU: 600000,
      MU: 750000,
      GU: 1000000,
    }
    const maxInvestForDeMinimis = deMinimisInvestLimits[size]
    
    if (state.investmentAmount <= maxInvestForDeMinimis) {
      const deMinimisMax = 300000 // 300.000€ über 3 Jahre rollierend
      if (finalSubsidy > deMinimisMax) {
        finalSubsidy = deMinimisMax
        warnings.push(`De-minimis-Obergrenze: Max. 300.000€ über 3 Jahre (rollierend). Prüfen Sie Vorförderungen!`)
      }
    } else {
      // Investment zu hoch für De-minimis-Quote, normale D-Gebiet-Quote ohne Aufschlag
      warnings.push(`Hinweis: Bei Investments über ${maxInvestForDeMinimis.toLocaleString("de-DE")}€ entfällt der De-minimis-Aufschlag (+20%).`)
    }
  }
  
  return {
    isEligible: true,
    rejectionReason: null,
    quote,
    maxCap,
    rawSubsidy,
    finalSubsidy,
    warnings,
    minInvestRequired,
    investmentSurplus,
  }
}

// ============================================================================
// PLZ LOOKUP VIA WEBHOOK (replaces static PLZ database)
// ============================================================================

const lookupPLZViaWebhook = async (plz: string): Promise<{ city: string; region: FundingRegion } | null> => {
  if (plz.length !== 5) return null
  
  try {
    const response = await fetch(`/api/foerdergebiet?plz=${plz}`)
    const data = await response.json()
    
    const code = data.code || "N"
    let region: FundingRegion = "NONE"
    if (code === "C") region = "C"
    else if (code === "C+") region = "C+"
    else if (code === "D") region = "D"
    else region = "NONE"
    
    // Try to get city name from geocode
    let cityName = `PLZ ${plz}`
    try {
      const geoResponse = await fetch(`/api/places/geocode?plz=${plz}`)
      const geoData = await geoResponse.json()
      if (geoData.city) cityName = geoData.city
    } catch {
      // City lookup failed, use PLZ
    }
    
    return { city: cityName, region }
  } catch {
    return null
  }
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => (
  <div className="group relative inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
    </div>
  </div>
)

const StepIndicator = ({ step, total, labels }: { step: number; total: number; labels: string[] }) => (
  <div className="flex items-center justify-between mb-8">
    {labels.map((label, i) => (
      <React.Fragment key={i}>
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            i < step ? "bg-teal-500 text-white" :
            i === step ? "bg-teal-600 text-white ring-4 ring-teal-100" :
            "bg-slate-200 text-slate-500"
          }`}>
            {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
          </div>
          <span className={`text-xs mt-2 font-medium hidden sm:block ${
            i <= step ? "text-teal-700" : "text-slate-400"
          }`}>{label}</span>
        </div>
        {i < labels.length - 1 && (
          <div className={`flex-1 h-1 mx-2 rounded ${
            i < step ? "bg-teal-500" : "bg-slate-200"
          }`} />
        )}
      </React.Fragment>
    ))}
  </div>
)

const InputField = ({ 
  label, 
  value, 
  onChange, 
  suffix, 
  tooltip,
  placeholder,
  type = "number"
}: { 
  label: string
  value: number | string
  onChange: (val: number) => void
  suffix?: string
  tooltip?: string
  placeholder?: string
  type?: "number" | "text"
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      {label}
      {tooltip && (
        <Tooltip content={tooltip}>
          <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
        </Tooltip>
      )}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(type === "number" ? parseFloat(e.target.value) || 0 : parseFloat(e.target.value.replace(/\D/g, "")) || 0)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-16 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-lg font-medium"
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
          {suffix}
        </span>
      )}
    </div>
  </div>
)

const SelectCard = ({ 
  selected, 
  onClick, 
  icon: Icon, 
  title, 
  description,
  badge,
  disabled
}: { 
  selected: boolean
  onClick: () => void
  icon: any
  title: string
  description: string
  badge?: string
  disabled?: boolean
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
      disabled ? "opacity-50 cursor-not-allowed bg-slate-50" :
      selected 
        ? "border-teal-500 bg-teal-50 shadow-lg shadow-teal-500/10" 
        : "border-slate-200 hover:border-teal-300 hover:bg-slate-50"
    }`}
  >
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        selected ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-500"
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${selected ? "text-teal-700" : "text-slate-700"}`}>{title}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">{badge}</span>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
      {selected && <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />}
    </div>
  </button>
)

// ============================================================================
// MAIN CALCULATOR COMPONENT
// ============================================================================

export function RWPCalculator2026() {
  const { company, sharedFormData, updateSharedFormData } = useCompany()
  
  const [step, setStep] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [state, setState] = useState<CalculatorState>({
    employees: 0,
    revenue: 0,
    balanceSheet: 0,
    plz: company?.plz || "",
    region: "NONE",
    city: company?.city || "",
    isAAngrenzend: false,
    hasBevoelkerungsBonus: false,
    projectType: "REGIONAL",
    isGUDiversification: false,
    investmentAmount: sharedFormData.investment ? Number(sharedFormData.investment) : 0,
    avgDepreciation: 0,
    companySize: null,
  })
  
  // Pre-fill from context when company data is available
  useEffect(() => {
  if (company?.plz && !state.plz) {
    // Async webhook lookup for company PLZ
    lookupPLZViaWebhook(company.plz).then(lookup => {
      setState(prev => ({
        ...prev,
        plz: company.plz,
        city: company.city || lookup?.city || "",
        region: lookup?.region || "NONE"
      }))
    })
    // Set immediately with available data while webhook loads
    setState(prev => ({
    ...prev,
    plz: company.plz,
    city: company.city || "",
    region: prev.region
      }))
    }
  }, [company, state.plz])
  
  // Sync investment amount to shared context
  useEffect(() => {
    if (state.investmentAmount > 0) {
      updateSharedFormData({ investment: state.investmentAmount.toString() })
    }
  }, [state.investmentAmount, updateSharedFormData])
  
  const steps = ["Unternehmen", "Standort", "Projekt", "Investition", "Ergebnis"]
  
  // Calculate company size whenever relevant fields change
  const companySize = useMemo(() => {
    if (state.employees > 0) {
      return determineCompanySize(state.employees, state.revenue, state.balanceSheet)
    }
    return null
  }, [state.employees, state.revenue, state.balanceSheet])
  
  // Calculate result
  const result = useMemo(() => {
    return calculateRWP2026({ ...state, companySize })
  }, [state, companySize])
  
  const updateState = (updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }
  
  const handlePLZChange = (plz: string) => {
  updateState({ plz })
  if (plz.length === 5) {
    // Async webhook lookup
    lookupPLZViaWebhook(plz).then(lookup => {
      if (lookup) {
        updateState({ region: lookup.region, city: lookup.city })
      } else {
        updateState({ region: "NONE", city: "Unbekannt" })
      }
    })
  }
  }
  
  const canProceed = () => {
    switch (step) {
      case 0: return state.employees > 0
      case 1: return state.plz.length === 5 && state.region !== "NONE"
      case 2: return true
      case 3: return state.investmentAmount > 0
      default: return true
    }
  }
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Unternehmensgröße bestimmen</h3>
              <p className="text-slate-500 mt-1">Diese Angaben bestimmen Ihre Förderquote</p>
            </div>
            
            <InputField
              label="Anzahl Mitarbeiter (Vollzeitäquivalent)"
              value={state.employees}
              onChange={(v) => updateState({ employees: v })}
              suffix="MA"
              tooltip="Vollzeitäquivalente: Teilzeit anteilig rechnen"
              placeholder="z.B. 45"
            />
            
            <InputField
              label="Jahresumsatz"
              value={state.revenue}
              onChange={(v) => updateState({ revenue: v })}
              suffix="Mio €"
              tooltip="Umsatz des letzten Geschäftsjahres in Millionen Euro"
              placeholder="z.B. 8"
            />
            
            <InputField
              label="Bilanzsumme"
              value={state.balanceSheet}
              onChange={(v) => updateState({ balanceSheet: v })}
              suffix="Mio €"
              tooltip="Bilanzsumme des letzten Geschäftsjahres in Millionen Euro"
              placeholder="z.B. 5"
            />
            
            {companySize && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border-2 ${
                  companySize === "KU" ? "bg-teal-50 border-teal-200" :
                  companySize === "MU" ? "bg-blue-50 border-blue-200" :
                  "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className={`w-6 h-6 ${
                    companySize === "KU" ? "text-teal-600" :
                    companySize === "MU" ? "text-blue-600" :
                    "text-amber-600"
                  }`} />
                  <div>
                    <p className="font-semibold text-slate-800">
                      {companySize === "KU" ? "Kleines Unternehmen (KU)" :
                       companySize === "MU" ? "Mittleres Unternehmen (MU)" :
                       "Großunternehmen (GU)"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {companySize === "KU" ? "Höchste Förderquoten bis 45%" :
                       companySize === "MU" ? "Gute Förderquoten bis 35%" :
                       "Eingeschränkte Förderfähigkeit"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )
        
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Standort des Vorhabens</h3>
              <p className="text-slate-500 mt-1">Das Fördergebiet bestimmt Ihre Basisquote</p>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <MapPin className="w-4 h-4" />
                Postleitzahl des Investitionsstandorts
              </label>
              <input
                type="text"
                maxLength={5}
                value={state.plz}
                onChange={(e) => handlePLZChange(e.target.value.replace(/\D/g, ""))}
                placeholder="z.B. 44135"
                className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-2xl font-bold text-center tracking-widest"
              />
            </div>
            
            {state.plz.length === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border-2 ${
                  state.region === "C+" ? "bg-emerald-50 border-emerald-200" :
                  state.region === "C" ? "bg-teal-50 border-teal-200" :
                  state.region === "D" ? "bg-slate-100 border-slate-300" :
                  "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    state.region === "C+" ? "bg-emerald-500" :
                    state.region === "C" ? "bg-teal-500" :
                    state.region === "D" ? "bg-slate-500" :
                    "bg-red-500"
                  } text-white font-bold text-sm`}>
                    {state.region === "NONE" ? "X" : state.region}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {state.city}
                    </p>
                    <p className="text-sm text-slate-600">
                      {state.region === "C+" ? "C+-Fördergebiet (Grenzzuschlag) - Bis zu 55% (Regional) / 65% (Klima)" :
                       state.region === "C" ? "C-Fördergebiet - Bis zu 50% (Regional) / 65% (Klima)" :
                       state.region === "D" ? "D-Gebiet - Bis 50% mit De-minimis / 65% (Klima)" :
                       "Nicht in diesem Programm – aber starke Alternativen möglich!"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {state.region === "NONE" && state.plz.length === 5 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>Tipp:</strong> Die Investition muss am Standort im Fördergebiet durchgeführt werden. 
                  Prüfen Sie, ob eine Betriebsstätte in einem Fördergebiet möglich ist.
                </p>
              </div>
            )}
          </div>
        )
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Art des Vorhabens</h3>
              <p className="text-slate-500 mt-1">Wählen Sie die passende Kategorie</p>
            </div>
            
            <div className="space-y-3">
              <SelectCard
                selected={state.projectType === "REGIONAL"}
                onClick={() => updateState({ projectType: "REGIONAL" })}
                icon={Factory}
                title="Regionale Investition"
                description="Maschinen, Anlagen, Gebäude, Software, Digitalisierung"
                badge={state.region === "C+" ? "Bis 55% (C+)" : state.region === "C" ? "Bis 50%" : state.region === "D" ? "Bis 50% (De-min.)" : undefined}
              />
              
              <SelectCard
                selected={state.projectType === "EE"}
                onClick={() => updateState({ projectType: "EE" })}
                icon={Leaf}
                title="Erneuerbare Energien - Erzeugung"
                description="Photovoltaik, Windkraft, Wärmepumpen"
                badge="Bis 65%"
              />
              
              <SelectCard
                selected={state.projectType === "EE_SPEICHER"}
                onClick={() => updateState({ projectType: "EE_SPEICHER" })}
                icon={Battery}
                title="Erneuerbare Energien - Speicher"
                description="Stromspeicher (mind. 75% aus erneuerbaren Quellen)"
                badge="Bis 50%"
              />
              
              <SelectCard
                selected={state.projectType === "UMWELT"}
                onClick={() => updateState({ projectType: "UMWELT" })}
                icon={Shield}
                title="Umweltschutz"
                description="Investitionen zur Verringerung von Umweltverschmutzung"
                badge={(state.region === "C" || state.region === "C+") ? "Bis 65%" : "Bis 60%"}
              />
              
              <SelectCard
                selected={state.projectType === "ENERGIE"}
                onClick={() => updateState({ projectType: "ENERGIE" })}
                icon={TrendingUp}
                title="Energieeffizienz"
                description="Investitionen zur Steigerung der Energieeffizienz"
                badge={(state.region === "C" || state.region === "C+") ? "Bis 55%" : "Bis 50%"}
              />
            </div>
            
            {companySize === "GU" && state.projectType === "REGIONAL" && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm font-medium text-amber-800 mb-3">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Als Großunternehmen: Handelt es sich um eine Diversifizierung oder neue Betriebsstätte?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateState({ isGUDiversification: true })}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      state.isGUDiversification 
                        ? "bg-amber-500 text-white" 
                        : "bg-white border border-amber-300 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    Ja, Diversifizierung / Neubau
                  </button>
                  <button
                    onClick={() => updateState({ isGUDiversification: false })}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      !state.isGUDiversification 
                        ? "bg-amber-500 text-white" 
                        : "bg-white border border-amber-300 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    Nein, Erweiterung
                  </button>
                </div>
              </div>
            )}
          </div>
        )
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Investitionsdaten</h3>
              <p className="text-slate-500 mt-1">Netto-Beträge ohne Umsatzsteuer</p>
            </div>
            
            <InputField
              label="Geplante Investitionssumme (netto)"
              value={state.investmentAmount}
              onChange={(v) => updateState({ investmentAmount: v })}
              suffix="€"
              tooltip="Gefördert werden insbesondere: Grundstücke, Gebäude & Hallen, Produktionsmaschinen, Fertigungsanlagen & Robotik, IT & Digitalisierung (ERP, MES, KI), Logistik & Lagersysteme, Energietechnik (PV, Wärmepumpen). Auch gebrauchte Maschinen sind förderfähig!"
              placeholder="z.B. 500000"
            />
            
            <InputField
              label="Durchschnittliche Abschreibungen (AfA) der letzten 3 Jahre"
              value={state.avgDepreciation}
              onChange={(v) => updateState({ avgDepreciation: v })}
              suffix="€"
              tooltip="Summe der jährlichen Abschreibungen geteilt durch 3. Wichtig für die Mindestinvestitions-Prüfung."
              placeholder="z.B. 100000"
            />
            
            {state.avgDepreciation > 0 && state.investmentAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border-2 ${
                  result.investmentSurplus >= 0 
                    ? "bg-teal-50 border-teal-200" 
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.investmentSurplus >= 0 ? (
                    <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-slate-800">
                      {result.investmentSurplus >= 0 
                        ? "Mindestinvestition erfüllt" 
                        : "Mindestinvestition nicht erfüllt"}
                    </p>
                    <p className="text-sm text-slate-600">
                      Mindestens {result.minInvestRequired.toLocaleString("de-DE")} € erforderlich 
                      ({companySize === "KU" || state.projectType !== "REGIONAL" ? "25%" : "50%"} über AfA).
                      {result.investmentSurplus >= 0 && (
                        <span className="text-teal-600 font-medium">
                          {" "}Sie liegen {result.investmentSurplus.toLocaleString("de-DE")} € darüber.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Ihr Förderergebnis</h3>
              <p className="text-slate-500 mt-1">Regional-Förderung 2026</p>
            </div>
            
            {result.isEligible ? (
              <>
                {/* Main Result Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl text-white shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-purple-100 font-medium">Möglicher Zuschuss</span>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {result.finalSubsidy.toLocaleString("de-DE")} €
                  </div>
                  <div className="text-purple-100">
                    bei {state.investmentAmount.toLocaleString("de-DE")} € Investition
                  </div>
                </motion.div>
                
                {/* Quote Breakdown */}
                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-500 mb-3">Quotenzusammensetzung</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700">Maximale Quote</span>
                    <span className="text-2xl font-bold text-purple-600">{result.quote}%</span>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1 border-t border-slate-200 pt-2 mt-2">
                    {state.projectType === "EE" && (
                      <>
                        <div className="flex justify-between"><span>Basis Erneuerbare Energien - Erzeugung</span><span>45%</span></div>
                        <div className="flex justify-between"><span>+ KMU-Bonus ({companySize === "Klein" ? "+20%" : companySize === "Mittel" ? "+10%" : "0%"})</span><span>{companySize === "Klein" ? "+20%" : companySize === "Mittel" ? "+10%" : "0%"}</span></div>
                      </>
                    )}
                    {state.projectType === "EE_SPEICHER" && (
                      <>
                        <div className="flex justify-between"><span>Basis Erneuerbare Energien - Speicher</span><span>30%</span></div>
                        <div className="flex justify-between"><span>+ KMU-Bonus ({companySize === "Klein" ? "+20%" : companySize === "Mittel" ? "+10%" : "0%"})</span><span>{companySize === "Klein" ? "+20%" : companySize === "Mittel" ? "+10%" : "0%"}</span></div>
                      </>
                    )}
                    {state.projectType === "UMWELT" && (
                      <>
                        <div className="flex justify-between"><span>Basis Umweltschutz (Art. 36)</span><span>40%</span></div>
                        <div className="flex justify-between"><span>+ KMU-Bonus ({companySize === "Klein" ? "+20%" : companySize === "Mittel" ? "+10%" : "0%"})</span><span>{companySize === "Klein" ? "+20%" : companySize === "Mittel" ? "+10%" : "0%"}</span></div>
                        {state.region === "C" && <div className="flex justify-between text-teal-600"><span>+ C-Gebiets-Bonus</span><span>+5%</span></div>}
                      </>
                    )}
                    {state.projectType === "ENERGIE" && (
                      <>
                        <div className="flex justify-between"><span>Basis Energieeffizienz (Art. 38)</span><span>30%</span></div>
                        <div className="flex justify-between"><span>+ KMU-Bonus ({companySize === "Klein" ? "+20%" : companySize === "Mittel" ? "+10%" : "0%"})</span><span>{companySize === "Klein" ? "+20%" : companySize === "Mittel" ? "+10%" : "0%"}</span></div>
                        {state.region === "C" && <div className="flex justify-between text-teal-600"><span>+ C-Gebiets-Bonus</span><span>+5%</span></div>}
                      </>
                    )}
                    {state.projectType === "REGIONAL" && state.region === "D" && (
                      <>
                        <div className="flex justify-between"><span>Basis D-Gebiet</span><span>{companySize === "Klein" ? "30%" : companySize === "Mittel" ? "20%" : "10%"}</span></div>
                        <div className="flex justify-between text-teal-600"><span>+ De-minimis-Aufschlag</span><span>+20%</span></div>
                      </>
                    )}
                    {state.projectType === "REGIONAL" && state.region === "C" && (
                      <>
                        <div className="flex justify-between"><span>Basis C-Gebiet (Art. 14/17)</span><span>{companySize === "Klein" ? "35%" : companySize === "Mittel" ? "25%" : "15%"}</span></div>
                        <div className="flex justify-between"><span>+ Mögliche Boni</span><span>variabel</span></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Unternehmensgröße</p>
                    <p className="text-xl font-bold text-slate-800">{companySize}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Fördergebiet</p>
                    <p className="text-xl font-bold text-slate-800">{state.region}-Gebiet</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl col-span-2">
                    <p className="text-sm text-slate-500 mb-1">Vorhabensart</p>
                    <p className="text-lg font-bold text-slate-800">
                      {state.projectType === "REGIONAL" ? "Regionale Investition" : 
                       state.projectType === "EE" ? "Erneuerbare Energien - Erzeugung" :
                       state.projectType === "EE_SPEICHER" ? "Erneuerbare Energien - Speicher" :
                       state.projectType === "UMWELT" ? "Umweltschutz" : "Energieeffizienz"}
                    </p>
                  </div>
                </div>
                
                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="space-y-2">
                    {result.warnings.map((warning, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{warning}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* CTA */}
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                  <p className="text-sm text-teal-800 mb-3">
                    <strong>Nächster Schritt:</strong> Lassen Sie Ihre individuelle Förderfähigkeit von einem Experten prüfen.
                  </p>
                  <Button 
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Kostenlos & unverbindlich prüfen
                  </Button>
                  <p className="text-xs text-teal-600 text-center mt-2">Keine Telefonnummer erforderlich</p>
                </div>
              </>
            ) : (
              <>
                {/* Rejection Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl text-white"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-6 h-6" />
                    <span className="font-semibold">Nicht förderfähig</span>
                  </div>
                  <p className="text-red-100">{result.rejectionReason}</p>
                </motion.div>
                
                {result.warnings.length > 0 && (
                  <div className="space-y-2">
                    {result.warnings.map((warning, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-slate-100 border border-slate-200 rounded-lg">
                        <Info className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-700">{warning}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Alternative CTA */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-800 mb-3">
                    <strong>Tipp:</strong> Es gibt möglicherweise alternative Förderprogramme für Ihr Vorhaben. 
                    Lassen Sie sich beraten.
                  </p>
                  <Button variant="outline" className="w-full border-amber-400 text-amber-700 hover:bg-amber-100 bg-transparent">
                    Alternative Fördermöglichkeiten prüfen
                  </Button>
                </div>
              </>
            )}
          </div>
        )
    }
  }
  
  return (
    <section id="calculator" className="py-0">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Step Indicator */}
            <StepIndicator step={step} total={5} labels={steps} />
            
            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation */}
          <div className="px-6 md:px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Zurück
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={() => setStep(Math.min(4, step + 1))}
                disabled={!canProceed()}
                className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
              >
                Weiter
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={() => setStep(0)}
                variant="outline"
                className="gap-2"
              >
                Neu berechnen
              </Button>
            )}
          </div>
        </div>
        
        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>Regional-Förderung 2026 konform</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-600" />
            <span>Sofort-Ergebnis</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" />
            <span>200+ erfolgreiche Projekte</span>
          </div>
        </div>
      </div>
      
      {/* Lead Capture Modal */}
      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  )
}

export default RWPCalculator2026
