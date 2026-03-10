"use client"

import { useEffect, useState } from "react"
import { useCookieConsent } from "@/contexts/cookie-consent-context"

declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void
  }
}

export function AnalyticsLoader() {
  const { consent } = useCookieConsent()
  const [clarityLoaded, setClarityLoaded] = useState(false)

  // Load Microsoft Clarity when analytics consent is given
  useEffect(() => {
    if (consent?.analytics && !clarityLoaded) {
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.async = true
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "vcgohq5fb4");
      `
      document.head.appendChild(script)
      setClarityLoaded(true)
    }
  }, [consent?.analytics, clarityLoaded])

  // Listen for consent updates (e.g., user changes settings)
  useEffect(() => {
    const handleConsentUpdate = (event: CustomEvent) => {
      const newConsent = event.detail
      if (!newConsent?.analytics && clarityLoaded) {
        // User revoked analytics consent - stop Clarity from tracking
        if (window.clarity) {
          window.clarity("stop")
        }
      }
    }

    window.addEventListener("cookieConsentUpdate", handleConsentUpdate as EventListener)
    return () => {
      window.removeEventListener("cookieConsentUpdate", handleConsentUpdate as EventListener)
    }
  }, [clarityLoaded])

  return null
}
