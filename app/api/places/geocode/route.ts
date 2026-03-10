import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const plz = searchParams.get("plz")

  if (!plz) {
    return NextResponse.json({ error: "PLZ parameter required" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
  }

  try {
    // Use Google Geocoding API to get city from PLZ
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${plz},Germany&key=${apiKey}&language=de`
    
    const response = await fetch(geocodeUrl)
    const data = await response.json()

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const result = data.results[0]
      
      // Extract city from address components
      let city = ""
      let state = ""
      
      for (const component of result.address_components) {
        if (component.types.includes("locality")) {
          city = component.long_name
        }
        if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name
        }
        // Fallback for cities without locality
        if (!city && component.types.includes("administrative_area_level_3")) {
          city = component.long_name
        }
        if (!city && component.types.includes("sublocality")) {
          city = component.long_name
        }
      }

      return NextResponse.json({
        city: city || null,
        state: state || null,
        formattedAddress: result.formatted_address,
        plz
      })
    }

    return NextResponse.json({ 
      city: null, 
      error: "PLZ not found",
      plz 
    })
  } catch (error) {
    console.error("Geocode API error:", error)
    return NextResponse.json({ error: "Failed to geocode PLZ" }, { status: 500 })
  }
}
