import { createContext, useContext, useState, useEffect } from "react"
import { Mail, X } from "lucide-react"
import { useToast } from "./Toast"
import { getUserByEmail, registerUser, getUserById, loginUser } from "../services/UserService"
import { getHostByUserId } from "../services/HostService"

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

  // Instead of a modal, we redirect to /login
  const openLogin = () => {
    window.location.href = "/login"
  }
  
  const closeLogin = () => {
    // No-op for backwards compatibility with components that call it
  }

  useEffect(() => {
    async function syncGuestId() {
      if (user && user.id && !localStorage.getItem("staybnb_guest_id")) {
        try {
          const axios = (await import("axios")).default;
          const guestRes = await axios.get("http://localhost:8086/api/Guest/getall");
          const matchingGuest = guestRes.data.find(g => g.user && g.user.id === user.id);
          if (matchingGuest) {
            localStorage.setItem("staybnb_guest_id", matchingGuest.id.toString());
          }
        } catch (e) {
          console.error("Failed to sync guest profile ID on app load:", e);
        }
      }
    }
    syncGuestId();
  }, [user]);

  const login = async (email, password) => {
    try {
      // Step 1: Call authentication login endpoint
      const response = await loginUser(email, password);
      const { id } = response.data;

      // Step 2: Fetch full user profile details
      const userProfileRes = await getUserById(id);
      const dbUser = userProfileRes.data;

      const loggedUser = {
        id: dbUser.id,
        name: dbUser.fullname,
        email: dbUser.email,
        role: dbUser.role,
        avatar: dbUser.avatar || null,
      };

      setUser(loggedUser);
      localStorage.setItem("staybnb_user", JSON.stringify(loggedUser));
      
      // Fetch and store guest profile ID
      try {
        const axios = (await import("axios")).default;
        const guestRes = await axios.get("http://localhost:8086/api/Guest/getall");
        const matchingGuest = guestRes.data.find(g => g.user && g.user.id === dbUser.id);
        if (matchingGuest) {
          localStorage.setItem("staybnb_guest_id", matchingGuest.id.toString());
        }
      } catch (e) {
        console.error("Failed to load guest profile ID:", e);
      }

      if (loggedUser.role === "HOST" || loggedUser.role === "HOST_GUEST") {
        try {
          const hostRes = await getHostByUserId(loggedUser.id);
          if (hostRes.data && hostRes.data.id) {
            localStorage.setItem("staybnb_host_id", hostRes.data.id.toString());
          }
        } catch (hostErr) {
          console.error("Failed to load host profile ID on login:", hostErr);
        }
      }

      // Dispatch custom event to notify external non-context components (if any)
      window.dispatchEvent(new CustomEvent("auth-change", { detail: loggedUser }));

      toast({
        type: "success",
        title: "Welcome back!",
        message: `Logged in successfully as ${loggedUser.name}.`,
      });

      // Check role redirection
      if (loggedUser.role === "ADMIN") {
        window.location.href = "/admin";
      }
      return loggedUser;
    } catch (err) {
      console.error("Login failed:", err);
      toast({
        type: "error",
        title: "Authentication failed",
        message: "Invalid email or password. Please try again.",
      });
      throw err;
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("staybnb_user")
    localStorage.removeItem("staybnb_host_id")
    
    window.dispatchEvent(new CustomEvent("auth-change", { detail: null }))

    toast({
      type: "info",
      title: "Logged out",
      message: "You have been signed out of staybnb.",
    })
  }

  const updateUserSession = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("staybnb_user", JSON.stringify(updatedUser));
    window.dispatchEvent(new CustomEvent("auth-change", { detail: updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoginModalOpen: false,
        openLogin,
        closeLogin,
        login,
        logout,
        updateUserSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
