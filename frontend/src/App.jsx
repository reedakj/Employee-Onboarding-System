import { useState, useEffect } from "react";
import Employees from "./Employees";
import Tasks from "./Tasks";
import Login from "./Login";
import Progress from "./Progress";

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
  const [aiSummary, setAiSummary] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("https://employee-onboarding-system-5sgp.onrender.com/api/dashboard")
      .then((res) => res.json())
      .then((data) => setDashboard(data))
      .catch((err) => console.log("Backend error:", err));

    fetch("https://employee-onboarding-system-5sgp.onrender.com/api/predict-all")
      .then((res) => res.json())
      .then((data) => setAiSummary(data.summary))
      .catch((err) => console.log("AI error:", err));

    fetch("https://employee-onboarding-system-5sgp.onrender.com/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.log("Notifications error:", err));
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

  // Show Progress page
  if (page === "progress") return (
    <div>
      <button onClick={() => setPage("dashboard")} style={{ margin: "20px", backgroundColor: "#7f5539", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
        ← Back to Dashboard
      </button>
      <Progress />
    </div>
  );

  // Show Notifications page
  if (page === "notifications") return (
    <div style={{ backgroundColor: "#f5ebe0", minHeight: "100vh", fontFamily: "Arial" }}>
      <nav style={{ backgroundColor: "#7f5539", padding: "20px 40px" }}>
        <h1 style={{ color: "white", margin: 0 }}>Onboard AI — Notifications</h1>
      </nav>
      <div style={{ padding: "40px" }}>
        <button onClick={() => setPage("dashboard")} style={{ marginBottom: "20px", backgroundColor: "#7f5539", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
          ← Back to Dashboard
        </button>
        <h2 style={{ color: "#7f5539" }}>🔔 Auto Reminder Logs</h2>
        <p style={{ color: "#9c6644" }}>These are auto-generated warnings for At Risk and Delayed employees.</p>
        {notifications.length === 0 ? (
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <p style={{ color: "#aaa", fontSize: "18px" }}>No reminders yet.</p>
          </div>
        ) : (
          notifications.map((note) => (
            <div
              key={note.id}
              style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", marginBottom: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", borderLeft: note.status === "Delayed" ? "5px solid #b91c1c" : "5px solid #b45309" }}
            >
              <span style={{ backgroundColor: note.status === "Delayed" ? "#fee2e2" : "#fef3c7", color: note.status === "Delayed" ? "#b91c1c" : "#b45309", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "bold" }}>
                {note.status === "Delayed" ? "🔴 Delayed" : "⚠️ At Risk"}
              </span>
              <p style={{ margin: "10px 0 4px 0", color: "#333" }}>{note.message}</p>
              <small style={{ color: "#aaa" }}>{new Date(note.created_at).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
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

      {/* PHASE 2 — AI SUMMARY BAR */}
      {aiSummary && (
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginTop: "40px" }}>
          <div style={{ backgroundColor: "#dcfce7", padding: "16px 28px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#15803d" }}>{aiSummary["On Track"]}</p>
            <p style={{ margin: 0, color: "#15803d", fontWeight: "bold" }}>✅ On Track</p>
          </div>
          <div style={{ backgroundColor: "#fef3c7", padding: "16px 28px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#b45309" }}>{aiSummary["At Risk"]}</p>
            <p style={{ margin: 0, color: "#b45309", fontWeight: "bold" }}>⚠️ At Risk</p>
          </div>
          <div style={{ backgroundColor: "#fee2e2", padding: "16px 28px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#b91c1c" }}>{aiSummary["Delayed"]}</p>
            <p style={{ margin: 0, color: "#b91c1c", fontWeight: "bold" }}>🔴 Delayed</p>
          </div>
        </div>
      )}

      {/* STATS CARDS */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginTop: "40px" }}>
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", width: "200px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <h3>Total Employees</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#7f5539" }}>{dashboard.total_employees}</p>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", width: "200px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <h3>Total Tasks</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#7f5539" }}>{dashboard.total_tasks}</p>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", width: "200px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <h3>Pending Assignments</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#e76f51" }}>{dashboard.pending_tasks}</p>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", width: "200px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <h3>Completed Assignments</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#2a9d8f" }}>{dashboard.completed_tasks}</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div style={{ textAlign: "center", marginTop: "40px", display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", paddingBottom: "60px" }}>
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
        <button
          onClick={() => setPage("progress")}
          style={{ backgroundColor: "#2a9d8f", color: "white", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "16px", cursor: "pointer" }}>
          📋 Track Progress
        </button>
        <button
          onClick={() => setPage("notifications")}
          style={{ backgroundColor: "#e76f51", color: "white", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "16px", cursor: "pointer" }}>
          🔔 View Notifications
        </button>
      </div>

    </div>
  );
}

export default App;