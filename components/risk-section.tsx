"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Clock, FileText, Scale, MapPin } from "lucide-react"

export function RiskSection() {
  const risks = [
    {
      icon: Clock,
      title: "Antrag VOR Investitionsbeginn",
      description:
        "Der Förderantrag muss zwingend vor Beginn der Investition gestellt werden. Bereits begonnene Projekte sind ausgeschlossen.",
      critical: true,
    },
    {
      icon: MapPin,
      title: "5 Jahre Standortbindung",
      description:
        "Geförderte Anlagen müssen mindestens 5 Jahre am Standort verbleiben. Bei Verlagerung droht Rückzahlung.",
      critical: true,
    },
    {
      icon: FileText,
      title: "Lückenlose Dokumentation",
      description:
        "Alle Nachweise, Verträge und Rechnungen müssen vollständig dokumentiert werden. Fehlende Unterlagen gefährden die Auszahlung.",
      critical: false,
    },
    {
      icon: Scale,
      title: "EU-Beihilferecht beachten",
      description: "Kumulierung mit anderen Förderungen ist begrenzt. Bestehende Beihilfen müssen angegeben werden.",
      critical: false,
    },
  ]

  return (
    <section id="risk" className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-orange-600 mb-4">
            Wichtige Hinweise
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Worauf Sie achten müssen</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Diese Fallstricke sollten Sie kennen, bevor Sie einen Antrag stellen.
          </p>
        </motion.div>

        {/* Risk Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Risiko
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Beschreibung
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Priorität
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {risks.map((risk, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${risk.critical ? "bg-orange-100" : "bg-slate-100"}`}
                        >
                          <risk.icon className={`w-5 h-5 ${risk.critical ? "text-orange-600" : "text-slate-600"}`} />
                        </div>
                        <span className="font-semibold text-slate-900">{risk.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-600 max-w-md">{risk.description}</td>
                    <td className="px-6 py-5 text-center">
                      {risk.critical ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          Kritisch
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                          Beachten
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
