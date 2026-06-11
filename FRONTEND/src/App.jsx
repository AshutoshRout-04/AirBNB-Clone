import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home          from "./pages/Home";
import HostDashboard from "./pages/HostDashboard";
import AdminApp      from "./pages/admin/AdminApp";

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
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*"       element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
