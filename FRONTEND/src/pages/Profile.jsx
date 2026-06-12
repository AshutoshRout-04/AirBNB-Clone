import { useState, useEffect } from "react"
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
import { useAuth } from "../components/LoginModal"

export default function Profile() {
  const navigate = useNavigate()
  const { user, isLoggedIn, openLogin } = useAuth()

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

  // Synchronize profile name with logged-in user
  useEffect(() => {
    if (user && user.name) {
      setProfile((prev) => ({
        ...prev,
        name: user.name,
      }))
    }
  }, [user])

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

        {/* Main Content Layout (Conditional based on auth) */}
        {isLoggedIn ? (
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
        ) : (
          <main className="mx-auto max-w-md px-4 py-24 text-center">
            <div className="bg-white rounded-[32px] border border-gray-200 shadow-md p-8 flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-pink-50 text-primary flex items-center justify-center mb-6">
                <svg viewBox="0 0 32 32" width="32" height="32" fill="currentColor">
                  <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.853-6.964 6.853-2.435 0-4.83-1.184-7.144-3.502l-.42-.434-.421.434C12.235 30.616 9.841 31.8 7.4 31.8 3.318 31.8.44 29.01.44 24.945l.002-.646c.05-.924.292-1.805.96-3.396l.144-.353c.987-2.296 5.147-11.006 7.1-14.836l.534-1.025C10.537 1.963 11.992 1 14 1h2zm0 2.652h-2c-1.022 0-1.694.41-2.426 1.617l-.4.683c-1.91 3.74-6.04 12.388-6.99 14.6l-.265.638c-.4.987-.526 1.564-.526 2.153 0 2.696 1.79 4.5 4.32 4.5 1.85 0 3.748-1.018 5.622-3.044C13.7 24.4 12.36 21.668 12.36 19c0-2.832 1.85-4.84 3.64-4.84 1.79 0 3.64 2.008 3.64 4.84 0 2.668-1.34 5.4-3.6 7.96 1.874 2.026 3.772 3.044 5.622 3.044 2.53 0 4.32-1.804 4.32-4.5 0-.59-.126-1.166-.526-2.153l-.265-.638c-.95-2.212-5.08-10.86-6.99-14.6l-.4-.683C17.694 4.062 17.022 3.652 16 3.652z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Log in to view your profile</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                You can edit your details, view your connections, and see your past trips once you log in.
              </p>
              <button
                onClick={openLogin}
                className="bg-primary hover:bg-primary-hover text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition cursor-pointer select-none"
              >
                Log in
              </button>
            </div>
          </main>
        )}
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
