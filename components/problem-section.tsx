import { GlassCard } from "./glass-card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, Clock, HelpCircle } from "lucide-react"

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

const problems = [
  {
    icon: TrendingDown,
    title: "Sie zahlen zu viel Steuern",
    description:
      "Wenn Ihre Entwickler Prototypen bauen, Verfahren optimieren oder neue Maschinenkonzepte erproben, verschenken Sie ohne Forschungszulage bis zu 35% dieser Kosten — das sind bei 5 Ingenieuren schnell 350.000 € pro Jahr.",
    nutzen: "Ihr Nutzen: Diese Steuerersparnis finanziert Ihr nächstes F&E-Projekt.",
  },
  {
    icon: HelpCircle,
    title: "Unsicherheit: Was ist überhaupt förderfähig?",
    description:
      "Reine Konstruktion nach Stand der Technik? Nein. Aber: Sobald Sie technische Unsicherheiten überwinden, neue Verfahren erproben oder Prototypen entwickeln, sind Sie nach Frascati-Kriterien förderfähig — wir zeigen Ihnen genau die Grenze.",
    nutzen: "Ihr Nutzen: Klarheit in 30 Minuten, welche Ihrer Projekte förderfähig sind.",
  },
  {
    icon: Clock,
    title: "Jedes Jahr ohne Antrag = Geld verloren",
    description:
      "Die Forschungszulage kann nur 4 Jahre rückwirkend beantragt werden. Projekte aus 2022 sind nur noch bis Ende 2026 einreichbar. Warten Sie nicht — jedes verpasste Jahr bedeutet unwiderruflich verlorene Förderung.",
    nutzen: "Ihr Nutzen: Rückwirkend bis zu 4 Jahresförderungen sichern.",
  },
]

export function ProblemSection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-4 border-destructive/30 text-destructive">
            Das Problem
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
            Sie entwickeln innovative Maschinen — und <span className="gradient-text">verschenken dabei Geld</span>?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Die meisten Maschinenbau-KMU wissen nicht, dass ihre tägliche Entwicklungsarbeit vom Staat gefördert wird.
            Das Ergebnis: Millionen bleiben auf dem Tisch liegen.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {problems.map((problem) => (
            <GlassCard key={problem.title} hover>
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">{problem.description}</p>
              <p className="text-sm text-accent font-medium">{problem.nutzen}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
