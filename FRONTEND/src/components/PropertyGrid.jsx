import PropertyCard from "./PropertyCard"
import { getPropertyCategory } from "../services/ImageHelper"
import { PRICE_RANGES } from "./FiltersBar"

export default function PropertyGrid({
  properties,
  loading,
  error,
  query,
  selectedCategory,
  searchParams,
  priceRange,
  showWishlistOnly,
  onSelectProperty,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-2">
            <div className="aspect-square w-full rounded-xl bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted mt-1" />
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="h-3 w-1/3 rounded bg-muted mt-1" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-semibold text-primary">Unable to load stays.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Make sure the Spring Boot backend server on port 8086 is running.
        </p>
      </div>
    )
  }

  let filtered = [...properties]

  // 1. Wishlist filter — show only liked items from localStorage
  if (showWishlistOnly) {
    let liked = []
    try {
      liked = JSON.parse(localStorage.getItem("staybnb_likes") || "[]")
    } catch (_) {}
    filtered = filtered.filter((p) => liked.includes(p.id))
  }

  // 2. Category filter
  if (selectedCategory && selectedCategory !== "all") {
    filtered = filtered.filter((p) => getPropertyCategory(p) === selectedCategory)
  }

  // 3. Text query
  const q = query.trim().toLowerCase()
  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    )
  }

  // 4. Guest capacity
  if (searchParams && searchParams.guests > 0) {
    filtered = filtered.filter((p) => p.maxGuests >= searchParams.guests)
  }

  // 5. Price range filter
  if (priceRange && priceRange !== "all") {
    const range = PRICE_RANGES.find((r) => r.id === priceRange)
    if (range) {
      filtered = filtered.filter((p) => {
        const price = p.pricePerNight ?? 0
        if (range.min !== undefined && price < range.min) return false
        if (range.max !== undefined && price > range.max) return false
        return true
      })
    }
  }

  if (!filtered.length) {
    return (
      <div className="py-16 text-center">
        {showWishlistOnly ? (
          <>
            <div className="text-4xl mb-3">❤️</div>
            <h3 className="font-bold text-foreground">No wishlisted stays yet</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Click the heart icon on any listing to save it here.
            </p>
          </>
        ) : (
          <>
            <h3 className="font-bold text-foreground">No stays match your criteria</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Try resetting search filters or choosing another category.
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-6">
      {filtered.map((property) => (
        <PropertyCard
          key={property.id ?? property.title}
          property={property}
          onSelect={onSelectProperty}
        />
      ))}
    </div>
  )
}

// Export filtered count helper for FiltersBar
export function getFilteredCount(properties, { showWishlistOnly, selectedCategory, query, searchParams, priceRange }) {
  let filtered = [...properties]

  if (showWishlistOnly) {
    let liked = []
    try { liked = JSON.parse(localStorage.getItem("staybnb_likes") || "[]") } catch (_) {}
    filtered = filtered.filter((p) => liked.includes(p.id))
  }
  if (selectedCategory && selectedCategory !== "all") {
    filtered = filtered.filter((p) => getPropertyCategory(p) === selectedCategory)
  }
  const q = (query || "").trim().toLowerCase()
  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    )
  }
  if (searchParams && searchParams.guests > 0) {
    filtered = filtered.filter((p) => p.maxGuests >= searchParams.guests)
  }
  if (priceRange && priceRange !== "all") {
    const range = PRICE_RANGES.find((r) => r.id === priceRange)
    if (range) {
      filtered = filtered.filter((p) => {
        const price = p.pricePerNight ?? 0
        if (range.min !== undefined && price < range.min) return false
        if (range.max !== undefined && price > range.max) return false
        return true
      })
    }
  }
  return filtered.length
}