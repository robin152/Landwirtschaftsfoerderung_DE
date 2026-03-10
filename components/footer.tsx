import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const footerLinks = {
  unternehmen: [
    { label: "Über uns", href: "https://eskalator.ag/mission-eskalator", external: true },
    { label: "Impressum", href: "https://eskalator.ag/impressum", external: true },
    { label: "Datenschutz", href: "https://eskalator.ag/dsgvo", external: true },
  ],
  seite: [
    { label: "Rechner", href: "#rechner", external: false },
    { label: "Förderquoten", href: "#funding-quotes", external: false },
    { label: "Ablauf", href: "#ablauf", external: false },
    { label: "Experte", href: "#experte", external: false },
    { label: "FAQ", href: "#faq", external: false },
  ],
  foerderung: [
    { label: "Was wird gefördert", href: "#assets", external: false },
    { label: "Nicht förderfähig", href: "#exclusions", external: false },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border py-10 sm:py-20 safe-area-bottom bg-white">
      <div className="page-container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 pb-8 sm:pb-16 border-b border-border mb-8 sm:mb-16">
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-foreground">Bereit für Ihre Förderung?</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Starten Sie mit der kostenfreien Erstberatung.</p>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-2">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 transition-all h-12 px-6 font-medium group w-full sm:w-auto touch-target"
              asChild
            >
              <a href="#rechner">
                Förderung kostenlos berechnen
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <p className="text-xs text-muted-foreground text-center sm:text-right max-w-[300px]">
              Sie sprechen direkt mit Patrick Starkmann
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 mb-8 sm:mb-16">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-700 flex items-center justify-center font-bold text-[8px] sm:text-[9px] text-white leading-tight text-center">
                FfdL
              </div>
            </a>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
              Eskalator AG — Ihr Partner für die Förderung in der Landwirtschaft.
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Tel (DE):</span>{" "}
                <a href="tel:+49208780125778" className="hover:text-accent transition-colors">
                  +49 208 780 125 78
                </a>
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">E-Mail:</span>{" "}
                <a href="mailto:innovation@eskalator.ag" className="hover:text-accent transition-colors">
                  innovation@eskalator.ag
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Unternehmen</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.unternehmen.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Seite</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.seite.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Förderung für die Landwirtschaft</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.foerderung.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-8 sm:mb-12 p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-sm sm:text-base text-foreground mb-3">Rechtliche Grundlagen</h4>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Unsere Beratung basiert auf dem Fördergesetz des Bundes und der Länder sowie den Richtlinien der
            EU-Regionalförderung. Wir übernehmen die komplette Antragsstellung für Sie.
          </p>
        </div>

        {/* Legal Disclaimer */}
        <div className="mb-8 sm:mb-12 p-4 sm:p-6 bg-amber-50/50 rounded-xl border border-amber-200/50">
          <h4 className="font-semibold text-sm sm:text-base text-amber-900 mb-2">Wichtiger Hinweis</h4>
          <p className="text-xs sm:text-sm text-amber-800/80 leading-relaxed">
            Alle auf dieser Seite gezeigten Zahlen und Beispiele dienen der einfachen Verständlichkeit. 
            Förderungen werden individuell erteilt. Eine Einzelfallprüfung Ihres Falls muss daher erfolgen. 
            Die tatsächliche Förderhöhe hängt von Ihrem Standort, Ihrer Branche, Unternehmensgröße und 
            weiteren individuellen Faktoren ab.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 pt-6 sm:pt-8 border-t border-border text-center sm:text-left">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © 2026 Eskalator AG • Hauptsitz: Schweiz
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">Made in Germany & Switzerland</p>
        </div>
      </div>
    </footer>
  )
}
