"use client"

import { useEffect, useState, useRef } from "react"

// Lottie animations sourced from LottieFiles (public domain / free)
// We load them dynamically to avoid SSR issues
const LOTTIE_URLS = {
  tractor: "https://assets10.lottiefiles.com/packages/lf20_ofa3xwo7.json",
  wheat: "https://assets9.lottiefiles.com/packages/lf20_q5pk6p1k.json",
  money: "https://assets3.lottiefiles.com/packages/lf20_06a6pf9i.json",
  plant: "https://assets4.lottiefiles.com/packages/lf20_jbbqlsgn.json",
  sun: "https://assets5.lottiefiles.com/packages/lf20_UBKKDu.json",
  success: "https://assets4.lottiefiles.com/packages/lf20_jbrw3hcz.json",
  coins: "https://assets2.lottiefiles.com/packages/lf20_cqvligyx.json",
  farm: "https://assets9.lottiefiles.com/packages/lf20_yr5cvx8n.json",
} as const

export type LottieKey = keyof typeof LOTTIE_URLS

interface AgriLottieProps {
  animation: LottieKey
  className?: string
  loop?: boolean
  autoplay?: boolean
  style?: React.CSSProperties
}

export function AgriLottie({ animation, className = "", loop = true, autoplay = true, style }: AgriLottieProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    let lottieInstance: { destroy?: () => void } | null = null
    let cancelled = false

    async function init() {
      try {
        const [lottieModule, animationData] = await Promise.all([
          import("lottie-react").then((m) => m.default || m),
          fetch(LOTTIE_URLS[animation]).then((r) => {
            if (!r.ok) throw new Error("fetch failed")
            return r.json()
          }),
        ])

        if (cancelled || !containerRef.current) return

        // lottie-react exports a React component; we need lottie-web for imperative API
        // Instead, just signal we should render the React component
        setLoaded(true)
        // Store data for render
        ;(containerRef.current as HTMLDivElement & { _lottieData?: unknown })._lottieData = animationData
      } catch {
        if (!cancelled) setError(true)
      }
    }

    init()
    return () => {
      cancelled = true
      if (lottieInstance?.destroy) lottieInstance.destroy()
    }
  }, [animation])

  if (error) return null

  return (
    <div ref={containerRef} className={className} style={style} aria-hidden="true">
      {loaded && <LottieInner containerRef={containerRef} loop={loop} autoplay={autoplay} />}
    </div>
  )
}

function LottieInner({
  containerRef,
  loop,
  autoplay,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
  loop: boolean
  autoplay: boolean
}) {
  const [Lottie, setLottie] = useState<React.ComponentType<{
    animationData: unknown
    loop: boolean
    autoplay: boolean
    style?: React.CSSProperties
  }> | null>(null)
  const [data, setData] = useState<unknown>(null)

  useEffect(() => {
    import("lottie-react").then((m) => {
      const Comp = m.default || (m as Record<string, unknown>).default
      setLottie(() => Comp as typeof Lottie)
    })
    if (containerRef.current) {
      setData((containerRef.current as HTMLDivElement & { _lottieData?: unknown })._lottieData)
    }
  }, [containerRef])

  if (!Lottie || !data) return null

  return (
    <Lottie
      animationData={data}
      loop={loop}
      autoplay={autoplay}
      style={{ width: "100%", height: "100%" }}
    />
  )
}
