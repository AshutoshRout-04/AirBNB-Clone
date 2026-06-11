import { useState, useRef, useEffect } from "react"
import { Search, MapPin, Calendar, Users, X } from "lucide-react"

export default function Searchbar({ query, setQuery, onSearch, searchInputsRef, properties = [] }) {
  const [active, setActive] = useState(null)
  
  // Search criteria states
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [adults, setAdults] = useState(0)
  const [childrenCount, setChildrenCount] = useState(0)

  const searchbarRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchbarRef.current && !searchbarRef.current.contains(event.target)) {
        setActive(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Extract unique locations from registered properties
  const uniqueLocations = Array.from(
    new Set(
      properties
        .map((p) => p.location)
        .filter(Boolean)
        .map((loc) => {
          // If location is "Bhubaneswar, Odisha", return "Bhubaneswar"
          return loc.split(",")[0].trim()
        })
    )
  )

  const popularDestinations = ["I&apos;m flexible", ...uniqueLocations]

  const handleDestinationSelect = (dest) => {
    if (dest.includes("flexible")) {
      setQuery("")
    } else {
      setQuery(dest)
    }
    setActive("when") // Move to next section
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setActive(null)
    const guestTotal = adults + childrenCount
    if (onSearch) {
      onSearch({
        query: query,
        checkIn,
        checkOut,
        guests: guestTotal > 0 ? guestTotal : 0
      })
    }
  }

  const handleClearFilters = (e) => {
    e.stopPropagation()
    setQuery("")
    setCheckIn("")
    setCheckOut("")
    setAdults(0)
    setChildrenCount(0)
    setActive(null)
    if (onSearch) {
      onSearch({
        query: "",
        checkIn: "",
        checkOut: "",
        guests: 0
      })
    }
  }

  const guestCountTotal = adults + childrenCount
  const segment = (key) =>
    `flex flex-1 flex-col justify-center text-left px-5 py-3 rounded-full transition-all duration-200 cursor-pointer ${
      active === key
        ? "bg-background [box-shadow:0_6px_20px_rgba(0,0,0,0.1)] z-10"
        : "hover:bg-muted"
    }`

  return (
    <section className="py-6 border-b border-border/40" ref={searchbarRef}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <span>Find your next stay</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Search premium villas, cozy cabins and scenic apartments.</p>
        </div>
        {(query || checkIn || checkOut || guestCountTotal > 0) && (
          <button
            onClick={handleClearFilters}
            className="self-start md:self-center flex items-center gap-1.5 px-3 py-1.5 border border-primary/20 bg-primary/5 text-primary rounded-full text-xs font-semibold hover:bg-primary/10 transition cursor-pointer"
            type="button"
          >
            <X size={12} className="stroke-[2.5]" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* Airbnb custom Search Container */}
      <div
        ref={searchInputsRef}
        className="relative mt-6 flex w-full flex-col rounded-3xl border border-border bg-card p-1.5 [box-shadow:0_4px_12px_rgba(0,0,0,0.08)] md:flex-row md:items-center md:rounded-full"
      >
        {/* WHERE */}
        <div className="relative flex-1">
          <button
            type="button"
            className={segment("where")}
            onClick={() => setActive("where")}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">Where</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations"
              className="mt-0.5 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </button>

          {/* Destination Popover showing dynamic properties locations */}
          {active === "where" && (
            <div className="absolute left-0 top-full z-30 mt-2 w-72 rounded-2xl border border-border bg-card p-4 shadow-xl animate-fade-in">
              <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Popular Regions</span>
              <div className="grid grid-cols-2 gap-2">
                {popularDestinations.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => handleDestinationSelect(dest)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/60 hover:border-primary hover:bg-primary/5 transition text-center cursor-pointer"
                  >
                    <MapPin size={16} className="text-primary mb-1" />
                    <span className="text-xs font-semibold">{dest.includes("flexible") ? "I'm flexible" : dest}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <span className="hidden h-8 w-px bg-border md:block shrink-0" />

        {/* WHEN */}
        <div className="relative flex-1">
          <button
            type="button"
            className={segment("when")}
            onClick={() => setActive("when")}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">When</span>
            <span className="mt-0.5 text-sm font-medium text-muted-foreground truncate">
              {checkIn && checkOut
                ? `${checkIn} to ${checkOut}`
                : checkIn
                ? `Starts ${checkIn}`
                : "Any week / Select dates"}
            </span>
          </button>

          {/* Calendar Picker Popover */}
          {active === "when" && (
            <div className="absolute left-0 top-full z-30 mt-2 w-80 rounded-2xl border border-border bg-card p-5 shadow-xl animate-fade-in">
              <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Trip Dates</span>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-foreground">Check-In</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value)
                      if (checkOut && e.target.value >= checkOut) {
                        setCheckOut("")
                      }
                    }}
                    className="mt-1 w-full rounded-lg border border-border p-2 text-xs bg-transparent outline-none focus:border-primary cursor-pointer text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-foreground">Check-Out</label>
                  <input
                    type="date"
                    disabled={!checkIn}
                    min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split("T")[0] : ""}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border p-2 text-xs bg-transparent outline-none focus:border-primary cursor-pointer disabled:opacity-50 text-foreground"
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCheckIn("")
                      setCheckOut("")
                    }}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground underline cursor-pointer"
                  >
                    Clear dates
                  </button>
                  <button
                    type="button"
                    onClick={() => setActive("who")}
                    className="rounded-full bg-foreground px-4 py-1.5 text-xs font-bold text-background hover:opacity-90 cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <span className="hidden h-8 w-px bg-border md:block shrink-0" />

        {/* WHO + SEARCH BUTTON */}
        <div className="relative flex-1 flex flex-row items-center justify-between">
          <button
            type="button"
            className={`${segment("who")} flex-1 mr-2`}
            onClick={() => setActive("who")}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">Who</span>
            <span className="mt-0.5 text-sm font-medium text-muted-foreground truncate">
              {guestCountTotal > 0
                ? `${guestCountTotal} traveler${guestCountTotal === 1 ? "" : "s"}`
                : "Add guests"}
            </span>
          </button>

          {/* Search trigger button inside pill */}
          <button
            type="button"
            onClick={handleSearchSubmit}
            className="mr-2 rounded-full bg-primary p-3.5 text-primary-foreground transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:scale-105 active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
          >
            <Search size={16} className="stroke-[3]" />
          </button>

          {/* Guests Popover */}
          {active === "who" && (
            <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-2xl border border-border bg-card p-5 shadow-xl animate-fade-in text-left">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <span className="block text-sm font-bold text-foreground">Adults</span>
                    <span className="text-xs text-muted-foreground">Ages 13 or above</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(0, adults - 1))}
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted font-bold"
                    >
                      -
                    </button>
                    <span className="font-semibold text-sm w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-bold text-foreground">Children</span>
                    <span className="text-xs text-muted-foreground">Ages 2-12</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted font-bold"
                    >
                      -
                    </button>
                    <span className="font-semibold text-sm w-4 text-center">{childrenCount}</span>
                    <button
                      type="button"
                      onClick={() => setChildrenCount(childrenCount + 1)}
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAdults(0)
                      setChildrenCount(0)
                    }}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground underline cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-[var(--color-primary-hover)] cursor-pointer"
                  >
                    Apply Search
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}