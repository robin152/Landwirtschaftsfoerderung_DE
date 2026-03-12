import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google"
import { ClientLayout } from "@/components/client-layout"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600", "700", "800"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Bis zu 50 % staatlicher Zuschuss für Ihren Hof | Förderung Landwirtschaft 2025–2027",
  description:
    "✅ Sichern Sie Ihren Familiennamen auf eigenem Grund. ✅ Wachsen Sie unabhängig von Bankkrediten. ✅ Bis zu 50 % Förderung für Stallbau, Tierwohl & Emissionsschutz. Jetzt kostenlos prüfen – 400+ Landwirte erfolgreich gefördert, 98 % Erfolgsquote.",
  keywords:
    "Förderung Landwirtschaft 2025, Agrarinvestitionsförderung, Stallbau Zuschuss, Tierwohl Förderung, AFP Förderung, Emissionsschutz Förderung, Güllelager Förderung, Landwirtschaft Förderung 2026, Förderrechner Landwirtschaft, Junglandwirt Bonus, staatliche Förderung Landwirt, Investitionsförderung Hof",
  authors: [{ name: "Patrick Starkmann – Spezialist für Agrarinvestitionsförderung" }],
  creator: "Patrick Starkmann",
  publisher: "Förderung für die Landwirtschaft – Eskalator AG",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://afp-foerderung.de"),
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://afp-foerderung.de",
    siteName: "AFP-Förderung | Patrick Starkmann",
    title: "Bis zu 50 % staatlicher Zuschuss für Ihren Hof – kostenlos prüfen",
    description:
      "✅ Familiennamen auf eigenem Grund sichern ✅ Unabhängig von Bankkrediten wachsen ✅ Risiko minimieren – 400+ Landwirte gefördert, 98 % Erfolgsquote. Jetzt Förderung berechnen.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "AFP-Förderung – Staatliche Zuschüsse für Landwirte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bis zu 50 % staatlicher Zuschuss für Ihren Hof – kostenlos prüfen",
    description:
      "✅ Stallbau, Tierwohl & Emissionsschutz fördern lassen. 400+ Landwirte, 98 % Erfolg. Jetzt Förderung berechnen.",
    images: ["/android-chrome-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for API endpoints */}
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://ipapi.co" />
        <link rel="dns-prefetch" href="https://asset-tidycal.b-cdn.net" />
        {/* Preconnect for Google Tag Manager - loads early for optimal tag firing */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background`}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Analytics />
        {/* JSON-LD Structured Data */}
        <Script
          id="structured-data-localbusiness"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "AFP-Förderung | Patrick Starkmann",
              "description": "Spezialist für staatliche Agrarinvestitionsförderung (AFP). Bis zu 50 % Zuschuss für Stallbau, Tierwohl & Emissionsschutz – kostenlose Prüfung für alle 16 Bundesländer.",
              "url": "https://afp-foerderung.de",
              "logo": "https://afp-foerderung.de/android-chrome-512x512.png",
              "image": "https://afp-foerderung.de/android-chrome-512x512.png",
              "areaServed": "DE",
              "knowsLanguage": "de",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "reviewCount": "47",
                "bestRating": "5"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Förderberatung Leistungen",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Kostenlose Förderprüfung",
                      "description": "In 45 Sekunden Ihren staatlichen Zuschuss berechnen – kostenlos & unverbindlich"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "AFP Stallbau Förderung",
                      "description": "Bis zu 50 % staatlicher Zuschuss für Stallbau und Hofentwicklung"
                    }
                  }
                ]
              }
            })
          }}
        />
        <Script
          id="structured-data-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Wie viel Förderung bekomme ich für Stallbau?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Über das Agrarinvestitionsförderungsprogramm (AFP) erhalten Landwirte bis zu 50 % staatlichen Zuschuss auf förderfähige Investitionen in Stallbau, Tierwohl und Emissionsschutz. Die genaue Quote hängt vom Bundesland und Investitionsschwerpunkt ab."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Ist die Förderberatung kostenlos?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, die erste Prüfung ist vollständig kostenlos und unverbindlich. In nur 45 Sekunden berechnen Sie Ihren individuellen Förderbetrag."
                  }
                },
                {
                  "@type": "Question",
                  "name": "In welchen Bundesländern ist die AFP-Förderung verfügbar?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Die AFP-Förderung ist in allen 16 deutschen Bundesländern verfügbar. Patrick Starkmann kennt die spezifischen Quoten und Anforderungen jedes Bundeslandes."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Welche Investitionen werden gefördert?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Gefördert werden Stallbau, Tierwohl-Maßnahmen, Emissionsschutz, Güllelager, Digitalisierung und weitere Betriebsverbesserungen. Junglandwirte erhalten einen zusätzlichen Bonus."
                  }
                }
              ]
            })
          }}
        />
        {/* Microsoft Clarity */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","vti4qkxhqq");`,
          }}
        />
      </body>
    </html>
  )
}
