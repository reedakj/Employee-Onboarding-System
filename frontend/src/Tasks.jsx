import { useState, useEffect } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  function fetchTasks() {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }

  function addTask() {
    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_name: taskName, description: description, status: "Pending" }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchTasks();
        setTaskName("");
        setDescription("");
      });
  }

  function deleteTask(id) {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    }).then(() => fetchTasks());
  }

  // Phase 2 — update task status
  function updateStatus(id, newStatus) {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then(() => fetchTasks());
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

  return (
    <div style={{ backgroundColor: "#f5ebe0", minHeight: "100vh", fontFamily: "Arial" }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: "#7f5539", padding: "20px 40px" }}>
        <h1 style={{ color: "white", margin: 0 }}>Onboard AI — Tasks</h1>
      </nav>

      {/* ADD TASK FORM */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2 style={{ color: "#7f5539" }}>Add New Task</h2>
        <input
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          style={{ padding: "10px", margin: "10px", borderRadius: "8px", border: "1px solid #ccc", width: "200px" }}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "10px", margin: "10px", borderRadius: "8px", border: "1px solid #ccc", width: "200px" }}
        />
        <br />
        <button
          onClick={addTask}
          style={{ backgroundColor: "#7f5539", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", marginTop: "10px", fontSize: "16px" }}
        >
          Add Task
        </button>
      </div>

      {/* TASK LIST */}
      <div style={{ marginTop: "40px", padding: "0 40px" }}>
        <h2 style={{ color: "#7f5539", textAlign: "center" }}>All Tasks</h2>
        {tasks.length === 0 ? (
          <p style={{ textAlign: "center" }}>No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", marginBottom: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, color: "#7f5539" }}>{task.task_name}</h3>
                  <p style={{ margin: "4px 0" }}>Description: {task.description}</p>
                  <span style={getStatusStyle(task.status)}>{task.status}</span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ backgroundColor: "#e76f51", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>

              {/* Phase 2 — Status update buttons */}
              <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => updateStatus(task.id, "Pending")}
                  style={{ backgroundColor: task.status === "Pending" ? "#b45309" : "#fef3c7", color: task.status === "Pending" ? "white" : "#b45309", border: "1px solid #fde68a", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
                >
                  Pending
                </button>
                <button
                  onClick={() => updateStatus(task.id, "In Progress")}
                  style={{ backgroundColor: task.status === "In Progress" ? "#1d4ed8" : "#dbeafe", color: task.status === "In Progress" ? "white" : "#1d4ed8", border: "1px solid #bfdbfe", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateStatus(task.id, "Completed")}
                  style={{ backgroundColor: task.status === "Completed" ? "#15803d" : "#dcfce7", color: task.status === "Completed" ? "white" : "#15803d", border: "1px solid #bbf7d0", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
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
}

export default Tasks;