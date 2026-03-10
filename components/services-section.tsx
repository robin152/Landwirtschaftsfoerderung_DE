import { GlassCard } from "./glass-card"

function AnalysisIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 21H4.6c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C3 20.24 3 19.96 3 19.4V3" />
      <path d="M7 14l4-4 4 4 6-6" />
      <circle cx="21" cy="8" r="2" />
    </svg>
  )
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  )
}

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8M8 10h8M8 14h2M8 18h2M14 14h2M14 18h2" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function SupportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  )
}

const services = [
  {
    icon: AnalysisIcon,
    title: "Förderfähigkeitsanalyse",
    description:
      "Wir prüfen Ihre Entwicklungsprojekte auf Frascati-Konformität und sagen Ihnen konkret, welche Tätigkeiten förderfähig sind — und welche nicht.",
    nutzen: "Sie wissen in 30 Min., wie viel Geld auf dem Tisch liegt",
    highlight: "Kostenfrei",
  },
  {
    icon: DocumentIcon,
    title: "BSFZ-Antragstellung",
    description:
      "Wir erstellen die technische Projektbeschreibung so, dass die BSFZ die Förderfähigkeit anerkennt. Als Ingenieure wissen wir, wie man F&E dokumentiert.",
    nutzen: "98% Erfolgsquote bei unseren Anträgen",
    highlight: "Ingenieur-Qualität",
  },
  {
    icon: CalculatorIcon,
    title: "Förderberechnung",
    description:
      "Wir berechnen Ihre förderfähigen Aufwendungen inkl. der neuen 100 €/Std.-Pauschale und 20% Gemeinkosten — optimiert auf maximale Fördersumme.",
    nutzen: "Kein Euro Förderung bleibt liegen",
    highlight: "Präzise Abgrenzung",
  },
  {
    icon: ShieldIcon,
    title: "Finanzamt-Antrag",
    description:
      "Nach BSFZ-Bescheinigung beantragen wir die Forschungszulage beim Finanzamt über ELSTER — rechtssicher dokumentiert mit allen Nachweisen.",
    nutzen: "Auszahlung mit dem nächsten Steuerbescheid",
    highlight: "Rechtssicher",
  },
  {
    icon: SupportIcon,
    title: "Laufende Betreuung",
    description:
      "Persönlicher Ansprechpartner, jährliche Folgeantragstellung für laufende Projekte, Unterstützung bei Rückfragen von BSFZ oder Finanzamt.",
    nutzen: "Jahr für Jahr wiederkehrende Förderung sichern",
    highlight: "Langfristig",
  },
]

export function ServicesSection() {
  return (
    <section id="leistungen" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
            Vom ersten Gespräch bis zur <span className="gradient-text">Auszahlung auf Ihr Konto</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Wir übernehmen das komplette Antragsverfahren. Sie konzentrieren sich auf Ihre Entwicklung — wir kümmern uns
            um die Förderung.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <GlassCard key={service.title} hover className={index === 4 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
                {service.highlight}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
              <p className="text-sm text-accent font-medium pt-4 border-t border-border">{service.nutzen}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
