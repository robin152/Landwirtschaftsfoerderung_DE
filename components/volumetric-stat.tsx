"use client"

import { motion } from "framer-motion"
import { DecryptText } from "./decrypt-text"

interface VolumetricStatProps {
  value: string
  label: string
  suffix?: string
  delay?: number
}

export const VolumetricStat = ({ value, label, suffix = "", delay = 0 }: VolumetricStatProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      {/* 3D Shadow layers for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-500">
        <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600 mb-2">
          <DecryptText text={value} />
          <span className="text-cyan-600">{suffix}</span>
        </div>
        <div className="text-sm text-slate-600 font-medium">{label}</div>

        {/* Glowing bottom border */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.3 }}
        />
      </div>
    </motion.div>
  )
}
