// Regional-Förderung 2026 - Offizielle Förderfähigkeitslisten nach WZ 2008
// Quelle: Offizielle Richtlinie NRW

export interface EligibilityEntry {
  wzCode: string
  description: string
  note?: string
}

export interface ConditionalEntry extends EligibilityEntry {
  condition: string
  checkQuestion: string
}

export interface NegativeEntry {
  section: string
  wzCode?: string
  description: string
  reason: string
}

// ============================================
// BEDINGTE LISTE - Unter bestimmten Voraussetzungen förderfähig
// (Es gibt keine Positivliste mehr -- alles was NICHT auf der
//  Negativliste steht, ist grundsätzlich förderfähig, ggf. mit
//  Primäreffekt-Nachweis: >50% Umsatz außerhalb 50km-Radius)
// ============================================
export const CONDITIONAL_LIST: ConditionalEntry[] = [
  { 
    wzCode: "18", 
    description: "Herstellung von Druckerzeugnissen",
    condition: "Förderfähig wenn überwiegend für gewerbliche Kunden (B2B) tätig",
    checkQuestion: "Sind mehr als 50% Ihrer Kunden gewerbliche Abnehmer?"
  },
  { 
    wzCode: "33", 
    description: "Reparatur und Installation von Maschinen und Ausrüstungen",
    condition: "Förderfähig wenn überwiegend für produzierende Unternehmen tätig",
    checkQuestion: "Arbeiten Sie überwiegend für produzierende Unternehmen?"
  },
  { 
    wzCode: "46", 
    description: "Großhandel (ohne Handel mit Kraftfahrzeugen)",
    condition: "Förderfähig wenn überregionaler Absatz (>50% außerhalb der Region). Außer 46.1 Handelsvermittlung.",
    checkQuestion: "Erzielen Sie mehr als 50% Ihres Umsatzes mit Kunden außerhalb Ihrer Region?"
  },
  { 
    wzCode: "52.29.9", 
    description: "Erbringung von Dienstleistungen für den Verkehr a.n.g. (z.B. Logistikzentren)",
    condition: "Förderfähig wenn überregionale Bedeutung nachgewiesen",
    checkQuestion: "Bedienen Sie Kunden aus mehreren Bundesländern oder international?"
  },
  { 
    wzCode: "59", 
    description: "Herstellung, Verleih und Vertrieb von Filmen und Fernsehprogrammen; Tonstudios und Verlegen von Musik",
    condition: "Förderfähig außer 59.14 Kinos",
    checkQuestion: "Handelt es sich um ein Produktions- oder Verlagsunternehmen (kein Kino)?"
  },
  { 
    wzCode: "70.1", 
    description: "Verwaltung und Führung von Unternehmen und Betrieben",
    condition: "Förderfähig wenn für förderfähige Betriebsstätten tätig",
    checkQuestion: "Verwalten Sie produzierende oder IT-Unternehmen?"
  },
  { 
    wzCode: "71", 
    description: "Architektur- und Ingenieurbüros; technische, physikalische und chemische Untersuchung",
    condition: "Förderfähig außer 71.11 Architekturbüros. Ingenieurbüros und Labore sind förderfähig.",
    checkQuestion: "Handelt es sich um ein Ingenieurbüro oder technisches Labor (kein Architekturbüro)?"
  },
  { 
    wzCode: "73", 
    description: "Werbung und Marktforschung",
    condition: "Förderfähig wenn überwiegend für gewerbliche Kunden (B2B) und überregionaler Kundenkreis",
    checkQuestion: "Arbeiten Sie überwiegend für gewerbliche Kunden aus mehreren Regionen?"
  },
  // Zusätzliche bedingte Einträge für Spezialfälle
  { 
    wzCode: "86", 
    description: "Gesundheitswesen (Ärzte, Physiotherapeuten, Spezialkliniken)",
    condition: "Nur bei Primäreffekt. Nur mit Nachweis überregionaler Bedeutung (Spezialisierung/Einzugsgebiet >50km).",
    checkQuestion: "Haben Sie eine Spezialisierung mit Patienten aus einem Einzugsgebiet von mehr als 50km?"
  },
  { 
    wzCode: "41-43", 
    description: "Baugewerbe (Handwerksbetriebe)",
    condition: "Förderfähig wenn überwiegend für gewerbliche Auftraggeber tätig und überregionaler Kundenkreis (>50%)",
    checkQuestion: "Sind mehr als 50% Ihrer Auftraggeber gewerblich und außerhalb Ihrer unmittelbaren Region?"
  },
]

