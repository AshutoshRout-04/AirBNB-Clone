import { createContext, useContext, useState, useEffect } from "react"
import { Mail, X } from "lucide-react"
import { useToast } from "./Toast"

// 1. Create Authentication Context
const AuthContext = createContext(null)

// 2. Custom Hook to consume Authentication
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// 3. Provider Component
export function AuthProvider({ children }) {
  const toast = useToast()

  // Load initial user state from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("staybnb_user")
    return saved ? JSON.parse(saved) : null
  })

  // Modal open state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const openLogin = () => setIsLoginModalOpen(true)
  const closeLogin = () => setIsLoginModalOpen(false)

  const login = (email) => {
    // For mockup purposes, we log the user in as "Asif" with role "Guest"
    const loggedUser = {
      name: "Asif",
      email: email || "asif***9@gmail.com",
      role: "Guest",
      avatar: null,
    }
    setUser(loggedUser)
    localStorage.setItem("staybnb_user", JSON.stringify(loggedUser))
    
    // Dispatch custom event to notify external non-context components (if any)
    window.dispatchEvent(new CustomEvent("auth-change", { detail: loggedUser }))

    toast({
      type: "success",
      title: "Welcome back!",
      message: `Logged in successfully as ${loggedUser.name}.`,
    })
    closeLogin()
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("staybnb_user")
    
    window.dispatchEvent(new CustomEvent("auth-change", { detail: null }))

    toast({
      type: "info",
      title: "Logged out",
      message: "You have been signed out of staybnb.",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoginModalOpen,
        openLogin,
        closeLogin,
        login,
        logout,
      }}
    >
      {children}
      <LoginModal />
    </AuthContext.Provider>
  )
}

