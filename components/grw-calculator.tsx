"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, TrendingUp, Users, MapPin, Building2, Zap, ChevronRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

type Step = 1 | 2 | 3 | 4 | 5
type Region = "C" | "C+" | "D" | "none"
type CompanySize = "small" | "medium" | "large"
type InvestmentGoal = "jobs" | "productivity" | "climate"

export function GRWCalculator() {
  const [step, setStep] = useState<Step>(1)
  const [postalCode, setPostalCode] = useState("")
  const [region, setRegion] = useState<Region | null>(null)
  const [teamSize, setTeamSize] = useState(25)
  const [investmentGoal, setInvestmentGoal] = useState<InvestmentGoal | null>(null)
  const [investment, setInvestment] = useState(500000)
  const [newJobs, setNewJobs] = useState(3)
  const [apprentices, setApprentices] = useState(0)
  const [isChecking, setIsChecking] = useState(false)

  const companySize: CompanySize = teamSize < 50 ? "small" : teamSize < 250 ? "medium" : "large"

  const checkPostalCode = async () => {
    setIsChecking(true)
    try {
      const response = await fetch(`/api/foerdergebiet?plz=${postalCode}`)
      const data = await response.json()
      const code = data.code || "N"
      if (code === "C") setRegion("C")
      else if (code === "C+") setRegion("C+")
      else if (code === "D") setRegion("D")
      else setRegion("none")
    } catch {
      setRegion("none")
    }
    setIsChecking(false)
    setStep(2)
  }

  const calculateFunding = () => {
    if (!region || region === "none") return { rate: 0, amount: 0, bonus: 0 }

    let baseRate = 0

    // Base rate by company size and region (C+ = C + 10PP Grenzzuschlag)
    const isCGebiet = region === "C" || region === "C+"
    const grenzzuschlag = region === "C+" ? 0.10 : 0
    if (companySize === "small") {
      baseRate = isCGebiet ? 0.35 + grenzzuschlag : 0.2
    } else if (companySize === "medium") {
      baseRate = isCGebiet ? 0.25 + grenzzuschlag : 0.1
    } else {
      baseRate = isCGebiet ? 0.15 + grenzzuschlag : 0
    }

    // Climate transformation bonus 2026
    let climateBonus = 0
    if (investmentGoal === "climate") {
      climateBonus = companySize === "small" ? 0.15 : companySize === "medium" ? 0.1 : 0.1
    }

    // Productivity bonus
    if (investmentGoal === "productivity") {
      climateBonus = 0.05 // New 2026 productivity clause
    }

    const totalRate = Math.min(baseRate + climateBonus, companySize === "small" ? 0.45 : 0.35)
    const amount = investment * totalRate

    // Job creation bonus (including apprentices counted as 2x)
    const effectiveJobs = newJobs + apprentices * 2
    const jobBonus = effectiveJobs * 5000

    return { rate: totalRate, amount, bonus: jobBonus, effectiveJobs }
  }

  const funding = calculateFunding()
  const progress = (step / 5) * 100

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50/30 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(8,145,178,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.05),transparent_50%)]" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold mb-6">
            <Calculator className="w-4 h-4" />
            <span>Regional-Förderung-Turbo-Tool 2026</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Ihre Fördersumme in{" "}
            <span className="bg-gradient-to-r from-accent via-primary to-green-600 bg-clip-text text-transparent">
              4 einfachen Schritten
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Erfahren Sie in unter 60 Sekunden, mit welcher Regional-Förderung Sie 2026 rechnen können
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2 text-sm font-medium">
            <span className="text-muted-foreground">
              Nur noch {5 - step} {5 - step === 1 ? "Frage" : "Fragen"} bis zu Ihrem Ergebnis
            </span>
            <span className="text-accent">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <motion.div className="max-w-4xl mx-auto glass-effect-premium rounded-3xl p-8 md:p-12 shadow-premium-xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-accent" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">Wo investieren Sie?</h3>
                  <p className="text-muted-foreground">PLZ-Eingabe prüft automatisch Ihr Fördergebiet (C/C+/D-Status)</p>
                </div>

                <div className="max-w-md mx-auto">
                  <Label className="text-base font-semibold mb-3 block">Postleitzahl Ihres Standorts</Label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={5}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="z.B. 45127"
                    className="w-full px-6 py-4 text-2xl font-semibold text-center rounded-xl border-2 border-border focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all outline-none"
                  />
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    Wir prüfen automatisch, ob Ihr Standort in einem C-, C+- oder D-Fördergebiet liegt
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={checkPostalCode}
                  disabled={postalCode.length !== 5 || isChecking}
                  className="w-full magnetic-button gradient-premium text-white shadow-premium-lg hover:shadow-premium-xl"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Prüfe aktuelle Richtlinien vom 01.01.2026...
                    </>
                  ) : (
                    <>
                      Fördergebiet prüfen
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-accent" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">Wie groß ist Ihr Team?</h3>
                  <p className="text-muted-foreground">Die Unternehmensgröße bestimmt Ihren Basis-Fördersatz</p>
                </div>

                {region && region !== "none" && (
                  <div className="bg-accent/10 border-2 border-accent/30 rounded-xl p-4 text-center">
                    <p className="font-semibold text-accent">✓ Standort liegt im {region}-Fördergebiet</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Anzahl Mitarbeiter</Label>
                    <div className="text-right">
                      <span className="text-4xl font-bold text-accent">{teamSize}</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {companySize === "small" && "Kleines Unternehmen"}
                        {companySize === "medium" && "Mittleres Unternehmen"}
                        {companySize === "large" && "Großunternehmen"}
                      </p>
                    </div>
                  </div>
                  <Slider
                    value={[teamSize]}
                    onValueChange={(value) => setTeamSize(value[0])}
                    min={1}
                    max={300}
                    step={1}
                    className="py-4"
                  />

                  <div className="grid grid-cols-3 gap-3 text-xs text-center">
                    <div
                      className={`p-3 rounded-lg ${companySize === "small" ? "bg-accent/10 border-2 border-accent" : "bg-slate-100"}`}
                    >
                      <div className="font-bold">Klein</div>
                      <div className="text-muted-foreground">{"<"} 50 MA</div>
                      <div className="text-accent font-semibold mt-1">bis 45%</div>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${companySize === "medium" ? "bg-accent/10 border-2 border-accent" : "bg-slate-100"}`}
                    >
                      <div className="font-bold">Mittel</div>
                      <div className="text-muted-foreground">{"<"} 250 MA</div>
                      <div className="text-accent font-semibold mt-1">bis 35%</div>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${companySize === "large" ? "bg-accent/10 border-2 border-accent" : "bg-slate-100"}`}
                    >
                      <div className="font-bold">Groß</div>
                      <div className="text-muted-foreground">≥ 250 MA</div>
                      <div className="text-accent font-semibold mt-1">bis 15%</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1">
                    Zurück
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setStep(3)}
                    className="flex-1 magnetic-button gradient-premium text-white shadow-premium-lg hover:shadow-premium-xl"
                  >
                    Weiter
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <Zap className="w-16 h-16 mx-auto mb-4 text-accent" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">Was ist Ihr Hauptziel?</h3>
                  <p className="text-muted-foreground">Wählen Sie den Haupt-Investitionsgrund für Ihre Förderung</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setInvestmentGoal("jobs")}
                    className={`p-6 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                      investmentGoal === "jobs"
                        ? "border-accent bg-accent/10 shadow-lg"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <Users className="w-10 h-10 mb-3 text-accent" />
                    <div className="font-bold text-lg mb-2">Arbeitsplatz-schaffung</div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Klassische Regional-Förderung durch neue Stellen
                    </div>
                    {investmentGoal === "jobs" && (
                      <div className="flex items-center gap-2 text-accent font-semibold">
                        <Check className="w-4 h-4" />
                        Ausgewählt
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setInvestmentGoal("productivity")}
                    className={`p-6 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                      investmentGoal === "productivity"
                        ? "border-accent bg-accent/10 shadow-lg"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <TrendingUp className="w-10 h-10 mb-3 text-accent" />
                    <div className="font-bold text-lg mb-2">Produktivitäts-steigerung</div>
                    <div className="text-sm text-muted-foreground mb-3">
                      ≥10% mehr Effizienz bei gleichbleibendem Personal
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                      Neu 2026: +5% Bonus
                    </div>
                    {investmentGoal === "productivity" && (
                      <div className="flex items-center gap-2 text-accent font-semibold mt-2">
                        <Check className="w-4 h-4" />
                        Ausgewählt
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setInvestmentGoal("climate")}
                    className={`p-6 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                      investmentGoal === "climate"
                        ? "border-accent bg-accent/10 shadow-lg"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="w-10 h-10 mb-3 text-green-600">🌱</div>
                    <div className="font-bold text-lg mb-2">Transformations-Bonus</div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Klimaneutralität / Energieautarkie / Kreislaufwirtschaft
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
                      +10-15% Bonus
                    </div>
                    {investmentGoal === "climate" && (
                      <div className="flex items-center gap-2 text-accent font-semibold mt-2">
                        <Check className="w-4 h-4" />
                        Ausgewählt
                      </div>
                    )}
                  </button>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" size="lg" onClick={() => setStep(2)} className="flex-1">
                    Zurück
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setStep(4)}
                    disabled={!investmentGoal}
                    className="flex-1 magnetic-button gradient-premium text-white shadow-premium-lg hover:shadow-premium-xl disabled:opacity-50"
                  >
                    Weiter
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-accent" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">Geplante Investitionssumme?</h3>
                  <p className="text-muted-foreground">Mindestinvestition: 150.000 € für Regional-Förderung NRW</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Netto-Investitionssumme</Label>
                      <span className="text-3xl font-bold text-accent">{investment.toLocaleString("de-DE")} €</span>
                    </div>
                    <Slider
                      value={[investment]}
                      onValueChange={(value) => setInvestment(value[0])}
                      min={150000}
                      max={10000000}
                      step={50000}
                      className="py-4"
                    />
                  </div>

                  {investmentGoal === "jobs" && (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-semibold">Neue Vollzeitstellen</Label>
                          <span className="text-3xl font-bold text-accent">{newJobs}</span>
                        </div>
                        <Slider
                          value={[newJobs]}
                          onValueChange={(value) => setNewJobs(value[0])}
                          min={0}
                          max={50}
                          step={1}
                          className="py-4"
                        />
                      </div>

                      <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                            2x
                          </div>
                          <div className="flex-1">
                            <Label className="text-base font-semibold mb-2 block">
                              Azubi-Rechner 2026: Planen Sie neue Ausbildungsplätze?
                            </Label>
                            <p className="text-sm text-green-800 mb-3">
                              Tipp: 1 Azubi zählt als 2 Vollzeitstellen für die "Besondere Anstrengung"
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Anzahl Azubi-Plätze</Label>
                          <span className="text-2xl font-bold text-green-900">{apprentices}</span>
                        </div>
                        <Slider
                          value={[apprentices]}
                          onValueChange={(value) => setApprentices(value[0])}
                          min={0}
                          max={10}
                          step={1}
                          className="py-4"
                        />
                        {apprentices > 0 && (
                          <div className="bg-green-600 text-white px-4 py-3 rounded-lg">
                            <div className="font-semibold">Effektive Arbeitsplätze: {newJobs + apprentices * 2}</div>
                            <div className="text-sm opacity-90">
                              {newJobs} Vollzeitstellen + {apprentices} Azubis (= {apprentices * 2} Stellen)
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" size="lg" onClick={() => setStep(3)} className="flex-1">
                    Zurück
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setStep(5)}
                    className="flex-1 magnetic-button gradient-premium text-white shadow-premium-lg hover:shadow-premium-xl"
                  >
                    Förderung berechnen
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-3">Ihr Förder-Potenzial 2026</h3>
                  <p className="text-muted-foreground">Basierend auf den aktuellen Richtlinien vom 01.01.2026</p>
                </div>

                <div className="gradient-premium text-white rounded-2xl p-8 md:p-10 shadow-premium-xl">
                  <div className="text-center mb-8">
                    <div className="text-lg opacity-90 mb-3">Voraussichtlich möglich</div>
                    <div className="text-5xl md:text-6xl font-bold mb-4">
                      {funding.amount.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                      <span className="text-sm font-semibold">Förderquote: {(funding.rate * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-sm opacity-90 mb-2">Programm</div>
                      <div className="font-bold text-lg">Regional-Förderung NRW</div>
                      <div className="text-sm opacity-75">(Gewerbliche Wirtschaft)</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-sm opacity-90 mb-2">Fördergebiet</div>
                      <div className="font-bold text-lg">{region}-Gebiet</div>
                      <div className="text-sm opacity-75">
                        {region === "C+" ? "C-Gebiet mit Grenzzuschlag" : region === "C" ? "Strukturschwache Kernregion" : "Moderate Förderregion"}
                      </div>
                    </div>

                    {funding.bonus > 0 && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:col-span-2">
                        <div className="text-sm opacity-90 mb-2">Arbeitsplatz-Bonus</div>
                        <div className="font-bold text-2xl">+{funding.bonus.toLocaleString("de-DE")} €</div>
                        <div className="text-sm opacity-75 mt-1">
                          Für {funding.effectiveJobs} neue Arbeitsplätze (inkl. Azubi-Bonus)
                        </div>
                      </div>
                    )}
                  </div>

                  {investmentGoal === "productivity" && (
                    <div className="mt-6 bg-green-500/20 border-2 border-green-300/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-green-100">
                        <Check className="w-5 h-5" />
                        <span className="font-semibold">
                          Ihr Vorhaben erfüllt die neue 10%-Produktivitätsklausel 2026
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-xl p-6 space-y-3">
                  <h4 className="font-bold text-lg mb-4">Wichtige Hinweise</h4>
                  <p className="flex items-start gap-3 text-sm">
                    <span className="text-accent mt-0.5 flex-shrink-0">✓</span>
                    <span>Diese Prognose basiert auf den Richtlinien 2026 und ist unverbindlich</span>
                  </p>
                  <p className="flex items-start gap-3 text-sm">
                    <span className="text-red-600 mt-0.5 flex-shrink-0">!</span>
                    <span className="font-semibold">
                      Förderanträge müssen zwingend VOR der ersten Bestellung gestellt werden
                    </span>
                  </p>
                  <p className="flex items-start gap-3 text-sm">
                    <span className="text-accent mt-0.5 flex-shrink-0">✓</span>
                    <span>
                      Endgültige Förderhöhe abhängig von Prüfung der Förderfähigkeit durch die Bewilligungsstelle
                    </span>
                  </p>
                  <p className="flex items-start gap-3 text-sm">
                    <span className="text-accent mt-0.5 flex-shrink-0">✓</span>
                    <span>
                      Ihr Eigenanteil: {(investment - funding.amount).toLocaleString("de-DE")} € (
                      {((1 - funding.rate) * 100).toFixed(0)}% der Investition)
                    </span>
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full magnetic-button gradient-premium text-white shadow-premium-lg hover:shadow-premium-xl text-lg py-6"
                  >
                    Jetzt Fördermittel reservieren & Erstberatung buchen
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setStep(1)
                      setPostalCode("")
                      setRegion(null)
                      setInvestmentGoal(null)
                    }}
                    className="w-full"
                  >
                    Neue Berechnung starten
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto mt-12 text-center"
        >
          <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-accent flex-shrink-0" />
              <span>Basierend auf aktuellen Richtlinien 2026</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-accent flex-shrink-0" />
              <span>Kostenlose & unverbindliche Berechnung</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-accent flex-shrink-0" />
              <span>Über 500 erfolgreich betreute Förderanträge</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
