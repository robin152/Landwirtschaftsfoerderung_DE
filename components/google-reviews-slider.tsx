"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Star, Quote } from "lucide-react"

interface Review {
  author_name: string
  rating: number
  text: string
  relative_time_description: string
  profile_photo_url?: string | null
}

interface ReviewsData {
  reviews: Review[]
  rating: number
  totalReviews: number
  isFallback: boolean
}

export function GoogleReviewsSlider() {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/google-reviews", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviewsData(data)
        } else {
          setError("No reviews available")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        console.error("[v0] Error fetching reviews:", errorMessage)
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - sliderRef.current.offsetLeft)
    setScrollLeft(sliderRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return
    e.preventDefault()
    const x = e.pageX - sliderRef.current.offsetLeft
    const walk = (x - startX) * 2
    sliderRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => setIsDragging(false)
  const handleMouseLeave = () => setIsDragging(false)

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft)
    setScrollLeft(sliderRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft
    const walk = (x - startX) * 2
    sliderRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => setIsDragging(false)

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-600 text-slate-600"
            }`}
          />
        ))}
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex gap-3 sm:gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[260px] sm:w-[300px] lg:w-[340px] h-[140px] sm:h-[160px] rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error || !reviewsData || reviewsData.reviews.length === 0) {
    return null
  }

  const reviews = reviewsData.reviews

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header with Google rating */}
      <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
          <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-xs sm:text-sm font-semibold text-slate-900">{reviewsData.rating.toFixed(1)}</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(reviewsData.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-slate-300 text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs text-slate-600">({reviewsData.totalReviews} Bewertungen)</span>
        </div>
      </div>

      {/* Reviews Slider */}
      <div
        className="relative w-full overflow-hidden"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {/* Blur edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 lg:w-28 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 lg:w-28 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

        <div className={`flex gap-3 sm:gap-4 ${isDragging ? "" : "animate-scroll-reviews"}`}>
          {[...Array(3)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-3 sm:gap-4 shrink-0">
              {reviews.map((review, reviewIndex) => (
                <div
                  key={`${setIndex}-${reviewIndex}`}
                  className="shrink-0 w-[260px] sm:w-[300px] lg:w-[340px] p-4 sm:p-5 rounded-xl 
                    bg-slate-50 border border-slate-200/60
                    hover:bg-white hover:border-purple-200/80 transition-all duration-300
                    shadow-sm hover:shadow-md select-none"
                >
                  <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400/60 mb-2 sm:mb-3" />

                  {/* Review text */}
                  <p className="font-reviews text-[11px] sm:text-xs lg:text-sm text-slate-700 leading-relaxed mb-3 sm:mb-4 line-clamp-3 italic">
                    "{review.text}"
                  </p>

                  {/* Author info */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Avatar */}
                    {review.profile_photo_url ? (
                      <img
                        src={review.profile_photo_url || "/placeholder.svg"}
                        alt={review.author_name}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-200/60"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-white">
                        {getInitials(review.author_name)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-slate-900 truncate">{review.author_name}</div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-[9px] sm:text-[10px] text-slate-500">
                          {review.relative_time_description}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
