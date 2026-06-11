import { useState } from "react";
import { TrendingUp, Users, Home, CalendarCheck, Download, BarChart3 } from "lucide-react";

// ── Mock analytics data ────────────────────────────────────────────────────
const MONTHLY_DATA = [
  { month: "Jan", bookings: 48,  revenue: 184000, users: 12 },
  { month: "Feb", bookings: 52,  revenue: 210000, users: 18 },
  { month: "Mar", bookings: 61,  revenue: 248000, users: 22 },
  { month: "Apr", bookings: 45,  revenue: 175000, users: 15 },
  { month: "May", bookings: 73,  revenue: 312000, users: 30 },
  { month: "Jun", bookings: 89,  revenue: 385000, users: 41 },
  { month: "Jul", bookings: 95,  revenue: 420000, users: 38 },
  { month: "Aug", bookings: 110, revenue: 512000, users: 55 },
  { month: "Sep", bookings: 82,  revenue: 350000, users: 29 },
  { month: "Oct", bookings: 97,  revenue: 445000, users: 44 },
  { month: "Nov", bookings: 105, revenue: 490000, users: 48 },
  { month: "Dec", bookings: 122, revenue: 580000, users: 62 },
];

const TOP_LISTINGS = [
  { title: "Cozy Beachfront Villa", city: "Goa",        bookings: 38, revenue: 323000, rating: 4.9 },
  { title: "Mountain Retreat",      city: "Manali",     bookings: 29, revenue: 121800, rating: 4.8 },
  { title: "Heritage Apartment",    city: "Jaipur",     bookings: 26, revenue: 72800,  rating: 4.7 },
  { title: "Luxury Penthouse",      city: "Mumbai",     bookings: 18, revenue: 270000, rating: 4.9 },
  { title: "Forest Treehouse",      city: "Coorg",      bookings: 22, revenue: 143000, rating: 4.8 },
];

const SUMMARY_CARDS = [
  { label: "Total Revenue",  value: "₹49.1L",  sub: "+18% YoY",  icon: TrendingUp,   color: "#00a699", bg: "#e6f7f6" },
  { label: "Total Bookings", value: "979",      sub: "+23% YoY",  icon: CalendarCheck, color: "#ff385c", bg: "#fff0f2" },
  { label: "Active Users",   value: "1,248",    sub: "+31% YoY",  icon: Users,         color: "#fc642d", bg: "#fff8e7" },
  { label: "Active Listings",value: "184",      sub: "+8% YoY",   icon: Home,          color: "#484848", bg: "#f7f7f7" },
];

function BarChartUI({ data, valueKey, color, maxValue }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140, padding: "0 4px" }}>
      {data.map(d => {
        const pct = maxValue > 0 ? (d[valueKey] / maxValue) * 100 : 0;
        return (
          <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }} title={`${d.month}: ${d[valueKey]}`}>
            <div style={{ width: "100%", height: `${pct}%`, background: color, borderRadius: "4px 4px 0 0", minHeight: 3, transition: "height 0.5s ease" }} />
            <span style={{ fontSize: 9, color: "#717171", fontWeight: 500 }}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const [tab, setTab]       = useState("Overview");
  const [period, setPeriod] = useState("12M");
  const tabs = ["Overview", "Listings", "Users", "Financial"];
  const periods = ["1M", "3M", "6M", "12M"];

  const maxBookings = Math.max(...MONTHLY_DATA.map(d => d.bookings));
  const maxRevenue  = Math.max(...MONTHLY_DATA.map(d => d.revenue));

  return (
    <div style={{ padding: "36px 40px", maxWidth: 1200, boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#222", letterSpacing: "-0.5px" }}>Analytics & Reports</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#717171" }}>Business performance metrics and exportable reports</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {periods.map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "7px 14px", borderRadius: 8, border: "1.5px solid",
              borderColor: period === p ? "#222" : "#ddd",
              background: period === p ? "#222" : "#fff",
              color: period === p ? "#fff" : "#717171",
              fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            }}>{p}</button>
          ))}
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "1.5px solid #ddd", background: "#fff", color: "#222", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff385c"; e.currentTarget.style.color = "#ff385c"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.color = "#222"; }}>
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, background: "#f7f7f7", padding: 4, borderRadius: 12, border: "1px solid #eee", marginBottom: 24, width: "fit-content" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "7px 18px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === t ? "#fff" : "transparent",
            color: tab === t ? "#222" : "#717171",
            boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.15s",
          }}>{t}</button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        {SUMMARY_CARDS.map(c => (
          <div key={c.label} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 14, padding: "20px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <c.icon size={20} color={c.color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "#717171", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px" }}>{c.label}</p>
              <p style={{ margin: "4px 0 2px", fontSize: 22, fontWeight: 700, color: "#222", letterSpacing: "-0.5px" }}>{c.value}</p>
              <p style={{ margin: 0, fontSize: 11, color: c.color, fontWeight: 600 }}>{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Bookings chart */}
        <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 16, padding: "22px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#222" }}>Monthly Bookings</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#717171" }}>Past 12 months</p>
            </div>
            <BarChart3 size={16} color="#ff385c" />
          </div>
          <BarChartUI data={MONTHLY_DATA} valueKey="bookings" color="#ff385c" maxValue={maxBookings} />
        </div>

        {/* Revenue chart */}
        <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 16, padding: "22px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#222" }}>Monthly Revenue (₹)</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#717171" }}>Past 12 months</p>
            </div>
            <TrendingUp size={16} color="#00a699" />
          </div>
          <BarChartUI data={MONTHLY_DATA} valueKey="revenue" color="#00a699" maxValue={maxRevenue} />
        </div>
      </div>

      {/* Top listings table */}
      <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #eee" }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#222" }}>Top Performing Listings</p>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "#f7f7f7", borderBottom: "1px solid #eee" }}>
              {["Rank", "Listing", "City", "Bookings", "Revenue", "Rating"].map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: "#717171", fontSize: 11, letterSpacing: "0.3px", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOP_LISTINGS.map((l, i) => (
              <tr key={l.title} style={{ borderBottom: "1px solid #f0f0f0" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 16px" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: i === 0 ? "#ff385c" : "#f7f7f7", color: i === 0 ? "#fff" : "#717171", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                </td>
                <td style={{ padding: "13px 16px", fontWeight: 600, color: "#222" }}>{l.title}</td>
                <td style={{ padding: "13px 16px", color: "#717171" }}>{l.city}</td>
                <td style={{ padding: "13px 16px", fontWeight: 700, color: "#222" }}>{l.bookings}</td>
                <td style={{ padding: "13px 16px", fontWeight: 700, color: "#00a699" }}>₹{l.revenue.toLocaleString()}</td>
                <td style={{ padding: "13px 16px", fontWeight: 700, color: "#fc642d" }}>★ {l.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
