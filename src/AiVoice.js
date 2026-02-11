import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AiVoice.css";

export default function AIVoiceGenerator() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("female");
  const [language, setLanguage] = useState("en");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }

    setError("");
    setLoading(true);
    setAudioUrl("");

    try {
      const response = await fetch(
        "https://vercel.com/ibsparks-projects/more", // 🔁 replace with real backend
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voice, language }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Generation failed");
      }

      setAudioUrl(data.audioUrl);
    } catch (err) {
      setError(err.message || "Failed to generate voice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="ai-voice-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Generate AI Voice
      </motion.h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your text here..."
      />

      <div className="options">
        <select value={voice} onChange={(e) => setVoice(e.target.value)}>
          <option value="female">Female Voice</option>
          <option value="male">Male Voice</option>
        </select>

        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </select>
      </div>

      <motion.button
        onClick={handleGenerate}
        disabled={loading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? "Generating..." : "Generate Voice"}
      </motion.button>

      <AnimatePresence>
        {error && (
          <motion.p
            className="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {audioUrl && (
          <motion.div
            className="audio-player"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <audio controls src={audioUrl} />
            <a href={audioUrl} download="ai-voice.mp3">
              Download Audio
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
