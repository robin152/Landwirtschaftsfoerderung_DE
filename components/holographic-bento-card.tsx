"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"

interface HolographicBentoCardProps {
  children: React.ReactNode
  title: string
  subtitle: string
  badge?: string
  className?: string
}

export const HolographicBentoCard = ({
  children,
  title,
  subtitle,
  badge = "Regional-Förderung",
  className = "",
}: HolographicBentoCardProps) => {
  const ref = useRef<HTMLDivElement>(null)

  // Mausposition relativ zur Karte
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Physikalisches "Nachziehen" der Maus (Spring Physics)
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 })

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    x.set(clientX - left)
    y.set(clientY - top)
  }

  // Dynamischer Spotlight-Gradient, der dem Cursor folgt
  const maskImage = useMotionTemplate`radial-gradient(240px circle at ${mouseX}px ${mouseY}px, white, transparent)`
  const style = { maskImage, WebkitMaskImage: maskImage }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl group transition-all duration-500 hover:scale-[1.02] hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 ${className}`}
    >
      {/* 1. Layer: Der Grid-Hintergrund (subtil) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />

      {/* 2. Layer: Der Glowing Spot (nur sichtbar bei Hover) */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(6, 182, 212, 0.12),
              transparent 80%
            )
          `,
        }}
      />

      {/* 3. Layer: Content */}
      <div className="relative h-full p-8 z-10 flex flex-col justify-between">
        <div>
          <div className="mb-3 w-fit rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-600 border border-cyan-500/20 shadow-sm">
            {badge}
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600 leading-relaxed text-sm">{subtitle}</p>
        </div>
        {/* Content Area */}
        <div className="mt-6">{children}</div>
      </div>

      {/* 4. Layer: Border Reveal via Masking (Der "Apple"-Effekt) */}
      <motion.div
        className="pointer-events-none absolute inset-0 border-2 border-cyan-500/60 rounded-3xl bg-transparent"
        style={style}
      />
    </div>
  )
}