// ============================================
// SPEZIELLE BRANCHEN - Nicht Regional-Förderung aber andere Förderung verfügbar
// ============================================
export interface SpecialIndustryEntry {
  keywords: string[]
  industry: string
  alternativeFunding: string
  message: string
  ctaText: string
}

export const SPECIAL_INDUSTRY_LIST: SpecialIndustryEntry[] = [
  {
    keywords: ["landwirtschaft", "bauernhof", "agrar", "forstwirtschaft", "fischerei", "gärtnerei", "landwirt", "bauer", "weinbau", "obstbau", "tierhaltung", "ackerbau", "milchwirtschaft", "landwirtschaftlich"],
    industry: "Landwirtschaft",
    alternativeFunding: "Landwirtschaftsförderung (AFP, ELER, GAP)",
    message: "Landwirtschaftliche Betriebe können zwar nicht über die Regional-Förderung gefördert werden, aber es gibt spezialisierte Agrarförderprogramme mit oft sogar höheren Förderquoten! Wir beraten auch hier.",
    ctaText: "Landwirtschaftsförderung prüfen"
  }
]

// ============================================
// NEGATIVLISTE - Nicht förderfähige Branchen (WZ 2025)
// Quelle: Offizielle Richtlinie NRW 2026
// HINWEIS: Landwirtschaft ist NICHT auf dieser Liste - sie hat eigene Förderprogramme
// ============================================
export const NEGATIVE_LIST: NegativeEntry[] = [
  // Abschnitt A - Land-/Forstwirtschaft hat EIGENE Förderprogramme (nicht hier, sondern in SPECIAL_INDUSTRY_LIST)
  // { section: "A", description: "Land- und Forstwirtschaft, Fischerei" ... } - ENTFERNT, da eigene Förderung verfügbar
  
  // Abschnitt B - Komplett ausgeschlossen
  { section: "B", description: "Bergbau und Gewinnung von Steinen und Erden", reason: "Rohstoffgewinnung ist komplett von der Regionalförderung ausgeschlossen." },
  
  // Abschnitt C - Teilweise ausgeschlossen
  { section: "C", wzCode: "24", description: "Metallerzeugung und -bearbeitung (Stahlindustrie)", reason: "Stahlindustrie ist gemäß Artikel 13a AGVO in Verbindung mit Artikel 2 Nr. 43 AGVO von Regionalbeihilfen ausgeschlossen." },
  
  // Abschnitt D - Komplett ausgeschlossen
  { section: "D", description: "Energieversorgung", reason: "Energieversorger sind komplett von der Regionalförderung ausgeschlossen. Eigene Förderprogramme für Energiewende verfügbar." },
  
  // Abschnitt E - Überwiegend ausgeschlossen
  { section: "E", description: "Wasserversorgung, Abwasser- und Abfallentsorgung, Beseitigung von Umweltverschmutzungen", reason: "Ausgeschlossen außer 38.21 (Behandlung nicht gefährlicher Abfälle) und 39 (Beseitigung von Umweltverschmutzungen). Kommunale Daseinsvorsorge ist nicht förderfähig." },
  
  // Abschnitt F - Komplett ausgeschlossen
  { section: "F", description: "Baugewerbe", reason: "Gesamtes Baugewerbe (Hochbau, Tiefbau, Ausbaugewerbe) ist von der Förderung ausgeschlossen." },
  { section: "F", wzCode: "41", description: "Hochbau", reason: "Baugewerbe ist komplett von der Regionalförderung ausgeschlossen." },
  { section: "F", wzCode: "42", description: "Tiefbau", reason: "Baugewerbe ist komplett von der Regionalförderung ausgeschlossen." },
  { section: "F", wzCode: "43", description: "Vorbereitende Baustellenarbeiten, Bauinstallation und sonstiges Ausbaugewerbe", reason: "Baugewerbe ist komplett von der Regionalförderung ausgeschlossen." },
  
  // Abschnitt G - Handel überwiegend ausgeschlossen
  { section: "G", description: "Handel", reason: "Handel ist überwiegend ausgeschlossen. Nur Großhandel (46.2 bis 46.6 sowie 46.8 und 46.9) kann förderfähig sein." },
  { section: "G", wzCode: "45", description: "Handel mit Kraftfahrzeugen, Instandhaltung und Reparatur", reason: "Kfz-Handel ist von der Förderung ausgeschlossen." },
  { section: "G", wzCode: "46.1", description: "Handelsvermittlung", reason: "Handelsvermittlung ist von der Förderung ausgeschlossen." },
  { section: "G", wzCode: "46.7", description: "Sonstiger Großhandel", reason: "Sonstiger Großhandel ist von der Förderung ausgeschlossen." },
  { section: "G", wzCode: "47", description: "Einzelhandel (ohne Handel mit Kraftfahrzeugen)", reason: "Einzelhandel bedient lokale Endverbraucher und ist komplett ausgeschlossen." },
  
  // Abschnitt H - Verkehr und Lagerei überwiegend ausgeschlossen
  { section: "H", description: "Verkehr und Lagerei", reason: "Transportsektor ist nach EU-Beihilferecht (AGVO Art. 13b, Art. 2 Nr. 45) ausgeschlossen. Nur 49.34 (Personenbeförderung zu touristischen Zwecken) und 52.25 (Frachtumschlag) können förderfähig sein." },
  { section: "H", wzCode: "49", description: "Landverkehr und Transport in Rohrfernleitungen", reason: "Verkehr ist ausgeschlossen außer 49.34 für touristische Zwecke." },
  { section: "H", wzCode: "50", description: "Schifffahrt", reason: "Schifffahrt ist von der Förderung ausgeschlossen." },
  { section: "H", wzCode: "51", description: "Luftfahrt", reason: "Luftfahrt ist von der Förderung ausgeschlossen." },
  { section: "H", wzCode: "52", description: "Lagerei sowie Erbringung von sonstigen Dienstleistungen für den Verkehr", reason: "Lagerei ist ausgeschlossen außer 52.25 (Frachtumschlag)." },
  { section: "H", wzCode: "53", description: "Post-, Kurier- und Expressdienste", reason: "Post- und Kurierdienste sind von der Förderung ausgeschlossen." },
  
  // Abschnitt I - Gastronomie und Beherbergungsvermittlung ausgeschlossen
  { section: "I", wzCode: "55.4", description: "Vermittlungstätigkeiten für Beherbergungsdienstleistungen", reason: "Vermittlung von Beherbergung ist von der Förderung ausgeschlossen." },
  { section: "I", wzCode: "56", description: "Gastronomie", reason: "Gastronomie ist ausgeschlossen. Ausnahme: In Kombination mit Beherbergung (55), wenn mindestens 25% der Umsätze mit eigenen Beherbergungsgästen erzielt werden." },
  
  // Abschnitt J - Medien überwiegend ausgeschlossen
  { section: "J", description: "Verlagswesen, Rundfunk, Erstellung und Verbreitung von Medieninhalten", reason: "Medienbranche ist überwiegend ausgeschlossen. Nur 58.1 (Verlegen von Büchern), 58.2 (Verlegen von Software), 59.11, 59.12 (Filmproduktion) und 59.2 (Tonstudios) sind förderfähig." },
  { section: "J", wzCode: "60", description: "Rundfunkveranstalter", reason: "Rundfunk ist von der Förderung ausgeschlossen." },
  
  // Abschnitt K - Telekommunikation ausgeschlossen
  { section: "K", wzCode: "61", description: "Telekommunikation", reason: "Telekommunikation ist von der Förderung ausgeschlossen." },
  
  // Abschnitt L - Komplett ausgeschlossen
  { section: "L", description: "Erbringung von Finanz- und Versicherungsdienstleistungen", reason: "Finanzsektor ist komplett von der Regionalförderung ausgeschlossen." },
  
  // Abschnitt M - Komplett ausgeschlossen
  { section: "M", description: "Grundstücks- und Wohnungswesen", reason: "Immobilienwirtschaft ist komplett von der Regionalförderung ausgeschlossen." },
  
  // Abschnitt N - Überwiegend ausgeschlossen
  { section: "N", description: "Erbringung von wissenschaftlichen und technischen Dienstleistungen", reason: "Wissenschaftliche/technische Dienstleistungen sind überwiegend ausgeschlossen. Nur 71 (Ingenieurbüros), 72 (Forschung und Entwicklung) und 73 (Werbung/Marktforschung) können förderfähig sein." },
  { section: "N", wzCode: "69", description: "Rechts- und Steuerberatung, Wirtschaftsprüfung", reason: "Rechts- und Steuerberatung ist von der Förderung ausgeschlossen." },
  { section: "N", wzCode: "70", description: "Verwaltung und Führung von Unternehmen und Betrieben; Unternehmensberatung", reason: "Unternehmensberatung ist von der Förderung ausgeschlossen." },
  { section: "N", wzCode: "74", description: "Sonstige freiberufliche, wissenschaftliche und technische Tätigkeiten", reason: "Sonstige freiberufliche Tätigkeiten sind von der Förderung ausgeschlossen." },
  { section: "N", wzCode: "75", description: "Veterinärwesen", reason: "Veterinärwesen ist von der Förderung ausgeschlossen." },
  
  // Abschnitt O - Komplett ausgeschlossen
  { section: "O", description: "Erbringung von sonstigen wirtschaftlichen Dienstleistungen", reason: "Sonstige wirtschaftliche Dienstleistungen (Zeitarbeit, Reinigung, Sicherheit, Reisebüros etc.) sind komplett ausgeschlossen." },
  
  // Abschnitt P - Komplett ausgeschlossen
  { section: "P", description: "Öffentliche Verwaltung, Verteidigung, Sozialversicherung", reason: "Öffentlicher Sektor ist komplett von der Wirtschaftsförderung ausgeschlossen." },
  
  // Abschnitt Q - Komplett ausgeschlossen
  { section: "Q", description: "Erziehung und Unterricht", reason: "Bildungssektor ist komplett von der Regionalförderung ausgeschlossen." },
  
  // Abschnitt R - Komplett ausgeschlossen
  { section: "R", description: "Gesundheits- und Sozialwesen", reason: "Gesundheits- und Sozialwesen ist komplett von der Regionalförderung ausgeschlossen." },
  
  // Abschnitt S - Überwiegend ausgeschlossen
  { section: "S", description: "Kunst, Sport und Erholung", reason: "Kunst, Sport und Erholung sind überwiegend ausgeschlossen. Nur 93.2 (Unterhaltung/Erholung) kann förderfähig sein, wenn Dienstleistungen überwiegend dem Tourismus zugutekommen." },
  { section: "S", wzCode: "90", description: "Kreative, künstlerische und unterhaltende Tätigkeiten", reason: "Künstlerische Tätigkeiten sind von der Förderung ausgeschlossen." },
  { section: "S", wzCode: "91", description: "Bibliotheken, Archive, Museen, botanische und zoologische Gärten", reason: "Kultureinrichtungen sind von der Förderung ausgeschlossen." },
  { section: "S", wzCode: "92", description: "Spiel-, Wett- und Lotteriewesen", reason: "Glücksspiel ist von der Förderung ausgeschlossen." },
  { section: "S", wzCode: "93.1", description: "Erbringung von Dienstleistungen des Sports", reason: "Sport-Dienstleistungen sind von der Förderung ausgeschlossen." },
  
  // Abschnitt T - Überwiegend ausgeschlossen
  { section: "T", description: "Erbringung von sonstigen Dienstleistungen", reason: "Sonstige Dienstleistungen sind überwiegend ausgeschlossen. Nur 96.23 (Kosmetik) kann förderfähig sein, wenn Dienstleistungen überwiegend dem Tourismus zugutekommen." },
  { section: "T", wzCode: "94", description: "Interessenvertretungen sowie kirchliche und sonstige religiöse Vereinigungen", reason: "Vereine und religiöse Vereinigungen sind von der Förderung ausgeschlossen." },
  { section: "T", wzCode: "95", description: "Reparatur von Datenverarbeitungsgeräten und Gebrauchsgütern", reason: "Reparaturdienstleistungen für Endverbraucher sind von der Förderung ausgeschlossen." },
  { section: "T", wzCode: "96", description: "Erbringung von sonstigen überwiegend persönlichen Dienstleistungen", reason: "Persönliche Dienstleistungen (Friseure, Bestattung etc.) sind ausgeschlossen außer 96.23 für Tourismus." },
  
  // Abschnitt U - Komplett ausgeschlossen
  { section: "U", description: "Private Haushalte mit Hauspersonal", reason: "Keine gewerbliche Tätigkeit im Sinne der Förderung." },
  
  // Abschnitt V - Komplett ausgeschlossen
  { section: "V", description: "Exterritoriale Organisationen und Körperschaften", reason: "Internationale Organisationen sind nicht förderfähig." },
]

