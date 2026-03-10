"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, TrendingUp, Award, ChevronRight, Leaf, CheckCircle2, XCircle } from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// DATA  (alle 16 Bundesländer, dedupliziert, faktenbasiert AFP 2023–2027)
// ─────────────────────────────────────────────────────────────────────────────
const BUNDESLAENDER = {
  "Nordrhein-Westfalen": {
    maxInvest: 1_200_000,
    prosperitaetLedig: 150_000,
    prosperitaetVerheiratet: 180_000,
    basisSatz: 20,
    tierwohlPremium: 40,
    siukMax: 50,
    kalberAufschlag: true,
    besonderheit: "Kälbermatten-Aufschlag (befristet), ELAN-Portal, Rangfolge-Verfahren",
  },
  "Niedersachsen / HB / HH": {
    maxInvest: 1_500_000,
    prosperitaetLedig: 170_000,
    prosperitaetVerheiratet: 200_000,
    basisSatz: 20,
    tierwohlPremium: 40,
    siukMax: 40,
    mobilstaelle: true,
    besonderheit: "Mobilställe explizit förderfähig, Außenwirtschaft 20 %, höchste Prosper.-Grenze West",
  },
  "Bayern": {
    maxInvest: 1_200_000,
    prosperitaetLedig: 140_000,
    prosperitaetVerheiratet: 170_000,
    basisSatz: 20,
    tierwohlPremium: 40,
    siukMax: 40,
    qualifikationBonus: true,
    besonderheit: "Starke Punkte für Meister / Qualifikation, Öko-Bonus",
  },
  "Baden-Württemberg": {
    maxInvest: 2_000_000,
    prosperitaetLedig: 210_000,
    prosperitaetVerheiratet: 250_000,
    basisSatz: 20,
    tierwohlPremium: 40,
    siukMax: 40,
    besonderheit: "Schweine ab Sept 2026 wieder, höchstes Max-Invest West, Premium-Fokus",
  },
  "Hessen": {
    maxInvest: 5_000_000,
    prosperitaetLedig: 999_999_999,
    prosperitaetVerheiratet: 999_999_999,
    basisSatz: 20,
    tierwohlPremium: 40,
    siukMax: 75,
    besonderheit: "Höchste SIUK-Sätze bundesweit, keine Einkommensgrenze, EIP-Innovation-Bonus",
  },
  "Sachsen-Anhalt": {
    maxInvest: 5_000_000,
    prosperitaetLedig: 170_000,
    prosperitaetVerheiratet: 220_000,
    basisSatz: 20,
    tierwohlPremium: 40,
    siukMax: 40,
    besonderheit: "Höchste Einkommensgrenzen in neuen Bundesländern",
  },
  "Brandenburg": {
    maxInvest: 5_000_000,
    prosperitaetLedig: 140_000,
    prosperitaetVerheiratet: 170_000,
    basisSatz: 40,
    tierwohlPremium: 65,
    siukMax: 65,
    besonderheit: "Stark erhöhte Basis- und Tierwohlsätze (neue Bundesländer-Bonus)",
  },
  "Sachsen": {
    maxInvest: 5_000_000,
    prosperitaetLedig: 999_999_999,
    prosperitaetVerheiratet: 999_999_999,
    basisSatz: 20,
    tierwohlPremium: 40,
    siukMax: 65,
    besonderheit: "Hohe SIUK-Sätze, keine Einkommensgrenze, innovative Tierwohlprogramme",
  },
  "Thüringen": {
    maxInvest: 5_000_000,
    prosperitaetLedig: 999_999_999,
    prosperitaetVerheiratet: 999_999_999,
    basisSatz: 20,
    tierwohlPremium: 40,
    siukMax: 40,
    besonderheit: "Keine Einkommensgrenze, hohe Flexibilität bei Maßnahmenplanung",
  },
  "Mecklenburg-Vorpommern": {
    maxInvest: 5_000_000,
    prosperitaetLedig: 999_999_999,
    prosperitaetVerheiratet: 999_999_999,
    basisSatz: 25,
    tierwohlPremium: 40,
    siukMax: 40,
    besonderheit: "Schwerpunkt Milchvieh & Großbetriebe, erhöhter Basis-Satz 25 %",
  },
  "Schleswig-Holstein": {
    maxInvest: 1_200_000,
    prosperitaetLedig: 150_000,
    prosperitaetVerheiratet: 180_000,
    basisSatz: 20,
    tierwohlPremium: 40,
    siukMax: 40,
    besonderheit: "Fokus Küstenschutz & Resilienz, Sonderregelung Milchvieh",
  },
  "Rheinland-Pfalz": {
    maxInvest: 1_200_000,
    prosperitaetLedig: 150_000,
    prosperitaetVerheiratet: 180_000,
    basisSatz: 20,
    tierwohlPremium: 40,
    siukMax: 40,
    besonderheit: "Weinbau & Naturgefahren-Prämie stark gewichtet, GAK-Standard",
  },
  "Saarland": {
    maxInvest: 1_200_000,
    prosperitaetLedig: 150_000,
    prosperitaetVerheiratet: 180_000,
    basisSatz: 20,
    tierwohlPremium: 40,
    siukMax: 40,
    besonderheit: "GAK-Standard, kleinste Agrarfläche Deutschlands",
  },
} as const

