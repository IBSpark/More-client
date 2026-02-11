import React from "react";
import { motion } from "framer-motion";
import "./About.css";

export default function About() {
  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="about-wrapper">

        <h1 className="about-heading">About AI Voice Generator</h1>

        <div className="about-content">
            

          <div className="about-image">
            <img src="/images/Ai2.jpg" alt="About AI Voice Generator" />
          </div>

          <div className="about-text">
            <p className="about-intro">
              AI Voice Generator is a modern web application that converts text
              into high-quality, natural-sounding voice using artificial
              intelligence technology.
            </p>

            <div className="about-section">
              <h3>Our Mission</h3>
              <p>
                Our mission is to make voice technology simple, fast, and
                accessible for everyone.
              </p>
            </div>

            <div className="about-section">
              <h3>What We Offer</h3>
              <ul>
                <li>High-quality AI voice generation</li>
                <li>Secure user authentication</li>
                <li>Modern and responsive design</li>
                <li>Fast cloud-based processing</li>
              </ul>
            </div>
          </div>

        </div>

        <div className="about-footer">
          <p>© {new Date().getFullYear()} AI Voice Generator</p>
        </div>

      </div>
    </motion.div>
  );
}
