import { useEffect, useState, useCallback } from "react";
import DataTable from "../../components/admin/DataTable";
import { getGuests, deleteGuest } from "../../services/adminApi";

const COLUMNS = [
  { key: "id",        label: "ID" },
  { key: "firstName", label: "First Name" },
  { key: "lastName",  label: "Last Name" },
  { key: "email",     label: "Email" },
  { key: "phone",     label: "Phone" },
];

export default function GuestsPage() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await getGuests(); setRows(res.data || []); }
    catch { setRows([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    await deleteGuest(id);
    setRows(prev => prev.filter(r => r.id !== id));
  };

  return (
    <DataTable
      title="Guests"
      subtitle="All registered guests on the platform"
      columns={COLUMNS}
      rows={rows}
      loading={loading}
      onDelete={handleDelete}
    />
  );
}
