import { NextRequest, NextResponse } from "next/server"
import { 
  CONDITIONAL_LIST, 
  NEGATIVE_LIST,
  SPECIAL_INDUSTRY_LIST,
  checkEligibilityByIndustry,
  checkSpecialIndustry,
  type EligibilityResult,
  type SpecialIndustryEntry
} from "@/lib/rwp-eligibility-lists"

interface CompanyData {
  name: string
  address: string
  plz: string
  city: string
  website: string | null
  industry: string
  types: string[]
}

// Branchen-Keywords die typischerweise NICHT auf der Negativliste stehen
// (für schnellen Vorab-Check, bevor die vollständige Negativliste geprüft wird)
const KNOWN_ELIGIBLE_KEYWORDS = [
  "Maschinenbau", "Anlagenbau", "Metallverarbeitung", "CNC", "Werkzeugbau",
  "Automobilzulieferer", "Fahrzeugbau", "Elektrotechnik", "Elektronik",
  "Medizintechnik", "Pharma", "Chemie", "Kunststofftechnik", "Kunststoffverarbeitung",
  "Lebensmittelproduktion", "Nahrungsmittel", "Getränkeherstellung",
  "Textilproduktion", "Textilherstellung", "Holzverarbeitung", "Möbelproduktion",
  "Papierherstellung", "Verpackung", "Logistik",
  "IT-Dienstleistungen", "Softwareentwicklung", "Rechenzentrum", "Hosting",
  "Biotechnologie", "Forschung", "Entwicklung", "Labor",
  "Luft- und Raumfahrt", "Schiffbau", "Schienenfahrzeugbau",
  "Umwelttechnik", "Recycling", "Entsorgung",
  "Glas", "Keramik", "Baustoffe", "Betonfertigteile",
  "Gießerei", "Schmiedetechnik", "Oberflächentechnik", "Galvanik",
  "Optik", "Feinmechanik", "Messtechnik", "Sensortechnik",
  "Produktion", "Fertigung", "Herstellung", "Manufacturing",
  "Industrie", "Verarbeitung", "Technik", "Engineering"
]

const CONDITIONAL_KEYWORDS = [
  { 
    industry: "Handwerk", 
    condition: "Förderfähig wenn überregionaler Absatz (>50% außerhalb 50km-Radius)",
    checkQuestion: "Liefern Sie mehr als 50% Ihrer Produkte/Leistungen außerhalb eines 50km-Radius?"
  },
  { 
    industry: "Bauwesen", 
    condition: "Förderfähig wenn Spezialbau mit überregionalem Absatz",
    checkQuestion: "Sind Sie im Spezialbau tätig mit Projekten außerhalb der Region?"
  },
  { 
    industry: "Druckerei", 
    condition: "Förderfähig wenn überwiegend für gewerbliche Kunden (B2B) tätig",
    checkQuestion: "Sind mehr als 50% Ihrer Kunden gewerbliche Abnehmer?"
  },
  { 
    industry: "Großhandel", 
    condition: "Förderfähig wenn überregionaler Vertrieb an gewerbliche Abnehmer (>50% außerhalb der Region)",
    checkQuestion: "Erzielen Sie mehr als 50% Ihres Umsatzes mit Kunden außerhalb Ihrer Region?"
  },
  { 
    industry: "Ingenieurbüro", 
    condition: "Förderfähig (Architekturbüros ausgenommen)",
    checkQuestion: "Handelt es sich um ein Ingenieurbüro oder technisches Labor (kein Architekturbüro)?"
  },
  {
    industry: "Werbeagentur",
    condition: "Förderfähig wenn überwiegend für gewerbliche Kunden (B2B) und überregionaler Kundenkreis",
    checkQuestion: "Arbeiten Sie überwiegend für gewerbliche Kunden aus mehreren Regionen?"
  },
  {
    industry: "Arzt",
    condition: "Nur bei Primäreffekt. Nur mit Nachweis überregionaler Bedeutung (Spezialisierung/Einzugsgebiet >50km).",
    checkQuestion: "Haben Sie eine Spezialisierung mit Patienten aus einem Einzugsgebiet von mehr als 50km?"
  },
  {
    industry: "Physiotherapie",
    condition: "Nur bei Primäreffekt. Nur mit Nachweis überregionaler Bedeutung (Spezialisierung/Einzugsgebiet >50km).",
    checkQuestion: "Haben Sie eine Spezialisierung mit Patienten aus einem Einzugsgebiet von mehr als 50km?"
  },
  {
    industry: "Praxis",
    condition: "Nur bei Primäreffekt. Nur mit Nachweis überregionaler Bedeutung (Spezialisierung/Einzugsgebiet >50km).",
    checkQuestion: "Haben Sie eine Spezialisierung mit Patienten aus einem Einzugsgebiet von mehr als 50km?"
  },
  {
    industry: "Reparatur",
    condition: "Förderfähig wenn überwiegend für produzierende Unternehmen tätig",
    checkQuestion: "Arbeiten Sie überwiegend für produzierende Unternehmen?"
  },
  {
    industry: "Logistikzentrum",
    condition: "Förderfähig wenn überregionale Bedeutung nachgewiesen",
    checkQuestion: "Bedienen Sie Kunden aus mehreren Bundesländern oder international?"
  }
]

// Helper function to fetch a webpage with robust error handling and fallbacks
async function fetchWebpage(url: string): Promise<string | null> {
  // Common headers that mimic a real browser
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "max-age=0"
  }

  // Build URL variants to try (https first, then http, then www variants)
  const urlVariants: string[] = []
  let baseUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "")
  
  // Remove www if present for base
  const withoutWww = baseUrl.replace(/^www\./, "")
  const withWww = baseUrl.startsWith("www.") ? baseUrl : `www.${baseUrl}`
  
  // Try HTTPS first (most common), then HTTP fallback
  urlVariants.push(`https://${withoutWww}`)
  urlVariants.push(`https://${withWww}`)
  urlVariants.push(`http://${withoutWww}`)
  urlVariants.push(`http://${withWww}`)

  for (const fullUrl of urlVariants) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(fullUrl, {
        headers,
        signal: controller.signal,
        redirect: "follow",
        // @ts-expect-error - Next.js specific option
        cache: "no-store"
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const text = await response.text()
        // Verify we got actual HTML content (not error page)
        if (text.length > 500 && (text.includes("<html") || text.includes("<body") || text.includes("<div"))) {
          return text
        }
      }
    } catch {
      // Continue to next URL variant
      continue
    }
  }
  
  return null
}

// Helper to extract clean text from HTML
function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
}

// Helper to find impressum link in HTML (German legal pages with owner/company info)
function findImpressumLink(html: string, baseUrl: string): string | null {
  // Multiple patterns to find impressum/legal page links - prioritized by information quality
  const patterns = [
    /href=["']([^"']*impressum[^"']*)["']/i,           // Primary: German legal requirement
    /href=["']([^"']*imprint[^"']*)["']/i,             // English variant
    /href=["']([^"']*rechtliches[^"']*)["']/i,         // Legal section
    /href=["']([^"']*legal[^"']*)["']/i,               // English legal
    /href=["']([^"']*kontakt[^"']*)["']/i,             // Contact often has similar info
    /href=["']([^"']*ueber-uns[^"']*)["']/i,           // About us
    /href=["']([^"']*about[^"']*)["']/i,               // English about
    /href=["']([^"']*datenschutz[^"']*)["']/i,         // Privacy (sometimes has company info)
  ]
  
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      let link = match[1]
      if (link.startsWith("#")) continue
      
      if (link.startsWith("/")) {
        try {
          const base = new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`)
          link = `${base.protocol}//${base.host}${link}`
        } catch {
          link = `https://${baseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}${link}`
        }
      } else if (!link.startsWith("http")) {
        link = `${baseUrl.replace(/\/$/, "")}/${link}`
      }
      
      return link
    }
  }
  
  return null
}

