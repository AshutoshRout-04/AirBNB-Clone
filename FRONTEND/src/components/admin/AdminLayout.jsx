import { useState } from "react";
import { Bell } from "lucide-react";
import {
  LayoutDashboard, Users, Building2, CalendarCheck,
  CreditCard, AlertCircle, BarChart3, Settings,
  LogOut, Menu, X, ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard",  label: "Dashboard",   icon: LayoutDashboard },
  { key: "users",      label: "Users",        icon: Users },
  { key: "listings",   label: "Listings",     icon: Building2 },
  { key: "bookings",   label: "Bookings",     icon: CalendarCheck },
  { key: "payments",   label: "Payments",     icon: CreditCard },
  { key: "disputes",   label: "Disputes",     icon: AlertCircle },
  { key: "analytics",  label: "Analytics",    icon: BarChart3 },
  { key: "settings",   label: "Settings",     icon: Settings },
];

const AirbnbLogo = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="#ff385c">
    <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.853-6.964 6.853-2.435 0-4.83-1.184-7.144-3.502l-.42-.434-.421.434C12.235 30.616 9.841 31.8 7.4 31.8 3.318 31.8.44 29.01.44 24.945l.002-.646c.05-.924.292-1.805.96-3.396l.144-.353c.987-2.296 5.147-11.006 7.1-14.836l.534-1.025C10.537 1.963 11.992 1 14 1h2zm0 2.652h-2c-1.022 0-1.694.41-2.426 1.617l-.4.683c-1.91 3.74-6.04 12.388-6.99 14.6l-.265.638c-.4.987-.526 1.564-.526 2.153 0 2.696 1.79 4.5 4.32 4.5 1.85 0 3.748-1.018 5.622-3.044C13.7 24.4 12.36 21.668 12.36 19c0-2.832 1.85-4.84 3.64-4.84 1.79 0 3.64 2.008 3.64 4.84 0 2.668-1.34 5.4-3.6 7.96 1.874 2.026 3.772 3.044 5.622 3.044 2.53 0 4.32-1.804 4.32-4.5 0-.59-.126-1.166-.526-2.153l-.265-.638c-.95-2.212-5.08-10.86-6.99-14.6l-.4-.683C17.694 4.062 17.022 3.652 16 3.652z" />
  </svg>
);

export default function AdminLayout({ children, activePage, onNavigate, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{
      display: "flex", height: "100vh",
      background: "#f7f7f7",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      color: "#222222", overflow: "hidden",
    }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? 64 : 220,
        transition: "width 0.25s ease",
        background: "#ffffff",
        borderRight: "1px solid #dddddd",
        display: "flex", flexDirection: "column",
        flexShrink: 0, overflow: "hidden",
      }}>
        {/* Brand */}
        <div style={{
          padding: collapsed ? "18px" : "18px 20px",
          display: "flex", alignItems: "center", gap: 10,
          borderBottom: "1px solid #eeeeee",
          minHeight: 60, boxSizing: "border-box",
        }}>
          <AirbnbLogo />
          {!collapsed && (
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#222222", letterSpacing: "-0.3px" }}>staybnb</span>
              <span style={{ display: "block", fontSize: 10, color: "#717171", fontWeight: 500, marginTop: 1 }}>Admin Panel</span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          margin: "8px auto", width: 30, height: 30,
          borderRadius: 8, border: "1px solid #eeeeee",
          background: "#f7f7f7", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#717171", transition: "all 0.15s", flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#eeeeee"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f7f7f7"; }}
        >
          {collapsed ? <Menu size={13} /> : <X size={13} />}
        </button>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "4px 8px", display: "flex", flexDirection: "column", gap: 1, overflowY: "auto", overflowX: "hidden" }}>
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const active = activePage === key;
            return (
              <button key={key} onClick={() => onNavigate(key)} title={collapsed ? label : undefined}
                style={{
                  display: "flex", alignItems: "center",
                  gap: collapsed ? 0 : 10,
                  justifyContent: collapsed ? "center" : "flex-start",
                  padding: collapsed ? "9px" : "9px 12px",
                  borderRadius: 10, border: "none", cursor: "pointer",
                  background: active ? "#fff0f2" : "transparent",
                  color: active ? "#ff385c" : "#717171",
                  fontWeight: active ? 600 : 400,
                  fontSize: 13, width: "100%",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap", overflow: "hidden",
                  position: "relative",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#f7f7f7"; e.currentTarget.style.color = "#222"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#717171"; } }}
              >
                {active && <span style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, borderRadius: 2, background: "#ff385c" }} />}
                <Icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{label}</span>
                    {active && <ChevronRight size={12} />}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "10px 8px", borderTop: "1px solid #eeeeee" }}>
          <button onClick={onLogout} title={collapsed ? "Logout" : undefined}
            style={{
              display: "flex", alignItems: "center",
              gap: collapsed ? 0 : 10,
              justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? "9px" : "9px 12px",
              borderRadius: 10, border: "1px solid #eeeeee",
              background: "transparent", color: "#717171",
              cursor: "pointer", fontSize: 13, width: "100%",
              transition: "all 0.15s", whiteSpace: "nowrap", overflow: "hidden",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fff0f2"; e.currentTarget.style.color = "#ff385c"; e.currentTarget.style.borderColor = "#ffccd5"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#717171"; e.currentTarget.style.borderColor = "#eeeeee"; }}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top header */}
        <header style={{
          height: 58, background: "#ffffff",
          borderBottom: "1px solid #dddddd",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px", flexShrink: 0,
        }}>
          <span style={{ fontSize: 13, color: "#717171" }}>
            Admin Panel &nbsp;›&nbsp;
            <strong style={{ color: "#222222" }}>
              {NAV_ITEMS.find(n => n.key === activePage)?.label ?? "Dashboard"}
            </strong>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#717171", display: "flex", padding: 6, borderRadius: 8 }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f7f7f7"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
            >
              <Bell size={16} />
            </button>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#fdecd2", color: "#784e1b",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 13,
              border: "1.5px solid #f3d9b4",
            }}>A</div>
          </div>
        </header>

        <main style={{ flex: 1, overflow: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
