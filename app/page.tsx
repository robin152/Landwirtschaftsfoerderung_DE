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
import { ErrorBoundary } from "@/components/error-boundary"
import { AFPRechner } from "@/components/afp-rechner"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ExclusionsSection } from "@/components/exclusions-section"
import { FoerderZieleSection } from "@/components/foerder-ziele-section"
import { FarmLifecycleSection } from "@/components/farm-lifecycle-section"
import { EskalatorTrustSection } from "@/components/eskalator-trust-section"
import { ProblemSection } from "@/components/problem-section"

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

        {/* Trust — Eskalator AG */}
        <EskalatorTrustSection />

        {/* Problem — emotionale Storyline */}
        <ProblemSection />

        {/* Förderziele — Lösung direkt anschliessend */}
        <ScrollReveal variant="fade-up" duration={0.6}>
          <FoerderZieleSection />
        </ScrollReveal>

        {/* Social Proof */}
        <ScrollReveal variant="fade-up" duration={0.6}>
          <section className="py-10 sm:py-12 bg-white border-y border-slate-200">
            <GoogleReviewsSlider />
          </section>
        </ScrollReveal>

        {/* Förderrechner */}
        <ScrollReveal variant="fade-up" duration={0.7}>
          <section id="rechner" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
              <ScrollReveal variant="fade-up" delay={0.1}>
                <div className="text-center mb-10 sm:mb-14">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                    In 45 Sekunden weißt du exakt, wie viel der Staat dir zahlt
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                    Live & brutal ehrlich – dein persönlicher Förderbetrag für Stall, Gülle, Tierwohl oder Klimaschutz.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal variant="scale-up" delay={0.2} duration={0.75}>
                <ErrorBoundary inline>
                  <AFPRechner />
                </ErrorBoundary>
              </ScrollReveal>
            </div>
          </section>
        </ScrollReveal>

        {/* Was wird gefördert */}
        <ScrollReveal variant="slide-left" duration={0.7}>
          <AssetsSection />
        </ScrollReveal>

        {/* Förderung nach Lebensphasen */}
        <ScrollReveal variant="fade-up" duration={0.7}>
          <FarmLifecycleSection />
        </ScrollReveal>

        {/* Experte */}
        <ScrollReveal variant="flip-up" duration={0.75}>
          <ExpertSection />
        </ScrollReveal>

        {/* Förderquoten */}
        <ScrollReveal variant="slide-left" duration={0.7} delay={0.05}>
          <FundingQuotesSection />
        </ScrollReveal>

        {/* Ausschlüsse — was NICHT gefördert wird */}
        <ScrollReveal variant="fade-up" duration={0.65}>
          <ExclusionsSection />
        </ScrollReveal>

        {/* Prozess */}
        <ScrollReveal variant="fade-up" duration={0.65}>
          <ProcessSectionRWP />
        </ScrollReveal>

        {/* FAQ */}
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
            name: "Förderung für die Landwirtschaft – Eskalator AG",
            url: "https://afp-foerderung.eskalator.ag",
            description:
              "Bis zu 75 % Zuschuss für Stallbau, Güllelager, Tierwohl und Klimaschutz. Förderung für die Landwirtschaft 2023–2027 bundesweit. Kostenloser Erstcheck in 45 Sekunden.",
            areaServed: "DE",
            serviceType: "Agrarinvestitionsförderung",
            telephone: "+49-208-780-125-78",
          }),
        }}
      />
    </div>
  )
}