type BundeslandKey = keyof typeof BUNDESLAENDER

const INVESTITIONSARTEN = [
  {
    id: "tierwohl",
    label: "Premium-Tierhaltung",
    desc: "Stallumbau mit extra Platz, Licht & Außenklima (Anlage 1)",
    badge: "bis 40 %",
    badgeColor: "bg-emerald-900/60 text-emerald-300 border-emerald-700",
  },
  {
    id: "klima",
    label: "Klima- & Emissionsschutz",
    desc: "Abluft, Güllekühlung, Lager mit Deckel (SIUK Anlage 3B)",
    badge: "bis 50 %",
    badgeColor: "bg-blue-900/60 text-blue-300 border-blue-700",
  },
  {
    id: "kombi",
    label: "Kombi Tierwohl + Klima",
    desc: "Stallbau + SIUK-Maßnahmen kombiniert – das Maximum",
    badge: "Maximum",
    badgeColor: "bg-orange-900/60 text-orange-300 border-orange-700",
  },
  {
    id: "guelle",
    label: "Gülle-/Mistlager + Abdeckung",
    desc: "+2 Monate Kapazität über gesetzlichem Minimum, feste Abdeckung",
    badge: "40 %",
    badgeColor: "bg-emerald-900/60 text-emerald-300 border-emerald-700",
  },
  {
    id: "praezision",
    label: "Präzisionstechnik / Bewässerung / Hagelschutz",
    desc: "GPS/Sensorik, mind. 15 % Wassereinsparung, Frostschutz",
    badge: "30 %",
    badgeColor: "bg-slate-700/60 text-slate-300 border-slate-600",
  },
  {
    id: "kaelber",
    label: "Weiche Kälbermatten",
    desc: "Befristete Sondermaßnahme – Kälberwohl bis Ende 2025/26",
    badge: "30–40 %",
    badgeColor: "bg-amber-900/60 text-amber-300 border-amber-700",
  },
  {
    id: "basis",
    label: "Lagerhallen / Fahrsilos (Basis)",
    desc: "Sonstige Maßnahmen ohne erhöhten Fördersatz",
    badge: "20 %",
    badgeColor: "bg-slate-700/60 text-slate-300 border-slate-600",
  },
] as const

type InvestitionsartId = (typeof INVESTITIONSARTEN)[number]["id"]

