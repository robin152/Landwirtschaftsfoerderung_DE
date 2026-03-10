"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  TrendingUp,
  Building2,
  Zap,
  Check,
  Search,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Euro,
  Factory,
  Cpu,
  Leaf,
  XCircle,
  CheckCircle,
  Sparkles,
  TrendingDown,
  Award,
  Shield,
  Target,
  DollarSign,
  Truck,
  Home,
  Wrench,
  Cloud,
  Info,
  HelpCircle,
  Gift,
  LandPlot,
  Hammer,
} from "lucide-react"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type Step = "knockouts" | "company" | "location" | "investment" | "strategy" | "bonuses" | "result"
type FundingRegion = "C1" | "C2" | "D" | "NONE"
type CompanySize = "small" | "medium" | "large"

interface KnockoutData {
  hasStarted: boolean
  industry: string
  isInNRW: boolean
  isReplacement: boolean
}

interface CompanyData {
  employees: number
  revenue: number
  balanceSheet: number
  hasParentCompany: boolean
  size: CompanySize
  isKMU: boolean
}

interface LocationData {
  city: string
  zipCode: string
  region: FundingRegion
  state: string
}

interface InvestmentData {
  land: number // Added land/Grundstück
  buildings: number
  renovation: number // Added renovation/Umbau
  newMachinery: number
  usedMachinery: number
  software: number
  vehicles: number
}

interface StrategyData {
  willHireMore: boolean
  expectGrowth: boolean
  willMaintainWages: boolean
  path: "jobs" | "productivity"
}

interface BonusData {
  climate: boolean
  digitalization: boolean
  deminimis: boolean // Added De-minimis bonus
}

interface CalculationResult {
  eligibleAmount: number
  baseRate: number
  bonusRate: number
  deminimisBonus: number // Added De-minimis calculation
  totalRate: number
  fundingAmount: number
  warnings: string[]
  strategicPath: string
}

// ============================================================================
// CONFIGURATION DATA
// ============================================================================

const INDUSTRIES = [
  { value: "manufacturing", label: "Produktion / Fertigung", allowed: true },
  { value: "it", label: "IT / Software", allowed: true },
  { value: "logistics", label: "Logistik / Transport", allowed: true },
  { value: "energy", label: "Energie / Umwelttechnik", allowed: true },
  { value: "retail", label: "Einzelhandel", allowed: false },
  { value: "construction", label: "Baugewerbe", allowed: false },
  { value: "hospitality", label: "Gastronomie / Hotel", allowed: false },
]

const FUNDING_CONFIGS = {
  C1: { label: "C1-Prioritätsgebiet", color: "#7C3AED", rates: { small: 35, medium: 25, large: 15 } },
  C2: { label: "C2-Fördergebiet", color: "#3B82F6", rates: { small: 30, medium: 20, large: 10 } },
  D: { label: "D-Ergänzungsgebiet", color: "#64748B", rates: { small: 20, medium: 10, large: 0 } },
  NONE: { label: "Andere Programme möglich", color: "#14B8A6", rates: { small: 0, medium: 0, large: 0 } },
}