// ============================================
// Hilfsfunktionen für die Förderfähigkeitsprüfung
// ============================================

export type EligibilityStatus = "positive" | "conditional" | "negative" | "unknown"

export interface EligibilityResult {
  status: EligibilityStatus
  entry?: EligibilityEntry | ConditionalEntry | NegativeEntry
  message: string
}

/**
 * Prüft die Förderfähigkeit anhand des WZ-Codes.
 * Logik: Nur Negativliste prüfen. Alles was NICHT auf der Negativliste steht,
 * ist grundsätzlich förderfähig (ggf. mit Primäreffekt-Nachweis).
 */
export function checkEligibilityByWZCode(wzCode: string): EligibilityResult {
  // 1. Prüfe Negativliste zuerst
  const negativeMatch = NEGATIVE_LIST.find(e => 
    e.wzCode && (wzCode.startsWith(e.wzCode) || e.wzCode.startsWith(wzCode))
  )
  if (negativeMatch) {
    return {
      status: "negative",
      entry: negativeMatch,
      message: `Nicht förderfähig: ${negativeMatch.description}. ${negativeMatch.reason}`
    }
  }

  // 2. Prüfe bedingte Liste (spezielle Voraussetzungen nötig)
  const conditionalMatch = CONDITIONAL_LIST.find(e => 
    wzCode.startsWith(e.wzCode) || e.wzCode.startsWith(wzCode)
  )
  if (conditionalMatch) {
    return {
      status: "conditional",
      entry: conditionalMatch,
      message: `Bedingt förderfähig: ${conditionalMatch.description}. ${conditionalMatch.condition}`
    }
  }

  // 3. Alles was NICHT auf der Negativliste steht = grundsätzlich förderfähig
  return {
    status: "positive",
    message: "Nicht auf der Negativliste - grundsätzlich förderfähig. Ggf. ist ein Primäreffekt-Nachweis erforderlich (>50% Umsatz außerhalb 50km-Radius)."
  }
}

