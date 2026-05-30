import { useState, useEffect } from "react";
import Employees from "./Employees";
import Tasks from "./Tasks";
import Login from "./Login";

function App() {
  const [page, setPage] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboard, setDashboard] = useState({
    total_employees: 0,
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0,
    in_progress_tasks: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard")
      .then((res) => res.json())
      .then((data) => setDashboard(data))
      .catch((err) => console.log("Backend error:", err));
  }, []);

  // Show Login page
  if (page === "login") return (
    <Login onLogin={() => { setIsLoggedIn(true); setPage("dashboard"); }} />
  );

  // Show Employees page
  if (page === "employees") return (
    <div>
      <button onClick={() => setPage("dashboard")} style={{ margin: "20px", backgroundColor: "#7f5539", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
        ← Back to Dashboard
      </button>
      <Employees />
    </div>
  );

  // Show Tasks page
  if (page === "tasks") return (
    <div>
      <button onClick={() => setPage("dashboard")} style={{ margin: "20px", backgroundColor: "#7f5539", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
        ← Back to Dashboard
      </button>
      <Tasks />
    </div>
  );

  // Dashboard page
  return (
    <div style={{ backgroundColor: "#f5ebe0", minHeight: "100vh", fontFamily: "Arial" }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: "#7f5539", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "white", margin: 0 }}>Onboard AI</h1>
        <button
          onClick={() => setPage("login")}
          style={{ backgroundColor: "#ddb892", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
          {isLoggedIn ? "Logged In ✅" : "Login"}
        </button>
      </nav>

      {/* MAIN TITLE */}
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <h1 style={{ fontSize: "60px", color: "#7f5539", margin: 0 }}>Onboarding Control Panel</h1>
        <div style={{ height: "20px" }}></div>
        <h2 style={{ fontSize: "28px", color: "#9c6644", margin: 0 }}>Employee Tracking & AI System</h2>
      </div>

      {/* CARDS */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginTop: "60px" }}>
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", width: "200px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <h3>Total Employees</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#7f5539" }}>{dashboard.total_employees}</p>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", width: "200px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <h3>Total Tasks</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#7f5539" }}>{dashboard.total_tasks}</p>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", width: "200px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <h3>Pending Tasks</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#e76f51" }}>{dashboard.pending_tasks}</p>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", width: "200px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <h3>Completed</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#2a9d8f" }}>{dashboard.completed_tasks}</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div style={{ textAlign: "center", marginTop: "40px", display: "flex", justifyContent: "center", gap: "20px" }}>
        <button
          onClick={() => setPage("employees")}
          style={{ backgroundColor: "#7f5539", color: "white", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "16px", cursor: "pointer" }}>
          Manage Employees
        </button>
        <button
          onClick={() => setPage("tasks")}
          style={{ backgroundColor: "#9c6644", color: "white", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "16px", cursor: "pointer" }}>
          Manage Tasks
        </button>
      </div>
    </div>
  );
}

export default App;