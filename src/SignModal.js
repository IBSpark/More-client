import React from "react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import "./SignModal.css";

export default function SignModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <motion.div
        className="modal-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="modal-icon">🎙️</div>

        <h2 className="modal-title">Welcome to AI Text to Voice</h2>
        <p className="modal-subtitle">
          Sign in to continue generating AI voice
        </p>

        {/* ✅ Google OAuth (same method as SignIn.js) */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const response = await fetch(
                  `${process.env.REACT_APP_API_URL}/api/auth/google`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      token: credentialResponse.credential,
                    }),
                  }
                );

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.message);
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem(
                  "user",
                  JSON.stringify(data.user)
                );

                window.location.href = "/dashboard";
              } catch (err) {
                alert("Google login failed");
              }
            }}
            onError={() => {
              alert("Google Sign-In failed");
            }}
          />
        </div>

        <button className="oauth-btn apple">
           Continue with Apple
        </button>

        <p className="terms">
          By signing in, you agree to our Terms & Privacy Policy
        </p>

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </motion.div>
    </div>
  );
}