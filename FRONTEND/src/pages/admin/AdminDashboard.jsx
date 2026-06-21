import { useEffect, useState } from "react";
import { getGuests, getHosts, getProperties, getBookings } from "../../services/adminApi";
import {
  Users, UserCog, Home, CalendarCheck, RefreshCw,
  TrendingUp, Activity, AlertCircle, Clock,
  CheckCircle, UserPlus, Star, CreditCard,
  Building2, ShieldCheck, Zap,
} from "lucide-react";

// Removed mock activity feed, will generate dynamically

// ── Quick actions ──────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Approve Listing",    icon: CheckCircle,  color: "#00a699", bg: "#e6f7f6", page: "listings"  },
  { label: "Manage Disputes",    icon: AlertCircle,  color: "#c026d3", bg: "#fdf0f8", page: "disputes"  },
  { label: "Process Payout",     icon: CreditCard,   color: "#fc642d", bg: "#fff8e7", page: "payments"  },
  { label: "Verify User",        icon: ShieldCheck,  color: "#ff385c", bg: "#fff0f2", page: "users"     },
];

const PALETTE = [
  { key: "guests",     label: "Total Guests",     icon: Users,        color: "#ff385c", bg: "#fff0f2" },
  { key: "hosts",      label: "Total Hosts",       icon: UserCog,      color: "#00a699", bg: "#e6f7f6" },
  { key: "properties", label: "Total Properties",  icon: Home,         color: "#fc642d", bg: "#fff8e7" },
  { key: "bookings",   label: "Total Bookings",    icon: CalendarCheck,color: "#484848", bg: "#f7f7f7" },
];

