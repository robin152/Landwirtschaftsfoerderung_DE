import { NextRequest, NextResponse } from "next/server"

// Mapping from webhook short codes to internal values
const FOERDERGEBIET_MAP: Record<string, { foerdergebiet: string; code: string; regionalBonus: number }> = {
  "N": { foerdergebiet: "Kein Fördergebiet", code: "N", regionalBonus: 0 },
  "C": { foerdergebiet: "C-Fördergebiet", code: "C", regionalBonus: 5 },
  "C+": { foerdergebiet: "C-Fördergebiet (Grenzzuschlag)", code: "C+", regionalBonus: 10 },
  "D": { foerdergebiet: "D-Fördergebiet", code: "D", regionalBonus: 0 },
}

// Priority: C+ > C > D > N (best region wins when webhook returns combined codes like "C/D" or "C/D/N")
const CODE_PRIORITY = ["C+", "C", "D", "N"]

/**
 * Resolves combined webhook codes like "C/D", "C/D/N" to the best single code.
 * The webhook sometimes returns multiple codes separated by "/" when a PLZ
 * spans multiple Fördergebiete. We pick the best one.
 */
function resolveBestCode(rawCode: string): { foerdergebiet: string; code: string; regionalBonus: number } | null {
  // Direct match first
  if (FOERDERGEBIET_MAP[rawCode]) {
    return FOERDERGEBIET_MAP[rawCode]
  }

  // Combined code: split by "/" and pick the best
  const parts = rawCode.split("/").map(p => p.trim())
  for (const priorityCode of CODE_PRIORITY) {
    if (parts.includes(priorityCode)) {
      return FOERDERGEBIET_MAP[priorityCode]
    }
  }

  return null
}

const FALLBACK = FOERDERGEBIET_MAP["N"]

const WEBHOOK_URL = "https://eskalator-prozesse.app.n8n.cloud/webhook/grw_webpage"
const TIMEOUT_MS = 10_000

export async function GET(request: NextRequest) {
  const plz = request.nextUrl.searchParams.get("plz")

  if (!plz || plz.length < 4 || plz.length > 5) {
    return NextResponse.json({ error: "PLZ parameter required (4-5 digits)" }, { status: 400 })
  }

  const result = await fetchFoerdergebiet(plz)
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const plz = body.plz || body.PLZ

    if (!plz || String(plz).length < 4 || String(plz).length > 5) {
      return NextResponse.json({ error: "PLZ parameter required (4-5 digits)" }, { status: 400 })
    }

    const result = await fetchFoerdergebiet(String(plz))
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ ...FALLBACK, source: "error", error: "Fördergebiet konnte nicht abgerufen werden (ungültige Anfrage)" }, { status: 200 })
  }
}

/**
 * Fetches the Foerdergebiet from the n8n webhook.
 * Returns the mapped result, or error info on failure.
 */
export async function fetchFoerdergebiet(plz: string): Promise<{
  foerdergebiet: string
  code: string
  regionalBonus: number
  source: "webhook" | "error"
  error?: string
}> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ PLZ: plz }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`[foerdergebiet] Webhook returned ${response.status} for PLZ ${plz}`)
      return { ...FALLBACK, source: "error", error: `Fördergebiet konnte nicht abgerufen werden (HTTP ${response.status})` }
    }

    // The n8n webhook can return:
    // 1. Valid JSON: {"foerderDetails":{"supabaseExtraction":[{"foerdergebiet":"C"}]}}
    // 2. Empty body (when Google API finds nothing for the PLZ) = "false" case
    // 3. foerdergebiet = "n/a" (PLZ found but no table entry)
    // 4. foerdergebiet = "N" (explicit: kein Fördergebiet)
    // 5. foerdergebiet = false (boolean)
    // Cases 2-5 all mean: kein Fördergebiet -- treat as legitimate result, NOT error

    const responseText = await response.text()
    console.log(`[foerdergebiet] PLZ ${plz} -> raw response: "${responseText.substring(0, 200)}"`)

    // Case 2: Empty body = Google API found nothing for PLZ
    if (!responseText || responseText.trim() === "" || responseText.trim() === "false") {
      console.log(`[foerdergebiet] PLZ ${plz} -> empty/false response = kein Fördergebiet`)
      return { ...FALLBACK, source: "webhook" }
    }

    // Try to parse JSON
    let data: Record<string, unknown>
    try {
      data = JSON.parse(responseText)
    } catch {
      console.log(`[foerdergebiet] PLZ ${plz} -> non-JSON response = kein Fördergebiet`)
      return { ...FALLBACK, source: "webhook" }
    }

    // Parse the n8n response structure
    const extraction = (data?.foerderDetails as Record<string, unknown>)?.supabaseExtraction
    const rawCode = Array.isArray(extraction) ? extraction[0]?.foerdergebiet : undefined

    // Case 3/4/5: n/a, false, empty, "N" = kein Fördergebiet (legitimate result)
    if (rawCode === undefined || rawCode === null || rawCode === false || rawCode === "n/a" || rawCode === "") {
      console.log(`[foerdergebiet] PLZ ${plz} -> code is "${rawCode}" = kein Fördergebiet`)
      return { ...FALLBACK, source: "webhook" }
    }

    const trimmedCode = String(rawCode).trim()
    console.log(`[foerdergebiet] PLZ ${plz} -> raw code: "${trimmedCode}"`)

    // "N" is also kein Fördergebiet
    if (trimmedCode === "N") {
      return { ...FALLBACK, source: "webhook" }
    }
    
    const mapped = resolveBestCode(trimmedCode)

    if (!mapped) {
      console.error(`[foerdergebiet] Unknown code "${trimmedCode}" for PLZ ${plz}`)
      return { ...FALLBACK, source: "webhook" }
    }

    console.log(`[foerdergebiet] PLZ ${plz} -> resolved: ${mapped.code} (${mapped.foerdergebiet})`)
    return { ...mapped, source: "webhook" }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(`[foerdergebiet] Webhook timeout (${TIMEOUT_MS}ms) for PLZ ${plz}`)
      return { ...FALLBACK, source: "error", error: "Fördergebiet konnte nicht abgerufen werden (Zeitüberschreitung)" }
    }
    console.error(`[foerdergebiet] Webhook error for PLZ ${plz}:`, error)
    return { ...FALLBACK, source: "error", error: "Fördergebiet konnte nicht abgerufen werden (Verbindungsfehler)" }
  }
}
