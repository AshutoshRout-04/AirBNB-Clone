import { useState } from "react"
import { Briefcase, Star, ArrowRight, ChevronLeft, ChevronRight, Clock } from "lucide-react"

const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560066984-138daaa4e74b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519416645881-b6a3a5da9eff?auto=format&fit=crop&w=800&q=80",
]

const SERVICE_TAGS = ["Spa & Wellness", "Personal Chef", "Photography", "Tour Guide", "Yoga", "Massage"]

function getServiceImage(property) {
  if (property.photos) {
    try {
      const parsed = JSON.parse(property.photos)
      if (Array.isArray(parsed) && parsed[0]?.url) return parsed[0].url
    } catch (_) {}
  }
  const idx = (property.id || 0) % SERVICE_IMAGES.length
  return SERVICE_IMAGES[idx]
}

export default function ServicesSection({ services, onSelect }) {
  const [startIdx, setStartIdx] = useState(0)
  const visible = 4

  if (!services || services.length === 0) return null

  const canPrev = startIdx > 0
  const canNext = startIdx + visible < services.length
  const shown = services.slice(startIdx, startIdx + visible)

  return (
    <section className="my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Briefcase size={12} className="text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Services</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Services near you</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Professional services from trusted providers</p>
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
        {shown.map((svc) => {
          const img = getServiceImage(svc)
          const rating = svc.rating ?? (4.6 + (svc.id % 5) * 0.06).toFixed(2)
          const tag = SERVICE_TAGS[(svc.id || 0) % SERVICE_TAGS.length]
          return (
            <article
              key={svc.id}
              onClick={() => onSelect(svc)}
              className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden border border-border/60 hover:border-blue-300 bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={img}
                  alt={svc.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {/* Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
                  <Briefcase size={9} />
                  {tag}
                </div>
                {/* Rating */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-bold">
                  <Star size={11} className="fill-white" />
                  {typeof rating === "number" ? rating.toFixed(2) : rating}
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5 flex flex-col gap-1">
                <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {svc.companyName ? `By ${svc.companyName}` : svc.location}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock size={11} />
                    Book anytime
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    ₹{svc.pricePerNight?.toLocaleString()}
                    <span className="font-normal text-muted-foreground"> / service</span>
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* See all link */}
      {services.length > visible && (
        <div className="mt-5 flex justify-start">
          <button
            onClick={() => onSelect && onSelect("services")}
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground underline underline-offset-4 hover:text-blue-600 transition-colors"
          >
            Show all {services.length} services <ArrowRight size={14} />
          </button>
        </div>
      )}
    </section>
  )
}
