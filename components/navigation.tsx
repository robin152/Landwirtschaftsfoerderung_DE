"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X, Phone } from "lucide-react"
import { ContactFormModal } from "./contact-form-modal"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const navLinks = [
  { href: "#branchen", label: "Für Maschinenbauer" },
  { href: "#foerderrechner", label: "Förderrechner" },
  { href: "#frascati", label: "Ist mein Projekt förderfähig?" },
  { href: "#honorar", label: "Kosten & Ablauf" },
  { href: "#faq", label: "FAQ" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [marqueeVisible, setMarqueeVisible] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)
      setMarqueeVisible(scrollY < 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
    setIsMobileMenuOpen(false)
  }

  const navTopClass = marqueeVisible ? "top-[36px] sm:top-[40px]" : "top-0"

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.9)",
          boxShadow: isScrolled ? "0 1px 3px rgba(0, 0, 0, 0.08)" : "none",
        }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 right-0 z-50 backdrop-blur-md safe-area-top ${navTopClass}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <nav className="flex items-center justify-between py-2 sm:py-3">
            <motion.a href="#" whileHover={{ scale: 1.03 }} className="flex items-center group">
              <Image
                src="/eskalator-logo.webp"
                alt="Eskalator AG – Fortschritt. Fördern."
                width={180}
                height={44}
                className="h-9 sm:h-10 w-auto object-contain"
                priority
              />
            </motion.a>

            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  whileHover={{ color: "var(--color-accent)" }}
                  className="text-muted-foreground hover:text-accent transition-colors duration-300 text-sm font-medium"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:+49208780125778"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-accent transition-all group"
              >
                <Phone size={16} className="text-accent" />
                <span className="text-sm font-semibold">+49 208 780 125 78</span>
              </a>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:shadow-premium transition-all duration-300 font-semibold text-sm"
              >
                Anspruch prüfen
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </nav>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-border mt-2 rounded-lg shadow-premium mx-4 mb-4 overflow-hidden"
              >
                <div className="flex flex-col gap-1 p-4">
                  {navLinks.map((link, idx) => (
                    <motion.a
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-foreground hover:text-accent transition-colors duration-300 text-base font-medium py-3 px-4 rounded-lg hover:bg-muted"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                  <a
                    href="tel:+49208780125778"
                    className="flex items-center gap-3 hover:bg-muted text-accent py-3 px-4 rounded-lg mt-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone size={18} />
                    <span className="text-base font-semibold">+49 208 780 125 78</span>
                  </a>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsModalOpen(true)
                    }}
                    className="bg-accent text-accent-foreground border-0 hover:opacity-90 transition-opacity mt-3 h-12 text-base font-semibold rounded-lg w-full"
                  >
                    Anspruch prüfen
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
