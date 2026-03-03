import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

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
    <div className="dashboard">
      
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">🎙️ AI Voice</h2>

        <nav className="menu">
          <p className="active">Home</p>
          <p>History</p>
          <p>Settings</p>
          <p className="upgrade">Upgrade</p>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="editor-box">
          <textarea
            placeholder="Start typing here or paste any text you want to convert..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="editor-footer">
            <p>9,776 credits remaining</p>
            <p>{text.length} / 5,000 characters</p>
          </div>

          <button className="generate-btn">
            Generate Speech
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="settings-panel">
        <h3>Voice Settings</h3>

        <label>Model</label>
        <select>
          <option>Studio</option>
        </select>

        <label>Language</label>
        <select>
          <option>English (US)</option>
        </select>

        <label>Voice</label>
        <select>
          <option>Sophia</option>
        </select>

        <label>Audio Profile</label>
        <select>
          <option>Default</option>
        </select>

        <label>Pitch</label>
        <input type="range" min="-5" max="5" defaultValue="0" />

        <label>Speaking Rate</label>
        <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" />
      </div>
    </div>
  );
}