import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google"
import { ClientLayout } from "@/components/client-layout"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600", "700", "800"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Förderung für die Landwirtschaft 2023–2027 | Bis zu 50 % Zuschuss für Stallbau & Tierwohl | Patrick Starkmann",
  description:
    "Berechne in 45 Sekunden deinen staatlichen Zuschuss. Stallbau, Tierwohl, Emissionsschutz, Gülle – wir kennen alle Bundesland-Quoten. Kostenlose Prüfung durch Förderberater Patrick Starkmann.",
  generator: "v0.app",
  keywords:
    "Förderung Landwirtschaft, Agrarinvestitionsförderung, Stallbau Zuschuss, Tierwohl Förderung, Emissionsschutz Förderung, Güllelager Förderung, Landwirtschaft Förderung 2026, Förderrechner Landwirtschaft, Junglandwirt Bonus",
  authors: [{ name: "Patrick Starkmann – Spezialist für Subventionen in der Agrarwirtschaft" }],
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
    siteName: "Förderung für die Landwirtschaft – Patrick Starkmann",
    title: "Förderung für die Landwirtschaft 2023–2027 | Bis zu 50 % Zuschuss für Stallbau & Tierwohl",
    description:
      "Berechne in 45 Sekunden deinen staatlichen Zuschuss. Kostenlose Prüfung durch Förderberater Patrick Starkmann.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Förderung für die Landwirtschaft 2023–2027 | Bis zu 50 % Zuschuss für Stallbau & Tierwohl",
    description: "Berechne in 45 Sekunden deinen staatlichen Zuschuss. Kostenlos & unverbindlich.",
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
      <body className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background`}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Analytics />
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