const PLZ_DATABASE: Record<string, { city: string; state: string; region: FundingRegion }> = {
  // C1-Gebiete (Ruhrgebiet Priorität)
  "44135": { city: "Dortmund", state: "Nordrhein-Westfalen", region: "C1" },
  "44137": { city: "Dortmund", state: "Nordrhein-Westfalen", region: "C1" },
  "44139": { city: "Dortmund", state: "Nordrhein-Westfalen", region: "C1" },
  "44227": { city: "Dortmund-Hombruch", state: "Nordrhein-Westfalen", region: "C1" },
  "44263": { city: "Dortmund-Hörde", state: "Nordrhein-Westfalen", region: "C1" },
  "44145": { city: "Dortmund-Nordstadt", state: "Nordrhein-Westfalen", region: "C1" },
  "45127": { city: "Essen-Zentrum", state: "Nordrhein-Westfalen", region: "C1" },
  "45128": { city: "Essen-Südviertel", state: "Nordrhein-Westfalen", region: "C1" },
  "45130": { city: "Essen-Rüttenscheid", state: "Nordrhein-Westfalen", region: "C1" },
  "45131": { city: "Essen-Rüttenscheid", state: "Nordrhein-Westfalen", region: "C1" },
  "45138": { city: "Essen-Huttrop", state: "Nordrhein-Westfalen", region: "C1" },
  "45141": { city: "Essen-Stoppenberg", state: "Nordrhein-Westfalen", region: "C1" },
  "45219": { city: "Essen-Kettwig", state: "Nordrhein-Westfalen", region: "C1" },
  "45239": { city: "Essen-Werden", state: "Nordrhein-Westfalen", region: "C1" },
  "45276": { city: "Essen-Steele", state: "Nordrhein-Westfalen", region: "C1" },
  "45355": { city: "Essen-Borbeck", state: "Nordrhein-Westfalen", region: "C1" },
  "46045": { city: "Oberhausen", state: "Nordrhein-Westfalen", region: "C1" },
  "46047": { city: "Oberhausen", state: "Nordrhein-Westfalen", region: "C1" },
  "46117": { city: "Oberhausen-Osterfeld", state: "Nordrhein-Westfalen", region: "C1" },
  "46147": { city: "Oberhausen-Sterkrade", state: "Nordrhein-Westfalen", region: "C1" },
  "47051": { city: "Duisburg-Zentrum", state: "Nordrhein-Westfalen", region: "C1" },
  "47053": { city: "Duisburg-Hochfeld", state: "Nordrhein-Westfalen", region: "C1" },
  "47055": { city: "Duisburg-Wanheimerort", state: "Nordrhein-Westfalen", region: "C1" },
  "47057": { city: "Duisburg-Neudorf", state: "Nordrhein-Westfalen", region: "C1" },
  "47058": { city: "Duisburg-Duissern", state: "Nordrhein-Westfalen", region: "C1" },
  "47119": { city: "Duisburg-Ruhrort", state: "Nordrhein-Westfalen", region: "C1" },
  "47166": { city: "Duisburg-Hamborn", state: "Nordrhein-Westfalen", region: "C1" },
  "47167": { city: "Duisburg-Marxloh", state: "Nordrhein-Westfalen", region: "C1" },
  "47169": { city: "Duisburg-Röttgersbach", state: "Nordrhein-Westfalen", region: "C1" },
  "44623": { city: "Herne", state: "Nordrhein-Westfalen", region: "C1" },
  "44625": { city: "Herne-Wanne", state: "Nordrhein-Westfalen", region: "C1" },
  "44627": { city: "Herne-Baukau", state: "Nordrhein-Westfalen", region: "C1" },
  "44629": { city: "Herne-Eickel", state: "Nordrhein-Westfalen", region: "C1" },
  "44787": { city: "Bochum-Zentrum", state: "Nordrhein-Westfalen", region: "C1" },
  "44789": { city: "Bochum-Ehrenfeld", state: "Nordrhein-Westfalen", region: "C1" },
  "44791": { city: "Bochum-Grumme", state: "Nordrhein-Westfalen", region: "C1" },
  "44793": { city: "Bochum-Wiemelhausen", state: "Nordrhein-Westfalen", region: "C1" },
  "44795": { city: "Bochum-Weitmar", state: "Nordrhein-Westfalen", region: "C1" },
  "44797": { city: "Bochum-Stiepel", state: "Nordrhein-Westfalen", region: "C1" },
  "44799": { city: "Bochum-Querenburg", state: "Nordrhein-Westfalen", region: "C1" },
  "44801": { city: "Bochum-Querenburg", state: "Nordrhein-Westfalen", region: "C1" },
  "44803": { city: "Bochum-Altenbochum", state: "Nordrhein-Westfalen", region: "C1" },
  "44805": { city: "Bochum-Gerthe", state: "Nordrhein-Westfalen", region: "C1" },
  "44807": { city: "Bochum-Riemke", state: "Nordrhein-Westfalen", region: "C1" },
  "44809": { city: "Bochum-Hofstede", state: "Nordrhein-Westfalen", region: "C1" },
  "44866": { city: "Bochum-Wattenscheid", state: "Nordrhein-Westfalen", region: "C1" },
  "44867": { city: "Bochum-Wattenscheid", state: "Nordrhein-Westfalen", region: "C1" },
  "45879": { city: "Gelsenkirchen-Zentrum", state: "Nordrhein-Westfalen", region: "C1" },
  "45881": { city: "Gelsenkirchen-Schalke", state: "Nordrhein-Westfalen", region: "C1" },
  "45883": { city: "Gelsenkirchen-Bulmke", state: "Nordrhein-Westfalen", region: "C1" },
  "45886": { city: "Gelsenkirchen-Ückendorf", state: "Nordrhein-Westfalen", region: "C1" },
  "45888": { city: "Gelsenkirchen-Buer", state: "Nordrhein-Westfalen", region: "C1" },
  "45889": { city: "Gelsenkirchen-Buer", state: "Nordrhein-Westfalen", region: "C1" },
  "45891": { city: "Gelsenkirchen-Erle", state: "Nordrhein-Westfalen", region: "C1" },
  "45892": { city: "Gelsenkirchen-Beckhausen", state: "Nordrhein-Westfalen", region: "C1" },
  "45894": { city: "Gelsenkirchen-Hassel", state: "Nordrhein-Westfalen", region: "C1" },
  "45896": { city: "Gelsenkirchen-Horst", state: "Nordrhein-Westfalen", region: "C1" },
  "45897": { city: "Gelsenkirchen-Horst", state: "Nordrhein-Westfalen", region: "C1" },
  "45899": { city: "Gelsenkirchen-Horst", state: "Nordrhein-Westfalen", region: "C1" },
  "58095": { city: "Hagen-Zentrum", state: "Nordrhein-Westfalen", region: "C1" },
  "58097": { city: "Hagen-Altstadt", state: "Nordrhein-Westfalen", region: "C1" },
  "58099": { city: "Hagen-Wehringhausen", state: "Nordrhein-Westfalen", region: "C1" },
  "58119": { city: "Hagen-Hohenlimburg", state: "Nordrhein-Westfalen", region: "C1" },
  "58135": { city: "Hagen-Haspe", state: "Nordrhein-Westfalen", region: "C1" },
  "45657": { city: "Recklinghausen", state: "Nordrhein-Westfalen", region: "C1" },
  "45659": { city: "Recklinghausen", state: "Nordrhein-Westfalen", region: "C1" },
  "45661": { city: "Recklinghausen-Süd", state: "Nordrhein-Westfalen", region: "C1" },
  "45663": { city: "Recklinghausen-Süd", state: "Nordrhein-Westfalen", region: "C1" },
  "45699": { city: "Herten", state: "Nordrhein-Westfalen", region: "C1" },
  "45701": { city: "Herten-Süd", state: "Nordrhein-Westfalen", region: "C1" },
  "45711": { city: "Datteln", state: "Nordrhein-Westfalen", region: "C1" },
  "45721": { city: "Haltern am See", state: "Nordrhein-Westfalen", region: "C1" },
  "45731": { city: "Waltrop", state: "Nordrhein-Westfalen", region: "C1" },
  "45739": { city: "Oer-Erkenschwick", state: "Nordrhein-Westfalen", region: "C1" },
  "45768": { city: "Marl", state: "Nordrhein-Westfalen", region: "C1" },
  "45770": { city: "Marl", state: "Nordrhein-Westfalen", region: "C1" },
  "45772": { city: "Marl", state: "Nordrhein-Westfalen", region: "C1" },
  // D-Gebiete (Pufferzone)
  "48143": { city: "Münster-Zentrum", state: "Nordrhein-Westfalen", region: "D" },
  "48145": { city: "Münster-Zentrum", state: "Nordrhein-Westfalen", region: "D" },
  "48147": { city: "Münster-Kreuzviertel", state: "Nordrhein-Westfalen", region: "D" },
  "48149": { city: "Münster-Gievenbeck", state: "Nordrhein-Westfalen", region: "D" },
  "48151": { city: "Münster-Aaseestadt", state: "Nordrhein-Westfalen", region: "D" },
  "48153": { city: "Münster-Hiltrup", state: "Nordrhein-Westfalen", region: "D" },
  "48155": { city: "Münster-Mauritz", state: "Nordrhein-Westfalen", region: "D" },
  "48157": { city: "Münster-Kinderhaus", state: "Nordrhein-Westfalen", region: "D" },
  "48159": { city: "Münster-Coerde", state: "Nordrhein-Westfalen", region: "D" },
  "48161": { city: "Münster-Roxel", state: "Nordrhein-Westfalen", region: "D" },
  "48163": { city: "Münster-Mecklenbeck", state: "Nordrhein-Westfalen", region: "D" },
  "48165": { city: "Münster-Hiltrup", state: "Nordrhein-Westfalen", region: "D" },
  "48167": { city: "Münster-Wolbeck", state: "Nordrhein-Westfalen", region: "D" },
  "33602": { city: "Bielefeld-Zentrum", state: "Nordrhein-Westfalen", region: "D" },
  "33604": { city: "Bielefeld-Mitte", state: "Nordrhein-Westfalen", region: "D" },
  "33605": { city: "Bielefeld-Stieghorst", state: "Nordrhein-Westfalen", region: "D" },
  "33607": { city: "Bielefeld-Bethel", state: "Nordrhein-Westfalen", region: "D" },
  "33609": { city: "Bielefeld-Schildesche", state: "Nordrhein-Westfalen", region: "D" },
  "33611": { city: "Bielefeld-Schildesche", state: "Nordrhein-Westfalen", region: "D" },
  "33613": { city: "Bielefeld-Brake", state: "Nordrhein-Westfalen", region: "D" },
  "33615": { city: "Bielefeld-Gadderbaum", state: "Nordrhein-Westfalen", region: "D" },
  "33617": { city: "Bielefeld-Gadderbaum", state: "Nordrhein-Westfalen", region: "D" },
  "33619": { city: "Bielefeld-Hoberge", state: "Nordrhein-Westfalen", region: "D" },
  "59063": { city: "Hamm-Zentrum", state: "Nordrhein-Westfalen", region: "D" },
  "59065": { city: "Hamm-Mitte", state: "Nordrhein-Westfalen", region: "D" },
  "59067": { city: "Hamm-Mitte", state: "Nordrhein-Westfalen", region: "D" },
  "59069": { city: "Hamm-Rhynern", state: "Nordrhein-Westfalen", region: "D" },
  "59071": { city: "Hamm-Uentrop", state: "Nordrhein-Westfalen", region: "D" },
  "59073": { city: "Hamm-Heessen", state: "Nordrhein-Westfalen", region: "D" },
  "59075": { city: "Hamm-Herringen", state: "Nordrhein-Westfalen", region: "D" },
  "59077": { city: "Hamm-Bockum-Hövel", state: "Nordrhein-Westfalen", region: "D" },
  // Kein Fördergebiet (z.B. Düsseldorf, Köln)
  "40210": { city: "Düsseldorf-Zentrum", state: "Nordrhein-Westfalen", region: "NONE" },
  "40211": { city: "Düsseldorf-Stadtmitte", state: "Nordrhein-Westfalen", region: "NONE" },
  "40212": { city: "Düsseldorf-Carlstadt", state: "Nordrhein-Westfalen", region: "NONE" },
  "40213": { city: "Düsseldorf-Altstadt", state: "Nordrhein-Westfalen", region: "NONE" },
  "40215": { city: "Düsseldorf-Friedrichstadt", state: "Nordrhein-Westfalen", region: "NONE" },
  "40217": { city: "Düsseldorf-Unterbilk", state: "Nordrhein-Westfalen", region: "NONE" },
  "40219": { city: "Düsseldorf-Hafen", state: "Nordrhein-Westfalen", region: "NONE" },
  "40221": { city: "Düsseldorf-Hafen", state: "Nordrhein-Westfalen", region: "NONE" },
  "40223": { city: "Düsseldorf-Bilk", state: "Nordrhein-Westfalen", region: "NONE" },
  "40225": { city: "Düsseldorf-Bilk", state: "Nordrhein-Westfalen", region: "NONE" },
  "40227": { city: "Düsseldorf-Oberbilk", state: "Nordrhein-Westfalen", region: "NONE" },
  "40229": { city: "Düsseldorf-Eller", state: "Nordrhein-Westfalen", region: "NONE" },
  "50667": { city: "Köln-Zentrum", state: "Nordrhein-Westfalen", region: "NONE" },
  "50668": { city: "Köln-Neustadt-Nord", state: "Nordrhein-Westfalen", region: "NONE" },
  "50670": { city: "Köln-Neustadt-Nord", state: "Nordrhein-Westfalen", region: "NONE" },
  "50672": { city: "Köln-Neustadt-Nord", state: "Nordrhein-Westfalen", region: "NONE" },
  "50674": { city: "Köln-Neustadt-Süd", state: "Nordrhein-Westfalen", region: "NONE" },
  "50676": { city: "Köln-Altstadt-Süd", state: "Nordrhein-Westfalen", region: "NONE" },
  "50677": { city: "Köln-Neustadt-Süd", state: "Nordrhein-Westfalen", region: "NONE" },
  "50678": { city: "Köln-Altstadt-Süd", state: "Nordrhein-Westfalen", region: "NONE" },
  "50679": { city: "Köln-Deutz", state: "Nordrhein-Westfalen", region: "NONE" },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const lookupPLZ = (zipCode: string): LocationData | null => {
  // Exact match first
  if (PLZ_DATABASE[zipCode]) {
    const data = PLZ_DATABASE[zipCode]
    return { ...data, zipCode }
  }

  // Fallback: Check prefix ranges
  const code = Number.parseInt(zipCode)
  if (isNaN(code)) return null

  // C1-Gebiete (Ruhrgebiet)
  if (
    (code >= 44000 && code <= 44999) ||
    (code >= 45000 && code <= 45899) ||
    (code >= 46000 && code <= 47279) ||
    (code >= 58000 && code <= 58455)
  ) {
    const prefix = zipCode.substring(0, 2)
    const cityNames: Record<string, string> = {
      "44": "Dortmund/Bochum/Herne",
      "45": "Essen/Gelsenkirchen/Recklinghausen",
      "46": "Oberhausen/Mülheim",
      "47": "Duisburg",
      "58": "Hagen",
    }
    return {
      city: cityNames[prefix] || "Ruhrgebiet",
      state: "Nordrhein-Westfalen",
      zipCode,
      region: "C1",
    }
  }

  // D-Gebiete (Münsterland, OWL)
  if ((code >= 48000 && code <= 48167) || (code >= 33600 && code <= 33739) || (code >= 59000 && code <= 59399)) {
    const prefix = zipCode.substring(0, 2)
    const cityNames: Record<string, string> = {
      "48": "Münster/Münsterland",
      "33": "Bielefeld/OWL",
      "59": "Hamm/Unna",
    }
    return {
      city: cityNames[prefix] || "NRW",
      state: "Nordrhein-Westfalen",
      zipCode,
      region: "D",
    }
  }

  // Rest NRW (kein Fördergebiet)
  if (code >= 40000 && code <= 59999) {
    const prefix = zipCode.substring(0, 2)
    const cityNames: Record<string, string> = {
      "40": "Düsseldorf",
      "41": "Mönchengladbach",
      "42": "Wuppertal",
      "50": "Köln",
      "51": "Köln/Leverkusen",
      "52": "Aachen",
      "53": "Bonn",
      "57": "Siegen",
    }
    return {
      city: cityNames[prefix] || "NRW",
      state: "Nordrhein-Westfalen",
      zipCode,
      region: "NONE",
    }
  }

  return null
}

const determineCompanySize = (
  employees: number,
  revenue: number,
  balanceSheet: number,
  hasParent: boolean,
): { size: CompanySize; isKMU: boolean } => {
  if (hasParent) return { size: "large", isKMU: false }
  if (employees < 50 && revenue <= 10000000 && balanceSheet <= 10000000) return { size: "small", isKMU: true }
  if (employees < 250 && revenue <= 50000000 && balanceSheet <= 43000000) return { size: "medium", isKMU: true }
  return { size: "large", isKMU: false }
}

const calculateFunding = (
  company: CompanyData,
  location: LocationData,
  investment: InvestmentData,
  strategy: StrategyData,
  bonuses: BonusData,
): CalculationResult => {
  const warnings: string[] = []

  let eligible = investment.land + investment.buildings + investment.renovation + investment.newMachinery

  // Used machinery rules
  if (company.isKMU) {
    eligible += investment.usedMachinery
  } else {
    if (investment.usedMachinery > 0) {
      warnings.push("Gebrauchte Maschinen: Nur für KMU förderfähig")
    }
  }

  // Software rules
  if (company.isKMU) {
    eligible += investment.software
  } else {
    const softwareCap = eligible * 0.5
    eligible += Math.min(investment.software, softwareCap)
    if (investment.software > softwareCap) {
      warnings.push(`Software: Max. 50% der Gesamtkosten (${softwareCap.toLocaleString("de-DE")} €)`)
    }
  }

  // Vehicles NOT eligible
  if (investment.vehicles > 0) {
    warnings.push(`Fahrzeuge (${investment.vehicles.toLocaleString("de-DE")} €) sind NICHT förderfähig`)
  }

  // Base rate
  const config = FUNDING_CONFIGS[location.region]
  let baseRate = config.rates[company.size]

  // Special case: Large company in D region
  if (company.size === "large" && location.region === "D") {
    if (!bonuses.climate) {
      warnings.push("���️ Großunternehmen im D-Gebiet: Nur mit Klimaschutz-Bonus förderfähig!")
      baseRate = 0
    } else {
      baseRate = 20
      warnings.push("✅ Klimaschutz-Bonus aktiviert Förderung für Großunternehmen im D-Gebiet")
    }
  }

  // Bonuses
  let bonusRate = 0
  if (bonuses.climate) bonusRate += 10
  if (bonuses.digitalization) bonusRate += 5

  let deminimisBonus = 0
  const DEMINIMIS_THRESHOLD = 300000 // Max 300.000€ De-minimis over 3 years
  if (bonuses.deminimis && eligible > 0) {
    const potentialDeminimis = Math.round((eligible * 20) / 100)
    deminimisBonus = Math.min(potentialDeminimis, DEMINIMIS_THRESHOLD)
    if (potentialDeminimis > DEMINIMIS_THRESHOLD) {
      warnings.push(`De-minimis auf ${DEMINIMIS_THRESHOLD.toLocaleString("de-DE")} € begrenzt (EU-Schwellwert)`)
    }
  }

  let totalRate = baseRate + bonusRate
  const maxRate = company.isKMU ? 50 : 25
  if (totalRate > maxRate) {
    warnings.push(`Förderquote auf ${maxRate}% begrenzt (${company.isKMU ? "KMU" : "GU"}-Maximum)`)
    totalRate = maxRate
  }

  const fundingAmount = Math.round((eligible * totalRate) / 100) + deminimisBonus

  // Strategic path
  const strategicPath = strategy.willHireMore
    ? "📈 Arbeitsplatz-Förderung (Personalaufbau >10%)"
    : strategy.expectGrowth && strategy.willMaintainWages
      ? "🎯 Produktivitäts-Förderung (Outputsteigerung bei stabiler Lohnsumme)"
      : "⚠️ Förderung gefährdet: Weder Personalaufbau noch ausreichendes Wachstum"

  return {
    eligibleAmount: eligible,
    baseRate,
    bonusRate,
    deminimisBonus,
    totalRate,
    fundingAmount,
    warnings,
    strategicPath,
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function RWPPrecisionCalculator() {
  const [currentStep, setCurrentStep] = useState<Step>("knockouts")
  const [completedSteps, setCompletedSteps] = useState<Step[]>([])
  const [knockouts, setKnockouts] = useState<KnockoutData | null>(null)
  const [company, setCompany] = useState<CompanyData | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [investment, setInvestment] = useState<InvestmentData | null>(null)
  const [strategy, setStrategy] = useState<StrategyData | null>(null)
  const [bonuses, setBonuses] = useState<BonusData>({ climate: false, digitalization: false, deminimis: false })
  const [calculation, setCalculation] = useState<CalculationResult | null>(null)

  useEffect(() => {
    if (currentStep === "result" && company && location && investment && strategy) {
      const result = calculateFunding(company, location, investment, strategy, bonuses)
      setCalculation(result)
    }
  }, [currentStep, company, location, investment, strategy, bonuses])

  const completeStep = (step: Step) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step])
    }
  }

  const steps: Step[] = ["knockouts", "company", "location", "investment", "strategy", "bonuses", "result"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            RWP Förderrechner 2026
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">
            Interaktive Förderberechnung - Regional-Förderung NRW
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <ProgressIndicator steps={steps} currentStep={currentStep} completedSteps={completedSteps} />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {currentStep === "knockouts" && (
              <KnockoutsStep
                onComplete={(data) => {
                  setKnockouts(data)
                  completeStep("knockouts")
                  setCurrentStep("company")
                }}
              />
            )}
            {currentStep === "company" && (
              <CompanyStep
                onComplete={(data) => {
                  setCompany(data)
                  completeStep("company")
                  setCurrentStep("location")
                }}
                onBack={() => setCurrentStep("knockouts")}
              />
            )}
            {currentStep === "location" && (
              <LocationStep
                onComplete={(data) => {
                  setLocation(data)
                  completeStep("location")
                  setCurrentStep("investment")
                }}
                onBack={() => setCurrentStep("company")}
              />
            )}
            {currentStep === "investment" && company && (
              <InvestmentStep
                company={company}
                onComplete={(data) => {
                  setInvestment(data)
                  completeStep("investment")
                  setCurrentStep("strategy")
                }}
                onBack={() => setCurrentStep("location")}
              />
            )}
            {currentStep === "strategy" && (
              <StrategyStep
                onComplete={(data) => {
                  setStrategy(data)
                  completeStep("strategy")
                  setCurrentStep("bonuses")
                }}
                onBack={() => setCurrentStep("investment")}
              />
            )}
            {currentStep === "bonuses" && location && company && (
              <BonusesStep
                location={location}
                company={company}
                bonuses={bonuses}
                setBonuses={setBonuses}
                onComplete={() => {
                  completeStep("bonuses")
                  setCurrentStep("result")
                }}
                onBack={() => setCurrentStep("strategy")}
              />
            )}
            {currentStep === "result" && calculation && location && company && (
              <ResultStep
                calculation={calculation}
                location={location}
                company={company}
                onReset={() => {
                  setCurrentStep("knockouts")
                  setCompletedSteps([])
                  setKnockouts(null)
                  setCompany(null)
                  setLocation(null)
                  setInvestment(null)
                  setStrategy(null)
                  setBonuses({ climate: false, digitalization: false, deminimis: false })
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Success Milestones */}
        <AnimatePresence>
          {completedSteps.length > 0 && currentStep !== "result" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 grid md:grid-cols-3 gap-4"
            >
              {completedSteps.map((step) => (
                <SuccessMilestone key={step} step={step} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// PROGRESS INDICATOR
// ============================================================================

function ProgressIndicator({
  steps,
  currentStep,
  completedSteps,
}: { steps: Step[]; currentStep: Step; completedSteps: Step[] }) {
  const stepLabels: Record<Step, string> = {
    knockouts: "Prüfung",
    company: "Unternehmen",
    location: "Standort",
    investment: "Investition",
    strategy: "Strategie",
    bonuses: "Boni",
    result: "Ergebnis",
  }

  const currentIndex = steps.indexOf(currentStep)

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-slate-200 p-3 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <span className="text-xs sm:text-sm font-bold text-slate-700" role="heading" aria-level={3}>Fortschritt</span>
        <span className="text-xs sm:text-sm text-slate-500">
          {completedSteps.length} / {steps.length - 1} Phasen
        </span>
      </div>
      {/* Mobile: Compact progress bar */}
      <div className="sm:hidden">
        <div className="flex gap-1 mb-2">
          {steps.map((step, index) => (
            <div 
              key={step}
              className={`flex-1 h-2 rounded-full transition-all ${
                completedSteps.includes(step) 
                  ? "bg-green-500" 
                  : index === currentIndex 
                    ? "bg-violet-500" 
                    : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm font-medium text-violet-600">
          {stepLabels[currentStep]}
        </p>
      </div>
      {/* Desktop: Full step indicator */}
      <div className="hidden sm:flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: index === currentIndex ? [1, 1.1, 1] : 1,
                }}
                transition={{ repeat: index === currentIndex ? Number.POSITIVE_INFINITY : 0, duration: 2 }}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all text-sm ${
                  completedSteps.includes(step)
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                    : index === currentIndex
                      ? "bg-violet-600 text-white ring-4 ring-violet-200"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {completedSteps.includes(step) ? <CheckCircle className="w-5 h-5 md:w-6 md:h-6" /> : index + 1}
              </motion.div>
              <span
                className={`text-[10px] md:text-xs mt-2 font-medium text-center ${index === currentIndex ? "text-violet-600" : "text-slate-500"}`}
              >
                {stepLabels[step]}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-1 md:mx-2 rounded transition-all ${completedSteps.includes(step) ? "bg-green-500" : "bg-slate-200"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// SUCCESS MILESTONE CARDS
// ============================================================================

function SuccessMilestone({ step }: { step: Step }) {
  const milestones: Record<Step, { icon: any; title: string; color: string }> = {
    knockouts: { icon: Shield, title: "Förderfähigkeit bestätigt", color: "green" },
    company: { icon: Building2, title: "KMU-Status ermittelt", color: "blue" },
    location: { icon: MapPin, title: "Fördergebiet identifiziert", color: "violet" },
    investment: { icon: Euro, title: "Kosten berechnet", color: "emerald" },
    strategy: { icon: Target, title: "Strategie festgelegt", color: "orange" },
    bonuses: { icon: Zap, title: "Boni aktiviert", color: "amber" },
    result: { icon: Award, title: "Ergebnis", color: "purple" },
  }

  const milestone = milestones[step]
  const Icon = milestone.icon

  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 10 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3 shadow-lg"
    >
      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-600 font-medium">✓ Abgeschlossen</p>
        <p className="font-bold text-slate-900">{milestone.title}</p>
      </div>
    </motion.div>
  )
}

// ============================================================================
// STEP 1: KNOCKOUTS (unchanged)
// ============================================================================

function KnockoutsStep({ onComplete }: { onComplete: (data: KnockoutData) => void }) {
  const [hasStarted, setHasStarted] = useState<boolean | null>(null)
  const [industry, setIndustry] = useState("")
  const [isInNRW, setIsInNRW] = useState<boolean | null>(null)
  const [isReplacement, setIsReplacement] = useState<boolean | null>(null)
  const [knockout, setKnockout] = useState<string | null>(null)

  const selectedIndustry = INDUSTRIES.find((i) => i.value === industry)
  const canProceed = hasStarted === false && selectedIndustry?.allowed && isInNRW === true && isReplacement === false

  const handleSubmit = () => {
    if (hasStarted) {
      setKnockout("❌ Vorzeitiger Maßnahmenbeginn: Förderung ausgeschlossen!")
      return
    }
    if (!selectedIndustry?.allowed) {
      setKnockout("❌ Branche nicht förderfähig (Exportbasis-Theorie)!")
      return
    }
    if (!isInNRW) {
      setKnockout("❌ Investition muss in NRW stattfinden!")
      return
    }
    if (isReplacement) {
      setKnockout("❌ Reine Ersatzbeschaffung ist nicht förderfähig!")
      return
    }

    onComplete({ hasStarted: false, industry, isInNRW: true, isReplacement: false })
  }

  return (
    <StepCard icon={Shield} title="Phase 1: Förderfähigkeits-Prüfung" description="Der Türsteher - Hard Knock-Outs">
      <div className="space-y-6">
        <QuestionCard
          question="Haben Sie bereits Lieferverträge unterschrieben oder Aufträge erteilt?"
          tooltip="Verbot des vorzeitigen Maßnahmenbeginns"
          status={hasStarted === false ? "success" : hasStarted === true ? "error" : null}
        >
          <div className="flex gap-3">
            <Button variant={hasStarted === false ? "success" : "default"} onClick={() => setHasStarted(false)}>
              <Check className="w-4 h-4 mr-2" />
              Nein
            </Button>
            <Button variant={hasStarted === true ? "error" : "default"} onClick={() => setHasStarted(true)}>
              <XCircle className="w-4 h-4 mr-2" />
              Ja
            </Button>
          </div>
        </QuestionCard>

        <QuestionCard
          question="In welcher Branche sind Sie tätig?"
          tooltip="Negativliste: Ausgeschlossene Branchen nach Regional-Förderung"
          status={selectedIndustry?.allowed ? "success" : selectedIndustry ? "error" : null}
        >
          <label htmlFor="industry-select" className="sr-only">Branche auswählen</label>
          <select
            id="industry-select"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-violet-600 focus:outline-none"
            aria-label="Branche auswählen"
          >
            <option value="">Bitte wählen...</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind.value} value={ind.value}>
                {ind.label} {!ind.allowed && "(nicht förderfähig)"}
              </option>
            ))}
          </select>
        </QuestionCard>

        <QuestionCard
          question="Findet die Investition in Nordrhein-Westfalen statt?"
          tooltip="Landesmittel NRW"
          status={isInNRW === true ? "success" : isInNRW === false ? "error" : null}
        >
          <div className="flex gap-3">
            <Button variant={isInNRW === true ? "success" : "default"} onClick={() => setIsInNRW(true)}>
              <Check className="w-4 h-4 mr-2" />
              Ja, in NRW
            </Button>
            <Button variant={isInNRW === false ? "error" : "default"} onClick={() => setIsInNRW(false)}>
              <XCircle className="w-4 h-4 mr-2" />
              Nein
            </Button>
          </div>
        </QuestionCard>

        <QuestionCard
          question="Handelt es sich um eine reine Ersatzbeschaffung (Alt gegen Neu ohne Upgrade)?"
          tooltip="Verbot reiner Ersatzinvestitionen (Mitnahmeeffekt)"
          status={isReplacement === false ? "success" : isReplacement === true ? "error" : null}
        >
          <div className="flex gap-3">
            <Button variant={isReplacement === false ? "success" : "default"} onClick={() => setIsReplacement(false)}>
              <Check className="w-4 h-4 mr-2" />
              Nein, Upgrade/Neu
            </Button>
            <Button variant={isReplacement === true ? "error" : "default"} onClick={() => setIsReplacement(true)}>
              <XCircle className="w-4 h-4 mr-2" />
              Ja, reine Ersatzbeschaffung
            </Button>
          </div>
        </QuestionCard>

        {knockout && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-50 border-2 border-red-300 rounded-xl p-6 text-center"
          >
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <p className="text-xl font-bold text-red-900 mb-2">{knockout}</p>
            <p className="text-sm text-red-700">Bitte kontaktieren Sie uns für eine manuelle Beratung.</p>
          </motion.div>
        )}

        <Button variant="primary" onClick={handleSubmit} disabled={!canProceed} fullWidth>
          {canProceed ? (
            <>
              Weiter zur Unternehmensanalyse <ArrowRight className="w-5 h-5 ml-2" />
            </>
          ) : (
            "Bitte alle Fragen beantworten"
          )}
        </Button>
      </div>
    </StepCard>
  )
}

// ============================================================================
// STEP 2: COMPANY - Added direct input fields alongside sliders
// ============================================================================

function CompanyStep({ onComplete, onBack }: { onComplete: (data: CompanyData) => void; onBack: () => void }) {
  const [employees, setEmployees] = useState(25)
  const [revenue, setRevenue] = useState(5000000)
  const [balanceSheet, setBalanceSheet] = useState(3000000)
  const [hasParent, setHasParent] = useState(false)

  const { size, isKMU } = determineCompanySize(employees, revenue, balanceSheet, hasParent)

  return (
    <StepCard icon={Building2} title="Phase 2: Unternehmens-Matrix" description="KMU-Status mit Konzernprüfung">
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            <strong>Tipp:</strong> Nutzen Sie die Schieberegler ODER geben Sie Werte direkt in die Eingabefelder ein.
          </p>
        </div>

        <InputFieldWithDirectInput
          label="Anzahl Mitarbeiter (Vollzeitäquivalente)"
          value={employees}
          onChange={setEmployees}
          min={1}
          max={1000}
          unit="FTE"
          step={1}
        />
        <InputFieldWithDirectInput
          label="Jahresumsatz"
          value={revenue}
          onChange={setRevenue}
          min={0}
          max={100000000}
          unit="€"
          step={100000}
        />
        <InputFieldWithDirectInput
          label="Bilanzsumme"
          value={balanceSheet}
          onChange={setBalanceSheet}
          min={0}
          max={100000000}
          unit="€"
          step={100000}
        />

        <QuestionCard
          question="Gehört Ihr Unternehmen zu mehr als 25% einem Konzern?"
          tooltip="Verbundene Unternehmen führen zur Hochstufung"
        >
          <div className="flex gap-3">
            <Button variant={!hasParent ? "success" : "default"} onClick={() => setHasParent(false)}>
              <Check className="w-4 h-4 mr-2" />
              Nein, unabhängig
            </Button>
            <Button variant={hasParent ? "error" : "default"} onClick={() => setHasParent(true)}>
              <AlertCircle className="w-4 h-4 mr-2" />
              Ja, Teil eines Konzerns
            </Button>
          </div>
        </QuestionCard>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className={`p-6 rounded-xl border-2 ${isKMU ? "bg-green-50 border-green-300" : "bg-orange-50 border-orange-300"}`}
        >
          <div className="flex items-center gap-4 mb-4">
            {isKMU ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : (
              <AlertCircle className="w-12 h-12 text-orange-600" />
            )}
            <div>
              <p className="text-2xl font-bold text-slate-900">{isKMU ? "✅ KMU-Status" : "⚠️ Großunternehmen"}</p>
              <p className="text-sm text-slate-600">
                {size === "small"
                  ? "Kleines Unternehmen (<50 MA, <10 Mio. € Umsatz)"
                  : size === "medium"
                    ? "Mittleres Unternehmen (<250 MA, <50 Mio. € Umsatz)"
                    : "Großunternehmen (≥250 MA oder ≥50 Mio. € Umsatz)"}
              </p>
            </div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <p className="text-sm font-medium text-slate-700 mb-2">Maximale Förderquoten:</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <span className="text-slate-600">C-Gebiet:</span>{" "}
                <span className="font-bold">{size === "small" ? "35%" : size === "medium" ? "25%" : "15%"}</span>
              </div>
              <div className="text-center">
                <span className="text-slate-600">D-Gebiet:</span>{" "}
                <span className="font-bold">{size === "small" ? "20%" : size === "medium" ? "10%" : "0%*"}</span>
              </div>
              <div className="text-center">
                <span className="text-slate-600">Max:</span> <span className="font-bold">{isKMU ? "50%" : "25%"}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zurück
        </Button>
        <Button
          variant="primary"
          onClick={() => onComplete({ employees, revenue, balanceSheet, hasParentCompany: hasParent, size, isKMU })}
          fullWidth
        >
          Weiter <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </StepCard>
  )
}

// ============================================================================
// STEP 3: LOCATION - Improved PLZ lookup with better feedback
// ============================================================================

function LocationStep({ onComplete, onBack }: { onComplete: (data: LocationData) => void; onBack: () => void }) {
  const [zipInput, setZipInput] = useState("")
  const [zipError, setZipError] = useState("")
  const [result, setResult] = useState<LocationData | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSubmit = async () => {
    setZipError("")
    setResult(null)

    if (zipInput.length !== 5) {
      setZipError("Bitte 5-stellige PLZ eingeben")
      return
    }

    setIsSearching(true)

    try {
      // Call the API to get real-time Fördergebiet data
      const response = await fetch(`/api/foerdergebiet?plz=${zipInput}`)
      const data = await response.json()
      
      // Try to get city name from geocoding API
      let cityName = `PLZ ${zipInput}`
      try {
        const geoResponse = await fetch(`/api/places/geocode?plz=${zipInput}`)
        const geoData = await geoResponse.json()
        if (geoData.city) {
          cityName = geoData.city
        }
      } catch {
        // City name lookup failed, use PLZ only
      }
      
      const code = data.code || "N"
      
      // Map the API code to our region types
      let region: FundingRegion = "NONE"
      if (code === "C" || code === "C+") {
        region = "C1" // Map C/C+ to C1 for compatibility
      } else if (code === "D") {
        region = "D"
      } else {
        region = "NONE"
      }
      
      const location: LocationData = {
        city: cityName,
        state: "Nordrhein-Westfalen",
        zipCode: zipInput,
        region
      }
      
      setIsSearching(false)
      setResult(location)
    } catch (error) {
      setIsSearching(false)
      setZipError(
        "Fehler beim Abrufen der Fördergebiet-Daten. Bitte versuchen Sie es erneut.",
      )
    }
  }

  return (
    <StepCard icon={MapPin} title="Phase 3: Standort-Check" description="Förderzone per PLZ ermitteln">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">PLZ des Investitionsstandorts</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={zipInput}
              onChange={(e) => {
                setZipInput(e.target.value.replace(/\D/g, "").slice(0, 5))
                setZipError("")
                setResult(null)
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="z.B. 44137"
              maxLength={5}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-violet-600 focus:outline-none text-lg font-mono"
            />
            <Button onClick={handleSubmit} disabled={isSearching}>
              {isSearching ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}>
                  <Search className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Prüfen
                </>
              )}
            </Button>
          </div>
          {zipError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {zipError}
            </motion.p>
          )}
        </div>

        {/* Example PLZ hints */}
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-2 font-medium">Beispiel-PLZ zum Testen:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { plz: "44137", label: "Dortmund (C1)" },
              { plz: "45127", label: "Essen (C1)" },
              { plz: "48143", label: "Münster (D)" },
              { plz: "40210", label: "Düsseldorf (Kein FG)" },
            ].map(({ plz, label }) => (
              <button
                key={plz}
                onClick={() => {
                  setZipInput(plz)
                  setResult(null)
                  setZipError("")
                }}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-violet-400 hover:bg-violet-50 transition-all"
              >
                {plz} <span className="text-slate-400">({label})</span>
              </button>
            ))}
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`border-2 rounded-xl p-6 ${
              result.region === "NONE"
                ? "bg-orange-50 border-orange-300"
                : "bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0"
                style={{ backgroundColor: FUNDING_CONFIGS[result.region].color }}
              >
                {result.region === "NONE" ? "—" : result.region}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{result.city}</h3>
                <p className="text-slate-600 mb-3">
                  PLZ {result.zipCode} • {result.state}
                </p>
                <div className={`rounded-lg p-3 ${result.region === "NONE" ? "bg-orange-100" : "bg-white/60"}`}>
                  <p className="text-sm font-bold text-slate-700 mb-1">{FUNDING_CONFIGS[result.region].label}</p>
                  <p className="text-xs text-slate-600">
                    {result.region === "C1"
                      ? "Höchste Förderquoten – EU-Strukturförderung Ruhrgebiet"
                      : result.region === "C2"
                        ? "Hohe Förderquoten – EU-Strukturförderung"
                        : result.region === "D"
                          ? "Nationale Förderung – Ergänzungsgebiet (Pufferzone)"
                          : "Andere Förderprogramme mit starken Konditionen möglich!"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <Button onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zurück
        </Button>
        <Button variant="primary" onClick={() => result && onComplete(result)} disabled={!result} fullWidth>
          Weiter <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </StepCard>
  )
}

// ============================================================================
// STEP 4: INVESTMENT - Added Grundstück, Umbau and direct input fields
// ============================================================================

function InvestmentStep({
  company,
  onComplete,
  onBack,
}: { company: CompanyData; onComplete: (data: InvestmentData) => void; onBack: () => void }) {
  const [land, setLand] = useState(0)
  const [buildings, setBuildings] = useState(0)
  const [renovation, setRenovation] = useState(0)
  const [newMachinery, setNewMachinery] = useState(500000)
  const [usedMachinery, setUsedMachinery] = useState(0)
  const [software, setSoftware] = useState(0)
  const [vehicles, setVehicles] = useState(0)

  const totalInvestment = land + buildings + renovation + newMachinery + usedMachinery + software + vehicles
  const eligibleBase = land + buildings + renovation + newMachinery
  const eligibleUsed = company.isKMU ? usedMachinery : 0
  const eligibleSoftware = company.isKMU ? software : Math.min(software, eligibleBase * 0.5)
  const totalEligible = eligibleBase + eligibleUsed + eligibleSoftware

  return (
    <StepCard
      icon={Euro}
      title="Phase 4: Investitions-Vorhaben"
      description="Förderfähige vs. nicht-förderfähige Kosten"
    >
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            <strong>Tipp:</strong> Klicken Sie auf den Euro-Betrag, um einen Wert direkt einzugeben, oder nutzen Sie den
            Schieberegler.
          </p>
        </div>

        <InputWithIconAndDirectInput
          icon={LandPlot}
          label="Grundstück / Grundstückserwerb"
          value={land}
          onChange={setLand}
          badge="✅ 100% förderfähig"
          helpText="Erwerb von Grundstücken für betriebliche Nutzung"
        />

        <InputWithIconAndDirectInput
          icon={Home}
          label="Gebäude (Neubau / Kauf)"
          value={buildings}
          onChange={setBuildings}
          badge="✅ 100% förderfähig"
          helpText="Neubau, Erwerb oder Erweiterung von Betriebsgebäuden"
        />

        <InputWithIconAndDirectInput
          icon={Hammer}
          label="Umbau / Modernisierung"
          value={renovation}
          onChange={setRenovation}
          badge="✅ 100% förderfähig"
          helpText="Umbaumaßnahmen, Sanierung und Modernisierung bestehender Gebäude"
        />

        <InputWithIconAndDirectInput
          icon={Wrench}
          label="Neue Maschinen / Anlagen"
          value={newMachinery}
          onChange={setNewMachinery}
          badge="✅ 100% förderfähig"
          helpText="Fabrikneue Produktionsanlagen, Maschinen und Ausrüstung"
        />

        <InputWithIconAndDirectInput
          icon={Factory}
          label="Gebrauchte Maschinen"
          value={usedMachinery}
          onChange={setUsedMachinery}
          badge={company.isKMU ? "✅ 100% förderfähig (KMU)" : "❌ Nicht förderfähig (GU)"}
          warning={!company.isKMU}
          helpText={
            company.isKMU
              ? "Gebrauchte Maschinen sind für KMU förderfähig"
              : "Großunternehmen: Gebrauchte Maschinen nicht förderfähig"
          }
        />

        <InputWithIconAndDirectInput
          icon={Cloud}
          label="Software / Patente / Lizenzen"
          value={software}
          onChange={setSoftware}
          badge={company.isKMU ? "✅ 100% förderfähig" : `⚠️ Max. 50% der Sachanlage-Kosten`}
          warning={!company.isKMU && software > eligibleBase * 0.5}
          helpText="Betriebssoftware, Patente, Lizenzen und immaterielle Wirtschaftsgüter"
        />

        <InputWithIconAndDirectInput
          icon={Truck}
          label="Fahrzeuge (PKW/LKW mit Straßenzulassung)"
          value={vehicles}
          onChange={setVehicles}
          badge="❌ NICHT förderfähig"
          warning={vehicles > 0}
          helpText="Fahrzeuge mit Straßenzulassung sind generell nicht förderfähig"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Gesamtinvestition</p>
            <p className="text-3xl font-bold text-slate-900">{totalInvestment.toLocaleString("de-DE")} €</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-300">
            <p className="text-sm text-green-700 mb-1">✅ Förderfähig</p>
            <p className="text-3xl font-bold text-green-900">{totalEligible.toLocaleString("de-DE")} €</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zurück
        </Button>
        <Button
          variant="primary"
          onClick={() => onComplete({ land, buildings, renovation, newMachinery, usedMachinery, software, vehicles })}
          fullWidth
        >
          Weiter <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </StepCard>
  )
}

// ============================================================================
// STEP 5: STRATEGY (unchanged)
// ============================================================================

function StrategyStep({ onComplete, onBack }: { onComplete: (data: StrategyData) => void; onBack: () => void }) {
  const [willHireMore, setWillHireMore] = useState<boolean | null>(null)
  const [expectGrowth, setExpectGrowth] = useState<boolean | null>(null)
  const [willMaintainWages, setWillMaintainWages] = useState<boolean | null>(null)

  const path: "jobs" | "productivity" = willHireMore ? "jobs" : "productivity"

  return (
    <StepCard icon={Target} title="Phase 5: Strategie-Check 2026" description="Jobs vs. Produktivität">
      <div className="space-y-6">
        <QuestionCard
          question="Planen Sie einen Personalaufbau von mindestens 10%?"
          status={willHireMore === true ? "success" : willHireMore === false ? "warning" : null}
        >
          <div className="flex gap-3">
            <Button variant={willHireMore === true ? "success" : "default"} onClick={() => setWillHireMore(true)}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Ja, +10% Personal
            </Button>
            <Button variant={willHireMore === false ? "default" : "default"} onClick={() => setWillHireMore(false)}>
              <TrendingDown className="w-4 h-4 mr-2" />
              Nein
            </Button>
          </div>
        </QuestionCard>

        {willHireMore === false && (
          <>
            <QuestionCard
              question="Erwarten Sie durch die Investition mehr Umsatz (Output)?"
              status={expectGrowth === true ? "success" : null}
            >
              <div className="flex gap-3">
                <Button variant={expectGrowth === true ? "success" : "default"} onClick={() => setExpectGrowth(true)}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Ja, Umsatzwachstum
                </Button>
                <Button variant={expectGrowth === false ? "default" : "default"} onClick={() => setExpectGrowth(false)}>
                  Nein
                </Button>
              </div>
            </QuestionCard>

            <QuestionCard
              question="Bleibt die Lohnsumme stabil?"
              status={willMaintainWages === true ? "success" : null}
            >
              <div className="flex gap-3">
                <Button
                  variant={willMaintainWages === true ? "success" : "default"}
                  onClick={() => setWillMaintainWages(true)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Ja, stabil
                </Button>
                <Button
                  variant={willMaintainWages === false ? "error" : "default"}
                  onClick={() => setWillMaintainWages(false)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Nein, Abbau
                </Button>
              </div>
            </QuestionCard>
          </>
        )}

        {(willHireMore !== null || (expectGrowth !== null && willMaintainWages !== null)) && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-6 rounded-xl border-2 ${
              willHireMore || (expectGrowth && willMaintainWages)
                ? "bg-blue-50 border-blue-300"
                : "bg-orange-50 border-orange-300"
            }`}
          >
            <p className="font-bold text-lg mb-2">
              {willHireMore
                ? "📈 Empfehlung: Arbeitsplatz-Förderung"
                : expectGrowth && willMaintainWages
                  ? "🎯 Empfehlung: Produktivitäts-Förderung"
                  : "⚠️ Förderung gefährdet"}
            </p>
            <p className="text-sm text-slate-700">
              {willHireMore
                ? "Personalaufbau >10% erfüllt Anforderung"
                : expectGrowth && willMaintainWages
                  ? "Outputsteigerung bei stabiler Lohnsumme erfüllt Produktivitätskriterien"
                  : "Weder Personalaufbau noch ausreichendes Wachstum geplant"}
            </p>
          </motion.div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <Button onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zurück
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            onComplete({
              willHireMore: willHireMore ?? false,
              expectGrowth: expectGrowth ?? false,
              willMaintainWages: willMaintainWages ?? true,
              path,
            })
          }
          disabled={willHireMore === null && (expectGrowth === null || willMaintainWages === null)}
          fullWidth
        >
          Weiter <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </StepCard>
  )
}

// ============================================================================
// STEP 6: BONUSES - Added explanations and De-minimis bonus
// ============================================================================

function BonusesStep({ location, company, bonuses, setBonuses, onComplete, onBack }: any) {
  const needsClimateBonus = company.size === "large" && location.region === "D"
  const DEMINIMIS_MAX = 300000

  return (
    <StepCard icon={Zap} title="Phase 6: Boni & Hebel" description="Maximieren Sie Ihre Förderquote">
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-violet-600" />
            So funktionieren die Boni
          </h4>
          <p className="text-sm text-slate-600">
            Die Basis-Förderquote kann durch verschiedene Boni erhöht werden. Wählen Sie alle zutreffenden Boni aus, um
            Ihre maximale Förderung zu berechnen. Die Gesamtquote ist auf {company.isKMU ? "50%" : "25%"} begrenzt.
          </p>
        </div>

        {/* Klimaschutz-Bonus */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          onClick={() => setBonuses({ ...bonuses, climate: !bonuses.climate })}
          className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
            bonuses.climate ? "border-green-500 bg-green-50" : "border-slate-200 hover:border-green-300"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-4 flex-1">
              <Leaf className={`w-10 h-10 ${bonuses.climate ? "text-green-600" : "text-slate-400"}`} />
              <div>
                <h3 className="font-bold text-lg mb-1">
                  Klimaschutz-Bonus <span className="text-green-600">+10%</span>
                  {needsClimateBonus && (
                    <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">ERFORDERLICH</span>
                  )}
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  Für Investitionen in Energieeffizienz, Dekarbonisierung, Kreislaufwirtschaft
                </p>
                <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg mt-2">
                  <strong>Was zählt dazu?</strong>
                  <ul className="mt-1 space-y-0.5 list-disc list-inside">
                    <li>Energieeffiziente Produktionsanlagen</li>
                    <li>Photovoltaik, Wärmepumpen, Speicher</li>
                    <li>CO₂-reduzierende Technologien</li>
                    <li>Recycling-/Kreislaufwirtschaftsanlagen</li>
                  </ul>
                </div>
                {needsClimateBonus && (
                  <p className="text-xs bg-red-50 text-red-700 p-2 rounded mt-2">
                    ⚠️ Als Großunternehmen im D-Gebiet NUR mit Klimaschutz-Investition förderfähig!
                  </p>
                )}
              </div>
            </div>
            {bonuses.climate && <CheckCircle className="w-6 h-6 text-green-600" />}
          </div>
        </motion.button>

        {/* Digitalisierungs-Bonus */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          onClick={() => setBonuses({ ...bonuses, digitalization: !bonuses.digitalization })}
          className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
            bonuses.digitalization ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-4 flex-1">
              <Cpu className={`w-10 h-10 ${bonuses.digitalization ? "text-blue-600" : "text-slate-400"}`} />
              <div>
                <h3 className="font-bold text-lg mb-1">
                  Digitalisierungs-Bonus <span className="text-blue-600">+5%</span>
                </h3>
                <p className="text-sm text-slate-600 mb-2">Für digitale Transformation und Industrie 4.0</p>
                <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg mt-2">
                  <strong>Was zählt dazu?</strong>
                  <ul className="mt-1 space-y-0.5 list-disc list-inside">
                    <li>IoT-Sensoren und vernetzte Maschinen</li>
                    <li>KI-gestützte Produktionssysteme</li>
                    <li>Automatisierung und Robotik</li>
                    <li>Cloud-Infrastruktur für Produktion</li>
                  </ul>
                </div>
              </div>
            </div>
            {bonuses.digitalization && <CheckCircle className="w-6 h-6 text-blue-600" />}
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          onClick={() => setBonuses({ ...bonuses, deminimis: !bonuses.deminimis })}
          className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
            bonuses.deminimis ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:border-amber-300"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-4 flex-1">
              <Gift className={`w-10 h-10 ${bonuses.deminimis ? "text-amber-600" : "text-slate-400"}`} />
              <div>
                <h3 className="font-bold text-lg mb-1">
                  De-minimis Aufstockung <span className="text-amber-600">+20%</span>
                  <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">EXTRA</span>
                </h3>
                <p className="text-sm text-slate-600 mb-2">Zusätzliche Förderung über EU-Beihilferecht (begrenzt)</p>
                <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg mt-2">
                  <strong>Wichtig zu wissen:</strong>
                  <ul className="mt-1 space-y-0.5 list-disc list-inside">
                    <li>Zusätzlich zur Regional-Förderung möglich</li>
                    <li>Max. {DEMINIMIS_MAX.toLocaleString("de-DE")} € über 3 Jahre (EU-Schwellwert)</li>
                    <li>Alle De-minimis-Beihilfen werden angerechnet</li>
                    <li>Separate Erklärung erforderlich</li>
                  </ul>
                </div>
              </div>
            </div>
            {bonuses.deminimis && <CheckCircle className="w-6 h-6 text-amber-600" />}
          </div>
        </motion.button>

        {/* Summary */}
        <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl p-4 border border-violet-200">
          <p className="text-sm font-medium text-slate-700">
            Ausgewählte Boni:{" "}
            <span className="font-bold text-violet-700">
              {[
                bonuses.climate && "+10% Klimaschutz",
                bonuses.digitalization && "+5% Digitalisierung",
                bonuses.deminimis && "+20% De-minimis (max. 300k€)",
              ]
                .filter(Boolean)
                .join(", ") || "Keine"}
            </span>
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zurück
        </Button>
        <Button variant="primary" onClick={onComplete} fullWidth>
          Berechnung abschließen <Sparkles className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </StepCard>
  )
}

// ============================================================================
// STEP 7: RESULT - Added De-minimis display
// ============================================================================

function ResultStep({ calculation, location, company, onReset }: any) {
  const [countUp, setCountUp] = useState(0)

  useEffect(() => {
    let current = 0
    const increment = calculation.fundingAmount / 60
    const timer = setInterval(() => {
      current += increment
      if (current >= calculation.fundingAmount) {
        setCountUp(calculation.fundingAmount)
        clearInterval(timer)
      } else {
        setCountUp(Math.floor(current))
      }
    }, 20)
    return () => clearInterval(timer)
  }, [calculation.fundingAmount])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl overflow-hidden text-white"
    >
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <Award className="w-12 h-12" />
        </motion.div>

        <h2 className="text-4xl font-bold mb-2">Ihre Förderindikation</h2>
        <p className="text-violet-100 mb-8">RWP NRW 2026 – Basierend auf aktueller Richtlinie</p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-6"
        >
          <p className="text-sm mb-2 text-violet-200">Ihre geschätzte Fördersumme</p>
          <p className="text-6xl md:text-7xl font-bold mb-4 drop-shadow-lg">{countUp.toLocaleString("de-DE")} €</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm">
            <div>
              <span className="text-violet-200">Basis:</span> <span className="font-bold">{calculation.baseRate}%</span>
            </div>
            <div>
              <span className="text-violet-200">Boni:</span>{" "}
              <span className="font-bold">+{calculation.bonusRate}%</span>
            </div>
            {calculation.deminimisBonus > 0 && (
              <div>
                <span className="text-violet-200">De-minimis:</span>{" "}
                <span className="font-bold text-amber-300">
                  +{calculation.deminimisBonus.toLocaleString("de-DE")} €
                </span>
              </div>
            )}
            <div>
              <span className="text-violet-200">Gesamt:</span>{" "}
              <span className="font-bold text-yellow-300">{calculation.totalRate}%</span>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm text-violet-200 mb-1">Standort</p>
            <p className="font-bold text-lg">{location.city}</p>
            <p className="text-xs text-violet-200">{FUNDING_CONFIGS[location.region].label}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm text-violet-200 mb-1">Status</p>
            <p className="font-bold text-lg">{company.isKMU ? "KMU" : "Großunternehmen"}</p>
            <p className="text-xs text-violet-200">
              {company.size === "small"
                ? "Kleines Unternehmen"
                : company.size === "medium"
                  ? "Mittleres Unternehmen"
                  : "Großunternehmen"}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm text-violet-200 mb-1">Förderfähige Kosten</p>
            <p className="font-bold text-lg">{calculation.eligibleAmount.toLocaleString("de-DE")} €</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mb-6 text-left">
          <p className="font-bold mb-2">📋 Strategischer Pfad</p>
          <p className="text-sm text-violet-100">{calculation.strategicPath}</p>
        </div>

        {calculation.warnings.length > 0 && (
          <div className="bg-amber-500/20 border border-amber-300/30 rounded-xl p-4 mb-6 text-left">
            <p className="font-bold mb-2 text-amber-100">⚠️ Wichtige Hinweise</p>
            <ul className="text-sm space-y-1 text-amber-50">
              {calculation.warnings.map((w: string, i: number) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex-1 bg-white/20 hover:bg-white/30 py-4 rounded-xl font-bold transition-all"
          >
            Neue Berechnung
          </button>
          <button className="flex-1 bg-white text-violet-600 py-4 rounded-xl font-bold hover:bg-violet-50 transition-all">
            Jetzt Beratung anfragen →
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StepCard({ icon: Icon, title, description, children }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 md:px-8 py-6 text-white">
        <Icon className="w-10 h-10 mb-3" />
        <h2 className="text-xl md:text-2xl font-bold mb-2">{title}</h2>
        <p className="text-violet-100 text-sm md:text-base">{description}</p>
      </div>
      <div className="p-6 md:p-8">{children}</div>
    </motion.div>
  )
}

function QuestionCard({ question, tooltip, status, children }: any) {
  return (
    <div
      className={`p-5 rounded-xl border-2 transition-all ${
        status === "success"
          ? "bg-green-50 border-green-300"
          : status === "error"
            ? "bg-red-50 border-red-300"
            : status === "warning"
              ? "bg-orange-50 border-orange-300"
              : "bg-slate-50 border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="font-medium text-slate-900 flex-1">{question}</p>
        {tooltip && (
          <span className="text-xs text-slate-500 ml-2" title={tooltip}>
            ℹ️
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function Button({ variant = "default", onClick, disabled, fullWidth, children }: any) {
  const variants: Record<string, string> = {
    default: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-lg",
    success: "bg-green-500 text-white hover:bg-green-600",
    error: "bg-red-500 text-white hover:bg-red-600",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 md:px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
    >
      {children}
    </button>
  )
}

function InputFieldWithDirectInput({ label, value, onChange, min, max, unit, step = 1 }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value.toString())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "")
    setInputValue(raw)
  }

  const handleInputBlur = () => {
    const parsed = Number.parseInt(inputValue, 10) || 0
    const clamped = Math.min(Math.max(parsed, min), max)
    onChange(clamped)
    setInputValue(clamped.toString())
    setIsEditing(false)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur()
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <label className="block text-sm font-medium text-slate-700 mb-3">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            onChange(Number(e.target.value))
            setInputValue(e.target.value)
          }}
          className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
        />
        {isEditing ? (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            autoFocus
            className="w-32 md:w-40 px-3 py-2 text-right font-bold border-2 border-violet-500 rounded-lg focus:outline-none"
          />
        ) : (
          <button
            onClick={() => {
              setIsEditing(true)
              setInputValue(value.toString())
            }}
            className="min-w-[120px] md:min-w-[160px] px-3 py-2 text-right font-bold text-slate-900 bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-300 rounded-lg transition-all cursor-text"
          >
            {value.toLocaleString("de-DE")} {unit}
          </button>
        )}
      </div>
    </div>
  )
}

function InputWithIconAndDirectInput({ icon: Icon, label, value, onChange, badge, warning, helpText }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value.toString())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "")
    setInputValue(raw)
  }

  const handleInputBlur = () => {
    const parsed = Number.parseInt(inputValue, 10) || 0
    const clamped = Math.min(Math.max(parsed, 0), 50000000)
    onChange(clamped)
    setInputValue(clamped.toString())
    setIsEditing(false)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur()
    }
  }

  return (
    <div
      className={`p-4 rounded-xl border-2 ${warning ? "border-orange-300 bg-orange-50" : "border-slate-200 bg-white hover:border-slate-300"} transition-all`}
    >
      <div className="flex items-start gap-3 mb-3">
        <Icon className={`w-6 h-6 mt-0.5 flex-shrink-0 ${warning ? "text-orange-600" : "text-violet-600"}`} />
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-slate-700">{label}</label>
          {badge && <span className={`text-xs ${warning ? "text-orange-600" : "text-green-600"}`}>{badge}</span>}
          {helpText && <p className="text-xs text-slate-500 mt-1">{helpText}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={5000000}
          step={10000}
          value={value}
          onChange={(e) => {
            onChange(Number(e.target.value))
            setInputValue(e.target.value)
          }}
          className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
        />
        {isEditing ? (
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              autoFocus
              className="w-28 md:w-36 px-3 py-2 pr-8 text-right font-bold border-2 border-violet-500 rounded-lg focus:outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">€</span>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsEditing(true)
              setInputValue(value.toString())
            }}
            className="min-w-[100px] md:min-w-[140px] px-3 py-2 text-right font-bold text-slate-900 bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-300 rounded-lg transition-all cursor-text"
          >
            {value.toLocaleString("de-DE")} €
          </button>
        )}
      </div>
    </div>
  )
}
