"use client"

import { useState, useRef, useEffect, forwardRef } from "react"
import { ChevronDown, Phone, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Country data with flags, dial codes, and formatting
const countries = [
  { code: "DE", name: "Deutschland", dialCode: "+49", flag: "🇩🇪", format: "### ### #### ###", placeholder: "151 234 5678" },
  { code: "AT", name: "Österreich", dialCode: "+43", flag: "🇦🇹", format: "### ### #### ###", placeholder: "664 123 4567" },
  { code: "CH", name: "Schweiz", dialCode: "+41", flag: "🇨🇭", format: "## ### ## ## ###", placeholder: "79 123 45 67" },
  { code: "NL", name: "Niederlande", dialCode: "+31", flag: "🇳🇱", format: "# ## ## ## ## ###", placeholder: "6 12 34 56 78" },
  { code: "BE", name: "Belgien", dialCode: "+32", flag: "🇧🇪", format: "### ## ## ## ###", placeholder: "470 12 34 56" },
  { code: "FR", name: "Frankreich", dialCode: "+33", flag: "🇫🇷", format: "# ## ## ## ## ###", placeholder: "6 12 34 56 78" },
  { code: "PL", name: "Polen", dialCode: "+48", flag: "🇵🇱", format: "### ### ### ###", placeholder: "512 345 678" },
  { code: "CZ", name: "Tschechien", dialCode: "+420", flag: "🇨🇿", format: "### ### ### ###", placeholder: "601 234 567" },
  { code: "IT", name: "Italien", dialCode: "+39", flag: "🇮🇹", format: "### ### #### ###", placeholder: "312 345 6789" },
  { code: "GB", name: "Großbritannien", dialCode: "+44", flag: "🇬🇧", format: "#### ###### ###", placeholder: "7911 123456" },
]

// Format phone number based on country pattern
function formatPhoneNumber(value: string, format: string): string {
  const digits = value.replace(/\D/g, "")
  let result = ""
  let digitIndex = 0

  for (const char of format) {
    if (digitIndex >= digits.length) break
    if (char === "#") {
      result += digits[digitIndex]
      digitIndex++
    } else {
      result += char
    }
  }

  return result
}

// Parse phone number to get just digits
function parsePhoneNumber(value: string): string {
  return value.replace(/\D/g, "")
}

interface PhoneInputProps {
  value: string
  onChange: (value: string, fullNumber: string, isValid: boolean) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  showImportantBadge?: boolean
  autoFocus?: boolean
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, onFocus, onKeyDown, className = "", showImportantBadge = false, autoFocus = false }, ref) => {
    const [selectedCountry, setSelectedCountry] = useState(countries[0]) // Default: Germany
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [localValue, setLocalValue] = useState("")
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Parse incoming value if it has a dial code
    useEffect(() => {
      if (value) {
        // Check if value starts with a dial code
        for (const country of countries) {
          if (value.startsWith(country.dialCode)) {
            setSelectedCountry(country)
            const numberPart = value.slice(country.dialCode.length).replace(/\D/g, "")
            setLocalValue(formatPhoneNumber(numberPart, country.format))
            return
          }
        }
        // If no dial code found, just format the number
        setLocalValue(formatPhoneNumber(value, selectedCountry.format))
      }
    }, [])

    // Close dropdown on outside click
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const digits = parsePhoneNumber(rawValue)
      const formatted = formatPhoneNumber(digits, selectedCountry.format)
      setLocalValue(formatted)

      // Create full international number
      const fullNumber = `${selectedCountry.dialCode}${digits}`
      const isValid = digits.length >= 8 && digits.length <= 18

      onChange(formatted, fullNumber, isValid)
    }

    const handleCountrySelect = (country: typeof countries[0]) => {
      setSelectedCountry(country)
      setIsDropdownOpen(false)

      // Re-format existing number with new country format
      const digits = parsePhoneNumber(localValue)
      const formatted = formatPhoneNumber(digits, country.format)
      setLocalValue(formatted)

      const fullNumber = `${country.dialCode}${digits}`
      const isValid = digits.length >= 8 && digits.length <= 18
      onChange(formatted, fullNumber, isValid)

      // Focus input after selection
      inputRef.current?.focus()
    }

    const digits = parsePhoneNumber(localValue)
    const isValid = digits.length >= 8 && digits.length <= 15

    return (
      <div className="relative">
        {/* EXTREM WICHTIG Badge */}
        {showImportantBadge && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-3 left-4 z-10"
          >
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg">
              <AlertTriangle className="w-3 h-3" />
              EXTREM WICHTIG
            </span>
          </motion.div>
        )}

        <div
          className={`flex items-center border-2 rounded-xl overflow-hidden transition-all ${
            isValid && digits.length > 0
              ? "border-green-500 ring-2 ring-green-500/20 bg-green-50/30"
              : "border-slate-200 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/10"
          } ${className}`}
        >
          {/* Country selector button */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 px-3 py-4 bg-slate-50 hover:bg-slate-100 transition-colors border-r border-slate-200"
            >
              <span className="text-xl">{selectedCountry.flag}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Country dropdown */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 max-h-64 overflow-y-auto"
                >
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors ${
                        selectedCountry.code === country.code ? "bg-violet-50" : ""
                      }`}
                    >
                      <span className="text-xl">{country.flag}</span>
                      <span className="flex-1 text-sm text-slate-700 text-left">{country.name}</span>
                      <span className="text-sm text-slate-400">{country.dialCode}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dial code display */}
          <span className="px-2 text-slate-500 text-base font-medium bg-slate-50 py-4 border-r border-slate-200">
            {selectedCountry.dialCode}
          </span>

          {/* Phone input */}
          <div className="flex-1 relative">
            <input
              ref={(node) => {
                // Handle both refs
                inputRef.current = node
                if (typeof ref === "function") {
                  ref(node)
                } else if (ref) {
                  ref.current = node
                }
              }}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={localValue}
              onChange={handleInputChange}
              onFocus={onFocus}
              onKeyDown={onKeyDown}
              autoFocus={autoFocus}
              className="w-full px-4 py-4 text-base focus:outline-none bg-transparent touch-manipulation"
              placeholder={selectedCountry.placeholder}
            />
          </div>

          {/* Phone icon */}
          <div className="pr-4">
            <Phone className={`w-5 h-5 ${isValid && digits.length > 0 ? "text-green-500" : "text-slate-300"}`} />
          </div>
        </div>

        {/* Helper text */}
        {showImportantBadge && (
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            Für die schnellste Beratung erreichen wir Sie am besten mobil
          </p>
        )}
      </div>
    )
  }
)

PhoneInput.displayName = "PhoneInput"
