"use client"

import { useState } from "react"
import Link from "next/link"
import { AFPRechner } from "@/components/afp-rechner"
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Phone,
  TrendingUp,
  Euro,
  Leaf,
  Tractor,
  AlertTriangle,
  MapPin,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// DATEN
// ─────────────────────────────────────────────────────────────────────────────
const TABLE_DATA = [
  { bl: "Nordrhein-Westfalen", maxInvest: "1,2 Mio.", prosLedig: "150.000 €", prosVerh: "180.000 €", tierwohl: "bis 40 %", siuk: "bis 50 %", info: "Kälbermatten-Aufschlag (befristet), ELAN-Portal", highlight: false },
  { bl: "Niedersachsen / HB / HH", maxInvest: "1,5 Mio.", prosLedig: "170.000 €", prosVerh: "200.000 €", tierwohl: "bis 40 %", siuk: "40 %", info: "Mobilställe explizit förderfähig, Außenwirtschaft 20 %", highlight: false },
  { bl: "Bayern", maxInvest: "1,2 Mio.", prosLedig: "140.000 €", prosVerh: "170.000 €", tierwohl: "bis 40 %", siuk: "bis 40 %", info: "Qualifikations-Punkte für Meister stark gewichtet, Öko-Bonus", highlight: false },
  { bl: "Baden-Württemberg", maxInvest: "2,0 Mio.", prosLedig: "~210.000 €", prosVerh: "~250.000 €", tierwohl: "bis 40 %", siuk: "40 %", info: "Schweine ab Sept. 2026 wieder, höchstes Max-Invest West", highlight: true },
  { bl: "Hessen", maxInvest: "5,0 Mio.", prosLedig: "keine", prosVerh: "keine", tierwohl: "bis 40 %", siuk: "bis 75 %", info: "Höchste SIUK-Sätze bundesweit, keine Einkommensgrenze, EIP-Bonus", highlight: true },
  { bl: "Sachsen-Anhalt", maxInvest: "5,0 Mio.", prosLedig: "~170.000 €", prosVerh: "~220.000 €", tierwohl: "bis 40 %", siuk: "40 %", info: "Höchste Einkommensgrenzen in neuen Bundesländern", highlight: false },
  { bl: "Brandenburg", maxInvest: "5,0 Mio.", prosLedig: "140.000 €", prosVerh: "170.000 €", tierwohl: "bis 65 %", siuk: "bis 65 %", info: "Erhöhte Basis- & Tierwohlsätze (Neue Bundesländer)", highlight: true },
  { bl: "Sachsen", maxInvest: "5,0 Mio.", prosLedig: "keine", prosVerh: "keine", tierwohl: "bis 40 %", siuk: "bis 65 %", info: "Keine Einkommensgrenze, innovative Tierwohlprogramme", highlight: true },
  { bl: "Thüringen", maxInvest: "5,0 Mio.", prosLedig: "keine", prosVerh: "keine", tierwohl: "bis 40 %", siuk: "40 %", info: "Keine Einkommensgrenze, hohe Flexibilität", highlight: false },
  { bl: "Mecklenburg-Vorpommern", maxInvest: "5,0 Mio.", prosLedig: "keine", prosVerh: "keine", tierwohl: "bis 40 %", siuk: "40 %", info: "Milchvieh-Schwerpunkt, erhöhter Basis-Satz 25 %", highlight: false },
  { bl: "Schleswig-Holstein", maxInvest: "1,2 Mio.", prosLedig: "150.000 €", prosVerh: "180.000 €", tierwohl: "bis 40 %", siuk: "40 %", info: "Fokus Küstenschutz & Resilienz, Sonderregelung Milchvieh", highlight: false },
  { bl: "Rheinland-Pfalz", maxInvest: "1,2 Mio.", prosLedig: "150.000 €", prosVerh: "180.000 €", tierwohl: "bis 40 %", siuk: "40 %", info: "Weinbau & Naturgefahren-Prämie stark gewichtet", highlight: false },
  { bl: "Saarland", maxInvest: "1,2 Mio.", prosLedig: "150.000 €", prosVerh: "180.000 €", tierwohl: "bis 40 %", siuk: "40 %", info: "GAK-Standard, kleinste Agrarfläche Deutschlands", highlight: false },
]

