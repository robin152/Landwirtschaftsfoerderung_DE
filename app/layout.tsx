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
  title: "Förderung für die Landwirtschaft 2023–2027 | Bis zu 50 % Zuschuss für Stallbau & Tierwohl | Patrick Starkmann",
  description:
    "Berechnen Sie in 45 Sekunden Ihren staatlichen Zuschuss. Stallbau, Tierwohl, Emissionsschutz, Gülle – wir kennen alle Bundesland-Quoten. Kostenlose Prüfung durch Förderberater Patrick Starkmann.",
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
      "Berechnen Sie in 45 Sekunden Ihren staatlichen Zuschuss. Kostenlose Prüfung durch Förderberater Patrick Starkmann.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Förderung für die Landwirtschaft 2023–2027 | Bis zu 50 % Zuschuss für Stallbau & Tierwohl",
    description: "Berechnen Sie in 45 Sekunden Ihren staatlichen Zuschuss. Kostenlos & unverbindlich.",
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
