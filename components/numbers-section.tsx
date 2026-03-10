"use client"

import { useState, useEffect, useRef } from "react"
import { GlassCard } from "./glass-card"
import { Badge } from "@/components/ui/badge"
import {
  Info,
  Calculator,
  Users,
  Clock,
  Briefcase,
  Building2,
  Phone,
  ArrowRight,
  Check,
  X,
  Calendar,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { ContactFormModal } from "./contact-form-modal"

// ... existing icons ...

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      <path d="M12 5a7 7 0 017 7 7 7 0 01-7 7 7 7 0 01-7-7 7 7 0 017-7" />
    </svg>
  )
}

function FactoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 20h20M4 20V10l6-4v4l6-4v14M20 20V8l-4 2.5" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01M16 17h.01" />
    </svg>
  )
}

const fundingDetails = [
  {
    category: "Bemessungsgrundlage",
    value: "12 Mio. €",
    description: "Max. förderfähige F&E-Aufwendungen/Jahr",
    change: "+2 Mio. €",
    nutzen: "Mehr Spielraum für große Projekte",
    highlight: true,
    icon: Building2,
  },
  {
    category: "Eigenleistung GF",
    value: "100 €/h",
    description: "Pauschale für GF & Gesellschafter",
    change: "+30 €",
    nutzen: "43% mehr für Ihre Zeit",
    highlight: true,
    icon: Briefcase,
  },
  {
    category: "KMU-Quote",
    value: "35%",
    description: "Erhöhte Quote für KMU",
    change: "+10%",
    nutzen: "35 Cent pro F&E-Euro",
    highlight: true,
    icon: Calculator,
  },
  {
    category: "Gemeinkosten",
    value: "20%",
    description: "Pauschale ohne Nachweis",
    change: "Neu 2026",
    nutzen: "Automatisch obendrauf",
    highlight: false,
    icon: GearIcon,
  },
  {
    category: "Rückwirkend",
    value: "bis 2022",
    description: "4 Jahre alte Projekte nachholen",
    change: "Jetzt!",
    nutzen: "Bis zu 4 Jahre Förderung",
    highlight: false,
    icon: Clock,
  },
  {
    category: "Auftragsforschung",
    value: "70%",
    description: "Des Auftragswerts anrechenbar",
    change: null,
    nutzen: "Externe F&E förderfähig",
    highlight: false,
    icon: Users,
  },
]

function AnimatedNumber({
  value,
  duration = 1500,
  prefix = "",
  suffix = "",
}: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setDisplayValue(Math.floor(progress * value))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {displayValue.toLocaleString("de-DE")}
      {suffix}
    </span>
  )
}

