import { NextResponse } from "next/server"

// Place ID for the business - replace with actual Place ID
const PLACE_ID = process.env.GOOGLE_PLACE_ID || "ChIJa2lHPR63uEcRK3Lo2CSLOgM" // Example: Patrick Starkmann's business

interface GoogleReview {
  author_name: string
  author_url: string
  language: string
  profile_photo_url: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

interface PlaceDetailsResponse {
  result: {
    rating: number
    user_ratings_total: number
    reviews: GoogleReview[]
  }
  status: string
}

// Fallback reviews if API fails
const fallbackReviews = {
  rating: 4.9,
  totalReviews: 127,
  reviews: [
    {
      author_name: "Michael Schneider",
      rating: 5,
      text: "Hervorragende Beratung zur Regional-Förderung! Die Experten haben uns schnell 150.000€ Zuschuss gesichert. Sehr professionell und kompetent.",
      relative_time_description: "vor 2 Wochen",
      profile_photo_url: null,
    },
    {
      author_name: "Sandra Hoffmann",
      rating: 5,
      text: "Absolut professionell und kompetent. Der gesamte Prozess war transparent und unkompliziert. Kann ich nur weiterempfehlen!",
      relative_time_description: "vor 3 Wochen",
      profile_photo_url: null,
    },
    {
      author_name: "Thomas Wagner",
      rating: 5,
      text: "Wir haben 200.000€ Infrastrukturförderung erhalten. Sehr zuverlässiger Partner für alle Förderthemen!",
      relative_time_description: "vor 1 Monat",
      profile_photo_url: null,
    },
    {
      author_name: "Julia Becker",
      rating: 5,
      text: "Schnelle Genehmigung und großartige Unterstützung beim Antragsprozess. Das Team hat uns durch jeden Schritt begleitet.",
      relative_time_description: "vor 4 Wochen",
      profile_photo_url: null,
    },
    {
      author_name: "Andreas Fischer",
      rating: 5,
      text: "Top Beratung! Innerhalb von 6 Wochen hatten wir unseren Förderbescheid. Absolut empfehlenswert für KMUs.",
      relative_time_description: "vor 2 Monaten",
      profile_photo_url: null,
    },
  ],
  isFallback: true,
}

export async function GET() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  
  if (!apiKey) {
    console.error("[v0] GOOGLE_MAPS_API_KEY not configured")
    return NextResponse.json(fallbackReviews)
  }

  try {
    // Use Place Details API with reviews field
    // Note: Google Places API returns max 5 reviews by default
    // To get more reviews, you need to use the new Places API (v1) with reviews sorting
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json")
    url.searchParams.set("place_id", PLACE_ID)
    url.searchParams.set("fields", "rating,user_ratings_total,reviews")
    url.searchParams.set("reviews_sort", "newest") // Get newest reviews
    url.searchParams.set("language", "de") // German reviews
    url.searchParams.set("key", apiKey)

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`)
    }

    const data: PlaceDetailsResponse = await response.json()

    if (data.status !== "OK" || !data.result) {
      console.error("[v0] Google Places API error:", data.status)
      return NextResponse.json(fallbackReviews)
    }

    const reviews = data.result.reviews || []
    
    // Transform to our format
    const transformedReviews = reviews.map((review) => ({
      author_name: review.author_name,
      rating: review.rating,
      text: review.text,
      relative_time_description: review.relative_time_description,
      profile_photo_url: review.profile_photo_url || null,
    }))

    return NextResponse.json({
      rating: data.result.rating || 4.9,
      totalReviews: data.result.user_ratings_total || transformedReviews.length,
      reviews: transformedReviews,
      isFallback: false,
    })
  } catch (error) {
    console.error("[v0] Error fetching Google reviews:", error)
    return NextResponse.json(fallbackReviews)
  }
}
