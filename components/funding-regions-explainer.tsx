"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { MapPin, HelpCircle, ArrowRight, CheckCircle2, Info, Phone } from "lucide-react"
import { LeadCaptureModal } from "./lead-capture-modal"

export function FundingRegionsExplainer() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section ref={containerRef} id="foerdergebiete-erklaerung" className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-sm font-semibold text-blue-600 mb-6">
              <HelpCircle className="w-4 h-4" />
              Einfach erklärt
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Was sind Fördergebiete?
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Deutschland ist in Förderregionen eingeteilt. Je strukturschwächer Ihr Standort, desto mehr Förderung erhalten Sie. Das ist politisch gewollt, um Investitionen in benachteiligte Regionen zu lenken.
            </p>
          </motion.div>

          {/* Visual Explainer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {/* C-Gebiet Card */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 p-8 overflow-hidden">
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">C</span>
              </div>
              <div className="mb-6">
                <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">C-Fördergebiet</h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">15–45%</div>
                <p className="text-sm text-slate-500">je nach Unternehmensgröße</p>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Strukturschwache Regionen wie das <strong>Ruhrgebiet</strong>, Teile von <strong>Niedersachsen</strong> und ganz <strong>Ostdeutschland</strong>. GU 15%, MU 25%, KU 35% + Klimabonus.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>Duisburg, Essen, Dortmund</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>Leipzig, Dresden, Chemnitz</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>Erfurt, Magdeburg, Rostock</span>
                </div>
              </div>
            </div>

            {/* C+-Gebiet Card */}
            <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/50 p-8 overflow-hidden">
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-600">C+</span>
              </div>
              <div className="mb-6">
                <div className="w-14 h-14 rounded-xl bg-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">C+-Gebiet</h3>
                <div className="text-3xl font-bold text-emerald-600 mb-1">25-45%</div>
                <p className="text-sm text-slate-500">je nach Unternehmensgr.</p>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                C-Gebiet mit <strong>Grenzzuschlag</strong> gem. Rn. 184 Regionalbeihilfeleitlinien. <strong>+10 PP</strong> auf den C-Satz.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>KU: 45% (C-Basis 35% + 10PP)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>MU: 35% (C-Basis 25% + 10PP)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>GU: 25% (C-Basis 15% + 10PP)</span>
                </div>
              </div>
            </div>

            {/* D-Gebiet Card */}
            <div className="relative bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-200/50 p-8 overflow-hidden">
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">D</span>
              </div>
              <div className="mb-6">
                <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">D-Fördergebiet</h3>
                <div className="text-3xl font-bold text-purple-600 mb-1">10–40%</div>
                <p className="text-sm text-slate-500">je nach Unternehmensgröße</p>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Übergangsgebiete mit leichter Strukturschwäche. GU 10%, MU 20%, KU 30% + Klimabonus. <strong>GU nur bei Transformation.</strong>
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>Teile von Hamm, Unna</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>Wesel, Kleve, Heinsberg</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>Ausgewählte Landkreise</span>
                </div>
              </div>
            </div>

            {/* Nicht-Fördergebiet Card */}
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-8 overflow-hidden">
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-400">—</span>
              </div>
              <div className="mb-6">
                <div className="w-14 h-14 rounded-xl bg-slate-400 flex items-center justify-center mb-4 shadow-lg shadow-slate-400/20">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Andere Programme</h3>
                <div className="text-3xl font-bold text-teal-500 mb-1">?</div>
                <p className="text-sm text-slate-500">individuelle Prüfung</p>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Wirtschaftsstarke Regionen wie <strong>München, Stuttgart, Frankfurt</strong>. Dieses Programm greift hier nicht – aber es gibt starke Alternativen wie Forschungszulage, KfW oder Landesprogramme!
              </p>
              <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-teal-800">
                    <strong>Lassen Sie sich beraten:</strong> Wir finden die passenden Förderprogramme für Ihren Standort!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 lg:p-10 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              Unsicher, ob Ihr Standort förderfähig ist?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Im kostenlosen Erstgespräch prüfen wir Ihre Postleitzahl und zeigen Ihnen genau, welche Förderquote für Ihren Investitionsstandort gilt — unverbindlich.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all"
              >
                Standort kostenlos prüfen
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <a 
                href="tel:+4920878012578"
                className="inline-flex items-center gap-2 px-6 py-4 text-slate-300 hover:text-white font-medium transition-colors"
              >
                <Phone className="w-5 h-5" />
                Oder direkt anrufen
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
