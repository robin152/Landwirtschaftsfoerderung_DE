"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface DecryptTextProps {
  text: string
  className?: string
  duration?: number
}

export const DecryptText = ({ text, className = "", duration = 2000 }: DecryptTextProps) => {
  const [displayText, setDisplayText] = useState("")
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$%&@#"

  useEffect(() => {
    let iteration = 0
    const interval = setInterval(
      () => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index]
              }
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join(""),
        )

        if (iteration >= text.length) {
          clearInterval(interval)
        }

        iteration += 1 / 3
      },
      duration / text.length / 3,
    )

    return () => clearInterval(interval)
  }, [text, duration])

  return (
    <motion.span className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {displayText}
    </motion.span>
  )
}
