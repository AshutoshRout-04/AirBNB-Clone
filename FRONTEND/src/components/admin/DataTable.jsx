import { useState } from "react";
import { Trash2, Search, ChevronUp, ChevronDown, Loader2 } from "lucide-react";

export default function DataTable({ title, subtitle, columns, rows, onDelete, loading, accentColor = "#ff385c" }) {
  const [search, setSearch]       = useState("");
  const [sortCol, setSortCol]     = useState(null);
  const [sortAsc, setSortAsc]     = useState(true);
  const [deleting, setDeleting]   = useState(null);
  const [deleteId, setDeleteId]   = useState(null); // for confirm UI

  const handleSort = (col) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const filtered = rows.filter(row =>
    columns.some(col => String(row[col.key] ?? "").toLowerCase().includes(search.toLowerCase()))
  );

  const sorted = sortCol
    ? [...filtered].sort((a, b) => {
        const av = String(a[sortCol] ?? "");
        const bv = String(b[sortCol] ?? "");
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : filtered;

  const handleDelete = async (id) => {
    setDeleting(id);
    await onDelete(id);
    setDeleting(null);
    setDeleteId(null);
  };

  return (
    <div style={{ padding: "36px 40px", maxWidth: 1200, boxSizing: "border-box" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#222222", letterSpacing: "-0.5px" }}>{title}</h1>
          {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13, color: "#717171" }}>{subtitle}</p>}
        </div>
        <span style={{
          background: "#f7f7f7", border: "1.5px solid #dddddd",
          color: "#717171", padding: "5px 14px",
          borderRadius: 20, fontSize: 13, fontWeight: 600,
        }}>
          {sorted.length} {sorted.length === 1 ? "record" : "records"}
        </span>
      </div>

      {/* Search bar */}
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 320 }}>
        <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#717171" }} />
        <input
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "10px 14px 10px 38px",
            borderRadius: 22, border: "1.5px solid #dddddd",
            background: "#fff", color: "#222222",
            fontSize: 13, outline: "none", boxSizing: "border-box",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={e => { e.target.style.borderColor = "#222"; e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
          onBlur={e => { e.target.style.borderColor = "#dddddd"; e.target.style.boxShadow = "none"; }}
        />
      </div>

      {/* Table card */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #dddddd",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: 64, color: "#717171", fontSize: 14 }}>
            <Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} />
            Loading…
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: 64, color: "#717171", fontSize: 14 }}>
            No records found.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: "#f7f7f7", borderBottom: "1px solid #eeeeee" }}>
                  {columns.map(col => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{
                        padding: "12px 18px", textAlign: "left",
                        fontWeight: 600, color: "#717171", fontSize: 12,
                        letterSpacing: "0.3px", textTransform: "uppercase",
                        cursor: "pointer", whiteSpace: "nowrap", userSelect: "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {col.label}
                        {sortCol === col.key
                          ? (sortAsc
                            ? <ChevronUp size={12} color={accentColor} />
                            : <ChevronDown size={12} color={accentColor} />)
                          : <ChevronUp size={12} color="#dddddd" />}
                      </div>
                    </th>
                  ))}
                  <th style={{ padding: "12px 18px", textAlign: "center", fontWeight: 600, color: "#717171", fontSize: 12, letterSpacing: "0.3px", textTransform: "uppercase" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    style={{ borderBottom: "1px solid #f0f0f0", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {columns.map(col => (
                      <td key={col.key} style={{
                        padding: "13px 18px", color: "#222222",
                        maxWidth: 200, overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {col.render
                          ? col.render(row[col.key], row)
                          : (row[col.key] ?? <span style={{ color: "#cccccc" }}>—</span>)}
                      </td>
                    ))}
                    <td style={{ padding: "13px 18px", textAlign: "center" }}>
                      {deleteId === row.id ? (
                        // Inline confirmation
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, color: "#717171" }}>Sure?</span>
                          <button
                            onClick={() => handleDelete(row.id)}
                            style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#ff385c", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                          >
                            {deleting === row.id ? <Loader2 size={11} style={{ animation: "spin 0.8s linear infinite" }} /> : "Yes"}
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #dddddd", background: "#fff", color: "#717171", fontSize: 11, cursor: "pointer" }}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(row.id)}
                          title="Delete"
                          style={{
                            padding: "6px 10px", borderRadius: 8,
                            border: "1px solid #eeeeee",
                            background: "#fff", color: "#717171",
                            cursor: "pointer", display: "inline-flex",
                            alignItems: "center", gap: 5,
                            fontSize: 12, fontWeight: 500,
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff385c"; e.currentTarget.style.color = "#ff385c"; e.currentTarget.style.background = "#fff0f2"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "#eeeeee"; e.currentTarget.style.color = "#717171"; e.currentTarget.style.background = "#fff"; }}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
