"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Image from "next/image"

// ============================================
// TEMPLATE ANLEITUNG: ASSETS / FÖRDERUNGSFÄHIGE INVESTITIONEN
// ============================================
// SALES-FUNNEL STAGE: Aufmerksamkeit & Qualifizierung
// ZWECK: Besucher sollen schnell erkennen, ob ihre geplante Investition förderfähig ist
// VERKAUFSLOGIK: "Does our product fit your needs?" → Lead-Qualifizierung
// KONVERSIONSROUTE: ✓ Ja, meine Investition ist hier → Zu nächster Sektion
//                   ✗ Nein, nicht dabei → Kalkulator/Kontakt
// ============================================
//
// WAS REIN MUSS:
// - 6-8 förderfähige Investitionskategorien
// - Visuell ansprechende Icons/Bilder für jede Kategorie
// - Klare, sprechende Titel (nicht technisch)
// - 2-3 konkrete Beispiele pro Kategorie
// - 2-3 FEATURED-Items hervorheben (meist die mit höchster Förderquote)
//   → Gebäude, PV-Anlagen, Fertigungsanlagen (Automatisierung)
//
// BEISPIEL-STRUKTUR:
// {
//   title: "[INVESTITIONSTYP - verständlich]",
//   description: "[3-4 konkrete Beispiele, komma-getrennt]",
//   image: "/images/assets/[aussagekräftige-bild].jpg",
//   span: "col-span-1",           // oder "col-span-1 md:col-span-2" für Featured
//   featured: true,               // optional - Hervorhebung
// }
//
// VERKAUFS-TIPP:
// - Erste 2-3 Items sollten häufigste Investitionen sein (Maschinen, Gebäude)
// - Featured-Items = Höchste Förderquoten → Aufmerksamkeit maximieren
// - Alle Items sollten KONKRETE Beispiele haben (keine Abstraktion)

const assets = [
  {
    title: "[INVESTITIONSTYP 1]",
    description: "[Konkretes Beispiel 1], [Beispiel 2], [Beispiel 3]",
    image: "/images/assets/placeholder-1.jpg",
    span: "col-span-1",
  },
  {
    title: "[INVESTITIONSTYP 2 - FEATURED]",
    description: "[Konkretes Beispiel 1], [Beispiel 2]",
    image: "/images/assets/placeholder-2.jpg",
    span: "col-span-1 md:col-span-2",
    featured: true,
  },
  {
    title: "[INVESTITIONSTYP 3]",
    description: "[Konkretes Beispiel 1], [Beispiel 2], [Beispiel 3]",
    image: "/images/assets/placeholder-3.jpg",
    span: "col-span-1",
  },
  {
    title: "[INVESTITIONSTYP 4]",
    description: "[Konkretes Beispiel 1], [Beispiel 2]",
    image: "/images/assets/placeholder-4.jpg",
    span: "col-span-1",
  },
  {
    title: "[INVESTITIONSTYP 5]",
    description: "[Konkretes Beispiel 1], [Beispiel 2], [Beispiel 3]",
    image: "/images/assets/placeholder-5.jpg",
    span: "col-span-1",
  },
  {
    title: "[INVESTITIONSTYP 6]",
    description: "[Konkretes Beispiel 1], [Beispiel 2]",
    image: "/images/assets/placeholder-6.jpg",
    span: "col-span-1",
  },
  {
    title: "[INVESTITIONSTYP 7 - FEATURED]",
    description: "[Konkretes Beispiel 1], [Beispiel 2]",
    image: "/images/assets/placeholder-7.jpg",
    span: "col-span-1 md:col-span-2",
    featured: true,
  },
]

// JSX RENDER BLEIBT UNVERÄNDERT - NUR TEXTE AKTUALISIEREN
export function AssetsSection() {
  return (
    <section id="assets" className="py-16 sm:py-20 lg:py-28 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-full text-xs sm:text-sm font-semibold text-teal-600 mb-4">
            {/* TEMPLATE: Icon bleiben */}
            Qualifizierung
          </span>
          
          {/* TEMPLATE: Headline für Lead-Qualifizierung */}
          {/* ANLEITUNG: Headline sollte EINE Frage stellen: "Passt Ihr Vorhaben?" oder "Ist Ihre Investition förderbar?" */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            [HEADLINE: Schnell-Check für Lead-Qualifizierung]
          </h2>
          
          {/* TEMPLATE: Subheadline */}
          {/* ANLEITUNG: Kurzer, motivierender Text (max. 10 Wörter) */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            [SUBHEADLINE: Motivierender Text - warum diese Sektion relevant ist]
          </p>
        </motion.div>

        {/* Visual Asset Grid - Bento Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`${asset.span} group relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer`}
            >
              {/* Image Container */}
              <div className={`relative ${asset.featured ? "aspect-[16/9]" : "aspect-[4/3]"} overflow-hidden`}>
                <Image
                  src={asset.image}
                  alt={asset.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{asset.title}</h3>
                  <p className="text-sm text-slate-200 opacity-90">{asset.description}</p>
                </div>
                
                {/* Hover indicator */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Simple confirmation message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-12 text-center"
        >
          {/* TEMPLATE: Bottom CTA Copy */}
          {/* ANLEITUNG: 
             - Bestätigungs-Text für "Ja, passt" → Nächster Schritt
             - Kurz & actionable
             - Sollte Besucher zum nächsten Schritt motivieren (z.B. Kalkulator, Anfrage)
          */}
          <p className="text-slate-600 text-sm sm:text-base">
            <span className="font-semibold text-slate-900">[CONFIRMATION-TEXT: "Passt / Passt nicht"]</span>{" "}
            [CTA-TEXT: Was jetzt? Kalkulator? Kontakt?]
          </p>
        </motion.div>
      </div>
    </section>
  )
}