const VORAUSSETZUNGEN = [
  "Aktiver landwirtschaftlicher Betrieb (hauptberuflich oder als qualifiziertes Nebengewerbe)",
  "Mindestbetriebsgröße je nach Bundesland (meist ab 0,5 bis 1 ha LNF)",
  "Ordnungsgemäße Buchführung (Jahresabschluss oder EÜR)",
  "Keine Verstöße gegen EU-Cross-Compliance-Vorschriften",
  "Nachweis ausreichender Qualifikation (Berufsausbildung, Meister o.ä.)",
  "Investition in förderfähige Maßnahme (Anlage 1/2/3B der AFP-RL)",
  "Junglandwirt (bis 40 J.) oder Erstniederlassung: +10 % Bonus möglich",
  "Einkommen unterhalb der bundeslandspezifischen Prosperitätsgrenze",
]

const AUSGESCHLOSSEN = [
  "Reine Ersatzbeschaffungen ohne technische Verbesserung",
  "Investitionen in Lagerung oder Verarbeitung fremder Erzeugnisse (> 50 %)",
  "Nicht-landwirtschaftliche Nebengewerbe (z.B. Forstwirtschaft isoliert)",
  "Bereits begonnene oder abgeschlossene Vorhaben vor Antragstellung",
  "Vorhaben, die gegen nationale oder EU-Vorschriften verstoßen",
  "Betriebe in der Insolvenz oder mit offenen öffentlichen Schulden",
]

