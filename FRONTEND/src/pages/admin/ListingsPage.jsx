import { useState } from "react";
import { Search, CheckCircle, XCircle, Flag, Trash2, Eye, X } from "lucide-react";

import { useEffect, useCallback } from "react";
import { getProperties, deleteProperty } from "../../services/adminApi";

const STATUS_STYLE = {
  Pending:  { bg: "#fff8e7", color: "#fc642d", border: "#fde1bb" },
  Approved: { bg: "#e6f7f6", color: "#00a699", border: "#b2e4e1" },
  Flagged:  { bg: "#fff0f2", color: "#ff385c", border: "#ffccd5" },
  Removed:  { bg: "#f7f7f7", color: "#717171", border: "#dddddd" },
};

function DetailModal({ listing, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 480, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#222" }}>{listing.title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#717171" }}><X size={16} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {[
            { label: "Host", value: listing.host },
            { label: "City", value: listing.city },
            { label: "Type", value: listing.type },
            { label: "Price/Night", value: `₹${listing.price.toLocaleString()}` },
            { label: "Photos", value: `${listing.photos} uploaded` },
            { label: "Status", value: listing.status },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ margin: 0, fontSize: 11, color: "#717171", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px" }}>{label}</p>
              <p style={{ margin: "3px 0 0", fontSize: 14, color: "#222", fontWeight: 500 }}>{value}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 16px", background: "#f7f7f7", borderRadius: 10, fontSize: 12, color: "#717171" }}>
          <strong style={{ color: "#222" }}>Amenities:</strong>&nbsp; {listing.rawAmenities || "None"}
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  const [tab, setTab]         = useState("All");
  const [search, setSearch]   = useState("");
  const [listings, setListing]= useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail]   = useState(null);

  const tabs = ["All", "Pending", "Approved", "Flagged", "Removed"];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProperties();
      const props = res.data || [];
      const mapped = props.map(p => ({
        id: p.id,
        title: p.title,
        host: p.host_Id?.user?.fullname || p.host_id?.user?.fullname || "Unknown Host",
        city: p.location,
        type: p.amenities?.includes("Villa") ? "Villa" : "Apartment",
        price: p.pricePerNight,
        status: p.available ? "Approved" : "Pending",
        photos: p.photos ? p.photos.split(",").length : 0,
        rawAmenities: p.amenities,
      }));
      setListing(mapped);
    } catch (err) {
      console.error(err);
      setListing([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = listings.filter(l => {
    const matchTab = tab === "All" ? true : l.status === tab;
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.host.toLowerCase().includes(search.toLowerCase()) || l.city.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const updateStatus = async (id, newStatus) => {
    if (newStatus === "Removed") {
      try {
        await deleteProperty(id);
        setListing(prev => prev.filter(l => l.id !== id));
      } catch (err) {
        console.error("Failed to delete property", err);
      }
    } else {
      setListing(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    }
  };

  const counts = { Pending: listings.filter(l => l.status === "Pending").length, Flagged: listings.filter(l => l.status === "Flagged").length };

  return (
    <div style={{ padding: "36px 40px", maxWidth: 1200, boxSizing: "border-box" }}>
      {detail && <DetailModal listing={detail} onClose={() => setDetail(null)} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#222", letterSpacing: "-0.5px" }}>Listing Management</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#717171" }}>Approve, decline, flag or remove property listings</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {counts.Pending > 0 && <span style={{ background: "#fff8e7", border: "1.5px solid #fde1bb", color: "#fc642d", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
            {counts.Pending} Pending Review
          </span>}
          {counts.Flagged > 0 && <span style={{ background: "#fff0f2", border: "1.5px solid #ffccd5", color: "#ff385c", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
            {counts.Flagged} Flagged
          </span>}
        </div>
      </div>

      {/* Tabs + Search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12, marginTop: 20 }}>
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
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#717171" }} />
          <input placeholder="Search listings…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: "9px 14px 9px 36px", borderRadius: 22, border: "1.5px solid #ddd", fontSize: 13, outline: "none", width: 220, color: "#222", background: "#fff" }}
            onFocus={e => e.target.style.borderColor = "#222"} onBlur={e => e.target.style.borderColor = "#ddd"} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: "#f7f7f7", borderBottom: "1px solid #eee" }}>
                {["ID", "Title", "Host", "City", "Type", "Price/Night", "Photos", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "#717171", fontSize: 11, letterSpacing: "0.3px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 48, color: "#717171" }}>No listings found.</td></tr>
              ) : filtered.map(l => {
                const ss = STATUS_STYLE[l.status] || STATUS_STYLE.Removed;
                return (
                  <tr key={l.id} style={{ borderBottom: "1px solid #f0f0f0", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 14px", color: "#717171", fontSize: 12 }}>#{l.id}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#222", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</td>
                    <td style={{ padding: "12px 14px", color: "#717171" }}>{l.host}</td>
                    <td style={{ padding: "12px 14px", color: "#717171" }}>{l.city}</td>
                    <td style={{ padding: "12px 14px", color: "#717171" }}>{l.type}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#222" }}>₹{l.price.toLocaleString()}</td>
                    <td style={{ padding: "12px 14px", color: "#717171" }}>{l.photos}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>{l.status}</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => setDetail(l)} title="View Details" style={{ padding: "5px 9px", borderRadius: 7, border: "1px solid #eee", background: "#fff", cursor: "pointer", color: "#717171", display: "flex", alignItems: "center", transition: "all 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#222"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.color = "#717171"; }}
                        ><Eye size={12} /></button>
                        {l.status !== "Approved" && (
                          <button onClick={() => updateStatus(l.id, "Approved")} title="Approve" style={{ padding: "5px 9px", borderRadius: 7, border: "1px solid #b2e4e1", background: "#e6f7f6", cursor: "pointer", color: "#00a699", display: "flex", alignItems: "center", transition: "all 0.15s" }}>
                            <CheckCircle size={12} />
                          </button>
                        )}
                        {l.status !== "Flagged" && (
                          <button onClick={() => updateStatus(l.id, "Flagged")} title="Flag" style={{ padding: "5px 9px", borderRadius: 7, border: "1px solid #fde1bb", background: "#fff8e7", cursor: "pointer", color: "#fc642d", display: "flex", alignItems: "center", transition: "all 0.15s" }}>
                            <Flag size={12} />
                          </button>
                        )}
                        <button onClick={() => updateStatus(l.id, "Removed")} title="Remove" style={{ padding: "5px 9px", borderRadius: 7, border: "1px solid #ffccd5", background: "#fff0f2", cursor: "pointer", color: "#ff385c", display: "flex", alignItems: "center", transition: "all 0.15s" }}>
                          <XCircle size={12} />
                        </button>
                      </div>
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
