"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, AlertTriangle, X, ArrowRight } from "lucide-react"
import { TractorIcon, WheatIcon, BarnIcon, MoneyBagIcon, SunLeafIcon } from "@/components/agri-icons"
import Image from "next/image"

const THEMEN = [
  {
    id: "tierwohl",
    label: "Premium-Tierhaltung",
    sublabel: "Stallumbau mit Platz & Licht",
    badge: "bis 40 %",
    badgeColor: "bg-emerald-600 text-white",
    accentColor: "text-emerald-700",
    borderColor: "border-emerald-500",
    bgColor: "bg-emerald-50",
    dotColor: "bg-emerald-500",
    image: "/images/gallery/tierwohl-stall.jpg",
    icon: BarnIcon,
    desc: "Ställe mit deutlich höheren Standards als gesetzlich vorgeschrieben — mehr Platz, Tageslicht, weiche Liegeflächen und Auslauf.",
    items: [
      "Neubau/Umbau mit 20 % mehr Fläche je Tier",
      "Natürliches Tageslicht (mind. 3–5 % Grundfläche)",
      "Weiche Liegeflächen & Einstreu",
      "Auslauf, Weidezugang oder Außenklimabereich",
      "Umstellung Anbindehaltung → Laufstall",
      "Gruppenhaltung Kälber ab 5. Woche",
    ],
    note: "Relevant für: Rinder, Kälber, Geflügel (Bodenhaltung). Schweine: Emissionsmaßnahmen gesondert förderfähig.",
  },
  {
    id: "klima",
    label: "Klima- & Emissionsschutz",
    sublabel: "Abluft, Güllekühlung, Lager",
    badge: "bis 50 %",
    badgeColor: "bg-teal-600 text-white",
    accentColor: "text-teal-700",
    borderColor: "border-teal-500",
    bgColor: "bg-teal-50",
    dotColor: "bg-teal-500",
    image: "/images/gallery/klima-emissionsschutz.jpg",
    icon: SunLeafIcon,
    desc: "Emissionsschutz-Maßnahmen mit den höchsten Fördersätzen bundesweit. Abluftanlagen, Güllekühlung und emissionsarme Stallböden.",
    items: [
      "Abluftreinigungsanlagen",
      "Güllekühlung & Kot-Harn-Trennung",
      "Emissionsarme Stallböden",
      "Verkleinerte Güllekanäle",
      "Phasenfütterung (nährstoffreduziert)",
      "Gasdichte Güllelagerabdeckung",
    ],
    note: "Klima- & Emissionsschutz (Anlage 3B). Kombinierbar mit Tierwohl-Bonus.",
  },
  {
    id: "kombi",
    label: "Kombi aus beidem",
    sublabel: "Das absolute Maximum",
    badge: "bis 50 %",
    badgeColor: "bg-purple-600 text-white",
    accentColor: "text-purple-700",
    borderColor: "border-purple-500",
    bgColor: "bg-purple-50",
    dotColor: "bg-purple-500",
    image: "/images/gallery/kombi-maximum.jpg",
    icon: MoneyBagIcon,
    desc: "Kombination aus Tierwohl (Anlage 1) und Emissionsschutz (Anlage 3) für den maximalen Fördersatz — der cleverste Weg.",
    items: [
      "Tierwohl-Stallbau + Abluftreinigung kombiniert",
      "Beide Anlagen in einem Antrag gebündelt",
      "Junglandwirt-Bonus (+10 %) on top möglich",
      "Öko-Betriebe erhalten zusätzlichen Aufschlag",
      "Maximale Bundesförderung + Landesbonus",
      "Höchste Förderstufe in nahezu allen Bundesländern",
    ],
    note: "Kombination setzt voraus, dass beide Maßnahmen baulich und betrieblich zusammenpassen.",
    highlight: true,
  },
  {
    id: "guelle",
    label: "Gülle-/Mistlager",
    sublabel: "Feste Abdeckung + 2 Mon. Reserve",
    badge: "bis 40 %",
    badgeColor: "bg-amber-600 text-white",
    accentColor: "text-amber-700",
    borderColor: "border-amber-500",
    bgColor: "bg-amber-50",
    dotColor: "bg-amber-500",
    image: "/images/gallery/guellelager.jpg",
    icon: WheatIcon,
    desc: "Neue oder erweiterte Güllelager mit gasdichter Abdeckung und mindestens 2 Monate Kapazität über dem gesetzlichen Minimum.",
    items: [
      "Neubau Gülle-/Festmistlager (gasdicht)",
      "Feste Abdeckung (Folie, Beton, Schwimmfolie)",
      "+2 Monate Kapazität über gesetzl. Minimum",
      "Kombinierbar mit SIUK-Maßnahmen",
      "Auch Erweiterung bestehender Lager förderfähig",
      "Gilt für alle Tierarten",
    ],
  },
  {
    id: "praezision",
    label: "Präzisionstechnik & Schutz",
    sublabel: "Bewässerung & Hagelschutz",
    badge: "bis 35 %",
    badgeColor: "bg-blue-600 text-white",
    accentColor: "text-blue-700",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-50",
    dotColor: "bg-blue-500",
    image: "/images/gallery/praezisionstechnik.jpg",
    icon: TractorIcon,
    desc: "GPS-gestützte Präzisionstechnik, Hagelschutznetze und ressourcenschonende Bewässerung für robuste Ernten.",
    items: [
      "GPS/Sensor-Präzisionstechnik für Düngung",
      "Abdriftmindernde Pflanzenschutzgeräte (≥90%)",
      "Mechanische Unkrautbekämpfung (Kamera/GPS)",
      "Hagelschutznetze für Sonderkulturen",
      "Bewässerung mit mind. 15 % Wassereinsparung",
      "Tröpfchen-/Unterfluranlagen",
    ],
    note: "Keine Brunnen oder Speicherbecken (ausgeschlossen). Frostschutzberegnung möglich.",
  },
  {
    id: "kaelber",
    label: "Weiche Kälbermatten",
    sublabel: "Befristeter Extra-Bonus",
    badge: "bis 40 %",
    badgeColor: "bg-rose-600 text-white",
    accentColor: "text-rose-700",
    borderColor: "border-rose-500",
    bgColor: "bg-rose-50",
    dotColor: "bg-rose-500",
    image: "/images/gallery/kaelbermatten.jpg",
    icon: BarnIcon,
    desc: "Weiche Liegebereiche für Kälber erhalten einen befristeten +10 % Aufschlag — Antrag stellen solange das Programm läuft.",
    items: [
      "Weiche Gummi-/Komfortmatten für Kälber",
      "+10 % Aufschlag (befristet bis Ende 2026)",
      "Gruppenhaltung ab der 5. Lebenswoche",
      "Kombinierbar mit allgemeiner Tierwohl-Förderung",
      "Mindestinvestition 10.000 €",
      "Gilt bundesweit (Programmverfügbarkeit prüfen)",
    ],
    warning: "Befristetes Bonusprogramm — Antragsstellung zeitnah empfohlen, solange Budget vorhanden ist.",
  },
  {
    id: "basis",
    label: "Lagerhallen & Fahrsilos",
    sublabel: "Basis-Investitionen 20 %",
    badge: "20 %",
    badgeColor: "bg-slate-600 text-white",
    accentColor: "text-slate-700",
    borderColor: "border-slate-400",
    bgColor: "bg-slate-50",
    dotColor: "bg-slate-500",
    image: "/images/gallery/lagerhalle-fahrsilo.jpg",
    icon: TractorIcon,
    desc: "Standardinvestitionen in Lager und Betriebsgebäude — der Einstiegssatz von 20 % gilt bundesweit als solide Basis.",
    items: [
      "Lagerhallen für Obst, Gemüse & Grobfutter",
      "Fahrsilos (Betonfermentor, Flachsilos)",
      "Sonstige Wirtschaftsgebäude",
      "Keine reine Ersatzinvestition förderfähig",
      "Mit Tierwohl-Maßnahmen kombinierbar",
      "Gilt in allen 16 Bundesländern",
    ],
  },
]

