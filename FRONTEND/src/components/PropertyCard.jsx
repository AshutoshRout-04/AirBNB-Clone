import { useState, useEffect } from "react"
import { Star, Users, BedDouble, Bath, Heart, ChevronLeft, ChevronRight, Sparkles, Briefcase } from "lucide-react"
import { getPropertyImages } from "../services/ImageHelper"
import { getRatingSummary } from "../services/ReviewService"

export default function PropertyCard({ property, onSelect }) {
  const { id, title, location, pricePerNight, bedrooms, bathrooms, maxGuests, available, rating, propertyType, companyName } = property
  const images = getPropertyImages(property)

  const [imageIndex, setImageIndex] = useState(0)
  const [liked, setLiked] = useState(false)
  const [ratingData, setRatingData] = useState({ rating: null, count: 0 })

  // Fetch real rating from backend
  useEffect(() => {
    if (id) {
      getRatingSummary(id)
        .then(res => setRatingData(res.data || { rating: null, count: 0 }))
        .catch(() => setRatingData({ rating: null, count: 0 }))
    }
  }, [id])

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      const storedLikes = JSON.parse(localStorage.getItem("staybnb_likes") || "[]")
      setLiked(storedLikes.includes(id))
    } catch (e) {
      console.error(e)
    }
  }, [id])

  const handleLikeToggle = (e) => {
    e.stopPropagation()
    try {
      const storedLikes = JSON.parse(localStorage.getItem("staybnb_likes") || "[]")
      let updatedLikes
      if (liked) {
        updatedLikes = storedLikes.filter((favId) => favId !== id)
      } else {
        updatedLikes = [...storedLikes, id]
      }
      localStorage.setItem("staybnb_likes", JSON.stringify(updatedLikes))
      setLiked(!liked)
    } catch (err) {
      console.error(err)
    }
  }

  const handlePrevImage = (e) => {
    e.stopPropagation()
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <article
      onClick={() => onSelect(property)}
      className="group flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted shadow-sm">
        <img
          src={images[imageIndex]}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Heart Icon button */}
        <button
          type="button"
          onClick={handleLikeToggle}
          className="absolute right-3.5 top-3.5 z-10 rounded-full bg-background/80 p-2 text-foreground transition duration-200 hover:scale-110 active:scale-95 hover:bg-background shadow-md"
        >
          <Heart
            size={16}
            className={`transition ${
              liked ? "fill-primary text-primary stroke-primary scale-110" : "stroke-foreground/70"
            }`}
          />
        </button>

        {/* Availability tag */}
        {!available && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-foreground/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-background shadow">
            Booked
          </span>
        )}

        {/* Carousel buttons (only shown on hover) */}
        <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={handlePrevImage}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-background shadow-md hover:scale-105 active:scale-95 transition"
            aria-label="Previous image"
          >
            <ChevronLeft size={14} className="stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={handleNextImage}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-background shadow-md hover:scale-105 active:scale-95 transition"
            aria-label="Next image"
          >
            <ChevronRight size={14} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Carousel indicators (dots) */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                imageIndex === idx ? "bg-white scale-125 w-2" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Title & Rating */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="font-bold text-sm leading-tight text-foreground truncate">{title}</h3>
        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground">
          <Star size={12} className="fill-foreground stroke-foreground" />
          {ratingData.rating != null ? Number(ratingData.rating).toFixed(1) : "New"}
        </span>
      </div>

      {/* Location */}
      <p className="text-xs text-muted-foreground mt-0.5">
        {location} {companyName ? `· By ${companyName}` : ""}
      </p>

      {/* Specifications */}
      <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1 text-[11px] text-muted-foreground">
        {propertyType === "experience" ? (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
            <Sparkles size={10} /> Experience · Up to {maxGuests} guests
          </span>
        ) : propertyType === "service" ? (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
            <Briefcase size={10} /> Service {companyName ? `by ${companyName}` : ""}
          </span>
        ) : (
          <>
            <span className="flex items-center gap-0.5"><Users size={11} /> {maxGuests} guest{maxGuests === 1 ? "" : "s"}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5"><BedDouble size={11} /> {bedrooms} bd</span>
            <span>•</span>
            <span className="flex items-center gap-0.5"><Bath size={11} /> {bathrooms} ba</span>
          </>
        )}
      </div>

      {/* Pricing */}
      <p className="mt-2.5 text-xs text-muted-foreground">
        <span className="font-bold text-sm text-foreground">₹{pricePerNight.toLocaleString()}</span>{' '}
        {propertyType === "experience" ? "session" : propertyType === "service" ? "service" : "night"}
      </p>
    </article>
  )
}