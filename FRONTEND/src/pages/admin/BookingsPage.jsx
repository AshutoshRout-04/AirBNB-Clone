import { useEffect, useState, useCallback } from "react";
import DataTable from "../../components/admin/DataTable";
import { getBookings, deleteBooking } from "../../services/adminApi";

// Airbnb booking status styles
const STATUS_STYLE = {
  CONFIRMED: { bg: "#e6f7f6", color: "#00a699", border: "#b2e4e1" },
  PENDING:   { bg: "#fff8e7", color: "#fc642d", border: "#fde1bb" },
  CANCELLED: { bg: "#fff0f2", color: "#ff385c", border: "#ffccd5" },
  COMPLETED: { bg: "#f7f7f7", color: "#484848", border: "#dddddd" },
};

const COLUMNS = [
  { key: "id",         label: "ID" },
  { key: "checkIn",    label: "Check-in" },
  { key: "checkOut",   label: "Check-out" },
  {
    key: "totalPrice", label: "Total",
    render: (v) => v
      ? <span style={{ fontWeight: 600, color: "#222222" }}>₹{Number(v).toLocaleString()}</span>
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
];

export default function BookingsPage() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await getBookings(); setRows(res.data || []); }
    catch { setRows([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    await deleteBooking(id);
    setRows(prev => prev.filter(r => r.id !== id));
  };

  return (
    <DataTable
      title="Bookings"
      subtitle="All reservations made across the platform"
      columns={COLUMNS}
      rows={rows}
      loading={loading}
      onDelete={handleDelete}
    />
  );
}
