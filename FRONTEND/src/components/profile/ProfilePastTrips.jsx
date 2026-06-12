import { useState } from "react"
import { Star, MapPin, Calendar, User, CheckCircle2 } from "lucide-react"

export default function ProfilePastTrips() {
  const [trips, setTrips] = useState([
    {
      id: "trip-1",
      title: "Eco-Bamboo House in Ubud",
      location: "Bali, Indonesia",
      dates: "October 12 – 19, 2025",
      host: "Ketut",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80",
      reviewed: false,
    },
    {
      id: "trip-2",
      title: "Sleek Mid-Century Penthouse",
      location: "Manhattan, New York",
      dates: "May 3 – 8, 2025",
      host: "Sarah",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
      reviewed: true,
      reviewText: "Incredible stay! The view of the skyline was unmatched, and Sarah was a wonderful host.",
      rating: 5,
    },
  ])

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

    setTrips(
      trips.map((t) =>
        t.id === activeReviewTrip.id
          ? {
              ...t,
              reviewed: true,
              rating,
              reviewText,
            }
          : t
      )
    )
    setActiveReviewTrip(null)
  }

  return (
    <div className="flex-1 animate-fade-in">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Past trips</h2>
        <p className="text-sm text-gray-500 mt-1">Here is where you've traveled. Share feedback to help the community.</p>
      </div>

      <div className="flex flex-col gap-6">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition duration-300"
          >
            {/* Property Image */}
            <div className="h-48 md:h-auto md:w-64 shrink-0 relative">
              <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                Completed
              </div>
            </div>

            {/* Trip Details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <MapPin size={12} />
                  <span>{trip.location}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-1.5">{trip.title}</h3>

                <div className="mt-4 space-y-2 text-xs text-gray-500 font-semibold">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-gray-400" />
                    <span>{trip.dates}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-gray-400" />
                    <span>Hosted by {trip.host}</span>
                  </div>
                </div>
              </div>

              {/* Review section / status */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {trip.reviewed ? (
                  <div className="flex-1 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CheckCircle2 size={14} className="text-green-500" />
                      <span className="text-xs font-bold text-gray-800">You reviewed this stay</span>
                      <div className="flex gap-0.5 ml-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < trip.rating ? "fill-[#ffb100] text-[#ffb100]" : "text-gray-200"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed italic">
                      "{trip.reviewText}"
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-semibold text-gray-500">
                      No review submitted yet.
                    </span>
                    <button
                      onClick={() => openReviewModal(trip)}
                      className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4.5 py-2.5 rounded-xl shadow transition duration-200 cursor-pointer active:scale-95 select-none"
                    >
                      Write a review
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {activeReviewTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Write a review</h3>
            <p className="text-xs text-gray-500">
              Share your experience at <span className="font-semibold text-gray-800">{activeReviewTrip.title}</span>.
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
