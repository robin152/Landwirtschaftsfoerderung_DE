"use client"

import { NewsTicker } from "@/components/news-ticker"
import { NavigationIndustrial } from "@/components/navigation-industrial"
import { HeroSection } from "@/components/hero-section"
import { GoogleReviewsSlider } from "@/components/google-reviews-slider"
import ExpertSection from "@/components/expert-section-grw"
import { AssetsSection } from "@/components/assets-section"
import { FundingQuotesSection } from "@/components/funding-quotes-section"
import { ProcessSectionRWP } from "@/components/process-section-rwp"
import { Footer } from "@/components/footer"
import { StickyCTA } from "@/components/sticky-cta"
import { FAQMegaSection } from "@/components/faq-mega-section"
import { CompanySearchSection } from "@/components/company-search-section"
import { PersonalizedBenefitsSection } from "@/components/personalized-benefits-section"
import { ErrorBoundary } from "@/components/error-boundary"
import { RWPCalculator2026 } from "@/components/rwp-calculator-2026"
import { PersonnelFundingSection } from "@/components/personnel-funding-section"
import { NegativlisteSection } from "@/components/negativliste-section"
import { StrategicPathsSection } from "@/components/strategic-paths-section"
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-reveal"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <NewsTicker />
      <NavigationIndustrial />
      <main suppressHydrationWarning>

        {/* Hero */}
        <ErrorBoundary inline>
          <HeroSection />
        </ErrorBoundary>

        {/* Rechner — fade-up mit leichtem Scale */}
        <ScrollReveal variant="fade-up" duration={0.7}>
          <section id="rechner" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
              <ScrollReveal variant="fade-up" delay={0.1}>
                <div className="text-center mb-10 sm:mb-14">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                    Berechnen Sie Ihre Regionalförderung
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                    In 4 Schritten erfahren Sie, wie viel nicht-rückzahlbaren Zuschuss Sie für Ihre geplante Investition erhalten können.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal variant="scale-up" delay={0.2} duration={0.75}>
                <ErrorBoundary inline>
                  <RWPCalculator2026 />
                </ErrorBoundary>
              </ScrollReveal>
            </div>
          </section>
        </ScrollReveal>

        {/* Was wird gefördert — von rechts einschieben */}
        <ScrollReveal variant="slide-left" duration={0.7}>
          <AssetsSection />
        </ScrollReveal>

        {/* Personalisierte Analyse — fade-up */}
        <ScrollReveal variant="fade-up" duration={0.65}>
          <ErrorBoundary inline>
            <PersonalizedBenefitsSection />
          </ErrorBoundary>
        </ScrollReveal>

        {/* Social Proof — von links einschieben */}
        <ScrollReveal variant="slide-right" duration={0.65}>
          <section className="py-10 sm:py-12 bg-white border-y border-slate-200">
            <GoogleReviewsSlider />
          </section>
        </ScrollReveal>

        {/* Unternehmenssuche — scale-up */}
        <ScrollReveal variant="scale-up" duration={0.6}>
          <ErrorBoundary inline>
            <CompanySearchSection />
          </ErrorBoundary>
        </ScrollReveal>

        {/* Experte — flip-up */}
        <ScrollReveal variant="flip-up" duration={0.75}>
          <ExpertSection />
        </ScrollReveal>

        {/* Förderquoten — von rechts einschieben */}
        <ScrollReveal variant="slide-left" duration={0.7} delay={0.05}>
          <FundingQuotesSection />
        </ScrollReveal>

        {/* Strategische Pfade — fade-up */}
        <ScrollReveal variant="fade-up" duration={0.65}>
          <StrategicPathsSection />
        </ScrollReveal>

        {/* Personal-Förderung — von links einschieben */}
        <ScrollReveal variant="slide-right" duration={0.7} delay={0.05}>
          <PersonnelFundingSection />
        </ScrollReveal>

        {/* Negativliste — scale-in */}
        <ScrollReveal variant="scale-in" duration={0.6}>
          <NegativlisteSection />
        </ScrollReveal>

        {/* Prozess — Stagger der einzelnen Steps */}
        <ScrollReveal variant="fade-up" duration={0.65}>
          <ProcessSectionRWP />
        </ScrollReveal>

        {/* FAQ — flip-up */}
        <ScrollReveal variant="flip-up" duration={0.7} delay={0.05}>
          <FAQMegaSection />
        </ScrollReveal>

      </main>
      <Footer />
      <ErrorBoundary inline>
        <StickyCTA />
      </ErrorBoundary>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            name: "Investitionsförderung Deutschland - Eskalator AG",
            url: "https://grw-rwp.eskalator.ag",
            description:
              "Bis zu 65% Investitionszuschuss für Maschinen, Gebäude und Digitalisierung. Keine Rückzahlung. Kostenlose Erstberatung.",
            areaServed: "DE",
            serviceType: "Investitionsförderung",
            telephone: "+49-208-780-125-78",
          }),
        }}
      />
    </div>
  )
}
