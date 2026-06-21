import { useState } from "react";
import { Search, MessageSquare, AlertTriangle, CheckCircle, ChevronDown, X, Send } from "lucide-react";

import { useEffect, useCallback } from "react";
import { getBookings } from "../../services/adminApi";

const STATUS_STYLE = {
  "Open":        { bg: "#fff0f2", color: "#ff385c", border: "#ffccd5" },
  "In Progress": { bg: "#fff8e7", color: "#fc642d", border: "#fde1bb" },
  "Escalated":   { bg: "#fdf0f8", color: "#c026d3", border: "#f0abfc" },
  "Resolved":    { bg: "#e6f7f6", color: "#00a699", border: "#b2e4e1" },
};

const PRIORITY_STYLE = {
  High:   { color: "#ff385c" },
  Medium: { color: "#fc642d" },
  Low:    { color: "#717171" },
};

const STAT_ITEMS = [
  { label: "Open Tickets",   key: "Open",        bg: "#fff0f2", color: "#ff385c" },
  { label: "In Progress",    key: "In Progress", bg: "#fff8e7", color: "#fc642d" },
  { label: "Escalated",      key: "Escalated",   bg: "#fdf0f8", color: "#c026d3" },
  { label: "Resolved",       key: "Resolved",    bg: "#e6f7f6", color: "#00a699" },
];

function TicketModal({ ticket, onClose, onUpdate }) {
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(ticket.status);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 520, maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#717171", fontWeight: 600, textTransform: "uppercase" }}>{ticket.id}</p>
            <h3 style={{ margin: "4px 0 0", fontSize: 17, fontWeight: 700, color: "#222" }}>{ticket.subject}</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#717171", padding: 4 }}><X size={16} /></button>
        </div>

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20, padding: "16px", background: "#f7f7f7", borderRadius: 12 }}>
          {[
            { label: "User", value: ticket.user },
            { label: "Type", value: ticket.type },
            { label: "Priority", value: ticket.priority },
            { label: "Created", value: ticket.created },
            { label: "Booking Ref", value: ticket.booking || "N/A" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ margin: 0, fontSize: 11, color: "#717171", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px" }}>{label}</p>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "#222", fontWeight: 500 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Update status */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#222", marginBottom: 6 }}>Update Status</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.keys(STATUS_STYLE).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                style={{
                  padding: "5px 12px", borderRadius: 20, border: "1.5px solid",
                  borderColor: status === s ? STATUS_STYLE[s].color : "#eee",
                  background: status === s ? STATUS_STYLE[s].bg : "#fff",
                  color: status === s ? STATUS_STYLE[s].color : "#717171",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.15s",
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Internal note */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#222", marginBottom: 6 }}>Add Internal Note</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add a note for your team…"
            style={{ width: "100%", height: 90, padding: "10px 12px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 13, color: "#222", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
            onFocus={e => e.target.style.borderColor = "#222"} onBlur={e => e.target.style.borderColor = "#ddd"} />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { onUpdate(ticket.id, status); onClose(); }}
            style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: "#ff385c", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#e00b41"}
            onMouseLeave={e => e.currentTarget.style.background = "#ff385c"}
          >
            <Send size={14} /> Save & Update
          </button>
          <button onClick={onClose}
            style={{ padding: "12px 20px", borderRadius: 10, border: "1.5px solid #ddd", background: "#fff", color: "#717171", fontSize: 14, cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DisputesPage() {
  const [tab, setTab]         = useState("All");
  const [search, setSearch]   = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);

  const tabs = ["All", "Open", "In Progress", "Escalated", "Resolved"];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBookings();
      const bookings = res.data || [];

      // Generate realistic tickets from bookings
      const generated = bookings.map(b => {
        let subject = `Booking Issue - #${b.id}`;
        let type = "Booking";
        let priority = "Medium";
        let status = "Open";

        if (b.status === "CANCELLED") {
          subject = `Refund not received for booking #${b.id}`;
          type = "Payment";
          priority = "High";
          status = "Escalated";
        } else if (b.status === "PENDING") {
          subject = `Host hasn't approved booking #${b.id}`;
          type = "Cancellation";
          priority = "Medium";
          status = "Open";
        } else if (b.status === "CONFIRMED") {
          subject = `Query about amenities at property #${b.property?.id}`;
          type = "Access";
          priority = "Low";
          status = "Resolved";
        }

        return {
          id: `TKT-${b.id}`,
          subject,
          type,
          user: b.guest?.user?.fullname || "Unknown Guest",
          priority,
          status,
          created: b.checkIn || "N/A",
          booking: `BK-${b.id}`
        };
      });

      setTickets(generated);
    } catch (err) {
      console.error(err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = tickets.filter(t => {
    const matchTab    = tab === "All" ? true : t.status === tab;
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.user.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const updateTicket = (id, newStatus) => setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));

  return (
    <div style={{ padding: "36px 40px", maxWidth: 1200, boxSizing: "border-box" }}>
      {modal && <TicketModal ticket={modal} onClose={() => setModal(null)} onUpdate={updateTicket} />}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#222", letterSpacing: "-0.5px" }}>Disputes & Support</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#717171" }}>Manage support tickets, disputes and resolution center</p>
      </div>

      {/* Stat strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {STAT_ITEMS.map(s => {
          const count = tickets.filter(t => t.status === s.key).length;
          return (
            <div key={s.key} onClick={() => setTab(s.key)} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "all 0.15s", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = s.bg; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.background = "#fff"; }}>
              <p style={{ margin: 0, fontSize: 11, color: "#717171", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px" }}>{s.label}</p>
              <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: "-0.5px" }}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs + Search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, background: "#f7f7f7", padding: 4, borderRadius: 12, border: "1px solid #eee" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "6px 12px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#222" : "#717171",
              boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#717171" }} />
          <input placeholder="Search tickets…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: "8px 14px 8px 34px", borderRadius: 22, border: "1.5px solid #ddd", fontSize: 13, outline: "none", width: 220, color: "#222", background: "#fff" }}
            onFocus={e => e.target.style.borderColor = "#222"} onBlur={e => e.target.style.borderColor = "#ddd"} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: "#f7f7f7", borderBottom: "1px solid #eee" }}>
                {["Ticket ID", "Subject", "Type", "User", "Priority", "Status", "Created", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "#717171", fontSize: 11, letterSpacing: "0.3px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 48, color: "#717171" }}>No tickets found.</td></tr>
              ) : filtered.map(t => {
                const ss = STATUS_STYLE[t.status] || STATUS_STYLE["Open"];
                const ps = PRIORITY_STYLE[t.priority] || PRIORITY_STYLE.Low;
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid #f0f0f0", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 12, color: "#717171" }}>{t.id}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#222", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</td>
                    <td style={{ padding: "12px 14px", color: "#717171", fontSize: 12 }}>{t.type}</td>
                    <td style={{ padding: "12px 14px", color: "#717171" }}>{t.user}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 700, fontSize: 12, color: ps.color }}>{t.priority}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>{t.status}</span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#717171", fontSize: 12 }}>{t.created}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <button onClick={() => setModal(t)}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid #eee", background: "#fff", color: "#717171", cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff385c"; e.currentTarget.style.color = "#ff385c"; e.currentTarget.style.background = "#fff0f2"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.color = "#717171"; e.currentTarget.style.background = "#fff"; }}>
                        <MessageSquare size={12} /> Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
