"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: "primary" | "accent" | "none"
  delay?: number
}

export function GlassCard({ children, className, hover = false, glow = "none", delay = 0 }: GlassCardProps) {
  const glowClasses = {
    primary: "shadow-lg shadow-cyan-500/20",
    accent: "shadow-lg shadow-teal-500/20",
    none: "shadow-xl shadow-black/5",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      className={cn(
        "relative rounded-2xl border border-white/20 backdrop-blur-xl",
        "bg-white/80 dark:bg-slate-950/80",
        "transition-all duration-300",
        glowClasses[glow],
        hover && "cursor-pointer",
        className,
      )}
    >
      {/* Glass reflective effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none opacity-50" />
      {children}
    </motion.div>
  )
}
