"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, TrendingUp, Award, ChevronRight, Leaf, CheckCircle2, XCircle, Info } from "lucide-react"

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
    besonderheit: "Höchste SIUK-Sätze bundesweit (75 %). Keine Einkommensgrenze für KMU. Nicht-produktive Investitionen sehr hoch gefördert.",
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
    besonderheit: "Sehr hohe Sätze: Basis schon 40 %, Tierwohl & SIUK bis 65 %. Inkl. Berlin-Betriebe.",
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
    besonderheit: "SIUK bis 65 %. Keine Einkommensgrenze. GV/ha-Grenze < 2,0 beachten.",
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
    maxInvest: 5_000_000,
    prosperitaetLedig: null,
    prosperitaetVerheiratet: null,
    basisSatz: 20,
    tierwohlMax: 40,
    siukMax: 40,
    kombiMax: 40,
    jungBonus: 10,
    besonderheit: "1–5 Mio. Max-Invest variabel. Mobilställe & SIUK stark.",
  },
  "Rheinland-Pfalz": {
    maxInvest: null,   // k.A., mind. 50.000 €
    minInvestSpecial: 50_000,
    prosperitaetLedig: 200_000,
    prosperitaetVerheiratet: 200_000,
    basisSatz: 20,
    tierwohlMax: 40,
    siukMax: 40,
    kombiMax: 40,
    jungBonus: 10,
    besonderheit: "Mind. 50.000 € Invest. Max-Invest k.A. Diversifizierung stark gewichtet.",
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
  },
  {
    id: "siuk",
    label: "Klima- & Emissionsschutz SIUK (Anlage 3B)",
    desc: "Abluft, Güllekühlung, Biogasanlage, Lager mit fester Abdeckung",
    badge: "bis 75 %",
    badgeColor: "bg-blue-900/60 text-blue-300 border-blue-700",
  },
  {
    id: "kombi",
    label: "Kombination Tierwohl + SIUK",
    desc: "Stallbau + Emissionsschutz kombiniert — holt den maximalen Gesamtsatz",
    badge: "Maximum",
    badgeColor: "bg-orange-900/60 text-orange-300 border-orange-700",
  },
  {
    id: "guelle",
    label: "Gülle-/Mistlager + Abdeckung",
    desc: "+2 Monate Kapazität über gesetzl. Minimum, feste Abdeckung Pflicht",
    badge: "40 %",
    badgeColor: "bg-emerald-900/60 text-emerald-300 border-emerald-700",
  },
  {
    id: "kaelber",
    label: "Weiche Kälbermatten (NRW befristet)",
    desc: "Liege- & Tränkebereiche für Kälber unter 8 Monate — NRW +10 % Aufschlag",
    badge: "30–40 %",
    badgeColor: "bg-amber-900/60 text-amber-300 border-amber-700",
  },
  {
    id: "praezision",
    label: "Präzisionstechnik / Bewässerung / Hagelschutz",
    desc: "GPS/Sensorik mind. 15 % Wassereinsparung, Hagelschutznetze, Frostschutz",
    badge: "30 %",
    badgeColor: "bg-slate-700/60 text-slate-300 border-slate-600",
  },
  {
    id: "basis",
    label: "Lagerhalle / Fahrsilo / Sonstiges",
    desc: "Maßnahmen ohne erhöhten Tierwohl- oder SIUK-Anteil",
    badge: "20–25 %",
    badgeColor: "bg-slate-700/60 text-slate-300 border-slate-600",
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
}) {
  const { bundesland, investitionsart, tierhaltung, investVolumen, alter, familienstand, einkommen, istOeko, hatMeister } = params

  if (!bundesland || !investitionsart) return null

  const bl = BUNDESLAENDER[bundesland]

  // 1. Prosperitäts-Check (null = keine Grenze)
  const grenzeLedig = bl.prosperitaetLedig
  const grenzeVerh = bl.prosperitaetVerheiratet
  const aktuelleGrenze = familienstand === "verheiratet" ? grenzeVerh : grenzeLedig
  const prosperitaetFail =
    aktuelleGrenze !== null && einkommen > 0 && einkommen > aktuelleGrenze

  // 2. Mindestinvestition
  const minInvest = investitionsart === "kaelber" ? 10_000 : 20_000
  const zuWenig = investVolumen > 0 && investVolumen < minInvest

  // 3. Cap auf Maximalvolumen
  const maxInvest = bl.maxInvest ?? 5_000_000
  const cappedInvest = Math.min(investVolumen, maxInvest)
  const cappedByMax = investVolumen > maxInvest

  // 4. Schweine-Sperre prüfen (BW bis Sept 2026 gesperrt)
  const schweinSperre =
    tierhaltung === "schwein" &&
    bundesland === "Baden-Württemberg"

  // 5. Basis-Fördersatz je Investitionsart
  let baseSatz = 0
  switch (investitionsart) {
    case "tierwohl":
      baseSatz = bl.tierwohlMax
      break
    case "siuk":
      baseSatz = bl.siukMax
      break
    case "kombi":
      baseSatz = bl.kombiMax
      break
    case "guelle":
      baseSatz = 40
      break
    case "kaelber":
      baseSatz = 30 + ("kalberAufschlag" in bl && bl.kalberAufschlag ? 10 : 0)
      break
    case "praezision":
      baseSatz = 30
      break
    case "basis":
      baseSatz = bl.basisSatz
      break
  }

  // 6. Bayern Tierwohl-Sonderfall: Meister bringt +15 PP
  let qualBonus = 0
  if (bundesland === "Bayern" && hatMeister && (investitionsart === "tierwohl" || investitionsart === "kombi")) {
    qualBonus = 15
  }

  // 7. Öko-Bonus (Thüringen, Bayern, Sachsen)
  let oekoBonus = 0
  if (istOeko && ["Bayern", "Thüringen", "Sachsen"].includes(bundesland)) {
    oekoBonus = 5
  }

  // 8. Junglandwirt-Bonus
  const istJunglandwirt = alter > 0 && alter <= 40
  const jungBonusPP = istJunglandwirt ? 10 : 0

  // 9. Gesamtsatz (cap auf bundeslandspez. kombiMax oder siukMax)
  const hardCap = Math.max(bl.kombiMax, bl.siukMax) + 10 // +10 für Junglandwirt
  let gesamtSatz = Math.min(baseSatz + qualBonus + oekoBonus + jungBonusPP, hardCap)

  // 10. Zuschuss berechnen
  let zuschuss = cappedInvest * (gesamtSatz / 100)

  // Junglandwirt-Bonus darf max. 20.000 € betragen
  if (istJunglandwirt) {
    const zuschussOhneJung = cappedInvest * ((baseSatz + qualBonus + oekoBonus) / 100)
    const jungBonusBetrag = zuschuss - zuschussOhneJung
    if (jungBonusBetrag > 20_000) {
      zuschuss = zuschussOhneJung + 20_000
      gesamtSatz = Math.round((zuschuss / cappedInvest) * 100)
    }
  }

  // 11. Förderlevel für Anzeige (relativ zum max möglichen des BL)
  const maxMoeglich = hardCap
  const foerderLevel = Math.min(Math.round((gesamtSatz / maxMoeglich) * 100), 100)

  return {
    prosperitaetFail,
    aktuelleGrenze,
    zuWenig,
    schweinSperre,
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
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-300 uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
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
}: {
  label: string
  value: string
  onChange: (v: string) => void
  min?: number
  max?: number
  suffix?: string
  placeholder?: string
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-300 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          placeholder={placeholder}
          className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all pr-16"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
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
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-6 bg-slate-700 rounded-full peer peer-checked:bg-emerald-600 transition-colors" />
        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
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
const STEPS = ["Betrieb", "Vorhaben", "Person", "Ergebnis"]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between px-2 mb-6">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-1 flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < current
                  ? "bg-emerald-600 text-white"
                  : i === current
                  ? "bg-emerald-500 text-white ring-2 ring-emerald-400/40"
                  : "bg-slate-700 text-slate-500"
              }`}
            >
              {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === current ? "text-emerald-400 font-semibold" : "text-slate-500"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${i < current ? "bg-emerald-600" : "bg-slate-700"}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function AFPRechner({ onCTAClick }: { onCTAClick?: () => void }) {
  const [step, setStep] = useState(0)

  // Step 0 — Betrieb
  const [bundesland, setBundesland] = useState<BundeslandKey | "">("")
  const [tierhaltung, setTierhaltung] = useState<TierhaltungsartId | "">("")
  const [istOeko, setIstOeko] = useState(false)

  // Step 1 — Vorhaben
  const [investitionsart, setInvestitionsart] = useState<InvestitionsartId | "">("")
  const [investVolumen, setInvestVolumen] = useState("")

  // Step 2 — Person
  const [alter, setAlter] = useState("")
  const [familienstand, setFamilienstand] = useState<"ledig" | "verheiratet">("ledig")
  const [einkommen, setEinkommen] = useState("")
  const [hatMeister, setHatMeister] = useState(false)

  const ergebnis = useMemo(
    () =>
      berechne({
        bundesland: bundesland as BundeslandKey | null,
        investitionsart: investitionsart as InvestitionsartId | null,
        tierhaltung: tierhaltung as TierhaltungsartId | null,
        investVolumen: Number(investVolumen) || 0,
        alter: Number(alter) || 0,
        familienstand,
        einkommen: Number(einkommen) || 0,
        istOeko,
        hatMeister,
      }),
    [bundesland, investitionsart, tierhaltung, investVolumen, alter, familienstand, einkommen, istOeko, hatMeister]
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
    !!investitionsart && Number(investVolumen) >= 10_000,
    !!alter,
  ]

  const isBlocked = ergebnis && (ergebnis.prosperitaetFail || ergebnis.zuWenig || ergebnis.schweinSperre)

  function nextStep() {
    if (step < 3) setStep(step + 1)
  }
  function prevStep() {
    if (step > 0) setStep(step - 1)
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-slate-900 border-b border-slate-700 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">AFP-Förderrechner 2026</h3>
            <p className="text-emerald-400 text-sm">In 3 Schritten zu deinem exakten Förderbetrag</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <StepIndicator current={step} />

        {/* ─── STEP 0: Betrieb ─────────────────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-4">
            <p className="text-slate-400 text-sm mb-4">
              Wo liegt dein Betrieb und was hältst du?
            </p>
            <SelectField
              label="Bundesland"
              value={bundesland}
              onChange={(v) => setBundesland(v as BundeslandKey | "")}
              options={bundeslandOptions}
              placeholder="Bundesland wählen"
              hint="Der Fördersatz hängt stark vom Bundesland ab."
            />
            <SelectField
              label="Hauptbetriebszweig / Tierhaltung"
              value={tierhaltung}
              onChange={(v) => setTierhaltung(v as TierhaltungsartId | "")}
              options={tierhaltungOptions}
              placeholder="Betriebszweig wählen"
              hint="Schweine haben in manchen BL Sonderregeln."
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
          <div className="space-y-4">
            <p className="text-slate-400 text-sm mb-2">
              Was willst du bauen oder investieren?
            </p>
            <div className="grid grid-cols-1 gap-2">
              {INVESTITIONSARTEN.map((art) => (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => setInvestitionsart(art.id)}
                  className={`text-left p-3 rounded-xl border transition-all duration-150 ${
                    investitionsart === art.id
                      ? "border-emerald-500 bg-emerald-900/30 shadow-lg shadow-emerald-900/20"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-white leading-tight">{art.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${art.badgeColor}`}>
                      {art.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{art.desc}</p>
                </button>
              ))}
            </div>
            <NumberField
              label="Geplantes Investitionsvolumen"
              value={investVolumen}
              onChange={setInvestVolumen}
              min={10_000}
              suffix="€"
              placeholder="z.B. 300000"
              hint="Netto ohne MwSt. Mind. 20.000 € (Kälbermatten: 10.000 €)."
            />
          </div>
        )}

        {/* ─── STEP 2: Person ──────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-slate-400 text-sm mb-2">
              Wer ist der Betriebsleiter? Das bestimmt deine Boni.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <NumberField
                label="Alter des Betriebsleiters"
                value={alter}
                onChange={setAlter}
                min={18}
                max={99}
                suffix="Jahre"
                placeholder="z.B. 34"
                hint="Bis 40 Jahre: +10 % (max. 20.000 € extra)"
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
              label="Ø Einkommen letzte 3 Jahre"
              value={einkommen}
              onChange={setEinkommen}
              min={0}
              suffix="€"
              placeholder="z.B. 120000"
              hint="Positive Einkünfte lt. ESt-Bescheid. Leer lassen = wird nicht geprüft."
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
                Einkommensgrenze (Prosperitätsgrenze) variiert je Bundesland. Lass das Feld leer,
                wenn du dir unsicher bist — ich prüfe das im persönlichen Check.
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
                    Dein Einkommen ({Number(einkommen).toLocaleString("de-DE")} €) liegt über der
                    Prosperitätsgrenze von {ergebnis.aktuelleGrenze?.toLocaleString("de-DE")} € in {bundesland}.
                    Ich zeige dir, wie du das strategisch lösen kannst.
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
                  Deine Investition wurde auf das Bundesland-Maximum von {ergebnis.maxInvest.toLocaleString("de-DE")} € begrenzt.
                  Nur dieser Teil wird gefördert. Restinvestition geht auf eigene Kosten.
                </p>
              </div>
            )}

            {/* Haupt-Ergebnis */}
            {!isBlocked && (
              <div className="bg-gradient-to-br from-emerald-900/70 to-slate-900 border-2 border-emerald-600/60 rounded-2xl p-5 shadow-xl shadow-emerald-900/30">
                {/* Level-Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Förderlevel</span>
                    <span className="text-xs font-bold text-white">{ergebnis.foerderLevel} %</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${ergebnis.foerderLevel}%` }}
                    />
                  </div>
                </div>

                <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">
                  Dein Zuschuss vom Staat:
                </p>
                <p className="text-4xl sm:text-5xl font-extrabold text-white leading-none mb-2">
                  {ergebnis.zuschuss.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €
                </p>
                <p className="text-emerald-300 text-sm mb-5">
                  = {ergebnis.gesamtSatz} % von {ergebnis.cappedInvest.toLocaleString("de-DE")} € Investition
                </p>

                {/* Aufschlüsselung */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Basis</p>
                    <p className="text-base font-bold text-white">{ergebnis.baseSatz} %</p>
                  </div>
                  {ergebnis.qualBonus > 0 && (
                    <div className="bg-blue-900/40 border border-blue-700/40 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-400 mb-0.5">Meister-Bonus</p>
                      <p className="text-base font-bold text-blue-400">+{ergebnis.qualBonus} %</p>
                    </div>
                  )}
                  {ergebnis.oekoBonus > 0 && (
                    <div className="bg-green-900/40 border border-green-700/40 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-400 mb-0.5">Öko-Bonus</p>
                      <p className="text-base font-bold text-green-400">+{ergebnis.oekoBonus} %</p>
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 text-center ${
                      ergebnis.istJunglandwirt
                        ? "bg-amber-900/40 border border-amber-700/40"
                        : "bg-slate-800/60"
                    }`}
                  >
                    <p className="text-xs text-slate-400 mb-0.5">Junglandwirt</p>
                    <p className={`text-base font-bold ${ergebnis.istJunglandwirt ? "text-amber-400" : "text-slate-500"}`}>
                      {ergebnis.istJunglandwirt ? `+${ergebnis.jungBonusPP} %` : "—"}
                    </p>
                  </div>
                </div>

                {/* Besonderheit */}
                {ergebnis.besonderheit && (
                  <div className="flex items-start gap-2 bg-slate-800/50 rounded-lg px-3 py-2 mb-4">
                    <Leaf className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-slate-300 text-xs">{ergebnis.besonderheit}</p>
                  </div>
                )}

                {/* Junglandwirt Badge */}
                {ergebnis.istJunglandwirt && (
                  <div className="flex items-center gap-2 bg-amber-900/30 border border-amber-700/30 rounded-lg px-3 py-2 mb-4">
                    <Award className="w-4 h-4 text-amber-400 flex-shrink-0" aria-hidden="true" />
                    <p className="text-amber-300 text-xs font-medium">
                      Junglandwirt-Bonus aktiv — max. 20.000 € Aufschlag auf Basis-Zuschuss
                    </p>
                  </div>
                )}

                <div className="bg-emerald-950/40 border border-emerald-700/30 rounded-lg px-4 py-3 mb-4">
                  <p className="text-emerald-300 text-sm font-bold">
                    Das ist mehr, als 87 % der Landwirte allein rausholen.
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Nächster Schritt: Ich prüfe deine Unterlagen kostenlos — und sorge dafür,
                    dass kein Fehler deinen Antrag killt.
                  </p>
                </div>

                <button
                  onClick={onCTAClick}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-orange-900/40 hover:-translate-y-0.5 text-sm"
                >
                  JETZT PERSÖNLICHEN MAXIMAL-CHECK SICHERN (kostenlos)
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <p className="text-center text-xs text-slate-500 mt-2">
                  Kostenlos · Unverbindlich · Nur für Vorhaben ab 20.000 €
                </p>
              </div>
            )}

            {/* Blocked CTA */}
            {isBlocked && (
              <button
                onClick={onCTAClick}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm"
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
                  "Kein vorzeitiger Maßnahmenbeginn vor Bewilligungsbescheid",
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
        <div className="flex gap-3 mt-6">
          {step > 0 && step < 3 && (
            <button
              onClick={prevStep}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors border border-slate-700"
            >
              Zurück
            </button>
          )}
          {step === 3 && (
            <button
              onClick={() => setStep(0)}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors border border-slate-700"
            >
              Neu berechnen
            </button>
          )}
          {step < 3 && (
            <button
              onClick={nextStep}
              disabled={!canProceed[step]}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/30"
            >
              {step === 2 ? "Ergebnis anzeigen" : "Weiter"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