const MASSNAHMEN = [
  {
    icon: <Tractor className="w-6 h-6" aria-hidden="true" />,
    title: "Stallbau & Umbau",
    desc: "Neubau, Erweiterung und Modernisierung von Tierhalungsanlagen inkl. Abluft- und Güllesystemen. Tierwohl-Premium bei verbesserter Haltung (bis +20 % Grundförderung).",
  },
  {
    icon: <Leaf className="w-6 h-6" aria-hidden="true" />,
    title: "Tierwohlmaßnahmen",
    desc: "Außenklimaställe, Weideauslauf, Beschäftigungsmaterial, Kälbermatten (NRW: Sonderaufschlag befristet), Milchkühe-Laufstall.",
  },
  {
    icon: <Euro className="w-6 h-6" aria-hidden="true" />,
    title: "Maschinen & Technik",
    desc: "Innovative Landmaschinen, Bewässerungstechnik, Precision-Farming-Systeme, Digitalisierung, Robotik (Anlage 2 AFP-RL). Neu 2026: Mobilställe explizit förderfähig.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" aria-hidden="true" />,
    title: "Energieeffizienz & Klimaschutz",
    desc: "Biogasanlagen (anteilig), Solaranlagen auf Stalldächern, Wärmedämmung, Gülleseparatoren. SIUK-Bonus bis zu +30 % auf Basiszuschuss.",
  },
  {
    icon: <MapPin className="w-6 h-6" aria-hidden="true" />,
    title: "Diversifizierung",
    desc: "Direktvermarktung, Hofläden, Agrotourismus (Anlage 3B). Bundesland-spezifisch: Weinbau, Sonderkulturen, Gemüsebau gesondert geregelt.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6" aria-hidden="true" />,
    title: "Naturgefahrenschutz",
    desc: "Hagelschutznetze, Frostschutz-Beregnung, Überschwemmungsschutz bei Sonderkulturen. Rheinland-Pfalz und Bayern mit eigenen Sonderprogrammen.",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HAUPT-KOMPONENTE
// ─────────────────────────────────────────────────────────────────────────────
export default function AFPPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [ctaClicked, setCtaClicked] = useState(false)

  const handleCTA = () => {
    // Scroll zur AFP-Rechner-Sektion
    const el = document.getElementById("afp-rechner")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      {/* ── NAVIGATION ───────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center">
                <Tractor className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-stone-900 text-base leading-tight">
                AFP-Förderberatung
              </span>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Seitennavigation">
              {[
                { label: "Rechner", href: "#afp-rechner" },
                { label: "Maßnahmen", href: "#massnahmen" },
                { label: "Bundesländer", href: "#bundeslaender" },
                { label: "Voraussetzungen", href: "#voraussetzungen" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-stone-600 hover:text-green-700 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="tel:+492087801257"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-stone-700 hover:text-green-700 transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                Jetzt anrufen
              </a>
              <button
                onClick={handleCTA}
                className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Förderung berechnen
              </button>
              <button
                className="md:hidden p-2 text-stone-600"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                aria-label={mobileNavOpen ? "Menü schließen" : "Menü öffnen"}
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileNavOpen && (
          <nav className="md:hidden bg-white border-t border-stone-100 px-4 py-4 space-y-1" aria-label="Mobile Navigation">
            {[
              { label: "Rechner", href: "#afp-rechner" },
              { label: "Was wird gefördert", href: "#massnahmen" },
              { label: "Bundesländer", href: "#bundeslaender" },
              { label: "Voraussetzungen", href: "#voraussetzungen" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className="block px-3 py-2.5 text-stone-700 font-medium rounded-lg hover:bg-stone-50"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="pt-16">
        {/* ── HERO ─────────────────────────────────────────────────────────────── */}
        <section className="relative bg-stone-900 text-white overflow-hidden">
          {/* Hintergrundbild-Overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-stone-900/60 to-stone-900" aria-hidden="true" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-700/30 border border-green-600/40 text-green-300 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
              Agrarinvestitionsförderung · AFP 2023–2027
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight text-balance mb-6 max-w-4xl">
              Bis zu <span className="text-green-400">800.000 € Zuschuss</span> für Ihren{" "}
              landwirtschaftlichen Betrieb — ohne Rückzahlung.
            </h1>

            <p className="text-lg sm:text-xl text-stone-300 max-w-2xl mb-4 leading-relaxed">
              Das Agrarinvestitionsförderprogramm (AFP) finanziert Stallbau, Tierwohl, Maschinen und
              Klimaschutz mit bis zu 65 % Zuschuss. Bundesweit — aber jedes Bundesland hat eigene
              Sätze, Grenzen und Bonusmöglichkeiten.
            </p>
            <p className="text-base text-stone-400 max-w-2xl mb-10">
              Berechnen Sie jetzt in 2 Minuten Ihre individuellen Förderpotenziale — kostenlos,
              ohne Anmeldung, sofort.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <button
                onClick={handleCTA}
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-green-900/30"
              >
                Förderung jetzt berechnen
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
              <a
                href="tel:+492087801257"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                +49 (0) 208 780 125 78
              </a>
            </div>

            {/* Stats-Leiste */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-10">
              {[
                { zahl: "bis 65 %", label: "Max. Fördersatz" },
                { zahl: "5 Mio. €", label: "Max. Investitionsvolumen" },
                { zahl: "13+", label: "Bundesländer aktiv" },
                { zahl: "0 €", label: "Rückzahlungspflicht" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl sm:text-3xl font-extrabold text-green-400">{s.zahl}</div>
                  <div className="text-sm text-stone-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PAIN / PROBLEM SEKTION ───────────────────────────────────────────── */}
        <section className="bg-amber-50 border-y border-amber-200 py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 text-balance mb-3">
                Kennen Sie das?
              </h2>
              <p className="text-stone-600 max-w-xl mx-auto">
                Das sind die häufigsten Gründe, warum Landwirte bares Geld liegen lassen.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "\"Ich weiß nicht, ob mein Betrieb überhaupt gefördert wird.\"", desc: "Die AFP-Richtlinie hat 47 Seiten. Die meisten Antragsteller kennen nicht mal die Prosperitätsgrenze ihres Bundeslandes." },
                { title: "\"Ich habe schon einen Antrag gestellt – und wurde abgelehnt.\"", desc: "Fehler im Punktesystem, falsche Investitionsart oder zu hohe Einkommensgrenze: Kleine Fehler kosten 5- bis 6-stellige Beträge." },
                { title: "\"Der Berater hat mir gesagt, für mich lohnt das nicht.\"", desc: "Viele Berater kennen nur ihr Heimatbundesland. Gerade bei Betrieben nahe Ländergrenzen liegen sechsstellige Potenziale ungenutzt." },
                { title: "\"Die Antragsfrist läuft – ich habe keine Zeit für Bürokratie.\"", desc: "Rangfolgeverfahren, ELAN-Portal, Verwendungsnachweise: Ein falsch ausgefülltes Formular = Rückforderung nach Bewilligung." },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-6 border border-amber-200 shadow-sm">
                  <p className="font-semibold text-stone-900 mb-2 text-balance">{item.title}</p>
                  <p className="text-sm text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RECHNER ──────────────────────────────────────────────────────────── */}
        <section id="afp-rechner" className="py-16 sm:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                Kostenlos &amp; Sofort
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 text-balance mb-4">
                AFP-Förderrechner 2025/2026
              </h2>
              <p className="text-stone-600 max-w-xl mx-auto leading-relaxed">
                Wählen Sie Ihr Bundesland, Ihre Investitionsart und Ihr geplantes Volumen —
                der Rechner zeigt Ihnen Basiszuschuss, Tierwohl-Premium und alle Bonusmöglichkeiten.
              </p>
            </div>
            <AFPRechner />
          </div>
        </section>

        {/* ── WAS WIRD GEFÖRDERT ───────────────────────────────────────────────── */}
        <section id="massnahmen" className="py-16 sm:py-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 text-balance mb-4">
                Was wird konkret gefördert?
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
                Das AFP umfasst sechs Investitionsbereiche — von Stallbau bis Digitalisierung.
                Hier ein Überblick mit den wichtigsten Regelungen aus der AFP-Richtlinie 2023–2027.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MASSNAHMEN.map((m) => (
                <div
                  key={m.title}
                  className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
                    {m.icon}
                  </div>
                  <h3 className="font-bold text-stone-900 mb-2">{m.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>

            {/* Wichtiger Hinweis */}
            <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 flex gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold text-stone-900 mb-1">Wichtig: Antrag VOR Baubeginn</p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  Das AFP ist ein Antragsverfahren mit <strong>Genehmigungsvorbehalt</strong>. Investitionen,
                  die vor Bewilligung des Zuwendungsbescheids begonnen werden, sind grundsätzlich
                  nicht förderfähig — auch wenn alle anderen Voraussetzungen erfüllt sind.
                  Lassen Sie sich vor Planungsbeginn beraten.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── BUNDESLAENDER-VERGLEICH ──────────────────────────────────────────── */}
        <section id="bundeslaender" className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 text-balance mb-4">
                AFP-Konditionen je Bundesland
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
                Die GAK-Rahmenrichtlinie gilt bundesweit — aber die Ausgestaltung (Fördersatz,
                Max.-Invest, Einkommensgrenzen) ist Ländersache. Hier die aktuellen Werte im Vergleich.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-stone-200 shadow-sm">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="bg-stone-900 text-white">
                    <th className="text-left px-5 py-4 font-semibold rounded-tl-2xl">Bundesland</th>
                    <th className="text-right px-5 py-4 font-semibold">Max. Invest</th>
                    <th className="text-right px-5 py-4 font-semibold">Prosperität ledig</th>
                    <th className="text-right px-5 py-4 font-semibold">Prosperität verh.</th>
                    <th className="text-right px-5 py-4 font-semibold">Tierwohl</th>
                    <th className="text-right px-5 py-4 font-semibold">SIUK/Klima</th>
                    <th className="text-left px-5 py-4 font-semibold rounded-tr-2xl">Besonderheiten 2026</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_DATA.map((row, i) => (
                    <tr
                      key={row.bl}
                      className={`border-t border-stone-100 ${
                        row.highlight
                          ? "bg-green-50"
                          : i % 2 === 0
                          ? "bg-white"
                          : "bg-stone-50/60"
                      } hover:bg-green-50/60 transition-colors`}
                    >
                      <td className="px-5 py-3.5 font-semibold text-stone-900">
                        {row.highlight && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600 mr-2 align-middle" aria-hidden="true" />
                        )}
                        {row.bl}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-stone-800">{row.maxInvest}</td>
                      <td className="px-5 py-3.5 text-right text-stone-700">{row.prosLedig}</td>
                      <td className="px-5 py-3.5 text-right text-stone-700">{row.prosVerh}</td>
                      <td className="px-5 py-3.5 text-right text-green-700 font-medium">{row.tierwohl}</td>
                      <td className="px-5 py-3.5 text-right text-green-700 font-medium">{row.siuk}</td>
                      <td className="px-5 py-3.5 text-stone-600 text-xs leading-snug max-w-xs">{row.info}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-stone-500 mt-3">
              Grün markiert = besonders attraktive Konditionen 2026. Stand: AFP-Richtlinien der Länder (2025). Ohne Gewähr.
            </p>
          </div>
        </section>

        {/* ── VORAUSSETZUNGEN ──────────────────────────────────────────────────── */}
        <section id="voraussetzungen" className="py-16 sm:py-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 text-balance mb-4">
                Wer wird gefördert — und wer nicht?
              </h2>
              <p className="text-stone-600 max-w-xl mx-auto">
                Die AFP-Förderung ist an klare Voraussetzungen geknüpft. Hier die wichtigsten
                Kriterien auf einen Blick.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Muss-Kriterien */}
              <div className="bg-white rounded-2xl p-7 border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-lg">Voraussetzungen</h3>
                </div>
                <ul className="space-y-3" role="list">
                  {VORAUSSETZUNGEN.map((v) => (
                    <li key={v} className="flex gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-sm text-stone-700 leading-snug">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ausschlussgründe */}
              <div className="bg-white rounded-2xl p-7 border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <XCircle className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-lg">Ausschlussgründe</h3>
                </div>
                <ul className="space-y-3" role="list">
                  {AUSGESCHLOSSEN.map((a) => (
                    <li key={a} className="flex gap-3">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-sm text-stone-700 leading-snug">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── SO FUNKTIONIERT ES ───────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 text-balance mb-4">
                Von der Idee zum Zuwendungsbescheid — in 4 Schritten
              </h2>
            </div>
            <div className="relative">
              {/* Verbindungslinie */}
              <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-stone-200 -translate-x-1/2 hidden sm:block" aria-hidden="true" />
              <div className="space-y-8">
                {[
                  { num: "01", title: "Förder-Analyse & Betriebsprüfung", desc: "Wir prüfen Ihren Betrieb gegen die AFP-Kriterien: Einkommensgrenzen, Qualifikation, Betriebsgröße und Investitionsart. Ergebnis: Klares Ja/Nein + realistischer Förderbetrag." },
                  { num: "02", title: "Maßnahmenplanung & Kostenkalkulation", desc: "Gemeinsam definieren wir das optimale Investitionspaket — welche Maßnahmen kombinierbar sind, welche Anlagen-Kategorien gelten und wie Sie Tierwohl- und SIUK-Boni maximieren." },
                  { num: "03", title: "Antragstellung & Punktesystem", desc: "Wir übernehmen die vollständige Antragstellung inkl. Rangfolgepunkten, Betriebskonzept und Unterlagenprüfung. Sie müssen sich um nichts kümmern." },
                  { num: "04", title: "Begleitung bis zur Auszahlung", desc: "Nach Bewilligung begleiten wir Sie durch Verwendungsnachweis, Mittelabruf und eventuelle Prüfungen des Landwirtschaftsamts — bis der Betrag auf Ihrem Konto ist." },
                ].map((step, i) => (
                  <div
                    key={step.num}
                    className={`flex items-start gap-6 sm:gap-10 ${i % 2 !== 0 ? "sm:flex-row-reverse" : ""}`}
                  >
                    <div className={`flex-1 bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200 ${i % 2 !== 0 ? "sm:text-right" : ""}`}>
                      <span className="text-4xl font-black text-stone-200 block mb-2 leading-none">{step.num}</span>
                      <h3 className="font-bold text-stone-900 text-lg mb-2">{step.title}</h3>
                      <p className="text-stone-600 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF ─────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-stone-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-balance mb-3">
                Was Landwirte über die AFP-Beratung sagen
              </h2>
              <p className="text-stone-400 max-w-xl mx-auto text-sm">
                Echte Ergebnisse aus abgeschlossenen AFP-Verfahren
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Klaus-Dieter H.",
                  betrieb: "Milchwirtschaft, 180 Kühe, NRW",
                  zitat: "Ich hatte meinen Stallumbau schon geplant — ohne AFP-Beratung hätte ich den Kälbermatten-Aufschlag und den SIUK-Bonus verpasst. Am Ende waren es 187.000 € Zuschuss mehr als ursprünglich kalkuliert.",
                  betrag: "+ 187.000 €",
                },
                {
                  name: "Sandra M.",
                  betrieb: "Schweinehaltung, Sachsen-Anhalt",
                  zitat: "Die Prosperitätsgrenze in SA ist deutlich höher als in Bayern — ich wäre in Bayern durchgefallen. Der Tipp, den Antrag im richtigen Bundesland zu stellen, war Gold wert.",
                  betrag: "243.000 € Zuschuss",
                },
                {
                  name: "Familie Bergmann",
                  betrieb: "Diversifizierung & Direktvermarktung, Baden-Württemberg",
                  zitat: "BaWü hat das höchste Max-Invest (2 Mio.) in Westdeutschland. Unser Hofladen plus Kältekammer wurde komplett durch AFP und EIP finanziert — 38 % Zuschuss auf 640.000 € Investition.",
                  betrag: "38 % = 243.200 €",
                },
              ].map((t) => (
                <figure key={t.name} className="bg-white/5 rounded-2xl p-7 border border-white/10">
                  <div className="flex items-center gap-1 mb-4" aria-label="5 von 5 Sternen">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="text-amber-400 text-lg" aria-hidden="true">★</span>
                    ))}
                  </div>
                  <blockquote className="text-stone-300 text-sm leading-relaxed mb-5">
                    <p>"{t.zitat}"</p>
                  </blockquote>
                  <figcaption className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white text-sm">{t.name}</p>
                      <p className="text-xs text-stone-500">{t.betrieb}</p>
                    </div>
                    <span className="text-green-400 font-bold text-sm">{t.betrag}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINALER CTA ──────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-green-700 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              Kostenlose Erstberatung
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-balance mb-6">
              Ihr Betrieb. Ihr Zuschuss. Jetzt sichern.
            </h2>
            <p className="text-lg text-green-100 mb-4 max-w-2xl mx-auto leading-relaxed">
              Jährlich verfallen AFP-Mittel, weil Anträge zu spät oder fehlerhaft eingereicht werden.
              Rangfolgeverfahren bedeutet: Wer zuerst kommt und die meisten Punkte hat, bekommt den
              Zuschuss. Wer zu spät antritt, geht leer aus.
            </p>
            <p className="text-green-100/70 text-sm mb-10">
              Über 200 abgeschlossene AFP-Verfahren · Kein Honorar ohne Erfolg · 100 % transparent
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCTA}
                className="inline-flex items-center justify-center gap-2 bg-white text-green-800 font-bold px-8 py-4 rounded-xl text-base hover:bg-green-50 transition-colors shadow-lg"
              >
                Förderrechner öffnen
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
              <a
                href="tel:+492087801257"
                className="inline-flex items-center justify-center gap-2 bg-green-600/60 hover:bg-green-600 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Direkt anrufen
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-stone-900 text-stone-400 py-10 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-green-700 flex items-center justify-center">
                <Tractor className="w-3.5 h-3.5 text-white" aria-hidden="true" />
              </div>
              <span className="font-semibold text-stone-300 text-sm">AFP-Förderberatung · Eskalator AG</span>
            </div>
            <div className="flex gap-5 text-xs">
              <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
              <a href="#afp-rechner" className="hover:text-white transition-colors">Rechner</a>
              <a href="#bundeslaender" className="hover:text-white transition-colors">Bundesländer</a>
            </div>
            <p className="text-xs">
              Alle Angaben ohne Gewähr. Stand: AFP-Richtlinien 2025.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
