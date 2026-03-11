"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Shield, Award, Users, TrendingUp, CheckCircle2, Star } from "lucide-react"

const STATS = [
  { value: ">98,85 %", label: "Erfolgsquote", sub: "bei Förderanträgen" },
  { value: "2015", label: "Gegründet", sub: "Schweizer AG, Pfäffikon SZ" },
  { value: ">30 Mio. €", label: "Zuschüsse gesichert", sub: "für unsere Kunden" },
  { value: ">478 h", label: "Bürokratie gespart", sub: "kumuliert, dokumentiert" },
]

const CREDENTIALS = [
  {
    icon: Award,
    title: "ISO 9001 zertifiziert",
    desc: "Qualitätsmanagement nach internationalem Standard — keine Fehler auf Kosten Ihres Antrags.",
  },
  {
    icon: TrendingUp,
    title: "ISO 56001 zertifiziert",
    desc: "Innovationsmanagement nach Norm — wir denken systematisch, nicht nach Bauchgefühl.",
  },
  {
    icon: Users,
    title: "Ingenieure & Betriebswirte",
    desc: "Wir kombinieren technisches Verständnis mit Fördermittel-Know-how. Kein reines Büro, sondern echte Substanz.",
  },
  {
    icon: Shield,
    title: "Subventions-Spezialisten",
    desc: "Wir kennen die Bundesland-Quoten, die Ausschlussgründe, die Bonusstapel — und holen das Maximum für Sie heraus.",
  },
]

const REVIEWS = [
  {
    name: "Sascha Bügener",
    role: "Inhaber, S. Bügener Tischlerei",
    text: "Mein Generationenvertrag ist nun bereits übererfüllt.",
    stars: 5,
  },
  {
    name: "Sinan Bozkurt",
    role: "Inhaber Restaurant Ronja",
    text: "Niemand hat es mir vorher gesagt — obwohl ich viele schlaue Menschen bei mir hatte.",
    stars: 5,
  },
  {
    name: "Gerrick Kammholz",
    role: "CEO, myshopbooster",
    text: "Schnell & einfach, mit einer Menge Entertainment!",
    stars: 5,
  },
  {
    name: "Dirk Hildebrandt",
    role: "CEO, Go4it!",
    text: "Danke fürs Dranbleiben!",
    stars: 5,
  },
  {
    name: "Florian Maier",
    role: "CEO",
    text: "Das zeigt, was eine wirklich starke Marke ausmacht.",
    stars: 5,
  },
]

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export function EskalatorTrustSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      ref={ref}
      className="bg-white py-14 sm:py-20 border-y border-slate-100 overflow-hidden"
      aria-label="Über Eskalator AG — Vertrauen & Qualifikation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
              Ihr Partner — Eskalator AG
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 text-balance leading-tight">
              Keine Makler. Keine Versprechen.<br className="hidden sm:block" />
              Ingenieure mit Erfolgsnachweis.
            </h2>
          </div>
          {/* Google Badge */}
          <div className="flex-shrink-0 flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 font-medium mb-0.5">Google</span>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <p className="text-lg font-bold text-slate-900 leading-none">5,0</p>
              <p className="text-xs text-slate-400">Bewertung</p>
            </div>
          </div>
        </motion.div>

        {/* Stats bar — bordered grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 border border-slate-200 rounded-2xl overflow-hidden mb-8"
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className={`px-5 py-6 flex flex-col gap-1 bg-slate-50 ${
                i < STATS.length - 1 ? "border-b lg:border-b-0 border-r-0 lg:border-r border-slate-200" : ""
              } ${i === 1 ? "border-r border-slate-200 lg:border-r" : ""}`}
            >
              <span className="text-2xl sm:text-3xl font-bold text-emerald-700 leading-none">{s.value}</span>
              <span className="text-sm font-semibold text-slate-900">{s.label}</span>
              <span className="text-xs text-slate-500">{s.sub}</span>
            </div>
          ))}
        </motion.div>

        {/* Two-column: Credentials + Reviews */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Left — credentials */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-3"
          >
            {CREDENTIALS.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-sm font-bold text-slate-900 leading-snug">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}

            {/* UID / legal */}
            <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex flex-wrap gap-x-6 gap-y-1.5">
              {[
                { label: "Rechtsform", value: "Aktiengesellschaft (CH)" },
                { label: "UID", value: "CHE-399.487.701" },
                { label: "Sitz", value: "Pfäffikon SZ, Schweiz" },
                { label: "Gegründet", value: "2015" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs text-slate-400">{label}:</span>
                  <span className="text-xs text-slate-700 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — reviews */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col gap-3"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
              Was Kunden sagen
            </p>
            <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[420px] pr-1 scrollbar-thin">
              {REVIEWS.map((r, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 flex flex-col gap-1.5 shadow-sm"
                >
                  <StarRow count={r.stars} />
                  <p className="text-sm text-slate-700 leading-relaxed italic">"{r.text}"</p>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA nudge */}
            <div className="mt-1 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <p className="text-sm text-slate-700 leading-snug">
                <strong className="text-slate-900">Kostenlose Erstprüfung:</strong> Wir sagen Ihnen in 48 h, was für Ihren Betrieb drin ist — ohne Wenn und Aber.
              </p>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
