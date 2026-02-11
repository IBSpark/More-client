import React from "react";
import './style.css';
import './App.css';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  // Variants for the page fade-in
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  // Variants for staggered child animations
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
          <Link to="/signin" className="sign-in">Sign In</Link>
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
          <Link to="/aivoice"><motion.button className="btn btn-primary" variants={childVariants}>
            Generate AI Voice
          </motion.button></Link>

          <motion.div variants={childVariants}>
            <Link to="/manageaccount" className="btn btn-secondary">
              Manage Account
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
} 