import { useState, useEffect } from "react"
import { X, Trash2, Calendar, ShieldAlert, RefreshCw, AlertTriangle } from "lucide-react"
import { getAllBookings, deleteBooking } from "../services/BookingService"
import { getPropertyImages } from "../services/ImageHelper"
import { useToast } from "./Toast"

export default function BookingsDrawer({ isOpen, onClose, properties }) {
  const toast = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)
  const [confirmCancelId, setConfirmCancelId] = useState(null)

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getAllBookings()
      setBookings(response.data || [])
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
      // Disable body scroll when drawer open
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Click outside container to close */}
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
                // Try matching properties in state or default values
                const prop = booking.property || properties.find((p) => p.id === booking.property?.id) || {}
                const title = prop.title || "Staybnb Property"
                const location = prop.location || "Location not loaded"
                const images = getPropertyImages(prop)

                return (
                  <article
                    key={booking.bookingId}
                    className="group flex gap-4 rounded-xl border border-border bg-card p-3 shadow-sm transition hover:shadow-md"
                  >
                    <img
                      src={images[0]}
                      alt={title}
                      className="h-20 w-20 shrink-0 rounded-lg object-cover bg-muted"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="truncate font-bold text-sm leading-snug">{title}</h4>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase shrink-0">
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
                          <button
                            onClick={() => setConfirmCancelId(booking.bookingId)}
                            disabled={cancellingId === booking.bookingId}
                            type="button"
                            className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-[var(--color-primary-hover)] cursor-pointer disabled:opacity-40"
                          >
                            <Trash2 size={12} />
                            <span>{cancellingId === booking.bookingId ? "Cancelling..." : "Cancel Stay"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
