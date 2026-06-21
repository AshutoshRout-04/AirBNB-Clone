import { useState } from "react"
import { X, Star } from "lucide-react"
import { createReview } from "../services/ReviewService"
import { useToast } from "./Toast"

export default function ReviewModal({ booking, onClose, onReviewSubmitted }) {
  const toast = useToast()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const guestId = localStorage.getItem("staybnb_guest_id")
  const propertyId = booking?.property?.propertyId || booking?.property?.id

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      toast({ type: "error", title: "Rating required", message: "Please select a star rating before submitting." })
      return
    }
    if (!comment.trim()) {
      toast({ type: "error", title: "Review required", message: "Please write a brief review." })
      return
    }
    setLoading(true)
    try {
      await createReview({
        propertyId,
        guestId: guestId ? parseInt(guestId, 10) : null,
        bookingId: booking.bookingId,
        rating,
        comment: comment.trim(),
      })
      toast({ type: "success", title: "Review submitted!", message: "Thank you for your feedback." })
      if (onReviewSubmitted) onReviewSubmitted()
      onClose()
    } catch (err) {
      console.error(err)
      toast({ type: "error", title: "Submission failed", message: "Could not submit review. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-background shadow-2xl border border-border animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="font-bold text-base text-foreground">Leave a Review</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {booking?.property?.title || "Your recent stay"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Star Rating */}
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={
                      star <= (hovered || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-border fill-border"
                    }
                  />
                </button>
              ))}
              {(hovered || rating) > 0 && (
                <span className="ml-2 text-sm font-semibold text-amber-500">
                  {STAR_LABELS[hovered || rating]}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              Your Experience
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share what you loved about this stay — the space, the host, the location..."
              className="w-full rounded-xl border border-border p-3 text-sm bg-transparent outline-none focus:border-primary placeholder:text-muted-foreground text-foreground resize-none"
              maxLength={600}
            />
            <div className="text-right text-[10px] text-muted-foreground mt-1">{comment.length}/600</div>
          </div>

          {/* Booking info summary */}
          <div className="bg-muted/40 rounded-xl p-3 text-xs text-muted-foreground flex justify-between">
            <span>Check-in: <strong className="text-foreground">{booking?.checkInDate}</strong></span>
            <span>Check-out: <strong className="text-foreground">{booking?.checkOutDate}</strong></span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-[var(--color-primary-hover)] transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
