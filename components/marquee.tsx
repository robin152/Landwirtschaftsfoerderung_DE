"use client"

import { useEffect, useState } from "react"

export function Marquee() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <a
      href="#benefits"
      className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-teal-50 via-blue-50 to-teal-50 backdrop-blur-md border-b border-teal-200/40 transition-all duration-300 cursor-pointer hover:from-teal-50/95 hover:via-blue-50/95 hover:to-teal-50/95"
    >
      <div className="relative overflow-hidden py-3 sm:py-4">
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-teal-50 via-teal-50/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-teal-50 via-teal-50/80 to-transparent z-10 pointer-events-none" />

        <div className="marquee-container">
          <div className="marquee-content">
            <span className="inline-flex items-center gap-2 sm:gap-4 mx-4 sm:mx-8 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold tracking-wide text-slate-900">
                <span className="text-teal-600 font-bold">Bis zu 200.000€ Gründungszuschuss</span>
              </span>
              <span className="text-xs sm:text-sm text-slate-400">•</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                Kostenlose <span className="text-teal-600 font-bold">Fachberatung</span>
              </span>
              <span className="text-xs sm:text-sm text-slate-400">•</span>
              <span className="text-xs sm:text-sm font-medium text-teal-600">Schnelle Genehmigung</span>
            </span>
            <span className="inline-flex items-center gap-2 sm:gap-4 mx-4 sm:mx-8 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold tracking-wide text-slate-900">
                <span className="text-teal-600 font-bold">Bis zu 200.000€ Gründungszuschuss</span>
              </span>
              <span className="text-xs sm:text-sm text-slate-400">•</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                Kostenlose <span className="text-teal-600 font-bold">Fachberatung</span>
              </span>
              <span className="text-xs sm:text-sm text-slate-400">•</span>
              <span className="text-xs sm:text-sm font-medium text-teal-600">Schnelle Genehmigung</span>
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}
