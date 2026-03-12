"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, Sparkles } from "lucide-react"
import { LeadCaptureModal } from "./lead-capture-modal"
import { useCompany } from "@/contexts/company-context"
import { TractorIcon, WheatIcon } from "@/components/agri-icons"

function StickyCTAInner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { company, analysis } = useCompany()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 4000)

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [mounted])

  const handleMinimize = () => {
    setIsMinimized(true)
  }

  const handleExpand = () => {
    setIsMinimized(false)
  }

  const ownerLastName = analysis?.owner?.name?.split(" ").pop()
  const ownerSalutation =
    analysis?.owner?.firstName && ownerLastName ? `Herr ${ownerLastName}` : null
  const companyFact = analysis?.companyProfile?.industry || company?.industry

  if (!mounted) return null

  return (
    <>
      <AnimatePresence mode="wait">
        {isVisible && isMinimized ? (
          /* ── Minimized state: small pill to expand ──────────────── */
          <motion.button
            key="sticky-minimized"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={handleExpand}
            style={{ position: "fixed", right: "1rem", bottom: "1.5rem", zIndex: 99990 }}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-full shadow-xl shadow-green-900/30 transition-all group"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/patrick-starkmann.webp"
                alt="Patrick Starkmann"
                width={32}
                height={32}
                className="object-cover object-top w-full h-full"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border border-white rounded-full" />
            </div>
            <span className="text-sm font-semibold whitespace-nowrap">Beratung</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        ) : isVisible && !isMinimized ? (
          <>
            {/* ── Desktop: floating card bottom-right ───────────────── */}
            <motion.div
              key="sticky-desktop"
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{ position: "fixed", right: "1rem", bottom: "1.5rem", zIndex: 99990 }}
              className="hidden lg:block"
            >
              <div className="relative w-64 bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200/80 overflow-hidden">
                {/* Minimize */}
                <button
                  onClick={handleMinimize}
                  aria-label="Minimieren"
                  className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                </button>

                {/* Dark header stripe */}
                <div className="bg-gradient-to-br from-green-900 via-slate-800 to-slate-900 px-4 pt-4 pb-12 relative overflow-hidden">
                  <WheatIcon className="absolute -right-2 -top-2 w-16 h-16 text-green-700/20" aria-hidden="true" />
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="text-[10px] font-medium text-green-400 uppercase tracking-wider">Online</span>
                  </div>
                </div>

                {/* Avatar */}
                <div className="relative -mt-10 px-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/patrick-starkmann.webp"
                      alt="Patrick Starkmann – Spezialist für Subventionen in der Agrarwirtschaft"
                      width={64}
                      height={64}
                      className="object-cover object-top w-full h-full"
                    />
                  </div>
                </div>

                {/* Body */}
                <div className="px-4 pt-2 pb-4">
                  {ownerSalutation ? (
                    <>
                      <p className="text-[10px] text-emerald-600 font-medium mb-0.5">{ownerSalutation},</p>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">
                        Patrick Starkmann ist bereit, Ihre Anfrage zu prüfen
                      </h4>
                      {companyFact && (
                        <p className="text-[10px] text-slate-500 mb-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" aria-hidden="true" />
                          Betrieb: {companyFact}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <h4 className="font-bold text-slate-900 text-base">Patrick Starkmann</h4>
                      <p className="text-xs text-slate-500 mb-3">Spezialist für Subventionen in der Agrarwirtschaft</p>
                    </>
                  )}

                  <div className="space-y-2 mt-2">
                    {/* Benefits list */}
                    <ul className="space-y-1 mb-3">
                      <li className="flex items-center gap-1.5 text-[10px] text-slate-600">
                        <span className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0" />
                        Direkte Einschätzung der Förderfähigkeit
                      </li>
                      <li className="flex items-center gap-1.5 text-[10px] text-slate-600">
                        <span className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0" />
                        Erste Ermittlung der Fördersumme
                      </li>
                      <li className="flex items-center gap-1.5 text-[10px] text-slate-600">
                        <span className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0" />
                        Unverbindlich und 100 % kostenlos
                      </li>
                    </ul>

                    <div className="relative">
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(22, 163, 74, 0)",
                            "0 0 0 8px rgba(22, 163, 74, 0.3)",
                            "0 0 0 0 rgba(22, 163, 74, 0)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-lg"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="w-full relative px-3 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <span className="text-[11px] leading-tight text-center">
                          Jetzt kostenloses Erstgespräch buchen
                        </span>
                        <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                        </motion.span>
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="h-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
              </div>
            </motion.div>

            {/* ── Mobile: fixed bottom bar ──────────────────────────── */}
            <motion.div
              key="sticky-mobile"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99990 }}
              className="lg:hidden"
            >
              <div
                className="relative bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 pt-3 shadow-lg"
                style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))" }}
              >
                {/* Mobile Minimize Button */}
                <button
                  onClick={handleMinimize}
                  aria-label="Minimieren"
                  className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                </button>

                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-green-500 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/patrick-starkmann.webp"
                      alt="Patrick Starkmann"
                      width={44}
                      height={44}
                      className="object-cover object-top w-full h-full"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 truncate">Förderberater Patrick Starkmann</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {ownerSalutation ? `${ownerSalutation} – Termin sichern` : "Förderung kostenlos berechnen"}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex-shrink-0">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsModalOpen(true)}
                      className="relative px-4 py-2.5 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-sm flex items-center gap-1.5 shadow-md shadow-green-900/20"
                    >
                      <TractorIcon className="w-4 h-4 text-white" aria-hidden="true" />
                      Prüfen
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prefilledData={{
          company: company?.name,
          plz: company?.plz,
          ownerFirstName: analysis?.owner?.firstName || undefined,
          ownerLastName: analysis?.owner?.name?.split(" ").slice(-1)[0] || undefined,
          industry:
            analysis?.companyProfile?.industry ||
            analysis?.eligibility?.industry ||
            company?.industry,
          ownerRole: analysis?.owner?.role || undefined,
          mainActivity: analysis?.companyProfile?.mainActivity || undefined,
        }}
      />
    </>
  )
}

export function StickyCTA() {
  return <StickyCTAInner />
}
