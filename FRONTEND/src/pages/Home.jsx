import { useEffect, useState, useRef } from "react"
import Header from "../components/Header"
import Searchbar from "../components/Searchbar"
import CategoryFilter from "../components/CategoryFilter"
import PropertyGrid, { getFilteredCount } from "../components/PropertyGrid"
import FiltersBar from "../components/FiltersBar"
import FloatingMapButton from "../components/FloatingMapButton"
import Footer from "../components/Footer"
import PropertyDetailModal from "../components/PropertyDetailModal"
import BecomeHostModal from "../components/BecomeHostModal"
import BookingsDrawer from "../components/BookingsDrawer"
import { getAllProperties } from "../services/PropertyService"
import { useToast } from "../components/Toast"
import { useAuth } from "../components/LoginModal"

import ExperiencesSection from "../components/ExperiencesSection"
import ServicesSection from "../components/ServicesSection"

export default function Home({ onSwitchToHost }) {
  const toast = useToast()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filtering states
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [showWishlistOnly, setShowWishlistOnly] = useState(false)
  const [searchParams, setSearchParams] = useState({ checkIn: "", checkOut: "", guests: 0 })

  // Overlays
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showHostModal, setShowHostModal] = useState(false)
  const [showBookingsDrawer, setShowBookingsDrawer] = useState(false)

  const searchInputsRef = useRef(null)

  const fetchProperties = () => {
    setLoading(true)
    getAllProperties()
      .then((res) => {
        const data = res.data || []
        setProperties(Array.isArray(data) ? data : data.properties ?? data.data ?? [])
        setError(null)
      })
      .catch((err) => {
        console.error("Error loading properties:", err)
        setError(err)
        toast({
          type: "error",
          title: "Connection error",
          message: "Could not reach the server. Make sure the backend is running on port 8086.",
          duration: 6000,
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleFocusSearch = () => {
    if (searchInputsRef.current) {
      searchInputsRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      searchInputsRef.current.classList.add("ring-2", "ring-primary/45")
      setTimeout(() => {
        searchInputsRef.current?.classList.remove("ring-2", "ring-primary/45")
      }, 1500)
    }
  }

  const handleSearch = (params) => {
    setSearchParams(params)
    setQuery(params.query || "")
    if (params.query || params.guests > 0) {
      toast({
        type: "info",
        title: "Search applied",
        message: [
          params.query && `Location: ${params.query}`,
          params.checkIn && `Check-in: ${params.checkIn}`,
          params.guests > 0 && `Guests: ${params.guests}`,
        ].filter(Boolean).join(" · "),
        duration: 3000,
      })
    }
  }

  const handleToggleWishlist = () => {
    const next = !showWishlistOnly
    setShowWishlistOnly(next)
    toast({
      type: next ? "success" : "info",
      title: next ? "Showing Wishlists" : "Showing all stays",
      message: next
        ? "Displaying your saved favourites."
        : "Cleared wishlist filter — showing all listings.",
      duration: 3000,
    })
  }

  const handleMapClick = () => {
    toast({
      type: "info",
      title: "Map view",
      message: "Map integration coming soon! Stay tuned.",
      duration: 3000,
    })
  }

  // Compute filtered count for FiltersBar
  const filteredCount = getFilteredCount(properties, {
    showWishlistOnly,
    selectedCategory,
    query,
    searchParams,
    priceRange,
  })

  const { user, isLoggedIn } = useAuth()

  const handleSwitchToHostMode = () => {
    if (isLoggedIn && (user.role === "HOST" || user.role === "HOST_GUEST")) {
      onSwitchToHost()
    } else {
      setShowHostModal(true)
    }
  }

  // Extract experiences and services for the showcase sections
  const experienceProperties = properties.filter((p) => p.propertyType === "experience")
  const serviceProperties = properties.filter((p) => p.propertyType === "service")

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between font-sans">
      <div>
        {/* Header */}
        <Header
          onSwitchToHost={handleSwitchToHostMode}
          onOpenHostModal={() => setShowHostModal(true)}
          onOpenBookingsDrawer={() => setShowBookingsDrawer(true)}
          onFocusSearch={handleFocusSearch}
          onToggleWishlist={handleToggleWishlist}
          showWishlistOnly={showWishlistOnly}
        />

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          {/* Search bar — receives properties for dynamic location suggestions */}
          <Searchbar
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            searchInputsRef={searchInputsRef}
            properties={properties}
          />

          {/* Airbnb Experiences Showcase */}
          {!loading && experienceProperties.length > 0 && (
            <div className="mb-12">
              <ExperiencesSection 
                properties={experienceProperties} 
                onSelectProperty={(property) => setSelectedProperty(property)} 
              />
            </div>
          )}

          {/* Airbnb Services Showcase */}
          {!loading && serviceProperties.length > 0 && (
            <div className="mb-12">
              <ServicesSection 
                properties={serviceProperties} 
                onSelectProperty={(property) => setSelectedProperty(property)} 
              />
            </div>
          )}

          {/* Category horizontal scroll */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={(cat) => {
              setSelectedCategory(cat)
              // If switching away from wishlist via category, keep in sync but don't force clear
            }}
          />

          {/* Results count + Filters button */}
          {!loading && !error && (
            <FiltersBar
              count={filteredCount}
              total={properties.length}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          )}

          {/* Property grid */}
          <PropertyGrid
            properties={properties}
            loading={loading}
            error={error}
            query={query}
            selectedCategory={selectedCategory}
            searchParams={searchParams}
            priceRange={priceRange}
            showWishlistOnly={showWishlistOnly}
            onSelectProperty={(property) => setSelectedProperty(property)}
          />
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating "Show map" button */}
      {!loading && !selectedProperty && !showHostModal && (
        <FloatingMapButton onClick={handleMapClick} />
      )}

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onBookingSuccess={() => {
            toast({
              type: "success",
              title: "Booking confirmed!",
              message: "Your stay has been reserved. Check 'Trips' for details.",
              duration: 5000,
            })
          }}
        />
      )}

      {/* Become a Host Modal */}
      {showHostModal && (
        <BecomeHostModal
          onClose={() => setShowHostModal(false)}
          onPropertyAdded={() => {
            fetchProperties()
            toast({
              type: "success",
              title: "Listing published!",
              message: "Your property is now live and visible to guests.",
              duration: 5000,
            })
          }}
        />
      )}

      {/* My Bookings Drawer */}
      <BookingsDrawer
        isOpen={showBookingsDrawer}
        onClose={() => setShowBookingsDrawer(false)}
        properties={properties}
      />
    </div>
  )
}
