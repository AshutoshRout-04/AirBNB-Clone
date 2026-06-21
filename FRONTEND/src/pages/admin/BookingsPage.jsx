import { useEffect, useState, useCallback } from "react";
import DataTable from "../../components/admin/DataTable";
import { getBookings, deleteBooking, updateBookingStatus } from "../../services/adminApi";

// Booking status badge styles
const STATUS_STYLE = {
  CONFIRMED:   { bg: "#e6f7f6", color: "#00a699", border: "#b2e4e1" },
  PENDING:     { bg: "#fff8e7", color: "#fc642d", border: "#fde1bb" },
  CHECKED_IN:  { bg: "#e8f4fd", color: "#1a73e8", border: "#a8d0f5" },
  CHECKED_OUT: { bg: "#f0e8fd", color: "#7b2fe8", border: "#cda8f5" },
  CANCELLED:   { bg: "#fff0f2", color: "#ff385c", border: "#ffccd5" },
  COMPLETED:   { bg: "#f7f7f7", color: "#484848", border: "#dddddd" },
};

const PAYMENT_STATUS_STYLE = {
  PAID:    { bg: "#e6f7f0", color: "#00875a", border: "#b2e4d0" },
  FAILED:  { bg: "#fff0f2", color: "#ff385c", border: "#ffccd5" },
  PENDING: { bg: "#fff8e7", color: "#fc642d", border: "#fde1bb" },
};

const PAYMENT_METHOD_LABEL = {
  CARD:       "💳 Card",
  UPI:        "📱 UPI",
  NETBANKING: "🏦 Net Banking",
};

// Action buttons component rendered inside the table
function StatusActions({ row, onStatusChange }) {
  const status = row?.status;
  const [loading, setLoading] = useState(false);

  const handleClick = async (newStatus) => {
    setLoading(true);
    try {
      await updateBookingStatus(row.bookingId, newStatus);
      onStatusChange(row.bookingId, newStatus);
    } catch (e) {
      console.error("Status update failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {status === "CONFIRMED" && (
        <button
          disabled={loading}
          onClick={() => handleClick("CHECKED_IN")}
          style={{
            padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: "#1a73e8", color: "#fff", border: "none", cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          ✈ Check-in
        </button>
      )}
      {status === "CHECKED_IN" && (
        <button
          disabled={loading}
          onClick={() => handleClick("CHECKED_OUT")}
          style={{
            padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: "#7b2fe8", color: "#fff", border: "none", cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          🏁 Check-out
        </button>
      )}
    </div>
  );
}

export default function BookingsPage() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBookings();
      const mapped = (res.data || []).map(b => ({ ...b, id: b.bookingId }));
      setRows(mapped);
    }
    catch { setRows([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Optimistic update when status changes via buttons
  const handleStatusChange = (bookingId, newStatus) => {
    setRows(prev => prev.map(r =>
      r.bookingId === bookingId ? { ...r, status: newStatus } : r
    ));
  };

  const handleDelete = async (id) => {
    await deleteBooking(id);
    setRows(prev => prev.filter(r => r.bookingId !== id));
  };

  const COLUMNS = [
    { key: "bookingId", label: "ID" },
    {
      key: "guest", label: "User",
      render: (_, row) => {
        const name = row?.guest?.user?.fullname || row?.guest?.user?.name || "Guest User";
        const email = row?.guest?.user?.email;
        return (
          <div>
            <div style={{ fontWeight: 600, color: "#222" }}>{name}</div>
            {email && <div style={{ fontSize: 11, color: "#717171" }}>{email}</div>}
          </div>
        );
      }
    },
    {
      key: "property", label: "Property",
      render: (_, row) => (
        <div style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {row?.property?.title || "—"}
        </div>
      )
    },
    { key: "checkInDate",  label: "Check-in" },
    { key: "checkOutDate", label: "Check-out" },
    {
      key: "totalAmount", label: "Total",
      render: (v) => v
        ? <span style={{ fontWeight: 600, color: "#222" }}>₹{Number(v).toLocaleString()}</span>
        : "—",
    },
    {
      key: "status", label: "Status",
      render: (v) => {
        const s = STATUS_STYLE[v] || STATUS_STYLE.COMPLETED;
        return (
          <span style={{
            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
          }}>
            {v || "—"}
          </span>
        );
      },
    },
    {
      key: "actions", label: "Actions",
      render: (_, row) => (
        <StatusActions row={row} onStatusChange={handleStatusChange} />
      ),
    },
    {
      key: "paymentMethod", label: "Payment",
      render: (v) => (
        <span style={{ fontSize: 12, color: "#484848", fontWeight: 500 }}>
          {PAYMENT_METHOD_LABEL[v] || (v ? v : "—")}
        </span>
      ),
    },
    {
      key: "paymentStatus", label: "Paid?",
      render: (v) => {
        const ps = PAYMENT_STATUS_STYLE[v] || { bg: "#f7f7f7", color: "#717171", border: "#dddddd" };
        return (
          <span style={{
            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: ps.bg, color: ps.color, border: `1px solid ${ps.border}`,
          }}>
            {v || "—"}
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      title="Bookings"
      subtitle="All reservations — use Check-in / Check-out buttons to track guest lifecycle"
      columns={COLUMNS}
      rows={rows}
      loading={loading}
      onDelete={handleDelete}
    />
  );
}
