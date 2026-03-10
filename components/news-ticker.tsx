"use client"

import { motion } from "framer-motion"

const tickerItems = [
  "AFP 2026: Bis zu 50 % Zuschuss für Tierwohl & Klimaschutz – jetzt berechnen!",
  "Neue Bundesländer: Bis 5 Mio. € Investitionsvolumen förderfähig!",
  "Junglandwirt-Bonus: +10 % extra wenn du unter 40 bist – macht bis zu 50 % Gesamtförderung!",
  "NRW Kälbermatten-Aufschlag: Befristeter 10 % Extra-Bonus noch verfügbar!",
  "Baden-Württemberg: 2 Mio. € Max-Invest + Schweine ab Sept. 2026 wieder förderfähig!",
  "Gülle mit Abdeckung: Bis 40 % Zuschuss + 2 Monate Lagerkapazität Pflicht!",
  "Tierwohl-Premium: Basis 20 % + 20 % Premium = 40 % für Stallumbau mit mehr Platz & Licht!",
]

export function NewsTicker() {
  // Duplicate items for seamless loop
  const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems]

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* NEW 2026 Badge - Fixed left */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 flex items-center gap-2 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider whitespace-nowrap">
            Neu 2026
          </span>
        </div>
      </div>

      {/* Left blur gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />
      
      {/* Right blur gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />

      {/* Ticker content */}
      <div className="py-2.5 sm:py-3 pl-24 sm:pl-32">
        <motion.div
          className="flex items-center gap-8 sm:gap-12"
          animate={{
            x: [0, -2400],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-8 sm:gap-12 whitespace-nowrap">
              <span className="text-xs sm:text-sm text-slate-300 font-medium">
                <span className="text-amber-400 font-bold">+++</span>
                {" "}{item}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
