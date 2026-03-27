import { useContext, useState, useRef } from "react";
import "../styles/Auth.css";
import { useNavigate, Link } from "react-router-dom";
import { motion, useMotionValue, useMotionTemplate, useInView } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

import { googleLogin, signupUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import AuthVisual from "../components/AuthVisual";


export default function Signup() {

  const [formData, setformData] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });
  const [loading, setloading] = useState(false);

  const [error, seterror] = useState("");
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setloading(true);
    seterror("");

    try {

      const response = await signupUser(formData);
      const data = response.data;

      login(data);
      navigate("/dashboard");

    }
    catch (err) {
      seterror(err.response?.data?.message || "Signup Failed");

    }
    setloading(false);
  }
  // google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await googleLogin(credentialResponse.credential);

      //  use context login
      login(response.data);

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <div className="auth-left">
        <AuthVisual />
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        <div className="auth-glow" />

        <div className="auth-card">
          <RevealField delay={0}>
            <div className="auth-brand">
              <span className="auth-brand-name">MeetPro</span>
            </div>
          </RevealField>

          <RevealField delay={0.05}>
            <h2 className="auth-heading">Create account</h2>
            <p className="auth-subtext">Join MeetPro and start collaborating</p>
          </RevealField>

          <RevealField delay={0.08}>
            <p className="auth-render-note">
              This project is deployed on Render, so the backend can take a few
              seconds to wake up. After clicking the Log In or Sign Up button,
              please wait a moment before trying again.
            </p>
          </RevealField>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <RevealField delay={0.1}>
              <GlowInput>
                <input
                  className="auth-input"
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </GlowInput>
            </RevealField>

            <RevealField delay={0.15}>
              <GlowInput>
                <input
                  className="auth-input"
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </GlowInput>
            </RevealField>

            <RevealField delay={0.2}>
              <GlowInput>
                <input
                  className="auth-input"
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </GlowInput>
            </RevealField>

            <RevealField delay={0.25}>
              <GlowInput>
                <input
                  className="auth-input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </GlowInput>
            </RevealField>

            <RevealField delay={0.3}>
              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </RevealField>
          </form>

          <RevealField delay={0.32}>
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <p style={{ marginBottom: "10px", opacity: 0.7 }}>or</p>

              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log("Google Login Failed")}
              />
            </div>
          </RevealField>

          <RevealField delay={0.35}>
            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </RevealField>
        </div>
      </div>
    </div>
  );
}

function RevealField({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <motion.div
        className="auth-reveal-box"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: [0, 1, 1, 0] } : {}}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1], times: [0, 0.4, 0.6, 1] }}
        style={{ originX: 0 }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function GlowInput({ children }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [glowVisible, setGlowVisible] = useState(false);

  const background = useMotionTemplate`radial-gradient(${glowVisible ? "80px" : "0px"} circle at ${mouseX}px ${mouseY}px, rgba(124, 91, 245, 0.25), transparent 80%)`;

  return (
    <motion.div
      className="auth-input-glow-wrap"
      onMouseMove={({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      }}
      onMouseEnter={() => setGlowVisible(true)}
      onMouseLeave={() => setGlowVisible(false)}
      style={{ background }}
    >
      {children}
    </motion.div>
  );
}
