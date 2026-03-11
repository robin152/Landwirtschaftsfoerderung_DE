"use client"

import { motion } from "framer-motion"
import { TractorIcon, WheatIcon, ShieldCheckAgriIcon, SunLeafIcon, MoneyBagIcon, BarnIcon } from "@/components/agri-icons"

const ZIELE = [
  {
    Icon: BarnIcon,
    title: "Produktions- & Arbeitsbedingungen",
    desc: "Neubau, Modernisierung und Erwerb von Wirtschaftsgütern, die Arbeitsabläufe verbessern und die Betriebssicherheit erhöhen.",
    color: "from-green-600 to-emerald-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    Icon: TractorIcon,
    title: "Rationalisierung & Kostensenkung",
    desc: "Investitionen, die den Ressourceneinsatz senken, Prozesse automatisieren und die Wettbewerbsfähigkeit des Betriebs langfristig stärken.",
    color: "from-teal-600 to-green-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
  {
    Icon: MoneyBagIcon,
    title: "Betriebliche Wertschöpfung",
    desc: "Maßnahmen, die die Erlöse steigern, neue Vermarktungswege erschließen oder die Produktqualität messbar anheben.",
    color: "from-amber-600 to-yellow-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    Icon: ShieldCheckAgriIcon,
    title: "Tierwohl, Umwelt & Verbraucherschutz",
    desc: "Haltungsmaßnahmen über dem gesetzlichen Mindeststandard: mehr Platz, Tageslicht, Laufhöfe, Außenklimabereich (Anlage 1 + 2).",
    color: "from-emerald-600 to-green-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    Icon: SunLeafIcon,
    title: "Klima- & Emissionsschutz",
    desc: "Abluftreinigung, Güllekühlung, gasdichte Lagerabdeckung, Biogasanlagen und weitere Maßnahmen zur NH₃- und CO₂-Reduktion (Anlage 3B).",
    color: "from-sky-600 to-teal-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  {
    Icon: WheatIcon,
    title: "Vorbeugung gegen Naturkatastrophen",
    desc: "Hagelschutznetze, Frostschutzberegnung, Drainagen und Bewässerungsanlagen mit mind. 15 % Wassereinsparung gegen Extremwetter.",
    color: "from-orange-600 to-amber-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
]

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export function FoerderZieleSection() {
  return (
    <section className="py-14 sm:py-20 bg-white border-t border-slate-100">
      <div className="page-container px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4" style={{ background: "#fef3c7", border: "1px solid #d4a017aa" }}>
            <ShieldCheckAgriIcon className="w-4 h-4" style={{ color: "#b8860b" }} />
            <span className="text-sm font-semibold" style={{ color: "#92650a" }}>Was die Förderung für die Landwirtschaft abdeckt</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 text-balance">
            Das alles lässt sich fördern — und das ist erst der Anfang
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Die Förderung für die Landwirtschaft deckt eine breite Palette an Investitionen ab. Ob neuer Stall, moderne Technik oder Klimaschutz — <strong className="text-slate-700">wer mindestens eines dieser Ziele verfolgt, hat gute Chancen auf bis zu 50 % Zuschuss.</strong>
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {ZIELE.map(({ Icon, title, desc, color, bg, border }) => (
            <motion.div
              key={title}
              variants={item}
              className={`group relative rounded-2xl border ${border} ${bg} p-5 sm:p-6 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
            >
              {/* Top-left glossy streak */}
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/40 blur-2xl pointer-events-none" />

              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Text */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 leading-snug">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="inline-flex items-center gap-2 text-white rounded-xl px-5 py-3 text-sm font-medium shadow-md" style={{ background: "#1a2e0a" }}>
            <span style={{ color: "#86efac" }} className="font-bold">Wichtig:</span>
            Investitionen in langlebige Wirtschaftsgüter mit mind. 5 Jahren Zweckbindung
          </div>
          <a
            href="#rechner"
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white rounded-xl px-5 py-3 text-sm font-semibold shadow-md transition-colors group"
          >
            <span>Jetzt Antrag starten — und legal vor Baubeginn loslegen</span>
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}
