"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { AlertTriangle, TrendingUp, Award, ChevronRight, Leaf, CheckCircle2, XCircle, Info, AlertCircle, Calendar } from "lucide-react"
import { RechnerUnlockModal } from "@/components/rechner-unlock-modal"
import { TractorIcon, WheatIcon, BarnIcon, MoneyBagIcon, SunLeafIcon } from "@/components/agri-icons"

// ─── TidyCal Embed — lokal im Rechner ────────────────────────────────────────
function TidyCalEmbedRechner({ path }: { path: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return
    if (!scriptLoadedRef.current) {
      const script = document.createElement("script")
      script.src = "https://asset-tidycal.b-cdn.net/js/embed.js"
      script.async = true
      script.onload = () => { scriptLoadedRef.current = true }
      containerRef.current.appendChild(script)
    }
    return () => {
      if (containerRef.current) {
        const iframe = containerRef.current.querySelector("iframe")
        if (iframe) iframe.remove()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="tidycal-embed rounded-xl overflow-hidden border border-slate-700 min-h-[400px] bg-white"
      data-path={path}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA — exakt nach Förderquoten-Tabelle 2026 (Screenshot + PDF)
// ─────────────────────────────────────────────────────────────────────────────
const BUNDESLAENDER = {
  "Nordrhein-Westfalen": {
    maxInvest: 1_200_000,
    prosperitaetLedig: 150_000,
    prosperitaetVerheiratet: 180_000,
    basisSatz: 20,
    tierwohlMax: 40,
    siukMax: 50,       // Schweine: 50 %
    kombiMax: 40,
    jungBonus: 10,
    besonderheit: "Kälbermatten-Aufschlag +10 % (befristet bis 31.12.2025). ELAN-Portal.",
    kalberAufschlag: true,
  },
  "Niedersachsen / HB / HH": {
    maxInvest: 1_500_000,
    prosperitaetLedig: 170_000,
    prosperitaetVerheiratet: 200_000,
    basisSatz: 20,
    tierwohlMax: 40,
    siukMax: 40,
    kombiMax: 40,
    jungBonus: 10,
    besonderheit: "Mobilställe explizit förderfähig. Außenwirtschaft nur 20 %. Höchste Prosper.-Grenze West.",
    mobilstaelle: true,
  },
  "Bayern": {
    maxInvest: 1_200_000,
    prosperitaetLedig: 140_000,
    prosperitaetVerheiratet: 170_000,
    basisSatz: 20,
    tierwohlMax: 25,   // Bayern: Tierwohl nur 25 % laut Tabelle
    siukMax: 40,
    kombiMax: 40,
    jungBonus: 10,
    besonderheit: "Tierwohl-Satz bei 25 % (nicht 40 %). Meister/Qualifikation bringt +15 PP extra. Öko-Bonus möglich.",
    qualifikationsBonus: true,
  },
  "Baden-Württemberg": {
    maxInvest: 2_000_000,
    prosperitaetLedig: 210_000,
    prosperitaetVerheiratet: 250_000,
    basisSatz: 20,
    tierwohlMax: 30,   // 30–40 % laut Tabelle
    siukMax: 40,
    kombiMax: 40,
    jungBonus: 10,
    besonderheit: "Tierwohl 30–40 %. Stallbau-Basis seit 2024 fast weggefallen. Schweine ab Sept. 2026 wieder förderfähig.",
  },
  "Hessen": {
    maxInvest: 5_000_000,
    prosperitaetLedig: null,   // keine feste Grenze (KMU)
    prosperitaetVerheiratet: null,
    basisSatz: 20,
    tierwohlMax: 40,
    siukMax: 75,       // Hessen: SIUK bis 75 %!
    kombiMax: 50,
    jungBonus: 10,
    besonderheit: "Höchste Emissionsschutz-Sätze bundesweit (75 %). Keine Einkommensgrenze für KMU. Nicht-produktive Investitionen sehr hoch gefördert.",
  },
  "Sachsen-Anhalt": {
    maxInvest: 5_000_000,
    prosperitaetLedig: 170_000,
    prosperitaetVerheiratet: 220_000,
    basisSatz: 20,
    tierwohlMax: 40,
    siukMax: 40,
    kombiMax: 40,
    jungBonus: 10,
    besonderheit: "Höchste Einkommensgrenzen in den neuen Bundesländern.",
  },
  "Brandenburg": {
    maxInvest: 5_000_000,
    prosperitaetLedig: 140_000,
    prosperitaetVerheiratet: 170_000,
    basisSatz: 40,     // Basis bereits 40 %!
    tierwohlMax: 65,   // Tierwohl bis 65 %
    siukMax: 65,
    kombiMax: 65,
    jungBonus: 10,
    besonderheit: "Sehr hohe Sätze: Basis schon 40 %, Tierwohl & Emissionsschutz bis 65 %. Inkl. Berlin-Betriebe.",
  },
  "Sachsen": {
    maxInvest: 5_000_000,
    prosperitaetLedig: null,   // keine feste Grenze
    prosperitaetVerheiratet: null,
    basisSatz: 20,
    tierwohlMax: 40,
    siukMax: 65,
    kombiMax: 50,
    jungBonus: 10,
    besonderheit: "Emissionsschutz bis 65 %. Keine Einkommensgrenze. GV/ha-Grenze < 2,0 beachten.",
  },
  "Thüringen": {
    maxInvest: 5_000_000,
    prosperitaetLedig: null,
    prosperitaetVerheiratet: null,
    basisSatz: 20,
    tierwohlMax: 40,
    siukMax: 40,
    kombiMax: 40,
    jungBonus: 10,
    besonderheit: "Keine Einkommensgrenze. Extra-Öko-Bonus möglich. Hohe Planungsflexibilität.",
  },
  "Mecklenburg-Vorpommern": {
    maxInvest: 5_000_000,
    prosperitaetLedig: null,
    prosperitaetVerheiratet: null,
    basisSatz: 20,
    tierwohlMax: 40,
    siukMax: 65,       // MV variabel bis 65 %
    kombiMax: 50,
    jungBonus: 10,
    besonderheit: "SIUK variabel 40–65 %. Mobilställe & SIUK stark. Milchvieh-Schwerpunkt.",
  },
  "Schleswig-Holstein": {
    maxInvest: 1_500_000,   // 1–5 Mio. variabel; Standard an Niedersachsen angelehnt
    prosperitaetLedig: 170_000,
    prosperitaetVerheiratet: 200_000,
    basisSatz: 20,
    tierwohlMax: 40,
    siukMax: 40,
    kombiMax: 40,
    jungBonus: 10,
    besonderheit: "Max-Invest 1–5 Mio. variabel (Standardwert 1,5 Mio.). Mobilställe & Emissionsschutz stark.",
  },
  "Rheinland-Pfalz": {
    maxInvest: null,         // variabel, mind. 50.000 € Invest
    minInvestSpecial: 50_000,
    prosperitaetLedig: 200_000,
    prosperitaetVerheiratet: 200_000,
    basisSatz: 20,
    tierwohlMax: 40,
    siukMax: 40,
    kombiMax: 40,
    jungBonus: 10,
    besonderheit: "Mind. 50.000 € Invest (höhere Schwelle als Bundesdurchschnitt). Max-Invest variabel. Diversifizierung stark gewichtet.",
  },
  "Saarland": {
    maxInvest: 3_000_000,
    prosperitaetLedig: 160_000,
    prosperitaetVerheiratet: 200_000,
    basisSatz: 25,     // Saarland: Basis 25 %
    tierwohlMax: 40,
    siukMax: 40,
    kombiMax: 40,
    jungBonus: 10,
    besonderheit: "Basis-Satz 25 % (höher als Bundesdurchschnitt). Gülleabdeckung bis 90 % möglich.",
  },
} as const

type BundeslandKey = keyof typeof BUNDESLAENDER

// ─────────────────────────────────────────────────────────────────────────────
// INVESTITIONSARTEN
// ─────────────────────────────────────────────────────────────────────────────
const INVESTITIONSARTEN = [
  {
    id: "tierwohl",
    label: "Premium-Tierhaltung (Anlage 1+2)",
    desc: "Mehr Platz, Licht, Lüftung, Laufhöfe, Liegeboxen — messbar über Mindeststandard",
    badge: "bis 40 %",
    badgeColor: "bg-emerald-900/60 text-emerald-300 border-emerald-700",
    icon: "barn",
  },
  {
    id: "siuk",
    label: "Klima- & Emissionsschutz (Anlage 3B)",
    desc: "Abluft, Güllekühlung, Biogasanlage, Lager mit fester Abdeckung",
    badge: "bis 75 %",
    badgeColor: "bg-blue-900/60 text-blue-300 border-blue-700",
    icon: "sun",
  },
  {
    id: "kombi",
    label: "Kombination Tierwohl + Emissionsschutz",
    desc: "Stallbau + Emissionsschutz kombiniert — holt den maximalen Gesamtsatz",
    badge: "Maximum",
    badgeColor: "bg-orange-900/60 text-orange-300 border-orange-700",
    icon: "money",
  },
  {
    id: "guelle",
    label: "Gülle-/Mistlager + Abdeckung",
    desc: "+2 Monate Kapazität über gesetzl. Minimum, feste Abdeckung Pflicht",
    badge: "40 %",
    badgeColor: "bg-emerald-900/60 text-emerald-300 border-emerald-700",
    icon: "wheat",
  },
  {
    id: "kaelber",
    label: "Weiche Kälbermatten (NRW befristet)",
    desc: "Liege- & Tränkebereiche für Kälber unter 8 Monate — NRW +10 % Aufschlag",
    badge: "30–40 %",
    badgeColor: "bg-amber-900/60 text-amber-300 border-amber-700",
    icon: "sun",
  },
  {
    id: "praezision",
    label: "Präzisionstechnik / Bewässerung / Hagelschutz",
    desc: "GPS/Sensorik mind. 15 % Wassereinsparung, Hagelschutznetze, Frostschutz",
    badge: "30 %",
    badgeColor: "bg-slate-700/60 text-slate-300 border-slate-600",
    icon: "tractor",
  },
  {
    id: "basis",
    label: "Lagerhalle / Fahrsilo / Sonstiges",
    desc: "Maßnahmen ohne erhöhten Tierwohl- oder Emissionsschutz-Anteil",
    badge: "20–25 %",
    badgeColor: "bg-slate-700/60 text-slate-300 border-slate-600",
    icon: "barn",
  },
] as const

type InvestitionsartId = (typeof INVESTITIONSARTEN)[number]["id"]

// Tierhaltungsarten für zusätzliche Logik
const TIERHALTUNGSARTEN = [
  { id: "rind", label: "Rinder / Milchvieh" },
  { id: "schwein", label: "Schweine" },
  { id: "gefluegel", label: "Geflügel / Legehennen" },
  { id: "schaf_ziege", label: "Schafe / Ziegen" },
  { id: "gemischt", label: "Gemischter Betrieb" },
  { id: "pflanzenbau", label: "Reiner Pflanzenbau" },
] as const

type TierhaltungsartId = (typeof TIERHALTUNGSARTEN)[number]["id"]

// ─────────────────────────────────────────────────────────────────────────────
// BERECHNUNGSLOGIK
// ─────────────────────────────────────────────────────────────────────────────
function berechne(params: {
  bundesland: BundeslandKey | null
  investitionsart: InvestitionsartId | null
  tierhaltung: TierhaltungsartId | null
  investVolumen: number
  alter: number
  familienstand: "ledig" | "verheiratet"
  einkommen: number
  istOeko: boolean
  hatMeister: boolean
  gvHa?: number          // Viehbesatz GV/ha (optional)
  tierbestand?: number   // Anzahl Tierplätze (für NRW-Bestandsobergrenzen)
}) {
  const { bundesland, investitionsart, tierhaltung, investVolumen, alter, familienstand, einkommen, istOeko, hatMeister, gvHa, tierbestand } = params

  if (!bundesland || !investitionsart) return null

  const bl = BUNDESLAENDER[bundesland]

  // 1. Prosperitäts-Check (null = keine Grenze)
  const grenzeLedig = bl.prosperitaetLedig
  const grenzeVerh = bl.prosperitaetVerheiratet
  const aktuelleGrenze = familienstand === "verheiratet" ? grenzeVerh : grenzeLedig
  const prosperitaetFail =
    aktuelleGrenze !== null && einkommen > 0 && einkommen > aktuelleGrenze

  // 2. Mindestinvestition — RP hat erhöhte Schwelle von 50.000 €
  const minInvestBase = investitionsart === "kaelber" ? 10_000 : 20_000
  const minInvest = ("minInvestSpecial" in bl && bl.minInvestSpecial)
    ? Math.max(minInvestBase, bl.minInvestSpecial)
    : minInvestBase
  const zuWenig = investVolumen > 0 && investVolumen < minInvest

  // 3. Cap auf Maximalvolumen
  const maxInvest = bl.maxInvest ?? 5_000_000
  const cappedInvest = Math.min(investVolumen, maxInvest)
  const cappedByMax = investVolumen > maxInvest

  // 4. Schweine-Sperre (BW bis Sept 2026)
  const schweinSperre =
    tierhaltung === "schwein" &&
    bundesland === "Baden-Württemberg"

  // 5. Viehbesatzgrenze: max. 2,0 GV/ha selbstbewirtschafteter Fläche
  //    Warnung wenn gvHa bekannt und > 2,0
  const viehbesatzWarnung = typeof gvHa === "number" && gvHa > 0 && gvHa > 2.0

  // 6. NRW Bestandsobergrenzen (kumulativ, absolute Platzgrenzen)
  const nrwBestandsWarnung =
    bundesland === "Nordrhein-Westfalen" &&
    typeof tierbestand === "number" &&
    tierbestand > 0 &&
    (
      (tierhaltung === "gefluegel" && tierbestand > 15_000) ||
      (tierhaltung === "rind"     && tierbestand > 600)    ||
      (tierhaltung === "schwein"  && tierbestand > 1_500)
    )

  // 7. Basis-Fördersatz je Investitionsart
  let baseSatz = 0
  switch (investitionsart) {
    case "tierwohl":   baseSatz = bl.tierwohlMax; break
    case "siuk":       baseSatz = bl.siukMax;     break
    case "kombi":      baseSatz = bl.kombiMax;    break
    case "guelle":     baseSatz = 40;             break
    case "kaelber":
      baseSatz = 30 + ("kalberAufschlag" in bl && bl.kalberAufschlag ? 10 : 0)
      break
    case "praezision": baseSatz = 30;             break
    case "basis":      baseSatz = bl.basisSatz;   break
  }

  // 8. Bayern Tierwohl-Sonderfall: Meister +15 PP
  let qualBonus = 0
  if (bundesland === "Bayern" && hatMeister && (investitionsart === "tierwohl" || investitionsart === "kombi")) {
    qualBonus = 15
  }

  // 9. Öko-Bonus (Thüringen, Bayern, Sachsen)
  let oekoBonus = 0
  if (istOeko && ["Bayern", "Thüringen", "Sachsen"].includes(bundesland)) {
    oekoBonus = 5
  }

  // 10. Junglandwirt-Bonus (+10 PP, max. 20.000 € absolut)
  const istJunglandwirt = alter > 0 && alter <= 40
  const jungBonusPP = istJunglandwirt ? 10 : 0

  // 11. Gesamtsatz (hard cap = höchster BL-Satz + 10 für Junglandwirt)
  const hardCap = Math.max(bl.kombiMax, bl.siukMax) + 10
  let gesamtSatz = Math.min(baseSatz + qualBonus + oekoBonus + jungBonusPP, hardCap)

  // 12. Zuschuss berechnen
  let zuschuss = cappedInvest * (gesamtSatz / 100)

  // Junglandwirt-Bonus max. 20.000 €
  if (istJunglandwirt) {
    const zuschussOhneJung = cappedInvest * ((baseSatz + qualBonus + oekoBonus) / 100)
    const jungBonusBetrag = zuschuss - zuschussOhneJung
    if (jungBonusBetrag > 20_000) {
      zuschuss = zuschussOhneJung + 20_000
      gesamtSatz = Math.round((zuschuss / cappedInvest) * 100)
    }
  }

  // 13. Zweckbindungsfristen
  const zweckbindungJahre =
    ["basis", "tierwohl", "kombi", "guelle", "siuk"].includes(investitionsart) ? 12 : 5

  // 14. Förderlevel für Anzeige
  const maxMoeglich = hardCap
  const foerderLevel = Math.min(Math.round((gesamtSatz / maxMoeglich) * 100), 100)

  return {
    prosperitaetFail,
    aktuelleGrenze,
    zuWenig,
    schweinSperre,
    viehbesatzWarnung,
    nrwBestandsWarnung,
    cappedInvest,
    cappedByMax,
    maxInvest,
    baseSatz,
    qualBonus,
    oekoBonus,
    jungBonusPP,
    gesamtSatz,
    zuschuss: (prosperitaetFail || schweinSperre) ? 0 : zuschuss,
    foerderLevel,
    istJunglandwirt,
    besonderheit: bl.besonderheit,
    minInvest,
    investVolumen,
    zweckbindungJahre,
  }
}

// Map icon keys to agri SVG components
function AgriCardIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case "tractor": return <TractorIcon className={className} />
    case "wheat":   return <WheatIcon className={className} />
    case "barn":    return <BarnIcon className={className} />
    case "money":   return <MoneyBagIcon className={className} />
    case "sun":     return <SunLeafIcon className={className} />
    default:        return <WheatIcon className={className} />
  }
}

// ───────────────────────────────────────�������───────────────────���─────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  hint,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  hint?: string
  error?: boolean
}) {
  return (
    <div className={`flex flex-col gap-2 ${error ? "animate-shake" : ""}`}>
      <label className={`text-sm font-bold ${error ? "text-red-400" : "text-white"}`}>
        {label}
        {error && <span className="ml-1.5 font-normal text-red-400 text-xs">— bitte auswählen</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ fontSize: "16px" }}
          className={`w-full bg-slate-800 border text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer touch-manipulation min-h-[54px] font-medium ${
            error
              ? "border-red-500 ring-2 ring-red-500/30 focus:border-red-400 focus:ring-red-400/30"
              : value
              ? "border-emerald-600/60 focus:border-emerald-500 focus:ring-emerald-500/20"
              : "border-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20"
          }`}
        >
          <option value="" className="text-slate-500">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {/* Chevron */}
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        {value && !error && (
          <div className="absolute left-4 -top-2.5">
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Ausgewählt</span>
          </div>
        )}
      </div>
      {hint && !error && <p className="text-xs text-slate-500 leading-relaxed">{hint}</p>}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          Pflichtfeld — bitte eine Option wählen.
        </p>
      )}
    </div>
  )
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
  placeholder,
  hint,
  inputMode: inputModeOverride,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  min?: number
  max?: number
  suffix?: string
  placeholder?: string
  hint?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  error?: boolean
}) {
  return (
    <div className={`flex flex-col gap-2 ${error ? "animate-shake" : ""}`}>
      <label className={`text-sm font-bold ${error ? "text-red-400" : "text-white"}`}>
        {label}
        {error && <span className="ml-1.5 font-normal text-red-400 text-xs">— bitte ausfüllen</span>}
      </label>
      <div className="relative">
        <input
          type="number"
          inputMode={inputModeOverride ?? "numeric"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          placeholder={placeholder}
          style={{ fontSize: "16px" }}
          className={`w-full bg-slate-800 border text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 transition-all pr-16 touch-manipulation min-h-[54px] font-medium ${
            error
              ? "border-red-500 ring-2 ring-red-500/30 focus:border-red-400 focus:ring-red-400/30"
              : value
              ? "border-emerald-600/60 focus:border-emerald-500 focus:ring-emerald-500/20"
              : "border-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20"
          }`}
        />
        {suffix && (
          <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none ${error ? "text-red-400" : "text-slate-400"}`}>
            {suffix}
          </span>
        )}
      </div>
      {hint && !error && <p className="text-xs text-slate-500 leading-relaxed">{hint}</p>}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          Bitte ausfüllen, um fortzufahren.
        </p>
      )}
    </div>
  )
}

function ToggleField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group touch-manipulation min-h-[48px] py-1">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-emerald-600 transition-colors" />
        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-300">{label}</p>
        {hint && <p className="text-xs text-slate-500 mt-0.5">{hint}</p>}
      </div>
    </label>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  { label: "Betrieb",  short: "1" },
  { label: "Vorhaben", short: "2" },
  { label: "Person",   short: "3" },
  { label: "Ergebnis", short: "4" },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((s, i) => (
        <div key={s.label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5 relative">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold transition-all duration-300 ${
                i < current
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/50"
                  : i === current
                  ? "bg-emerald-500 text-white ring-4 ring-emerald-400/25 shadow-lg shadow-emerald-900/50 scale-110"
                  : "bg-slate-700 text-slate-500"
              }`}
            >
              {i < current ? <CheckCircle2 className="w-4.5 h-4.5" /> : i + 1}
            </div>
            <span className={`text-[11px] font-semibold whitespace-nowrap ${
              i === current ? "text-emerald-400" : i < current ? "text-emerald-600" : "text-slate-600"
            }`}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex-1 mx-2 mb-5 relative h-0.5 rounded-full overflow-hidden bg-slate-700">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{ width: i < current ? "100%" : "0%" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
// ─── Confetti on first mount ─────────────────────────────────────────────────
function ConfettiOnMount({ children, triggerConfetti }: { children: React.ReactNode; triggerConfetti: () => void }) {
  const firedRef = useRef(false)
  useEffect(() => {
    if (!firedRef.current) {
      firedRef.current = true
      setTimeout(triggerConfetti, 200)
    }
  }, [triggerConfetti])
  return <>{children}</>
}

export function AFPRechner({ onCTAClick }: { onCTAClick?: () => void }) {
  const [step, setStep] = useState(0)
  const [showErrors, setShowErrors] = useState(false)
  const [resultUnlocked, setResultUnlocked] = useState(false)
  const [showUnlockModal, setShowUnlockModal] = useState(false)

  // Step 0 — Betrieb
  const [bundesland, setBundesland] = useState<BundeslandKey | "">("")
  const [tierhaltung, setTierhaltung] = useState<TierhaltungsartId | "">("")
  const [istOeko, setIstOeko] = useState(false)

  // Step 1 — Vorhaben
  const [investitionsarten, setInvestitionsarten] = useState<InvestitionsartId[]>([])
  const investitionsart = investitionsarten[0] ?? ("" as const) // backward compat for berechne (uses highest-rate art)
  const [investVolumen, setInvestVolumen] = useState("")

  function toggleInvestitionsart(id: InvestitionsartId) {
    setShowErrors(false)
    setInvestitionsarten((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // For calculation: pick the art with highest potential Fördersatz
  const INVEST_ORDER: InvestitionsartId[] = ["kombi", "siuk", "tierwohl", "guelle", "kaelber", "praezision", "basis"]
  const primaryInvestitionsart: InvestitionsartId | "" =
    investitionsarten.length === 0
      ? ""
      : INVEST_ORDER.find((id) => investitionsarten.includes(id)) ?? investitionsarten[0]

  // Step 2 — Person
  const [alter, setAlter] = useState("")
  const [familienstand, setFamilienstand] = useState<"ledig" | "verheiratet">("ledig")
  const [einkommen, setEinkommen] = useState("")
  const [hatMeister, setHatMeister] = useState(false)

  const ergebnis = useMemo(
    () =>
      berechne({
        bundesland: bundesland as BundeslandKey | null,
        investitionsart: primaryInvestitionsart as InvestitionsartId | null,
        tierhaltung: tierhaltung as TierhaltungsartId | null,
        investVolumen: Number(investVolumen) || 0,
        alter: Number(alter) || 0,
        familienstand,
        einkommen: Number(einkommen) || 0,
        istOeko,
        hatMeister,
        // gvHa & tierbestand sind optional — werden nur gewarnt wenn bekannt
      }),
    [bundesland, primaryInvestitionsart, tierhaltung, investVolumen, alter, familienstand, einkommen, istOeko, hatMeister]
  )

  const bundeslandOptions = Object.keys(BUNDESLAENDER).map((k) => ({ value: k, label: k }))
  const tierhaltungOptions = TIERHALTUNGSARTEN.map((t) => ({ value: t.id, label: t.label }))
  const famOptions = [
    { value: "ledig", label: "Ledig / Einzelperson" },
    { value: "verheiratet", label: "Verheiratet / Lebenspartner" },
  ]

  // Validierung je Step
  const canProceed = [
    !!bundesland && !!tierhaltung,
    !!primaryInvestitionsart && Number(investVolumen) >= 10_000,
    !!alter,
  ]

  const isBlocked = ergebnis && (ergebnis.prosperitaetFail || ergebnis.zuWenig || ergebnis.schweinSperre)

  function nextStep() {
    if (!canProceed[step]) {
      setShowErrors(true)
      return
    }
    setShowErrors(false)
    if (step < 3) setStep(step + 1)
  }
  function prevStep() {
    setShowErrors(false)
    if (step > 0) setStep(step - 1)
  }

  return (
    <>
    <div className="bg-slate-900 rounded-2xl border border-slate-700/60 overflow-hidden hg-card-dark">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-slate-900 border-b border-slate-700 px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <TractorIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg leading-tight">Förderrechner für die Landwirtschaft 2026</h3>
            <p className="text-emerald-400 text-xs sm:text-sm">In 3 Schritten zu Ihrem exakten Förderbetrag</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <StepIndicator current={step} />

        {/* ─── STEP 0: Betrieb ─────────────────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-5">
            {/* Step Question */}
            <div className="border-l-4 border-emerald-500 pl-4 mb-6">
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Schritt 1 von 3</p>
              <h4 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Wo liegt Ihr Betrieb<br className="hidden sm:block" /> und was halten Sie?
              </h4>
              <p className="text-sm text-slate-400 mt-1">Der Fördersatz variiert stark je Bundesland und Tierhaltungsart.</p>
            </div>
            {showErrors && !canProceed[0] && (
              <div className="flex items-center gap-2 bg-red-950/60 border border-red-700/50 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" aria-hidden="true" />
                <p className="text-red-300 text-sm font-semibold">Bitte alle Pflichtfelder ausfüllen, um fortzufahren.</p>
              </div>
            )}
            <SelectField
              label="Bundesland"
              value={bundesland}
              onChange={(v) => { setBundesland(v as BundeslandKey | ""); setShowErrors(false) }}
              options={bundeslandOptions}
              placeholder="Bundesland wählen"
              hint="Der Fördersatz hängt stark vom Bundesland ab."
              error={showErrors && !bundesland}
            />
            <SelectField
              label="Hauptbetriebszweig / Tierhaltung"
              value={tierhaltung}
              onChange={(v) => { setTierhaltung(v as TierhaltungsartId | ""); setShowErrors(false) }}
              options={tierhaltungOptions}
              placeholder="Betriebszweig wählen"
              hint="Schweine haben in manchen BL Sonderregeln."
              error={showErrors && !tierhaltung}
            />
            <ToggleField
              label="Ökologischer Betrieb (Bio-Zertifizierung)"
              hint="Öko-Betriebe erhalten in Bayern, Thüringen & Sachsen einen Extra-Bonus."
              value={istOeko}
              onChange={setIstOeko}
            />
          </div>
        )}

        {/* ─── STEP 1: Vorhaben ────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Step Question */}
            <div className="border-l-4 border-emerald-500 pl-4 mb-6">
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Schritt 2 von 3</p>
              <h4 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Was möchten Sie bauen<br className="hidden sm:block" /> oder investieren?
              </h4>
              <p className="text-sm text-slate-400 mt-1">Wählen Sie die Investitionsart — sie bestimmt Ihren Fördersatz direkt.</p>
            </div>
            {showErrors && !canProceed[1] && (
              <div className="flex items-center gap-2 bg-red-950/60 border border-red-700/50 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" aria-hidden="true" />
                <p className="text-red-300 text-sm font-semibold">
                  {investitionsarten.length === 0 ? "Bitte mindestens eine Investitionsart wählen." : "Bitte ein Investitionsvolumen von mindestens 10.000 € eingeben."}
                </p>
              </div>
            )}
            {/* Selection counter badge */}
            {investitionsarten.length > 0 && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-full">
                  {investitionsarten.length} Vorhaben gewählt
                </span>
                <button
                  type="button"
                  onClick={() => setInvestitionsarten([])}
                  className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors"
                >
                  Auswahl leeren
                </button>
              </div>
            )}
            <div className={`grid grid-cols-1 gap-2 ${showErrors && investitionsarten.length === 0 ? "rounded-xl ring-2 ring-red-500/40 p-1 -m-1" : ""}`}>
              {INVESTITIONSARTEN.map((art) => {
                const isSelected = investitionsarten.includes(art.id)
                return (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => toggleInvestitionsart(art.id)}
                    className={`text-left p-4 rounded-xl border transition-all duration-150 touch-manipulation min-h-[72px] ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-900/30 shadow-lg shadow-emerald-900/20"
                        : showErrors && investitionsarten.length === 0
                        ? "border-red-700/60 bg-red-950/20 active:border-red-500 active:bg-red-950/30"
                        : "border-slate-700 bg-slate-800/50 active:border-slate-500 active:bg-slate-800"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox indicator */}
                      <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                        isSelected ? "border-emerald-500 bg-emerald-500" : "border-slate-600 bg-slate-800"
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" aria-hidden="true">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-emerald-600/30" : "bg-slate-700/50"
                      }`}>
                        <AgriCardIcon icon={art.icon} className={`w-5 h-5 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-sm font-semibold text-white leading-tight">{art.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${art.badgeColor}`}>
                            {art.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{art.desc}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            {showErrors && investitionsarten.length === 0 && (
              <p className="text-xs text-red-400 flex items-center gap-1 -mt-2">
                <AlertCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                Bitte mindestens eine Investitionsart auswählen.
              </p>
            )}
            <NumberField
              label="Geplantes Investitionsvolumen"
              value={investVolumen}
              onChange={(v) => { setInvestVolumen(v); setShowErrors(false) }}
              min={10_000}
              suffix="€"
              placeholder="z.B. 300000"
              hint="Netto ohne MwSt. Mind. 20.000 € (Kälbermatten: 10.000 €)."
              error={showErrors && Number(investVolumen) < 10_000}
            />
          </div>
        )}

        {/* ─── STEP 2: Person ──────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Step Question */}
            <div className="border-l-4 border-emerald-500 pl-4 mb-6">
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Schritt 3 von 3 — Fast geschafft!</p>
              <h4 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Wer ist der Betriebsleiter?
              </h4>
              <p className="text-sm text-slate-400 mt-1">Alter und Einkommen bestimmen Ihren Junglandwirt-Bonus und ob Sie die staatliche Einkommensgrenze einhalten.</p>
            </div>
            {showErrors && !canProceed[2] && (
              <div className="flex items-center gap-2 bg-red-950/60 border border-red-700/50 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" aria-hidden="true" />
                <p className="text-red-300 text-sm font-semibold">Bitte das Alter eingeben, um das Ergebnis zu berechnen.</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberField
                label="Alter des Betriebsleiters"
                value={alter}
                onChange={(v) => { setAlter(v); setShowErrors(false) }}
                min={18}
                max={99}
                suffix="Jahre"
                placeholder="z.B. 34"
                hint="Bis 40 Jahre: +10 % (max. 20.000 € extra)"
                error={showErrors && !alter}
              />
              <SelectField
                label="Familienstand"
                value={familienstand}
                onChange={(v) => setFamilienstand(v as "ledig" | "verheiratet")}
                options={famOptions}
                placeholder=""
                hint="Beeinflusst die Einkommensgrenze."
              />
            </div>
            <NumberField
              label="Persönliches Brutto-Einkommen (Ø letzte 3 Jahre)"
              value={einkommen}
              onChange={setEinkommen}
              min={0}
              suffix="€"
              placeholder="z.B. 120.000"
              hint="Ihr persönliches Jahres-Bruttoeinkommen lt. Steuerbescheid — Durchschnitt der letzten 3 Jahre. Nicht das Betriebs-Ergebnis. Leer lassen = wird nicht geprüft."
            />
            <ToggleField
              label="Meister / staatl. gepr. Betriebswirt (Landwirt)"
              hint="Bayern: +15 PP Bonus bei Tierwohl- und Kombi-Maßnahmen."
              value={hatMeister}
              onChange={setHatMeister}
            />
            <div className="flex items-start gap-2 bg-slate-800/50 rounded-lg p-3">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-slate-400">
                Die staatliche Einkommensgrenze variiert je Bundesland. Lass das Feld leer,
                wenn Sie sich unsicher sind — wir prüfen das im persönlichen Check.
              </p>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Ergebnis ────────────────────────────────────────────── */}
        {step === 3 && ergebnis && (
          <div className="space-y-3">

            {/* Schwein-Sperre */}
            {ergebnis.schweinSperre && (
              <div className="bg-amber-950/60 border border-amber-700/50 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-amber-300 font-bold text-sm">Schweinehaltung in BW derzeit gesperrt</p>
                  <p className="text-amber-400 text-xs mt-1">
                    Baden-Württemberg hat Schweine-Förderung ausgesetzt — Wiederaufnahme geplant ab Sept. 2026.
                    Sprich mich an, ich halte dich auf dem Laufenden.
                  </p>
                </div>
              </div>
            )}

            {/* Prosperitäts-Sperre */}
            {ergebnis.prosperitaetFail && !ergebnis.schweinSperre && (
              <div className="bg-red-950/60 border border-red-700/50 rounded-xl p-4 flex gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-red-300 font-bold text-sm">
                    Einkommensgrenze überschritten — aber es gibt Lösungen.
                  </p>
                  <p className="text-red-400 text-xs mt-1">
                    Ihr Einkommen ({Number(einkommen).toLocaleString("de-DE")} €) liegt über der
                    staatlichen Einkommensgrenze von {ergebnis.aktuelleGrenze?.toLocaleString("de-DE")} € in {bundesland}.
                    Wir zeigen Ihnen, wie Sie das strategisch lösen können.
                  </p>
                </div>
              </div>
            )}

            {/* Mindest-Warnung */}
            {ergebnis.zuWenig && !ergebnis.prosperitaetFail && (
              <div className="bg-amber-950/60 border border-amber-700/50 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-amber-300 font-bold text-sm">Investition unter Mindestgrenze</p>
                  <p className="text-amber-400 text-xs mt-1">
                    Mindestens {ergebnis.minInvest.toLocaleString("de-DE")} € erforderlich.
                  </p>
                </div>
              </div>
            )}

            {/* Cap-Hinweis */}
            {ergebnis.cappedByMax && (
              <div className="bg-blue-950/60 border border-blue-700/50 rounded-xl p-3 flex gap-3">
                <AlertTriangle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-blue-400 text-xs">
                  Ihre Investition wurde auf das Bundesland-Maximum von {ergebnis.maxInvest.toLocaleString("de-DE")} € begrenzt.
                  Nur dieser Teil wird gefördert. Restinvestition geht auf eigene Kosten.
                </p>
              </div>
            )}

            {/* Viehbesatz-Warnung (2,0 GV/ha Grenze) */}
            {ergebnis.viehbesatzWarnung && (
              <div className="bg-amber-950/60 border border-amber-700/50 rounded-xl p-3 flex gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-amber-300 font-bold text-xs">Viehbesatzgrenze — Prüfung empfohlen</p>
                  <p className="text-amber-400 text-xs mt-0.5">
                    Die meisten Bundesländer setzen max. 2,0 GV/ha selbstbewirtschafteter Fläche voraus.
                    Ihr Betrieb liegt darüber — im persönlichen Check klären wir die Auswirkung auf die Förderfähigkeit.
                  </p>
                </div>
              </div>
            )}

            {/* NRW Bestandsobergrenzen-Warnung */}
            {ergebnis.nrwBestandsWarnung && (
              <div className="bg-red-950/60 border border-red-700/50 rounded-xl p-3 flex gap-3">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-red-300 font-bold text-xs">NRW Bestandsgrenze erreicht</p>
                  <p className="text-red-400 text-xs mt-0.5">
                    In NRW gelten kumulative Obergrenzen: max. 15.000 Hennenplätze, 600 Rinderplätze,
                    1.500 Mastschweineplätze. Ihr Bestand liegt möglicherweise über dieser Grenze — dies
                    kann zum Ausschluss führen. Wir prüfen das im Detail.
                  </p>
                </div>
              </div>
            )}

            {/* Haupt-Ergebnis */}
            {!isBlocked && (
              <div className="bg-gradient-to-br from-emerald-900/70 to-slate-900 border-2 border-emerald-600/60 rounded-2xl overflow-hidden shadow-xl shadow-emerald-900/30">

                {/* ── GESPERRT: Blur-Gate ─────────────────────────────── */}
                {!resultUnlocked && (
                  <div className="relative">
                    {/* Blurred preview of numbers */}
                    <div className="p-5 select-none pointer-events-none" aria-hidden="true">
                      {/* Level-Bar — sichtbar als Teaser */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Förderlevel</span>
                          <span className="text-xs font-bold text-white blur-sm">{ergebnis.foerderLevel} %</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                            style={{ width: `${ergebnis.foerderLevel}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">
                        Ihr Zuschuss vom Staat:
                      </p>
                      {/* Blurred amount */}
                      <p className="text-4xl sm:text-5xl font-extrabold text-white leading-none mb-2 blur-md">
                        {ergebnis.zuschuss.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €
                      </p>
                      <p className="text-emerald-300 text-sm blur-sm mb-5">
                        = {ergebnis.gesamtSatz} % von {ergebnis.cappedInvest.toLocaleString("de-DE")} € Investition
                      </p>
                      {/* Blurred grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 blur-sm">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="bg-slate-800/60 rounded-lg p-3 text-center">
                            <p className="text-xs text-slate-400 mb-0.5">——</p>
                            <p className="text-base font-bold text-white">—— %</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Overlay CTA — darüber zentriert */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-[2px] px-6 py-8">
                      <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-900/50 relative">
                        <MoneyBagIcon className="w-9 h-9 text-white" />
                        {/* lock badge */}
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-900 border-2 border-emerald-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>
                      <h4 className="text-white font-extrabold text-xl text-center mb-2 leading-tight">
                        Ihr Ergebnis ist fertig!
                      </h4>
                      <p className="text-slate-300 text-sm text-center mb-6 max-w-xs leading-relaxed">
                        Tragen Sie sich kurz ein — dann sehen Sie sofort, wie viel Geld der Staat für Sie bereithält.
                      </p>
                      <button
                        onClick={() => setShowUnlockModal(true)}
                        className="relative overflow-hidden w-full max-w-xs bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 active:from-orange-700 active:to-orange-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-base touch-manipulation min-h-[52px] hg-btn"
                      >
                        <TractorIcon className="w-5 h-5 text-white flex-shrink-0" />
                        Ergebnis jetzt freischalten
                        <ChevronRight className="w-5 h-5" aria-hidden="true" />
                      </button>
                      <p className="text-slate-500 text-xs mt-3 text-center">
                        Kostenlos · Kein Spam · Nur Ihr Ergebnis
                      </p>
                    </div>
                  </div>
                )}

                {/* ── ENTSPERRT: Volles Ergebnis ──────────────────────── */}
                {resultUnlocked && (
                  <ConfettiOnMount triggerConfetti={triggerConfetti}>
                  <div className="p-5 sm:p-7">

                    {/* Zuschuss — gross & clean */}
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
                      Ihr staatlicher Zuschuss
                    </p>
                    <p className="text-5xl sm:text-6xl font-extrabold text-white leading-none mb-1 tabular-nums">
                      {ergebnis.zuschuss.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €
                    </p>
                    <p className="text-emerald-300/70 text-sm mb-6">
                      bei {ergebnis.cappedInvest.toLocaleString("de-DE")} € Investition
                    </p>

                    {/* Badges — nur wenn relevant */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {ergebnis.istJunglandwirt && (
                        <span className="inline-flex items-center gap-1.5 bg-amber-900/40 border border-amber-700/40 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                          <Award className="w-3.5 h-3.5" aria-hidden="true" />
                          Junglandwirt-Bonus aktiv (+10 %)
                        </span>
                      )}
                      {ergebnis.besonderheit && (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-900/30 border border-emerald-700/30 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                          <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
                          {ergebnis.besonderheit.split(".")[0]}
                        </span>
                      )}
                      {/* Zweckbindungsfrist-Badge */}
                      <span className="inline-flex items-center gap-1.5 bg-slate-700/60 border border-slate-600/50 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        Zweckbindung: {ergebnis.zweckbindungJahre} Jahre
                      </span>
                    </div>

                    {/* Nächster Schritt */}
                    <div className="bg-emerald-950/40 border border-emerald-700/30 rounded-xl px-4 py-3.5 mb-6">
                      <p className="text-emerald-300 text-sm font-bold mb-0.5">
                        Mehr als 87 % der Landwirte holen das nicht alleine raus.
                      </p>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Buchen Sie jetzt Ihren kostenlosen Termin ��� Patrick prüft Ihr Vorhaben und sorgt dafür, dass kein Fehler Ihren Antrag gefährdet.
                      </p>
                    </div>

                    {/* Kalender — Termin direkt buchen */}
                    <div className="border-t border-slate-700/60 pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 flex-shrink-0">
                          <img
                            src="/patrick-starkmann.webp"
                            alt="Patrick Starkmann"
                            className="w-full h-full object-cover object-top"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Kostenlosen Termin buchen</p>
                          <p className="text-xs text-slate-400">Patrick Starkmann · Spezialist für Subventionen in der Agrarwirtschaft</p>
                        </div>
                      </div>

                      <TidyCalEmbedRechner path="team/eskalator-ag/regional-investition" />
                    </div>
                  </div>
                  </ConfettiOnMount>
                )}
              </div>
            )}

            {/* Blocked CTA */}
            {isBlocked && (
              <button
                onClick={() => { onCTAClick?.(); setShowUnlockModal(true) }}
                className="w-full bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm shadow-lg shadow-emerald-900/30"
              >
                Optimierungsmöglichkeiten kostenlos besprechen
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}

            {/* Checkliste */}
            {!isBlocked && (
              <div className="bg-slate-800/40 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Basis-Voraussetzungen (Checkliste)
                </p>
                {[
                  "Landwirtschaftlicher KMU-Status nachweisbar",
                  "Betriebsleiter mit Fachausbildung (Landwirt / Meister / Agrar-Ing.)",
                  "Wir starten den Antrag jetzt — damit Sie so früh wie möglich loslegen dürfen",
                  "Vorhaben erhöht Tierwohl / Klima messbar über gesetzlichen Mindeststandard",
                  "Kein reiner Ersatz bestehender Anlage (Additionality-Nachweis)",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                    <span className="text-xs text-slate-400">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Placeholder */}
        {step === 3 && !ergebnis && (
          <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-8 text-center">
            <TrendingUp className="w-10 h-10 text-slate-600 mx-auto mb-3" aria-hidden="true" />
            <p className="text-slate-400 text-sm font-semibold">Angaben unvollständig</p>
            <p className="text-slate-500 text-xs mt-1">Gehe zurück und fülle alle Felder aus.</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 space-y-3">
          {step < 3 && (
            <button
              onClick={nextStep}
              className="relative overflow-hidden w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold rounded-xl text-base transition-all shadow-lg shadow-emerald-900/40 touch-manipulation min-h-[56px] flex items-center justify-center gap-2 hg-btn"
            >
              {step === 2 ? (
                <>
                  <TractorIcon className="w-5 h-5 text-white flex-shrink-0" />
                  Förderbetrag berechnen
                  <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Weiter
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}
          {step === 3 && (
            <button
              onClick={() => setStep(0)}
              className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 font-semibold rounded-xl text-sm transition-colors border border-slate-700 touch-manipulation min-h-[52px]"
            >
              Neu berechnen
            </button>
          )}
          {step > 0 && step < 3 && (
            <button
              onClick={prevStep}
              className="w-full py-3 px-4 text-slate-500 hover:text-slate-300 font-semibold text-sm transition-colors touch-manipulation min-h-[44px] flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Zurück zu Schritt {step}
            </button>
          )}
          {/* Progress hint */}
          {step < 3 && (
            <p className="text-center text-xs text-slate-600">
              {canProceed[step]
                ? "Alles ausgefüllt — Sie können fortfahren"
                : `Noch ${step === 0 ? (!bundesland && !tierhaltung ? "2 Felder" : "1 Feld") : step === 1 ? (investitionsarten.length === 0 ? "Investitionsart" : "Volumen") : "Alter"} ausfüllen`}
            </p>
          )}
        </div>
      </div>
    </div>

      {/* Unlock Modal — schlank: nur Name, Email, Mobil */}
      {showUnlockModal && (
        <RechnerUnlockModal
          isOpen={showUnlockModal}
          onClose={() => setShowUnlockModal(false)}
          onSuccess={() => {
            setShowUnlockModal(false)
            setResultUnlocked(true)
          }}
          prefilledData={{
            investment: Number(investVolumen) || undefined,
            investitionsart: primaryInvestitionsart || undefined,
            investitionsartLabel: primaryInvestitionsart
              ? INVESTITIONSARTEN.find((a) => a.id === primaryInvestitionsart)?.label
              : undefined,
            bundesland: bundesland || undefined,
            foerdersatz: ergebnis?.gesamtSatz ?? undefined,
            foerderbetrag: ergebnis?.zuschuss ?? undefined,
            istJunglandwirt: ergebnis?.istJunglandwirt ?? undefined,
            istOeko: istOeko || undefined,
          }}
        />
      )}
    </>
  )
}
