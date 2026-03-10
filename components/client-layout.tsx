"use client"

import { CompanyProvider } from "@/contexts/company-context"
import { CookieConsentProvider } from "@/contexts/cookie-consent-context"
import { CookieBanner } from "@/components/cookie-banner"
import { GoogleTagManager } from "@/components/google-tag-manager"
import { AnalyticsLoader } from "@/components/analytics-loader"
import { ErrorBoundary } from "@/components/error-boundary"
import { useEffect, type ReactNode } from "react"
import { initializeTracking } from "@/lib/tracking-utils"

export function ClientLayout({ children }: { children: ReactNode }) {
  // Initialize tracking on first render to capture landing page data
  useEffect(() => {
    initializeTracking()
  }, [])
  
  return (
    <ErrorBoundary>
      <CookieConsentProvider>
        <CompanyProvider>
          {children}
          <CookieBanner />
          <GoogleTagManager />
          <AnalyticsLoader />
        </CompanyProvider>
      </CookieConsentProvider>
    </ErrorBoundary>
  )
}
