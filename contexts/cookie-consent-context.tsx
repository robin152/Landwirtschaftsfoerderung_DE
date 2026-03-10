"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CookieConsent {
  necessary: boolean // Always true, required
  functional: boolean
  analytics: boolean
  marketing: boolean
}

interface CookieConsentContextType {
  consent: CookieConsent | null
  hasConsented: boolean
  showBanner: boolean
  setShowBanner: (show: boolean) => void
  acceptAll: () => void
  acceptSelected: (consent: Partial<CookieConsent>) => void
  rejectAll: () => void
  openSettings: () => void
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

const COOKIE_CONSENT_KEY = "grw_cookie_consent"
const COOKIE_CONSENT_VERSION = "1.0"

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [hasConsented, setHasConsented] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load consent from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.version === COOKIE_CONSENT_VERSION && parsed.consent) {
          setConsent(parsed.consent)
          setHasConsented(true)
          setShowBanner(false)
        } else {
          // Version mismatch - ask again
          setShowBanner(true)
        }
      } else {
        // No consent stored - show banner
        setShowBanner(true)
      }
    } catch {
      setShowBanner(true)
    }
    setIsInitialized(true)
  }, [])

  // Save consent to localStorage
  const saveConsent = (newConsent: CookieConsent) => {
    const data = {
      version: COOKIE_CONSENT_VERSION,
      consent: newConsent,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data))
    setConsent(newConsent)
    setHasConsented(true)
    setShowBanner(false)
    
    // Dispatch custom event for scripts to listen to
    window.dispatchEvent(new CustomEvent("cookieConsentUpdate", { detail: newConsent }))
  }

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    })
  }

  const acceptSelected = (selected: Partial<CookieConsent>) => {
    saveConsent({
      necessary: true, // Always required
      functional: selected.functional ?? false,
      analytics: selected.analytics ?? false,
      marketing: selected.marketing ?? false,
    })
  }

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    })
  }

  const openSettings = () => {
    setShowBanner(true)
  }

  // Don't render banner during SSR
  if (!isInitialized) {
    return <>{children}</>
  }

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasConsented,
        showBanner,
        setShowBanner,
        acceptAll,
        acceptSelected,
        rejectAll,
        openSettings,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (!context) {
    // Return safe defaults if used outside provider (during SSR/hydration)
    return {
      consent: null,
      hasConsented: false,
      showBanner: false,
      setShowBanner: () => {},
      acceptAll: () => {},
      acceptSelected: () => {},
      rejectAll: () => {},
      openSettings: () => {},
    }
  }
  return context
}
