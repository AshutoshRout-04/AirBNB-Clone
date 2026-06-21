import { useState, useEffect } from "react"
import { Star, MapPin, Calendar, User, CheckCircle2, RefreshCw } from "lucide-react"
import { getBookingsByUserId } from "../../services/BookingService"
import { useAuth } from "../LoginModal"

export default function ProfilePastTrips() {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // Track reviews locally (not persisted to backend yet)
  const [localReviews, setLocalReviews] = useState({})

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    setError(null)
    getBookingsByUserId(user.id)
      .then((res) => {
        setTrips(res.data || [])
      })
      .catch((err) => {
        console.error("Error fetching trips:", err)
        setError("Could not load past trips.")
      })
      .finally(() => setLoading(false))
  }, [user])

  const [activeReviewTrip, setActiveReviewTrip] = useState(null)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState("")

  const openReviewModal = (trip) => {
    setActiveReviewTrip(trip)
    setRating(5)
    setReviewText("")
  }

  const submitReview = () => {
    if (!reviewText.trim()) return
    setLocalReviews((prev) => ({
      ...prev,
      [activeReviewTrip.bookingId]: { rating, reviewText },
    }))
    setActiveReviewTrip(null)
  }

  return (
    <div className="flex-1 animate-fade-in">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Past trips</h2>
        <p className="text-sm text-gray-500 mt-1">Here is where you've traveled. Share feedback to help the community.</p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-40 text-gray-400">
          <RefreshCw size={24} className="animate-spin mr-2" />
          <span className="text-sm font-semibold">Loading your trips...</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && trips.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-center">
          <Calendar size={40} className="mb-3 stroke-[1.5]" />
          <p className="font-bold text-gray-700">No trips yet</p>
          <p className="text-xs mt-1 max-w-xs">Once you book a stay, it will appear here.</p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {trips.map((booking) => {
          const prop = booking.property || {}
          const title = prop.title || "Staybnb Property"
          const location = prop.location || prop.city || "Location unavailable"
          // Use first image from property images array, or a fallback
          const image = (prop.images && prop.images.length > 0)
            ? prop.images[0]
            : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"
          const hostName = prop.host_Id?.user?.fullname || "Your host"
          const checkIn = booking.checkInDate
          const checkOut = booking.checkOutDate
          const dates = checkIn && checkOut ? `${checkIn} – ${checkOut}` : "Dates unavailable"
          const review = localReviews[booking.bookingId]

          return (
            <div
              key={booking.bookingId}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition duration-300"
            >
              {/* Property Image */}
              <div className="h-48 md:h-auto md:w-64 shrink-0 relative">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                  {booking.status || "Completed"}
                </div>
              </div>

              {/* Trip Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <MapPin size={12} />
                    <span>{location}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1.5">{title}</h3>

                  <div className="mt-4 space-y-2 text-xs text-gray-500 font-semibold">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-gray-400" />
                      <span>{dates}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={13} className="text-gray-400" />
                      <span>Hosted by {hostName}</span>
                    </div>
                  </div>
                </div>

                {/* Review section / status */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {review ? (
                    <div className="flex-1 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <CheckCircle2 size={14} className="text-green-500" />
                        <span className="text-xs font-bold text-gray-800">You reviewed this stay</span>
                        <div className="flex gap-0.5 ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < review.rating ? "fill-[#ffb100] text-[#ffb100]" : "text-gray-200"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed italic">
                        "{review.reviewText}"
                      </p>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs font-semibold text-gray-500">
                        No review submitted yet.
                      </span>
                      <button
                        onClick={() => openReviewModal(booking)}
                        className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition duration-200 cursor-pointer active:scale-95 select-none"
                      >
                        Write a review
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Review Modal */}
      {activeReviewTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Write a review</h3>
            <p className="text-xs text-gray-500">
              Share your experience at <span className="font-semibold text-gray-800">{activeReviewTrip.property?.title || "this property"}</span>.
            </p>

            {/* Star Rating Selection */}
            <div className="flex items-center gap-1.5 my-6">
              <span className="text-sm font-bold text-gray-700 mr-2">Rating:</span>
              {[...Array(5)].map((_, idx) => {
                const starVal = idx + 1
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRating(starVal)}
                    className="hover:scale-110 transition duration-150 cursor-pointer"
                  >
                    <Star
                      size={26}
                      className={
                        starVal <= rating
                          ? "fill-[#ffb100] text-[#ffb100]"
                          : "text-gray-300 hover:text-[#ffb100]"
                      }
                    />
                  </button>
                )
              })}
            </div>

            {/* Review Input */}
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us what you liked, what could be improved, and how the host was..."
              rows={4}
              className="w-full rounded-2xl border border-gray-300 p-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition resize-none bg-gray-50/20"
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setActiveReviewTrip(null)}
                className="px-5 py-2.5 text-xs font-bold border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl transition cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={!reviewText.trim()}
                className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl transition cursor-pointer select-none shadow-sm
                  ${
                    reviewText.trim()
                      ? "bg-primary hover:bg-primary-hover active:scale-95"
                      : "bg-gray-300 cursor-not-allowed"
                  }
                `}
              >
                Submit review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
