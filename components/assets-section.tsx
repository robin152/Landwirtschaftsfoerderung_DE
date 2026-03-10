"use client"

import { motion } from "framer-motion"
import { Check, ChevronRight } from "lucide-react"
import Image from "next/image"

const assets = [
  {
    title: "Premium-Tierhaltung & Stallbau",
    badge: "bis 40 %",
    badgeColor: "bg-emerald-600",
    description: "Stallumbauten für mehr Tierwohl: mehr Platz, natürliches Licht, frische Luft.",
    bullets: [
      "Min. 20 % mehr nutzbare Fläche als gesetzlich nötig",
      "Liegeboxen, Laufhöfe, Außenklimabereich",
      "Tierwohl-Premium: bis 40 % Zuschuss (Bayern 25 %)",
      "Kombination mit SIUK möglich: bis 50 %",
    ],
    image: "/images/assets/tierhaltung.jpg",
    span: "col-span-1 md:col-span-2",
    featured: true,
  },
  {
    title: "Klima- & Emissionsschutz (SIUK)",
    badge: "bis 75 %",
    badgeColor: "bg-teal-600",
    description: "Maßnahmen zur Reduktion von Ammoniak, Methan und CO₂ aus der Tierhaltung.",
    bullets: [
      "Abluftreinigung, Güllekühlung, Biogasanlagen",
      "Hessen & Brandenburg: bis 75 % SIUK-Fördersatz",
      "Bundesweit Kombi-Satz bis 50 %",
      "Gülleabdeckung bis 90 % (Saarland)",
    ],
    image: "/images/assets/klima.jpg",
    span: "col-span-1",
  },
  {
    title: "Gülle- & Festmistlager",
    badge: "bis 40 %",
    badgeColor: "bg-amber-600",
    description: "Neubau und Erweiterung von Lagern mit fester Abdeckung und ausreichend Kapazität.",
    bullets: [
      "Feste, gasdichte Abdeckung Pflicht für Höchstsatz",
      "Mind. 6 Monate Lagerkapazität über gesetzlichem Min.",
      "Bis 40 % Zuschuss auf förderfähige Baukosten",
      "Kombinierbar mit SIUK-Maßnahmen",
    ],
    image: "/images/assets/guelle.jpg",
    span: "col-span-1",
  },
  {
    title: "Weiche Kälbermatten",
    badge: "bis 40 %",
    badgeColor: "bg-orange-600",
    description: "Befristeter Bonus für tiergerechte Liege- und Tränkebereiche für Kälber.",
    bullets: [
      "Nur für Kälber unter 8 Monate",
      "+10 % Aufschlag in NRW befristet",
      "Einfacher Antrag, schnelle Bewilligung",
      "Mindestinvestition: 10.000 € (Ausnahme)",
    ],
    image: "/images/assets/kaelber.jpg",
    span: "col-span-1",
  },
  {
    title: "Präzisionstechnik & Bewässerung",
    badge: "bis 40 %",
    badgeColor: "bg-blue-600",
    description: "Modernste Technik für weniger Ressourcenverbrauch und mehr Ertragssicherheit.",
    bullets: [
      "GPS-Lenksysteme, Drohnen, Sensor-Technik",
      "Tröpfchen- & Unterfluranlagen: mind. 15 % Wassereinsparung",
      "Hagelschutznetze & Naturgefahrenvorsorge",
      "Keine selbstfahrenden Maschinen (ausgeschlossen)",
    ],
    image: "/images/assets/technik.jpg",
    span: "col-span-1",
  },
  {
    title: "Junglandwirt-Bonus",
    badge: "+10 %",
    badgeColor: "bg-rose-600",
    description: "Wer unter 40 ist und sich frisch niedergelassen hat, bekommt automatisch mehr.",
    bullets: [
      "Erstniederlassung max. 5 Jahre zurück",
      "+10 % auf den Basis-Fördersatz (max. 20.000 €)",
      "Gesamtsatz meist ≤ 50 % gedeckelt",
      "Bayern: Meister/Agrarbetriebswirt = Extrapunkte",
    ],
    image: "/images/assets/junglandwirt.jpg",
    span: "col-span-1",
  },
  {
    title: "Mobilställe & Freilandhaltung",
    badge: "bis 40 %",
    badgeColor: "bg-emerald-600",
    description: "Mobile Haltungssysteme für Geflügel und Weidetierhaltung — explizit förderfähig.",
    bullets: [
      "Mobile Hühner- & Geflügelställe",
      "Weidezelte, Außenweideanlagen",
      "Niedersachsen & MV: explizit in Richtlinie genannt",
      "Kombination mit Tierwohl-Premium möglich",
    ],
    image: "/images/assets/mobilstall.jpg",
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
            Qualifizierung
          </span>
          
          {/* TEMPLATE: Headline für Lead-Qualifizierung */}
          {/* ANLEITUNG: Headline sollte EINE Frage stellen: "Passt Ihr Vorhaben?" oder "Ist Ihre Investition förderbar?" */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Was wird gefördert – passt dein Vorhaben?
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Diese 7 Investitionstypen holt das AFP – klick deins an und sieh sofort deinen Fördersatz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`${asset.span} group relative overflow-hidden rounded-xl sm:rounded-2xl`}
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
                {/* Stronger gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-slate-900/10" />

                {/* Content */}
                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end gap-2">
                  {/* Badge */}
                  <span className={`self-start text-xs font-bold px-2.5 py-1 rounded-full text-white ${asset.badgeColor}`}>
                    {asset.badge}
                  </span>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{asset.title}</h3>

                  {/* Short description */}
                  <p className="text-sm text-slate-300 leading-snug">{asset.description}</p>

                  {/* Bullet list */}
                  <ul className="mt-1 space-y-1">
                    {asset.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-slate-200 leading-snug">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
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
            <span className="font-semibold text-slate-900">Dein Vorhaben ist dabei?</span>{" "}
            Dann berechne jetzt deinen genauen Förderbetrag – kostenlos & in 45 Sekunden.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
