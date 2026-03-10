import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const input = searchParams.get("input")

  if (!input || input.length < 2) {
    return NextResponse.json({ predictions: [] })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    // Use Places Autocomplete API for businesses in Germany
    const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json")
    url.searchParams.set("input", input)
    url.searchParams.set("key", apiKey)
    url.searchParams.set("types", "establishment")
    url.searchParams.set("components", "country:de")
    url.searchParams.set("language", "de")

    const response = await fetch(url.toString())
    const data = await response.json()

    if (data.status === "OK" || data.status === "ZERO_RESULTS") {
      return NextResponse.json({
        predictions: data.predictions?.map((p: any) => ({
          place_id: p.place_id,
          description: p.description,
          structured_formatting: p.structured_formatting
        })) || []
      })
    }

    return NextResponse.json({ predictions: [], error: data.status, errorMessage: data.error_message })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 })
  }
}
