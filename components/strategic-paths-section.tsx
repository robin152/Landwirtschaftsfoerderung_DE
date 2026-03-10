"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Users, TrendingUp, ArrowRight, CheckCircle2, Cog, ShieldCheck } from "lucide-react"
import { PersonalizedCallout } from "@/components/personalized-callout"

export function StrategicPathsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activePath, setActivePath] = useState<"jobs" | "productivity" | null>(null)

  const paths = [
    {
      id: "jobs" as const,
      icon: Users,
      title: "Pfad der Arbeitsplatzschaffung",
      subtitle: "Klassischer Expansionsweg",
      description: "Für Unternehmen, die physisch wachsen und ihre Belegschaft erweitern möchten.",
      color: "purple",
      requirements: [
        "Nettozuwachs an Dauerarbeitsplätzen (+10%)",
        "Physische Kapazitätserweiterung",
        "Langfristige Standortbindung",
        "Nachweis der Arbeitsplatzschaffung nach 3 Jahren",
      ],
      idealFor: ["Produktionserweiterung", "Neue Standorte", "Kapazitätsaufbau"],
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "productivity" as const,
      icon: TrendingUp,
      title: "Pfad der Arbeitsproduktivität",
      subtitle: "Neuer Modernisierungsweg",
      description: "Für Unternehmen, die bestehende Prozesse optimieren und Arbeitsplätze sichern möchten.",
      color: "violet",
      requirements: [
        "Keine zusätzlichen Arbeitsplätze erforderlich",
        "Signifikante Produktivitätssteigerung",
        "Langfristige Arbeitsplatzsicherung",
        "Nachweis der Produktivitätsverbesserung",
      ],
      idealFor: ["Automatisierung", "Digitalisierung", "Prozessoptimierung"],
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-50 to-purple-50",
      borderColor: "border-violet-200",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
  ]

  return (
    <section ref={ref} id="strategic-paths" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm font-medium text-slate-600 mb-6"
          >
            <Cog className="w-4 h-4" />
            Strategische Entscheidung
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Mögliche Optionen{" "}
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              der Förderung
            </span>
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed">
            Wählen Sie zwischen zwei strategischen Zugangspfaden – je nach Investitionsziel und Unternehmenssituation. Nicht jeder Weg passt zu jedem Unternehmen.
          </p>
        </motion.div>

        {/* Path Cards */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {paths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
              onMouseEnter={() => setActivePath(path.id)}
              onMouseLeave={() => setActivePath(null)}
              className={`relative group cursor-pointer`}
            >
              {/* Card */}
              <div
                className={`relative bg-white rounded-3xl border-2 ${path.borderColor} p-8 lg:p-10 transition-all duration-500 ${
                  activePath === path.id ? "shadow-2xl scale-[1.02]" : "shadow-lg hover:shadow-xl"
                }`}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${path.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      animate={activePath === path.id ? { rotate: [0, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 ${path.iconBg} rounded-2xl flex items-center justify-center`}
                    >
                      <path.icon className={`w-8 h-8 ${path.iconColor}`} />
                    </motion.div>

                    {path.id === "productivity" && (
                      <span className="px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                        Neu 2026
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">{path.title}</h3>
                  <p className={`text-sm font-semibold ${path.iconColor} mb-4`}>{path.subtitle}</p>
                  <p className="text-slate-600 mb-8">{path.description}</p>

                  {/* Requirements */}
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Anforderungen</h4>
                    <ul className="space-y-3">
                      {path.requirements.map((req, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.5 + index * 0.2 + i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className={`w-5 h-5 ${path.iconColor} flex-shrink-0 mt-0.5`} />
                          <span className="text-slate-700">{req}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Ideal for */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Ideal für</h4>
                    <div className="flex flex-wrap gap-2">
                      {path.idealFor.map((item, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1.5 ${path.iconBg} ${path.iconColor} text-sm font-medium rounded-lg`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <motion.div
                    animate={activePath === path.id ? { x: 5 } : { x: 0 }}
                    className="absolute bottom-8 right-8 lg:bottom-10 lg:right-10"
                  >
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${path.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Personalized Recommendation */}
        <div className="mt-12 max-w-3xl mx-auto">
          <PersonalizedCallout variant="strategic-paths" />
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-slate-100 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <p className="text-slate-700">
              <span className="font-semibold">Unsicher, welcher Pfad?</span> Wir analysieren Ihr Vorhaben kostenlos und
              empfehlen die optimale Strategie.
            </p>
            <button
              onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Jetzt prüfen
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
