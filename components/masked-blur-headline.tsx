"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface MaskedBlurHeadlineProps {
  children: ReactNode
  className?: string
}

export function MaskedBlurHeadline({ children, className = "" }: MaskedBlurHeadlineProps) {
  return (
    <motion.h1
      initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.33, 1, 0.68, 1],
      }}
      className={className}
    >
      {children}
    </motion.h1>
  )
}
