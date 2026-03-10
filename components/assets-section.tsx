"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown, AlertTriangle } from "lucide-react"
import { TractorIcon, WheatIcon, BarnIcon, MoneyBagIcon, SunLeafIcon } from "@/components/agri-icons"

const CATEGORIES = [
  {
    id: "tierwohl",
    label: "Besonders tiergerechte Haltung",
    sublabel: "Anlage 1 – Premium",
    badge: "35–40 %",
    badgeClass: "bg-emerald-600 text-white",
    borderClass: "border-emerald-500",
    bgClass: "bg-emerald-50",
    accentClass: "text-emerald-700",
    iconColor: "text-emerald-600",
    IconComp: BarnIcon,
    intro: "Stallumbauten und Neubauten mit deutlich höheren Standards als gesetzlich vorgeschrieben — der häufigste Weg zum Premium-Fördersatz.",
    items: [
      "Umrüstung / Neubau von Ställen mit messbar höheren Standards",
      "Mehr Platz je Tier (z.B. 20 % über gesetzlichem Minimum bei Schweinen)",
      "Natürliches Tageslicht (mind. 3–5 % der Grundfläche)",
      "Weiche / komfortable Liegeflächen (Komfortmatten, Einstreu)",
      "Auslauf / Weidezugang oder Außenklimabereich",
      "Beschäftigungsmaterial (ständig verfügbar)",
      "Umstellung Anbindehaltung → Laufstall bei Milchkühen",
      "Gruppenhaltung Kälber ab 5. Woche",
    ],
    note: "Besonders relevant für: Rinder, Kälber, Schweine (eingeschränkt), Geflügel (Bodenhaltung mit Wintergarten / Freiland)",
    warning: "Für Schweinehaltung: genereller Ausschluss Stall-Neubauten bis 31.12.2027 in den meisten Ländern. Nur spezifische Emissionsmaßnahmen (Anlage 3) förderfähig.",
  },
  {
    id: "siuk",
    label: "Emissionsminderung & Klimaschutz",
    sublabel: "SIUK – Anlage 3",
    badge: "40–75 %",
    badgeClass: "bg-teal-600 text-white",
    borderClass: "border-teal-500",
    bgClass: "bg-teal-50",
    accentClass: "text-teal-700",
    iconColor: "text-teal-600",
    IconComp: SunLeafIcon,
    intro: "SIUK steht für Stallbau, Infrastruktur, Umwelt & Klima. Die Fördersätze sind bundesweit am höchsten — bis zu 75 % in einzelnen Ländern.",
    groups: [
      {
        heading: "Bauliche Maßnahmen im Stall (Teil B)",
        items: [
          "Abluftreinigungsanlagen",
          "Kot-Harn-Trennung",
          "Emissionsarme Stallböden",
          "Verkleinerte Güllekanäle",
          "Güllekühlung",
          "Fütterungssysteme für nährstoffreduzierte Phasenfütterung",
        ],
      },
      {
        heading: "Lagerung Wirtschaftsdünger",
        items: [
          "Neue Gülle- / Festmistlager mit fester Abdeckung (gasdicht)",
          "Mindestens 2 Monate zusätzliche Kapazität über gesetzlichem Minimum",
        ],
      },
      {
        heading: "Außenwirtschaft / Maschinen (Teil A)",
        items: [
          "Abdriftmindernde Pflanzenschutzgeräte (JKI-geprüft, ≥ 90 % Reduktion)",
          "Mechanische Unkrautbekämpfung mit elektronischer Reihenführung (Kamera/GPS/Ultraschall)",
          "Präzisionstechnik (GPS, Sensorik für Düngung/Ausbringung)",
        ],
      },
    ],
  },
  {
    id: "resilienz",
    label: "Resilienz & Naturgefahren-Vorsorge",
    sublabel: "Meist 40 %",
    badge: "40 %",
    badgeClass: "bg-amber-600 text-white",
    borderClass: "border-amber-500",
    bgClass: "bg-amber-50",
    accentClass: "text-amber-700",
    iconColor: "text-amber-600",
    IconComp: WheatIcon,
    intro: "Schutz gegen Klimarisiken — Hagelschäden, Frost und Trockenheit können ganze Ernten vernichten. Der Staat fördert die Vorsorge.",
    items: [
      "Frostschutzberegnung (vor allem Sonderkulturen)",
      "Hagelschutznetze",
      "Starkregenschutz / Schutzsysteme",
      "Errichtung / Modernisierung von Bewässerungsanlagen mit mind. 15 % Wassereinsparung",
      "Tröpfchenbewässerung, Unterfluranlagen",
    ],
    note: "Keine Brunnen oder Speicherbecken (ausgeschlossen).",
  },
  {
    id: "basis",
    label: "Weitere förderfähige Investitionen",
    sublabel: "Basis 20 %",
    badge: "20 %",
    badgeClass: "bg-slate-600 text-white",
    borderClass: "border-slate-400",
    bgClass: "bg-slate-50",
    accentClass: "text-slate-700",
    iconColor: "text-slate-600",
    IconComp: TractorIcon,
    intro: "Standardinvestitionen ohne erhöhten Tierwohl- oder SIUK-Anteil — der Grundsatz von 20 % gilt bundesweit als Einstiegssatz.",
    items: [
      "Lagerhallen für Obst / Gemüse / Grobfutter (klimatisiert, ressourcenschonend)",
      "Fahrsilos",
      "Sonstige Stall- / Wirtschaftsgebäude (ohne reine Ersatzinvestition)",
      "Weiche Liegebereiche für Kälber (Kälbermatten) — oft +10 % Aufschlag, befristet",
    ],
  },
]