// 4. Login Modal UI Component
function LoginModal() {
  const { isLoginModalOpen, closeLogin, login } = useAuth()
  const [step, setStep] = useState(1)
  const [inputValue, setInputValue] = useState("")

  // Reset modal states when it closes/opens
  useEffect(() => {
    if (!isLoginModalOpen) {
      // Small timeout to avoid flicker during closing animation
      const timer = setTimeout(() => {
        setStep(1)
        setInputValue("")
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isLoginModalOpen])

  if (!isLoginModalOpen) return null

  const handleContinue = (e) => {
    e.preventDefault()
    // Go to welcome step if something is typed, else fallback to standard
    if (inputValue.trim()) {
      setStep(2)
    } else {
      setStep(2)
      setInputValue("asif***9@gmail.com") // fallback default
    }
  }

  const handleSocialClick = () => {
    setInputValue("asif***9@gmail.com")
    setStep(2)
  }

  const handleLoginSubmit = () => {
    // Perform final login
    login(inputValue)
  }

  // Mask email helper for display
  const getMaskedValue = () => {
    if (!inputValue) return "A***9@gmail.com"
    if (inputValue.includes("@")) {
      const [local, domain] = inputValue.split("@")
      if (local.length > 2) {
        return `${local.charAt(0)}***${local.charAt(local.length - 1)}@${domain}`
      }
      return `${local.charAt(0)}***@${domain}`
    }
    // Mask phone number
    if (inputValue.length > 4) {
      return `${inputValue.slice(0, 2)}******${inputValue.slice(-2)}`
    }
    return inputValue
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      {/* Modal Dialog */}
      <div className="bg-white w-full max-w-[480px] rounded-[32px] p-8 shadow-2xl relative border border-gray-100 transform transition-all duration-300 scale-100 animate-fade-in flex flex-col justify-between">
        
        {/* Close Button */}
        <button
          onClick={closeLogin}
          aria-label="Close modal"
          className="absolute top-6 right-6 text-gray-500 hover:text-black hover:bg-gray-100 p-2 rounded-full transition cursor-pointer select-none active:scale-90"
        >
          <X size={18} className="stroke-[2.5]" />
        </button>

        {/* STEP 1: Log in or sign up */}
        {step === 1 && (
          <div className="w-full">
            {/* Airbnb Coral Logo */}
            <div className="flex justify-center mb-6 text-primary">
              <svg viewBox="0 0 32 32" width="36" height="36" fill="currentColor" aria-hidden="true" className="shrink-0">
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.853-6.964 6.853-2.435 0-4.83-1.184-7.144-3.502l-.42-.434-.421.434C12.235 30.616 9.841 31.8 7.4 31.8 3.318 31.8.44 29.01.44 24.945l.002-.646c.05-.924.292-1.805.96-3.396l.144-.353c.987-2.296 5.147-11.006 7.1-14.836l.534-1.025C10.537 1.963 11.992 1 14 1h2zm0 2.652h-2c-1.022 0-1.694.41-2.426 1.617l-.4.683c-1.91 3.74-6.04 12.388-6.99 14.6l-.265.638c-.4.987-.526 1.564-.526 2.153 0 2.696 1.79 4.5 4.32 4.5 1.85 0 3.748-1.018 5.622-3.044C13.7 24.4 12.36 21.668 12.36 19c0-2.832 1.85-4.84 3.64-4.84 1.79 0 3.64 2.008 3.64 4.84 0 2.668-1.34 5.4-3.6 7.96 1.874 2.026 3.772 3.044 5.622 3.044 2.53 0 4.32-1.804 4.32-4.5 0-.59-.126-1.166-.526-2.153l-.265-.638c-.95-2.212-5.08-10.86-6.99-14.6l-.4-.683C17.694 4.062 17.022 3.652 16 3.652z" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 text-center mb-6 leading-tight">Log in or sign up</h3>

            <form onSubmit={handleContinue} className="space-y-4">
              <div className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-black/10 focus-within:border-black transition duration-200">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Phone number or email"
                  className="w-full text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition cursor-pointer select-none"
              >
                Continue
              </button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center my-6 w-full">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-[11px] text-gray-400 font-bold uppercase tracking-wider bg-white">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Social Logins */}
            <div className="flex items-center justify-center gap-4">
              {/* Google Button */}
              <button
                onClick={handleSocialClick}
                className="flex-1 flex items-center justify-center border border-gray-300 hover:border-gray-400 rounded-xl py-3 hover:bg-gray-50 active:scale-[0.97] transition cursor-pointer shadow-sm"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              </button>

              {/* Apple Button */}
              <button
                onClick={handleSocialClick}
                className="flex-1 flex items-center justify-center border border-gray-300 hover:border-gray-400 rounded-xl py-3 hover:bg-gray-50 active:scale-[0.97] transition cursor-pointer shadow-sm"
              >
                <svg className="h-5 w-5 fill-current text-black" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.98.12.01 2.32-.61 2.98-1.42z"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Welcome back, Asif */}
        {step === 2 && (
          <div className="w-full text-center">
            {/* Pink Avatar */}
            <div className="h-16 w-16 rounded-full bg-[#fae2f5] text-[#8e2e7b] text-2xl font-bold flex items-center justify-center mx-auto mb-4 select-none">
              A
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Asif</h3>

            {/* Email with mail icon */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50/80 border border-gray-100 text-sm text-gray-700 font-semibold mb-6">
              <Mail size={15} className="text-gray-500" />
              <span>{getMaskedValue()}</span>
            </div>

            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6 max-w-[280px] mx-auto">
              We may email or text you a code to log you in.
            </p>

            {/* Login CTA */}
            <button
              onClick={handleLoginSubmit}
              className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition cursor-pointer select-none mb-3"
            >
              Log in
            </button>

            {/* Not you? */}
            <button
              onClick={() => setStep(1)}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 text-sm font-bold py-3.5 rounded-xl shadow-sm transition active:scale-[0.98] cursor-pointer select-none"
            >
              Not you?
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
