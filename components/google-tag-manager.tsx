"use client"

import { useEffect, useRef, useCallback } from "react"
import { useCookieConsent } from "@/contexts/cookie-consent-context"

const GTM_ID = "GTM-N7QZBX9M"

/**
 * Google Tag Manager Component
 * 
 * Implements GTM with proper cookie consent handling.
 * - Only loads GTM after user has given consent for analytics OR marketing cookies
 * - Uses safe DOM manipulation to inject scripts
 * - Supports re-consent: listens for cookieConsentUpdate events
 * - Injects noscript fallback for users without JavaScript
 */
export function GoogleTagManager() {
  const { consent, hasConsented } = useCookieConsent()
  const isInjectedRef = useRef(false)
  const noscriptInjectedRef = useRef(false)

  /**
   * Check if GTM should be enabled based on consent
   * GTM is enabled if user has consented to either analytics OR marketing
   */
  const isGTMAllowed = useCallback(() => {
    if (!consent || !hasConsented) return false
    return consent.analytics || consent.marketing
  }, [consent, hasConsented])

  /**
   * Safely inject the GTM script into the document head
   * Uses DOM API for clean, controlled script injection
   */
  const injectGTMScript = useCallback(() => {
    if (typeof window === "undefined") return
    if (isInjectedRef.current) return

    // Initialize dataLayer if not present
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js"
    })

    // Create and configure the script element
    const script = document.createElement("script")
    script.id = "gtm-script"
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
    
    // Add error handling
    script.onerror = () => {
      console.warn("[GTM] Failed to load Google Tag Manager")
    }

    // Insert as the first script in the head for optimal loading
    const firstScript = document.getElementsByTagName("script")[0]
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript)
    } else {
      document.head.appendChild(script)
    }

    isInjectedRef.current = true
    console.log("[GTM] Google Tag Manager initialized with consent")
  }, [])

  /**
   * Inject the noscript fallback into the body
   * This provides tracking for users with JavaScript disabled
   */
  const injectNoscript = useCallback(() => {
    if (typeof document === "undefined") return
    if (noscriptInjectedRef.current) return

    // Check if noscript already exists
    const existingNoscript = document.getElementById("gtm-noscript")
    if (existingNoscript) {
      noscriptInjectedRef.current = true
      return
    }

    // Create noscript element with iframe
    const noscript = document.createElement("noscript")
    noscript.id = "gtm-noscript"
    
    const iframe = document.createElement("iframe")
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`
    iframe.height = "0"
    iframe.width = "0"
    iframe.style.display = "none"
    iframe.style.visibility = "hidden"
    iframe.setAttribute("aria-hidden", "true")
    iframe.setAttribute("tabindex", "-1")
    
    noscript.appendChild(iframe)

    // Insert at the beginning of body for optimal positioning
    if (document.body.firstChild) {
      document.body.insertBefore(noscript, document.body.firstChild)
    } else {
      document.body.appendChild(noscript)
    }

    noscriptInjectedRef.current = true
  }, [])

  /**
   * Remove GTM if consent is revoked
   * Note: This doesn't completely unload GTM (not possible), 
   * but prevents further data collection by clearing dataLayer
   */
  const removeGTM = useCallback(() => {
    if (typeof window === "undefined") return

    // Clear dataLayer to stop further event tracking
    if (window.dataLayer) {
      window.dataLayer.length = 0
      window.dataLayer.push({ event: "gtm.clear" })
    }

    // Remove the script element
    const script = document.getElementById("gtm-script")
    if (script) {
      script.remove()
    }

    // Remove noscript element
    const noscript = document.getElementById("gtm-noscript")
    if (noscript) {
      noscript.remove()
    }

    isInjectedRef.current = false
    noscriptInjectedRef.current = false
    console.log("[GTM] Google Tag Manager removed after consent revocation")
  }, [])

  // Handle initial consent check and inject GTM if allowed
  useEffect(() => {
    if (!hasConsented) return

    if (isGTMAllowed()) {
      injectGTMScript()
      injectNoscript()
    } else {
      // Consent was given but GTM not allowed - ensure it's removed
      removeGTM()
    }
  }, [hasConsented, isGTMAllowed, injectGTMScript, injectNoscript, removeGTM])

  // Listen for consent updates (user changes preferences)
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleConsentUpdate = (event: CustomEvent) => {
      const newConsent = event.detail
      const allowed = newConsent?.analytics || newConsent?.marketing

      if (allowed) {
        injectGTMScript()
        injectNoscript()
      } else {
        removeGTM()
      }
    }

    window.addEventListener("cookieConsentUpdate", handleConsentUpdate as EventListener)
    
    return () => {
      window.removeEventListener("cookieConsentUpdate", handleConsentUpdate as EventListener)
    }
  }, [injectGTMScript, injectNoscript, removeGTM])

  // This component doesn't render anything visible
  return null
}

// Type declaration for window.dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}
