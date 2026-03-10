"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Calendar, Shield, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

/* ------------------------------------------------------------------ */
/*  TidyCal Embed Component – robust gegen React re-renders           */
/* ------------------------------------------------------------------ */
function TidyCalEmbed({ path }: { path: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  const initEmbed = useCallback(() => {
    if (!containerRef.current) return

    // Clear any previous embed content so TidyCal can re-init
    const existingIframe = containerRef.current.querySelector("iframe")
    if (existingIframe) return // already initialized

    // TidyCal's embed.js scans for .tidycal-embed elements on load.
    // If the script is already loaded, we need to manually trigger re-scan.
    // The simplest robust approach: inject the script directly into the container.
    if (scriptLoadedRef.current) {
      // Remove old script tag if any
      const oldScript = containerRef.current.querySelector("script")
      if (oldScript) oldScript.remove()

      // Re-add to trigger re-execution
      const script = document.createElement("script")
      script.src = "https://asset-tidycal.b-cdn.net/js/embed.js"
      script.async = true
      containerRef.current.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    // Load the TidyCal script once
    if (!scriptLoadedRef.current) {
      const script = document.createElement("script")
      script.src = "https://asset-tidycal.b-cdn.net/js/embed.js"
      script.async = true
      script.onload = () => {
        scriptLoadedRef.current = true
      }
      containerRef.current.appendChild(script)
    } else {
      // Script already loaded from a previous mount – re-init
      initEmbed()
    }

    return () => {
      // Cleanup: remove iframe on unmount so next mount starts fresh
      if (containerRef.current) {
        const iframe = containerRef.current.querySelector("iframe")
        if (iframe) iframe.remove()
      }
    }
  }, [initEmbed])

  return (
    <div
      ref={containerRef}
      className="tidycal-embed rounded-xl overflow-hidden border border-slate-200 min-h-[400px]"
      data-path={path}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Confetti – only runs client-side, no window access during render   */
/* ------------------------------------------------------------------ */
function Confetti() {
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setDimensions({ w: window.innerWidth, h: window.innerHeight })
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible || !dimensions) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: -20,
            x: Math.random() * dimensions.w,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: dimensions.h + 20,
            rotate: Math.random() * 360,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: ["#14b8a6", "#10b981", "#0ea5e9", "#f59e0b", "#8b5cf6"][
              Math.floor(Math.random() * 5)
            ],
          }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Confetti effect – safely deferred to client */}
      <Confetti />

      <div className="container mx-auto px-4 py-10 md:py-16 max-w-2xl">
        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-green-700 to-emerald-600 px-6 py-8 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-10 h-10" aria-hidden="true" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-balance">Anfrage erfolgreich gesendet!</h1>
            <p className="text-green-100 text-sm">Deine Förderfähigkeit wird jetzt geprüft</p>
          </div>

          {/* Content */}
          <div className="p-5 md:p-8">
            {/* Expert Card */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-6">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-green-500 flex-shrink-0">
                <Image
                  src="/patrick-starkmann.webp"
                  alt="Patrick Starkmann"
                  fill
                  className="object-cover object-top"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Patrick Starkmann</p>
                <p className="text-sm text-slate-500">Spezialist für Subventionen in der Agrarwirtschaft &amp; Sachverständiger (DGUSV)</p>
                <p className="text-xs text-emerald-600 mt-0.5 font-medium">Prüft deine Anfrage persönlich</p>
              </div>
            </div>

            {/* Next Steps — micro-commitment */}
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              Was passiert als nächstes?
            </h2>

            <div className="space-y-3 mb-7">
              {[
                {
                  n: "1",
                  title: "Prüfung deiner Angaben",
                  desc: "Patrick analysiert Bundesland, Vorhaben und Investitionssumme auf maximale Förderfähigkeit.",
                },
                {
                  n: "2",
                  title: "Persönliche Rückmeldung",
                  desc: "Du erhältst deine individuelle Fördereinschätzung per E-Mail — meist am gleichen Werktag.",
                },
                {
                  n: "3",
                  title: "Beratungstermin (kostenlos)",
                  desc: "Bei positivem Befund besprechen wir die Antragsstrategie — kein Risiko, keine Verpflichtung.",
                },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emerald-700">{n}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* TidyCal Calendar Embed */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <p className="font-bold text-slate-900 text-sm">Direkt Termin buchen</p>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Wähle einen Termin für dein kostenloses Erstgespräch mit Patrick.
              </p>
              <TidyCalEmbed path="team/eskalator-ag/regional-investition" />
            </div>

            {/* Trust */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Deine Daten sind sicher und werden nicht weitergegeben</span>
            </div>
          </div>
        </motion.div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  )
}
