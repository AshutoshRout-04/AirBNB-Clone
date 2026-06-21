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

import { useAuth } from "../../components/LoginModal";
import { Navigate } from "react-router-dom";

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
  const { user, isLoggedIn, logout } = useAuth();
  const [activePage, setActive] = useState("dashboard");

  if (!isLoggedIn || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
  };

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
