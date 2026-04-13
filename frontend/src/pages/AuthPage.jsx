import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { setSession } from "../lib/auth";
import "./AuthPage.css";

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });

  const isRegister = mode === "register";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = isRegister
        ? await api.register(form)
        : await api.login({ email: form.email, password: form.password });
      setSession(result.data.token, result.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ═══ LEFT — BRANDING ═══ */}
      <div className="auth-left">
        <div className="auth-left-bg">
          <div className="auth-orb auth-orb-1" />
          <div className="auth-orb auth-orb-2" />
        </div>
        <motion.div
          className="auth-left-content"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="auth-brand-logo">
            <span className="auth-brand-icon">✦</span>
            StudyVerse
          </div>
          <h1 className="auth-left-title">
            {isRegister
              ? <>Start your <span className="gradient-text">global education</span> journey</>
              : <>Welcome back to <span className="gradient-text">StudyVerse</span></>}
          </h1>
          <p className="auth-left-subtitle">
            {isRegister
              ? "Join thousands of students who found their dream university through our AI-powered platform."
              : "Track your applications, discover new programs, and get personalized recommendations."}
          </p>

          <div className="auth-left-features">
            {[
              "AI-powered university matching",
              "Application tracking & status updates",
              "Personalized program recommendations",
            ].map((feature) => (
              <div key={feature} className="auth-feature-item">
                <span className="auth-feature-check">✓</span>
                {feature}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═══ RIGHT — FORM ═══ */}
      <div className="auth-right">
        <motion.div
          className="auth-form-wrapper"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          <motion.div className="auth-form-header" variants={fadeUp}>
            <h2>{isRegister ? "Create your account" : "Sign in"}</h2>
            <p>
              {isRegister
                ? "Fill in your details to get started"
                : "Enter your credentials to access your dashboard"}
            </p>
          </motion.div>

          {/* Social buttons */}
          <motion.div className="auth-social-btns" variants={fadeUp} custom={1}>
            <button type="button" className="auth-social-btn">
              <span className="auth-social-icon">G</span>
              Google
            </button>
            <button type="button" className="auth-social-btn">
              <span className="auth-social-icon">⌂</span>
              GitHub
            </button>
          </motion.div>

          <motion.div className="auth-divider" variants={fadeUp} custom={2}>
            or continue with email
          </motion.div>

          <form className="auth-form" onSubmit={submit}>
            {isRegister && (
              <motion.div className="form-field" variants={fadeUp} custom={3}>
                <label htmlFor="auth-fullname">Full Name</label>
                <input
                  id="auth-fullname"
                  className="input"
                  placeholder="John Doe"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </motion.div>
            )}

            <motion.div className="form-field" variants={fadeUp} custom={isRegister ? 4 : 3}>
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                className="input"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </motion.div>

            <motion.div className="form-field" variants={fadeUp} custom={isRegister ? 5 : 4}>
              <label htmlFor="auth-password">Password</label>
              <div className="password-wrapper">
                <input
                  id="auth-password"
                  className="input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: "48px" }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </motion.div>

            {isRegister && (
              <motion.div className="form-field" variants={fadeUp} custom={6}>
                <label htmlFor="auth-role">I am a</label>
                <select
                  id="auth-role"
                  className="input select"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="counselor">Counselor</option>
                </select>
              </motion.div>
            )}

            {error && (
              <motion.div
                className="auth-error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <motion.div className="auth-submit" variants={fadeUp} custom={isRegister ? 7 : 5}>
              <button className="btn btn-primary" disabled={loading} type="submit">
                {loading ? (
                  <>
                    <span className="spinner" />
                    Please wait...
                  </>
                ) : isRegister ? (
                  "Create Account →"
                ) : (
                  "Sign In →"
                )}
              </button>
            </motion.div>
          </form>

          <motion.p className="auth-footer-text" variants={fadeUp} custom={isRegister ? 8 : 6}>
            {isRegister ? (
              <>Already have an account? <Link to="/login">Sign in</Link></>
            ) : (
              <>Don't have an account? <Link to="/register">Create one</Link></>
            )}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
