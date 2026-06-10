import { Globe } from "lucide-react"

// Social icons as inline SVG (lucide-react@1.x doesn't include these)
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}
function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}


const LINKS = {
  Support: ["Help Centre", "AirCover", "Anti-discrimination", "Disability support", "Cancellation options", "Report concern"],
  Community: ["staybnb.org", "Support Afghan refugees", "Combating discrimination", "Disaster relief housing"],
  Hosting: ["staybnb your home", "AirCover for Hosts", "Hosting resources", "Community forum", "Hosting responsibly", "Find a co-host"],
  "staybnb": ["Newsroom", "New features", "Careers", "Investors", "Gift cards", "Emergency stays"],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/60 text-sm">
      {/* Main grid */}
      <div className="mx-auto max-w-7xl grid grid-cols-2 gap-x-8 gap-y-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        {Object.entries(LINKS).map(([section, items]) => (
          <div key={section}>
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wide mb-4">{section}</h4>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-muted-foreground text-xs hover:text-foreground hover:underline transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          {/* Left: copyright + links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>© {year} staybnb, Inc.</span>
            <span className="hidden sm:inline">·</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground hover:underline">Privacy</a>
            <span>·</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground hover:underline">Terms</a>
            <span>·</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground hover:underline">Sitemap</a>
            <span>·</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground hover:underline">Company details</a>
          </div>

          {/* Right: Language + currency + socials */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button className="flex items-center gap-1.5 font-semibold text-foreground hover:underline cursor-pointer">
              <Globe size={14} />
              <span>English (IN)</span>
            </button>
            <button className="font-semibold text-foreground hover:underline cursor-pointer">₹ INR</button>

            <div className="flex items-center gap-3 ml-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-1.5 hover:bg-border transition text-foreground"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-1.5 hover:bg-border transition text-foreground"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-1.5 hover:bg-border transition text-foreground"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}