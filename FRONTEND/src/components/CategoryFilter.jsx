import { useState, useRef, useEffect } from "react"
import {
  Waves,
  Home,
  Castle,
  Mountain,
  Flame,
  Sprout,
  TreeDeciduous,
  Tent,
  Compass,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export const CATEGORIES = [
  { id: "all", label: "All homes", icon: Compass },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "beachfront", label: "Beachfront", icon: Waves },
  { id: "cabins", label: "Cabins", icon: Home },
  { id: "mansions", label: "Mansions", icon: Castle },
  { id: "amazing_views", label: "Amazing views", icon: Mountain },
  { id: "treehouses", label: "Treehouses", icon: TreeDeciduous },
  { id: "countryside", label: "Countryside", icon: Sprout },
  { id: "camping", label: "Camping", icon: Tent },
]

export default function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  const scrollRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeftArrow(scrollLeft > 5)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5)
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [])

  const scroll = (direction) => {
    if (!scrollRef.current) return
    const offset = direction === "left" ? -250 : 250
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" })
    setTimeout(checkScroll, 300)
  }

  return (
    <div className="relative my-4 flex items-center border-b border-border/60 pb-1">
      {/* Left scroll button */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-md transition hover:scale-105"
          type="button"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {/* Categories container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="no-scrollbar flex w-full gap-8 overflow-x-auto scroll-smooth px-2 pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              type="button"
              className={`flex flex-col items-center gap-2 border-b-2 pb-2 transition-all duration-200 hover:text-foreground/100 cursor-pointer ${
                isActive
                  ? "border-foreground text-foreground font-semibold"
                  : "border-transparent text-muted-foreground hover:border-muted-foreground/30"
              }`}
            >
              <Icon size={24} className={`stroke-[1.5] ${isActive ? "text-primary" : ""}`} />
              <span className="whitespace-nowrap text-xs tracking-tight">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right scroll button */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-md transition hover:scale-105"
          type="button"
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}
