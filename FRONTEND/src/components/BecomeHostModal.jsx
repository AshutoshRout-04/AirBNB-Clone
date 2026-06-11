import { useState } from "react"
import { X, ArrowRight, ArrowLeft, Home, Sparkles, CheckCircle } from "lucide-react"
import axios from "axios"

const PRESET_IMAGES = [
  { label: "Beachfront Villa", url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" },
  { label: "Wood Cabin", url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80" },
  { label: "Modern Penthouse", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" },
  { label: "Cozy Lakehouse", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
]

export default function BecomeHostModal({ onClose, onPropertyAdded }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Form states
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [pricePerNight, setPricePerNight] = useState("")
  const [maxGuests, setMaxGuests] = useState(2)
  const [bedrooms, setBedrooms] = useState(1)
  const [bathrooms, setBathrooms] = useState(1)
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      title,
      description,
      location,
      pricePerNight: parseFloat(pricePerNight),
      maxGuests: parseInt(maxGuests),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      available: true,
      imageUrl // Will be stored on backend or resolved in helper
    }

    try {
      await axios.post("http://localhost:8086/properties/addProperty", payload)
      setSuccess(true)
      if (onPropertyAdded) {
        onPropertyAdded()
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to create property. Verify database connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl bg-background shadow-2xl transition-all duration-300 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-4">
          <span className="flex items-center gap-2 font-bold text-primary">
            <Home size={18} />
            <span>Airbnb your home</span>
          </span>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted text-muted-foreground"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-emerald-100 p-4 text-emerald-600 mb-4 animate-bounce">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-2xl font-bold">Listing Live!</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Your home has been registered and is now listed for guests to search and book.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:opacity-90 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-6 flex-1">
              {/* Progress bar */}
              <div className="h-1 w-full bg-border rounded-full mb-6">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>

              {/* Step 1: Basics */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-bold">Step 1: The Basics</h3>
                  <p className="text-xs text-muted-foreground">Name your place, add location and set the description.</p>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-foreground">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cozy Log Cabin with Jacuzzi"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border p-2.5 text-sm bg-transparent outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-foreground">Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Manali, Himachal Pradesh"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border p-2.5 text-sm bg-transparent outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-foreground">Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe the vibes, layout, amenities..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border p-2.5 text-sm bg-transparent outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Specs */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-bold">Step 2: Capacity & Specifications</h3>
                  <p className="text-xs text-muted-foreground">Help travelers check if your home matches their group size.</p>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <span className="block font-semibold text-sm">Guests Capacity</span>
                        <span className="text-xs text-muted-foreground">Maximum guests allowed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setMaxGuests(Math.max(1, maxGuests - 1))}
                          className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-sm w-4 text-center">{maxGuests}</span>
                        <button
                          type="button"
                          onClick={() => setMaxGuests(maxGuests + 1)}
                          className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <span className="block font-semibold text-sm">Bedrooms</span>
                        <span className="text-xs text-muted-foreground">Available bedrooms</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                          className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-sm w-4 text-center">{bedrooms}</span>
                        <button
                          type="button"
                          onClick={() => setBedrooms(bedrooms + 1)}
                          className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block font-semibold text-sm">Bathrooms</span>
                        <span className="text-xs text-muted-foreground">Available bathrooms</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                          className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-sm w-4 text-center">{bathrooms}</span>
                        <button
                          type="button"
                          onClick={() => setBathrooms(bathrooms + 1)}
                          className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Photos & Prices */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-bold">Step 3: Pricing & Style</h3>
                  <p className="text-xs text-muted-foreground">Select a cover photo theme and set your nightly price.</p>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-foreground">Nightly Rate (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 4500"
                      min={100}
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border p-2.5 text-sm bg-transparent outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">Cover Photo Preset</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_IMAGES.map((img) => (
                        <button
                          key={img.label}
                          type="button"
                          onClick={() => setImageUrl(img.url)}
                          className={`relative rounded-xl overflow-hidden border-2 text-left cursor-pointer transition ${
                            imageUrl === img.url ? "border-primary ring-2 ring-primary/20" : "border-transparent"
                          }`}
                        >
                          <img src={img.url} alt={img.label} className="h-24 w-full object-cover" />
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1 text-[10px] font-bold text-white uppercase">{img.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-foreground">Or Custom Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border p-2.5 text-sm bg-transparent outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 text-xs font-semibold text-primary bg-primary/5 border border-primary/20 rounded-lg p-3">
                  {error}
                </div>
              )}
            </div>

            {/* Footer Nav */}
            <div className="border-t border-border p-4 bg-muted/30 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-full text-sm font-semibold hover:bg-muted cursor-pointer"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-90 cursor-pointer"
                >
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-[var(--color-primary-hover)] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Publishing..." : "Publish Home"} <Sparkles size={16} />
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
