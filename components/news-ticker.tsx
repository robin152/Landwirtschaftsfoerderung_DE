"use client"

import { motion } from "framer-motion"

const tickerItems = [
  "Förderung für die Landwirtschaft 2026: Bis zu 50 % Zuschuss für Tierwohl & Klimaschutz – jetzt berechnen!",
  "Neue Bundesländer: Bis 5 Mio. € Investitionsvolumen förderfähig!",
  "Junglandwirt-Bonus: +10 % extra wenn du unter 40 bist – macht bis zu 50 % Gesamtförderung!",
  "NRW Kälbermatten-Aufschlag: Befristeter 10 % Extra-Bonus noch verfügbar!",
  "Baden-Württemberg: 2 Mio. € Max-Invest + Schweine ab Sept. 2026 wieder förderfähig!",
  "Gülle mit Abdeckung: Bis 40 % Zuschuss + 2 Monate Lagerkapazität Pflicht!",
  "Tierwohl-Premium: Basis 20 % + 20 % Premium = 40 % für Stallumbau mit mehr Platz & Licht!",
]

// Inline wheat ear SVG separator — goldener Weizen-Trenner
function WheatSep() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="inline-block flex-shrink-0"
    >
      <path d="M12 22 Q12 14 12 6" stroke="#d4a017" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 16 Q8 13 7 9" stroke="#d4a017" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M12 16 Q16 13 17 9" stroke="#d4a017" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <ellipse cx="7.5" cy="7.5" rx="2" ry="3" fill="#d4a017" opacity="0.85" transform="rotate(-15 7.5 7.5)" />
      <ellipse cx="16.5" cy="7.5" rx="2" ry="3" fill="#d4a017" opacity="0.85" transform="rotate(15 16.5 7.5)" />
      <ellipse cx="12" cy="4.5" rx="1.8" ry="3" fill="#d4a017" opacity="0.9" />
    </svg>
  )
}

export function NewsTicker() {
  const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems]

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] overflow-hidden"
      style={{ background: "#1a2e0a" }}
    >
      {/* NEU 2026 Badge */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center">
        <div
          className="px-4 py-2 flex items-center gap-2 shadow-lg"
          style={{ background: "linear-gradient(to right, #b8860b, #d4a017)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider whitespace-nowrap">
            Neu 2026
          </span>
        </div>
      </div>

      {/* Left blur */}
      <div
        className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #1a2e0a, #1a2e0a88, transparent)" }}
      />
      {/* Right blur */}
      <div
        className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #1a2e0a, #1a2e0a88, transparent)" }}
      />

      {/* Ticker content */}
      <div className="py-2.5 sm:py-3 pl-24 sm:pl-32">
        <motion.div
          className="flex items-center gap-8 sm:gap-12"
          animate={{ x: [0, -2400] }}
          transition={{
            x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" },
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 whitespace-nowrap">
              <WheatSep />
              <span className="text-xs sm:text-sm font-medium" style={{ color: "#d4e8c8" }}>
                {item}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

