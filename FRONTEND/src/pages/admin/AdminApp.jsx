import { useState } from "react";
import AdminLogin     from "./AdminLogin";
import AdminLayout    from "../../components/admin/AdminLayout";
import AdminDashboard from "./AdminDashboard";
import UsersPage      from "./UsersPage";
import ListingsPage   from "./ListingsPage";
import BookingsPage   from "./BookingsPage";
import PaymentsPage   from "./PaymentsPage";
import DisputesPage   from "./DisputesPage";
import AnalyticsPage  from "./AnalyticsPage";
import SettingsPage   from "./SettingsPage";

const PAGES = {
  dashboard: AdminDashboard,
  users:     UsersPage,
  listings:  ListingsPage,
  bookings:  BookingsPage,
  payments:  PaymentsPage,
  disputes:  DisputesPage,
  analytics: AnalyticsPage,
  settings:  SettingsPage,
};

export default function AdminApp() {
  const [auth, setAuth]         = useState(() => localStorage.getItem("admin_auth") === "true");
  const [activePage, setActive] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setAuth(false);
  };

  if (!auth) return <AdminLogin onLogin={() => setAuth(true)} />;

  const PageComponent = PAGES[activePage] || AdminDashboard;

  return (
    <AdminLayout activePage={activePage} onNavigate={setActive} onLogout={handleLogout}>
      {/* Pass onNavigate to Dashboard so Quick Actions and Mission Control can route */}
      {activePage === "dashboard"
        ? <AdminDashboard onNavigate={setActive} />
        : <PageComponent />
      }
    </AdminLayout>
  );
}
