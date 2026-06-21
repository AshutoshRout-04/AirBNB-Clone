import { useState, useEffect } from "react"
import { X, Trash2, Calendar, ShieldAlert, RefreshCw, Star, MessageSquare } from "lucide-react"
import { getBookingsByUserId, deleteBooking } from "../services/BookingService"
import { hasReviewedBooking } from "../services/ReviewService"
import { getPropertyImages } from "../services/ImageHelper"
import { useToast } from "./Toast"
import { useAuth } from "./LoginModal"
import ReviewModal from "./ReviewModal"
import GuestChatModal from "./GuestChatModal"

const STATUS_COLORS = {
  CONFIRMED:   { bg: "#e6f7f6", color: "#00a699" },
  PENDING:     { bg: "#fff8e7", color: "#fc642d" },
  CHECKED_IN:  { bg: "#e8f4fd", color: "#1a73e8" },
  CHECKED_OUT: { bg: "#f0e8fd", color: "#7b2fe8" },
  CANCELLED:   { bg: "#fff0f2", color: "#ff385c" },
  COMPLETED:   { bg: "#f7f7f7", color: "#484848" },
}

export default function BookingsDrawer({ isOpen, onClose, properties }) {
  const toast = useToast()
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)
  const [confirmCancelId, setConfirmCancelId] = useState(null)

  // Review state
  const [reviewedBookings, setReviewedBookings] = useState({}) // bookingId → true/false
  const [reviewModalBooking, setReviewModalBooking] = useState(null)

  // Chat state
  const [chatBooking, setChatBooking] = useState(null)

  const fetchBookings = async () => {
    if (!user?.id) return
    setLoading(true)
    setError(null)
    try {
      const response = await getBookingsByUserId(user.id)
      const data = response.data || []
      setBookings(data)

      // Check which CHECKED_OUT bookings already have a review
      const checkedOut = data.filter(b => b.status === "CHECKED_OUT")
      const reviewChecks = await Promise.all(
        checkedOut.map(async (b) => {
          try {
            const res = await hasReviewedBooking(b.bookingId)
            return { bookingId: b.bookingId, reviewed: res.data?.reviewed ?? false }
          } catch {
            return { bookingId: b.bookingId, reviewed: false }
          }
        })
      )
      const reviewMap = {}
      reviewChecks.forEach(r => { reviewMap[r.bookingId] = r.reviewed })
      setReviewedBookings(reviewMap)
    } catch (err) {
      console.error(err)
      setError("Unable to retrieve bookings. Is the server running?")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchBookings()
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  const handleCancelBooking = async (bookingId) => {
    setConfirmCancelId(null)
    setCancellingId(bookingId)
    try {
      await deleteBooking(bookingId)
      setBookings(bookings.filter((b) => b.bookingId !== bookingId))
      toast({ type: "success", title: "Booking cancelled", message: "Your reservation has been successfully cancelled." })
    } catch (err) {
      console.error(err)
      toast({ type: "error", title: "Cancellation failed", message: "Could not cancel booking. Please try again." })
    } finally {
      setCancellingId(null)
    }
  }

  const handleReviewSubmitted = () => {
    if (reviewModalBooking) {
      setReviewedBookings(prev => ({ ...prev, [reviewModalBooking.bookingId]: true }))
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
        {/* Click outside to close */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} />

        {/* Drawer Panel */}
        <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-background p-6 shadow-2xl transition-transform duration-300 translate-x-0 animate-slide-in">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              <span>My Booked Trips</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchBookings}
                disabled={loading}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted disabled:opacity-40"
                title="Refresh Bookings"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto pr-1">
            {loading && bookings.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-muted-foreground">
                <RefreshCw size={24} className="animate-spin text-primary mb-2" />
                <span className="text-sm">Loading your trips...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                <ShieldAlert size={36} className="text-primary/70 mb-2" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Calendar size={36} className="stroke-[1.5]" />
                </div>
                <p className="font-bold text-foreground">No bookings found</p>
                <p className="mt-1 text-xs max-w-[200px] leading-relaxed">
                  Explore listings and book your stays. They will appear here once confirmed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const prop = booking.property || properties.find((p) => p.id === booking.property?.id) || {}
                  const title = prop.title || "Staybnb Property"
                  const location = prop.location || "Location not loaded"
                  const images = getPropertyImages(prop)
                  const statusStyle = STATUS_COLORS[booking.status] || STATUS_COLORS.CONFIRMED
                  const isCheckedOut = booking.status === "CHECKED_OUT" || booking.status === "COMPLETED"
                  const alreadyReviewed = reviewedBookings[booking.bookingId]

                  return (
                    <article
                      key={booking.bookingId}
                      className="group flex gap-4 rounded-xl border border-border bg-card p-3 shadow-sm transition hover:shadow-md flex-col"
                    >
                      <div className="flex gap-4">
                        <img
                          src={images[0]}
                          alt={title}
                          className="h-20 w-20 shrink-0 rounded-lg object-cover bg-muted"
                        />

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="truncate font-bold text-sm leading-snug">{title}</h4>
                              <span style={{
                                background: statusStyle.bg, color: statusStyle.color,
                                borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700,
                                whiteSpace: "nowrap", flexShrink: 0,
                              }}>
                                {booking.status || "CONFIRMED"}
                              </span>
                            </div>
                            <p className="truncate text-xs text-muted-foreground">{location}</p>

                            <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-muted-foreground">
                              <span>In: <strong className="text-foreground">{booking.checkInDate}</strong></span>
                              <span>Out: <strong className="text-foreground">{booking.checkOutDate}</strong></span>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2">
                            <span className="text-xs font-bold text-foreground">
                              ₹{(booking.totalAmount || 0).toLocaleString()}
                            </span>
                            <div className="flex items-center gap-2">
                              {/* Message Host button */}
                              <button
                                onClick={() => setChatBooking(booking)}
                                className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-[var(--color-primary-hover)] cursor-pointer"
                                title="Message your host"
                              >
                                <MessageSquare size={12} />
                                <span>Message</span>
                              </button>

                              {confirmCancelId === booking.bookingId ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-muted-foreground">Sure?</span>
                                  <button
                                    onClick={() => handleCancelBooking(booking.bookingId)}
                                    className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                                  >Yes</button>
                                  <button
                                    onClick={() => setConfirmCancelId(null)}
                                    className="text-[10px] font-bold text-muted-foreground hover:underline cursor-pointer"
                                  >No</button>
                                </div>
                              ) : (
                                !isCheckedOut && (
                                  <button
                                    onClick={() => setConfirmCancelId(booking.bookingId)}
                                    disabled={cancellingId === booking.bookingId}
                                    type="button"
                                    className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-[var(--color-primary-hover)] cursor-pointer disabled:opacity-40"
                                  >
                                    <Trash2 size={12} />
                                    <span>{cancellingId === booking.bookingId ? "Cancelling..." : "Cancel Stay"}</span>
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Leave a Review — only for CHECKED_OUT bookings */}
                      {isCheckedOut && (
                        <div className="border-t border-border/40 pt-2">
                          {alreadyReviewed ? (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                              <Star size={13} className="fill-amber-400 text-amber-400" />
                              Review submitted — thank you!
                            </div>
                          ) : (
                            <button
                              onClick={() => setReviewModalBooking(booking)}
                              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer w-full justify-center border border-primary/30 rounded-lg py-1.5 hover:bg-primary/5 transition"
                            >
                              <Star size={13} className="fill-amber-400 text-amber-400" />
                              Leave a Review for this stay
                            </button>
                          )}
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalBooking && (
        <ReviewModal
          booking={reviewModalBooking}
          onClose={() => setReviewModalBooking(null)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      {/* Guest Chat Modal */}
      {chatBooking && (
        <GuestChatModal
          booking={chatBooking}
          guestName={user?.name || user?.fullname || "Guest"}
          onClose={() => setChatBooking(null)}
        />
      )}
    </>
  )
}
