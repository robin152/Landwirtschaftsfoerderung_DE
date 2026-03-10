"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface MagneticButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export const MagneticButton = ({ children, onClick, className = "" }: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  // Parallax effect for text - moves slower than button
  const textX = useTransform(xSpring, (latest) => latest * 0.5)
  const textY = useTransform(ySpring, (latest) => latest * 0.5)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e

    if (!ref.current) return

    const { height, width, left, top } = ref.current.getBoundingClientRect()

    // Calculate distance from center
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)

    // Set values (button follows mouse)
    x.set(middleX)
    y.set(middleY)
  }

  const handleMouseLeave = () => {
    // Reset to 0 when mouse leaves (snaps back)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={`
        relative group flex items-center justify-center px-8 py-4 
        rounded-full cursor-pointer overflow-hidden
        bg-gradient-to-r from-cyan-600 to-blue-600
        shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_20px_40px_-8px_rgba(8,145,178,0.3)]
        transition-shadow duration-500
        hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset,0_30px_60px_-12px_rgba(8,145,178,0.5)]
        ${className}
      `}
    >
      {/* LAYER 1: Liquid Light Spotlight */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-blue-400/30 to-purple-400/30 blur-xl translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
      </span>

      {/* LAYER 2: Noise Texture for premium feel */}
      <span className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

      {/* LAYER 3: Border Glow */}
      <span className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/30 transition-all duration-300 pointer-events-none" />

      {/* LAYER 4: Content with Parallax */}
      <motion.span
        style={{ x: textX, y: textY }}
        className="relative z-10 flex items-center gap-2 text-base font-semibold tracking-wide text-white transition-colors duration-200"
      >
        {children}
      </motion.span>

      {/* LAYER 5: Top Reflection/Glare */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover:opacity-60 blur-md transition-opacity duration-500 rounded-t-full pointer-events-none" />
    </motion.button>
  )
}
