import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Home } from "lucide-react"
import { useAuth } from "../components/LoginModal"
import { useToast } from "../components/Toast"
import { registerUser } from "../services/UserService"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoggedIn } = useAuth()
  const toast = useToast()

  const [isSignUp, setIsSignUp] = useState(false)
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [contact, setContact] = useState("")
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isSignUp) {
        // Register first
        await registerUser({
          fullname,
          email,
          password,
          contact: contact || "1234567890",
          role: "GUEST"
        })
        toast({
          type: "success",
          title: "Account created!",
          message: "You can now log in with your credentials."
        })
        setIsSignUp(false)
      } else {
        // Log in
        const loggedUser = await login(email, password)
        if (loggedUser && loggedUser.role === "ADMIN") {
          navigate("/admin")
        } else {
          navigate(-1) // go back to previous page
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Container */}
      <div className="bg-white w-full max-w-[480px] rounded-[32px] p-8 shadow-2xl relative border border-gray-100 flex flex-col justify-between">
        
        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          aria-label="Back to home"
          className="absolute top-6 right-6 text-gray-500 hover:text-black hover:bg-gray-100 p-2 rounded-full transition cursor-pointer flex items-center gap-2 font-medium text-sm"
        >
          <Home size={16} className="stroke-[2.5]" />
        </button>

        <div className="w-full mt-4">
          {/* Airbnb Coral Logo */}
          <div className="flex justify-center mb-6 text-primary">
            <svg viewBox="0 0 32 32" width="44" height="44" fill="currentColor" aria-hidden="true" className="shrink-0">
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.853-6.964 6.853-2.435 0-4.83-1.184-7.144-3.502l-.42-.434-.421.434C12.235 30.616 9.841 31.8 7.4 31.8 3.318 31.8.44 29.01.44 24.945l.002-.646c.05-.924.292-1.805.96-3.396l.144-.353c.987-2.296 5.147-11.006 7.1-14.836l.534-1.025C10.537 1.963 11.992 1 14 1h2zm0 2.652h-2c-1.022 0-1.694.41-2.426 1.617l-.4.683c-1.91 3.74-6.04 12.388-6.99 14.6l-.265.638c-.4.987-.526 1.564-.526 2.153 0 2.696 1.79 4.5 4.32 4.5 1.85 0 3.748-1.018 5.622-3.044C13.7 24.4 12.36 21.668 12.36 19c0-2.832 1.85-4.84 3.64-4.84 1.79 0 3.64 2.008 3.64 4.84 0 2.668-1.34 5.4-3.6 7.96 1.874 2.026 3.772 3.044 5.622 3.044 2.53 0 4.32-1.804 4.32-4.5 0-.59-.126-1.166-.526-2.153l-.265-.638c-.95-2.212-5.08-10.86-6.99-14.6l-.4-.683C17.694 4.062 17.022 3.652 16 3.652z" />
            </svg>
          </div>

          {/* Unified login / signup tabs */}
          <div className="flex border-b border-gray-200 mb-6 font-bold text-sm text-center">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 pb-3 cursor-pointer transition ${!isSignUp ? "border-b-2 border-primary text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 pb-3 cursor-pointer transition ${isSignUp ? "border-b-2 border-primary text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              Sign Up
            </button>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8 leading-tight">
            {isSignUp ? "Create your account" : "Welcome back to StayBNB"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-black/10 focus-within:border-black transition duration-200">
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Full Name"
                    className="w-full text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                    required
                  />
                </div>
                <div className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-black/10 focus-within:border-black transition duration-200">
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Contact Number"
                    className="w-full text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                </div>
              </>
            )}

            <div className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-black/10 focus-within:border-black transition duration-200">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                required
              />
            </div>

            <div className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-black/10 focus-within:border-black transition duration-200">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/60 text-white text-[15px] font-bold py-4 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition cursor-pointer select-none mt-2"
            >
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