function InteractiveCalculator() {
  const [employees, setEmployees] = useState(5)
  const [hoursPerEmployee, setHoursPerEmployee] = useState(1200)
  const [avgSalary, setAvgSalary] = useState(65000)
  const [isGesellschafter, setIsGesellschafter] = useState(true)
  const [gfHours, setGfHours] = useState(400)
  const [isKmu, setIsKmu] = useState(true)
  const [hasAuftragsforschung, setHasAuftragsforschung] = useState(false)
  const [auftragsforschungValue, setAuftragsforschungValue] = useState(100000)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedYears, setSelectedYears] = useState<number[]>([2024, 2025, 2026])

  // Calculate base costs (same for all years)
  const personalKosten = employees * avgSalary * 1.3 * (hoursPerEmployee / 1700)
  const eigenleistungGf = isGesellschafter ? gfHours * 100 : 0
  const auftragsforschung = hasAuftragsforschung ? auftragsforschungValue * 0.7 : 0
  const summeVorGemeinkosten = personalKosten + eigenleistungGf + auftragsforschung
  const gemeinkosten = summeVorGemeinkosten * 0.2
  const bemessungsgrundlage = Math.min(summeVorGemeinkosten + gemeinkosten, 12000000)

  // 2022-2023: 25% for all, April 2024+: 35% for KMU, 25% for non-KMU
  const calculateYearlyFunding = (year: number): { rate: number; amount: number } => {
    let rate: number
    if (year <= 2023) {
      rate = 0.25 // Before April 2024: 25% for all
    } else if (year === 2024) {
      // 2024 is mixed: Jan-Mar 25%, Apr-Dec 35% for KMU
      // Simplified: We use the rate that applies from April
      rate = isKmu ? 0.35 : 0.25
    } else {
      // 2025, 2026: 35% for KMU, 25% for non-KMU
      rate = isKmu ? 0.35 : 0.25
    }
    return { rate, amount: bemessungsgrundlage * rate }
  }

  // Calculate total funding across selected years
  const yearlyCalculations = selectedYears.map((year) => ({
    year,
    ...calculateYearlyFunding(year),
  }))

  const totalForschungszulage = yearlyCalculations.reduce((sum, calc) => sum + calc.amount, 0)
  const currentYearFunding = calculateYearlyFunding(2026)
  const foerderquote = currentYearFunding.rate

  const toggleYear = (year: number) => {
    setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year].sort()))
  }

  const years = [2022, 2023, 2024, 2025, 2026]

  return (
    <>
      <GlassCard className="mt-8 sm:mt-16 max-w-5xl mx-auto" glow="primary">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl md:text-5xl font-bold mb-4 sm:mb-6 text-foreground">Förderrechner</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed px-2">
              Berechnen Sie Ihr Förderpotenzial
            </p>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-primary" />
            <Label className="text-xs sm:text-sm font-medium text-foreground">Förderjahre auswählen (kumuliert)</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {years.map((year) => {
              const isSelected = selectedYears.includes(year)
              const yearCalc = calculateYearlyFunding(year)
              return (
                <button
                  key={year}
                  onClick={() => toggleYear(year)}
                  className={`
                    relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm
                    transition-all duration-200 border
                    ${
                      isSelected
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-red-500/10 border-red-500/30 text-red-400/70 hover:bg-red-500/20"
                    }
                  `}
                >
                  <div className="flex items-center gap-1.5">
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>{year}</span>
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? "text-emerald-500/70" : "text-red-400/50"}`}>
                    {(yearCalc.rate * 100).toFixed(0)}%
                  </div>
                </button>
              )
            })}
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
            2022-2023: 25% für alle • Ab April 2024: 35% für KMU
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <div className="space-y-5 sm:space-y-6">
            {/* Mitarbeiter */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label
                  id="employees-label"
                  htmlFor="employees-slider"
                  className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate">Mitarbeiter in F&E</span>
                </Label>
                <span className="text-base sm:text-lg font-bold text-primary ml-2">{employees}</span>
              </div>
              <Slider
                id="employees-slider"
                value={[employees]}
                onValueChange={(v) => setEmployees(v[0])}
                min={1}
                max={50}
                step={1}
                thumbAriaLabel={`Anzahl Mitarbeiter in F&E: ${employees} Mitarbeiter`}
                className="w-full touch-target"
              />
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                Ingenieure, Konstrukteure, Entwickler
              </p>
            </div>

            {/* F&E-Stunden */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label
                  id="hours-label"
                  htmlFor="hours-slider"
                  className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate">F&E-Stunden/MA/Jahr</span>
                </Label>
                <span className="text-base sm:text-lg font-bold text-primary ml-2 whitespace-nowrap">
                  {hoursPerEmployee.toLocaleString("de-DE")} h
                </span>
              </div>
              <Slider
                id="hours-slider"
                value={[hoursPerEmployee]}
                onValueChange={(v) => setHoursPerEmployee(v[0])}
                min={200}
                max={1700}
                step={100}
                thumbAriaLabel={`F&E-Stunden pro Mitarbeiter pro Jahr: ${hoursPerEmployee.toLocaleString("de-DE")} Stunden`}
                className="w-full touch-target"
              />
            </div>

            {/* Gehalt */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label
                  id="salary-label"
                  htmlFor="salary-slider"
                  className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate">Ø Jahresgehalt</span>
                </Label>
                <span className="text-base sm:text-lg font-bold text-primary ml-2 whitespace-nowrap">
                  {avgSalary.toLocaleString("de-DE")} €
                </span>
              </div>
              <Slider
                id="salary-slider"
                value={[avgSalary]}
                onValueChange={(v) => setAvgSalary(v[0])}
                min={40000}
                max={120000}
                step={5000}
                thumbAriaLabel={`Durchschnittliches Jahresgehalt: ${avgSalary.toLocaleString("de-DE")} Euro`}
                className="w-full touch-target"
              />
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-border">
              {/* KMU Switch */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {isKmu ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                      <X className="w-3 h-3 text-red-500" />
                    </div>
                  )}
                  <Label htmlFor="kmu-switch" className="text-xs sm:text-sm font-medium text-foreground">
                    KMU-Status (35% Förderquote)
                  </Label>
                </div>
                <Switch
                  id="kmu-switch"
                  checked={isKmu}
                  onCheckedChange={setIsKmu}
                  aria-label="KMU-Status aktivieren oder deaktivieren"
                  className={`touch-target ${isKmu ? "data-[state=checked]:bg-emerald-500" : "data-[state=unchecked]:bg-red-500/50"}`}
                />
              </div>

              {/* Gesellschafter/Einzelunternehmer Switch */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {isGesellschafter ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                      <X className="w-3 h-3 text-red-500" />
                    </div>
                  )}
                  <Label htmlFor="gf-switch" className="text-xs sm:text-sm font-medium text-foreground">
                    Gesellschafter/Einzelunternehmer
                  </Label>
                </div>
                <Switch
                  id="gf-switch"
                  checked={isGesellschafter}
                  onCheckedChange={setIsGesellschafter}
                  aria-label="Gesellschafter oder Einzelunternehmer Status"
                  className={`touch-target ${isGesellschafter ? "data-[state=checked]:bg-emerald-500" : "data-[state=unchecked]:bg-red-500/50"}`}
                />
              </div>

              {/* Auftragsforschung Switch */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {hasAuftragsforschung ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                      <X className="w-3 h-3 text-red-500" />
                    </div>
                  )}
                  <Label htmlFor="auftragsforschung-switch" className="text-xs sm:text-sm font-medium text-foreground">
                    Auftragsforschung
                  </Label>
                </div>
                <Switch
                  id="auftragsforschung-switch"
                  checked={hasAuftragsforschung}
                  onCheckedChange={setHasAuftragsforschung}
                  aria-label="Auftragsforschung aktivieren oder deaktivieren"
                  className={`touch-target ${hasAuftragsforschung ? "data-[state=checked]:bg-emerald-500" : "data-[state=unchecked]:bg-red-500/50"}`}
                />
              </div>
            </div>

            {isGesellschafter && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center">
                  <Label
                    id="gf-label"
                    htmlFor="gf-slider"
                    className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="truncate">GF/Gesellschafter F&E-Stunden</span>
                  </Label>
                  <span className="text-base sm:text-lg font-bold text-emerald-500 ml-2 whitespace-nowrap">
                    {gfHours.toLocaleString("de-DE")} h
                  </span>
                </div>
                <Slider
                  id="gf-slider"
                  value={[gfHours]}
                  onValueChange={(v) => setGfHours(v[0])}
                  min={0}
                  max={1700}
                  step={50}
                  thumbAriaLabel={`Geschäftsführer F&E-Stunden pro Jahr: ${gfHours.toLocaleString("de-DE")} Stunden`}
                  className="w-full touch-target"
                />
                <p className="text-[10px] sm:text-xs text-emerald-500/80">
                  100 €/Std. Pauschale für Gesellschafter & Einzelunternehmer
                </p>
              </div>
            )}

            {hasAuftragsforschung && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center">
                  <Label
                    id="auftragsforschung-label"
                    htmlFor="auftragsforschung-slider"
                    className="text-xs sm:text-sm font-medium text-foreground truncate"
                  >
                    Auftragsforschung
                  </Label>
                  <span className="text-base sm:text-lg font-bold text-emerald-500 ml-2 whitespace-nowrap">
                    {auftragsforschungValue.toLocaleString("de-DE")} €
                  </span>
                </div>
                <Slider
                  id="auftragsforschung-slider"
                  value={[auftragsforschungValue]}
                  onValueChange={(v) => setAuftragsforschungValue(v[0])}
                  min={10000}
                  max={1000000}
                  step={10000}
                  thumbAriaLabel={`Wert der Auftragsforschung: ${auftragsforschungValue.toLocaleString("de-DE")} Euro`}
                  className="w-full touch-target"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="glass rounded-xl p-4 sm:p-6 border border-white/[0.08]">
              <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3 sm:mb-4 uppercase tracking-wide">
                Kalkulation pro Jahr
              </h4>

              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-border/50">
                  <span className="text-foreground">Personalkosten</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {Math.round(personalKosten).toLocaleString("de-DE")} €
                  </span>
                </div>

                {isGesellschafter && eigenleistungGf > 0 && (
                  <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-border/50 animate-in fade-in duration-300">
                    <span className="text-foreground">GF/Gesellschafter (100 €/h)</span>
                    <span className="font-medium text-emerald-500 tabular-nums">
                      {eigenleistungGf.toLocaleString("de-DE")} €
                    </span>
                  </div>
                )}

                {hasAuftragsforschung && (
                  <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-border/50 animate-in fade-in duration-300">
                    <span className="text-foreground">Auftragsforschung (70%)</span>
                    <span className="font-medium text-emerald-500 tabular-nums">
                      {Math.round(auftragsforschung).toLocaleString("de-DE")} €
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-border/50">
                  <span className="text-foreground">+ 20% Gemeinkosten</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {Math.round(gemeinkosten).toLocaleString("de-DE")} €
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 sm:py-3 border-b border-border">
                  <span className="font-semibold text-foreground">Bemessungsgrundlage</span>
                  <span className="font-bold text-foreground tabular-nums">
                    {Math.round(bemessungsgrundlage).toLocaleString("de-DE")} €
                  </span>
                </div>
              </div>

              {selectedYears.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <h5 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Förderung nach Jahren
                  </h5>
                  <div className="space-y-1.5">
                    {yearlyCalculations.map(({ year, rate, amount }) => (
                      <div key={year} className="flex justify-between items-center text-xs">
                        <span className="text-foreground">
                          {year} <span className="text-muted-foreground">({(rate * 100).toFixed(0)}%)</span>
                        </span>
                        <span className="font-medium text-emerald-500 tabular-nums">
                          {Math.round(amount).toLocaleString("de-DE")} €
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 p-4 sm:p-6 border border-primary/30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.3),transparent_60%)]" />
              <div className="relative">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                  Ihre Forschungszulage gesamt ({selectedYears.length} {selectedYears.length === 1 ? "Jahr" : "Jahre"})
                </p>
                <div className="text-3xl sm:text-5xl font-bold gradient-text">
                  <AnimatedNumber value={Math.round(totalForschungszulage)} suffix=" €" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">= Steuererstattung oder Auszahlung</p>
                {selectedYears.length > 1 && (
                  <p className="text-[10px] sm:text-xs text-emerald-500/80 mt-1">
                    Ø {Math.round(totalForschungszulage / selectedYears.length).toLocaleString("de-DE")} € pro Jahr
                  </p>
                )}

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
                  <p className="text-xs sm:text-sm text-foreground mb-3">
                    {totalForschungszulage > 500000
                      ? "Erhebliches Förderpotenzial! Lassen Sie uns Ihren konkreten Anspruch prüfen."
                      : totalForschungszulage > 100000
                        ? "Attraktives Förderpotenzial! Wir prüfen Ihren Anspruch."
                        : "Auch kleinere Beträge lohnen sich. Wir beraten Sie gerne."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold py-2.5 sm:py-3 text-xs sm:text-sm whitespace-normal min-h-[44px]"
                    >
                      <span>Anspruch prüfen</span>
                      <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                    </Button>
                    <a
                      href="tel:+49208780125778"
                      className="flex-1 flex items-center justify-center gap-2 border border-primary/50 rounded-lg py-2.5 sm:py-3 text-xs sm:text-sm text-primary hover:bg-primary/10 transition-colors min-h-[44px]"
                    >
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Direkt anrufen</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground leading-relaxed">
              <strong>Hinweis:</strong> Die hier dargestellten Berechnungen beinhalten vereinfachte Annahmen zum Zwecke
              des einfachen Verständnisses und Leseflusses. Diese haben daher keinen Anspruch auf Vollständigkeit oder
              absolute Korrektheit. Lassen Sie uns Ihren Anspruch konkret im Gespräch ermitteln.
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="mt-8 max-w-5xl mx-auto">
        <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed text-center px-4">
          <strong>Transparenz-Hinweis:</strong> Sämtliche genannten und gezeigten Fallstudien, Kennzahlen und
          Projektergebnisse stammen aus realen Kundenprojekten und sind nachweislich dokumentiert. Sie zeigen, was mit
          der richtigen Strategie tatsächlich möglich ist. Eigene Resultate können variieren, bspw. abhängig von
          Branche, Ausgangslage, Umsetzungsart und sind auch abhängig vom eigenen Einsatz, insbesondere Zuarbeit.
        </p>
      </div>

      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export function NumbersSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section id="foerderrechner" className="py-12 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

        <div className="container-responsive relative">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-16">
            <Badge variant="outline" className="mb-3 sm:mb-4 border-accent/30 text-accent text-xs sm:text-sm">
              <FactoryIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Aktualisiert 2026
            </Badge>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-balance">
              Berechnen Sie Ihr <span className="gradient-text">nicht-genutztes Förderbudget</span>
            </h2>
            <p className="text-sm sm:text-xl text-muted-foreground leading-relaxed">
              Interaktive Kalkulation basierend auf den aktuellen Fördersätzen 2026
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-6xl mx-auto mb-8 sm:mb-12">
            {fundingDetails.map((detail, index) => (
              <GlassCard
                key={detail.category}
                className={`p-3 sm:p-4 text-center ${detail.highlight ? "border-primary/30" : ""}`}
                hover
              >
                <detail.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-primary" />
                <div className="text-lg sm:text-2xl font-bold gradient-text mb-1">{detail.value}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 line-clamp-2">
                  {detail.description}
                </div>
                {detail.change && (
                  <div className="inline-block px-1.5 sm:px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[9px] sm:text-xs font-medium">
                    {detail.change}
                  </div>
                )}
              </GlassCard>
            ))}
          </div>

          <InteractiveCalculator />

          <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
            <GlassCard className="p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Transparenz-Hinweis</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Sämtliche genannten und gezeigten Fallstudien, Kennzahlen und Projektergebnisse stammen aus realen
                    Kundenprojekten und sind nachweislich dokumentiert. Sie zeigen, was mit der richtigen Strategie
                    tatsächlich möglich ist. Eigene Resultate können variieren, bspw. abhängig von Branche,
                    Ausgangslage, Umsetzungsart und sind auch abhängig vom eigenen Einsatz, insbesondere Zuarbeit.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