function StatCard({ label, value, icon: Icon, color, bg, loading }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #ddd", borderRadius: 16,
      padding: "22px", display: "flex", alignItems: "center", gap: 16,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      transition: "box-shadow 0.2s, transform 0.2s", cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ width: 50, height: 50, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, color: "#717171", fontWeight: 500, marginBottom: 4 }}>{label}</p>
        <p style={{ margin: 0, fontSize: 30, fontWeight: 700, color: "#222", letterSpacing: "-0.8px" }}>
          {loading ? <span style={{ fontSize: 18, color: "#ddd" }}>—</span> : value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default function AdminDashboard({ onNavigate }) {
  const [counts,   setCounts]   = useState({ guests: 0, hosts: 0, properties: 0, bookings: 0 });
  const [data,     setData]     = useState({ guests: [], hosts: [], properties: [], bookings: [] });
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [spinning, setSpinning] = useState(false);

  // Mission control dynamically generated from backend data
  const mission = [
    { label: "Open Disputes",      value: 0, color: "#ff385c", bg: "#fff0f2" },
    { label: "Pending Listings",   value: data.properties.filter(p => !p.available).length, color: "#fc642d", bg: "#fff8e7" },
    { label: "KYC Awaiting",       value: data.hosts.filter(h => h.verified === false).length, color: "#c026d3", bg: "#fdf0f8" },
    { label: "Unpaid Payouts",     value: 0, color: "#00a699", bg: "#e6f7f6" },
  ];

  const fetchAll = async () => {
    setLoading(true); setSpinning(true); setError("");
    try {
      const [g, h, p, b] = await Promise.all([getGuests(), getHosts(), getProperties(), getBookings()]);
      const guests = g.data || [];
      const hosts = h.data || [];
      const properties = p.data || [];
      const bookings = b.data || [];

      setData({ guests, hosts, properties, bookings });
      setCounts({
        guests:     guests.length,
        hosts:      hosts.length,
        properties: properties.length,
        bookings:   bookings.length,
      });
    } catch {
      setError("Cannot reach the backend. Make sure Spring Boot is running on port 8086.");
    } finally {
      setLoading(false);
      setTimeout(() => setSpinning(false), 500);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const now     = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const recentActivities = [];
  if (data.guests.length > 0) {
    const lastGuest = data.guests[data.guests.length - 1];
    recentActivities.push({ id: `g-${lastGuest.id}`, icon: UserPlus, color: "#00a699", bg: "#e6f7f6", text: `New guest registered: ${lastGuest.user?.fullname || 'Unknown'}`, time: "Recent" });
  }
  if (data.bookings.length > 0) {
    const lastBooking = data.bookings[data.bookings.length - 1];
    recentActivities.push({ id: `b-${lastBooking.id}`, icon: CalendarCheck, color: "#ff385c", bg: "#fff0f2", text: `Booking #${lastBooking.id} confirmed`, time: "Recent" });
  }
  if (data.properties.length > 0) {
    const lastProp = data.properties[data.properties.length - 1];
    recentActivities.push({ id: `p-${lastProp.id}`, icon: Building2, color: "#fc642d", bg: "#fff8e7", text: `New listing: ${lastProp.title}`, time: "Recent" });
  }
  if (data.hosts.length > 0) {
    const lastHost = data.hosts[data.hosts.length - 1];
    recentActivities.push({ id: `h-${lastHost.id}`, icon: ShieldCheck, color: "#00a699", bg: "#e6f7f6", text: `Host profile created for ${lastHost.user?.fullname || 'User'}`, time: "Recent" });
  }

  const ACTIVITY_FEED = recentActivities.length > 0 ? recentActivities : [
    { id: 'empty', icon: Activity, color: "#aaaaaa", bg: "#f7f7f7", text: "No recent activity found", time: "" }
  ];

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200, boxSizing: "border-box" }}>

      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#222", letterSpacing: "-0.5px" }}>Overview</h1>
          <p style={{ margin: "5px 0 0", color: "#717171", fontSize: 13 }}>{dateStr}</p>
        </div>
        <button onClick={fetchAll} disabled={loading} style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "9px 18px", borderRadius: 22,
          border: "1.5px solid #ddd", background: "#fff", color: "#222",
          cursor: loading ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600,
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"; } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <RefreshCw size={13} style={{ transition: "transform 0.5s", transform: spinning ? "rotate(360deg)" : "none" }} />
          Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ background: "#fff0f2", border: "1.5px solid #ffccd5", borderRadius: 12, padding: "13px 18px", marginBottom: 24, color: "#e00b41", fontSize: 13, fontWeight: 500 }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 700, color: "#717171", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 6 }}>
          <Zap size={13} /> Quick Actions
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {QUICK_ACTIONS.map(({ label, icon: Icon, color, bg, page }) => (
            <button key={label} onClick={() => onNavigate && onNavigate(page)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: 22,
                border: "1.5px solid #ddd", background: "#fff",
                color: "#222222", cursor: "pointer", fontSize: 13, fontWeight: 600,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.color = "#222"; }}
            >
              <Icon size={14} color={color} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, marginBottom: 24 }}>
        {PALETTE.map(s => (
          <StatCard key={s.key} label={s.label} value={counts[s.key]} icon={s.icon} color={s.color} bg={s.bg} loading={loading} />
        ))}
      </div>

      {/* ── Mission Control + Health ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>

        {/* Mission Control */}
        <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 16, padding: "22px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <AlertCircle size={15} color="#ff385c" />
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#222" }}>Mission Control</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {mission.map(m => (
              <div key={m.label} onClick={() => onNavigate && onNavigate(m.label.includes("Dispute") ? "disputes" : m.label.includes("Listing") ? "listings" : m.label.includes("KYC") ? "users" : "payments")}
                style={{ background: m.bg, border: `1px solid ${m.color}22`, borderRadius: 12, padding: "14px", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: m.color, letterSpacing: "-0.8px" }}>{m.value}</p>
                <p style={{ margin: "3px 0 0", fontSize: 11, color: "#717171", fontWeight: 500 }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Health */}
        <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 16, padding: "22px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Activity size={15} color="#ff385c" />
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#222" }}>Platform Health</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              { label: "Backend API",    ok: !error },
              { label: "Database",       ok: !error },
              { label: "Auth Service",   ok: true   },
              { label: "Payment Gateway",ok: true   },
              { label: "File Storage",   ok: true   },
            ].map(({ label, ok }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#717171" }}>{label}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                  background: ok ? "#e6f7f6" : "#fff0f2",
                  color: ok ? "#00a699" : "#ff385c",
                  border: `1px solid ${ok ? "#b2e4e1" : "#ffccd5"}`,
                }}>
                  {ok ? "● Online" : "● Offline"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Activity Feed ── */}
      <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={15} color="#ff385c" />
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#222" }}>Recent Activity</h3>
        </div>
        <div>
          {ACTIVITY_FEED.map((item, i) => (
            <div key={item.id} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "13px 22px",
              borderBottom: i < ACTIVITY_FEED.length - 1 ? "1px solid #f7f7f7" : "none",
              transition: "background 0.1s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <item.icon size={15} color={item.color} />
              </div>
              <span style={{ flex: 1, fontSize: 13, color: "#222", fontWeight: 500 }}>{item.text}</span>
              <span style={{ fontSize: 11, color: "#aaaaaa", whiteSpace: "nowrap" }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Numbers ── */}
      <div style={{ marginTop: 16, background: "#fff", border: "1px solid #ddd", borderRadius: 16, padding: "22px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <TrendingUp size={15} color="#ff385c" />
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#222" }}>Quick Numbers</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Guests per Host",        value: counts.hosts > 0 ? (counts.guests / counts.hosts).toFixed(1) : "—" },
            { label: "Bookings per Property",  value: counts.properties > 0 ? (counts.bookings / counts.properties).toFixed(1) : "—" },
            { label: "Total Platform Entities",value: (counts.guests + counts.hosts + counts.properties + counts.bookings).toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "#f7f7f7", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#222", letterSpacing: "-0.5px" }}>
                {loading ? "—" : value}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#717171" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
