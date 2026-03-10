"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadCaptureModal } from "./lead-capture-modal"

export function NavigationIndustrial() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      const sections = ["rechner", "assets", "foerder-ziele", "funding-quotes", "exclusions", "ablauf", "experte", "faq"]
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "Rechner", href: "#rechner", id: "rechner" },
    { label: "Was wird gefördert", href: "#assets", id: "assets" },
    { label: "Nicht förderfähig", href: "#exclusions", id: "exclusions" },
    { label: "Förderquoten", href: "#funding-quotes", id: "funding-quotes" },
    { label: "Ablauf", href: "#ablauf", id: "ablauf" },
    { label: "Experte", href: "#experte", id: "experte" },
    { label: "FAQ", href: "#faq", id: "faq" },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-[40px] sm:top-[44px] w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/98 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-100" 
            : "bg-slate-50/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-md shadow-green-700/20">
                <span className="text-white font-bold text-sm">AFP</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-slate-900 text-base leading-none">Landwirtschafts-</span>
                <span className="block text-slate-500 font-medium text-xs">förderung</span>
              </div>
            </a>

            {/* Desktop Nav - Pill Style */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center bg-slate-100/80 rounded-full p-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      activeSection === item.id
                        ? "text-green-700 bg-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Single CTA */}
            <div className="hidden lg:block">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="relative bg-green-700 hover:bg-green-600 text-white font-semibold px-6 py-2.5 rounded-full overflow-hidden transition-all group shadow-lg shadow-green-900/20"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Förderung kostenlos berechnen
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => document.getElementById("rechner")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-full text-sm"
              >
                Berechnen
              </Button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-slate-700" aria-hidden="true" /> : <Menu className="w-5 h-5 text-slate-700" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Bottom Sheet Style */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-slate-300 rounded-full" />
              </div>
              
              <div className="px-6 pb-8 pt-2">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-4 text-base font-medium rounded-xl transition-all ${
                        activeSection === item.id
                          ? "bg-green-50 text-green-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400" />
                    </a>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-semibold text-base"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      document.getElementById("rechner")?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    Förderung kostenlos berechnen
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <p className="text-center text-xs text-slate-500 mt-3">
                    Kostenlos &bull; Ohne Anmeldung
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
