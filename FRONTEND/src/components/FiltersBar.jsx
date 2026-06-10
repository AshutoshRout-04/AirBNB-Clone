import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"

const PRICE_RANGES = [
  { id: "all", label: "Any price" },
  { id: "budget", label: "Under ₹2,000", max: 2000 },
  { id: "mid", label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
  { id: "premium", label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { id: "luxury", label: "₹10,000+", min: 10000 },
]

export default function FiltersBar({ count, total, priceRange, setPriceRange }) {
  const [open, setOpen] = useState(false)

  const activeRange = PRICE_RANGES.find((r) => r.id === priceRange) || PRICE_RANGES[0]
  const isFiltered = priceRange && priceRange !== "all"

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border/40">
      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {total === 0 ? (
          "No stays found"
        ) : (
          <>
            <span className="font-bold text-foreground">{count}</span>
            {count !== total && (
              <span> of <span className="font-semibold">{total}</span></span>
            )}{" "}
            {count === 1 ? "stay" : "stays"} available
          </>
        )}
      </p>

      {/* Filter button */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          type="button"
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition hover:shadow-md cursor-pointer ${
            isFiltered
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background text-foreground hover:border-foreground"
          }`}
        >
          <SlidersHorizontal size={13} />
          <span>Filters</span>
          {isFiltered && (
            <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-background text-foreground text-[10px] font-bold">
              1
            </span>
          )}
        </button>

        {/* Dropdown panel */}
        {open && (
          <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-2xl border border-border bg-card p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-foreground">Price per night</h4>
              {isFiltered && (
                <button
                  onClick={() => { setPriceRange("all"); setOpen(false) }}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            <div className="space-y-2">
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => { setPriceRange(range.id); setOpen(false) }}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-xs font-semibold transition cursor-pointer ${
                    priceRange === range.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground hover:border-muted-foreground"
                  }`}
                >
                  <span>{range.label}</span>
                  {priceRange === range.id && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] text-muted-foreground text-center">
                Prices shown are nightly rates (before taxes &amp; fees)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { PRICE_RANGES }
