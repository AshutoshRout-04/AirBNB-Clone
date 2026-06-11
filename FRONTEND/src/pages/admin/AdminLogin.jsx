import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const ADMIN_EMAIL    = "admin@airbnb.com";
const ADMIN_PASSWORD = "admin123";

// Airbnb logo SVG
const AirbnbLogo = () => (
  <svg viewBox="0 0 32 32" width="36" height="36" fill="#ff385c">
    <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.853-6.964 6.853-2.435 0-4.83-1.184-7.144-3.502l-.42-.434-.421.434C12.235 30.616 9.841 31.8 7.4 31.8 3.318 31.8.44 29.01.44 24.945l.002-.646c.05-.924.292-1.805.96-3.396l.144-.353c.987-2.296 5.147-11.006 7.1-14.836l.534-1.025C10.537 1.963 11.992 1 14 1h2zm0 2.652h-2c-1.022 0-1.694.41-2.426 1.617l-.4.683c-1.91 3.74-6.04 12.388-6.99 14.6l-.265.638c-.4.987-.526 1.564-.526 2.153 0 2.696 1.79 4.5 4.32 4.5 1.85 0 3.748-1.018 5.622-3.044C13.7 24.4 12.36 21.668 12.36 19c0-2.832 1.85-4.84 3.64-4.84 1.79 0 3.64 2.008 3.64 4.84 0 2.668-1.34 5.4-3.6 7.96 1.874 2.026 3.772 3.044 5.622 3.044 2.53 0 4.32-1.804 4.32-4.5 0-.59-.126-1.166-.526-2.153l-.265-.638c-.95-2.212-5.08-10.86-6.99-14.6l-.4-.683C17.694 4.062 17.022 3.652 16 3.652z" />
  </svg>
);

export default function AdminLogin({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("admin_auth", "true");
        onLogin();
      } else {
        setError("Those credentials don't match our records.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f7f7f7",
      display: "flex",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
    }}>
      {/* Left Panel — branding */}
      <div style={{
        flex: 1,
        background: "linear-gradient(160deg, #ff385c 0%, #e00b41 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 48,
        color: "#fff",
        minWidth: 0,
      }}
        className="hidden md:flex"
      >
        <AirbnbLogo />
        <h1 style={{ fontSize: 36, fontWeight: 800, marginTop: 20, marginBottom: 12, letterSpacing: "-1px", textAlign: "center" }}>
          staybnb<br />Admin
        </h1>
        <p style={{ fontSize: 15, opacity: 0.85, maxWidth: 300, textAlign: "center", lineHeight: 1.6 }}>
          Manage guests, hosts, properties and bookings from one place.
        </p>

        {/* Decorative dots */}
        <div style={{ display: "flex", gap: 8, marginTop: 40 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
          ))}
        </div>
      </div>

      {/* Right Panel — form */}
      <div style={{
        width: "100%", maxWidth: 440,
        background: "#ffffff",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 40px",
        boxSizing: "border-box",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.06)",
      }}>
        {/* Mobile logo */}
        <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <AirbnbLogo />
          <span style={{ fontSize: 20, fontWeight: 700, color: "#222" }}>staybnb Admin</span>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#222222", margin: "16px 0 4px", textAlign: "center", letterSpacing: "-0.4px" }}>
          Welcome back
        </h2>
        <p style={{ fontSize: 13, color: "#717171", marginBottom: 28, textAlign: "center" }}>
          Sign in to your admin account
        </p>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#222222", marginBottom: 6 }}>
              Email address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#717171" }} />
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@airbnb.com"
                style={{
                  width: "100%", padding: "11px 13px 11px 38px",
                  borderRadius: 10, border: "1.5px solid #dddddd",
                  background: "#fff", color: "#222222",
                  fontSize: 14, outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "#222222"}
                onBlur={e => e.target.style.borderColor = "#dddddd"}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#222222", marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#717171" }} />
              <input
                type={showPw ? "text" : "password"} required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "11px 42px 11px 38px",
                  borderRadius: 10, border: "1.5px solid #dddddd",
                  background: "#fff", color: "#222222",
                  fontSize: 14, outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "#222222"}
                onBlur={e => e.target.style.borderColor = "#dddddd"}
              />
              <button
                type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#717171", padding: 0, display: "flex" }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#fff0f2", border: "1.5px solid #ffccd5",
              borderRadius: 10, padding: "10px 14px", marginBottom: 16,
              color: "#e00b41", fontSize: 13, fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "13px",
              borderRadius: 10, border: "none",
              background: loading ? "#ff7a93" : "#ff385c",
              color: "#fff", fontWeight: 700, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s, transform 0.1s",
              boxShadow: "0 2px 8px rgba(255,56,92,0.25)",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#e00b41"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#ff385c"; }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Hint */}
        <div style={{
          marginTop: 24, padding: "12px 16px",
          background: "#f7f7f7", borderRadius: 10,
          fontSize: 12, color: "#717171", width: "100%", boxSizing: "border-box",
          lineHeight: 1.6,
        }}>
          <strong style={{ color: "#222" }}>Demo credentials</strong><br />
          Email: admin@airbnb.com<br />
          Password: admin123
        </div>
      </div>
    </div>
  );
}