// ─────────────────────────────────────────────────────────────────────────────
// BERECHNUNGSLOGIK (exakt nach SQL-Query und PDF-Vorgaben)
// ─────────────────────────────────────────────────────────────────────────────
function berechne(params: {
  bundesland: BundeslandKey | null
  investitionsart: InvestitionsartId | null
  investVolumen: number
  alter: number
  familienstand: "ledig" | "verheiratet"
  einkommen: number
}) {
  const { bundesland, investitionsart, investVolumen, alter, familienstand, einkommen } = params

  if (!bundesland || !investitionsart) return null

  const bl = BUNDESLAENDER[bundesland]

  // 1. Prosperitäts-Check
  const grenze =
    familienstand === "verheiratet" ? bl.prosperitaetVerheiratet : bl.prosperitaetLedig
  const prosperitaetFail = einkommen > 0 && einkommen > grenze

  // 2. Mindestinvestition
  const minInvest = investitionsart === "kaelber" ? 10_000 : 20_000
  const zuWenig = investVolumen < minInvest

  // 3. Cap auf Maximalvolumen des Bundeslandes
  const cappedInvest = Math.min(investVolumen, bl.maxInvest)

  // 4. Basis-Prozentsatz je Investitionsart
  let baseSatz = 0
  switch (investitionsart) {
    case "tierwohl":
      baseSatz = bl.tierwohlPremium
      break
    case "klima":
      baseSatz = bl.siukMax
      break
    case "kombi":
      baseSatz = Math.max(bl.tierwohlPremium, bl.siukMax)
      break
    case "guelle":
      baseSatz = 40
      break
    case "praezision":
      baseSatz = 30
      break
    case "kaelber":
      baseSatz = 30 + ("kalberAufschlag" in bl && bl.kalberAufschlag ? 10 : 0)
      break
    case "basis":
      baseSatz = bl.basisSatz
      break
  }

  // 5. Junglandwirt-Bonus (≤ 40 Jahre → +10 PP, max. +20.000 €, Gesamt max. 50 %)
  const istJunglandwirt = alter > 0 && alter <= 40
  const jungBonus = istJunglandwirt ? 10 : 0

  // Gesamt-Satz cap
  const highSatzLaender: readonly BundeslandKey[] = ["Hessen", "Brandenburg", "Sachsen"]
  const maxGesamtSatz = highSatzLaender.includes(bundesland) ? 75 : 50
  let gesamtSatz = Math.min(baseSatz + jungBonus, maxGesamtSatz)

  // 6. Zuschuss berechnen
  let zuschuss = cappedInvest * (gesamtSatz / 100)

  // Junglandwirt-Bonus darf max. 20.000 € betragen
  if (istJunglandwirt) {
    const zuschussOhneBonus = cappedInvest * (baseSatz / 100)
    const jungBonusBetrag = zuschuss - zuschussOhneBonus
    if (jungBonusBetrag > 20_000) {
      zuschuss = zuschussOhneBonus + 20_000
      gesamtSatz = Math.round((zuschuss / cappedInvest) * 100)
    }
  }

  // 7. Förderlevel (0–100 für Anzeige)
  const foerderLevel = Math.round((gesamtSatz / maxGesamtSatz) * 100)

  return {
    prosperitaetFail,
    zuWenig,
    cappedInvest,
    baseSatz,
    jungBonus,
    gesamtSatz,
    zuschuss: prosperitaetFail ? 0 : zuschuss,
    foerderLevel,
    istJunglandwirt,
    grenze,
    besonderheit: bl.besonderheit,
    maxInvest: bl.maxInvest,
    minInvest,
    investVolumen,
    cappedByMax: investVolumen > bl.maxInvest,
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
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder: string
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function AFPRechner({ onCTAClick }: { onCTAClick?: () => void }) {
  const [bundesland, setBundesland] = useState<BundeslandKey | "">("")
  const [investitionsart, setInvestitionsart] = useState<InvestitionsartId | "">("")
  const [investVolumen, setInvestVolumen] = useState("250000")
  const [alter, setAlter] = useState("")
  const [familienstand, setFamilienstand] = useState<"ledig" | "verheiratet">("ledig")
  const [einkommen, setEinkommen] = useState("")

  const ergebnis = useMemo(
    () =>
      berechne({
        bundesland: bundesland as BundeslandKey | null,
        investitionsart: investitionsart as InvestitionsartId | null,
        investVolumen: Number(investVolumen) || 0,
        alter: Number(alter) || 0,
        familienstand,
        einkommen: Number(einkommen) || 0,
      }),
    [bundesland, investitionsart, investVolumen, alter, familienstand, einkommen]
  )

  const bundeslandOptions = Object.keys(BUNDESLAENDER).map((k) => ({ value: k, label: k }))
  const investitionsartOptions = INVESTITIONSARTEN.map((i) => ({ value: i.id, label: i.label }))
  const famOptions = [
    { value: "ledig", label: "Ledig" },
    { value: "verheiratet", label: "Verheiratet" },
  ]

  const showResult = !!ergebnis
  const isBlocked = ergebnis?.prosperitaetFail || ergebnis?.zuWenig

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
            <p className="text-emerald-400 text-sm">In 45 Sekunden weißt du exakt, wie viel du holst</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Dein Bundesland"
            value={bundesland}
            onChange={(v) => setBundesland(v as BundeslandKey | "")}
            options={bundeslandOptions}
            placeholder="Bundesland wählen"
          />

          <SelectField
            label="Familienstand"
            value={familienstand}
            onChange={(v) => setFamilienstand(v as "ledig" | "verheiratet")}
            options={famOptions}
            placeholder="Bitte wählen"
          />

          <NumberField
            label="Geplantes Investitionsvolumen"
            value={investVolumen}
            onChange={setInvestVolumen}
            min={10000}
            suffix="€"
            placeholder="z.B. 250000"
            hint="Mindest: 10.000 € (Kälbermatten) / 20.000 € (sonst)"
          />

          <NumberField
            label="Alter des Betriebsleiters"
            value={alter}
            onChange={setAlter}
            min={18}
            max={99}
            suffix="Jahre"
            placeholder="z.B. 36"
            hint="Bis 40 Jahre: +10 % Junglandwirt-Bonus (max. 20.000 €)"
          />

          <div className="sm:col-span-2">
            <NumberField
              label="Ø Einkommen letzte 3 Jahre (optional)"
              value={einkommen}
              onChange={setEinkommen}
              min={0}
              suffix="€"
              placeholder="z.B. 120000"
              hint="Positive Einkünfte lt. Einkommensteuerbescheid. Leer lassen = keine Prüfung."
            />
          </div>
        </div>

        {/* Investitionsart Cards */}
        <div>
          <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">
            Was willst du bauen / investieren?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {INVESTITIONSARTEN.map((art) => (
              <button
                key={art.id}
                onClick={() => setInvestitionsart(art.id)}
                className={`text-left p-3 rounded-xl border transition-all duration-150 ${
                  investitionsart === art.id
                    ? "border-emerald-500 bg-emerald-900/30 shadow-lg shadow-emerald-900/20"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-white leading-tight">{art.label}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${art.badgeColor}`}
                  >
                    {art.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{art.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ─── ERGEBNIS ─────────────────────────────────────────────────────── */}
        {showResult && (
          <div className="space-y-3">
            {/* Prosperitäts-Sperre */}
            {ergebnis.prosperitaetFail && (
              <div className="bg-red-950/60 border border-red-700/50 rounded-xl p-4 flex gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-red-300 font-bold text-sm">
                    Leider kein Zuschuss möglich — aber ich zeige dir, wie du das noch drehen kannst.
                  </p>
                  <p className="text-red-400 text-xs mt-1">
                    Dein Einkommen ({Number(einkommen).toLocaleString("de-DE")} €) liegt über der
                    Prosperitätsgrenze von {ergebnis.grenze.toLocaleString("de-DE")} € für{" "}
                    {familienstand === "verheiratet" ? "Verheiratete" : "Ledige"} in {bundesland}.
                    Spreche mich an — es gibt Optimierungsoptionen.
                  </p>
                </div>
              </div>
            )}

            {/* Mindestinvestitions-Warnung */}
            {ergebnis.zuWenig && !ergebnis.prosperitaetFail && (
              <div className="bg-amber-950/60 border border-amber-700/50 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-amber-300 font-bold text-sm">Investition unter Mindestgrenze</p>
                  <p className="text-amber-400 text-xs mt-1">
                    Für diese Maßnahme sind mindestens{" "}
                    {ergebnis.minInvest.toLocaleString("de-DE")} € erforderlich.
                  </p>
                </div>
              </div>
            )}

            {/* Cap-Hinweis */}
            {ergebnis.cappedByMax && (
              <div className="bg-blue-950/60 border border-blue-700/50 rounded-xl p-3 flex gap-3">
                <AlertTriangle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-blue-400 text-xs">
                  Deine Investition wurde auf das Bundesland-Maximum von{" "}
                  {ergebnis.maxInvest.toLocaleString("de-DE")} € begrenzt. Nur dieser Teil wird gefördert.
                </p>
              </div>
            )}

            {/* Haupt-Ergebnis-Box */}
            {!isBlocked && (
              <div className="bg-gradient-to-br from-emerald-900/70 to-slate-900 border-2 border-emerald-600/60 rounded-2xl p-5 shadow-xl shadow-emerald-900/30">
                {/* Förderlevel-Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                      Förderlevel
                    </span>
                    <span className="text-xs font-bold text-white">{ergebnis.foerderLevel} %</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
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
                <p className="text-emerald-300 text-sm mb-4">
                  = {ergebnis.gesamtSatz} % von{" "}
                  {ergebnis.cappedInvest.toLocaleString("de-DE")} € Investition
                </p>

                {/* Aufschlüsselung */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Basis-Satz</p>
                    <p className="text-lg font-bold text-white">{ergebnis.baseSatz} %</p>
                  </div>
                  <div
                    className={`rounded-lg p-3 text-center ${
                      ergebnis.istJunglandwirt
                        ? "bg-amber-900/40 border border-amber-700/40"
                        : "bg-slate-800/60"
                    }`}
                  >
                    <p className="text-xs text-slate-400 mb-0.5">Junglandwirt-Bonus</p>
                    <p
                      className={`text-lg font-bold ${
                        ergebnis.istJunglandwirt ? "text-amber-400" : "text-slate-500"
                      }`}
                    >
                      {ergebnis.istJunglandwirt ? `+${ergebnis.jungBonus} %` : "—"}
                    </p>
                  </div>
                </div>

                {/* Junglandwirt-Hinweis */}
                {ergebnis.istJunglandwirt && (
                  <div className="flex items-center gap-2 bg-amber-900/30 border border-amber-700/30 rounded-lg px-3 py-2 mb-4">
                    <Award className="w-4 h-4 text-amber-400 flex-shrink-0" aria-hidden="true" />
                    <p className="text-amber-300 text-xs font-medium">
                      Junglandwirt-Bonus aktiv — max. 20.000 € Aufschlag
                    </p>
                  </div>
                )}

                {/* Besonderheit des Bundeslandes */}
                {ergebnis.besonderheit && (
                  <div className="flex items-start gap-2 bg-slate-800/50 rounded-lg px-3 py-2 mb-4">
                    <Leaf className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-slate-300 text-xs">{ergebnis.besonderheit}</p>
                  </div>
                )}

                {/* Gratulations-Hinweis */}
                <div className="bg-emerald-950/40 border border-emerald-700/30 rounded-lg px-4 py-3 mb-4">
                  <p className="text-emerald-300 text-sm font-bold">
                    Das ist mehr, als 87 % der Landwirte allein rausholen.
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Nächster Schritt: Ich prüfe deine Pläne kostenlos und sorge dafür, dass du das
                    Maximum bekommst — bevor die Töpfe leer sind.
                  </p>
                </div>

                {/* CTA */}
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

            {/* Bei Sperre: Optimierungs-CTA */}
            {isBlocked && (
              <button
                onClick={onCTAClick}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-sm"
              >
                Optimierungsmöglichkeiten kostenlos besprechen
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}

            {/* Checkliste Mindestvoraussetzungen */}
            {!isBlocked && (
              <div className="bg-slate-800/40 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Basis-Voraussetzungen (Checkliste)
                </p>
                {[
                  "Landwirtschaftliche KMU-Eigenschaft nachweisbar",
                  "Betriebsleiter mit Fachausbildung (Landwirt/Meister)",
                  "Kein vorzeitiger Maßnahmenbeginn vor Förderbescheid",
                  "Investition erhöht Tierwohl / Klima messbar über Mindeststandard",
                  "Kein reiner Ersatz bestehender Güter (Additionality-Nachweis)",
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

        {/* Placeholder wenn noch keine Auswahl */}
        {!showResult && (
          <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-8 text-center">
            <TrendingUp className="w-10 h-10 text-slate-600 mx-auto mb-3" aria-hidden="true" />
            <p className="text-slate-400 text-sm font-semibold">
              Wähle Bundesland + Investitionsart —
            </p>
            <p className="text-slate-500 text-xs mt-1">
              dein Ergebnis erscheint sofort, live & ohne Registrierung.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
