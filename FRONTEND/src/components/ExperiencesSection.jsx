import { useState } from "react"
import { Sparkles, Star, Users, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

const EXPERIENCE_IMAGES = [
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1682687220208-22d7a2543e88?auto=format&fit=crop&w=800&q=80",
]

function getExperienceImage(property) {
  if (property.photos) {
    try {
      const parsed = JSON.parse(property.photos)
      if (Array.isArray(parsed) && parsed[0]?.url) return parsed[0].url
    } catch (_) {}
  }
  const idx = (property.id || 0) % EXPERIENCE_IMAGES.length
  return EXPERIENCE_IMAGES[idx]
}

export default function ExperiencesSection({ experiences, onSelect }) {
  const [startIdx, setStartIdx] = useState(0)
  const visible = 4

  if (!experiences || experiences.length === 0) return null

  const canPrev = startIdx > 0
  const canNext = startIdx + visible < experiences.length

  const shown = experiences.slice(startIdx, startIdx + visible)

  return (
    <section className="my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600">Experiences</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Things to do</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Unique activities hosted by locals</p>
        </div>
        <div className="flex items-center gap-2">
          {canPrev && (
            <button
              onClick={() => setStartIdx(Math.max(0, startIdx - visible))}
              className="h-9 w-9 rounded-full border border-border bg-background flex items-center justify-center hover:bg-muted shadow-sm transition hover:scale-105"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {canNext && (
            <button
              onClick={() => setStartIdx(startIdx + visible)}
              className="h-9 w-9 rounded-full border border-border bg-background flex items-center justify-center hover:bg-muted shadow-sm transition hover:scale-105"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {shown.map((exp) => {
          const img = getExperienceImage(exp)
          const rating = exp.rating ?? (4.7 + (exp.id % 4) * 0.07).toFixed(2)
          return (
            <article
              key={exp.id}
              onClick={() => onSelect(exp)}
              className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden border border-border/60 hover:border-purple-300 bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={img}
                  alt={exp.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {/* Experience badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-purple-700 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
                  <Sparkles size={9} />
                  Experience
                </div>
                {/* Rating */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-bold">
                  <Star size={11} className="fill-white" />
                  {typeof rating === "number" ? rating.toFixed(2) : rating}
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5 flex flex-col gap-1">
                <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {exp.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{exp.location}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Users size={11} />
                    Up to {exp.maxGuests} guests
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    ₹{exp.pricePerNight?.toLocaleString()}
                    <span className="font-normal text-muted-foreground"> / session</span>
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* See all link */}
      {experiences.length > visible && (
        <div className="mt-5 flex justify-start">
          <button
            onClick={() => onSelect && onSelect("experiences")}
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground underline underline-offset-4 hover:text-purple-600 transition-colors"
          >
            Show all {experiences.length} experiences <ArrowRight size={14} />
          </button>
        </div>
      )}
    </section>
  )
}
