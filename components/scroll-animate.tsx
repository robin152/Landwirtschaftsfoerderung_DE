"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ScrollAnimateProps {
  children: ReactNode
  className?: string
  blur?: boolean
  stagger?: boolean
  delay?: number
}

export function ScrollAnimate({
  children,
  className = "",
  blur = false,
  stagger = false,
  delay = 0,
}: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("is-visible")
            }, delay)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [delay])

  const animationClass = stagger ? "stagger-children" : blur ? "scroll-animate-blur" : "scroll-animate"

  return (
    <div ref={ref} className={`${animationClass} ${className}`}>
      {children}
    </div>
  )
}
