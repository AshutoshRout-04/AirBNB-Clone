import { useState, useEffect, useCallback } from "react";
import { Search, ArrowUpRight, ArrowDownLeft, RefreshCw, DollarSign, CreditCard, TrendingUp, Clock } from "lucide-react";
import { getBookings } from "../../services/adminApi";

const TYPE_STYLE = {
  Booking: { bg: "#e6f7f6", color: "#00a699", border: "#b2e4e1", icon: ArrowUpRight },
  Payout:  { bg: "#fff8e7", color: "#fc642d", border: "#fde1bb", icon: ArrowDownLeft },
  Refund:  { bg: "#fff0f2", color: "#ff385c", border: "#ffccd5", icon: RefreshCw },
};

const STATUS_STYLE = {
  Completed: { bg: "#e6f7f6", color: "#00a699", border: "#b2e4e1" },
  Processed: { bg: "#e6f7f6", color: "#00a699", border: "#b2e4e1" },
  Pending:   { bg: "#fff8e7", color: "#fc642d", border: "#fde1bb" },
  Failed:    { bg: "#fff0f2", color: "#ff385c", border: "#ffccd5" },
};

export default function PaymentsPage() {
  const [tab, setTab]         = useState("All");
  const [search, setSearch] = useState("");
  const [txns, setTxns]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState([
    { label: "Total Revenue",     value: "₹0", sub: "Based on confirmed bookings", icon: TrendingUp,  color: "#00a699", bg: "#e6f7f6" },
    { label: "Pending Payouts",   value: "₹0",   sub: "Awaiting process", icon: Clock,       color: "#fc642d", bg: "#fff8e7" },
    { label: "Refunds Issued",    value: "₹0",   sub: "Cancelled bookings",        icon: RefreshCw,   color: "#ff385c", bg: "#fff0f2" },
    { label: "Platform Fees",     value: "₹0",   sub: "10% Platform fee",icon: CreditCard,  color: "#484848", bg: "#f7f7f7" },
  ]);

  const tabs = ["All", "Booking", "Payout", "Refund"];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBookings();
      const bookings = res.data || [];
      
      let totalRevenue = 0;
      let pendingPayouts = 0;
      let refunds = 0;
      let platformFees = 0;
      let pendingCount = 0;

      const generatedTxns = [];

      bookings.forEach(b => {
        const guestName = b.guest?.user?.fullname || "Unknown Guest";
        const hostName = b.property?.host_Id?.user?.fullname || b.property?.host_id?.user?.fullname || "Unknown Host";
        const amount = Number(b.totalPrice || 0);
        const fee = amount * 0.1;

        // 1. Booking Transaction (Guest -> Platform)
        let bookingStatus = "Pending";
        if (b.status === "CONFIRMED" || b.status === "COMPLETED") {
          bookingStatus = "Completed";
          totalRevenue += amount;
          platformFees += fee;
        } else if (b.status === "CANCELLED") {
          bookingStatus = "Failed";
          refunds += amount;
        } else {
          pendingCount++;
          pendingPayouts += amount;
        }

        generatedTxns.push({
          id: `TXN-BK-${b.id}`,
          type: "Booking",
          user: guestName,
          amount: amount,
          fee: fee,
          status: bookingStatus,
          date: b.checkIn || "N/A"
        });

        // 2. Host Payout Transaction (Platform -> Host) if confirmed
        if (bookingStatus === "Completed") {
          generatedTxns.push({
            id: `TXN-PO-${b.id}`,
            type: "Payout",
            user: hostName,
            amount: amount - fee,
            fee: 0,
            status: "Processed",
            date: b.checkOut || "N/A"
          });
        }
      });

      setTxns(generatedTxns);
      setStats([
        { label: "Total Revenue",     value: `₹${totalRevenue.toLocaleString()}`, sub: `From confirmed bookings`, icon: TrendingUp,  color: "#00a699", bg: "#e6f7f6" },
        { label: "Pending Payouts",   value: `₹${pendingPayouts.toLocaleString()}`,   sub: `${pendingCount} bookings pending`, icon: Clock,       color: "#fc642d", bg: "#fff8e7" },
        { label: "Refunds Issued",    value: `₹${refunds.toLocaleString()}`,   sub: "From cancelled bookings",        icon: RefreshCw,   color: "#ff385c", bg: "#fff0f2" },
        { label: "Platform Fees",     value: `₹${platformFees.toLocaleString()}`,   sub: "10% Platform fee collected",icon: CreditCard,  color: "#484848", bg: "#f7f7f7" },
      ]);
    } catch (err) {
      console.error(err);
      setTxns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = txns.filter(t => {
    const matchTab    = tab === "All" ? true : t.type === tab;
    const matchSearch = t.user?.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const processAction = (id, action) => {
    setTxns(prev => prev.map(t => t.id === id
      ? { ...t, status: action === "process" ? "Processed" : "Completed" }
      : t
    ));
  };

  return (
    <div style={{ padding: "36px 40px", maxWidth: 1200, boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#222", letterSpacing: "-0.5px" }}>Payments & Finance</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#717171" }}>Manage payouts, transactions, refunds and platform fees</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 14, padding: "20px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "#717171", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px" }}>{s.label}</p>
                <p style={{ margin: "6px 0 2px", fontSize: 24, fontWeight: 700, color: "#222", letterSpacing: "-0.5px" }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#717171" }}>{s.sub}</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={18} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, background: "#f7f7f7", padding: 4, borderRadius: 12, border: "1px solid #eee" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "6px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#222" : "#717171",
              boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#717171" }} />
            <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: "8px 14px 8px 34px", borderRadius: 22, border: "1.5px solid #ddd", fontSize: 13, outline: "none", width: 200, color: "#222", background: "#fff" }}
              onFocus={e => e.target.style.borderColor = "#222"} onBlur={e => e.target.style.borderColor = "#ddd"} />
          </div>
          <button style={{ padding: "8px 16px", borderRadius: 22, border: "1.5px solid #ddd", background: "#fff", color: "#222", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#222"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; }}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: "#f7f7f7", borderBottom: "1px solid #eee" }}>
                {["Transaction ID", "Type", "User", "Amount", "Platform Fee", "Status", "Date", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#717171", fontSize: 11, letterSpacing: "0.3px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const ts = TYPE_STYLE[t.type];
                const ss = STATUS_STYLE[t.status] || STATUS_STYLE.Pending;
                const TypeIcon = ts.icon;
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid #f0f0f0", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "13px 16px", fontFamily: "monospace", fontSize: 12, color: "#717171" }}>{t.id}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>
                        <TypeIcon size={10} /> {t.type}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px", fontWeight: 500, color: "#222" }}>{t.user}</td>
                    <td style={{ padding: "13px 16px", fontWeight: 700, color: "#222" }}>₹{t.amount.toLocaleString()}</td>
                    <td style={{ padding: "13px 16px", color: "#717171" }}>{t.fee > 0 ? `₹${t.fee}` : "—"}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>{t.status}</span>
                    </td>
                    <td style={{ padding: "13px 16px", color: "#717171", fontSize: 12 }}>{t.date}</td>
                    <td style={{ padding: "13px 16px" }}>
                      {t.status === "Pending" && (
                        <button onClick={() => processAction(t.id, "process")}
                          style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid #b2e4e1", background: "#e6f7f6", color: "#00a699", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s" }}>
                          Process
                        </button>
                      )}
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
