"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Leaf } from "lucide-react"
import { PersonalizedCallout } from "@/components/personalized-callout"

export function RegionsSection() {
  const [activeTab, setActiveTab] = useState<"c" | "cplus" | "d">("c")

  const regions = {
    c: {
      title: "C-Fördergebiet",
      rate: "15% – 35%",
      description:
        "Strukturschwache Regionen in West- und Ostdeutschland, darunter Teile des Ruhrgebiets und NRW. KU erhalten bis zu 35% (Typ a) bzw. 30% (Typ b) Basisförderung, mit Bevölkerungsbonus bis +5 PP.",
      examples: ["Duisburg", "Gelsenkirchen", "Herne", "Bottrop", "Ostdeutschland"],
    },
    cplus: {
      title: "C+-Fördergebiet (Grenzzuschlag)",
      rate: "25% – 45%",
      description:
        "C-Fördergebiet mit Grenzzuschlag gem. Rn. 184 Regionalbeihilfeleitlinien. Die C-Basisquoten werden um +10 Prozentpunkte angehoben. Höchste Förderquoten im C-Bereich.",
      examples: ["Grenzregionen", "Ausgewählte Landkreise lt. Anlage"],
    },
    d: {
      title: "D-Fördergebiet",
      rate: "20% – 50%",
      description:
        "Übergangsgebiete mit leichter Strukturschwäche. KMU erhalten bis zu 20% (KU) bzw. 10% (MU) Basisförderung. Mit De-minimis-Aufschlag (+20 PP) bis zu 50% möglich. GU nur über Sonderprogramme.",
      examples: ["Münster", "Bielefeld", "Hamm", "Unna"],
    },
  }

  const active = regions[activeTab]

  return (
    <section id="regions" className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-purple-600 uppercase tracking-wider mb-4 block">
            Ihr Standort entscheidet
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            Förderregionen in Deutschland
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Je strukturschwächer die Region, desto höher die Förderquote. Prüfen Sie Ihren Standortvorteil.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
            {([
              { key: "c" as const, label: "C-Fördergebiet" },
              { key: "cplus" as const, label: "C+-Fördergebiet" },
              { key: "d" as const, label: "D-Fördergebiet" },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 rounded-md text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.key ? "bg-purple-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl mx-auto"
        >
          <div className="p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-purple-600" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{active.title}</h3>
                <div className="text-4xl font-bold text-purple-600">{active.rate}</div>
              </div>
            </div>

            <p className="text-slate-600 text-lg leading-relaxed mb-6">{active.description}</p>

            <div className="flex flex-wrap gap-2">
              {active.examples.map((example) => (
                <span key={example} className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
                  {example}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Klimaschutz Bonus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6 text-green-600" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Klimaschutz-Bonus: +5 Prozentpunkte</h4>
                <p className="text-slate-600 leading-relaxed">
                  Investieren Sie in nachhaltige Technologien? Energieeffiziente Maschinen, Wärmepumpen oder
                  Photovoltaik bringen automatisch 5% Extra-Förderung — bei 10 Mio. € Investition bis zu{" "}
                  <span className="font-semibold text-green-600">500.000€ zusätzlich</span>.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Personalized Location Analysis */}
        <div className="mt-12 max-w-3xl mx-auto">
          <PersonalizedCallout variant="regions" />
        </div>
      </div>
    </section>
  )
}
