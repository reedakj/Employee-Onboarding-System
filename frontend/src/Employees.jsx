import { useState, useEffect } from "react";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [summary, setSummary] = useState(null);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchPredictions();
  }, []);

  function fetchEmployees() {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  }

  // Phase 2 — fetch AI predictions for all employees
  function fetchPredictions() {
    fetch("http://localhost:5000/api/predict-all")
      .then((res) => res.json())
      .then((data) => {
        // Turn the array into an object like { 1: {...}, 2: {...} }
        // so we can easily look up any employee by their id
        const map = {};
        data.employees.forEach((emp) => {
          map[emp.employee_id] = emp;
        });
        setPredictions(map);
        setSummary(data.summary);
      });
  }

  function addEmployee() {
    fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, department: department, status: "Pending" }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchEmployees();
        fetchPredictions();
        setName("");
        setDepartment("");
      });
  }

  function deleteEmployee(id) {
    fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "DELETE",
    }).then(() => {
      fetchEmployees();
      fetchPredictions();
    });
  }

  // Phase 2 — badge styles for each status
  function getBadgeStyle(status) {
    if (status === "On Track") {
      return { backgroundColor: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" };
    } else if (status === "At Risk") {
      return { backgroundColor: "#fef3c7", color: "#b45309", border: "1px solid #fde68a" };
    } else {
      return { backgroundColor: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca" };
    }
  }

  function getBadgeIcon(status) {
    if (status === "On Track") return "✅";
    if (status === "At Risk") return "⚠️";
    return "🔴";
  }

  return (
    <div style={{ backgroundColor: "#f5ebe0", minHeight: "100vh", fontFamily: "Arial" }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: "#7f5539", padding: "20px 40px" }}>
        <h1 style={{ color: "white", margin: 0 }}>Onboard AI — Employees</h1>
      </nav>

      {/* PHASE 2 — AI SUMMARY BAR */}
      {summary && (
        <div style={{ backgroundColor: "white", margin: "30px 40px 0 40px", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <span style={{ fontWeight: "bold", color: "#7f5539", fontSize: "16px" }}>
            🤖 AI Onboarding Overview
          </span>
          <span style={{ backgroundColor: "#dcfce7", color: "#15803d", padding: "6px 14px", borderRadius: "999px", fontWeight: "bold", fontSize: "14px" }}>
            ✅ On Track: {summary["On Track"]}
          </span>
          <span style={{ backgroundColor: "#fef3c7", color: "#b45309", padding: "6px 14px", borderRadius: "999px", fontWeight: "bold", fontSize: "14px" }}>
            ⚠️ At Risk: {summary["At Risk"]}
          </span>
          <span style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "6px 14px", borderRadius: "999px", fontWeight: "bold", fontSize: "14px" }}>
            🔴 Delayed: {summary["Delayed"]}
          </span>
          <button
            onClick={fetchPredictions}
            style={{ marginLeft: "auto", backgroundColor: "#7f5539", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}
          >
            ↻ Refresh
          </button>
        </div>
      )}

      {/* ADD EMPLOYEE FORM */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2 style={{ color: "#7f5539" }}>Add New Employee</h2>
        <input
          placeholder="Employee Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "10px", margin: "10px", borderRadius: "8px", border: "1px solid #ccc", width: "200px" }}
        />
        <input
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          style={{ padding: "10px", margin: "10px", borderRadius: "8px", border: "1px solid #ccc", width: "200px" }}
        />
        <br />
        <button
          onClick={addEmployee}
          style={{ backgroundColor: "#7f5539", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", marginTop: "10px", fontSize: "16px" }}
        >
          Add Employee
        </button>
      </div>

      {/* EMPLOYEE LIST */}
      <div style={{ marginTop: "40px", padding: "0 40px" }}>
        <h2 style={{ color: "#7f5539", textAlign: "center" }}>All Employees</h2>
        {employees.length === 0 ? (
          <p style={{ textAlign: "center" }}>No employees yet.</p>
        ) : (
          employees.map((emp) => {
            const prediction = predictions[emp.id];
            return (
              <div
                key={emp.id}
                style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
              >
                <div>
                  {/* PHASE 2 — AI STATUS BADGE */}
                  {prediction && (
                    <span style={{ ...getBadgeStyle(prediction.status), padding: "4px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: "bold", display: "inline-block", marginBottom: "8px" }}>
                      {getBadgeIcon(prediction.status)} {prediction.status}
                    </span>
                  )}
                  <h3 style={{ margin: 0, color: "#7f5539" }}>{emp.name}</h3>
                  <p style={{ margin: 0 }}>Department: {emp.department}</p>
                  <p style={{ margin: 0 }}>Status: {emp.status}</p>
                </div>
                <button
                  onClick={() => deleteEmployee(emp.id)}
                  style={{ backgroundColor: "#e76f51", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

export default Employees;