import { useState, useEffect } from "react"
import {
  X,
  Star,
  Users,
  BedDouble,
  Bath,
  Wifi,
  Utensils,
  Wind,
  Car,
  Briefcase,
  Droplet,
  Tv,
  Calendar,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle,
} from "lucide-react"
import { getPropertyImages } from "../services/ImageHelper"
import { createBooking } from "../services/BookingService"

const HOST_NAMES = ["Rahul Sharma", "Sarah Jenkins", "Amit Patel", "Elena Rostova", "Marcus Vance", "Yuki Tanaka"]
const MOCK_REVIEWS = [
  { author: "John D.", rating: 5, date: "May 2026", comment: "Absolutely incredible stay! The views were even better than the photos. Super clean and responsive host." },
  { author: "Priya K.", rating: 5, date: "April 2026", comment: "Perfect weekend getaway. Highly recommend this place for families or groups. Very cozy and well equipped." },
  { author: "Michael S.", rating: 4, date: "March 2026", comment: "Lovely house with amazing architecture. Only small issue was Wi-Fi drop in the corner bedroom, but otherwise perfect." }
]

export default function PropertyDetailModal({ property, onClose, onBookingSuccess }) {
  const { id, title, location, pricePerNight, bedrooms, bathrooms, maxGuests, description, rating = 4.85 } = property
  const images = getPropertyImages(property)

  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guestCount, setGuestCount] = useState(1)
  const [showGuestDropdown, setShowGuestDropdown] = useState(false)
  
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState(null)
  const [successBooking, setSuccessBooking] = useState(null)

  // Prevent scroll on body when open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  // Calculate nights
  let nights = 0
  if (checkIn && checkOut) {
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    if (outDate > inDate) {
      const diffTime = Math.abs(outDate - inDate)
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }
  }

  const baseTotal = pricePerNight * nights
  const cleaningFee = nights > 0 ? 450 : 0
  const serviceFee = nights > 0 ? Math.round(baseTotal * 0.12) : 0
  const grandTotal = baseTotal + cleaningFee + serviceFee

  const hostName = HOST_NAMES[id % HOST_NAMES.length]

  const handleReserve = async (e) => {
    e.preventDefault()
    if (!checkIn || !checkOut) {
      setBookingError("Please select check-in and check-out dates.")
      return
    }
    if (nights <= 0) {
      setBookingError("Check-out date must be after check-in date.")
      return
    }

    setBookingLoading(true)
    setBookingError(null)

    const bookingPayload = {
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalAmount: grandTotal,
      status: "CONFIRMED",
      guestId: null, // guestId is optional/handled via null in backend
      propertyId: id
    }

    try {
      const response = await createBooking(bookingPayload)
      setSuccessBooking(response.data)
      if (onBookingSuccess) {
        onBookingSuccess()
      }
    } catch (err) {
      console.error(err)
      setBookingError(err.response?.data?.message || "Failed to confirm booking. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-background shadow-2xl transition-all duration-300 md:my-8 max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-border bg-background p-2 text-foreground hover:bg-muted shadow transition hover:scale-105"
          type="button"
        >
          <X size={18} />
        </button>

        {/* Success Reservation View */}
        {successBooking ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
            <div className="rounded-full bg-emerald-100 p-4 text-emerald-600 mb-6">
              <CheckCircle size={56} className="stroke-[2]" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Reservation Confirmed!</h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              Your stay at <span className="font-semibold text-foreground">{title}</span> has been successfully booked.
            </p>

            <div className="mt-8 w-full max-w-md rounded-2xl border border-border bg-muted/40 p-6 text-left shadow-sm">
              <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                <img
                  src={images[0]}
                  alt={title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold leading-tight">{title}</h4>
                  <p className="text-xs text-muted-foreground">{location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Confirmation Code</span>
                  <span className="font-mono font-bold text-primary">STAYB-{successBooking.bookingId || "100" + id}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Guests</span>
                  <span className="font-semibold">{guestCount} {guestCount === 1 ? "guest" : "guests"}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Check-In</span>
                  <span className="font-semibold">{checkIn}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Check-Out</span>
                  <span className="font-semibold">{checkOut}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-4 flex items-center justify-between font-bold text-foreground">
                <span>Total Amount Paid</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-8 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition hover:bg-[var(--color-primary-hover)] cursor-pointer"
            >
              Back to Explorer
            </button>
          </div>
        ) : (
          <>
            {/* Modal Body */}
            <div className="p-6 md:p-8 flex-1">
              {/* Header Title & Rating */}
              <div className="pr-12">
                <h2 className="text-xl md:text-2xl font-bold leading-tight">{title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground">
                  <span className="flex items-center gap-1 font-semibold">
                    <Star size={16} className="fill-foreground" /> {rating}
                  </span>
                  <span className="text-muted-foreground font-medium underline">
                    {MOCK_REVIEWS.length} reviews
                  </span>
                  <span className="text-muted-foreground font-medium underline">{location}</span>
                </div>
              </div>

              {/* Photo Grid Layout */}
              <div className="mt-6 hidden grid-cols-4 gap-2 overflow-hidden rounded-xl md:grid">
                <div className="col-span-2 aspect-[4/3] overflow-hidden">
                  <img
                    src={images[0]}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="col-span-1 grid grid-rows-2 gap-2">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={images[1]}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={images[2]}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
                <div className="col-span-1 grid grid-rows-2 gap-2">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={images[3]}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={images[4]}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Single Photo */}
              <div className="mt-4 aspect-[16/10] overflow-hidden rounded-xl md:hidden">
                <img src={images[0]} alt={title} className="h-full w-full object-cover" />
              </div>

              {/* Grid Content: Specs / Description & Floating Booking Widget */}
              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Side Details */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between border-b border-border/60 pb-6">
                    <div>
                      <h3 className="text-lg font-bold">Entire home hosted by {hostName}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {maxGuests} guests · {bedrooms} {bedrooms === 1 ? "bedroom" : "bedrooms"} · {bathrooms} {bathrooms === 1 ? "bathroom" : "bathrooms"}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
                      {hostName.charAt(0)}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-4 border-b border-border/60 py-6 text-sm">
                    <div className="flex items-start gap-4">
                      <Sparkles className="mt-0.5 shrink-0 text-foreground" size={20} />
                      <div>
                        <h4 className="font-semibold">Exceptional hospitality</h4>
                        <p className="text-muted-foreground">Guests frequently rate {hostName} 5 stars for communication.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Award className="mt-0.5 shrink-0 text-foreground" size={20} />
                      <div>
                        <h4 className="font-semibold">Highly rated location</h4>
                        <p className="text-muted-foreground">95% of recent guests gave the location a 5-star rating.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <ShieldCheck className="mt-0.5 shrink-0 text-foreground" size={20} />
                      <div>
                        <h4 className="font-semibold">Free cancellation</h4>
                        <p className="text-muted-foreground">Flexible policy. Cancel up to 48 hours before check-in for a full refund.</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="border-b border-border/60 py-6">
                    <h3 className="text-md font-bold mb-3">About this space</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                      {description || "Welcome to your dream stay. Relax and recharge in this beautiful, spacious home equipped with all modern amenities and styled to perfection for a premium living experience. Situated in a wonderful neighborhood, it offers the perfect balance of adventure and peace."}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div className="border-b border-border/60 py-6">
                    <h3 className="text-md font-bold mb-4">What this place offers</h3>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 text-sm">
                      <div className="flex items-center gap-3"><Wifi size={18} /> High-speed Wi-Fi</div>
                      <div className="flex items-center gap-3"><Utensils size={18} /> Fully-equipped kitchen</div>
                      <div className="flex items-center gap-3"><Wind size={18} /> Air conditioning / Heating</div>
                      <div className="flex items-center gap-3"><Car size={18} /> Free private parking on premises</div>
                      <div className="flex items-center gap-3"><Briefcase size={18} /> Dedicated workspace</div>
                      <div className="flex items-center gap-3"><Tv size={18} /> Smart TV with Netflix</div>
                      <div className="flex items-center gap-3"><Droplet size={18} /> Continuous hot water supply</div>
                    </div>
                  </div>

                  {/* Reviews Section */}
                  <div className="py-6">
                    <h3 className="text-md font-bold mb-4 flex items-center gap-2">
                      <Star size={18} className="fill-foreground" /> {rating} · {MOCK_REVIEWS.length} reviews
                    </h3>
                    <div className="space-y-6">
                      {MOCK_REVIEWS.map((rev, index) => (
                        <div key={index} className="text-sm border-b border-border/30 pb-4 last:border-none">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{rev.author}</span>
                            <span className="text-xs text-muted-foreground">{rev.date}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < rev.rating ? "fill-primary text-primary" : "text-border"}
                              />
                            ))}
                          </div>
                          <p className="mt-2 text-muted-foreground leading-relaxed">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side Sticky Booking Form */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 rounded-2xl border border-border p-6 shadow-lg bg-card">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-bold">₹{pricePerNight.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground font-medium">/ night</span>
                    </div>

                    <form className="mt-6" onSubmit={handleReserve}>
                      {/* Check-In / Out Container */}
                      <div className="rounded-xl border border-border">
                        <div className="grid grid-cols-2 divide-x divide-border">
                          <div className="p-3">
                            <label className="block text-[10px] font-bold uppercase tracking-tight text-foreground">Check-in</label>
                            <input
                              type="date"
                              required
                              min={new Date().toISOString().split("T")[0]}
                              value={checkIn}
                              onChange={(e) => {
                                setCheckIn(e.target.value)
                                if (checkOut && e.target.value >= checkOut) {
                                  setCheckOut("")
                                }
                              }}
                              className="mt-1 w-full bg-transparent p-0 text-xs font-semibold text-foreground outline-none cursor-pointer"
                            />
                          </div>
                          <div className="p-3">
                            <label className="block text-[10px] font-bold uppercase tracking-tight text-foreground">Check-out</label>
                            <input
                              type="date"
                              required
                              disabled={!checkIn}
                              min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split("T")[0] : ""}
                              value={checkOut}
                              onChange={(e) => setCheckOut(e.target.value)}
                              className="mt-1 w-full bg-transparent p-0 text-xs font-semibold text-foreground outline-none cursor-pointer disabled:text-muted-foreground disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>

                        {/* Guest Selector Button */}
                        <div className="relative border-t border-border p-3">
                          <button
                            type="button"
                            onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                            className="flex w-full flex-col text-left cursor-pointer"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-tight text-foreground">Guests</span>
                            <span className="mt-1 text-xs font-semibold text-foreground">
                              {guestCount} {guestCount === 1 ? "guest" : "guests"}
                            </span>
                          </button>

                          {/* Guests Dropdown Panel */}
                          {showGuestDropdown && (
                            <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-border bg-background p-4 shadow-xl">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="block text-sm font-semibold">Guests</span>
                                  <span className="text-xs text-muted-foreground">Capacity: {maxGuests}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted font-bold disabled:opacity-40"
                                    disabled={guestCount <= 1}
                                  >
                                    -
                                  </button>
                                  <span className="text-sm font-semibold">{guestCount}</span>
                                  <button
                                    type="button"
                                    onClick={() => setGuestCount(Math.min(maxGuests, guestCount + 1))}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted font-bold disabled:opacity-40"
                                    disabled={guestCount >= maxGuests}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowGuestDropdown(false)}
                                className="mt-4 w-full rounded-lg bg-foreground py-1.5 text-xs font-semibold text-background hover:opacity-90"
                              >
                                Close
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Error display */}
                      {bookingError && (
                        <div className="mt-4 text-xs font-semibold text-primary bg-primary/5 border border-primary/20 rounded-lg p-3">
                          {bookingError}
                        </div>
                      )}

                      {/* Reserve Button */}
                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="mt-4 w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition hover:bg-[var(--color-primary-hover)] disabled:opacity-50 cursor-pointer text-center"
                      >
                        {bookingLoading ? "Reserving stay..." : "Reserve"}
                      </button>
                    </form>

                    {/* Price Breakdown */}
                    {nights > 0 && (
                      <div className="mt-6 space-y-3 border-t border-border/60 pt-4 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span className="underline">₹{pricePerNight.toLocaleString()} x {nights} nights</span>
                          <span>₹{baseTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span className="underline">Cleaning fee</span>
                          <span>₹{cleaningFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span className="underline">staybnb service fee</span>
                          <span>₹{serviceFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-border/60 pt-3 font-bold text-foreground">
                          <span>Total before taxes</span>
                          <span>₹{grandTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    <p className="mt-4 text-center text-xs text-muted-foreground">You won&apos;t be charged yet</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