// Find relevant subpages (products, services, about, locations, references) for deeper analysis
function findRelevantLinks(html: string, baseUrl: string): { type: string; url: string }[] {
  const linkPatterns = [
    { type: "products", patterns: [/href=["']([^"']*produkt[^"']*)["']/gi, /href=["']([^"']*product[^"']*)["']/gi, /href=["']([^"']*sortiment[^"']*)["']/gi, /href=["']([^"']*portfolio[^"']*)["']/gi] },
    { type: "services", patterns: [/href=["']([^"']*leistung[^"']*)["']/gi, /href=["']([^"']*service[^"']*)["']/gi, /href=["']([^"']*angebot[^"']*)["']/gi, /href=["']([^"']*loesungen[^"']*)["']/gi] },
    { type: "about", patterns: [/href=["']([^"']*ueber[^"']*)["']/gi, /href=["']([^"']*about[^"']*)["']/gi, /href=["']([^"']*unternehmen[^"']*)["']/gi, /href=["']([^"']*firma[^"']*)["']/gi, /href=["']([^"']*wir[^"']*)["']/gi] },
    { type: "technology", patterns: [/href=["']([^"']*techno[^"']*)["']/gi, /href=["']([^"']*maschine[^"']*)["']/gi, /href=["']([^"']*fertigung[^"']*)["']/gi, /href=["']([^"']*kompetenz[^"']*)["']/gi] },
    { type: "locations", patterns: [/href=["']([^"']*standort[^"']*)["']/gi, /href=["']([^"']*location[^"']*)["']/gi, /href=["']([^"']*niederlassung[^"']*)["']/gi, /href=["']([^"']*werk[^"']*)["']/gi] },
    { type: "references", patterns: [/href=["']([^"']*referenz[^"']*)["']/gi, /href=["']([^"']*kunden[^"']*)["']/gi, /href=["']([^"']*projekt[^"']*)["']/gi, /href=["']([^"']*branchen[^"']*)["']/gi] },
  ]
  
  const foundLinks: { type: string; url: string }[] = []
  const seenUrls = new Set<string>()
  
  for (const { type, patterns } of linkPatterns) {
    for (const pattern of patterns) {
      let match: RegExpExecArray | null
      while ((match = pattern.exec(html)) !== null) {
        if (match[1] && !match[1].startsWith("#") && !match[1].includes("javascript")) {
          let link = match[1]
          
          // Resolve relative URLs
          if (link.startsWith("/")) {
            try {
              const base = new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`)
              link = `${base.protocol}//${base.host}${link}`
            } catch {
              link = `https://${baseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}${link}`
            }
          } else if (!link.startsWith("http")) {
            link = `${baseUrl.replace(/\/$/, "")}/${link}`
          }
          
          // Avoid duplicates and external links
          if (!seenUrls.has(link) && link.includes(baseUrl.replace(/^https?:\/\//, "").split("/")[0])) {
            seenUrls.add(link)
            foundLinks.push({ type, url: link })
          }
        }
      }
    }
    // Only take first 2 links per type
    if (foundLinks.filter(l => l.type === type).length >= 2) continue
  }
  
  // Limit total links to prevent too many requests (increased for comprehensive analysis)
  return foundLinks.slice(0, 8)
}

// Call Gemini API
async function callGemini(apiKey: string, prompt: string): Promise<string | null> {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
  
  try {
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 3000 }
      })
    })
    
    if (!response.ok) return null
    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null
  } catch {
    return null
  }
}

// Check eligibility against lists
function checkEligibility(industry: string): { 
  status: "positive" | "conditional" | "negative" | "special", 
  reason?: string,
  condition?: string,
  checkQuestion?: string,
  specialIndustry?: SpecialIndustryEntry
} {
  const industryLower = industry.toLowerCase()
  
  // FIRST: Check for special industries (like agriculture) that have ALTERNATIVE funding
  // These are treated as POSITIVE with special messaging
  const specialMatch = checkSpecialIndustry(industry)
  if (specialMatch) {
    return { 
      status: "special",
      reason: specialMatch.message,
      specialIndustry: specialMatch
    }
  }
  
  // Check negative list (using description field from official list)
  for (const neg of NEGATIVE_LIST) {
    if (industryLower.includes(neg.description.toLowerCase()) || 
        neg.description.toLowerCase().includes(industryLower)) {
      return { status: "negative", reason: neg.reason }
    }
  }
  
  // Also check against common negative keywords (but NOT landwirtschaft - that's special!)
  const negativeKeywords = ["gastronomie", "restaurant", "café", "bar", "einzelhandel", "laden", "shop", "friseur", "kosmetik", "finanzdienstleistung", "versicherung", "bank", "immobilien", "makler", "rechtsanwalt", "steuerberater", "notar"]
  for (const keyword of negativeKeywords) {
    if (industryLower.includes(keyword)) {
      const matchedNeg = NEGATIVE_LIST.find(n => n.description.toLowerCase().includes(keyword) || keyword.includes(n.description.toLowerCase()))
      return { 
        status: "negative", 
        reason: matchedNeg?.reason || "Diese Branche bedient primär lokale Kunden und ist daher nicht für die Regionalförderung förderfähig."
      }
    }
  }
  
  // Check conditional list (using description field)
  for (const cond of CONDITIONAL_LIST) {
    if (industryLower.includes(cond.description.toLowerCase()) ||
        cond.description.toLowerCase().includes(industryLower)) {
      return { 
        status: "conditional", 
        condition: cond.condition,
        checkQuestion: cond.checkQuestion
      }
    }
  }
  
  // Also check CONDITIONAL_KEYWORDS for broader matching
  for (const cond of CONDITIONAL_KEYWORDS) {
    if (industryLower.includes(cond.industry.toLowerCase()) ||
        cond.industry.toLowerCase().includes(industryLower)) {
      return { 
        status: "conditional", 
        condition: cond.condition,
        checkQuestion: cond.checkQuestion
      }
    }
  }
  
  // Schnell-Check: Bekannte förderfähige Branchen (nicht auf Negativliste)
  for (const keyword of KNOWN_ELIGIBLE_KEYWORDS) {
    if (industryLower.includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(industryLower)) {
      return { status: "positive" }
    }
  }
  
  // Neue Logik: Es gibt nur noch eine Negativliste.
  // Alles was NICHT auf der Negativliste steht = grundsätzlich förderfähig
  // (ggf. mit Primäreffekt-Nachweis: >50% Umsatz außerhalb 50km-Radius)
  return { 
    status: "positive",
    condition: "",
    checkQuestion: ""
  }
}

// Sanitize the analysis object to ensure all fields have safe defaults
// This prevents client-side crashes from missing or malformed data
function sanitizeAnalysis(analysis: any): any {
  if (!analysis) return null

  // Ensure investmentIdeas is always an array of proper objects
  if (Array.isArray(analysis.investmentIdeas)) {
    analysis.investmentIdeas = analysis.investmentIdeas.map((idea: any) => {
      // Handle case where idea is a plain string instead of object
      if (typeof idea === "string") {
        return {
          title: idea,
          description: `Potenzielle Investition im Bereich ${idea}.`,
          estimatedInvestment: "Auf Anfrage",
          potentialFunding: "Wird individuell berechnet",
          fundingPath: "Wird im Gespräch ermittelt"
        }
      }
      // Ensure all required fields exist on the object
      return {
        title: idea?.title || "Investitionsvorschlag",
        description: idea?.description || "",
        estimatedInvestment: idea?.estimatedInvestment || "Auf Anfrage",
        potentialFunding: idea?.potentialFunding || "Wird individuell berechnet",
        fundingPath: idea?.fundingPath || "Wird im Gespräch ermittelt"
      }
    })
  } else {
    analysis.investmentIdeas = []
  }

  // Ensure companyProfile has safe defaults
  if (analysis.companyProfile) {
    analysis.companyProfile = {
      summary: analysis.companyProfile.summary || "",
      industry: analysis.companyProfile.industry || "",
      mainActivity: analysis.companyProfile.mainActivity || "",
      products: Array.isArray(analysis.companyProfile.products) ? analysis.companyProfile.products : [],
      employeeEstimate: analysis.companyProfile.employeeEstimate || "Unbekannt",
      companyType: analysis.companyProfile.companyType || "KMU",
      ...analysis.companyProfile
    }
  }

  // Ensure fundingPotential has safe defaults if present
  if (analysis.fundingPotential) {
    analysis.fundingPotential = {
      maxQuote: analysis.fundingPotential.maxQuote ?? 30,
      baseQuote: analysis.fundingPotential.baseQuote ?? 30,
      regionalBonus: analysis.fundingPotential.regionalBonus ?? 0,
      climateBonus: analysis.fundingPotential.climateBonus ?? 0,
      foerdergebiet: analysis.fundingPotential.foerdergebiet || "Standardgebiet",
      eligibilityScore: analysis.fundingPotential.eligibilityScore ?? 70,
      ...analysis.fundingPotential
    }
  }

  // Ensure personalizedMessage is a string
  if (typeof analysis.personalizedMessage !== "string") {
    analysis.personalizedMessage = ""
  }

  // Ensure nextSteps is an array of strings
  if (!Array.isArray(analysis.nextSteps)) {
    analysis.nextSteps = []
  }

  return analysis
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
  }

  try {
    const { company } = await request.json() as { company: CompanyData }

    if (!company) {
      return NextResponse.json({ error: "Company data required" }, { status: 400 })
    }

    // Determine funding region via n8n webhook (replaces old PLZ-prefix logic)
    const { fetchFoerdergebiet } = await import("@/app/api/foerdergebiet/route")
    const webhookResult = await fetchFoerdergebiet(company.plz || "00000")
    
    const foerdergebiet = webhookResult.foerdergebiet
    const foerdergebietCode = webhookResult.code // N, C, C+, D
    const regionalBonus = webhookResult.regionalBonus
    const foerdergebietError = webhookResult.source === "error" ? webhookResult.error : null

    let homepageContent = ""
    let impressumContent = ""
    let additionalPagesContent = ""  // Content from products, services, about pages
    let ownerName: string | null = null
    let ownerFirstName: string | null = null
    let ownerRole: string | null = null
    let companyDescription = ""
    
    const vagueIndustries = ["establishment", "point_of_interest", "business", "company", "sonstig", "sonstiges", "andere", ""]
    const needsIndustryDetection = vagueIndustries.some(v => company.industry?.toLowerCase().includes(v)) || !company.industry
    let detectedIndustry = needsIndustryDetection ? "" : company.industry
    
    // Step 1: Fetch homepage and subpages if available
    if (company.website) {
      const homepageHtml = await fetchWebpage(company.website)
      
      if (homepageHtml) {
        homepageContent = extractTextFromHtml(homepageHtml)
        
        // Find links first (fast, no network)
        const impressumLink = findImpressumLink(homepageHtml, company.website)
        const relevantLinks = findRelevantLinks(homepageHtml, company.website)
        
        // Fetch ALL pages in parallel (impressum + subpages) for maximum speed
        const allFetchPromises: Promise<{ type: string; content: string | null }>[] = []
        
        // Add impressum fetch
        if (impressumLink) {
          allFetchPromises.push(
            fetchWebpage(impressumLink).then(html => ({
              type: "impressum",
              content: html ? extractTextFromHtml(html) : null
            }))
          )
        }
        
        // Add subpage fetches (up to 6)
        const pagesToFetch = relevantLinks.slice(0, 6)
        for (const { type, url } of pagesToFetch) {
          allFetchPromises.push(
            fetchWebpage(url).then(html => ({
              type,
              content: html ? extractTextFromHtml(html).substring(0, 3000) : null
            }))
          )
        }
        
        // Execute all fetches in parallel
        const allResults = await Promise.all(allFetchPromises)
        
        // Process results
        const pageContents: string[] = []
        for (const result of allResults) {
          if (result.content) {
            if (result.type === "impressum") {
              impressumContent = result.content
            } else {
              pageContents.push(`=== ${result.type.toUpperCase()} SEITE ===\n${result.content}`)
            }
          }
        }
        
        additionalPagesContent = pageContents.join("\n\n")
        
        // Extract owner from impressum
        if (impressumContent) {
          const ownerPrompt = `Extrahiere aus diesem Impressum den Geschäftsführer/Inhaber.

IMPRESSUM:
${impressumContent.substring(0, 4000)}

Suche nach diesen Begriffen (in dieser Priorität):
1. Geschäftsführer, Geschäftsführerin
2. Inhaber, Inhaberin
3. Vertretungsberechtigter
4. Verantwortlich gemäß § 55 RStV
5. CEO, Managing Director
6. Gesellschafter

WICHTIG: Extrahiere den VOLLSTÄNDIGEN Namen (Vorname UND Nachname).
Bei Titeln wie "Dr." oder "Dipl.-Ing." diese NICHT in den Vornamen aufnehmen.

Antworte EXAKT in diesem Format:
VORNAME: Max
NACHNAME: Mustermann
VOLLNAME: Max Mustermann
ROLLE: Geschäftsführer
ANREDE: Herr

Wenn kein Name gefunden:
VORNAME: NICHT_GEFUNDEN
NACHNAME: NICHT_GEFUNDEN
VOLLNAME: NICHT_GEFUNDEN
ROLLE: NICHT_GEFUNDEN
ANREDE: NICHT_GEFUNDEN`

          const ownerResponse = await callGemini(apiKey, ownerPrompt)
          
          if (ownerResponse) {
            const vornameMatch = ownerResponse.match(/VORNAME:\s*(.+?)(?:\n|$)/i)
            const nachnameMatch = ownerResponse.match(/NACHNAME:\s*(.+?)(?:\n|$)/i)
            const vollnameMatch = ownerResponse.match(/VOLLNAME:\s*(.+?)(?:\n|$)/i)
            const roleMatch = ownerResponse.match(/ROLLE:\s*(.+?)(?:\n|$)/i)
            const anredeMatch = ownerResponse.match(/ANREDE:\s*(.+?)(?:\n|$)/i)
            
            if (vollnameMatch && !vollnameMatch[1].includes("NICHT_GEFUNDEN")) {
              ownerName = vollnameMatch[1].trim()
            }
            if (vornameMatch && !vornameMatch[1].includes("NICHT_GEFUNDEN")) {
              ownerFirstName = vornameMatch[1].trim()
            } else if (ownerName) {
              // Fallback: Extract first name from full name
              ownerFirstName = ownerName.split(" ")[0]
            }
            if (roleMatch && !roleMatch[1].includes("NICHT_GEFUNDEN")) {
              ownerRole = roleMatch[1].trim()
            }
          }
        }
      }
    }
    
    // Combine all website content for comprehensive analysis
    const fullWebsiteContent = [
      homepageContent ? `=== STARTSEITE ===\n${homepageContent}` : "",
      additionalPagesContent
    ].filter(Boolean).join("\n\n")

    // Step 2: Deep methodical industry analysis with Gemini
    // Build comprehensive prompt with LLM Engineering best practices:
    // - Clear role definition, Chain-of-Thought reasoning, Few-Shot examples, Structured output
    
    const industryPrompt = `# ROLLE
Du bist ein zertifizierter Fördermittelberater mit 15 Jahren Erfahrung in der NRW-Regionalförderung (RWP/GRW 2026). Deine Aufgabe ist die präzise Klassifizierung von Unternehmen nach den offiziellen Förderrichtlinien.

# KONTEXT
Die Gemeinschaftsaufgabe "Verbesserung der regionalen Wirtschaftsstruktur" (GRW) fördert nur Unternehmen mit "Primäreffekt" - d.h. sie müssen überregional tätig sein und Wertschöpfung in strukturschwache Regionen bringen.

# UNTERNEHMENSDATEN ZUR ANALYSE
- FIRMENNAME: ${company.name}
- GOOGLE-KATEGORIE: ${company.industry}
- STANDORT: ${company.address}, ${company.plz} ${company.city}
- FÖRDERGEBIET: ${foerdergebiet || "wird geprüft"}
${company.website ? `- WEBSITE: ${company.website}` : "- WEBSITE: Keine angegeben"}

${fullWebsiteContent ? `# GECRAWLTE WEBSEITENINHALTE
Die folgenden Inhalte wurden von der Unternehmenswebseite extrahiert (Startseite + Unterseiten wie Produkte, Leistungen, Über uns, Standorte, Referenzen):

${fullWebsiteContent.substring(0, 14000)}` : `# HINWEIS: Webseite konnte nicht gecrawlt werden
Analysiere das Unternehmen basierend auf:
1. GOOGLE-KATEGORIE: "${company.industry}" - Dies ist die primäre Informationsquelle
2. FIRMENNAME: "${company.name}" - Oft enthält der Name Hinweise auf die Branche
3. STANDORT: ${company.plz} ${company.city} - Regionale Einordnung

WICHTIG bei fehlender Webseite:
- Nutze die Google-Kategorie als Hauptindikator für die Brancheneinordnung
- Leite aus dem Firmennamen mögliche Tätigkeitsfelder ab
- Im Zweifel POSITIV oder BEDINGT einordnen (nicht NEGATIV)
- Gib bei HAUPTTAETIGKEIT an: "Basierend auf Google-Kategorie: [Interpretation]"`}

# ANALYSEMETHODIK (Chain-of-Thought)
Führe jeden Schritt gewissenhaft durch:

## SCHRITT 1: GESCHÄFTSMODELL IDENTIFIZIEREN
Prüfe anhand der Webseite und extrahiere KONKRETE Evidenz:
- [ ] Produziert das Unternehmen physische Güter? (Maschinen, Teile, Produkte, Nahrungsmittel)
- [ ] Bietet es produktionsnahe Dienstleistungen? (Lohnfertigung, Oberflächenbehandlung, technische Services)
- [ ] Betreibt es B2B-Handel? (Großhandel, Import/Export, Distribution)
- [ ] Erbringt es IT-Infrastruktur? (Rechenzentrum, Hosting, Software-as-a-Service)
- [ ] Ist es Forschung & Entwicklung? (Labor, F&E-Dienstleister)

## SCHRITT 2: WERTSCHÖPFUNGSTIEFE BESTIMMEN
- Wie hoch ist der eigene Fertigungsanteil? (Suche nach: Maschinenpark, Fertigung, Produktion, Werkstatt)
- Werden Rohstoffe/Halbzeuge veredelt? (Suche nach: Bearbeitung, Veredelung, Behandlung)
- Gibt es eigene Produktionsanlagen? (Suche nach: Maschinenpark, Anlagen, Kapazitäten, m² Produktion)
- Wie hoch ist der technologische Fokus? (Suche nach: Innovation, Patente, Entwicklung)

## SCHRITT 3: KUNDENSTRUKTUR ANALYSIEREN
- B2B vs B2C: Wer sind die Abnehmer? (Suche nach: Branchen, Kunden, Referenzen)
- Regional vs Überregional: Woher kommen die Kunden? (Suche nach: bundesweit, international, Export, Regionen)
- Industrie als Hauptkundengruppe? (Suche nach: Automotive, Maschinenbau, Industrie, OEM, Tier-1)

## SCHRITT 4: FÖRDER-EINORDNUNG (mit Entscheidungsregeln)

### POSITIVLISTE (DIREKT FÖRDERFÄHIG - Primäreffekt automatisch gegeben):
| Branche | Erkennungsmerkmale |
|---------|-------------------|
| Verarbeitendes Gewerbe | Maschinenbau, Metallverarbeitung, CNC, Werkzeugbau, Formenbau, Gießerei |
| Fertigung | Kunststoffverarbeitung, Elektronikproduktion, Lebensmittelherstellung, Textil |
| High-Tech | Medizintechnik, Pharma, Biotechnologie, Luft-/Raumfahrt, Optik, Sensorik |
| IT-Infrastruktur | Rechenzentren, Hosting, Cloud-Services, SaaS-Anbieter |
| Automotive | Zulieferer, Fahrzeugbau, Komponenten, Teile |
| Energie/Umwelt | Anlagenbau, Umwelttechnik, Recycling, Entsorgung |

### BEDINGTE POSITIVLISTE (Nachweis erforderlich):
| Branche | Bedingung für Förderfähigkeit |
|---------|------------------------------|
| Ingenieurbüro | Produktionsnah, KEINE Architekten |
| Großhandel | >50% Umsatz außerhalb 50km-Radius |
| Druckerei | Überwiegend B2B-Kunden |
| Logistik | Überregionale/internationale Bedeutung |
| Handwerk | >50% Absatz außerhalb 50km-Radius |

### NEGATIVLISTE (NUR DIESE BRANCHEN SIND DEFINITIV NICHT FÖRDERFÄHIG):
Einzelhandel (47), Gastronomie (56), Friseur/Kosmetik (96), Finanz/Versicherung (K), Immobilien (L), Rechtsanwälte/Steuerberater/Notare (69), Architekten (71.11)

# WICHTIGE ENTSCHEIDUNGSREGEL
- NEGATIV nur vergeben, wenn das Unternehmen EINDEUTIG und ZWEIFELSFREI auf der Negativliste steht
- Im Zweifel IMMER POSITIV oder BEDINGT vergeben - die meisten Unternehmen sind potenziell förderfähig!
- Produktions-, Fertigungs-, IT- und technische Unternehmen sind fast IMMER förderfähig
- Bei Dienstleistungen: Nur lokale B2C-Dienstleister (Friseur, Restaurant, Einzelhandel) sind NEGATIV

# FEW-SHOT BEISPIELE

## Beispiel 1: Maschinenbau (POSITIV)
GESCHAEFTSMODELL: Produktion
BRANCHE: Maschinenbau Sondermaschinenbau
HAUPTTAETIGKEIT: Entwicklung und Fertigung von Spezialmaschinen für die Automobilindustrie mit eigenem Maschinenpark
PRODUKTE_SERVICES: Montageanlagen, Prüfstände, Roboterzellen, Fördertechnik
KUNDENSTRUKTUR: B2B, überregional/international (Automotive OEMs)
FERTIGUNGSTIEFE: Eigene Produktion mit 3.500m² Fertigung
LISTE: POSITIV
BEGRUENDUNG: Verarbeitendes Gewerbe mit eigener Fertigung und überregionalem B2B-Absatz an Industrie. Primäreffekt gegeben.
BEDINGUNG: KEINE
FOERDERBARE_INVESTITIONEN: CNC-Bearbeitungszentren, Schweißroboter, Hallenerweiterung, Prüftechnik, CAD/CAM-Systeme
KONFIDENZ: HOCH

## Beispiel 2: Friseursalon (NEGATIV)
GESCHAEFTSMODELL: Dienstleistung
BRANCHE: Friseurhandwerk
HAUPTTAETIGKEIT: Haarschnitt und Styling für Privatkunden im lokalen Einzugsgebiet
PRODUKTE_SERVICES: Herrenschnitt, Damenschnitt, Färben, Styling
KUNDENSTRUKTUR: B2C, lokal
FERTIGUNGSTIEFE: keine
LISTE: NEGATIV
BEGRUENDUNG: Lokale Dienstleistung mit ausschließlich privatem Kundenkreis im unmittelbaren Umfeld. Kein Primäreffekt.
BEDINGUNG: KEINE
FOERDERBARE_INVESTITIONEN: Nicht förderfähig
KONFIDENZ: HOCH

## Beispiel 3: Großhandel (BEDINGT)
GESCHAEFTSMODELL: Handel
BRANCHE: Technischer Großhandel
HAUPTTAETIGKEIT: Vertrieb von Industriebedarf und technischen Komponenten an Gewerbetreibende
PRODUKTE_SERVICES: Werkzeuge, Befestigungstechnik, Arbeitsschutz, Betriebsausstattung
KUNDENSTRUKTUR: B2B, regional bis überregional
FERTIGUNGSTIEFE: Handel
LISTE: BEDINGT
BEGRUENDUNG: Großhandel kann förderfähig sein, wenn >50% des Umsatzes mit Kunden außerhalb eines 50km-Radius erzielt wird.
BEDINGUNG: Nachweis erforderlich: >50% Umsatz mit Kunden außerhalb 50km-Radius
FOERDERBARE_INVESTITIONEN: Lagerhalle, Hochregallager, Kommissioniertechnik, Fuhrpark, ERP-System
KONFIDENZ: MITTEL

# OUTPUT (EXAKT DIESES FORMAT VERWENDEN)
GESCHAEFTSMODELL: [Produktion|Fertigung|Dienstleistung|Handel|Forschung|IT-Infrastruktur]
BRANCHE: [Präzise Branchenbezeichnung, max 4 Wörter]
HAUPTTAETIGKEIT: [1-2 Sätze mit KONKRETEN Details aus der Webseite]
PRODUKTE_SERVICES: [Kommagetrennte Liste der gefundenen Produkte/Leistungen]
KUNDENSTRUKTUR: [B2B|B2C|Beide], [lokal|regional|überregional|international]
FERTIGUNGSTIEFE: [Eigene Produktion|Lohnfertigung|Handel|Dienstleistung|keine]
LISTE: [POSITIV|BEDINGT|NEGATIV] - WICHTIG: Nur NEGATIV wenn SICHER auf Negativliste! Im Zweifel POSITIV oder BEDINGT!
BEGRUENDUNG: [2-3 Sätze mit konkretem Bezug auf Förderkriterien und gefundene Evidenz - bei POSITIV/BEDINGT ermutigend formulieren]
BEDINGUNG: [Falls BEDINGT: Exakte Bedingung. Sonst: KEINE]
FOERDERBARE_INVESTITIONEN: [3-5 branchenspezifische Investitionen, kommagetrennt - IMMER ausfüllen außer bei NEGATIV]
KONFIDENZ: [HOCH|MITTEL|NIEDRIG]

ERINNERUNG: Die meisten Unternehmen sind potenziell förderfähig! Sei großzügig bei der Einordnung. Nur offensichtliche Negativlisten-Fälle (Friseur, Restaurant, Einzelhandel, Steuerberater, Rechtsanwalt) als NEGATIV markieren.

Analysiere jetzt ${company.name} und gib NUR das strukturierte Output aus.`

    const industryResponse = await callGemini(apiKey, industryPrompt)
    
    let eligibilityFromAI: "positive" | "conditional" | "negative" = "conditional"
    let aiCondition = ""
    let aiReason = ""
    let mainActivity = ""
    let confidence = "MITTEL"
    let businessModel = ""
    let productsServices = ""
    let customerStructure = ""
    let productionDepth = ""
    let foerderbareInvestitionen = ""
    
    if (industryResponse) {
      // Parse AI response - comprehensive extraction
      const geschaeftsmodellMatch = industryResponse.match(/GESCHAEFTSMODELL:\s*(.+?)(?:\n|$)/i)
      const brancheMatch = industryResponse.match(/BRANCHE:\s*(.+?)(?:\n|$)/i)
      const taetigkeitMatch = industryResponse.match(/HAUPTTAETIGKEIT:\s*(.+?)(?:\n|$)/i)
      const produkteMatch = industryResponse.match(/PRODUKTE_SERVICES:\s*(.+?)(?:\n|$)/i)
      const kundenMatch = industryResponse.match(/KUNDENSTRUKTUR:\s*(.+?)(?:\n|$)/i)
      const fertigungMatch = industryResponse.match(/FERTIGUNGSTIEFE:\s*(.+?)(?:\n|$)/i)
      const listeMatch = industryResponse.match(/LISTE:\s*(.+?)(?:\n|$)/i)
      const begruendungMatch = industryResponse.match(/BEGRUENDUNG:\s*(.+?)(?:\n|$)/i)
      const bedingungMatch = industryResponse.match(/BEDINGUNG:\s*(.+?)(?:\n|$)/i)
      const foerderbareMatch = industryResponse.match(/FOERDERBARE_INVESTITIONEN:\s*(.+?)(?:\n|$)/i)
      const konfidenzMatch = industryResponse.match(/KONFIDENZ:\s*(.+?)(?:\n|$)/i)
      
      if (geschaeftsmodellMatch) {
        businessModel = geschaeftsmodellMatch[1].trim()
      }
      if (brancheMatch) {
        detectedIndustry = brancheMatch[1].trim().replace(/['"]/g, "").replace(/\.$/, "")
      }
      if (taetigkeitMatch) {
        mainActivity = taetigkeitMatch[1].trim()
      }
      if (produkteMatch) {
        productsServices = produkteMatch[1].trim()
      }
      if (kundenMatch) {
        customerStructure = kundenMatch[1].trim()
      }
      if (fertigungMatch) {
        productionDepth = fertigungMatch[1].trim()
      }
      if (listeMatch) {
        const liste = listeMatch[1].trim().toUpperCase()
        if (liste.includes("POSITIV") && !liste.includes("BEDINGT")) {
          eligibilityFromAI = "positive"
        } else if (liste.includes("NEGATIV")) {
          eligibilityFromAI = "negative"
        } else {
          eligibilityFromAI = "conditional"
        }
      }
      if (begruendungMatch) {
        aiReason = begruendungMatch[1].trim()
      }
      if (bedingungMatch && !bedingungMatch[1].includes("KEINE")) {
        aiCondition = bedingungMatch[1].trim()
      }
      if (foerderbareMatch) {
        foerderbareInvestitionen = foerderbareMatch[1].trim()
      }
      if (konfidenzMatch) {
        confidence = konfidenzMatch[1].trim().toUpperCase()
      }
    }
    
    // Store deep analysis data
    const deepAnalysis = {
      businessModel,
      productsServices,
      customerStructure,
      productionDepth,
      foerderbareInvestitionen,
      confidence
    }

    // Combine AI analysis with rule-based check for safety
    const ruleBasedEligibility = checkEligibility(detectedIndustry)
    
    // Use AI result but validate with rules - prefer AI when confident
    let eligibility = {
      status: eligibilityFromAI,
      reason: aiReason || ruleBasedEligibility.reason,
      condition: aiCondition || ruleBasedEligibility.condition,
      checkQuestion: ruleBasedEligibility.checkQuestion || (aiCondition ? `Erfüllen Sie die Bedingung: ${aiCondition}?` : undefined)
    }
    
    // If AI is not confident, fall back to rule-based
    if (confidence === "NIEDRIG" && ruleBasedEligibility.status !== "conditional") {
      eligibility.status = ruleBasedEligibility.status as "positive" | "conditional" | "negative"
    }

    // Step 4: Generate analysis based on eligibility
    let analysis: any = null

    if (eligibility.status === "negative") {
      // Not eligible - generate rejection with explanation
      analysis = {
        eligibility: {
          status: "negative",
          eligible: false,
          reason: eligibility.reason,
          industry: detectedIndustry
        },
        owner: {
          name: ownerName,
          firstName: ownerFirstName,
          role: ownerRole,
          found: !!ownerName
        },
        companyProfile: {
          summary: companyDescription || mainActivity || `${company.name} ist ein Unternehmen in der Branche ${detectedIndustry}.`,
          industry: detectedIndustry,
          mainActivity: mainActivity || detectedIndustry,
          products: [],
          employeeEstimate: "Unbekannt",
          companyType: "Unbekannt",
          aiAnalysis: aiReason
        },
        fundingPotential: null,
        investmentIdeas: [],
        personalizedMessage: ownerName 
          ? `Sehr geehrte/r ${ownerName}, leider ist ${company.name} als Unternehmen der Branche "${detectedIndustry}" nach der aktuellen Richtlinie 2026 nicht direkt förderfähig.`
          : `Leider ist ${company.name} als Unternehmen der Branche "${detectedIndustry}" nach der aktuellen Richtlinie 2026 nicht direkt förderfähig.`,
        rejectionReason: eligibility.reason || aiReason,
        alternativeMessage: "Es gibt jedoch möglicherweise andere Förderprogramme, die für Ihr Unternehmen in Frage kommen. Patrick Starkmann prüft gerne kostenlos Ihre individuellen Möglichkeiten.",
        nextSteps: ["Kostenlose Alternativprüfung mit Patrick Starkmann", "Prüfung anderer Förderprogramme", "Individuelle Beratung zu Ihren Möglichkeiten"]
      }
    } else if (eligibility.status === "conditional") {
      // Conditional - needs individual check
      analysis = {
        eligibility: {
          status: "conditional",
          eligible: null,
          condition: eligibility.condition,
          checkQuestion: eligibility.checkQuestion,
          industry: detectedIndustry,
          aiReason: aiReason
        },
        owner: {
          name: ownerName,
          firstName: ownerFirstName,
          role: ownerRole,
          found: !!ownerName
        },
        companyProfile: {
          summary: companyDescription || mainActivity || `${company.name} ist ein Unternehmen in der Branche ${detectedIndustry}.`,
          industry: detectedIndustry,
          mainActivity: mainActivity || detectedIndustry,
          products: [],
          employeeEstimate: "Unbekannt",
          companyType: "KMU",
          aiAnalysis: aiReason
        },
        fundingPotential: {
          maxQuote: foerdergebietCode === "N" ? 0 : (30 + regionalBonus + 10),
          baseQuote: foerdergebietCode === "N" ? 0 : 30,
          regionalBonus,
          climateBonus: foerdergebietCode === "N" ? 0 : 10,
          foerdergebiet,
          foerdergebietCode,
          foerdergebietTyp: foerdergebietCode === "C+" ? "C+-Gebiet" : (foerdergebietCode === "C" ? "C-Gebiet" : (foerdergebietCode === "D" ? "D-Gebiet" : "Kein Fördergebiet")),
          pfadAVerfuegbar: foerdergebietCode !== "N",
          eligibilityScore: foerdergebietCode === "N" ? 0 : 75,
          conditionalNote: foerdergebietCode === "N" 
            ? "Dieses Programm passt nicht zu Ihrem Standort – aber wir haben attraktive Alternativen für Sie!"
            : "Sehr gute Chancen - Details werden im Gespräch geklärt"
        },
        investmentIdeas: (foerderbareInvestitionen 
          ? foerderbareInvestitionen.split(",").map(i => i.trim()) 
          : ["Maschinen & Anlagen", "Digitalisierung", "Energieeffizienz", "Gebäude & Erweiterung"]
        ).map(item => ({
          title: item,
          description: `Potenzielle Investition im Bereich ${item} - Details werden im Beratungsgespräch besprochen.`,
          estimatedInvestment: "Auf Anfrage",
          potentialFunding: "Wird individuell berechnet",
          fundingPath: "Wird im Gespräch ermittelt"
        })),
        personalizedMessage: ownerName
          ? `Gute Nachrichten, ${ownerFirstName}! ${company.name} hat sehr gute Chancen auf Förderung. Es gibt einige Details, die wir im persönlichen Gespräch klären - aber die Grundvoraussetzungen sehen vielversprechend aus!`
          : `Gute Nachrichten! ${company.name} hat sehr gute Chancen auf Förderung. Es gibt einige Details, die wir im persönlichen Gespräch klären - aber die Grundvoraussetzungen sehen vielversprechend aus!`,
        conditionMessage: eligibility.condition || "Einige Details müssen noch geklärt werden - das ist aber bei den meisten Unternehmen der Fall.",
        nextSteps: ["Kostenlose Potenzialanalyse sichern", "Persönliche Beratung mit Patrick Starkmann", "Förderantrag vorbereiten"]
      }
    } else {
      // Positive - HYPERPERSONALIZED full analysis with NEW 2026 FUNDING RATES
      // Determine correct funding rates based on region type (N, C, C+, D)
      const isCGebiet = foerdergebietCode === "C" || foerdergebietCode === "C+"
      const isCPlusGebiet = foerdergebietCode === "C+"
      const isDGebiet = foerdergebietCode === "D"
      const isNGebiet = foerdergebietCode === "N"
      
      // NEW 2026 RATES: Max 65% for EE/Umwelt (KU), 50% for Regional with De-minimis
      // C+ = C-Basis + 10 PP Grenzzuschlag (gem. Rn. 184 Regionalbeihilfeleitlinien)
      const maxQuoteEE = 65 // Erneuerbare Energie - Klein (gebietsunabhaengig)
      const maxQuoteUmwelt = isCGebiet ? 65 : 60 // Umweltschutz - Klein (C/C+ get +5% C-Bonus)
      const maxQuoteEffizienz = isCGebiet ? 55 : 50 // Energieeffizienz - Klein (C/C+ get +5% C-Bonus)
      const maxQuoteRegional = isDGebiet ? 50 : (isCPlusGebiet ? 55 : (isCGebiet ? 50 : 35)) // C+: 35+10PP Grenz.+Boni
      const overallMaxQuote = 65 // Absolute maximum
      
      const finalPrompt = `Du bist ein erfahrener Fördermittelberater für das RWP/GRW-Programm 2026. 
Erstelle eine EXTREM PERSONALISIERTE Analyse für dieses Unternehmen. Sprich den Inhaber DIREKT und persönlich an!

=== UNTERNEHMENSPROFIL ===
FIRMA: ${company.name}
GESCHÄFTSFÜHRER/INHABER: ${ownerName || "Unbekannt"} ${ownerRole ? `(${ownerRole})` : ""}
BRANCHE: ${detectedIndustry}
GESCHÄFTSMODELL: ${deepAnalysis.businessModel || "Produktion/Fertigung"}
HAUPTTÄTIGKEIT: ${mainActivity}
PRODUKTE/LEISTUNGEN: ${deepAnalysis.productsServices || "siehe Webseite"}

=== STANDORT & FÖRDERGEBIET ===
STADT: ${company.city}
PLZ: ${company.plz}
FÖRDERGEBIET: ${foerdergebiet}

=== VERFÜGBARE FÖRDERPFADE FÜR ${company.city.toUpperCase()} (${foerdergebiet}) ===

PFAD A - REGIONALE INVESTITION (Art. 14/17 AGVO):
${isCPlusGebiet ?
`- Kleinunternehmen: 45% (C-Basis 35% + 10 PP Grenzzuschlag)
- Mittlere Unternehmen: 35% (C-Basis 25% + 10 PP Grenzzuschlag)
- Große Unternehmen: 25% (C-Basis 15% + 10 PP Grenzzuschlag)
- C+-Vorteil: Höchste C-Gebiets-Quoten durch Grenzzuschlag gem. Rn. 184!` :
isCGebiet ? 
`- Kleinunternehmen: 35-50% (mit Bevölkerungsbonus/De-minimis)
- Mittlere Unternehmen: 25-40%
- Große Unternehmen: 15-20% (nur bei Diversifizierung)
- C-Gebiets-Vorteil: Höhere Basisquoten als D-Gebiete!` :
isDGebiet ?
`- Kleinunternehmen: 50% (mit De-minimis-Aufschlag: 30% Basis + 20%)
- Mittlere Unternehmen: 40% (mit De-minimis: 20% + 20%)
- Große Unternehmen: 30% (mit De-minimis: 10% + 20%)
- De-minimis-Obergrenze: 300.000€ über 3 Jahre
- Max. Investment: KU 600k€, MU 750k€, GU 1.000k€` :
`- Standardgebiet: Kein Pfad A verfügbar (keine regionale Investitionsbeihilfe)`}

PFAD B - ERNEUERBARE ENERGIE (Art. 41 AGVO) - GEBIETSUNABHÄNGIG:
- PV-Anlagen, Windkraft, Wärmepumpen: Klein 65%, Mittel 55%, Groß 45%
- Stromspeicher (≥75% aus EE): Klein 50%, Mittel 40%, Groß 30%
- WICHTIG: Gilt in C- UND D-Gebieten identisch! KEIN zusätzlicher C-Gebiets-Bonus!

PFAD C1 - UMWELTSCHUTZ (Art. 36 AGVO):
- Basisquote: 40% + KMU-Aufschlag (Klein +20%, Mittel +10%)
${isCGebiet ? `- C/C+-Gebiets-Bonus: +5% (C+ ist ein C-Gebiet)
- Ergebnis: Klein 65%, Mittel 55%, Groß 45%` : `- Ergebnis: Klein 60%, Mittel 50%, Groß 40%`}
- NUR Mehrkosten gegenüber Standardinvestition förderfähig!

PFAD C2 - ENERGIEEFFIZIENZ (Art. 38 AGVO):
- Basisquote: 30% + KMU-Aufschlag (Klein +20%, Mittel +10%)
${isCGebiet ? `- C/C+-Gebiets-Bonus: +5% (C+ ist ein C-Gebiet)
- Ergebnis: Klein 55%, Mittel 45%, Groß 35%` : `- Ergebnis: Klein 50%, Mittel 40%, Groß 30%`}
- NUR Mehrkosten gegenüber Standardinvestition förderfähig!

=== VON KI ERKANNTE INVESTITIONSPOTENZIALE ===
${deepAnalysis.foerderbareInvestitionen || "Maschinen, Anlagen, Digitalisierung, Gebäude, Energietechnik"}

${fullWebsiteContent ? `=== WEBSEITEN-DETAILS (NUTZE DIESE FÜR KONKRETE VORSCHLÄGE) ===
${fullWebsiteContent.substring(0, 6000)}` : ""}

=== DEINE AUFGABE: EXTREM PERSONALISIERTE ANALYSE ===

1. PERSÖNLICHE ANSPRACHE: Sprich ${ownerName ? ownerName.split(" ")[0] : "den Geschäftsführer"} DIREKT an! 
   Verwende "Sie" und beziehe dich auf konkrete Details von der Webseite.

2. BONUS-ERKLÄRUNG: Erkläre GENAU welche Förderpfade für ${company.name} relevant sind:
${isNGebiet ? `   - ${company.city} liegt nicht im GRW-Fördergebiet – dieses Programm passt nicht zum Standort.
   - Formuliere das POSITIV und motivierend! Sage sinngemäß: "Dieses spezielle Programm greift an Ihrem Standort nicht, ABER es gibt attraktive Alternativen!"
   - Nenne konkret alternative Förderprogramme: Forschungszulage (25% auf F&E-Personalkosten), KfW-Energieeffizienz, BAFA, Landesprogramme NRW.
   - Betone den Vorteil einer persönlichen Beratung – wir finden die besten Optionen!
   - KEIN Rot, KEIN "leider", KEIN negatives Framing! Immer positiv und CTA-stark formulieren.` : `   - Warum passt Pfad B (EE) zur Branche?
   - Welche Boni sind am Standort ${company.city} (${foerdergebiet}) verfügbar?
   - Wie setzt sich die maximale Quote zusammen?`}

3. INVESTMENT IDEAS: ${isNGebiet ? "ALTERNATIVE FÖRDERPROGRAMME für " + company.name + ":" : "3 MASSGESCHNEIDERTE Vorschläge mit dem OPTIMALEN FÖRDERPFAD:"}
${isNGebiet ? `   - Schlage 3 alternative Förderprogramme vor die zum Standort ${company.city} passen
   - Z.B. Forschungszulage, KfW-Energieeffizienz, BAFA-Einzelmaßnahmen, Digital Jetzt, Landesprogramme
   - Branchenspezifisch für ${detectedIndustry} mit konkreten Beispielen
   - Jedes Programm mit geschätztem Fördervolumen und Erklärung` : `   - Mindestens 1x Pfad B (EE) wegen der 65% Quote
   - Branchenspezifisch mit KONKRETEN Produktnamen
   - Realistische Summen für KMU`}

4. KONKRETE SCHRITTE: Was muss ${ownerName ? ownerName.split(" ")[0] : "der Kunde"} als nächstes tun?

=== JSON FORMAT (EXAKT EINHALTEN - KEINE PLATZHALTER!) ===

{
  "companyProfile": {
    "summary": "3 konkrete Sätze über ${company.name} mit Details von der Webseite",
    "industry": "${detectedIndustry}",
    "mainActivity": "Konkrete Haupttätigkeit",
    "products": ["Produkt1", "Produkt2", "Produkt3"],
    "employeeEstimate": "10-50",
    "companyType": "KMU"
  },
  "fundingPathways": {
    "pfadA": {
      "available": ${!isNGebiet},
      "quote": "${isNGebiet ? '0' : maxQuoteRegional}%",
      "explanation": "${isNGebiet ? `Dieses spezielle Programm (GRW/RWP) greift an Ihrem Standort ${company.city} nicht. Aber keine Sorge: Es gibt attraktive Alternativen wie die Forschungszulage, KfW-Programme und Landesprogramme, die wir gerne für Sie prüfen!` : `Als ${detectedIndustry} in ${company.city} können Sie für Maschinen und Anlagen bis zu ${maxQuoteRegional}% Förderung erhalten. ${isDGebiet ? 'Der De-minimis-Aufschlag von +20% ist bei Investments bis 600.000€ (KU) automatisch enthalten.' : isCGebiet ? (isCPlusGebiet ? 'Als C+-Gebiet mit Grenzzuschlag profitieren Sie von den höchsten C-Gebiets-Quoten (+10 PP).' : 'Als C-Gebiet profitieren Sie von erh��hten Basisquoten.') : ''}`}"
    },
    "pfadB": {
      "available": ${!isNGebiet},
      "quote": "${isNGebiet ? '0' : maxQuoteEE}%",
      "explanation": "${isNGebiet ? 'In diesem Programm nicht verfügbar – aber z.B. KfW-Energieeffizienz oder BAFA-Einzelmaßnahmen könnten passen!' : `Für Photovoltaik, Wärmepumpen oder Windkraft erhalten Sie als Kleinunternehmen bis zu ${maxQuoteEE}% Förderung. Im ${foerdergebiet} gelten erhöhte Basisquoten.`}",
      "eeType": "beide"
    },
    "pfadC1": {
      "available": ${!isNGebiet},
      "quote": "${isNGebiet ? '0' : maxQuoteUmwelt}%",
      "explanation": "${isNGebiet ? 'In diesem Programm nicht verfügbar – alternative Umweltförderprogramme stehen bereit!' : `Investitionen zur Reduzierung von Umweltverschmutzung werden mit bis zu ${maxQuoteUmwelt}% gefördert${isCGebiet ? ' (inkl. +5% C-Gebiets-Bonus)' : ''}. Förderfähig sind nur die Mehrkosten gegenüber einer Standardlösung.`}"
    },
    "pfadC2": {
      "available": ${!isNGebiet},
      "quote": "${isNGebiet ? '0' : maxQuoteEffizienz}%",
      "explanation": "${isNGebiet ? 'In diesem Programm nicht verfügbar – KfW-Energieeffizienz oder Landesprogramme sind eine starke Alternative!' : `Energieeffizienz-Maßnahmen wie Druckluftsysteme, LED-Beleuchtung oder Prozessoptimierung werden mit bis zu ${maxQuoteEffizienz}% gefördert${isCGebiet ? ' (inkl. +5% C-Gebiets-Bonus)' : ''}.`}"
    }
  },
  "bonusExplanation": {
    "personalGreeting": "${isNGebiet ? (ownerName ? `Herr/Frau ${ownerName.split(" ").pop()}, ` : '') + `dieses Programm passt nicht zu Ihrem Standort – aber wir haben starke Alternativen für ${company.name}! In einem kurzen Gespräch zeigen wir Ihnen, welche Förderprogramme genau zu Ihnen passen.` : (ownerName ? `Herr/Frau ${ownerName.split(" ").pop()}, ` : '') + `als Inhaber von ${company.name} haben Sie jetzt die Chance, von den höchsten Förderquoten seit Jahren zu profitieren.`}",
    "standortAnalyse": "${isNGebiet ? `Ihr Standort ${company.city} fällt nicht in den Geltungsbereich dieses Programms. Das ist aber kein Nachteil: Für Unternehmen wie ${company.name} gibt es andere Förderprogramme mit attraktiven Konditionen – z.B. die Forschungszulage (25% auf F&E-Personalkosten), KfW-Programme oder NRW-Landesprogramme. Lassen Sie uns gemeinsam die besten Optionen finden!` : `Ihr Standort ${company.city} liegt im ${foerdergebiet}. ${isCPlusGebiet ? 'Das bedeutet: Sie befinden sich im C+-Fördergebiet mit Grenzzuschlag gem. Rn. 184. Das heißt: +10 Prozentpunkte auf alle C-Gebiets-Quoten! KU erhalten bis zu 45% regionale Förderung und zusätzlich den +5% C-Bonus auf Umwelt- und Effizienzinvestitionen.' : isCGebiet ? 'Das bedeutet: Sie erhalten den +5% C-Gebiets-Bonus auf Umwelt- und Effizienzinvestitionen und höhere Basisquoten bei regionalen Investitionen.' : isDGebiet ? 'Mit dem De-minimis-Aufschlag (+20%) erreichen Sie als Kleinunternehmen bis zu 50% Förderung für klassische Investitionen.' : ''}`}",
    "branchenVorteile": "Erkläre 2-3 Sätze warum ${detectedIndustry} besonders von der Förderung profitiert - mit Bezug auf aktuelle Trends",
    "empfohlenerPfad": "Welcher Pfad ist für ${company.name} am lukrativsten und warum?",
    "konkreteSchritte": ["Schritt 1", "Schritt 2", "Schritt 3"]
  },
  "investmentIdeas": [
    {
      "title": "Konkrete EE-Investition (z.B. 100 kWp PV-Anlage mit Speicher)",
      "description": "2-3 Sätze warum das f����r ${company.name} sinnvoll ist",
      "estimatedInvestment": "150.000 EUR",
      "potentialFunding": "${Math.round(150000 * 0.65).toLocaleString("de-DE")} EUR",
      "fundingPath": "Pfad B: EE-Erzeugung (65%)"
    },
    {
      "title": "${isNGebiet ? 'Umweltschutz-Investition (Art. 36 AGVO)' : 'Branchenspezifische Maschine/Anlage'}",
      "description": "Konkret für ${detectedIndustry}",
      "estimatedInvestment": "200.000 EUR",
      "potentialFunding": "${isNGebiet ? Math.round(200000 * maxQuoteUmwelt / 100).toLocaleString("de-DE") : Math.round(200000 * maxQuoteRegional / 100).toLocaleString("de-DE")} EUR",
      "fundingPath": "${isNGebiet ? `Pfad C1: Umweltschutz (${maxQuoteUmwelt}%)` : `Pfad A: Regional (${maxQuoteRegional}%)`}"
    },
    {
      "title": "Energieeffizienz-Maßnahme",
      "description": "Konkret für die Branche",
      "estimatedInvestment": "80.000 EUR",
      "potentialFunding": "${Math.round(80000 * maxQuoteEffizienz / 100).toLocaleString("de-DE")} EUR",
      "fundingPath": "Pfad C2: Effizienz (${maxQuoteEffizienz}%)"
    }
  ],
  "personalizedMessage": "EXTREM PERSÖNLICH: Sprich ${ownerName ? ownerName.split(" ")[0] : 'den Geschäftsführer'} direkt an, nenne konkret was ${company.name} macht, erkläre die 65% Quote für EE.",
  "industryBenefits": "3-4 Sätze warum ${detectedIndustry} besonders profitiert - mit konkreten Beispielen aus der Branche.",
  "standortVorteil": "Erkläre den Standortvorteil ${company.city} - ${foerdergebiet}"
}

NUR JSON ausgeben, keine Erklärungen. ALLE Platzhalter durch echte Texte ersetzen!`

      const finalResponse = await callGemini(apiKey, finalPrompt)
      
      if (finalResponse) {
        try {
          const cleanedJson = finalResponse
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim()
          
          const parsed = JSON.parse(cleanedJson)
          
          analysis = {
            eligibility: {
              status: "positive",
              eligible: true,
              industry: detectedIndustry,
              aiReason: aiReason,
              confidence: deepAnalysis.confidence
            },
            owner: {
              name: ownerName,
              firstName: ownerFirstName,
              role: ownerRole,
              found: !!ownerName
            },
            ...parsed,
            companyProfile: {
              ...parsed.companyProfile,
              aiAnalysis: aiReason,
              mainActivity: mainActivity || parsed.companyProfile?.mainActivity || detectedIndustry,
              businessModel: deepAnalysis.businessModel,
              productsServices: deepAnalysis.productsServices,
              customerStructure: deepAnalysis.customerStructure,
              productionDepth: deepAnalysis.productionDepth
            },
            fundingPotential: {
              maxQuote: isNGebiet ? 0 : 65, // N-Gebiet: 0% (keine GRW-Förderung)
              baseQuote: isCPlusGebiet ? 45 : (isCGebiet ? 35 : (isDGebiet ? 30 : 0)),
              regionalBonus: isCPlusGebiet ? 10 : (isCGebiet ? 5 : (isDGebiet ? 20 : 0)),
              climateBonus: 0,
              foerdergebiet,
              foerdergebietCode, // N, C, C+, D
              foerdergebietTyp: isCPlusGebiet ? "C+-Gebiet" : (isCGebiet ? "C-Gebiet" : (isDGebiet ? "D-Gebiet" : "Kein Fördergebiet")),
              pfadAVerfuegbar: !isNGebiet,
              eligibilityScore: isNGebiet ? 0 : 85, // N-Gebiet: 0 (keine GRW-Förderung möglich)
              isAAngrenzend: false,
              hasBevoelkerungsBonus: false,
              foerderbareInvestitionen: isNGebiet ? "" : deepAnalysis.foerderbareInvestitionen,
              quotenDetails: isNGebiet ? {
                pfadA: "Nicht verfügbar",
                pfadB_EE: "Nicht verfügbar",
                pfadB_Speicher: "Nicht verfügbar",
                pfadC1_Umwelt: "Nicht verfügbar",
                pfadC2_Effizienz: "Nicht verfügbar"
              } : {
                pfadA: isCPlusGebiet ? "45/35/25%" : (isCGebiet ? "35-50%" : (isDGebiet ? "50/40/30%" : "Nicht verfügbar")),
                pfadB_EE: "65/55/45%",
                pfadB_Speicher: "50/40/30%",
                pfadC1_Umwelt: isCGebiet ? "65/55/45%" : "60/50/40%",
                pfadC2_Effizienz: isCGebiet ? "55/45/35%" : "50/40/30%"
              }
            },
            standortAnalyse: {
              city: company.city,
              plz: company.plz,
              foerdergebiet,
              foerdergebietCode,
              regionalBonus,
              pfadAVerfuegbar: !isNGebiet,
              standortVorteil: isNGebiet 
                ? parsed.standortVorteil || `Dieses Programm passt nicht zu ${company.city} – aber es gibt starke Alternativen! Lassen Sie uns gemeinsam die besten Förderoptionen finden.`
                : parsed.standortVorteil || `${company.city} liegt im ${foerdergebiet}${isCPlusGebiet ? ' mit Grenzzuschlag (+10 PP)' : ''} mit ${regionalBonus}% Regionalbonus.`
            },
            nextSteps: ["Kostenlose Erstberatung mit Patrick Starkmann", "Detaillierte Fördermittelprüfung", "Antragsunterstützung"]
          }
        } catch {
          // Fallback if JSON parsing fails
          analysis = {
            eligibility: {
              status: "positive",
              eligible: true,
              industry: detectedIndustry
            },
            owner: { name: ownerName, firstName: ownerFirstName, role: ownerRole, found: !!ownerName },
            companyProfile: { summary: `${company.name} - ${detectedIndustry}`, industry: detectedIndustry },
            fundingPotential: { maxQuote: 30 + regionalBonus + 10, baseQuote: 30, regionalBonus, climateBonus: 10, foerdergebiet, eligibilityScore: 80 },
            investmentIdeas: [],
            personalizedMessage: `${company.name} ist grundsätzlich förderfähig.`,
            industryBenefits: `Die Branche ${detectedIndustry} kann von der RWP-Förderung 2026 profitieren.`,
            nextSteps: ["Kostenlose Erstberatung", "Fördermittelprüfung", "Antragsunterstützung"]
          }
        }
      }
    }

    // Sanitize the entire analysis to prevent client-side crashes
    const safeAnalysis = sanitizeAnalysis(analysis)

    return NextResponse.json({
      analysis: safeAnalysis,
      company: {
        ...company,
        foerdergebiet,
        foerdergebietCode,
        regionalBonus,
        foerdergebietError,
        detectedIndustry,
        ownerName,
        ownerRole
      }
    })
  } catch (error) {
    console.error("[analyze-company] Unhandled error:", error)
    return NextResponse.json({ error: "Failed to analyze company" }, { status: 500 })
  }
}
