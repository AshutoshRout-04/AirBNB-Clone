import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home          from "./pages/Home";
import HostDashboard from "./pages/HostDashboard";
import AdminApp      from "./pages/admin/AdminApp";
import Profile       from "./pages/Profile";
import LoginPage     from "./pages/LoginPage";
import { AuthProvider } from "./components/LoginModal";

function MainApp() {
  const [mode, setMode] = useState("guest");

  if (mode === "host") {
    return <HostDashboard onSwitchToGuest={() => setMode("guest")} />;
  }
  return <Home onSwitchToHost={() => setMode("host")} />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/*"       element={<MainApp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
