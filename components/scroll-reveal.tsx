"use client"

import { useRef, ReactNode } from "react"
import { motion, useInView, useScroll, useTransform, Variants } from "framer-motion"

type Variant =
  | "fade-up"
  | "fade-down"
  | "slide-left"
  | "slide-right"
  | "scale-up"
  | "scale-in"
  | "flip-up"
  | "stagger"

interface ScrollRevealProps {
  children: ReactNode
  variant?: Variant
  delay?: number
  duration?: number
  amount?: number
  className?: string
  once?: boolean
}

const variants: Record<Variant, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -48 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0 },
  },
  "scale-up": {
    hidden: { opacity: 0, scale: 0.82 },
    visible: { opacity: 1, scale: 1 },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { opacity: 1, scale: 1 },
  },
  "flip-up": {
    hidden: { opacity: 0, rotateX: 24, y: 32 },
    visible: { opacity: 1, rotateX: 0, y: 0 },
  },
  "stagger": {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
}

export function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.65,
  amount = 0.15,
  className,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: variant === "flip-up" ? 1000 : undefined }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger container — children animate in sequence
interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  className?: string
  amount?: number
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
  amount = 0.1,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.05,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Single stagger item
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Parallax wrapper — element moves at different speed than scroll
export function ParallaxSection({
  children,
  speed = 0.3,
  className,
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [speed * -80, speed * 80])

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}

// Horizontal marquee-style reveal — splits content left & right
export function SplitReveal({
  children,
  className,
  amount = 0.2,
}: {
  children: [ReactNode, ReactNode]
  className?: string
  amount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount })

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, x: -64 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -64 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children[0]}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 64 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 64 }}
        transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        {children[1]}
      </motion.div>
    </div>
  )
}

// Count-up number — animates number when scrolled into view
