"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, ChevronDown, ChevronUp, Shield, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCookieConsent, type CookieConsent } from "@/contexts/cookie-consent-context"

interface CookieInfo {
  name: string
  purpose: string
  duration: string
  provider?: string
}

interface CookieCategoryProps {
  title: string
  description: string
  isRequired?: boolean
  isEnabled: boolean
  onToggle?: () => void
  cookies: CookieInfo[]
}

function CookieCategory({ title, description, isRequired, isEnabled, onToggle, cookies }: CookieCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
      {/* Header Row */}
      <div 
        className={`flex items-center justify-between p-3 ${!isRequired ? "cursor-pointer hover:bg-slate-100" : ""}`}
        onClick={!isRequired ? onToggle : undefined}
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900 text-sm">{title}</span>
            {isRequired && (
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Erforderlich</span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
        <div className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${
          isRequired ? "bg-teal-600 cursor-not-allowed" : isEnabled ? "bg-teal-600" : "bg-slate-300"
        }`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
            isEnabled || isRequired ? "right-1" : "left-1"
          }`} />
        </div>
      </div>
      
      {/* Expand Button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded) }}
        className="w-full px-3 py-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1 border-t border-slate-200 transition-colors"
      >
        {isExpanded ? "Cookies ausblenden" : `${cookies.length} Cookies anzeigen`}
        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      
      {/* Cookie Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              {cookies.map((cookie, index) => (
                <div key={index} className="bg-white rounded-md p-2.5 border border-slate-100 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <code className="font-mono text-[11px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                        {cookie.name}
                      </code>
                      {cookie.provider && (
                        <span className="ml-2 text-[10px] text-slate-400">{cookie.provider}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{cookie.duration}</span>
                  </div>
                  <p className="text-slate-600 mt-1.5 leading-relaxed">{cookie.purpose}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function CookieBanner() {
  const { showBanner, setShowBanner, acceptAll, acceptSelected, rejectAll, hasConsented, consent } = useCookieConsent()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedConsent, setSelectedConsent] = useState<Partial<CookieConsent>>({
    necessary: true,
    functional: consent?.functional ?? true,
    analytics: consent?.analytics ?? false,
    marketing: consent?.marketing ?? false,
  })

  const toggleCategory = (category: keyof CookieConsent) => {
    if (category === "necessary") return // Cannot disable necessary cookies
    setSelectedConsent(prev => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleAcceptSelected = () => {
    acceptSelected(selectedConsent)
  }

  return (
    <>
      {/* Cookie Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[99998] p-4 md:p-6"
          >
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="p-4 md:p-6 pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-lg mb-1">Cookie-Einstellungen</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Wir nutzen Cookies, um Ihnen die bestmögliche Erfahrung zu bieten. 
                      Einige sind technisch notwendig, andere helfen uns, unsere Website zu verbessern und 
                      personalisierte Inhalte anzuzeigen.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 md:px-6 py-4 space-y-3">
                      {/* Necessary - Always on */}
                      <CookieCategory
                        title="Notwendig"
                        description="Grundlegende Funktionen wie Seitennavigation und Sicherheit"
                        isRequired
                        isEnabled={true}
                        cookies={[
                          { name: "grw_cookie_consent", purpose: "Speichert Ihre Cookie-Einstellungen", duration: "1 Jahr" },
                          { name: "Session-ID", purpose: "Hält Sie während des Besuchs angemeldet", duration: "Sitzung" },
                        ]}
                      />

                      {/* Functional */}
                      <CookieCategory
                        title="Funktional"
                        description="Erweiterte Funktionen wie Formulare und Live-Chat"
                        isEnabled={selectedConsent.functional ?? false}
                        onToggle={() => toggleCategory("functional")}
                        cookies={[
                          { name: "company_selection", purpose: "Speichert Ihre ausgewählte Firma für personalisierte Analyse", duration: "30 Tage" },
                          { name: "location_data", purpose: "Speichert Ihren Standort für Förderquoten-Berechnung", duration: "Sitzung" },
                        ]}
                      />

                      {/* Analytics */}
                      <CookieCategory
                        title="Analyse"
                        description="Hilft uns zu verstehen, wie Besucher die Website nutzen"
                        isEnabled={selectedConsent.analytics ?? false}
                        onToggle={() => toggleCategory("analytics")}
                        cookies={[
                          { name: "_clck", purpose: "Microsoft Clarity - Eindeutige Benutzer-ID", duration: "1 Jahr", provider: "Microsoft Clarity" },
                          { name: "_clsk", purpose: "Microsoft Clarity - Verbindet Seitenaufrufe zu einer Sitzung", duration: "1 Tag", provider: "Microsoft Clarity" },
                          { name: "CLID", purpose: "Microsoft Clarity - Identifiziert erstmalige/wiederkehrende Besucher", duration: "1 Jahr", provider: "Microsoft Clarity" },
                        ]}
                      />

                      {/* Marketing */}
                      <CookieCategory
                        title="Marketing"
                        description="Ermöglicht personalisierte Werbung und Remarketing"
                        isEnabled={selectedConsent.marketing ?? false}
                        onToggle={() => toggleCategory("marketing")}
                        cookies={[
                          { name: "_fbp", purpose: "Meta Pixel (via Google Tag Manager) - Identifiziert Browser für Werbung und Remarketing auf Facebook/Instagram", duration: "3 Monate", provider: "Meta" },
                          { name: "_fbc", purpose: "Meta Pixel (via Google Tag Manager) - Speichert den Facebook-Klick-ID-Parameter für Conversion-Tracking", duration: "3 Monate", provider: "Meta" },
                          { name: "_gcl_au", purpose: "Google Ads - Conversion-Tracking", duration: "3 Monate", provider: "Google" },
                        ]}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="p-4 md:p-6 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {/* Reject All */}
                  <Button
                    variant="outline"
                    onClick={rejectAll}
                    className="order-3 sm:order-1 text-slate-600 hover:text-slate-900 bg-transparent border-slate-300"
                  >
                    Nur Notwendige
                  </Button>

                  {/* Expand/Collapse */}
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="order-2 flex items-center gap-2 bg-transparent border-slate-300"
                  >
                    {showAdvanced ? (
                      <>
                        Weniger <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Erweitert <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  {/* Accept Selected (only in advanced mode) */}
                  {showAdvanced && (
                    <Button
                      variant="outline"
                      onClick={handleAcceptSelected}
                      className="order-4 sm:order-3 bg-transparent border-teal-300 text-teal-700 hover:bg-teal-50"
                    >
                      Auswahl speichern
                    </Button>
                  )}

                  {/* Accept All */}
                  <Button
                    onClick={acceptAll}
                    className="order-1 sm:order-last bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                  >
                    Alle akzeptieren
                  </Button>
                </div>

                {/* Privacy Link */}
                <p className="text-[10px] text-slate-400 text-center mt-3">
                  Weitere Informationen finden Sie in unserer{" "}
                  <a href="/datenschutz" className="underline hover:text-slate-600">
                    Datenschutzerklärung
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cookie Button (bottom-left) - only shows after consent */}
      {hasConsented && !showBanner && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", damping: 20 }}
          onClick={() => setShowBanner(true)}
          className="fixed bottom-4 left-4 z-[99997] w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all group"
          aria-label="Cookie-Einstellungen öffnen"
        >
          <Cookie className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors" />
        </motion.button>
      )}
    </>
  )
}
