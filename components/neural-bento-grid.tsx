"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"

type BentoItem = {
  id: string
  title: string
  subtitle: string
  content: React.ReactNode
  colSpan: string
  triggers: string[] // IDs that should glow when this card is hovered
}

function CardImplementation({
  item,
  isHovered,
  isRemoteActive,
  setHoveredId,
}: {
  item: BentoItem
  isHovered: boolean
  isRemoteActive: boolean
  setHoveredId: (id: string | null) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const borderColor = isRemoteActive
    ? "rgba(6, 182, 212, 0.6)" // Cyan glow when triggered remotely
    : "rgba(255, 255, 255, 0.08)"

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHoveredId(item.id)}
      onMouseLeave={() => setHoveredId(null)}
      onMouseMove={onMouseMove}
      className={`
                relative group overflow-hidden rounded-3xl border transition-all duration-500
                bg-white/40 backdrop-blur-xl shadow-lg hover:shadow-2xl
                ${item.colSpan}
            `}
      style={{ borderColor }}
      animate={{
        scale: isHovered ? 1.02 : 1,
        y: isHovered ? -4 : 0,
      }}
      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
    >
      {/* Noise texture for premium feel */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20 mix-blend-overlay pointer-events-none" />

      {/* Remote glow (sympathetic activation) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isRemoteActive ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />

      {/* Mouse spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
                        radial-gradient(
                            500px circle at ${mouseX}px ${mouseY}px,
                            rgba(6, 182, 212, 0.15),
                            transparent 80%
                        )
                    `,
        }}
      />

      {/* Content */}
      <div className="relative z-20 h-full p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <motion.div
              className={`
                                w-10 h-10 rounded-full flex items-center justify-center border-2
                                transition-all duration-500
                                ${isRemoteActive || isHovered ? "bg-cyan-500/20 border-cyan-400 text-cyan-600" : "bg-slate-100 border-slate-200 text-slate-400"}
                            `}
              animate={{
                scale: isRemoteActive ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 1, repeat: isRemoteActive ? Number.POSITIVE_INFINITY : 0 }}
            >
              <div className="w-3 h-3 rounded-full bg-current" />
            </motion.div>
          </div>

          <h3
            className={`text-lg font-semibold transition-colors duration-300 ${isRemoteActive ? "text-cyan-900" : "text-slate-800"}`}
          >
            {item.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{item.subtitle}</p>
        </div>

        <div className="relative mt-4">{item.content}</div>
      </div>

      {/* Border reveal on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 border-2 border-cyan-400/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          maskImage: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, white, transparent)`,
          WebkitMaskImage: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, white, transparent)`,
        }}
      />
    </motion.div>
  )
}

export const NeuralBentoGrid = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const items: BentoItem[] = [
    {
      id: "location",
      title: "Fördergebiet-Check",
      subtitle: "Standort-Analyse",
      colSpan: "md:col-span-2 md:row-span-2",
      triggers: ["calculator", "quote"],
      content: (
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-slate-200/50 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-5xl mb-2">🗺️</div>
            <div className="text-indigo-600 font-mono text-xs uppercase tracking-wider">Live Geo-Data</div>
            <div className="text-slate-700 font-semibold mt-2">Cottbus, Brandenburg</div>
          </div>
        </div>
      ),
    },
    {
      id: "calculator",
      title: "Investitions-Volumen",
      subtitle: "Ihr Projekt",
      colSpan: "md:col-span-1",
      triggers: ["quote", "roi"],
      content: (
        <div className="space-y-2">
          <div className="text-4xl font-bold text-slate-800">2.5M€</div>
          <div className="text-sm text-slate-500">Förderfähige Investition</div>
        </div>
      ),
    },
    {
      id: "quote",
      title: "Zuschuss (Cash)",
      subtitle: "Nicht rückzahlbar",
      colSpan: "md:col-span-1",
      triggers: ["roi"],
      content: (
        <div className="space-y-2">
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-green-600">
            45%
          </div>
          <div className="text-sm text-slate-500">Max. Förderquote</div>
        </div>
      ),
    },
    {
      id: "roi",
      title: "Ihre Förderung",
      subtitle: "Sofort auszahlbar",
      colSpan: "md:col-span-1",
      triggers: [],
      content: (
        <div className="space-y-2">
          <div className="text-3xl font-bold text-green-600">1.125M€</div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Förderfähig
          </div>
        </div>
      ),
    },
    {
      id: "status",
      title: "Eligibility Check",
      subtitle: "Live-Status",
      colSpan: "md:col-span-2",
      triggers: [],
      content: (
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
          <span className="text-sm text-green-700 font-medium">Förderfähig für KMU & Großunternehmen</span>
        </div>
      ),
    },
  ]

  const isRemoteActive = (id: string) => {
    if (!hoveredId) return false
    const activeItem = items.find((i) => i.id === hoveredId)
    return activeItem?.triggers.includes(id) || false
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto p-4">
      {items.map((item) => (
        <CardImplementation
          key={item.id}
          item={item}
          isHovered={hoveredId === item.id}
          isRemoteActive={isRemoteActive(item.id)}
          setHoveredId={setHoveredId}
        />
      ))}
    </div>
  )
}
