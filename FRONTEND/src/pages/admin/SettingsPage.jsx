import { useState } from "react";
import { Save, Settings, Mail, Shield, Link2, ChevronRight } from "lucide-react";

const TABS = [
  { key: "platform",     label: "Platform",           icon: Settings },
  { key: "emails",       label: "Email Templates",    icon: Mail },
  { key: "roles",        label: "Roles & Permissions",icon: Shield },
  { key: "integrations", label: "Integrations",       icon: Link2 },
];

const ROLES = [
  { name: "Super Admin",    permissions: ["All Access"], users: 1,  color: "#ff385c" },
  { name: "Admin",          permissions: ["Users", "Listings", "Bookings", "Disputes"], users: 3, color: "#fc642d" },
  { name: "Finance Manager",permissions: ["Payments", "Reports"], users: 2, color: "#00a699" },
  { name: "Support Agent",  permissions: ["Disputes", "Tickets"], users: 5, color: "#484848" },
  { name: "Moderator",      permissions: ["Listings", "Content"], users: 4, color: "#717171" },
];

const EMAIL_TEMPLATES = [
  { name: "Booking Confirmation", trigger: "On booking created",  status: "Active",   lastEdited: "2024-05-12" },
  { name: "Cancellation Notice",  trigger: "On booking cancelled", status: "Active",   lastEdited: "2024-04-20" },
  { name: "Payout Processed",     trigger: "On payout sent",      status: "Active",   lastEdited: "2024-03-15" },
  { name: "KYC Approved",         trigger: "On verification OK",  status: "Active",   lastEdited: "2024-02-28" },
  { name: "Review Request",       trigger: "3 days after checkout",status: "Inactive", lastEdited: "2024-01-10" },
  { name: "Dispute Opened",       trigger: "On dispute created",  status: "Active",   lastEdited: "2024-05-01" },
];

const INTEGRATIONS = [
  { name: "Stripe Payments",     desc: "Payment processing gateway",   status: "Connected",    icon: "💳" },
  { name: "Twilio SMS",          desc: "SMS notifications",             status: "Connected",    icon: "📱" },
  { name: "Google Maps",         desc: "Location & mapping services",  status: "Connected",    icon: "🗺️" },
  { name: "AWS S3",              desc: "Photo & media storage",        status: "Connected",    icon: "☁️" },
  { name: "Firebase Analytics",  desc: "User analytics tracking",      status: "Disconnected", icon: "📊" },
  { name: "Zendesk",             desc: "Advanced customer support",    status: "Disconnected", icon: "🎯" },
];

function InputField({ label, value, onChange, type = "text", hint }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#222", marginBottom: 5 }}>{label}</label>
      {hint && <p style={{ margin: "0 0 6px", fontSize: 11, color: "#717171" }}>{hint}</p>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 13, color: "#222", outline: "none", boxSizing: "border-box", background: "#fff", transition: "border-color 0.15s" }}
        onFocus={e => e.target.style.borderColor = "#222"}
        onBlur={e => e.target.style.borderColor = "#ddd"} />
    </div>
  );
}

function SaveButton({ label = "Save Changes" }) {
  const [saved, setSaved] = useState(false);
  const handle = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <button onClick={handle} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 10, border: "none", background: saved ? "#00a699" : "#ff385c", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}>
      <Save size={14} /> {saved ? "Saved!" : label}
    </button>
  );
}

