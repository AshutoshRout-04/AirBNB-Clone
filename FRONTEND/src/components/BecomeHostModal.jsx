
import { useState, useEffect } from "react"
import { X, ArrowRight, ArrowLeft, Home, Sparkles, CheckCircle } from "lucide-react"
import { useAuth } from "./LoginModal"
import { becomeHost } from "../services/UserService"
import { getHostByUserId } from "../services/HostService"
import { createPropertyForHost } from "../services/PropertyService"

const STAY_PRESETS = [
  { label: "Beachfront Villa", url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" },
  { label: "Wood Cabin", url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80" },
  { label: "Modern Penthouse", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" },
  { label: "Cozy Lakehouse", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
]

const EXPERIENCE_PRESETS = [
  { label: "Scuba Diving Adventure", url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80" },
  { label: "Local Cooking Masterclass", url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80" },
  { label: "Guided Mountain Trek", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" },
  { label: "City History Bike Tour", url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80" },
]

const SERVICE_PRESETS = [
  { label: "Private Chef Catering", url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80" },
  { label: "Luxury Airport Transfer", url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80" },
  { label: "Premium Spa & Wellness", url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" },
  { label: "Professional Photography", url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80" },
]

export default function BecomeHostModal({ onClose, onPropertyAdded }) {
  const { user, isLoggedIn, updateUserSession, openLogin } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Form states
  const [propertyType, setPropertyType] = useState("room")
  const [companyName, setCompanyName] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [pricePerNight, setPricePerNight] = useState("")
  const [maxGuests, setMaxGuests] = useState(2)
  const [bedrooms, setBedrooms] = useState(1)
  const [bathrooms, setBathrooms] = useState(1)
  const [imageUrl, setImageUrl] = useState("")

  // Features / Amenities list based on type
  const [amenities, setAmenities] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [customAmenity, setCustomAmenity] = useState("")

  // Experience/Service specific details
  const [durationHours, setDurationHours] = useState("2")
  const [difficultyLevel, setDifficultyLevel] = useState("beginner") // beginner, intermediate, advanced
  const [serviceCategory, setServiceCategory] = useState("Chef") // Chef, Driver, Guide, Wellness, Cleaner, Photography

  const getPresets = () => {
    if (propertyType === "experience") return EXPERIENCE_PRESETS
    if (propertyType === "service") return SERVICE_PRESETS
    return STAY_PRESETS
  }

  // Update default presets and amenities list when type changes
  useEffect(() => {
    const presets = getPresets()
    setImageUrl(presets[0].url)

    if (propertyType === "experience") {
      setAmenities(["English/Hindi Guide", "Safety Gear Included", "Drinks & Snacks", "Equipment Rental", "Transport Included", "First Aid Kit"])
      setSelectedAmenities(["Safety Gear Included"])
    } else if (propertyType === "service") {
      setAmenities(["Fluent Translator", "Fully Insured", "Equipment Provided", "24/7 Availability", "Child Friendly", "Customisable Plan"])
      setSelectedAmenities(["Equipment Provided"])
    } else {
      setAmenities(["Wifi", "Air Conditioning", "Free Parking", "Kitchen Access", "Pool", "Gym", "Washing Machine"])
      setSelectedAmenities(["Wifi", "Air Conditioning"])
    }
  }, [propertyType])

  // Automatically suggest photo from Unsplash if user types title or service category
  const handleGenerateAIPhoto = () => {
    if (!title && !serviceCategory) return
    const query = encodeURIComponent(propertyType === "service" ? `${serviceCategory} service professional` : title)
    const newUrl = `https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80` // fallback

    // We construct a dynamic Unsplash source query to simulate the AI generator output
    const randomSeed = Math.floor(Math.random() * 1000)
    const dynamicUrl = `https://images.unsplash.com/featured/?${query}&sig=${randomSeed}`
    setImageUrl(dynamicUrl)
  }

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(item => item !== amenity))
    } else {
      setSelectedAmenities([...selectedAmenities, amenity])
    }
  }

  const addCustomAmenity = (e) => {
    e.preventDefault()
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      setAmenities([...amenities, customAmenity.trim()])
      setSelectedAmenities([...selectedAmenities, customAmenity.trim()])
      setCustomAmenity("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) {
      setError("Please log in first before listing properties.")
      openLogin()
      return
    }

    setLoading(true)
    setError(null)

    // Store custom features/amenities inside description or formatted metadata
    let enrichedDescription = description
    if (selectedAmenities.length > 0) {
      enrichedDescription += `\n\nFeatures/Amenities:\n- ${selectedAmenities.join("\n- ")}`
    }
    if (propertyType === "experience") {
      enrichedDescription += `\n\nDuration: ${durationHours} hours | Difficulty: ${difficultyLevel}`
    } else if (propertyType === "service") {
      enrichedDescription += `\n\nService Category: ${serviceCategory}`
    }

    const payload = {
      title,
      description: enrichedDescription,
      location,
      pricePerNight: parseFloat(pricePerNight),
      maxGuests: parseInt(maxGuests),
      bedrooms: propertyType === "room" ? parseInt(bedrooms) : 0,
      bathrooms: propertyType === "room" ? parseInt(bathrooms) : 0,
      available: true,
      photos: JSON.stringify([{ id: 1, url: imageUrl, caption: title, category: "Cover" }]),
      propertyType,
      companyName
    }

    try {
      let activeUser = user;
      // Upgrade role in backend if guest
      if (activeUser.role !== "HOST" && activeUser.role !== "HOST_GUEST" && activeUser.role !== "ADMIN") {
        const upgradeRes = await becomeHost(activeUser.id)
        const dbUser = upgradeRes.data
        activeUser = {
          ...activeUser,
          role: dbUser.role
        }
        updateUserSession(activeUser)
      }

      // Fetch the host profile to get the host id
      const hostRes = await getHostByUserId(activeUser.id)
      const hostData = hostRes.data

      if (!hostData || !hostData.id) {
        throw new Error("Could not retrieve host profile. Please try again.")
      }

      // Link host ID in localStorage for host dashboard views
      localStorage.setItem("staybnb_host_id", hostData.id.toString())

      // Create property for host
      await createPropertyForHost(hostData.id, payload)
      setSuccess(true)
      if (onPropertyAdded) {
        onPropertyAdded()
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || err.message || "Failed to create listing.")
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
            <span>Airbnb host dashboard</span>
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
              {propertyType === "experience"
                ? "Your experience has been registered and is now listed for guests to book."
                : propertyType === "service"
                  ? "Your service has been registered and is now listed for guests to request."
                  : "Your home has been registered and is now listed for guests to search and book."}
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
                  <p className="text-xs text-muted-foreground">Choose listing type, name your service/experience, location, and details.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-foreground">Listing Type</label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-border p-2.5 text-sm bg-background text-foreground outline-none focus:border-primary font-semibold"
                      >
                        <option value="room">Room / Stay</option>
                        <option value="experience">Experience</option>
                        <option value="service">Service</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-foreground">
                        {propertyType === "room" ? "Company Name (Optional)" : "Service Provider Name"}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Peak Adventure Tours"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-border p-2.5 text-sm bg-transparent outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {propertyType === "service" && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-foreground">Service Category</label>
                      <select
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-border p-2.5 text-sm bg-background text-foreground outline-none focus:border-primary font-semibold"
                      >
                        <option value="Chef">Private Chef / Catering</option>
                        <option value="Driver">Chauffeur / Airport Transport</option>
                        <option value="Guide">Tour Guide / Translator</option>
                        <option value="Wellness">Massage & Spa Professional</option>
                        <option value="Cleaner">Premium Housekeeping</option>
                        <option value="Photography">Vacation Photographer</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-foreground">Title</label>
                    <input
                      type="text"
                      required
                      placeholder={
                        propertyType === "experience"
                          ? "e.g. Hidden Waterfalls Guided Trek & Picnic"
                          : propertyType === "service"
                            ? "e.g. Premium 5-Course Italian Dinners Cooked at Your Stay"
                            : "e.g. Cozy Log Cabin with Jacuzzi"
                      }
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
                      placeholder="Describe the experience flow, service details, requirements, etc."
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
                  <h3 className="text-lg font-bold">Step 2: Features & Specifications</h3>

                  {/* Dynamic Capacity Selectors */}
                  <div className="flex flex-col gap-4 border-b border-border pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block font-semibold text-sm">
                          {propertyType === "experience" ? "Group Capacity" : propertyType === "service" ? "Max Clients" : "Guests Capacity"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {propertyType === "experience" ? "Maximum participants per group" : propertyType === "service" ? "Maximum booking capacity per slot" : "Maximum guests allowed"}
                        </span>
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

                    {propertyType === "experience" && (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-foreground">Duration (Hours)</label>
                          <input
                            type="number"
                            min={1}
                            max={72}
                            value={durationHours}
                            onChange={(e) => setDurationHours(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-border p-2 text-sm bg-transparent outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-foreground">Difficulty Level</label>
                          <select
                            value={difficultyLevel}
                            onChange={(e) => setDifficultyLevel(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-border p-2 text-sm bg-background text-foreground outline-none focus:border-primary"
                          >
                            <option value="beginner">Beginner Friendly</option>
                            <option value="intermediate">Moderate</option>
                            <option value="advanced">Challenging / Pro</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Amenities / Key Features Checklist */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wide text-foreground">
                      {propertyType === "experience" ? "What's Included" : propertyType === "service" ? "Key Service Features" : "Amenities"}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {amenities.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleAmenity(item)}
                          className={`flex items-center gap-2 p-2 border rounded-lg text-xs font-medium cursor-pointer transition text-left ${selectedAmenities.includes(item)
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:bg-muted"
                            }`}
                        >
                          <span className="h-2 w-2 rounded-full bg-current" />
                          <span>{item}</span>
                        </button>
                      ))}
                    </div>

                    {/* Add Custom Amenity Form */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add custom item..."
                        value={customAmenity}
                        onChange={(e) => setCustomAmenity(e.target.value)}
                        className="flex-1 rounded-lg border border-border p-2 text-xs bg-transparent outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={addCustomAmenity}
                        className="px-3 py-2 bg-muted text-foreground border border-border rounded-lg text-xs font-bold hover:bg-muted/80"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Photos & Prices */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-bold">Step 3: Pricing & Style</h3>
                  <p className="text-xs text-muted-foreground">Select a cover photo theme or use our dynamic generator, and set your price.</p>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-foreground">
                      {propertyType === "experience" ? "Price per Person (₹)" : propertyType === "service" ? "Price per Hour/Service (₹)" : "Nightly Rate (₹)"}
                    </label>
                    <input
                      type="number"
                      required
                      placeholder={propertyType === "experience" ? "e.g. 1500" : propertyType === "service" ? "e.g. 2000" : "e.g. 4500"}
                      min={100}
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border p-2.5 text-sm bg-transparent outline-none focus:border-primary"
                    />
                  </div>

                  {/* AI Photo Generator Section */}
                  <div className="border border-primary/20 rounded-xl p-3 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-primary uppercase tracking-wide">AI Photo Generator</span>
                        <span className="text-[10px] text-muted-foreground">Generates a relevant Unsplash cover based on your listing details.</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerateAIPhoto}
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-95"
                      >
                        <Sparkles size={12} /> Generate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-foreground mb-2">Preset Options</label>
                    <div className="grid grid-cols-2 gap-2">
                      {getPresets().map((img) => (
                        <button
                          key={img.label}
                          type="button"
                          onClick={() => setImageUrl(img.url)}
                          className={`relative rounded-xl overflow-hidden border-2 text-left cursor-pointer transition ${imageUrl === img.url ? "border-primary ring-2 ring-primary/20" : "border-transparent"
                            }`}
                        >
                          <img src={img.url} alt={img.label} className="h-20 w-full object-cover" />
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1 text-[9px] font-bold text-white uppercase truncate">{img.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-foreground">Or Selected Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border p-2.5 text-sm bg-transparent outline-none focus:border-primary text-xs"
                    />
                  </div>

                  {imageUrl && (
                    <div className="pt-2">
                      <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">Preview Selected Photo</span>
                      <img src={imageUrl} alt="Preview" className="h-28 w-full object-cover rounded-lg border" />
                    </div>
                  )}
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
                  {loading ? "Publishing..." : propertyType === "experience" ? "Publish Experience" : propertyType === "service" ? "Publish Service" : "Publish Home"} <Sparkles size={16} />
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

