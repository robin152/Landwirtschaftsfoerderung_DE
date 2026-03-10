"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface TechnicalCardProps {
  title: string
  value: string | number
  label: string
  unit?: string
  status?: string
  children?: ReactNode
  delay?: number
}

export const TechnicalCard = ({
  title,
  value,
  label,
  unit = "EUR",
  status = "SYS_READY",
  children,
  delay = 0,
}: TechnicalCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative border border-slate-700/30 bg-slate-50/50 backdrop-blur-sm p-6 group overflow-hidden hover:border-orange-500/50 transition-colors duration-300"
    >
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-orange-500/70" />
      <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-orange-500/70" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-orange-500/70" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-orange-500/70" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="font-mono text-xs text-slate-600 flex justify-between uppercase tracking-widest mb-4">
          <span>{label}</span>
          <span className="text-orange-500 font-semibold">{status}</span>
        </div>

        <div className="flex items-end gap-2 mt-2">
          <span className="text-5xl font-serif text-slate-900 leading-none">{value}</span>
          <span className="mb-2 font-mono text-sm text-slate-500">UNIT/{unit}</span>
        </div>

        <div className="mt-4 h-px w-full bg-slate-300 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-orange-500 w-1/2"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>

        <h3 className="mt-4 font-serif text-xl text-slate-800">{title}</h3>

        {children && <div className="mt-4">{children}</div>}
      </div>

      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 2,
        }}
      />
    </motion.div>
  )
}
