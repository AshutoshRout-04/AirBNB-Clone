import { useState, useEffect } from "react"
import { Calendar, User, MessageSquare, Phone, StickyNote, Bell, CheckCircle2, ChevronRight, RefreshCw, Plus, Trash2, Star, LogIn, LogOut } from "lucide-react"
import { getAllBookings, updateBooking, getBookingsByHostId, updateBookingStatus } from "../../services/BookingService"
import { getReviewsByProperty } from "../../services/ReviewService"
import { getPropertyImages } from "../../services/ImageHelper"
import { useToast } from "../Toast"
import { useAuth } from "../LoginModal"

export default function TodayTab({ onSwitchTab, onNavigateToMessage }) {
  const toast = useToast()
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeToggle, setActiveToggle] = useState("upcoming")
  const [selectedBookingForNote, setSelectedBookingForNote] = useState(null)
  const [noteText, setNoteText] = useState("")
  const [notes, setNotes] = useState({})
  const [showAllReservations, setShowAllReservations] = useState(false)
  const [revealedPhones, setRevealedPhones] = useState({})
  const [statusLoading, setStatusLoading] = useState({})

  const [hostId, setHostId] = useState(null)

  // Host reviews state
  const [hostReviews, setHostReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  // Load bookings from backend on mount
  useEffect(() => {
    const storedHostId = localStorage.getItem("staybnb_host_id")
    if (storedHostId) {
      const parsedId = parseInt(storedHostId)
      setHostId(parsedId)
      fetchBookings(parsedId)
      fetchHostReviews(parsedId)
    } else {
      fetchBookings()
    }
  }, [])

  const fetchHostReviews = async (hId) => {
    if (!hId) return
    setReviewsLoading(true)
    try {
      // Get bookings for host, collect unique property IDs
      const res = await getBookingsByHostId(hId)
      const bookingList = res.data || []
      const propertyIds = [...new Set(bookingList.map(b => b.property?.propertyId || b.property?.id).filter(Boolean))]
      if (propertyIds.length === 0) { setHostReviews([]); return }
      // Fetch reviews for all host properties
      const allReviews = await Promise.all(
        propertyIds.map(pid => getReviewsByProperty(pid).then(r => r.data || []).catch(() => []))
      )
      setHostReviews(allReviews.flat())
    } catch {
      setHostReviews([])
    } finally {
      setReviewsLoading(false)
    }
  }

  const fetchBookings = async (id) => {
    setLoading(true)
    try {
      const currentHostId = id || hostId
      const response = currentHostId 
        ? await getBookingsByHostId(currentHostId)
        : await getAllBookings()
      const fetchedBookings = response.data || []
      setBookings(fetchedBookings)

      // Initialize notes from the booking objects
      const notesMap = {}
      fetchedBookings.forEach(b => {
        if (b.bookingId && b.privateNotes) {
          notesMap[b.bookingId] = b.privateNotes
        }
      })
      setNotes(notesMap)
    } catch (err) {
      console.error("Failed to fetch bookings in TodayTab:", err)
      setBookings([])
    } finally {
      setLoading(false)
    }
  };

  const displayBookings = bookings

  // Filter based on dates compared to current local time (2026-06-11)
  const currentDate = new Date("2026-06-11")
  
  const activeBookings = displayBookings.filter(b => b.status !== "CHECKED_OUT" && b.status !== "CANCELLED" && b.status !== "COMPLETED")
  
  const currentReservations = activeBookings.filter(b => {
    const start = new Date(b.checkInDate)
    const end = new Date(b.checkOutDate)
    return start <= currentDate && end >= currentDate
  })

  const upcomingReservations = activeBookings.filter(b => {
    const start = new Date(b.checkInDate)
    return start > currentDate
  })

  const pastReservations = displayBookings.filter(b => b.status === "CHECKED_OUT" || b.status === "COMPLETED")

  const activeReservations = activeToggle === "current" 
    ? currentReservations 
    : activeToggle === "upcoming" 
      ? upcomingReservations 
      : pastReservations

  // Note actions
  const openNoteModal = (booking) => {
    setSelectedBookingForNote(booking)
    setNoteText(notes[booking.bookingId] || "")
  }

  const saveNote = async () => {
    if (!selectedBookingForNote) return
    try {
      const payload = {
        ...selectedBookingForNote,
        privateNotes: noteText
      }
      await updateBooking(selectedBookingForNote.bookingId, payload)
      
      const updatedNotes = { ...notes, [selectedBookingForNote.bookingId]: noteText }
      setNotes(updatedNotes)
      toast({
        type: "success",
        title: "Note Saved",
        message: `Private note updated for ${selectedBookingForNote.guest?.user?.name || "Guest"}.`,
        duration: 3000,
      })
      setSelectedBookingForNote(null)
      fetchBookings()
    } catch (err) {
      console.error(err)
      toast({
        type: "error",
        title: "Error saving note",
        message: "Could not save private note to the database."
      })
    }
  }

  const deleteNote = async (bookingId) => {
    try {
      const targetBooking = bookings.find(b => b.bookingId === bookingId)
      if (!targetBooking) return
      
      const payload = {
        ...targetBooking,
        privateNotes: null
      }
      await updateBooking(bookingId, payload)

      const updatedNotes = { ...notes }
      delete updatedNotes[bookingId]
      setNotes(updatedNotes)
      toast({
        type: "info",
        title: "Note Deleted",
        message: "Private note has been removed.",
        duration: 3000,
      })
      if (selectedBookingForNote && selectedBookingForNote.bookingId === bookingId) {
        setNoteText("")
      }
      fetchBookings()
    } catch (err) {
      console.error(err)
      toast({
        type: "error",
        title: "Error deleting note",
        message: "Could not remove private note from the database."
      })
    }
  }

  // Call guest
  const togglePhone = (bookingId) => {
    setRevealedPhones(prev => ({ ...prev, [bookingId]: !prev[bookingId] }))
  }

  // Check-in / Check-out handlers
  const handleStatusUpdate = async (bookingId, newStatus) => {
    setStatusLoading(prev => ({ ...prev, [bookingId]: true }))
    try {
      await updateBookingStatus(bookingId, newStatus)
      setBookings(prev => prev.map(b =>
        b.bookingId === bookingId ? { ...b, status: newStatus } : b
      ))
      toast({
        type: "success",
        title: newStatus === "CHECKED_IN" ? "Guest Checked In ✓" : "Guest Checked Out ✓",
        message: `Booking #${bookingId} status updated to ${newStatus.replace("_", " ")}.`,
        duration: 3000,
      })
    } catch {
      toast({ type: "error", title: "Update failed", message: "Could not update booking status." })
    } finally {
      setStatusLoading(prev => ({ ...prev, [bookingId]: false }))
    }
  }

  // Action Tips
  const generateActionTips = () => {
    const tips = []
    
    // Find bookings arriving soon (upcoming bookings)
    const upcoming = bookings.filter(b => b.status === "CONFIRMED")
    if (upcoming.length > 0) {
      const b = upcoming[0]
      const name = b.guest?.user?.fullname || b.guest?.user?.name || "Guest"
      tips.push({
        id: 1,
        title: "Send check-in guide",
        description: `${name} arrives on ${b.checkInDate}. Send parking & access details.`,
        actionLabel: `Message ${name}`,
        targetGuest: name,
        messageTemplate: `Hi ${name}! Looking forward to hosting you on ${b.checkInDate}. Here is your check-in guide: The lockbox code is 4829. Let me know if you need anything!`
      })
    } else {
      tips.push({
        id: 1,
        title: "No upcoming check-ins",
        description: "All upcoming guests have been contacted.",
        actionLabel: "View calendar",
        targetGuest: "",
        messageTemplate: ""
      })
    }

    // Find currently checked in bookings
    const active = bookings.filter(b => b.status === "CHECKED_IN")
    if (active.length > 0) {
      const b = active[0]
      const name = b.guest?.user?.fullname || b.guest?.user?.name || "Guest"
      tips.push({
        id: 2,
        title: "Review checkout guidelines",
        description: `${name} checkouts on ${b.checkOutDate}. Remind them about checkout time and key drop.`,
        actionLabel: "Message reminder",
        targetGuest: name,
        messageTemplate: `Hi ${name}, hope you are enjoying your stay! Just a quick reminder that checkout is at 11:00 AM. Please leave the keys on the table. Safe travels!`
      })
    } else {
      tips.push({
        id: 2,
        title: "No active stays",
        description: "No guests are currently checked in.",
        actionLabel: "Manage listings",
        targetGuest: "",
        messageTemplate: ""
      })
    }

    // Find recently checked out bookings
    const checkedOut = bookings.filter(b => b.status === "CHECKED_OUT")
    if (checkedOut.length > 0) {
      const b = checkedOut[0]
      const name = b.guest?.user?.fullname || b.guest?.user?.name || "Guest"
      tips.push({
        id: 3,
        title: "Write guest review",
        description: `Submit rating for ${name}'s recent stay to build reputation.`,
        actionLabel: "Write review",
        targetGuest: name,
        messageTemplate: ""
      })
    } else {
      tips.push({
        id: 3,
        title: "All reviews caught up",
        description: "No pending guest reviews to write.",
        actionLabel: "View reviews",
        targetGuest: "",
        messageTemplate: ""
      })
    }

    return tips
  }

  const actionTips = generateActionTips()

  const handleTipAction = (tip) => {
    if (tip.messageTemplate) {
      if (onNavigateToMessage) {
        onNavigateToMessage(tip.targetGuest, tip.messageTemplate)
      } else {
        toast({
          type: "success",
          title: "Template copied",
          message: "Check Message tab. Prefilled message ready to send.",
        })
      }
    } else {
      toast({
        type: "info",
        title: tip.title,
        message: `Navigating to reviews dashboard...`,
      })
    }
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto px-4 py-6">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-linear-to-r from-neutral-900 to-neutral-800 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name || "Host"}</h2>
          <p className="text-neutral-400 text-xs mt-1">Today is Thursday, June 11, 2026. Here is what's happening with your properties.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchBookings}
            className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 transition px-3.5 py-2 rounded-full border border-white/10 font-semibold cursor-pointer"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Reservations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Your Reservations ({activeReservations.length})
            </h3>
            
            {/* Toggles */}
            <div className="flex bg-muted p-0.5 rounded-full text-xs font-bold">
              <button
                onClick={() => setActiveToggle("current")}
                className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                  activeToggle === "current" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Currently hosting ({currentReservations.length})
              </button>
              <button
                onClick={() => setActiveToggle("upcoming")}
                className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                  activeToggle === "upcoming" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Upcoming ({upcomingReservations.length})
              </button>
              <button
                onClick={() => setActiveToggle("past")}
                className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                  activeToggle === "past" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Past ({pastReservations.length})
              </button>
            </div>
          </div>

          {/* Reservation Cards */}
          {activeReservations.length === 0 ? (
            <div className="bg-card border border-border border-dashed rounded-2xl p-12 text-center text-muted-foreground">
              <User size={36} className="mx-auto text-muted-foreground/50 mb-3" />
              <p className="font-bold text-sm text-foreground">No reservations found</p>
              <p className="text-xs mt-1 max-w-xs mx-auto">There are no {activeToggle === "current" ? "active guests staying" : activeToggle === "upcoming" ? "upcoming reservations booked" : "past reservations"} for this period.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeReservations.map((res) => {
                const isPhoneRevealed = revealedPhones[res.bookingId]
                const guestNote = notes[res.bookingId]
                const images = getPropertyImages(res.property)
                return (
                  <div 
                    key={res.bookingId} 
                    className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col md:flex-row gap-5"
                  >
                    {/* Guest image / Info */}
                    <div className="flex items-start gap-3 md:w-1/3 shrink-0">
                      <img 
                        src={res.guest?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"} 
                        alt={res.guest?.user?.fullname || res.guest?.user?.name} 
                        className="h-12 w-12 rounded-full object-cover border border-border"
                      />
                      <div className="min-w-0">
                        <span className="block font-bold text-sm text-foreground truncate">{res.guest?.user?.fullname || res.guest?.user?.name || "Guest"}</span>
                        <span className="inline-flex items-center text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-md mt-0.5">
                          ★ {res.guest?.averageRating || "4.8"} Rating
                        </span>
                        <span className="block text-[11px] text-muted-foreground mt-1 truncate">{res.property?.title || "Property Title"}</span>
                      </div>
                    </div>

                    {/* Dates & Pricing */}
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Check-in</span>
                          <span className="font-semibold text-foreground">{res.checkInDate}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Check-out</span>
                          <span className="font-semibold text-foreground">{res.checkOutDate}</span>
                        </div>
                      </div>

                      {/* Display Note summary if exists */}
                      {guestNote && (
                        <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-2 text-xs text-amber-800 flex items-start gap-1.5">
                          <StickyNote size={12} className="shrink-0 mt-0.5 text-amber-600" />
                          <p className="italic line-clamp-2">{guestNote}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Panel */}
                    <div className="flex md:flex-col justify-end items-end gap-2 border-t md:border-t-0 border-border/60 pt-3 md:pt-0 shrink-0">
                      <div className="text-right hidden md:block">
                        <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Payout</span>
                        <span className="font-extrabold text-sm text-foreground">₹{res.totalAmount?.toLocaleString()}</span>
                      </div>

                      {/* Check-in / Check-out status buttons */}
                      <div className="flex flex-wrap gap-1.5 w-full md:w-auto mb-1">
                        {res.status === "CONFIRMED" && (
                          <button
                            onClick={() => handleStatusUpdate(res.bookingId, "CHECKED_IN")}
                            disabled={statusLoading[res.bookingId]}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                          >
                            <LogIn size={12} /> Check-in
                          </button>
                        )}
                        {res.status === "CHECKED_IN" && (
                          <button
                            onClick={() => handleStatusUpdate(res.bookingId, "CHECKED_OUT")}
                            disabled={statusLoading[res.bookingId]}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-bold bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer disabled:opacity-50"
                          >
                            <LogOut size={12} /> Check-out
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                        <button 
                          onClick={() => openNoteModal(res)}
                          className="flex items-center justify-center p-2 rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                          title="Add private note"
                        >
                          <StickyNote size={14} className={guestNote ? "fill-amber-400 text-amber-600" : ""} />
                        </button>
                        <button 
                          onClick={() => togglePhone(res.bookingId)}
                          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-border hover:bg-muted font-bold text-foreground transition cursor-pointer"
                        >
                          <Phone size={12} /> 
                          <span>{isPhoneRevealed ? (res.guest?.user?.contact || "No Contact") : "Call"}</span>
                        </button>
                        <button 
                          onClick={() => onNavigateToMessage && onNavigateToMessage(res.guest?.user?.fullname || res.guest?.user?.name || "Guest")}
                          className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-2 rounded-full hover:bg-[var(--color-primary-hover)] font-bold transition cursor-pointer"
                        >
                          <MessageSquare size={12} /> Message
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Col: Action Tips & Alerts */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Bell size={18} className="text-amber-500" />
            Action Tips
          </h3>

          <div className="space-y-4">
            {actionTips.map((tip) => (
              <div 
                key={tip.id} 
                className="bg-card border border-border rounded-2xl p-4 shadow-xs hover:border-neutral-400 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tip.description}</p>
                    <button 
                      onClick={() => handleTipAction(tip)}
                      className="mt-3 flex items-center gap-0.5 text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      {tip.actionLabel} <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick checklist summary card */}
          <div className="bg-[#f7faf9] border border-[#d2e0dc] rounded-2xl p-5 text-neutral-800">
            <span className="block text-[10px] text-[#4d7c0f] font-bold uppercase tracking-wider">Superhost Goal</span>
            <h4 className="font-bold text-sm text-neutral-900 mt-0.5">Your Response Rate: 98%</h4>
            <p className="text-xs text-[#4b5563] mt-1 leading-relaxed">Responding within 24 hours keeps your response rate high. Keep responding quickly to bookings & guest inquiries.</p>
          </div>

          {/* Host Reviews Panel */}
          <div>
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2 border-b border-border pb-3 mb-4">
              <Star size={18} className="fill-amber-400 text-amber-400" />
              Guest Reviews ({hostReviews.length})
            </h3>
            {reviewsLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                <RefreshCw size={14} className="animate-spin" /> Loading reviews...
              </div>
            ) : hostReviews.length === 0 ? (
              <div className="bg-card border border-border border-dashed rounded-2xl p-6 text-center text-muted-foreground">
                <Star size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold text-foreground">No reviews yet</p>
                <p className="text-xs mt-1">Reviews will appear here after guests check out and leave feedback.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {hostReviews.slice(0, 5).map(rev => {
                  const guestName = rev.guest?.user?.fullname || rev.guest?.user?.name || "Guest"
                  const propTitle = rev.property?.title || "Property"
                  const dateStr = rev.createdAt
                    ? new Date(rev.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                    : ""
                  return (
                    <div key={rev.reviewId} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs border border-primary/20">
                            {guestName.charAt(0)}
                          </div>
                          <div>
                            <span className="block font-bold text-xs text-foreground">{guestName}</span>
                            <span className="text-[10px] text-muted-foreground">{propTitle} · {dateStr}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11}
                              className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-border fill-border"}
                            />
                          ))}
                        </div>
                      </div>
                      {rev.comment && (
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">{rev.comment}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Private Notes Modal */}
      {selectedBookingForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-card rounded-2xl max-w-md w-full border border-border shadow-2xl overflow-hidden animate-fade-in flex flex-col">
            <div className="p-5 border-b border-border">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <StickyNote size={18} className="text-amber-500" />
                Private Host Note
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">Add private reminders for hosting {selectedBookingForNote.guest?.user?.fullname || selectedBookingForNote.guest?.user?.name}. Guests cannot see these notes.</p>
            </div>
            
            <div className="p-5">
              <textarea 
                rows={4}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write reminders here (e.g., guest dislikes feather pillows, birthday gift, checking in early)..."
                className="w-full rounded-xl border border-border p-3 text-xs bg-transparent outline-none focus:border-primary placeholder:text-muted-foreground text-foreground"
              />
            </div>

            <div className="p-4 bg-muted/30 border-t border-border flex justify-between items-center">
              {notes[selectedBookingForNote.bookingId] ? (
                <button 
                  onClick={() => deleteNote(selectedBookingForNote.bookingId)}
                  className="flex items-center gap-1.5 text-xs text-red-500 font-bold hover:underline cursor-pointer"
                >
                  <Trash2 size={13} /> Delete Note
                </button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedBookingForNote(null)}
                  className="text-xs px-3.5 py-2 border border-border rounded-full hover:bg-muted font-bold text-foreground transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveNote}
                  className="text-xs px-4.5 py-2 bg-foreground text-background rounded-full hover:opacity-90 font-bold transition cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Overlay for All Reservations */}
      {showAllReservations && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowAllReservations(false)} />
          <div className="relative z-10 w-full max-w-xl bg-background h-full flex flex-col p-6 shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Calendar size={20} className="text-primary" />
                <span>All Reservations ({displayBookings.length})</span>
              </h3>
              <button 
                onClick={() => setShowAllReservations(false)}
                className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-full font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {displayBookings.map((res) => {
                const isPhoneRevealed = revealedPhones[res.bookingId]
                const guestNote = notes[res.bookingId]
                return (
                  <div key={res.bookingId} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <img 
                          src={res.guest?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&h=60&q=80"} 
                          alt="" 
                          className="h-10 w-10 rounded-full object-cover border"
                        />
                        <div>
                          <span className="block font-bold text-sm text-foreground">{res.guest?.user?.fullname || res.guest?.user?.name}</span>
                          <span className="block text-[11px] text-muted-foreground">{res.property?.title} ({res.property?.location})</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-foreground">₹{res.totalAmount?.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs bg-muted/40 p-2.5 rounded-lg border">
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-muted-foreground">Check-in</span>
                        <strong className="text-foreground">{res.checkInDate}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-muted-foreground">Check-out</span>
                        <strong className="text-foreground">{res.checkOutDate}</strong>
                      </div>
                    </div>

                    {guestNote && (
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-2 text-[11px] text-amber-800 flex items-start gap-1">
                        <StickyNote size={11} className="shrink-0 mt-0.5 text-amber-500" />
                        <span className="italic">{guestNote}</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                      <button 
                        onClick={() => openNoteModal(res)}
                        className="text-xs border px-3 py-1.5 rounded-full hover:bg-muted font-semibold text-foreground cursor-pointer"
                      >
                        Notes
                      </button>
                      <button 
                        onClick={() => togglePhone(res.bookingId)}
                        className="text-xs border px-3 py-1.5 rounded-full hover:bg-muted font-semibold text-foreground cursor-pointer"
                      >
                        {isPhoneRevealed ? (res.guest?.user?.contact || "No Contact") : "Call"}
                      </button>
                      <button 
                        onClick={() => {
                          setShowAllReservations(false);
                          if (onNavigateToMessage) onNavigateToMessage(res.guest?.user?.fullname || res.guest?.user?.name);
                        }}
                        className="text-xs bg-primary text-primary-foreground px-3.5 py-1.5 rounded-full hover:bg-[var(--color-primary-hover)] font-semibold cursor-pointer"
                      >
                        Message
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
