import { useState } from "react";
import Home from "./pages/Home";
import HostDashboard from "./pages/HostDashboard";

function App() {
  const [mode, setMode] = useState("guest");

  if (mode === "host") {
    return <HostDashboard onSwitchToGuest={() => setMode("guest")} />;
  }

  return <Home onSwitchToHost={() => setMode("host")} />;
}

export default App;
