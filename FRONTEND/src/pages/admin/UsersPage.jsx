import { useState } from "react";
import { Search, CheckCircle, Ban, ShieldCheck, ShieldOff, MoreHorizontal, X } from "lucide-react";

import { useEffect, useCallback } from "react";
import { getGuests, getHosts } from "../../services/adminApi";

const STATUS_STYLE = {
  Active:    { bg: "#e6f7f6", color: "#00a699", border: "#b2e4e1" },
  Suspended: { bg: "#fff8e7", color: "#fc642d", border: "#fde1bb" },
  Banned:    { bg: "#fff0f2", color: "#ff385c", border: "#ffccd5" },
};

function Badge({ text, style }) {
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
      ...style,
    }}>{text}</span>
  );
}

function ActionModal({ user, onClose, onAction }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 28, width: 340,
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Actions for {user.name}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#717171", padding: 4 }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: user.verified ? "Unverify User" : "Verify User", icon: user.verified ? ShieldOff : ShieldCheck, action: "verify", color: "#00a699" },
            { label: user.status === "Suspended" ? "Unsuspend Account" : "Suspend Account", icon: user.status === "Suspended" ? CheckCircle : Ban, action: "suspend", color: "#fc642d" },
            { label: "Ban User", icon: Ban, action: "ban", color: "#ff385c" },
            { label: "View KYC Documents", icon: ShieldCheck, action: "kyc", color: "#717171" },
          ].map(({ label, icon: Icon, action, color }) => (
            <button key={action} onClick={() => { onAction(user.id, action); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 14px", borderRadius: 10,
                border: "1px solid #eeeeee", background: "#fff",
                color, cursor: "pointer", fontSize: 13, fontWeight: 500,
                transition: "all 0.15s", textAlign: "left",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f7f7f7"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [tab, setTab]         = useState("All");
  const [search, setSearch]   = useState("");
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);

  const tabs = ["All", "Guests", "Hosts", "Suspended", "Banned"];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [gRes, hRes] = await Promise.all([getGuests(), getHosts()]);
      const guests = gRes.data || [];
      const hosts = hRes.data || [];

      // Map users from guests and hosts
      const userMap = {};

      guests.forEach(g => {
        if (g.user) {
          userMap[g.user.id] = {
            id: g.user.id,
            name: g.user.fullname || "Unknown Guest",
            email: g.user.email,
            type: "Guest",
            status: "Active", // Default
            joined: "2024-01-12", // Default
            verified: false,
            bookings: g.totalBookings || 0,
          };
        }
      });

      hosts.forEach(h => {
        if (h.user) {
          if (userMap[h.user.id]) {
            // User is both Guest and Host
            userMap[h.user.id].type = "Host & Guest";
            userMap[h.user.id].verified = h.verified;
          } else {
            userMap[h.user.id] = {
              id: h.user.id,
              name: h.user.fullname || "Unknown Host",
              email: h.user.email,
              type: "Host",
              status: "Active",
              joined: "2024-01-12",
              verified: h.verified,
              bookings: 0,
            };
          }
        }
      });

      setUsers(Object.values(userMap));
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = users.filter(u => {
    const matchesTab =
      tab === "All"       ? true :
      tab === "Guests"    ? u.type.includes("Guest") :
      tab === "Hosts"     ? u.type.includes("Host") :
      tab === "Suspended" ? u.status === "Suspended" :
      tab === "Banned"    ? u.status === "Banned" : true;
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAction = (id, action) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      if (action === "verify")  return { ...u, verified: !u.verified };
      if (action === "suspend") return { ...u, status: u.status === "Suspended" ? "Active" : "Suspended" };
      if (action === "ban")     return { ...u, status: "Banned" };
      return u;
    }));
  };

  return (
    <div style={{ padding: "36px 40px", maxWidth: 1200, boxSizing: "border-box" }}>
      {modal && <ActionModal user={modal} onClose={() => setModal(null)} onAction={handleAction} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#222", letterSpacing: "-0.5px" }}>User Management</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#717171" }}>Manage all guests, hosts, and their account status</p>
        </div>
        <span style={{ background: "#f7f7f7", border: "1.5px solid #ddd", color: "#717171", padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
          {filtered.length} users
        </span>
      </div>

      {/* Tabs + Search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 6, background: "#f7f7f7", padding: 4, borderRadius: 12, border: "1px solid #eeeeee" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "6px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#222222" : "#717171",
              boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#717171" }} />
          <input placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: "9px 14px 9px 36px", borderRadius: 22, border: "1.5px solid #ddd", fontSize: 13, outline: "none", width: 220, color: "#222", background: "#fff" }}
            onFocus={e => e.target.style.borderColor = "#222"}
            onBlur={e => e.target.style.borderColor = "#ddd"}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: "#f7f7f7", borderBottom: "1px solid #eee" }}>
                {["ID", "Name", "Email", "Type", "Status", "Verified", "Bookings", "Joined", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#717171", fontSize: 11, letterSpacing: "0.3px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 48, color: "#717171" }}>No users found.</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f0f0f0", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px", color: "#717171", fontSize: 12 }}>#{u.id}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "#222" }}>{u.name}</td>
                  <td style={{ padding: "12px 16px", color: "#717171" }}>{u.email}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge text={u.type} style={{ background: u.type === "Host" ? "#e6f7f6" : "#f7f7f7", color: u.type === "Host" ? "#00a699" : "#484848", border: "1px solid " + (u.type === "Host" ? "#b2e4e1" : "#ddd") }} />
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge text={u.status} style={{ background: STATUS_STYLE[u.status].bg, color: STATUS_STYLE[u.status].color, border: "1px solid " + STATUS_STYLE[u.status].border }} />
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 13, color: u.verified ? "#00a699" : "#fc642d", fontWeight: 600 }}>
                      {u.verified ? "✓ Verified" : "Unverified"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#222", fontWeight: 600 }}>{u.bookings}</td>
                  <td style={{ padding: "12px 16px", color: "#717171", fontSize: 12 }}>{u.joined}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => setModal(u)}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid #eee", background: "#fff", color: "#717171", cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#222"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.color = "#717171"; }}
                    >
                      <MoreHorizontal size={13} /> Actions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
