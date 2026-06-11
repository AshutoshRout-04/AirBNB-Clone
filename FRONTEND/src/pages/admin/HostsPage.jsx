import { useEffect, useState, useCallback } from "react";
import DataTable from "../../components/admin/DataTable";
import { getHosts, deleteHost } from "../../services/adminApi";

const COLUMNS = [
  { key: "id",         label: "ID" },
  { key: "firstName",  label: "First Name" },
  { key: "lastName",   label: "Last Name" },
  { key: "email",      label: "Email" },
  { key: "phone",      label: "Phone" },
  {
    key: "superHost", label: "Super Host",
    render: (v) => (
      <span style={{
        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
        background: v ? "#e6f7f6" : "#f7f7f7",
        color: v ? "#00a699" : "#717171",
        border: v ? "1px solid #b2e4e1" : "1px solid #eeeeee",
      }}>
        {v ? "✓ Superhost" : "Regular"}
      </span>
    ),
  },
];

export default function HostsPage() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await getHosts(); setRows(res.data || []); }
    catch { setRows([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    await deleteHost(id);
    setRows(prev => prev.filter(r => r.id !== id));
  };

  return (
    <DataTable
      title="Hosts"
      subtitle="All registered hosts and their superhost status"
      columns={COLUMNS}
      rows={rows}
      loading={loading}
      onDelete={handleDelete}
    />
  );
}
