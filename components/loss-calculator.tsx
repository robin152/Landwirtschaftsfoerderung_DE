"use client"

import { useState } from "react"
import { GlassCard } from "./glass-card"
import { AlertTriangle } from "lucide-react"

export function LossCalculator() {
  const [salary, setSalary] = useState(200000)

  const withOptimization = Math.round(salary * 0.25 * 0.35 * 1.2) // Personalkosten * 25% F&E * 35% KMU * 1.2 (mit 20% Overhead)
  const withoutOptimization = Math.round(salary * 0.25 * 0.35) // Ohne 20% Overhead
  const lost = withOptimization - withoutOptimization

  return (
    <section className="py-16 sm:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <GlassCard className="p-8 sm:p-12 border-2 border-destructive/30">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">Wie viel Geld verschenken Sie?</h3>
              <p className="text-muted-foreground">
                Ohne Optimierung verschenken Sie im Schnitt 18% der möglichen Zulage — allein durch die
                Gemeinkosten-Thematik.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Jährliche F&E-Lohnsumme (Schätzung): <span className="text-accent">{salary.toLocaleString()} €</span>
              </label>
              <input
                type="range"
                min="50000"
                max="500000"
                step="10000"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>50.000 €</span>
                <span>500.000 €</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border">
              <div className="text-center p-4 rounded-lg bg-secondary/30">
                <div className="text-sm text-muted-foreground mb-1">Ohne Optimierung</div>
                <div className="text-2xl font-bold">{withoutOptimization.toLocaleString()} €</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/30">
                <div className="text-sm text-accent mb-1">Mit 20% Overhead</div>
                <div className="text-2xl font-bold text-accent">{withOptimization.toLocaleString()} €</div>
              </div>
            </div>

            <div className="text-center p-6 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="text-sm text-muted-foreground mb-2">Opportunitätskosten</div>
              <div className="text-3xl sm:text-4xl font-bold text-destructive mb-2">{lost.toLocaleString()} €</div>
              <p className="text-sm text-muted-foreground">verschenkt ohne fachliche Begleitung</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