export function AssetsSection() {
  const [activeId, setActiveId] = useState<string>("tierwohl")

  const active = CATEGORIES.find((c) => c.id === activeId)!

  return (
    <section id="assets" className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-700 mb-4">
            <WheatIcon className="w-3.5 h-3.5" />
            Förderfähige Investitionen
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-balance">
            Was genau fördert das AFP — und wie viel?
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
            4 Hauptkategorien mit unterschiedlichen Fördersätzen. Klicke deine an und sieh alle Details.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.IconComp
            const isActive = cat.id === activeId
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setActiveId(cat.id)}
                className={`
                  relative flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${isActive
                    ? `${cat.borderClass} ${cat.bgClass} shadow-md`
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }
                `}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="active-bar"
                    className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${cat.badgeClass.split(" ")[0]}`}
                  />
                )}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? cat.bgClass : "bg-slate-100"}`}>
                  <Icon className={`w-5 h-5 ${isActive ? cat.iconColor : "text-slate-400"}`} />
                </div>
                <div>
                  <p className={`text-xs font-bold leading-tight ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                    {cat.label}
                  </p>
                  <span className={`mt-1 inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${cat.badgeClass}`}>
                    {cat.badge}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
            className={`rounded-2xl border-2 ${active.borderClass} ${active.bgClass} overflow-hidden`}
          >
            {/* Panel Header */}
            <div className={`px-6 py-5 border-b-2 ${active.borderClass} bg-white/60`}>
              <div className="flex flex-wrap items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${active.bgClass}`}>
                  <active.IconComp className={`w-6 h-6 ${active.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{active.label}</h3>
                  <p className={`text-sm font-semibold ${active.accentClass}`}>{active.sublabel}</p>
                </div>
                <span className={`ml-auto text-sm font-bold px-3 py-1.5 rounded-full ${active.badgeClass}`}>
                  Förderung {active.badge}
                </span>
              </div>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">{active.intro}</p>
            </div>

            {/* Panel Body */}
            <div className="p-6 sm:p-8">
              {"groups" in active && active.groups ? (
                // SIUK: Gruppen-Layout
                <div className="grid sm:grid-cols-3 gap-5">
                  {active.groups.map((group, gi) => (
                    <motion.div
                      key={group.heading}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: gi * 0.08 }}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
                    >
                      <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${active.accentClass}`}>
                        {group.heading}
                      </p>
                      <ul className="space-y-2">
                        {group.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-slate-700 leading-snug">
                            <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${active.iconColor}`} aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              ) : (
                // Einfaches Listen-Layout
                <div className="grid sm:grid-cols-2 gap-4">
                  {active.items!.map((item, idx) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-start gap-3 bg-white rounded-xl p-5 border border-slate-200 shadow-sm"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${active.bgClass}`}>
                        <Check className={`w-3.5 h-3.5 ${active.iconColor}`} aria-hidden="true" />
                      </div>
                      <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Note */}
              {"note" in active && active.note && (
                <p className="mt-4 text-xs text-slate-500 italic leading-relaxed">
                  {active.note}
                </p>
              )}

              {/* Warning */}
              {"warning" in active && active.warning && (
                <div className="mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs text-amber-800 leading-relaxed">{active.warning}</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-slate-500 text-sm sm:text-base mb-4">
            <span className="font-semibold text-slate-900">Dein Vorhaben ist dabei?</span>{" "}
            Berechne jetzt deinen genauen Förderbetrag — kostenlos & in 45 Sekunden.
          </p>
          <button
            onClick={() => document.getElementById("rechner")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-green-900/20 hg-btn relative overflow-hidden"
          >
            <TractorIcon className="w-4 h-4 text-white" />
            Zum AFP-Rechner
          </button>
        </motion.div>

      </div>
    </section>
  )
}
