import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [language, setLanguage] = useState("");
  const [gender, setGender] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [pitch, setPitch] = useState(0);
  const [rate, setRate] = useState(1);
  const [credits, setCredits] = useState(9776);
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Logo animation
  const logoVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Auth check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/dashboard");
    }

    const savedToken = localStorage.getItem("token");
    if (!savedToken) navigate("/");
  }, [navigate]);

  // Fetch voices from backend
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/voices`
        );
        const data = await res.json();
        setVoices(data);
      } catch (err) {
        console.error("Voice fetch error:", err);
      }
    };
    fetchVoices();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Filter voices
  const filteredVoices = voices.filter((voice) => {
    return (
      (language === "" || voice.languageCodes.includes(language)) &&
      (gender === "" || voice.gender === gender)
    );
  });

  // Generate speech
  const handleGenerate = async () => {
    if (!text || !selectedVoice)
      return alert("Please enter text and select a voice.");

    if (credits <= 0) return alert("No credits remaining.");

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            text,
            voiceName: selectedVoice,
            pitch,
            rate,
          }),
        }
      );

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setAudioUrl(url);
      setCredits((prev) => prev - Math.ceil(text.length / 10));
    } catch (err) {
      console.error(err);
      alert("Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <motion.div
          className="logo"
          variants={logoVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src="/images/voicegenerator.png"
            alt="AI Voice Generator"
            className="dashboard-logo-img"
          />
          <span className="logo-text">AI Voice</span>
        </motion.div>

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
            placeholder="Start typing here or paste text to convert..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="editor-footer">
            <p>{credits} credits remaining</p>
            <p>{text.length} / 5,000 characters</p>
          </div>

          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Speech"}
          </button>

          {audioUrl && (
            <div className="audio-player">
              <h4>Generated Audio</h4>
              <audio controls src={audioUrl}></audio>
            </div>
          )}
        </div>
      </div>

      {/* SETTINGS PANEL */}
      <div className="settings-panel">
        <h3>Voice Settings</h3>

        <label>Language</label>
        <select onChange={(e) => setLanguage(e.target.value)}>
          <option value="">All</option>
          {[...new Set(voices.flatMap(v => v.languageCodes))].map((lang) => (
            <option key={lang}>{lang}</option>
          ))}
        </select>

        <label>Gender</label>
        <select onChange={(e) => setGender(e.target.value)}>
          <option value="">All</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>

        <label>Voice</label>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
        >
          <option value="">Select Voice</option>
          {filteredVoices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>

        <label>Pitch</label>
        <input
          type="range"
          min="-5"
          max="5"
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
        />

        <label>Speaking Rate</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
      </div>
    </div>
  );
}