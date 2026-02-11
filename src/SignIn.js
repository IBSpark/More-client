import React, { useState } from "react";
import "./SignIn.css";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async () => {
    if (loading) return;
    setError("");

    if (isSignup && !name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const endpoint = isSignup ? "/signup" : "/login";
    const url = `${process.env.REACT_APP_API_URL}${endpoint}`;

    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isSignup && { name }),
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setName("");
      setEmail("");
      setPassword("");

      navigate("/");
    } catch (err) {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="main">
        <motion.div className="container">
          <motion.h2>{isSignup ? "Sign Up" : "Login"}</motion.h2>

          {isSignup && (
            <motion.input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <motion.div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={`bi ${
                showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
              } password-eye`}
              onClick={() => setShowPassword(!showPassword)}
            />
          </motion.div>

          {error && <p className="error">{error}</p>}

          <motion.button onClick={handleSubmit} disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </motion.button>

          <motion.p className="toggle">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <span onClick={() => setIsSignup(false)}>Sign In</span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span onClick={() => setIsSignup(true)}>Sign Up</span>
              </>
            )}
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
