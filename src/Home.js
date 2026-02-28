import React, { useState } from "react";
import './style.css';
import './App.css';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SignModal from "./SignModal"; // ✅ Added

export default function Home() {

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // ✅ Added

  // ✅ Updated Function (Login Check)
  const handleGenerateClick = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      setShowModal(true); // ✅ Open popup instead of redirect
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const childVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="home-page"
      initial="initial"
      animate="animate"
      variants={pageVariants}
      transition={{ duration: 0.6 }}
    >
      <header className="top-bar">
        <motion.div
          className="ai-logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/icon.svg`}
            alt="AI Icon"
            className="ai-icon-img"
          />
          <span className="ai-text">AI Text to Voice</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* ✅ Changed from Link to button */}
          <button className="sign-in" onClick={() => setShowModal(true)}>
            Sign In
          </button>
        </motion.div>
      </header>

      <main className="main-content">
        <motion.div
          className="center-box"
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.div className="icon" variants={childVariants}>
            🎙️
          </motion.div>

          <motion.h1 variants={childVariants}>
            What would you like to do
            <br />
            today?
          </motion.h1>

          <motion.button
            className="btn btn-primary"
            variants={childVariants}
            onClick={handleGenerateClick}
          >
            Generate AI Voice
          </motion.button>

          <motion.div variants={childVariants}>
            <Link to="/manageaccount" className="btn btn-secondary">
              Manage Account
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* ✅ Added Modal Rendering */}
      {showModal && (
        <SignModal onClose={() => setShowModal(false)} />
      )}
    </motion.div>
  );
}