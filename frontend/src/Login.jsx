import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    // Simple login check
    if (username === "admin" && password === "admin123") {
      onLogin();
    } else {
      setError("Wrong username or password!");
    }
  }

  return (
    <div style={{ backgroundColor: "#f5ebe0", minHeight: "100vh", fontFamily: "Arial" }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: "#7f5539", padding: "20px 40px" }}>
        <h1 style={{ color: "white", margin: 0 }}>Onboard AI</h1>
      </nav>

      {/* LOGIN FORM */}
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "16px", display: "inline-block", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", minWidth: "300px" }}>
          
          <h2 style={{ color: "#7f5539", marginBottom: "30px" }}>Login</h2>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: "12px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #ccc", width: "100%", fontSize: "16px", boxSizing: "border-box" }}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "12px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #ccc", width: "100%", fontSize: "16px", boxSizing: "border-box" }}
          />

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
          )}

          <button
            onClick={handleLogin}
            style={{ backgroundColor: "#7f5539", color: "white", border: "none", padding: "14px", borderRadius: "8px", width: "100%", fontSize: "16px", cursor: "pointer" }}
          >
            Login
          </button>

          <p style={{ marginTop: "20px", color: "#9c6644", fontSize: "14px" }}>
            Username: admin | Password: admin123
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;