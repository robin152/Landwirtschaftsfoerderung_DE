"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, Loader2, Shield, Lock } from "lucide-react"
import { PhoneInput } from "@/components/phone-input"
import confetti from "canvas-confetti"
import { collectTrackingData } from "@/lib/tracking-utils"

const WEBHOOK_URL = "/api/leads"

interface RechnerUnlockModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  prefilledData?: {
    investment?: number
    investitionsart?: string
    investitionsartLabel?: string
    bundesland?: string
    foerdersatz?: number
    foerderbetrag?: number
    istJunglandwirt?: boolean
    istOeko?: boolean
  }
}

export function RechnerUnlockModal({ isOpen, onClose, onSuccess, prefilledData }: RechnerUnlockModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [datenschutz, setDatenschutz] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; datenschutz?: string }>({})
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setShowSuccess(false)
      setErrors({})
      setTimeout(() => nameRef.current?.focus(), 150)
    }
  }, [isOpen])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  const validate = () => {
    const e: typeof errors = {}
    if (name.trim().length < 2) e.name = "Bitte vollständigen Namen eingeben."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Bitte gültige E-Mail eingeben."
    const digits = phone.replace(/\D/g, "")
    if (digits.length < 8) e.phone = "Bitte Mobilnummer eingeben."
    if (!datenschutz) e.datenschutz = "Bitte Datenschutz bestätigen."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors: ["#16a34a", "#22c55e", "#bbf7d0", "#fbbf24"],
      gravity: 0.7,
      ticks: 200,
      zIndex: 99999,
    })
    setTimeout(() => {
      confetti({
        particleCount: 20,
        spread: 60,
        origin: { x: 0.5, y: 0.2 },
        shapes: ["text"],
        shapeOptions: { text: { value: ["🌾", "💰", "🚜"] } },
        scalar: 2,
        gravity: 0.8,
        ticks: 240,
        zIndex: 99999,
      } as Parameters<typeof confetti>[0])
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)

    const tracking = collectTrackingData()
    const internalEventId = `ru_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const payload = {
      // Contact
      name: name.trim(),
      email: email.trim(),
      phone,
      source: "rechner-unlock",
      timestamp: new Date().toISOString(),

      // Rechner context
      rechner_investitionsart: prefilledData?.investitionsart ?? null,
      rechner_investitionsart_label: prefilledData?.investitionsartLabel ?? null,
      rechner_bundesland: prefilledData?.bundesland ?? null,
      rechner_foerdersatz: prefilledData?.foerdersatz ?? null,
      rechner_foerderbetrag: prefilledData?.foerderbetrag ?? null,
      rechner_investvolumen: prefilledData?.investment ?? null,
      rechner_junglandwirt: prefilledData?.istJunglandwirt ?? null,
      rechner_oeko: prefilledData?.istOeko ?? null,

      // Facebook Pixel
      fbclid: tracking.fbclid,
      fbp: tracking.fbp,
      fbc: tracking.fbc,

      // UTM
      utm_source: tracking.utm_source,
      utm_medium: tracking.utm_medium,
      utm_campaign: tracking.utm_campaign,
      utm_content: tracking.utm_content,
      utm_term: tracking.utm_term,

      // Ad Platform IDs
      ad_id: tracking.ad_id,
      adset_id: tracking.adset_id,
      campaign_id: tracking.campaign_id,

      // Google / TikTok / LinkedIn
      gclid: tracking.gclid,
      ttclid: tracking.ttclid,
      li_fat_id: tracking.li_fat_id,

      // Session
      browser_id: tracking.browser_id,
      session_id: tracking.session_id,
      gtm_event_id: internalEventId,

      // Context
      landing_page: tracking.landing_page,
      referrer: tracking.referrer,
      user_agent: tracking.user_agent,
    }

    // Push to dataLayer (GTM / Meta)
    if (typeof window !== "undefined") {
      const firstName = name.trim().split(" ")[0]
      const lastName = name.trim().split(" ").slice(1).join(" ") || undefined
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        lead_email: email.trim(),
        lead_firstName: firstName,
        lead_lastName: lastName,
        lead_phone: phone,
        lead_eventId: internalEventId,
      })
      window.dataLayer.push({
        event: "lead_success",
        event_id: internalEventId,
        lead_source: "rechner-unlock",
      })
    }

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok || !result.success) {
        setIsSubmitting(false)
        setErrors({ email: "Übertragungsfehler — bitte erneut versuchen." })
        return
      }
    } catch {
      setIsSubmitting(false)
      setErrors({ email: "Netzwerkfehler — bitte erneut versuchen." })
      return
    }

    setIsSubmitting(false)
    setShowSuccess(true)
    triggerConfetti()

    setTimeout(() => {
      onSuccess()
      onClose()
    }, 2200)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Ergebnis freischalten"
          >
            <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

              {/* Header bar */}
              <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-200" aria-hidden="true" />
                  <span className="text-white font-bold text-sm">Ergebnis freischalten</span>
                </div>
                <button
                  onClick={onClose}
                  className="text-emerald-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  aria-label="Schließen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {showSuccess ? (
                  /* ── Success ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 text-center"
                  >
                    <div className="w-16 h-16 bg-emerald-600/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-white font-extrabold text-xl mb-2">Ergebnis wird geladen…</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Ihre Anfrage ist bei uns — wir melden uns am gleichen Werktag.
                    </p>
                  </motion.div>
                ) : (
                  /* ── Form ── */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="p-5 space-y-4"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Subheadline */}
                    <p className="text-slate-300 text-sm leading-relaxed text-center">
                      Nur <strong className="text-white">3 Felder</strong> — dann sehen Sie sofort Ihren staatlichen Zuschuss.
                    </p>

                    {/* Name */}
                    <div>
                      <label htmlFor="unlock-name" className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Vor- und Nachname
                      </label>
                      <input
                        ref={nameRef}
                        id="unlock-name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
                        placeholder="Max Mustermann"
                        className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                          errors.name ? "border-red-500 focus:ring-red-500/40" : "border-slate-700 focus:ring-emerald-500/40 focus:border-emerald-600"
                        }`}
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="unlock-email" className="block text-xs font-semibold text-slate-400 mb-1.5">
                        E-Mail-Adresse
                      </label>
                      <input
                        id="unlock-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
                        placeholder="max@musterhof.de"
                        className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                          errors.email ? "border-red-500 focus:ring-red-500/40" : "border-slate-700 focus:ring-emerald-500/40 focus:border-emerald-600"
                        }`}
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="unlock-phone" className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Mobilnummer
                      </label>
                      <PhoneInput
                        value={phone}
                        onChange={(v) => { setPhone(v); setErrors(p => ({ ...p, phone: undefined })) }}
                        error={errors.phone}
                      />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Datenschutz */}
                    <label className={`flex items-start gap-3 cursor-pointer rounded-xl border p-3 transition-colors ${
                      errors.datenschutz ? "border-red-500/60 bg-red-950/20" : "border-slate-700/60 bg-slate-800/40 hover:border-slate-600"
                    }`}>
                      <input
                        type="checkbox"
                        checked={datenschutz}
                        onChange={(e) => { setDatenschutz(e.target.checked); setErrors(p => ({ ...p, datenschutz: undefined })) }}
                        className="mt-0.5 w-4 h-4 accent-emerald-500 flex-shrink-0"
                      />
                      <span className="text-xs text-slate-400 leading-relaxed">
                        Ich stimme der Verarbeitung meiner Daten gemäß{" "}
                        <a href="/datenschutz" target="_blank" className="text-emerald-400 underline hover:text-emerald-300">
                          Datenschutzerklärung
                        </a>{" "}
                        zu. Keine Weitergabe an Dritte. Abmeldung jederzeit möglich.
                      </span>
                    </label>
                    {errors.datenschutz && <p className="text-red-400 text-xs -mt-2">{errors.datenschutz}</p>}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 text-base shadow-lg shadow-emerald-900/30 touch-manipulation min-h-[52px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Wird übertragen…
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5" />
                          Ergebnis jetzt freischalten
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                      <Shield className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                      SSL-verschlüsselt · Kostenlos · Kein Spam
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
