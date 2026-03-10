"use client"

import type React from "react"
import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { motion } from "framer-motion"
import type * as THREE from "three"

const LidarStructure = () => {
  const pointsRef = useRef<THREE.Points>(null)

  const particlesCount = 8000
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      const t = (i / particlesCount) * Math.PI * 20
      const x = Math.cos(t) * (3 + Math.cos(t * 3)) * 1.5
      const y = Math.sin(t) * (3 + Math.cos(t * 3)) * 1.5
      const z = Math.sin(t * 3) * 2

      pos[i * 3] = x + (Math.random() - 0.5) * 0.2
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 0.2
      pos[i * 3 + 2] = z + (Math.random() - 0.5) * 0.2
    }
    return pos
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += 0.001
    pointsRef.current.rotation.z += 0.0005
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particlesCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#555555" sizeAttenuation={true} transparent={true} opacity={0.8} />
    </points>
  )
}

const TechBadge = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[10px] font-mono tracking-widest text-orange-500 uppercase backdrop-blur-md">
    <div className="h-1.5 w-1.5 bg-orange-500 animate-pulse" />
    {children}
  </div>
)

const DataRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between border-b border-white/10 py-3 font-mono text-xs text-zinc-400">
    <span>{label}</span>
    <span className="text-zinc-100">{value}</span>
  </div>
)

export function IndustrialHero() {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative h-screen w-full bg-[#050505] overflow-hidden">
      {/* LAYER A: The 3D Lidar Scene */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <fog attach="fog" args={["#050505", 5, 15]} />
          <ambientLight intensity={0.5} />
          <LidarStructure />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* LAYER B: Vignette & Scanlines */}
      <div className="absolute inset-0 z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/50 pointer-events-none" />

      {/* LAYER C: Grid Overlay (Crosshairs) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="h-full w-full border-x border-white/5 mx-auto max-w-7xl relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-white/20" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-white/20" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-white/20" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/20" />
        </div>
      </div>

      {/* LAYER D: Typography & Content */}
      <div className="relative z-30 flex h-full items-center justify-center px-6">
        <div className="grid max-w-7xl w-full grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          {/* LEFT: Heavy Headline */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <TechBadge>System: Regional_Förderung_v2.6</TechBadge>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-serif text-white leading-[0.9] tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Staatliches <br />
              <span className="italic text-zinc-400">Kapital</span> für <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                Infrastruktur.
              </span>
            </motion.h1>

            <motion.p
              className="max-w-xl text-lg text-zinc-400 font-light leading-relaxed border-l border-orange-500/50 pl-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Maximieren Sie Ihre Investitionsquote durch gezielte Standortwahl in C-, C+- und D-Fördergebieten. Präzision
              statt Spekulation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center gap-6"
            >
              <button
                onClick={scrollToCalculator}
                className="group relative bg-white text-black px-8 py-4 font-mono text-sm uppercase tracking-wider hover:bg-orange-500 transition-colors duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Analyse starten
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute top-2 left-2 w-full h-full border border-white/20 -z-10 group-hover:top-1 group-hover:left-1 transition-all" />
              </button>
            </motion.div>
          </div>

          {/* RIGHT: Technical Data Column */}
          <div className="lg:col-span-4 lg:mb-4">
            <motion.div
              className="bg-zinc-900/80 backdrop-blur-sm border border-white/10 p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-serif text-xl text-white">Live Metriken</span>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              </div>

              <div className="space-y-1">
                <DataRow label="FÖRDERQUOTE" value="MAX 65%" />
                <DataRow label="GEBIETSKULISSE" value="DE_OST/NRW" />
                <DataRow label="FOKUS" value="PRODUKTION" />
                <DataRow label="STATUS" value="OFFEN" />
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
                  <span>Latenz: 12ms</span>
                  <span>Sync: Active</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