export function AssetsSection() {
  const [selected, setSelected] = useState<string | null>(null)

  const active = selected ? THEMEN.find((t) => t.id === selected) ?? null : null

  return (
    <section id="assets" className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="page-container px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-700 mb-4">
            <WheatIcon className="w-3.5 h-3.5" />
            Förderfähige Investitionsthemen
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 text-balance">
            Was genau fördert die Landwirtschaftsförderung — und wie viel?
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
            7 Investitionsthemen mit unterschiedlichen Fördersätzen. Klicken Sie ein Thema an für alle Details.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {THEMEN.map((thema, i) => {
            const Icon = thema.icon
            const isSelected = selected === thema.id
            return (
              <motion.button
                key={thema.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setSelected(isSelected ? null : thema.id)}
                className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all duration-200 shadow-sm hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                  isSelected
                    ? `${thema.borderColor} shadow-lg`
                    : "border-slate-200 hover:border-slate-300"
                } ${thema.id === "kombi" ? "sm:col-span-2 lg:col-span-1" : ""}`}
                aria-pressed={isSelected}
              >
                {/* Image */}
                <div className="relative w-full h-44 overflow-hidden bg-slate-100">
                  <Image
                    src={thema.image}
                    alt={thema.label}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Badge overlay */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-md ${thema.badgeColor}`}>
                      {thema.badge}
                    </span>
                  </div>
                  {/* Highlight ribbon */}
                  {thema.highlight && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-900 shadow">
                        MAXIMUM
                      </span>
                    </div>
                  )}
                  {/* Kälber befristet */}
                  {thema.id === "kaelber" && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow">
                        BEFRISTET
                      </span>
                    </div>
                  )}
                  {/* Dark overlay on selected */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-slate-900/30" />
                  )}
                </div>

                {/* Card body */}
                <div className={`p-4 transition-colors duration-200 ${isSelected ? thema.bgColor : "bg-white"}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-slate-900 text-sm leading-tight">{thema.label}</p>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? `${thema.borderColor} ${thema.bgColor}` : "border-slate-200 bg-slate-50"
                    }`}>
                      {isSelected && (
                        <div className={`w-2.5 h-2.5 rounded-full ${thema.dotColor}`} />
                      )}
                    </div>
                  </div>
                  <p className={`text-xs font-medium mb-2 ${isSelected ? thema.accentColor : "text-slate-500"}`}>
                    {thema.sublabel}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{thema.desc}</p>
                  <div className={`flex items-center gap-1 mt-3 text-xs font-semibold transition-colors ${isSelected ? thema.accentColor : "text-slate-400"}`}>
                    <span>{isSelected ? "Details ausblenden" : "Details anzeigen"}</span>
                    <ArrowRight className={`w-3 h-3 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 16, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className={`rounded-2xl border-2 ${active.borderColor} overflow-hidden mb-8`}>
                {/* Panel header */}
                <div className={`px-5 py-4 ${active.bgColor} border-b ${active.borderColor} flex items-start justify-between gap-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active.bgColor} border ${active.borderColor}`}>
                      <active.icon className={`w-5 h-5 ${active.accentColor}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{active.label}</h3>
                      <p className={`text-sm font-medium ${active.accentColor}`}>{active.sublabel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${active.badgeColor}`}>
                      {active.badge}
                    </span>
                    <button
                      onClick={() => setSelected(null)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                      aria-label="Schliessen"
                    >
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Panel body */}
                <div className="p-5 sm:p-7 bg-white">
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">{active.desc}</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {active.items.map((item, idx) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className={`flex items-start gap-3 rounded-xl p-4 border ${active.borderColor} ${active.bgColor}`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${active.dotColor}`}>
                          <Check className="w-3 h-3 text-white" aria-hidden="true" />
                        </div>
                        <span className="text-sm text-slate-700 leading-snug">{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  {active.note && (
                    <p className="mt-4 text-xs text-slate-500 italic leading-relaxed border-t border-slate-100 pt-4">
                      {active.note}
                    </p>
                  )}

                  {active.warning && (
                    <div className="mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-xs text-amber-800 leading-relaxed">{active.warning}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 text-center"
        >
          <p className="text-slate-500 text-sm sm:text-base mb-4">
            <span className="font-semibold text-slate-900">Ihr Vorhaben ist dabei?</span>{" "}
            Berechnen Sie jetzt Ihren genauen Förderbetrag — kostenlos und in 45 Sekunden.
          </p>
          <button
            onClick={() => document.getElementById("rechner")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-green-900/20 hg-btn relative overflow-hidden"
          >
            <TractorIcon className="w-4 h-4 text-white" />
            Zum Förderrechner
          </button>
        </motion.div>

      </div>
    </section>
  )
}
