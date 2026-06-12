import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  GraduationCap,
  Globe,
  Calendar,
  Music,
  Clock,
  Languages,
  Home as HomeIcon,
  Briefcase,
  PawPrint,
  Sparkles,
  Lightbulb,
  BookOpen,
  Heart,
} from "lucide-react"

import Header from "../components/Header"
import Footer from "../components/Footer"
import BecomeHostModal from "../components/BecomeHostModal"
import BookingsDrawer from "../components/BookingsDrawer"

import ProfileSidebar from "../components/profile/ProfileSidebar"
import ProfileAboutMeView from "../components/profile/ProfileAboutMeView"
import ProfileAboutMeEdit from "../components/profile/ProfileAboutMeEdit"
import ProfilePastTrips from "../components/profile/ProfilePastTrips"
import ProfileConnections from "../components/profile/ProfileConnections"

export default function Profile() {
  const navigate = useNavigate()

  // Tabs state
  const [activeTab, setActiveTab] = useState("about")
  const [isEditing, setIsEditing] = useState(false)

  // Modals state (to support header actions)
  const [showHostModal, setShowHostModal] = useState(false)
  const [showBookingsDrawer, setShowBookingsDrawer] = useState(false)

  // Profile data state
  const [profile, setProfile] = useState({
    name: "Asif",
    role: "Guest",
    avatar: null, // Custom image URL (from uploader)
    bio: "",
    prompts: {
      school: "",
      work: "",
      wantedToGo: "",
      pets: "",
      decadeBorn: "",
      uselessSkill: "",
      song: "",
      funFact: "",
      timeSpend: "",
      bioTitle: "",
      languages: "",
      obsessedWith: "",
      live: "",
    },
  })

  // Prompt configuration definitions (mapped to layout order)
  const leftPrompts = [
    { key: "school", label: "Where I went to school", icon: <GraduationCap size={18} /> },
    { key: "wantedToGo", label: "Where I've always wanted to go", icon: <Globe size={18} /> },
    { key: "decadeBorn", label: "Decade I was born", icon: <Calendar size={18} /> },
    { key: "song", label: "My favourite song in secondary school", icon: <Music size={18} /> },
    { key: "timeSpend", label: "I spend too much time", icon: <Clock size={18} /> },
    { key: "languages", label: "Languages I speak", icon: <Languages size={18} /> },
    { key: "live", label: "Where I live", icon: <HomeIcon size={18} /> },
  ]

  const rightPrompts = [
    { key: "work", label: "My work", icon: <Briefcase size={18} /> },
    { key: "pets", label: "Pets", icon: <PawPrint size={18} /> },
    { key: "uselessSkill", label: "My most useless skill", icon: <Sparkles size={18} /> },
    { key: "funFact", label: "My fun fact", icon: <Lightbulb size={18} /> },
    { key: "bioTitle", label: "My biography title would be", icon: <BookOpen size={18} /> },
    { key: "obsessedWith", label: "I'm obsessed with", icon: <Heart size={18} /> },
  ]

  // Combine configurations to access easily by key
  const promptConfigs = {}
  leftPrompts.forEach((p) => (promptConfigs[p.key] = p))
  rightPrompts.forEach((p) => (promptConfigs[p.key] = p))

  const handleSwitchToHost = () => {
    // Redirect to home and trigger host dashboard mode
    navigate("/")
    setTimeout(() => {
      // Small delay to let navigation complete before switching if needed
      const event = new CustomEvent("switch-host")
      window.dispatchEvent(event)
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between font-sans">
      <div>
        {/* Header */}
        <Header
          onSwitchToHost={handleSwitchToHost}
          onOpenHostModal={() => setShowHostModal(true)}
          onOpenBookingsDrawer={() => setShowBookingsDrawer(true)}
          onFocusSearch={() => navigate("/")}
          onToggleWishlist={() => navigate("/")}
          showWishlistOnly={false}
        />

        {/* Main Content Layout */}
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Sidebar Navigation */}
            <ProfileSidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab)
                setIsEditing(false) // Reset editing state on tab switch
              }}
              userName={profile.name}
            />

            {/* Dynamic Content Panel */}
            <div className="flex-1 w-full">
              {activeTab === "about" && (
                <>
                  {isEditing ? (
                    <ProfileAboutMeEdit
                      profile={profile}
                      onChangeProfile={setProfile}
                      onDone={() => setIsEditing(false)}
                      leftPrompts={leftPrompts}
                      rightPrompts={rightPrompts}
                    />
                  ) : (
                    <ProfileAboutMeView
                      profile={profile}
                      onEdit={() => setIsEditing(true)}
                      onGetStarted={() => setIsEditing(true)}
                      promptConfigs={promptConfigs}
                    />
                  )}
                </>
              )}

              {activeTab === "trips" && <ProfilePastTrips />}

              {activeTab === "connections" && <ProfileConnections />}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Become a Host Modal */}
      {showHostModal && (
        <BecomeHostModal
          onClose={() => setShowHostModal(false)}
          onPropertyAdded={() => {
            setShowHostModal(false)
            alert("Listing successfully added!")
          }}
        />
      )}

      {/* Bookings Drawer */}
      <BookingsDrawer
        isOpen={showBookingsDrawer}
        onClose={() => setShowBookingsDrawer(false)}
        properties={[]} // Mock drawer displays bookings
      />
    </div>
  )
}
