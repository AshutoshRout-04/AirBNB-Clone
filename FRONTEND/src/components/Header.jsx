import { useState, useEffect, useRef } from "react"
import { Search, Globe, Menu, User, Calendar, Heart, Shield, HelpCircle, Settings, MessageSquare, Bell, LogOut, Users, UserPlus } from "lucide-react"
import { useToast } from "./Toast"

export default function Header({
  onOpenHostModal,
  onOpenBookingsDrawer,
  onFocusSearch,
  onToggleWishlist,
  showWishlistOnly,
}) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)
  const toast = useToast()

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-primary hover:opacity-90">
          <svg viewBox="0 0 32 32" width="32" height="32" fill="currentColor" aria-hidden="true" className="shrink-0">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.853-6.964 6.853-2.435 0-4.83-1.184-7.144-3.502l-.42-.434-.421.434C12.235 30.616 9.841 31.8 7.4 31.8 3.318 31.8.44 29.01.44 24.945l.002-.646c.05-.924.292-1.805.96-3.396l.144-.353c.987-2.296 5.147-11.006 7.1-14.836l.534-1.025C10.537 1.963 11.992 1 14 1h2zm0 2.652h-2c-1.022 0-1.694.41-2.426 1.617l-.4.683c-1.91 3.74-6.04 12.388-6.99 14.6l-.265.638c-.4.987-.526 1.564-.526 2.153 0 2.696 1.79 4.5 4.32 4.5 1.85 0 3.748-1.018 5.622-3.044C13.7 24.4 12.36 21.668 12.36 19c0-2.832 1.85-4.84 3.64-4.84 1.79 0 3.64 2.008 3.64 4.84 0 2.668-1.34 5.4-3.6 7.96 1.874 2.026 3.772 3.044 5.622 3.044 2.53 0 4.32-1.804 4.32-4.5 0-.59-.126-1.166-.526-2.153l-.265-.638c-.95-2.212-5.08-10.86-6.99-14.6l-.4-.683C17.694 4.062 17.022 3.652 16 3.652z" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-primary hidden sm:block">staybnb</span>
        </a>

        {/* Center Search Pill */}
        <button
          onClick={onFocusSearch}
          className="flex items-center divide-x divide-border rounded-full border border-border px-2 py-1.5 shadow-sm hover:shadow-md transition cursor-pointer bg-card"
        >
          <span className="px-3 text-xs font-semibold">Anywhere</span>
          <span className="px-3 text-xs font-semibold hidden md:inline">Any week</span>
          <span className="px-3 text-xs text-muted-foreground hidden lg:inline">Add guests</span>
          <span className="ml-1.5 rounded-full bg-primary p-1.5 text-primary-foreground">
            <Search size={12} className="stroke-[3]" />
          </span>
        </button>

        {/* Right: Switch to hosting | Avatar | Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenHostModal}
            className="rounded-full px-3.5 py-2 text-xs font-bold hover:bg-muted text-foreground cursor-pointer hidden sm:block"
          >
            Switch to hosting
          </button>

          {/* Beige avatar circle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fdecd2] text-[#784e1b] font-bold text-sm border border-[#f3d9b4] shadow-sm hover:shadow transition"
            type="button"
            onClick={() => toast({ type: "info", title: "Profile", message: "Logged in as Ashutosh Rout." })}
          >
            A
          </button>

          {/* Hamburger menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 hover:bg-muted text-foreground transition cursor-pointer"
              aria-label="User Menu"
            >
              <Menu size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-card py-2 shadow-xl z-50 text-left text-foreground">

                {/* Wishlists */}
                <button
                  onClick={() => { setShowMenu(false); onToggleWishlist() }}
                  className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-muted cursor-pointer ${showWishlistOnly ? "text-primary" : "text-foreground"}`}
                >
                  <Heart size={14} className={showWishlistOnly ? "fill-primary text-primary" : ""} />
                  <span>Wishlists {showWishlistOnly && <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">Active</span>}</span>
                </button>

                {/* Trips */}
                <button
                  onClick={() => { setShowMenu(false); onOpenBookingsDrawer() }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-muted text-foreground cursor-pointer"
                >
                  <Calendar size={14} />
                  <span>Trips</span>
                </button>

                {/* Messages */}
                <button
                  onClick={() => { setShowMenu(false); toast({ type: "info", title: "Messages", message: "No new messages in your inbox." }) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-muted text-foreground cursor-pointer"
                >
                  <MessageSquare size={14} />
                  <span>Messages</span>
                </button>

                {/* Profile */}
                <button
                  onClick={() => { setShowMenu(false); toast({ type: "info", title: "Profile", message: "Logged in as Ashutosh Rout." }) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-muted text-foreground cursor-pointer"
                >
                  <User size={14} />
                  <span>Profile</span>
                </button>

                <div className="border-t border-border/60 my-1" />

                {/* Notifications */}
                <button
                  onClick={() => { setShowMenu(false); toast({ type: "success", title: "Notifications", message: "You're all caught up! No new notifications." }) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs hover:bg-muted text-foreground/80 cursor-pointer"
                >
                  <Bell size={14} />
                  <span>Notifications</span>
                </button>

                {/* Account Settings */}
                <button
                  onClick={() => { setShowMenu(false); toast({ type: "info", title: "Account settings", message: "Configuration is managed by your administrator." }) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs hover:bg-muted text-foreground/80 cursor-pointer"
                >
                  <Settings size={14} />
                  <span>Account settings</span>
                </button>

                {/* Languages & Currency */}
                <button
                  onClick={() => { setShowMenu(false); toast({ type: "info", title: "Language & Currency", message: "Language: English (IN) · Currency: INR (₹)" }) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs hover:bg-muted text-foreground/80 cursor-pointer"
                >
                  <Globe size={14} />
                  <span>Languages &amp; currency</span>
                </button>

                {/* Help Centre */}
                <button
                  onClick={() => { setShowMenu(false); toast({ type: "info", title: "Help Centre", message: "Contact us at support@staybnb.com for assistance." }) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs hover:bg-muted text-foreground/80 cursor-pointer"
                >
                  <HelpCircle size={14} />
                  <span>Help Centre</span>
                </button>

                <div className="border-t border-border/60 my-1" />

                {/* Become a Host — with illustration */}
                <div className="px-1.5 py-1">
                  <button
                    onClick={() => { setShowMenu(false); onOpenHostModal() }}
                    className="flex w-full items-center justify-between gap-2 rounded-lg bg-muted/40 p-2.5 text-left hover:bg-muted transition text-foreground cursor-pointer"
                  >
                    <div className="max-w-[70%]">
                      <span className="block text-xs font-bold">Become a host</span>
                      <span className="block text-[10px] text-muted-foreground leading-tight mt-0.5">
                        It&apos;s easy to start hosting and earn extra income.
                      </span>
                    </div>
                    <svg width="28" height="36" viewBox="0 0 30 40">
                      <circle cx="15" cy="8" r="4.5" fill="#fbc531" />
                      <path d="M10,14 Q15,12 20,14 L18,25 L12,25 Z" fill="#eb4d4b" />
                      <path d="M12,25 L11,36 L14,36 L14,26 Z" fill="#2f3542" />
                      <path d="M18,25 L19,36 L16,36 L16,26 Z" fill="#2f3542" />
                      <path d="M8,15 C9,17 11,21 12,22" stroke="#fbc531" strokeWidth="1.5" fill="none" />
                      <path d="M22,15 C21,17 19,21 18,22" stroke="#fbc531" strokeWidth="1.5" fill="none" />
                    </svg>
                  </button>
                </div>

                {/* Refer a Host */}
                <button
                  onClick={() => { setShowMenu(false); toast({ type: "success", title: "Refer a host", message: "Your referral link has been copied to clipboard!" }) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs hover:bg-muted text-foreground/80 cursor-pointer"
                >
                  <UserPlus size={14} />
                  <span>Refer a host</span>
                </button>

                {/* Find a co-host */}
                <button
                  onClick={() => { setShowMenu(false); toast({ type: "info", title: "Find a co-host", message: "Browse experienced co-hosts in your neighbourhood." }) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs hover:bg-muted text-foreground/80 cursor-pointer"
                >
                  <Users size={14} />
                  <span>Find a co-host</span>
                </button>

                <div className="border-t border-border/60 my-1" />

                {/* Log out */}
                <button
                  onClick={() => { setShowMenu(false); toast({ type: "warning", title: "Logged out", message: "You have been signed out of staybnb." }) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-muted text-primary cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