function PlatformTab() {
  const [commission, setCommission] = useState("10");
  const [minPrice,   setMinPrice]   = useState("500");
  const [maxPrice,   setMaxPrice]   = useState("500000");
  const [instantBook, setInstantBook] = useState(true);
  const [hostCancel,  setHostCancel]  = useState("Strict");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Pricing */}
      <section style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 14, padding: "24px" }}>
        <h3 style={{ margin: "0 0 18px", fontSize: 14, fontWeight: 700, color: "#222" }}>Pricing & Commission</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <InputField label="Platform Commission (%)" value={commission} onChange={setCommission} type="number" hint="Applied to every booking" />
          <InputField label="Minimum Listing Price (₹)" value={minPrice} onChange={setMinPrice} type="number" />
          <InputField label="Maximum Listing Price (₹)" value={maxPrice} onChange={setMaxPrice} type="number" />
        </div>
      </section>

      {/* Booking policies */}
      <section style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 14, padding: "24px" }}>
        <h3 style={{ margin: "0 0 18px", fontSize: 14, fontWeight: 700, color: "#222" }}>Booking Policies</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#f7f7f7", borderRadius: 10 }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#222" }}>Instant Book</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#717171" }}>Allow guests to book without host approval</p>
            </div>
            <div onClick={() => setInstantBook(!instantBook)} style={{ width: 44, height: 24, borderRadius: 12, background: instantBook ? "#ff385c" : "#ddd", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
              <div style={{ position: "absolute", top: 2, left: instantBook ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#222" }}>Default Cancellation Policy</label>
            <select value={hostCancel} onChange={e => setHostCancel(e.target.value)}
              style={{ padding: "10px 12px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 13, color: "#222", outline: "none", background: "#fff", cursor: "pointer" }}>
              {["Flexible", "Moderate", "Strict", "Non-Refundable"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </section>

      <SaveButton />
    </div>
  );
}

function EmailsTab() {
  return (
    <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#222" }}>System Email Templates</p>
        <button style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #ddd", background: "#fff", color: "#222", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ New Template</button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f7f7f7", borderBottom: "1px solid #eee" }}>
            {["Template Name", "Trigger", "Status", "Last Edited", ""].map(h => (
              <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: "#717171", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.3px" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EMAIL_TEMPLATES.map(t => (
            <tr key={t.name} style={{ borderBottom: "1px solid #f0f0f0" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <td style={{ padding: "13px 16px", fontWeight: 600, color: "#222" }}>{t.name}</td>
              <td style={{ padding: "13px 16px", color: "#717171", fontSize: 12 }}>{t.trigger}</td>
              <td style={{ padding: "13px 16px" }}>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: t.status === "Active" ? "#e6f7f6" : "#f7f7f7", color: t.status === "Active" ? "#00a699" : "#717171", border: "1px solid " + (t.status === "Active" ? "#b2e4e1" : "#ddd") }}>
                  {t.status}
                </span>
              </td>
              <td style={{ padding: "13px 16px", color: "#717171", fontSize: 12 }}>{t.lastEdited}</td>
              <td style={{ padding: "13px 16px" }}>
                <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "1px solid #eee", background: "#fff", color: "#717171", fontSize: 12, cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#222"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.color = "#717171"; }}>
                  Edit <ChevronRight size={11} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RolesTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {ROLES.map(r => (
        <div key={r.name} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "box-shadow 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: r.color }} />
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#222" }}>{r.name}</p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "#717171" }}>
                {r.permissions.join(" · ")}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 12, color: "#717171" }}>{r.users} {r.users === 1 ? "user" : "users"}</span>
            <button style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #eee", background: "#fff", color: "#717171", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#222"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.color = "#717171"; }}>
              Edit Role
            </button>
          </div>
        </div>
      ))}
      <button style={{ padding: "12px", borderRadius: 12, border: "1.5px dashed #ddd", background: "#f7f7f7", color: "#717171", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff385c"; e.currentTarget.style.color = "#ff385c"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.color = "#717171"; }}>
        + Create New Role
      </button>
    </div>
  );
}

function IntegrationsTab() {
  const [states, setStates] = useState(
    Object.fromEntries(INTEGRATIONS.map(i => [i.name, i.status === "Connected"]))
  );
  const toggle = name => setStates(prev => ({ ...prev, [name]: !prev[name] }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {INTEGRATIONS.map(i => (
        <div key={i.name} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 14, padding: "20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f7f7f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
            {i.icon}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#222" }}>{i.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#717171" }}>{i.desc}</p>
          </div>
          <div onClick={() => toggle(i.name)} style={{ width: 44, height: 24, borderRadius: 12, background: states[i.name] ? "#ff385c" : "#ddd", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 2, left: states[i.name] ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState("platform");

  return (
    <div style={{ padding: "36px 40px", maxWidth: 1000, boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#222", letterSpacing: "-0.5px" }}>Settings & Configuration</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#717171" }}>Configure platform settings, email templates, roles, and integrations</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #ddd", marginBottom: 28 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "10px 20px", border: "none",
            borderBottom: tab === t.key ? "2px solid #ff385c" : "2px solid transparent",
            background: "transparent", cursor: "pointer",
            color: tab === t.key ? "#ff385c" : "#717171",
            fontWeight: tab === t.key ? 700 : 500, fontSize: 13,
            transition: "all 0.15s",
          }}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "platform"     && <PlatformTab />}
      {tab === "emails"       && <EmailsTab />}
      {tab === "roles"        && <RolesTab />}
      {tab === "integrations" && <IntegrationsTab />}
    </div>
  );
}
