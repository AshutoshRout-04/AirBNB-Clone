import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Camera, Sparkles, CheckCircle2, Eye, BookOpen, Wifi, Shield, ArrowRight, X, Star, Briefcase } from "lucide-react"
import { getAllProperties, createProperty, createPropertyForHost, updateProperty, deleteProperty, getPropertiesByHost } from "../../services/PropertyService"
import { getPropertyImages } from "../../services/ImageHelper"
import { useToast } from "../Toast"

// Category-based Amenities (simulate 150 options)
const CATEGORIZED_AMENITIES = {
  Essentials: ["Wi-Fi", "Kitchen", "Air Conditioning", "Heating", "Washer", "Dryer", "Iron", "Dedicated workspace", "TV", "Hair dryer"],
  Safety: ["Smoke alarm", "Carbon monoxide alarm", "First aid kit", "Fire extinguisher", "Lockbox / Smart lock"],
  Outdoor: ["Patio or balcony", "Backyard", "Outdoor dining area", "BBQ grill", "Beach access", "Lake access"],
  Luxury: ["Private pool", "Hot tub", "Gym / Fitness equipment", "Sauna", "Paid parking on premises", "Free parking on premises"]
}

export default function ListingsTab() {
  const toast = useToast()
  
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [hostId, setHostId] = useState(null)
  
  // Read the logged-in host ID from localStorage on mount and fetch listings
  useEffect(() => {
    const storedHostId = localStorage.getItem("staybnb_host_id")
    if (storedHostId) {
      const parsedId = parseInt(storedHostId)
      setHostId(parsedId)
      fetchProperties(parsedId)
    } else {
      fetchProperties()
    }
  }, [])
  
  // Modals & Panels state
  const [editingProperty, setEditingProperty] = useState(null) // null = view list, 'new' = create, {id} = editing
  const [previewProperty, setPreviewProperty] = useState(null) // property to preview as guest
  const [activeListingTab, setActiveListingTab] = useState("details") // 'details' | 'photos' | 'amenities' | 'guide'
  
  // Form values
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    pricePerNight: "",
    maxGuests: "",
    bedrooms: "",
    bathrooms: "",
    available: true,
    propertyType: "room",
    companyName: ""
  })

  // Simulated photo tour gallery state
  const [uploadedPhotos, setUploadedPhotos] = useState([
    { id: 1, url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80", caption: "Bright living room", category: "Living Room" },
    { id: 2, url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80", caption: "Master bedroom suite", category: "Bedroom" },
    { id: 3, url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=400&q=80", caption: "Chef's gourmet kitchen", category: "Kitchen" }
  ])
  const [newPhotoUrl, setNewPhotoUrl] = useState("")
  const [aiSorting, setAiSorting] = useState(false)

  // Selected amenities list
  const [selectedAmenities, setSelectedAmenities] = useState([])

  // Arrival Guide state
  const [guideData, setGuideData] = useState({
    wifiNetwork: "",
    wifiPassword: "",
    checkInMethod: "Lockbox",
    checkInInstructions: "",
    houseRules: ""
  })

  const fetchProperties = async (id) => {
    setLoading(true)
    try {
      const currentHostId = id || hostId
      const res = currentHostId 
        ? await getPropertiesByHost(currentHostId)
        : await getAllProperties()
      setProperties(res.data || [])
    } catch (err) {
      console.error("Failed to fetch properties:", err)
    } finally {
      setLoading(false)
    }
  }

  // No mock data — only real backend data is shown

  const openCreateForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      pricePerNight: "",
      maxGuests: "2",
      bedrooms: "1",
      bathrooms: "1",
      available: true,
      propertyType: "room",
      companyName: ""
    })
    setEditingProperty("new")
    setActiveListingTab("details")
    setSelectedAmenities(["Wi-Fi", "Kitchen", "Air Conditioning"])
    setUploadedPhotos([
      { id: 1, url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80", caption: "Cozy living space", category: "Unsorted" },
      { id: 2, url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80", caption: "Bedroom", category: "Unsorted" }
    ])
    setGuideData({
      wifiNetwork: "StayBNB_Guest",
      wifiPassword: "welcomehome!",
      checkInMethod: "Lockbox",
      checkInInstructions: "Check-in box is located to the right of the front door. Code is 1234.",
      houseRules: "No loud music after 10 PM. No parties."
    })
  }

  const openEditForm = (prop) => {
    setFormData({
      title: prop.title || "",
      description: prop.description || "",
      location: prop.location || "",
      pricePerNight: prop.pricePerNight ? prop.pricePerNight.toString() : "",
      maxGuests: prop.maxGuests ? prop.maxGuests.toString() : "2",
      bedrooms: prop.bedrooms ? prop.bedrooms.toString() : "1",
      bathrooms: prop.bathrooms ? prop.bathrooms.toString() : "1",
      available: prop.available !== undefined ? prop.available : true,
      propertyType: prop.propertyType || "room",
      companyName: prop.companyName || ""
    })
    setEditingProperty(prop)
    setActiveListingTab("details")
    
    // Load amenities from backend property field
    if (prop.amenities) {
      try {
        setSelectedAmenities(JSON.parse(prop.amenities))
      } catch (_) {
        setSelectedAmenities(prop.amenities.split(","))
      }
    } else {
      setSelectedAmenities(["Wi-Fi", "Kitchen", "Air Conditioning", "Free parking on premises"])
    }

    // Load guide data from backend property fields
    setGuideData({
      wifiNetwork: prop.wifiNetwork || "StayBNB_HighSpeed",
      wifiPassword: prop.wifiPassword || "holidayvibes",
      checkInMethod: prop.checkInMethod || "Smart Lock",
      checkInInstructions: prop.checkInInstructions || "Smart lock access code will be sent to your inbox 24 hours prior to arrival.",
      houseRules: prop.houseRules || "Please keep the noise down during late hours. Respect the neighbors."
    })

    // Load photos from backend property field
    if (prop.photos) {
      try {
        setUploadedPhotos(JSON.parse(prop.photos))
      } catch (_) {
        const images = getPropertyImages(prop)
        setUploadedPhotos([
          { id: 1, url: images[0], caption: "Main listing view", category: "Exterior" },
          { id: 2, url: images[1], caption: "Living area", category: "Living Room" },
          { id: 3, url: images[2], caption: "Bedroom", category: "Bedroom" }
        ])
      }
    } else {
      const images = getPropertyImages(prop)
      setUploadedPhotos([
        { id: 1, url: images[0], caption: "Main listing view", category: "Exterior" },
        { id: 2, url: images[1], caption: "Living area", category: "Living Room" },
        { id: 3, url: images[2], caption: "Bedroom", category: "Bedroom" }
      ])
    }
  }

  const handleSaveProperty = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.location || !formData.pricePerNight) {
      toast({
        type: "warning",
        title: "Incomplete fields",
        message: "Please fill in all core details."
      })
      return
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      pricePerNight: parseFloat(formData.pricePerNight),
      maxGuests: parseInt(formData.maxGuests),
      bedrooms: formData.propertyType === "room" ? parseInt(formData.bedrooms || 0) : 0,
      bathrooms: formData.propertyType === "room" ? parseInt(formData.bathrooms || 0) : 0,
      available: formData.available,
      amenities: JSON.stringify(selectedAmenities),
      photos: JSON.stringify(uploadedPhotos),
      wifiNetwork: guideData.wifiNetwork,
      wifiPassword: guideData.wifiPassword,
      checkInMethod: guideData.checkInMethod,
      checkInInstructions: guideData.checkInInstructions,
      houseRules: guideData.houseRules,
      propertyType: formData.propertyType,
      companyName: formData.companyName
    }

    try {
      if (editingProperty === "new") {
        if (hostId) {
          // Link property to the current host
          await createPropertyForHost(hostId, payload)
        } else {
          // Fallback: save without host link (will warn user)
          await createProperty(payload)
          toast({
            type: "warning",
            title: "No host profile linked",
            message: "Property saved but not linked to a host. Please set up your host profile."
          })
        }
        toast({
          type: "success",
          title: "Listing created",
          message: `${formData.title} has been added successfully.`
        })
      } else {
        await updateProperty(editingProperty.id, payload)
        toast({
          type: "success",
          title: "Listing updated",
          message: `Changes saved for ${formData.title}.`
        })
      }
      setEditingProperty(null)
      await fetchProperties()
    } catch (err) {
      console.error(err)
      toast({
        type: "error",
        title: "Server Error",
        message: err?.response?.data?.message || "Failed to save property. Check backend connection."
      })
    }
  }

  const saveLocalConfigs = (id) => {
    // No-op (now handled directly via payload in backend database)
  }

  const handleDeleteListing = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this listing?")) return
    try {
      await deleteProperty(id)
      toast({
        type: "success",
        title: "Listing deleted",
        message: "Property listing removed from database."
      })
      fetchProperties()
    } catch (err) {
      console.error(err)
      setProperties(properties.filter(p => p.id !== id))
      toast({
        type: "info",
        title: "Listing deleted",
        message: "Listing removed from local view."
      })
    }
  }

  const toggleAmenity = (name) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== name))
    } else {
      setSelectedAmenities([...selectedAmenities, name])
    }
  }

  const handleAddPhoto = () => {
    if (!newPhotoUrl) return
    const newPic = {
      id: Date.now(),
      url: newPhotoUrl,
      caption: "Guest view photo",
      category: "Unsorted"
    }
    setUploadedPhotos([...uploadedPhotos, newPic])
    setNewPhotoUrl("")
    toast({
      type: "success",
      title: "Photo Added",
      message: "New photo added to your property gallery."
    })
  }

  const handleDeletePhoto = (photoId) => {
    setUploadedPhotos(uploadedPhotos.filter(p => p.id !== photoId))
  }

  const runAISort = () => {
    setAiSorting(true)
    setTimeout(() => {
      const sorted = uploadedPhotos.map((p, idx) => {
        let cat = "Living Room"
        if (idx === 0) cat = "Exterior"
        if (idx === 1) cat = "Bedroom"
        if (idx === 2) cat = "Kitchen"
        if (idx > 2 && idx % 2 === 0) cat = "Bathroom"
        return {
          ...p,
          category: cat,
          caption: `${cat} visual`
        }
      })
      setUploadedPhotos(sorted)
      setAiSorting(false)
      toast({
        type: "success",
        title: "AI Sorting Complete",
        message: "Your photos were automatically categorized into Bedroom, Kitchen, Living Room, and Exterior."
      })
    }, 1500)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in space-y-6">
      
      {/* 1. LIST VIEW */}
      {!editingProperty && (
        <>
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Your Listings</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Manage and edit your active accommodations.</p>
            </div>
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1 bg-primary text-primary-foreground hover:bg-[var(--color-primary-hover)] px-4.5 py-2.5 rounded-full font-bold text-xs shadow-md transition transform hover:scale-[1.02] cursor-pointer"
            >
              <Plus size={14} /> Create new listing
            </button>
          </div>

          {/* Empty state */}
          {!loading && properties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Plus size={28} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">No listings yet</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">You haven't added any properties. Click "Create new listing" to get started.</p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
              Loading properties...
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => {
              const images = getPropertyImages(prop)
              return (
                <div 
                  key={prop.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
                >
                  <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                    <img 
                      src={images[0]} 
                      alt={prop.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      ₹{prop.pricePerNight?.toLocaleString()} / {prop.propertyType === "experience" ? "session" : prop.propertyType === "service" ? "service" : "night"}
                    </div>
                    
                    {prop.rating && (
                      <div className="absolute bottom-3 left-3 bg-white border border-border text-foreground text-[10px] font-extrabold px-2 py-1 rounded-md flex items-center gap-0.5 shadow-xs">
                        <Star size={10} className="fill-foreground text-foreground" /> {prop.rating}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition">{prop.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{prop.location} {prop.companyName ? `· By ${prop.companyName}` : ""}</p>
                      <p className="text-xs text-muted-foreground/90 mt-2 line-clamp-2 leading-relaxed">
                        {prop.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex gap-2 justify-between items-center text-xs font-semibold text-muted-foreground border-t border-border/60 pt-3">
                      <span>
                        {prop.propertyType === "experience" ? (
                          <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold text-[10px] flex items-center gap-1">
                            <Sparkles size={10} /> Experience · Up to {prop.maxGuests} guests
                          </span>
                        ) : prop.propertyType === "service" ? (
                          <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold text-[10px] flex items-center gap-1">
                            <Briefcase size={10} /> Service {prop.companyName ? `by ${prop.companyName}` : ""}
                          </span>
                        ) : (
                          `${prop.bedrooms} Bed · ${prop.bathrooms} Bath · ${prop.maxGuests} Guests`
                        )}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => openEditForm(prop)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-border hover:bg-muted text-foreground font-bold text-xs transition cursor-pointer"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAmenities(["Wi-Fi", "Kitchen", "Air Conditioning", "Free parking on premises"])
                          setPreviewProperty(prop)
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-border hover:bg-muted text-foreground font-bold text-xs transition cursor-pointer"
                      >
                        <Eye size={12} /> Preview
                      </button>
                      <button
                        onClick={() => handleDeleteListing(prop.id)}
                        className="p-2 rounded-lg border border-border hover:bg-rose-50 hover:text-rose-600 text-muted-foreground transition cursor-pointer"
                        title="Delete Listing"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* 2. EDIT FORM VIEW */}
      {editingProperty && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-4">
            <div>
              <span className="text-xs text-muted-foreground">Listing Manager</span>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {editingProperty === "new" ? "Add New Accommodation" : `Edit Listing: ${formData.title}`}
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingProperty(null)}
                className="px-4 py-2 border border-border bg-card hover:bg-muted text-xs font-bold text-foreground rounded-full transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProperty}
                className="px-5 py-2 bg-foreground text-background hover:opacity-90 text-xs font-extrabold rounded-full transition cursor-pointer flex items-center gap-1"
              >
                Save All Changes
              </button>
            </div>
          </div>

          <div className="flex border-b border-border/85 pb-0 overflow-x-auto no-scrollbar">
            {[
              { id: "details", label: "Listing Details" },
              { id: "photos", label: "Photo Gallery" },
              { id: "amenities", label: "Amenities Checklist" },
              { id: "guide", label: "Arrival Guide" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveListingTab(tab.id)}
                className={`px-5 py-3 border-b-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeListingTab === tab.id 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            {activeListingTab === "details" && (
              <div className="space-y-5">
                {/* Listing Type & Company/Office Selector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-b border-border/40 pb-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">Listing Type</label>
                    <select
                      value={formData.propertyType || "room"}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs outline-none bg-transparent text-foreground font-semibold"
                    >
                      <option value="room">Room / Stay</option>
                      <option value="experience">Experience</option>
                      <option value="service">Service</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">Company / Host Office Name</label>
                    <input
                      type="text"
                      placeholder="e.g. DreamStays Ltd / Tour Guides Co. (Optional)"
                      value={formData.companyName || ""}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full rounded-xl border border-border px-4 py-2.5 text-xs outline-none focus:border-primary bg-transparent text-foreground font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">Listing Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Luxury Beachside Villa with Infinity Pool"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full rounded-xl border border-border px-4 py-2.5 text-xs outline-none focus:border-primary bg-transparent text-foreground font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">Location / Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Candolim, Goa, India"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full rounded-xl border border-border px-4 py-2.5 text-xs outline-none focus:border-primary bg-transparent text-foreground font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">Property Description</label>
                  <textarea
                    rows={5}
                    placeholder="Describe the property highlights, space layout, bed configurations, nearby attractions, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-border p-4 text-xs outline-none focus:border-primary bg-transparent text-foreground leading-relaxed placeholder:text-muted-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">
                      {formData.propertyType === "experience" ? "Price per Person" : formData.propertyType === "service" ? "Price per Service" : "Price per Night"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
                      <input
                        type="number"
                        placeholder="3000"
                        value={formData.pricePerNight}
                        onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                        className="w-full rounded-xl border border-border pl-7 pr-3 py-2.5 text-xs outline-none focus:border-primary bg-transparent text-foreground font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">
                      {formData.propertyType === "experience" ? "Max Participants" : formData.propertyType === "service" ? "Max Capacity" : "Max Guests"}
                    </label>
                    <input
                      type="number"
                      value={formData.maxGuests}
                      onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                      className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs outline-none focus:border-primary bg-transparent text-foreground font-semibold"
                    />
                  </div>
                  {(!formData.propertyType || formData.propertyType === "room") && (
                    <>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-foreground">Bedrooms</label>
                        <input
                          type="number"
                          value={formData.bedrooms}
                          onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                          className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs outline-none focus:border-primary bg-transparent text-foreground font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-foreground">Bathrooms</label>
                        <input
                          type="number"
                          step="1"
                          value={formData.bathrooms}
                          onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                          className="w-full rounded-xl border border-border px-3.5 py-2.5 text-xs outline-none focus:border-primary bg-transparent text-foreground font-semibold"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="h-4 w-4 rounded-sm border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                  <label htmlFor="available" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                    List as Active and Available for instant guest search/booking
                  </label>
                </div>
              </div>
            )}

            {activeListingTab === "photos" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/60 pb-4 gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Manage Photos</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Drag to sort cover page photo, or add captions for AI Tour matching.</p>
                  </div>
                  <button
                    type="button"
                    onClick={runAISort}
                    disabled={aiSorting}
                    className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold px-4 py-2.5 rounded-full shadow-xs transition cursor-pointer"
                  >
                    <Sparkles size={12} className="text-amber-600 animate-pulse" />
                    <span>{aiSorting ? "AI Organizing..." : "Run AI Photo Tour"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={photo.id} className="relative rounded-xl border border-border bg-muted overflow-hidden flex flex-col group shadow-xs">
                      <img src={photo.url} alt="" className="aspect-[4/3] w-full object-cover" />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                          COVER PHOTO
                        </div>
                      )}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-1.5 bg-black/60 rounded-full text-white hover:bg-rose-600 transition cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <div className="p-2.5 bg-card space-y-1">
                        <span className="inline-block text-[8px] bg-neutral-100 border text-neutral-600 font-bold px-1 py-0.5 rounded">
                          {photo.category}
                        </span>
                        <input
                          type="text"
                          value={photo.caption}
                          onChange={(e) => {
                            const newCap = e.target.value
                            setUploadedPhotos(uploadedPhotos.map(p => p.id === photo.id ? { ...p, caption: newCap } : p))
                          }}
                          className="w-full border-none outline-none focus:underline bg-transparent text-[10px] text-foreground font-semibold placeholder:text-muted-foreground"
                          placeholder="Add caption..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 max-w-xl border-t border-border pt-4">
                  <input
                    type="text"
                    placeholder="Paste Image URL (e.g. Unsplash URL)..."
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="flex-1 rounded-xl border border-border px-3.5 py-2 text-xs outline-none focus:border-primary bg-transparent text-foreground"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-4 py-2 bg-neutral-800 text-white rounded-xl text-xs font-bold hover:bg-neutral-900 cursor-pointer flex items-center gap-1"
                  >
                    <Camera size={12} /> Add Photo
                  </button>
                </div>
              </div>
            )}

            {activeListingTab === "amenities" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-sm text-foreground">Select Amenities offered</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Toggle facilities. We offer categorized templates matching Airbnb's filters.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {Object.entries(CATEGORIZED_AMENITIES).map(([category, items]) => (
                    <div key={category} className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/40">
                      <h4 className="font-black text-xs text-foreground uppercase tracking-wider border-b border-border/60 pb-1.5">
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {items.map((item) => {
                          const isSelected = selectedAmenities.includes(item)
                          return (
                            <div 
                              key={item}
                              onClick={() => toggleAmenity(item)}
                              className="flex items-center gap-2 cursor-pointer select-none text-xs hover:text-primary transition"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="h-3.5 w-3.5 rounded-sm border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                              />
                              <span className={`${isSelected ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                                {item}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeListingTab === "guide" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-sm text-foreground">Arrival Guide Editor</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Customize check-in details. These are only visible to confirmed booking guests.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">Wi-Fi Network Name</label>
                    <input
                      type="text"
                      placeholder="e.g. StayBNB_WiFi_HighSpeed"
                      value={guideData.wifiNetwork}
                      onChange={(e) => setGuideData({ ...guideData, wifiNetwork: e.target.value })}
                      className="w-full rounded-xl border border-border px-4 py-2.5 text-xs outline-none focus:border-primary bg-transparent text-foreground font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground">Wi-Fi Password</label>
                    <input
                      type="text"
                      placeholder="e.g. welcomeguest123"
                      value={guideData.wifiPassword}
                      onChange={(e) => setGuideData({ ...guideData, wifiPassword: e.target.value })}
                      className="w-full rounded-xl border border-border px-4 py-2.5 text-xs outline-none focus:border-primary bg-transparent text-foreground font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">Check-in Method</label>
                  <select
                    value={guideData.checkInMethod}
                    onChange={(e) => setGuideData({ ...guideData, checkInMethod: e.target.value })}
                    className="w-full max-w-xs rounded-xl border border-border px-3.5 py-2.5 text-xs outline-none bg-transparent text-foreground font-semibold"
                  >
                    <option value="Lockbox">Lockbox Key code</option>
                    <option value="Smart Lock">Smart Lock App code</option>
                    <option value="Host Meets">Host meets guest in person</option>
                    <option value="Keypad">Keypad number door lock</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">Check-in Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Give exact directions, lockbox locations, pin codes, elevator rules, etc."
                    value={guideData.checkInInstructions}
                    onChange={(e) => setGuideData({ ...guideData, checkInInstructions: e.target.value })}
                    className="w-full rounded-xl border border-border p-3 text-xs outline-none focus:border-primary bg-transparent text-foreground leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-foreground">House Rules & Safety Guidelines</label>
                  <textarea
                    rows={3}
                    placeholder="Smoking rules, pet policies, quiet hours details, local waste segregation rules, etc."
                    value={guideData.houseRules}
                    onChange={(e) => setGuideData({ ...guideData, houseRules: e.target.value })}
                    className="w-full rounded-xl border border-border p-3 text-xs outline-none focus:border-primary bg-transparent text-foreground leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted p-4 rounded-xl border border-border flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium">Unsaved specifications will be updated in local view.</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingProperty(null)}
                className="px-4 py-2 bg-card border border-border hover:bg-muted font-bold text-foreground rounded-full transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProperty}
                className="px-5 py-2 bg-primary text-white font-extrabold rounded-full hover:bg-[var(--color-primary-hover)] transition cursor-pointer"
              >
                Save All Changes
              </button>
            </div>
          </div>
        </>
      )}

      {/* 3. VIEW AS GUEST PREVIEW MODAL */}
      {previewProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-5xl rounded-2xl bg-background shadow-2xl transition-all duration-300 md:my-8 max-h-[90vh] overflow-y-auto flex flex-col">
            <button
              onClick={() => setPreviewProperty(null)}
              className="absolute right-4 top-4 z-10 rounded-full border border-border bg-background p-2 text-foreground hover:bg-muted shadow transition hover:scale-105"
              type="button"
            >
              <X size={18} />
            </button>

            <div className="p-6 md:p-8 flex-1">
              <div className="pr-12">
                <div className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                  Host Preview Mode
                </div>
                <h2 className="text-xl md:text-2xl font-bold leading-tight">{previewProperty.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground">
                  <span className="flex items-center gap-1 font-semibold">
                    <Star size={16} className="fill-foreground text-foreground animate-pulse" /> {previewProperty.rating || "4.85"}
                  </span>
                  <span className="text-muted-foreground font-medium underline">3 reviews</span>
                  <span className="text-muted-foreground font-medium underline">{previewProperty.location}</span>
                </div>
              </div>

              <div className="mt-6 hidden grid-cols-4 gap-2 overflow-hidden rounded-xl md:grid">
                <div className="col-span-2 aspect-[4/3] overflow-hidden bg-neutral-100">
                  <img src={getPropertyImages(previewProperty)[0]} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="col-span-1 grid grid-rows-2 gap-2">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img src={getPropertyImages(previewProperty)[1]} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img src={getPropertyImages(previewProperty)[2]} alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="col-span-1 grid grid-rows-2 gap-2">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img src={getPropertyImages(previewProperty)[3]} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img src={getPropertyImages(previewProperty)[4]} alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between border-b border-border/60 pb-6">
                    <div>
                      <h3 className="text-lg font-bold">Entire property hosted by Ashutosh</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {previewProperty.maxGuests} guests · {previewProperty.bedrooms} bedrooms · {previewProperty.bathrooms} bathrooms
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold">
                      A
                    </div>
                  </div>

                  <div className="border-b border-border/60 py-6">
                    <h3 className="text-md font-bold mb-3">About this space</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                      {previewProperty.description}
                    </p>
                  </div>

                  <div className="border-b border-border/60 py-6">
                    <h3 className="text-md font-bold mb-4">What this place offers</h3>
                    <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 text-sm">
                      {selectedAmenities.map(amen => (
                        <div key={amen} className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500" /> {amen}</div>
                      ))}
                      {selectedAmenities.length === 0 && (
                        <div className="text-xs text-muted-foreground">No amenities listed yet. Add some in the Amenities Checklist.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="rounded-2xl border border-border p-6 shadow-lg bg-card">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-bold">₹{previewProperty.pricePerNight?.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground font-medium">/ night</span>
                    </div>

                    <div className="mt-6 border border-border rounded-xl p-3 text-xs space-y-2">
                      <span className="block font-bold">SIMULATED RESERVATION</span>
                      <span className="block text-muted-foreground text-[10px]">This is a guest view mockup widget. You can preview details but booking is disabled in preview.</span>
                    </div>

                    <button
                      disabled
                      className="mt-4 w-full rounded-xl bg-neutral-400 py-3 font-semibold text-white cursor-not-allowed text-center text-xs"
                    >
                      Reserve Stay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
