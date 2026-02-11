import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./ManageAccount.css";

export default function ManageAccount() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(storedUser?.name || "");
  const [email, setEmail] = useState(storedUser?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🔐 Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  const handleUpdate = async () => {
    setMessage("");
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email address");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword && !oldPassword) {
      setError("Old password is required");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          oldPassword,
          newPassword,
        }),
      });

      if (response.status === 401) {
        localStorage.clear();
        navigate("/signin");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Update failed");
        return;
      }

      // ✅ Update stored user
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Account updated successfully ");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError("Server not reachable");
    }
  };

  return (
    <motion.div
      className="manage-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="manage-container">
        <h2>Manage Account</h2>

        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Old Password</label>
        <div className="password-wrapper">
          <input
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <i
            className={`bi ${
              showOldPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
            }`}
            onClick={() => setShowOldPassword(!showOldPassword)}
          />
        </div>

        <label>New Password</label>
        <div className="password-wrapper">
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <i
            className={`bi ${
              showNewPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
            }`}
            onClick={() => setShowNewPassword(!showNewPassword)}
          />
        </div>

        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}

        <button className="btn-update" onClick={handleUpdate}>
          Update Account
        </button>

        <p className="back-home">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </motion.div>
  );
}
