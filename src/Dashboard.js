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

  const [credits, setCredits] = useState(0);

  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const logoVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  /* AUTH CHECK */

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


  /* FETCH VOICES */

  useEffect(() => {

    const fetchVoices = async () => {

      try {

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/voices`);
        const data = await res.json();

        setVoices(data);

        if (data.length > 0) {
          setSelectedVoice(data[0].name);
        }

      } catch (err) {
        console.error("Voice fetch error:", err);
      }

    };

    fetchVoices();

  }, []);


  /* FETCH USER CREDITS */

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/user`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        if (data?.credits !== undefined) {
          setCredits(data.credits);
        }

      } catch (err) {
        console.error("User fetch error:", err);
      }

    };

    fetchUser();

  }, []);


  /* LOGOUT */

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  /* FILTER VOICES */

  const filteredVoices = voices.filter((voice) => {
    return (
      (language === "" || voice.languageCodes.includes(language)) &&
      (gender === "" || voice.gender === gender)
    );
  });


  /* PREVIEW VOICE */

  const handlePreview = async () => {

    if (!selectedVoice) return;

    try {

      setPreviewLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            text: "This is a preview of the selected voice.",
            voiceName: selectedVoice,
            pitch,
            rate,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {

        const audio = new Audio(data.audioUrl);
        audio.play();

      }

    } catch (err) {

      console.error(err);
      alert("Preview failed");

    } finally {

      setPreviewLoading(false);

    }

  };


  /* GENERATE VOICE */

  const handleGenerate = async () => {

    if (!text || !selectedVoice) {
      alert("Enter text and select voice.");
      return;
    }

    if (text.length > 5000) {
      alert("Text exceeds 5000 characters.");
      return;
    }

    if (credits <= 0) {
      alert("No credits remaining.");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            text,
            voiceName: selectedVoice,
            pitch,
            rate,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {

        setAudioUrl(data.audioUrl);

        setCredits(prev =>
          prev - Math.ceil(text.length / 10)
        );

      } else {

        alert(data.message || "Generation failed");

      }

    } catch (err) {

      console.error(err);
      alert("Generation failed");

    } finally {

      setLoading(false);

    }

  };


  /* UI */

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

          <span className="logo-text">AI Voice</span>

        </motion.div>

        <nav className="menu">

          <p className="active" onClick={() => navigate("/dashboard")}>
            Home
          </p>

          <p onClick={() => navigate("/history")}>
            History
          </p>

          <p onClick={() => navigate("/settings")}>
            Settings
          </p>

          <p
            className="upgrade"
            onClick={() => navigate("/pricing")}
          >
            Upgrade
          </p>

        </nav>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>


      {/* MAIN */}

      <div className="main-content">

        <div className="editor-box">

          <textarea
            placeholder="Start typing or paste text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="editor-footer">

            <p>{credits} credits remaining</p>

            <p>{text.length} / 5000 characters</p>

          </div>

          <div className="char-progress">

            <div
              className="char-bar"
              style={{
                width: `${(text.length / 5000) * 100}%`
              }}
            ></div>

          </div>

          <div className="action-buttons">

            <button
              className="preview-btn"
              onClick={handlePreview}
              disabled={previewLoading}
            >
              {previewLoading ? "Previewing..." : "Preview Voice"}
            </button>

            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Speech"}
            </button>

          </div>


          {audioUrl && (

            <div className="audio-player">

              <h4>Generated Audio</h4>

              <audio controls src={audioUrl}></audio>

              <a
                href={audioUrl}
                download="ai-voice.mp3"
              >
                <button className="download-btn">
                  Download
                </button>
              </a>

            </div>

          )}

        </div>

      </div>


      {/* SETTINGS */}

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

          {filteredVoices.map((voice) => (

            <option
              key={voice.name}
              value={voice.name}
            >

              {voice.name} ({voice.gender})

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