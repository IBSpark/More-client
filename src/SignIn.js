import React, { useState, useEffect } from "react";
import "./SignIn.css";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function SignIn() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async () => {
    if (loading) return;

    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (isSignup && !trimmedName) {
      return setError("Name is required");
    }

    if (!trimmedEmail) {
      return setError("Email is required");
    }

    if (!emailRegex.test(trimmedEmail)) {
      return setError("Please enter a valid email");
    }

    if (trimmedPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    const endpoint = isSignup
      ? "/api/auth/register"
      : "/api/auth/login";

    const url = `${process.env.REACT_APP_API_URL}${endpoint}`;

    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(isSignup && { name: trimmedName }),
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (!data.token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Clear form
      setName("");
      setEmail("");
      setPassword("");

      navigate("/dashboard");

    } catch (err) {
      setError(err.message || "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="main">
        <motion.div className="container">
          <motion.h2>
            {isSignup ? "Create Account" : "Welcome Back"}
          </motion.h2>

          {isSignup && (
            <motion.input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          )}

          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          <motion.div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <i
              className={`bi ${
                showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
              } password-eye`}
              onClick={() => setShowPassword(!showPassword)}
            />
          </motion.div>

          {error && <p className="error">{error}</p>}

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Sign Up"
              : "Login"}
          </motion.button>

          {/* Google OAuth */}
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  setError("");
                  setLoading(true);

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
                    throw new Error(
                      data.message || "Google authentication failed"
                    );
                  }

                  localStorage.setItem("token", data.token);
                  localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                  );

                  navigate("/dashboard");

                } catch (err) {
                  setError("Google login failed");
                } finally {
                  setLoading(false);
                }
              }}
              onError={() => {
                setError("Google Sign-In failed");
              }}
            />
          </div>

          <motion.p className="toggle">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <span onClick={() => setIsSignup(false)}>
                  Sign In
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span onClick={() => setIsSignup(true)}>
                  Sign Up
                </span>
              </>
            )}
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}