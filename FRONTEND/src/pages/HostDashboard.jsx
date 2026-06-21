import { useState, useRef, useEffect } from "react"
import { Bell, MessageSquare, ChevronDown, Calendar as CalendarIcon, ClipboardList, TrendingUp, Sliders, LogOut } from "lucide-react"
import { useToast } from "../components/Toast"
import { getAllHosts } from "../services/HostService"
import TodayTab from "../components/host/TodayTab"
import CalendarTab from "../components/host/CalendarTab"
import ListingsTab from "../components/host/ListingsTab"
import MessagesTab from "../components/host/MessagesTab"
import MenuTab from "../components/host/MenuTab"
import { useAuth } from "../components/LoginModal"

export default function HostDashboard({ onSwitchToGuest }) {
  const toast = useToast()
  const { user } = useAuth()
  
  // Active Tab state: 'today' | 'calendar' | 'listings' | 'messages' | 'menu'
  const [activeTab, setActiveTab] = useState("today")
  const [currentHost, setCurrentHost] = useState(null)
  
  // On mount: load the stored host session. If not set, fetch hosts from backend
  // and use the first one (you can extend this with a login system later).
  useEffect(() => {
    const storedHostId = localStorage.getItem("staybnb_host_id")
    if (storedHostId) {
      setCurrentHost({ id: parseInt(storedHostId) })
    } else {
      // Attempt to auto-load hosts from backend
      getAllHosts()
        .then(res => {
          const hosts = res.data || []
          if (hosts.length > 0) {
            const host = hosts[0] // Use first available host
            localStorage.setItem("staybnb_host_id", host.id.toString())
            setCurrentHost(host)
          }
        })
        .catch(err => console.error("Could not load host profile:", err))
    }
  }, [])
  
  // States for prefilling messages from action tips in TodayTab
  const [prefillGuest, setPrefillGuest] = useState("")
  const [prefillMsg, setPrefillMsg] = useState("")

  // Menu toggles
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef(null)

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Transition helper from TodayTab -> Messages Tab with prefilled template
  const handleNavigateToMessage = (guestName, messageTemplate = "") => {
    setPrefillGuest(guestName)
    setPrefillMsg(messageTemplate)
    setActiveTab("messages")
    
    if (messageTemplate) {
      toast({
        type: "success",
        title: "Template prefilled",
        message: `Autotext preloaded in chat with ${guestName}.`
      })
    }
  }

  // General tab switcher helper
  const handleSwitchTab = (tabId) => {
    setActiveTab(tabId)
    // Clear prefilled message when switching tabs manually
    if (tabId !== "messages") {
      setPrefillGuest("")
      setPrefillMsg("")
    }
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col font-sans text-foreground">
      
      {/* 1. STICKY HOST HEADER */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Logo & hosting badge */}
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-1.5 text-primary hover:opacity-90">
              <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true" className="shrink-0">
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.853-6.964 6.853-2.435 0-4.83-1.184-7.144-3.502l-.42-.434-.421.434C12.235 30.616 9.841 31.8 7.4 31.8 3.318 31.8.44 29.01.44 24.945l.002-.646c.05-.924.292-1.805.96-3.396l.144-.353c.987-2.296 5.147-11.006 7.1-14.836l.534-1.025C10.537 1.963 11.992 1 14 1h2zm0 2.652h-2c-1.022 0-1.694.41-2.426 1.617l-.4.683c-1.91 3.74-6.04 12.388-6.99 14.6l-.265.638c-.4.987-.526 1.564-.526 2.153 0 2.696 1.79 4.5 4.32 4.5 1.85 0 3.748-1.018 5.622-3.044C13.7 24.4 12.36 21.668 12.36 19c0-2.832 1.85-4.84 3.64-4.84 1.79 0 3.64 2.008 3.64 4.84 0 2.668-1.34 5.4-3.6 7.96 1.874 2.026 3.772 3.044 5.622 3.044 2.53 0 4.32-1.804 4.32-4.5 0-.59-.126-1.166-.526-2.153l-.265-.638c-.95-2.212-5.08-10.86-6.99-14.6l-.4-.683C17.694 4.062 17.022 3.652 16 3.652z" />
              </svg>
              <span className="text-lg font-extrabold tracking-tight text-primary hidden md:block">staybnb</span>
            </a>
            <span className="bg-primary/10 text-primary text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider select-none">
              Hosting
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-muted-foreground">
            {[
              { id: "today", label: "Today" },
              { id: "calendar", label: "Calendar" },
              { id: "listings", label: "Listings" },
              { id: "messages", label: "Inbox", badge: true },
              { id: "menu", label: "Performance & Earnings" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleSwitchTab(item.id)}
                className={`px-4 py-2 rounded-full transition relative cursor-pointer ${
                  activeTab === item.id 
                    ? "bg-muted text-foreground font-extrabold" 
                    : "hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background animate-pulse" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Menu actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchToGuest}
              className="rounded-full px-4 py-2 border border-border text-xs font-bold hover:bg-muted text-foreground transition cursor-pointer hidden sm:block shadow-xs"
            >
              Switch to traveling
            </button>

            {/* Profile trigger */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 border border-border p-1.5 rounded-full hover:shadow transition cursor-pointer bg-card"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fdecd2] text-[#784e1b] font-bold text-xs border border-[#f3d9b4]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "H"}
                </div>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
 
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card py-2 shadow-xl z-50 text-left text-foreground">
                  <div className="px-4 py-2 border-b border-border/60">
                    <span className="block font-bold text-xs">{user?.name || "Host"}</span>
                    <span className="block text-[10px] text-muted-foreground">Host account</span>
                  </div>
                  
                  <button
                    onClick={() => { setShowProfileMenu(false); handleSwitchTab("menu") }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-muted text-foreground cursor-pointer"
                  >
                    <TrendingUp size={13} /> Performance stats
                  </button>

                  <button
                    onClick={() => { setShowProfileMenu(false); handleSwitchTab("listings") }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-muted text-foreground cursor-pointer"
                  >
                    <ClipboardList size={13} /> Listing controls
                  </button>

                  <button
                    onClick={() => { setShowProfileMenu(false); handleSwitchTab("menu") }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-muted text-foreground cursor-pointer"
                  >
                    <Sliders size={13} /> Hosting settings
                  </button>

                  <div className="border-t border-border/60 my-1" />

                  <button
                    onClick={() => { setShowProfileMenu(false); onSwitchToGuest() }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs font-bold text-primary hover:bg-muted cursor-pointer"
                  >
                    <LogOut size={13} /> Switch to traveling
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Mobile Nav sub-panel */}
        <div className="md:hidden border-t border-border/80 bg-background flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-muted-foreground border-b border-border">
          {[
            { id: "today", label: "Today", icon: ClipboardList },
            { id: "calendar", label: "Calendar", icon: CalendarIcon },
            { id: "listings", label: "Listings", icon: ClipboardList },
            { id: "messages", label: "Inbox", icon: MessageSquare, badge: true },
            { id: "menu", label: "Menu", icon: Sliders }
          ].map((item) => {
            const IconComp = item.icon
            const isSel = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleSwitchTab(item.id)}
                className={`flex-1 py-2.5 flex flex-col items-center gap-1 transition relative cursor-pointer ${
                  isSel ? "text-primary border-b-2 border-primary" : "hover:text-foreground"
                }`}
              >
                <IconComp size={15} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="absolute top-2.5 right-6 w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </header>

      {/* 2. MAIN CORE TAB VIEWS */}
      <main className="flex-1 max-w-7xl w-full mx-auto pb-16">
        {activeTab === "today" && (
          <TodayTab 
            onSwitchTab={handleSwitchTab} 
            onNavigateToMessage={handleNavigateToMessage} 
          />
        )}

        {activeTab === "calendar" && (
          <CalendarTab />
        )}

        {activeTab === "listings" && (
          <ListingsTab />
        )}

        {activeTab === "messages" && (
          <MessagesTab 
            prefilledGuestName={prefillGuest} 
            prefilledMessage={prefillMsg} 
          />
        )}

        {activeTab === "menu" && (
          <MenuTab />
        )}
      </main>

    </div>
  )
}
