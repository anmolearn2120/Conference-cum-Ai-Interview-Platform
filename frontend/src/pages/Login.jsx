import { useContext, useState, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";

import { useNavigate, Link } from "react-router-dom";
import { motion, useMotionValue, useMotionTemplate, useInView } from "framer-motion";
import "../styles/Auth.css";

import { loginWithPassword, sendLoginOtp, verifyLoginOtp, googleLogin } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import AuthVisual from "../components/AuthVisual";
import OtpInput from "../components/OtpInput";


export default function Login() {

  const navigate = useNavigate();
  const [formData, setformData] = useState({
    email: "",
    password: "",
    otp: ""

  });

  const [isotpmode, setisotpmode] = useState(false);
  const [otpsent, setotpsent] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleloginwithPassword = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror("");
    try {
      const response = await loginWithPassword({
        email: formData.email,
        password: formData.password
      })

      login(response.data);
      navigate("/dashboard");

    }
    catch (err) {
      seterror(err.response?.data?.message || " Login With Password Failed ");
    }

    setloading(false);
  }

  const handleSendOtp = async () => {

    setloading(true);
    seterror("");

    try {
      await sendLoginOtp({
        email: formData.email
      })

      setotpsent(true);


    }
    catch (err) {
      seterror(err.response?.data?.message || "Send OTP Failed");
    }
    setloading(false);
  }


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror("");
    try {

      const response = await verifyLoginOtp({
        email: formData.email,
        otp: formData.otp
      })

      login(response.data);
      navigate("/dashboard");

    } catch (err) {
      seterror(err.response?.data?.message || "OTP verification Failed");

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
            <h2 className="auth-heading">
              {isotpmode ? "Sign in with OTP" : "Welcome back"}
            </h2>
            <p className="auth-subtext">
              {isotpmode
                ? "Enter your email to receive a one-time code"
                : "Sign in to continue to MeetPro"}
            </p>
          </RevealField>

          <RevealField delay={0.08}>
            <p className="auth-render-note">
              This project is deployed on Render, so the backend can take a few
              seconds to wake up. After clicking the Log In or Sign Up button,
              please wait a moment before trying again.
            </p>
          </RevealField>

          {error && <div className="auth-error">{error}</div>}

          {/* Password login */}
          {!isotpmode && (
            <>
              <form className="auth-form" onSubmit={handleloginwithPassword}>
                <RevealField delay={0.1}>
                  <GlowInput>
                    <input
                      className="auth-input"
                      name="email"
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </GlowInput>
                </RevealField>

                <RevealField delay={0.15}>
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

                <RevealField delay={0.2}>
                  <div className="auth-links-row">
                    <span className="auth-link">Forgot password?</span>
                    <span
                      className="auth-link auth-link--accent"
                      onClick={() => setisotpmode(true)}
                    >
                      Login with OTP
                    </span>
                  </div>
                </RevealField>

                <RevealField delay={0.25}>
                  <button className="auth-btn" type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </RevealField>
              </form>
              <RevealField delay={0.28}>
                <div style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}>
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => console.log("Google Login Failed")}
                  />
                </div>
              </RevealField>
            </>
          )}

          {/* OTP login */}
          {isotpmode && (
            <>
              {!otpsent ? (
                <div className="auth-form">
                  <RevealField delay={0.1}>
                    <GlowInput>
                      <input
                        className="auth-input"
                        name="email"
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </GlowInput>
                  </RevealField>

                  <RevealField delay={0.15}>
                    <button
                      className="auth-btn"
                      onClick={handleSendOtp}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  </RevealField>

                  <RevealField delay={0.2}>
                    <span
                      className="auth-back-link"
                      onClick={() => { setisotpmode(false); setotpsent(false); }}
                    >
                      Back to password login
                    </span>
                  </RevealField>
                </div>
              ) : (
                <form className="auth-form" onSubmit={handleVerifyOtp}>
                  <RevealField delay={0.05}>
                    <p className="auth-otp-hint">
                      A code was sent to <strong>{formData.email}</strong>
                    </p>
                  </RevealField>

                  <RevealField delay={0.1}>
                    <OtpInput
                      onComplete={(otp) => {
                        setformData(prev => ({ ...prev, otp }));
                        handleVerifyOtp({ preventDefault: () => { } });
                      }}
                    />
                  </RevealField>
                </form>
              )}
              <RevealField delay={0.28}>
                <div style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}>
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => console.log("Google Login Failed")}
                  />
                </div>
              </RevealField>
            </>
          )}

          <RevealField delay={0.3}>
            <p className="auth-switch">
              Don have an account? <Link to="/signup">Sign up</Link>
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
