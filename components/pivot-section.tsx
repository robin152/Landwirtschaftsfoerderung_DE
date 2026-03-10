"use client"

import { motion } from "framer-motion"
import { Building2, Cpu, TrendingUp, Zap } from "lucide-react"

export function PivotSection() {
  const benefits = [
    {
      step: "01",
      icon: Building2,
      title: "Maschinen & Anlagen",
      description: "Produktionsmaschinen, CNC-Fräsen, Robotikanlagen und komplette Fertigungslinien.",
    },
    {
      step: "02",
      icon: Zap,
      title: "Gebäude & Hallen",
      description: "Produktionshallen, Lagerflächen, Werkstätten und Verwaltungsgebäude.",
    },
    {
      step: "03",
      icon: Cpu,
      title: "Digitalisierung",
      description: "ERP-Systeme, IoT-Infrastruktur, Automatisierung und Cloud-Lösungen.",
    },
    {
      step: "04",
      icon: TrendingUp,
      title: "Erweiterungen",
      description: "Kapazitätserweiterung, neue Geschäftsfelder und Standortausbau.",
    },
  ]

  return (
    <section id="pivot" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header with asymmetric layout */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <span className="text-sm font-mono text-teal-600 uppercase tracking-wider mb-4 block">
              Was wird gefördert
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
              Ihre Investition. <span className="text-teal-600">Staatlich gefördert.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 flex items-end"
          >
            <p className="text-lg text-slate-600 leading-relaxed">
              Die Regional-Förderung umfasst materielle Investitionen, die Ihren Betrieb erweitern oder modernisieren. Von der
              einzelnen Maschine bis zur kompletten Halle.
            </p>
          </motion.div>
        </div>

        {/* Cards Grid with step numbers */}
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white rounded-xl border border-slate-200 p-8 hover:shadow-md transition-all duration-300 group"
            >
              {/* Large step number in background */}
              <span className="absolute top-4 right-6 text-8xl font-bold text-slate-100 select-none group-hover:text-slate-200 transition-colors">
                {benefit.step}
              </span>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center mb-5 group-hover:bg-teal-100 transition-colors">
                  <benefit.icon className="w-6 h-6 text-teal-600" strokeWidth={1.5} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
