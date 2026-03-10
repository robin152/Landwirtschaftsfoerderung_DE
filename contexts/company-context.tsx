"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

export interface CompanyData {
  name: string
  address: string
  plz: string
  city: string
  website: string | null
  industry: string
  phone: string | null
  placeId: string
}

// Shared form data that persists across components
export interface SharedFormData {
  contactName: string
  email: string
  phone: string
  investment: string
}

export interface CompanyAnalysis {
  owner: {
    name: string | null
    firstName: string | null
    role: string | null
    found: boolean
  } | null
  companyProfile: {
    summary: string
    industry: string
    mainActivity: string
    products: string[]
    employeeEstimate: string
    companyType: string
  } | null
  fundingPotential: {
    maxQuote: number
    baseQuote: number
    regionalBonus: number
    climateBonus: number
    foerdergebiet: string
    foerdergebietCode?: "N" | "C" | "C+" | "D" // Webhook response code
    foerdergebietTyp: string // C-Gebiet, C+-Gebiet, D-Gebiet, Standard
    eligibilityScore: number
    isAAngrenzend: boolean
    hasBevoelkerungsBonus: boolean
  } | null
  // Detaillierte Bonus-Bausteine für hyperpersonalisierte Erklärung
  fundingPathways: {
    pfadA: {
      available: boolean
      quote: string
      explanation: string
    }
    pfadB: {
      available: boolean
      quote: string
      explanation: string
      eeType: "erzeugung" | "speicher" | "beide" | null
    }
    pfadC1: {
      available: boolean
      quote: string
      explanation: string
    }
    pfadC2: {
      available: boolean
      quote: string
      explanation: string
    }
    pfadD: {
      available: boolean
      quote: string
      explanation: string
      maxInvestment: string
    }
  } | null
  bonusExplanation: {
    personalGreeting: string
    standortAnalyse: string
    branchenVorteile: string
    empfohlenerPfad: string
    konkreteSchritte: string[]
  } | null
  investmentIdeas: {
    title: string
    description: string
    estimatedInvestment: string
    potentialFunding: string
    fundingPath: string
  }[]
  industryBenefits: string | null
  personalizedMessage: string | null
}

interface CompanyContextType {
  company: CompanyData | null
  analysis: CompanyAnalysis | null
  sharedFormData: SharedFormData
  isLoading: boolean
  isAnalyzing: boolean
  setCompany: (company: CompanyData | null) => void
  setAnalysis: (analysis: CompanyAnalysis | null) => void
  updateSharedFormData: (data: Partial<SharedFormData>) => void
  setIsLoading: (loading: boolean) => void
  setIsAnalyzing: (analyzing: boolean) => void
  clearCompany: () => void
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

const STORAGE_KEY = "eskalator_shared_form_data"

const defaultSharedFormData: SharedFormData = {
  contactName: "",
  email: "",
  phone: "",
  investment: "",
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useState<CompanyData | null>(null)
  const [analysis, setAnalysis] = useState<CompanyAnalysis | null>(null)
  const [sharedFormData, setSharedFormData] = useState<SharedFormData>(defaultSharedFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Load shared form data from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSharedFormData(prev => ({ ...prev, ...parsed }))
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  // Update shared form data and persist to sessionStorage
  const updateSharedFormData = (data: Partial<SharedFormData>) => {
    setSharedFormData(prev => {
      const updated = { ...prev, ...data }
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // Ignore storage errors
      }
      return updated
    })
  }

  const clearCompany = () => {
    setCompany(null)
    setAnalysis(null)
    setIsLoading(false)
    setIsAnalyzing(false)
  }

  return (
    <CompanyContext.Provider
      value={{
        company,
        analysis,
        sharedFormData,
        isLoading,
        isAnalyzing,
        setCompany,
        setAnalysis,
        updateSharedFormData,
        setIsLoading,
        setIsAnalyzing,
        clearCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider")
  }
  return context
}
