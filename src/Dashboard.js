import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [text, setText] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/dashboard");
    }

    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* LEFT SIDEBAR */}
      <div
        style={{
          width: "220px",
          background: "#f5f5f5",
          padding: "20px",
          borderRight: "1px solid #ddd",
        }}
      >
        <h3>AI TEXT TO VOICE</h3>

        <div style={{ marginTop: "30px" }}>
          <p style={{ fontWeight: "bold", background: "black", color: "white", padding: "10px", borderRadius: "8px" }}>Home</p>
          <p style={{ marginTop: "15px" }}>History</p>
          <p style={{ marginTop: "15px" }}>Settings</p>
          <p style={{ marginTop: "15px", color: "blue" }}>Upgrade</p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "40px",
            padding: "8px",
            width: "100%",
            borderRadius: "6px",
            border: "none",
            background: "#ddd",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* CENTER CONTENT */}
      <div style={{ flex: 1, padding: "40px" }}>
        <textarea
          placeholder="Start typing here or paste any text you want to convert..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            height: "300px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            padding: "20px",
            fontSize: "16px",
            resize: "none",
          }}
        />

        <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
          <p>9,776 credits remaining</p>
          <p>{text.length} / 5,000 characters</p>
        </div>

        <button
          style={{
            marginTop: "20px",
            padding: "15px 30px",
            background: "#888",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Generate speech
        </button>
      </div>

      {/* RIGHT SETTINGS PANEL */}
      <div
        style={{
          width: "300px",
          background: "#f9f9f9",
          padding: "30px",
          borderLeft: "1px solid #ddd",
        }}
      >
        <h4>Model</h4>
        <select style={{ width: "100%", padding: "8px", marginBottom: "20px" }}>
          <option>Studio</option>
        </select>

        <h4>Language</h4>
        <select style={{ width: "100%", padding: "8px", marginBottom: "20px" }}>
          <option>English (US)</option>
        </select>

        <h4>Voice</h4>
        <select style={{ width: "100%", padding: "8px", marginBottom: "20px" }}>
          <option>Sophia</option>
        </select>

        <h4>Audio Profile</h4>
        <select style={{ width: "100%", padding: "8px", marginBottom: "20px" }}>
          <option>Default</option>
        </select>

        <h4>Pitch</h4>
        <input type="range" min="-5" max="5" defaultValue="0" style={{ width: "100%" }} />

        <h4 style={{ marginTop: "20px" }}>Speaking Rate</h4>
        <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" style={{ width: "100%" }} />
      </div>
    </div>
  );
}