/**
 * Prüft die Förderfähigkeit anhand von Branchenbegriffen (für KI-Analyse)
 */
export function checkEligibilityByIndustry(industry: string): EligibilityResult {
  const industryLower = industry.toLowerCase()

  // Mapping von Branchenbegriffen zu WZ-Codes
  const industryMappings: { keywords: string[], wzCode: string }[] = [
    // Branchen-Mapping (Branche -> WZ-Code -> Negativlisten-Check)
    { keywords: ["software", "it-dienstleistung", "programmierung", "app-entwicklung", "saas"], wzCode: "62" },
    { keywords: ["maschinenbau", "maschinen", "anlagenbau"], wzCode: "28" },
    { keywords: ["elektronik", "halbleiter", "chip", "sensor"], wzCode: "26" },
    { keywords: ["pharma", "medikament", "arzneimittel"], wzCode: "21" },
    { keywords: ["chemie", "chemisch"], wzCode: "20" },
    { keywords: ["kunststoff", "gummi", "plastik"], wzCode: "22" },
    { keywords: ["metall", "stahl", "aluminium"], wzCode: "24" },
    { keywords: ["automobil", "fahrzeug", "kfz-zulieferer", "automotive"], wzCode: "29" },
    { keywords: ["möbel", "einrichtung"], wzCode: "31" },
    { keywords: ["textil", "bekleidung", "mode"], wzCode: "13" },
    { keywords: ["lebensmittel", "nahrungsmittel", "food"], wzCode: "10" },
    { keywords: ["getränk", "brauerei", "wein"], wzCode: "11" },
    { keywords: ["forschung", "entwicklung", "f&e", "r&d"], wzCode: "72" },
    { keywords: ["hotel", "pension", "beherbergung"], wzCode: "55" },
    
    // Bedingte Liste
    { keywords: ["druckerei", "druck", "printmedien"], wzCode: "18" },
    { keywords: ["großhandel", "b2b-handel"], wzCode: "46" },
    { keywords: ["logistik", "lager", "distribution"], wzCode: "52.29.9" },
    { keywords: ["ingenieurbüro", "ingenieur", "technische beratung"], wzCode: "71" },
    { keywords: ["werbeagentur", "marketing", "marktforschung"], wzCode: "73" },
    { keywords: ["filmproduktion", "tonstudio", "medienproduktion"], wzCode: "59" },
    { keywords: ["reparatur", "instandhaltung", "wartung"], wzCode: "33" },
    { keywords: ["arzt", "praxis", "physiotherap", "klinik", "medizin"], wzCode: "86" },
    
    // Negativliste - Komplett ausgeschlossene Branchen
    // HINWEIS: Landwirtschaft ist NICHT ausgeschlossen - sie hat eigene Förderprogramme (siehe SPECIAL_INDUSTRY_LIST)
    { keywords: ["bergbau", "steinbruch", "erdöl", "erdgas", "bergwerk"], wzCode: "B" },
    { keywords: ["stahl", "stahlwerk", "hüttenwerk", "eisenerzeugung"], wzCode: "24" },
    { keywords: ["energieversorgung", "stromversorger", "gasversorger", "stadtwerke", "energieversorger"], wzCode: "D" },
    { keywords: ["wasserversorgung", "abwasser", "abfall", "müll", "kläranlage", "entsorgung"], wzCode: "E" },
    { keywords: ["bau", "hochbau", "tiefbau", "bauunternehmen", "baugewerbe", "dachdecker", "elektriker", "installateur", "sanitär", "heizung", "klima", "maler", "fliesenleger", "zimmerer", "maurer", "trockenbau"], wzCode: "F" },
    { keywords: ["einzelhandel", "laden", "shop", "boutique", "geschäft", "supermarkt", "drogerie", "kiosk"], wzCode: "47" },
    { keywords: ["kfz-handel", "autohaus", "autowerkstatt", "kfz-werkstatt", "reifenhändler"], wzCode: "45" },
    { keywords: ["restaurant", "gastronomie", "café", "imbiss", "bar", "kneipe", "bistro", "pizzeria", "döner", "systemgastronomie"], wzCode: "56" },
    { keywords: ["taxi", "transport", "spedition", "umzug", "kurier", "logistik", "lkw", "busunternehmen", "personenbeförderung"], wzCode: "H" },
    { keywords: ["telekommunikation", "mobilfunk", "internetprovider", "telefon"], wzCode: "61" },
    { keywords: ["bank", "versicherung", "finanz", "sparkasse", "volksbank", "vermögensverwaltung", "leasing", "factoring"], wzCode: "L" },
    { keywords: ["immobilien", "makler", "hausverwaltung", "wohnungswirtschaft", "immobilienverwaltung"], wzCode: "M" },
    { keywords: ["rechtsanwalt", "steuerberater", "notar", "wirtschaftsprüfer", "kanzlei", "anwalt"], wzCode: "69" },
    { keywords: ["unternehmensberatung", "managementberatung", "consultant"], wzCode: "70" },
    { keywords: ["tierarzt", "tierklinik", "veterinär"], wzCode: "75" },
    { keywords: ["zeitarbeit", "personalvermittlung", "leiharbeit", "arbeitnehmerüberlassung"], wzCode: "O" },
    { keywords: ["reinigung", "gebäudereinigung", "hausmeister", "facility"], wzCode: "O" },
    { keywords: ["sicherheitsdienst", "wachdienst", "security", "objektschutz"], wzCode: "O" },
    { keywords: ["reisebüro", "reiseveranstalter", "touristik"], wzCode: "O" },
    { keywords: ["öffentliche verwaltung", "behörde", "amt", "kommune", "rathaus"], wzCode: "P" },
    { keywords: ["schule", "bildung", "unterricht", "nachhilfe", "fahrschule", "sprachschule", "volkshochschule", "kita", "kindergarten"], wzCode: "Q" },
    { keywords: ["arzt", "zahnarzt", "praxis", "klinik", "krankenhaus", "physiotherap", "heilpraktiker", "psycholog", "therapeut", "apotheke", "sanitätshaus"], wzCode: "R" },
    { keywords: ["pflege", "altenpflege", "krankenpflege", "pflegeheim", "pflegedienst", "sozialarbeit", "behindertenwerk"], wzCode: "R" },
    { keywords: ["museum", "bibliothek", "archiv", "zoo", "theater", "oper", "konzerthaus"], wzCode: "91" },
    { keywords: ["spielhalle", "casino", "wettbüro", "lotterie", "glücksspiel"], wzCode: "92" },
    { keywords: ["fitnessstudio", "sportverein", "sportstätte", "schwimmbad", "tennisclub"], wzCode: "93.1" },
    { keywords: ["friseur", "kosmetik", "nagel", "beauty", "tattoo", "piercing", "sonnenstudio"], wzCode: "96" },
    { keywords: ["bestattung", "friedhof", "krematorium"], wzCode: "96" },
    { keywords: ["verein", "verband", "kirche", "gemeinde", "stiftung", "ngo"], wzCode: "94" },
    { keywords: ["rundfunk", "fernsehen", "radio", "tv-sender"], wzCode: "60" },
  ]

  for (const mapping of industryMappings) {
    if (mapping.keywords.some(kw => industryLower.includes(kw))) {
      return checkEligibilityByWZCode(mapping.wzCode)
    }
  }

  return {
    status: "unknown",
    message: "Branche nicht eindeutig zuordenbar. Eine individuelle Prüfung mit WZ-Code ist erforderlich."
  }
}

/**
 * Gibt alle Branchen einer bestimmten Liste zurück (für UI-Anzeige)
 */
export function getConditionalIndustries(): string[] {
  return CONDITIONAL_LIST.map(e => e.description)
}

export function getNegativeIndustries(): string[] {
  return NEGATIVE_LIST.map(e => e.description)
}

/**
 * Prüft ob es sich um eine Spezialbranche handelt (z.B. Landwirtschaft),
 * die zwar nicht über Regional-Förderung förderfähig ist, aber eigene Förderprogramme hat.
 * Diese werden POSITIV behandelt mit Hinweis auf Alternativförderung.
 */
export function checkSpecialIndustry(industry: string): SpecialIndustryEntry | null {
  const industryLower = industry.toLowerCase()
  
  for (const special of SPECIAL_INDUSTRY_LIST) {
    if (special.keywords.some(kw => industryLower.includes(kw))) {
      return special
    }
  }
  
  return null
}
