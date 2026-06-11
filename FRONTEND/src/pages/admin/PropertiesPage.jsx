import { useEffect, useState, useCallback } from "react";
import DataTable from "../../components/admin/DataTable";
import { getProperties, deleteProperty } from "../../services/adminApi";

const COLUMNS = [
  { key: "id",           label: "ID" },
  { key: "title",        label: "Title" },
  { key: "propertyType", label: "Type" },
  { key: "city",         label: "City" },
  { key: "country",      label: "Country" },
  {
    key: "pricePerNight", label: "Price / Night",
    render: (v) => v
      ? <span style={{ fontWeight: 600, color: "#222222" }}>₹{Number(v).toLocaleString()}</span>
      : "—",
  },
  { key: "maxGuests", label: "Max Guests" },
];

export default function PropertiesPage() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await getProperties(); setRows(res.data || []); }
    catch { setRows([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    await deleteProperty(id);
    setRows(prev => prev.filter(r => r.id !== id));
  };

  return (
    <DataTable
      title="Properties"
      subtitle="All listings published on the platform"
      columns={COLUMNS}
      rows={rows}
      loading={loading}
      onDelete={handleDelete}
    />
  );
}
