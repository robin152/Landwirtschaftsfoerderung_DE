import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const placeId = searchParams.get("placeId") || searchParams.get("place_id")

  if (!placeId) {
    return NextResponse.json({ error: "placeId required" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    // Fetch place details
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json")
    url.searchParams.set("place_id", placeId)
    url.searchParams.set("key", apiKey)
    url.searchParams.set("fields", "name,formatted_address,website,formatted_phone_number,types,address_components,geometry,business_status,opening_hours,url,rating,user_ratings_total")
    url.searchParams.set("language", "de")

    const response = await fetch(url.toString())
    const data = await response.json()

    if (data.status === "OK" && data.result) {
      const result = data.result
      
      // Extract PLZ from address components
      const plz = result.address_components?.find((c: any) => 
        c.types.includes("postal_code")
      )?.long_name || ""
      
      // Extract city - try locality first, then administrative_area_level_2 (Landkreis), then sublocality
      const city = result.address_components?.find((c: any) => 
        c.types.includes("locality")
      )?.long_name 
        || result.address_components?.find((c: any) => 
          c.types.includes("administrative_area_level_2")
        )?.long_name 
        || result.address_components?.find((c: any) => 
          c.types.includes("sublocality_level_1")
        )?.long_name
        || result.address_components?.find((c: any) => 
          c.types.includes("administrative_area_level_3")
        )?.long_name
        || ""
      
      // Map Google types to German industry categories
      const industryMapping: Record<string, string> = {
        "manufacturing": "Produktion & Fertigung",
        "factory": "Produktion & Fertigung",
        "car_dealer": "Automobilindustrie",
        "car_repair": "Automobilindustrie",
        "electronics_store": "Elektronik & IT",
        "hardware_store": "Handel & Vertrieb",
        "store": "Handel & Vertrieb",
        "restaurant": "Gastronomie",
        "food": "Lebensmittelindustrie",
        "health": "Gesundheitswesen",
        "finance": "Finanzdienstleistungen",
        "real_estate_agency": "Immobilien",
        "lodging": "Tourismus & Hotellerie",
        "gym": "Sport & Fitness",
        "spa": "Wellness & Gesundheit",
        "general_contractor": "Bauwesen",
        "electrician": "Handwerk",
        "plumber": "Handwerk",
        "roofing_contractor": "Handwerk",
        "lawyer": "Rechtsberatung",
        "accounting": "Steuerberatung & Wirtschaftsprüfung",
        "insurance_agency": "Versicherungen",
        "moving_company": "Logistik & Transport",
        "storage": "Logistik & Lagerung",
        "travel_agency": "Reise & Tourismus",
        "university": "Bildung & Forschung",
        "school": "Bildung",
      }
      
      // Determine industry from types
      let industry = "Sonstige Branche"
      for (const type of result.types || []) {
        if (industryMapping[type]) {
          industry = industryMapping[type]
          break
        }
      }

      return NextResponse.json({
        company: {
          name: result.name,
          address: result.formatted_address,
          plz,
          city,
          website: result.website || null,
          phone: result.formatted_phone_number || null,
          industry,
          types: result.types || [],
          location: result.geometry?.location || null,
          rating: result.rating || null,
          ratingsCount: result.user_ratings_total || null,
          businessStatus: result.business_status || null,
          googleMapsUrl: result.url || null
        }
      })
    }

    return NextResponse.json({ error: data.status }, { status: 400 })
  } catch (error) {
    console.error("Places details error:", error)
    return NextResponse.json({ error: "Failed to fetch details" }, { status: 500 })
  }
}
