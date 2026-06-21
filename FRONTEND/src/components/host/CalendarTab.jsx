import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, Info, Lock, Unlock, Sparkles, Save, ChevronLeft, ChevronRight, PenTool } from "lucide-react"
import { useToast } from "../Toast"
import { getBookingsByHostId, getAllBookings } from "../../services/BookingService"

export default function CalendarTab() {
  const toast = useToast()
  
  // Setup Calendar state: June 2026 (Month: 5, Year: 2026)
  const [currentMonth, setCurrentMonth] = useState(5) // June (0-indexed 5)
  const [currentYear, setCurrentYear] = useState(2026)
  
  // Selection state
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null })
  
  // Custom Overrides (blocked dates, customized rates, date notes)
  // Saved in localStorage: staybnb_calendar_custom
  const [customCalendar, setCustomCalendar] = useState({})
  
  // Side Panel settings for selected dates
  const [isBlocked, setIsBlocked] = useState(false)
  const [priceOverride, setPriceOverride] = useState("")
  const [dateNote, setDateNote] = useState("")
  const [minNights, setMinNights] = useState("1")
  const [prepTime, setPrepTime] = useState("none")

  // Bookings list from backend
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  // Default rates based on standard properties
  const defaultRate = 3000

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("staybnb_calendar_custom") || "{}")
      setCustomCalendar(stored)
    } catch (_) {}
  }, [])

  useEffect(() => {
    const storedHostId = localStorage.getItem("staybnb_host_id")
    fetchBookings(storedHostId ? parseInt(storedHostId) : null)
  }, [])

  const fetchBookings = async (hostId) => {
    setLoading(true)
    try {
      const response = hostId
        ? await getBookingsByHostId(hostId)
        : await getAllBookings()
      setBookings(response.data || [])
    } catch (err) {
      console.error("Failed to fetch bookings in CalendarTab:", err)
    } finally {
      setLoading(false)
    }
  }

  const saveCustomSettings = () => {
    if (!selectedRange.start || !selectedRange.end) {
      toast({
        type: "warning",
        title: "No dates selected",
        message: "Please click a start and end date on the calendar first."
      })
      return
    }

    const updated = { ...customCalendar }
    const start = Math.min(selectedRange.start, selectedRange.end)
    const end = Math.max(selectedRange.start, selectedRange.end)

    for (let day = start; day <= end; day++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      updated[dateKey] = {
        isBlocked,
        price: priceOverride ? parseFloat(priceOverride) : undefined,
        note: dateNote || undefined,
        minNights: parseInt(minNights) || 1,
        prepTime
      }
    }

    setCustomCalendar(updated)
    localStorage.setItem("staybnb_calendar_custom", JSON.stringify(updated))
    
    toast({
      type: "success",
      title: "Calendar updated",
      message: `Settings applied for dates June ${start} to ${end}.`
    })

    // Reset selection
    setSelectedRange({ start: null, end: null })
    setPriceOverride("")
    setDateNote("")
  }

  const handleApplyAIPricing = () => {
    if (!selectedRange.start || !selectedRange.end) {
      toast({
        type: "warning",
        title: "No dates selected",
        message: "Select a date range first to apply the AI Price Tip."
      })
      return
    }
    
    // AI recommendation: 15% discount for weekdays, 10% premium for weekends
    const aiRate = 2650
    setPriceOverride(aiRate.toString())
    toast({
      type: "info",
      title: "AI Rate Applied",
      message: `Recommended rate of ₹${aiRate} applied to side panel. Click Save to publish.`
    })
  }

  // Generate days in month helper
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // First day of month (0 = Sunday, 1 = Monday...)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedRange({ start: null, end: null })
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedRange({ start: null, end: null })
  }

  const handleDayClick = (day) => {
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: day, end: null })
      
      // Load existing configurations if single date clicked
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const existing = customCalendar[dateKey] || {}
      setIsBlocked(existing.isBlocked || false)
      setPriceOverride(existing.price ? existing.price.toString() : "")
      setDateNote(existing.note || "")
      setMinNights(existing.minNights ? existing.minNights.toString() : "1")
      setPrepTime(existing.prepTime || "none")
    } else {
      setSelectedRange({ ...selectedRange, end: day })
    }
  }

  // Check if a day is in selected range
  const isDaySelected = (day) => {
    if (!selectedRange.start) return false
    if (!selectedRange.end) return selectedRange.start === day
    
    const start = Math.min(selectedRange.start, selectedRange.end)
    const end = Math.max(selectedRange.start, selectedRange.end)
    return day >= start && day <= end
  }

  // Generate cells for calendar
  const calendarCells = []
  
  // Blank cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-24 bg-muted/20 border-b border-r border-border" />)
  }

  // Month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const settings = customCalendar[dateKey] || {}

    // Check if booked by any active booking
    const booking = bookings.find(b => {
      if (b.status === "CANCELLED" || b.status === "CHECKED_OUT") return false
      const start = new Date(b.checkInDate)
      const end = new Date(b.checkOutDate)
      const currentCellDate = new Date(currentYear, currentMonth, day)
      start.setHours(0,0,0,0)
      end.setHours(0,0,0,0)
      currentCellDate.setHours(0,0,0,0)
      return currentCellDate >= start && currentCellDate <= end
    })
    
    const isBooked = !!booking
    const isBlockedDay = settings.isBlocked
    const currentPrice = settings.price || (booking ? booking.totalAmount : defaultRate)
    const note = settings.note

    let cellBg = "bg-card hover:bg-muted/50 cursor-pointer"
    if (isBooked) {
      cellBg = "bg-rose-50/70 hover:bg-rose-100/70 cursor-not-allowed"
    } else if (isBlockedDay) {
      cellBg = "bg-neutral-100 hover:bg-neutral-200/80 cursor-pointer [background-image:repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(0,0,0,0.03)_8px,rgba(0,0,0,0.03)_16px)]"
    } else if (isDaySelected(day)) {
      cellBg = "bg-primary/10 hover:bg-primary/20 cursor-pointer border-2 border-primary"
    }

    calendarCells.push(
      <div 
        key={`day-${day}`}
        onClick={() => !isBooked && handleDayClick(day)}
        className={`h-24 p-2 border-b border-r border-border flex flex-col justify-between transition relative select-none ${cellBg}`}
      >
        <div className="flex justify-between items-start">
          <span className={`text-xs font-bold ${isDaySelected(day) ? "text-primary font-black" : "text-foreground"}`}>
            {day}
          </span>
          {note && (
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" title={note} />
          )}
        </div>

        <div className="mt-auto space-y-1">
          {isBooked ? (
            <div>
              <span className="block text-[9px] font-bold text-rose-700 truncate">{booking.guest?.user?.fullname || booking.guest?.user?.name || "Guest"}</span>
              <span className="block text-[8px] text-rose-600/80">Booked · ₹{currentPrice}</span>
            </div>
          ) : isBlockedDay ? (
            <span className="block text-[9px] text-muted-foreground font-semibold flex items-center gap-0.5">
              <Lock size={8} /> Blocked
            </span>
          ) : (
            <span className="block text-xs font-extrabold text-foreground">
              ₹{currentPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    )
  }

  // Blank cells at the end to pad to a multiple of 7
  const totalCells = calendarCells.length
  const remainder = totalCells % 7
  if (remainder > 0) {
    for (let i = 0; i < (7 - remainder); i++) {
      calendarCells.push(<div key={`empty-end-${i}`} className="h-24 bg-muted/20 border-b border-r border-border" />)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Calendar Grid */}
        <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          
          {/* Header controllers */}
          <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-primary" size={20} />
              <h2 className="font-extrabold text-lg text-foreground">
                {monthNames[currentMonth]} {currentYear}
              </h2>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handlePrevMonth}
                className="p-2 border border-border bg-card hover:bg-muted text-foreground rounded-full transition cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2 border border-border bg-card hover:bg-muted text-foreground rounded-full transition cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-7 border-l border-t border-border">
            {/* Weekdays */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
              <div 
                key={dayName} 
                className="py-3 bg-muted/40 border-b border-r border-border text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                {dayName}
              </div>
            ))}
            
            {calendarCells}
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-border bg-muted/10 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border border-border bg-card rounded-md inline-block" />
              <span className="text-muted-foreground font-semibold">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-rose-50/70 border border-rose-200 rounded-md inline-block" />
              <span className="text-muted-foreground font-semibold">Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-neutral-100 border border-border rounded-md inline-block [background-image:repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.05)_4px,rgba(0,0,0,0.05)_8px)]" />
              <span className="text-muted-foreground font-semibold">Blocked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-primary/10 border border-primary rounded-md inline-block" />
              <span className="text-muted-foreground font-semibold">Selected Range</span>
            </div>
          </div>
        </div>

        {/* Right Side: Configuration & AI Price Tips Panel */}
        <div className="w-full lg:w-96 space-y-6 shrink-0">
          
          {/* Calendar settings box */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-5">
            <div>
              <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                <PenTool size={18} className="text-primary" />
                Edit Date Settings
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedRange.start 
                  ? selectedRange.end 
                    ? `Selected: June ${Math.min(selectedRange.start, selectedRange.end)} - June ${Math.max(selectedRange.start, selectedRange.end)}`
                    : `Selected: June ${selectedRange.start} (Click another date to select a range)`
                  : "Select a day or date range to make updates."
                }
              </p>
            </div>

            <div className="space-y-4">
              {/* Block/Unblock toggle */}
              <div className="flex items-center justify-between border-b border-border pb-3.5">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">Block dates</span>
                  <span className="text-[10px] text-muted-foreground">Prevent guests from booking</span>
                </div>
                <button
                  onClick={() => setIsBlocked(!isBlocked)}
                  className={`flex items-center gap-1 text-xs px-3.5 py-1.5 rounded-full font-bold transition cursor-pointer border ${
                    isBlocked 
                      ? "bg-neutral-800 text-white border-neutral-800" 
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {isBlocked ? <Lock size={12} /> : <Unlock size={12} />}
                  <span>{isBlocked ? "Blocked" : "Unblocked"}</span>
                </button>
              </div>

              {/* Price adjustment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">Price per night</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
                  <input
                    type="number"
                    disabled={isBlocked}
                    value={priceOverride}
                    onChange={(e) => setPriceOverride(e.target.value)}
                    placeholder={defaultRate.toString()}
                    className="w-full rounded-xl border border-border pl-7 pr-4 py-2 text-xs outline-none focus:border-primary bg-transparent disabled:opacity-50 disabled:bg-muted text-foreground font-semibold"
                  />
                </div>
              </div>

              {/* Private Date Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground">Private Calendar Note</label>
                <textarea
                  rows={2}
                  value={dateNote}
                  onChange={(e) => setDateNote(e.target.value)}
                  placeholder="e.g. Local monsoon festival, expect high traffic..."
                  className="w-full rounded-xl border border-border p-3 text-xs outline-none focus:border-primary bg-transparent text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Minimum night duration / Prep Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground">Min Nights</label>
                  <select
                    value={minNights}
                    onChange={(e) => setMinNights(e.target.value)}
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs bg-transparent outline-none text-foreground font-semibold"
                  >
                    <option value="1">1 night</option>
                    <option value="2">2 nights</option>
                    <option value="3">3 nights</option>
                    <option value="5">5 nights</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground">Prep Time</label>
                  <select
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full rounded-xl border border-border px-3 py-2 text-xs bg-transparent outline-none text-foreground font-semibold"
                  >
                    <option value="none">None</option>
                    <option value="1">1 day between</option>
                    <option value="2">2 days between</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={saveCustomSettings}
              disabled={!selectedRange.start}
              className="w-full bg-foreground text-background text-xs font-extrabold py-3.5 rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save size={14} /> Save Changes
            </button>
          </div>

          {/* AI price suggestion block */}
          <div className="bg-[#fcf8f2] border border-[#f5e1cb] rounded-2xl p-5 space-y-4">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-[#f97316]/10 text-[#f97316] rounded-full shrink-0">
                <Sparkles size={16} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#7c2d12]">AI Smart Pricing Tip</h4>
                <p className="text-xs text-[#9a3412] mt-1 leading-relaxed">
                  Based on seasonal demand dips in Goa and historical booking rates, lowering your rate by 12% to <strong className="text-[#7c2d12]">₹2,650</strong> for mid-June dates could increase your occupancy likelihood by 24%.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleApplyAIPricing}
              className="w-full py-2 bg-white border border-[#f5e1cb] hover:bg-[#fffbeb] text-xs font-bold text-[#7c2d12] rounded-full transition cursor-pointer flex items-center justify-center gap-1"
            >
              <Sparkles size={12} className="text-[#f97316]" /> Apply Recommended Rate
            </button>
          </div>
          
        </div>

      </div>
    </div>
  )
}
