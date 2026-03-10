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
  title: "AFP-Förderung 2023–2027 | Bis zu 50 % Zuschuss für Stallbau & Tierwohl | Patrick Starkmann",
  description:
    "Berechne in 45 Sekunden deinen staatlichen AFP-Zuschuss. Stallbau, Tierwohl, SIUK, Gülle – wir kennen alle Bundesland-Quoten. Kostenlose Prüfung durch AFP-Spezialist Patrick Starkmann.",
  generator: "v0.app",
  keywords:
    "AFP Förderung, Agrarinvestitionsförderungsprogramm, Stallbau Zuschuss, Tierwohl Förderung, SIUK, Güllelager Förderung, Landwirtschaft Förderung 2026, AFP Rechner, Junglandwirt Bonus",
  authors: [{ name: "Patrick Starkmann – AFP-Spezialist für Landwirtschaft" }],
  creator: "Patrick Starkmann",
  publisher: "AFP Landwirtschaftsförderung",
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
    siteName: "AFP-Förderung – Patrick Starkmann",
    title: "AFP-Förderung 2023–2027 | Bis zu 50 % Zuschuss für Stallbau & Tierwohl",
    description:
      "Berechne in 45 Sekunden deinen staatlichen AFP-Zuschuss. Kostenlose Prüfung durch AFP-Spezialist Patrick Starkmann.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AFP-Förderung 2023–2027 | Bis zu 50 % Zuschuss für Stallbau & Tierwohl",
    description: "Berechne in 45 Sekunden deinen staatlichen AFP-Zuschuss. Kostenlos & unverbindlich.",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png",  media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background`}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Analytics />
      </body>
    </html>
  )
}
