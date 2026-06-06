import { useState, useEffect } from "react";

function Progress() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedTask, setSelectedTask] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  function fetchAll() {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data));

    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));

    fetch("http://localhost:5000/api/progress")
      .then((res) => res.json())
      .then((data) => setProgress(data));
  }

  function assignTask() {
    if (!selectedEmployee || !selectedTask) {
      alert("Please select both an employee and a task!");
      return;
    }
    fetch("http://localhost:5000/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_id: parseInt(selectedEmployee),
        task_id: parseInt(selectedTask),
        status: "Pending",
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchAll();
        setSelectedEmployee("");
        setSelectedTask("");
      });
  }

  function updateProgress(id, newStatus) {
    fetch(`http://localhost:5000/api/progress/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then(() => fetchAll());
  }

  function getTaskName(id) {
    const task = tasks.find((t) => t.id === id);
    return task ? task.task_name : "Unknown";
  }

  function getTaskDescription(id) {
    const task = tasks.find((t) => t.id === id);
    return task ? task.description : "";
  }

  function getStatusStyle(status) {
    if (status === "Completed") {
      return { backgroundColor: "#dcfce7", color: "#15803d", padding: "4px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: "bold" };
    } else if (status === "In Progress") {
      return { backgroundColor: "#dbeafe", color: "#1d4ed8", padding: "4px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: "bold" };
    } else {
      return { backgroundColor: "#fef3c7", color: "#b45309", padding: "4px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: "bold" };
    }
  }

  // Group progress by employee
  function getProgressForEmployee(employeeId) {
    return progress.filter((p) => p.employee_id === employeeId);
  }

  return (
    <div style={{ backgroundColor: "#f5ebe0", minHeight: "100vh", fontFamily: "Arial" }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: "#7f5539", padding: "20px 40px" }}>
        <h1 style={{ color: "white", margin: 0 }}>Onboard AI — Progress Tracker</h1>
      </nav>

      {/* ASSIGN TASK FORM */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2 style={{ color: "#7f5539" }}>Assign Task to Employee</h2>

        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          style={{ padding: "10px", margin: "10px", borderRadius: "8px", border: "1px solid #ccc", width: "220px", fontSize: "14px" }}
        >
          <option value="">-- Select Employee --</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
          ))}
        </select>

        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
          style={{ padding: "10px", margin: "10px", borderRadius: "8px", border: "1px solid #ccc", width: "220px", fontSize: "14px" }}
        >
          <option value="">-- Select Task --</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>{task.task_name}</option>
          ))}
        </select>

        <br />
        <button
          onClick={assignTask}
          style={{ backgroundColor: "#7f5539", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", marginTop: "10px", fontSize: "16px" }}
        >
          Assign Task
        </button>
      </div>

      {/* PROGRESS GROUPED BY EMPLOYEE */}
      <div style={{ marginTop: "40px", padding: "0 40px 40px 40px" }}>
        <h2 style={{ color: "#7f5539", textAlign: "center" }}>Employee Task Progress</h2>

        {employees.length === 0 ? (
          <p style={{ textAlign: "center" }}>No employees yet.</p>
        ) : (
          employees.map((emp) => {
            const empProgress = getProgressForEmployee(emp.id);
            const total = empProgress.length;
            const completed = empProgress.filter((p) => p.status === "Completed").length;
            const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

            return (
              <div key={emp.id} style={{ backgroundColor: "white", borderRadius: "14px", marginBottom: "24px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", overflow: "hidden" }}>

                {/* Employee header */}
                <div style={{ backgroundColor: "#7f5539", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, color: "white" }}>{emp.name}</h3>
                    <p style={{ margin: 0, color: "#ddb892", fontSize: "13px" }}>{emp.department}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, color: "white", fontWeight: "bold", fontSize: "18px" }}>{completed}/{total} tasks done</p>
                    <p style={{ margin: 0, color: "#ddb892", fontSize: "13px" }}>{percent}% complete</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ backgroundColor: "#f0e6da", height: "10px" }}>
                  <div style={{ backgroundColor: percent === 100 ? "#15803d" : percent >= 50 ? "#f59e0b" : "#ef4444", height: "10px", width: `${percent}%`, transition: "width 0.3s" }}></div>
                </div>

                {/* Tasks list */}
                <div style={{ padding: "16px 24px" }}>
                  {total === 0 ? (
                    <p style={{ color: "#aaa", textAlign: "center" }}>No tasks assigned yet.</p>
                  ) : (
                    empProgress.map((p) => (
                      <div key={p.id} style={{ borderBottom: "1px solid #f0e6da", paddingBottom: "12px", marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: "bold", color: "#7f5539" }}>📌 {getTaskName(p.task_id)}</p>
                            <p style={{ margin: "2px 0 6px 0", fontSize: "13px", color: "#888" }}>{getTaskDescription(p.task_id)}</p>
                            <span style={getStatusStyle(p.status)}>{p.status}</span>
                          </div>
                        </div>

                        {/* Status buttons */}
                        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => updateProgress(p.id, "Pending")}
                            style={{ backgroundColor: p.status === "Pending" ? "#b45309" : "#fef3c7", color: p.status === "Pending" ? "white" : "#b45309", border: "1px solid #fde68a", padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => updateProgress(p.id, "In Progress")}
                            style={{ backgroundColor: p.status === "In Progress" ? "#1d4ed8" : "#dbeafe", color: p.status === "In Progress" ? "white" : "#1d4ed8", border: "1px solid #bfdbfe", padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                          >
                            In Progress
                          </button>
                          <button
                            onClick={() => updateProgress(p.id, "Completed")}
                            style={{ backgroundColor: p.status === "Completed" ? "#15803d" : "#dcfce7", color: p.status === "Completed" ? "white" : "#15803d", border: "1px solid #bbf7d0", padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                          >
                            ✅ Completed
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

export default Progress;