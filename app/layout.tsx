import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ClientLayout } from "@/components/client-layout"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "65% Zuschuss vom Staat - Maschinen & Gebäude geschenkt | Eskalator AG",
  description:
    "Reform 2026: Der Staat zahlt bis zu 65% Ihrer Investition. Kein Kredit. Keine Rückzahlung. Jetzt kostenlos prüfen, ob Ihr Standort förderfähig ist.",
  generator: "v0.app",
  keywords:
    "Regional-Förderung, Investitionsförderung, 65% Zuschuss, Infrastruktur, Standortentscheidung, C-Gebiet, D-Gebiet, Klimaschutz-Bonus",
  authors: [{ name: "Eskalator AG" }],
  creator: "Eskalator AG",
  publisher: "Eskalator AG",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://grw-rwp.eskalator.ag"),
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://grw-rwp.eskalator.ag",
    siteName: "Eskalator AG - Regional-Förderung",
    title: "65% Zuschuss vom Staat - Maschinen & Gebäude geschenkt | Eskalator AG",
    description:
      "Reform 2026: Der Staat zahlt bis zu 65% Ihrer Investition. Kein Kredit. Keine Rückzahlung. Jetzt kostenlos prüfen lassen.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@eskalator_ag",
    title: "65% Zuschuss vom Staat - Maschinen & Gebäude geschenkt | Eskalator AG",
    description: "Reform 2026: Der Staat zahlt bis zu 65% Ihrer Investition. Kein Kredit. Keine Rückzahlung.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <head>
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-slate-50`}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Analytics />
      </body>
    </html>
  )
}
