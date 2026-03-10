"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, AlertTriangle, MessageCircle } from "lucide-react"
import { PhoneInput } from "@/components/phone-input"
import { Button } from "@/components/ui/button"
import { useCompany } from "@/contexts/company-context"
import { collectTrackingData } from "@/lib/tracking-utils"

const WHATSAPP_NUMBER = "41763616062"
const WHATSAPP_MESSAGE = encodeURIComponent("Guten Tag, wir müssen investieren und hätten dafür gerne Fördermittel! :-) ")
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

interface ContactFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const { company, sharedFormData, updateSharedFormData } = useCompany()
  
  const [formData, setFormData] = useState({
    name: sharedFormData.contactName || "",
    email: sharedFormData.email || "",
    phone: sharedFormData.phone || "",
    company: company?.name || "",
    message: "",
  })
  
  // Pre-fill from shared context when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || sharedFormData.contactName || "",
        email: prev.email || sharedFormData.email || "",
        phone: prev.phone || sharedFormData.phone || "",
        company: prev.company || company?.name || "",
      }))
    }
  }, [isOpen, sharedFormData, company])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    
    // Sync contact data to shared context
    if (name === "name") updateSharedFormData({ contactName: value })
    if (name === "email") updateSharedFormData({ email: value })
    if (name === "phone") updateSharedFormData({ phone: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    // Collect tracking data
    const trackingData = collectTrackingData()

    // Generate a single, stable deduplication ID for this submission.
    // This guarantees n8n and GTM/Meta receive the EXACT same string.
    const internalEventId = `fz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: formData.message,
          source: "contact-form",
          timestamp: new Date().toISOString(),
          fbclid: trackingData.fbclid,
          fbp: trackingData.fbp,
          fbc: trackingData.fbc,
          utm_source: trackingData.utm_source,
          utm_medium: trackingData.utm_medium,
          utm_campaign: trackingData.utm_campaign,
          gclid: trackingData.gclid,
          browser_id: trackingData.browser_id,
          session_id: trackingData.session_id,
          // Stable deduplication ID – identical in webhook payload and dataLayer
          gtm_event_id: internalEventId,
          landing_page: trackingData.landing_page,
          referrer: trackingData.referrer,
          user_agent: trackingData.user_agent,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setSubmitStatus("error")
        setIsSubmitting(false)
        return
      }
      
      // Push lead_success event to dataLayer for GTM/Meta tracking (only on success).
      // TWO-STEP push: variables first, then the event trigger.
      // This guarantees GTM DLV - email / firstName / phone are populated BEFORE the trigger fires.
      if (typeof window !== 'undefined') {
        const firstName = formData.name.split(" ")[0]
        const lastName = formData.name.split(" ").slice(1).join(" ") || undefined
        window.dataLayer = window.dataLayer || []

        // Step 1: set all variables on root so GTM DLV resolves them
        window.dataLayer.push({
          email: formData.email,
          phone: formData.phone,
          firstName,
          lastName,
          event_id: internalEventId,
          user_data: {
            email: formData.email,
            phone: formData.phone,
            firstName,
            lastName,
          },
        })

        // Step 2: fire the trigger event
        window.dataLayer.push({
          event: 'lead_success',
        })
      }
      
      setSubmitStatus("success")
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      })
      setTimeout(() => {
        onClose()
        setSubmitStatus("idle")
      }, 2000)
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Anspruch prüfen</h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
            aria-label="Modal schließen"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ihr Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
              E-Mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="ihre.email@beispiel.de"
            />
          </div>

          <div className="relative">
            <label htmlFor="phone" className="block text-sm font-medium text-slate-900 mb-2">
              Die beste Mobilfunknummer
            </label>
            {/* EXTREM WICHTIG Badge */}
            <span className="absolute -top-1 right-0 inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
              <AlertTriangle className="w-3 h-3" />
              EXTREM WICHTIG
            </span>
            <PhoneInput
              value={formData.phone}
              onChange={(formatted, fullNumber) => {
                setFormData(prev => ({ ...prev, phone: fullNumber }))
                updateSharedFormData({ phone: fullNumber })
              }}
              showImportantBadge={false}
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-slate-900 mb-2">
              Unternehmen
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ihr Unternehmen"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-900 mb-2">
              Nachricht
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Ihre Nachricht..."
            />
          </div>

          {submitStatus === "success" && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              Vielen Dank! Wir kontaktieren Sie bald.
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-3">
              <p className="text-sm text-red-700 font-medium">
                Ihre Anfrage konnte leider nicht gesendet werden.
              </p>
              <p className="text-xs text-red-600 leading-relaxed">
                Kein Problem &ndash; nutzen Sie den direkten Draht zu uns per WhatsApp!
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm rounded-lg shadow transition-all duration-200 hover:shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Per WhatsApp kontaktieren
              </a>
              <p className="text-[10px] text-slate-400 text-center">+41 76 361 60 62</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-purple-600 text-white hover:bg-purple-700">
              {isSubmitting ? "Wird versendet..." : "Absenden"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
