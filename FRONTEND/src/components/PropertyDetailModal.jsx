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
  ArrowLeft,
  Lock,
  RefreshCw,
  MessageSquare,
} from "lucide-react"
import { getPropertyImages } from "../services/ImageHelper"
import { createBooking } from "../services/BookingService"
import { getReviewsByProperty } from "../services/ReviewService"
import { useAuth } from "./LoginModal"

const HOST_NAMES = ["Rahul Sharma", "Sarah Jenkins", "Amit Patel", "Elena Rostova", "Marcus Vance", "Yuki Tanaka"]

export default function PropertyDetailModal({ property, onClose, onBookingSuccess }) {
  const { id, title, location, pricePerNight, bedrooms, bathrooms, maxGuests, description, propertyType, companyName } = property
  const images = getPropertyImages(property)
  const { user } = useAuth()

  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guestCount, setGuestCount] = useState(1)
  const [showGuestDropdown, setShowGuestDropdown] = useState(false)
  
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState(null)
  const [successBooking, setSuccessBooking] = useState(null)

  // Real reviews from backend
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    if (id) {
      setReviewsLoading(true)
      getReviewsByProperty(id)
        .then(res => setReviews(res.data || []))
        .catch(() => setReviews([]))
        .finally(() => setReviewsLoading(false))
    }
  }, [id])

  // Payment checkout states
  const [paymentStep, setPaymentStep] = useState("reserve") // "reserve" | "checkout" | "processing" | "success"
  const [paymentMethod, setPaymentMethod] = useState("card") // "card" | "upi" | "netbanking"
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [upiId, setUpiId] = useState("")

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
    if (outDate >= inDate) {
      const diffTime = Math.abs(outDate - inDate)
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (nights === 0 && inDate.getTime() === outDate.getTime()) {
        nights = 1 // count same-day booking as 1 session/service day
      }
    }
  }

  const baseTotal = pricePerNight * nights
  const cleaningFee = nights > 0 ? (propertyType === "room" || !propertyType ? 450 : 0) : 0
  const serviceFee = nights > 0 ? Math.round(baseTotal * 0.12) : 0
  const grandTotal = baseTotal + cleaningFee + serviceFee

  console.log("DEBUG - Selected Property object:", property)
  const hostName = property?.Host_Id?.user?.fullname || 
                   property?.host_Id?.user?.name || 
                   property?.host_id?.user?.fullname || 
                   property?.host_Id?.user?.fullname || 
                   HOST_NAMES[id % HOST_NAMES.length]

  const handleReserve = (e) => {
    e.preventDefault()
    if (!checkIn || !checkOut) {
      setBookingError("Please select check-in and check-out dates.")
      return
    }
    if (nights <= 0) {
      setBookingError("Check-out date must be after check-in date.")
      return
    }
    setBookingError(null)
    setPaymentStep("checkout")
  }

  const handleConfirmPayment = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    setBookingError(null)
    setPaymentStep("processing")

    const guestIdStr = localStorage.getItem("staybnb_guest_id")
    const bookingPayload = {
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalAmount: grandTotal,
      status: "CONFIRMED",
      paymentMethod: paymentMethod.toUpperCase(),
      paymentStatus: "PAID",
      guestId: guestIdStr ? parseInt(guestIdStr, 10) : null,
      userId: user?.id || null,
      propertyId: id
    }

    // Simulate payment processing
    setTimeout(async () => {
      try {
        const response = await createBooking(bookingPayload)
        setSuccessBooking(response.data)
        setPaymentStep("success")
        if (onBookingSuccess) {
          onBookingSuccess()
        }
      } catch (err) {
        console.error(err)
        setBookingError(err.response?.data?.message || "Failed to confirm booking. Please try again.")
        setPaymentStep("checkout")
      } finally {
        setBookingLoading(false)
      }
    }, 1800)
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

        {/* Step: Processing */}
        {paymentStep === "processing" && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in w-full max-w-md mx-auto">
            <RefreshCw size={48} className="animate-spin text-primary mb-6" />
            <h3 className="text-xl font-bold text-foreground">Processing Payment</h3>
            <p className="text-sm text-muted-foreground mt-2">Connecting to secure gateway. Please do not close or refresh this page.</p>
          </div>
        )}

        {/* Step: Checkout Form */}
        {paymentStep === "checkout" && (
          <div className="p-6 md:p-8 flex flex-col items-center justify-center animate-fade-in w-full max-w-lg mx-auto relative">
            <button
              onClick={() => setPaymentStep("reserve")}
              className="absolute left-6 top-6 flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer border border-border px-3 py-1.5 rounded-full"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <div className="w-full text-center mb-6 mt-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-extrabold tracking-widest text-[#00a699]">
                <ShieldCheck size={12} /> Secure Checkout
              </span>
              <h3 className="text-2xl font-bold tracking-tight mt-1 text-foreground">Select Payment Method</h3>
              <p className="text-xs text-muted-foreground mt-1">Total price: ₹{grandTotal.toLocaleString()}</p>
            </div>

            {/* Payment Method Selector */}
            <div className="flex gap-2 w-full mb-6">
              {["card", "upi", "netbanking"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`flex-1 py-3 border rounded-xl font-bold text-xs capitalize cursor-pointer transition ${
                    paymentMethod === m
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {m === "card" ? "💳 Card" : m === "upi" ? "⚡ UPI" : "🏦 Bank"}
                </button>
              ))}
            </div>

            <form onSubmit={handleConfirmPayment} className="w-full space-y-4">
              {paymentMethod === "card" && (
                <div className="space-y-3">
                  <div className="border border-border rounded-xl px-4 py-3 bg-muted/20">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none mt-0.5"
                    />
                  </div>
                  <div className="border border-border rounded-xl px-4 py-3 bg-muted/20">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4111 2222 3333 4444"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setCardNumber(val)
                      }}
                      className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none mt-0.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-border rounded-xl px-4 py-3 bg-muted/20">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Expiration Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (val.length === 2 && !val.includes('/')) val += '/';
                          setExpiry(val);
                        }}
                        className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none mt-0.5"
                      />
                    </div>
                    <div className="border border-border rounded-xl px-4 py-3 bg-muted/20">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CVV</label>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none mt-0.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="border border-border rounded-xl px-4 py-4 bg-muted/20">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">UPI ID (VPA)</label>
                  <input
                    type="text"
                    required
                    placeholder="username@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none mt-1"
                  />
                  <span className="block text-[10px] text-muted-foreground mt-2">Enter your UPI ID (Google Pay, PhonePe, BHIM, etc.)</span>
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div className="border border-border rounded-xl p-4 bg-muted/20">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Select Bank</label>
                  <select className="mt-1 w-full bg-background border border-border rounded-lg p-2 text-sm font-semibold text-foreground outline-none">
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Punjab National Bank</option>
                  </select>
                </div>
              )}

              {bookingError && (
                <div className="text-xs font-semibold text-primary bg-primary/5 border border-primary/20 rounded-lg p-3">
                  {bookingError}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-3.5 font-bold text-sm text-primary-foreground hover:bg-[var(--color-primary-hover)] transition cursor-pointer text-center mt-6 flex items-center justify-center gap-1.5 shadow-md"
              >
                <ShieldCheck size={16} /> Pay ₹{grandTotal.toLocaleString()}
              </button>
              
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground text-center pt-2">
                <Lock size={10} /> Payments are encrypted and secure
              </div>
            </form>
          </div>
        )}

        {/* Success Reservation View */}
        {paymentStep === "success" && successBooking && (
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
        )}

        {/* Reserve View */}
        {paymentStep === "reserve" && (
          <>
            {/* Modal Body */}
            <div className="p-6 md:p-8 flex-1">
              {/* Header Title & Rating */}
              <div className="pr-12">
                <h2 className="text-xl md:text-2xl font-bold leading-tight">{title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground">
                   <span className="flex items-center gap-1 font-semibold">
                     <Star size={16} className="fill-foreground" />
                     {reviews.length > 0
                       ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
                       : "New"}
                   </span>
                   <span className="text-muted-foreground font-medium underline">
                     {reviews.length > 0
                       ? `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`
                       : "No reviews yet"}
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
                      <h3 className="text-lg font-bold">
                        {propertyType === "experience"
                          ? `Experience hosted by ${hostName}`
                          : propertyType === "service"
                          ? `Service provided by ${companyName || hostName}`
                          : `Entire home hosted by ${hostName}`}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {propertyType === "experience" ? (
                          `Up to ${maxGuests} guests · Experience`
                        ) : propertyType === "service" ? (
                          `Professional service · ${companyName || "Independent"}`
                        ) : (
                          `${maxGuests} guests · ${bedrooms} ${bedrooms === 1 ? "bedroom" : "bedrooms"} · ${bathrooms} ${bathrooms === 1 ? "bathroom" : "bathrooms"}`
                        )}
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

                  {/* Reviews Section — live from DB */}
                  <div className="py-6">
                    <h3 className="text-md font-bold mb-4 flex items-center gap-2">
                      <Star size={18} className="fill-foreground" />
                      {reviews.length > 0
                        ? `${(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)} · ${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`
                        : "No reviews yet"}
                    </h3>

                    {reviewsLoading ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw size={14} className="animate-spin" /> Loading reviews...
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-xl">
                        <MessageSquare size={28} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-semibold text-foreground">No reviews yet</p>
                        <p className="text-xs mt-1">Be the first to share your experience after your stay!</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map((rev) => {
                          const guestName = rev.guest?.user?.fullname || rev.guest?.user?.name || "Guest"
                          const dateStr = rev.createdAt
                            ? new Date(rev.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                            : ""
                          return (
                            <div key={rev.reviewId} className="text-sm border-b border-border/30 pb-5 last:border-none">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm border border-primary/20">
                                  {guestName.charAt(0)}
                                </div>
                                <div>
                                  <span className="block font-semibold text-foreground">{guestName}</span>
                                  <span className="text-xs text-muted-foreground">{dateStr}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5 mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={13}
                                    className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-border fill-border"}
                                  />
                                ))}
                              </div>
                              <p className="text-muted-foreground leading-relaxed">{rev.comment}</p>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side Sticky Booking Form */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 rounded-2xl border border-border p-6 shadow-lg bg-card">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-bold">₹{pricePerNight.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground font-medium">
                        {propertyType === "experience" ? " / session" : propertyType === "service" ? " / service" : " / night"}
                      </span>
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
                                if (checkOut && e.target.value > checkOut) {
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
                              min={checkIn ? (propertyType && propertyType !== "room" ? checkIn : new Date(new Date(checkIn).getTime() + 86400000).toISOString().split("T")[0]) : ""}
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
                        {bookingLoading
                          ? "Reserving..."
                          : propertyType === "experience"
                          ? "Book Experience"
                          : propertyType === "service"
                          ? "Book Service"
                          : "Reserve"}
                      </button>
                    </form>

                    {/* Price Breakdown */}
                    {nights > 0 && (
                      <div className="mt-6 space-y-3 border-t border-border/60 pt-4 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span className="underline">
                            ₹{pricePerNight.toLocaleString()} x {nights}{" "}
                            {propertyType === "experience" ? "sessions" : propertyType === "service" ? "services" : "nights"}
                          </span>
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
