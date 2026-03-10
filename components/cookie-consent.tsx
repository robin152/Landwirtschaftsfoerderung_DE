"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShow(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShow(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-slate-200 shadow-lg">
      <div className="container max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-600">
          Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Durch die Nutzung unserer Website stimmen Sie der
          Verwendung von Cookies zu.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleDecline}>
            Ablehnen
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Akzeptieren
          </Button>
        </div>
        <button onClick={handleDecline} className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0">
          <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
        </button>
      </div>
    </div>
  )
}
