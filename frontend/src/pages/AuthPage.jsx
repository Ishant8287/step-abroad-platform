import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setSession } from "../lib/auth";
import "./AuthPage.css";

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

  const renderFormFields = () => (
    <>
      <div className="auth-brand">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#2563eb" />
          <path d="M2 17L12 22L22 17" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        StepAbroad
      </div>
      <div className="auth-header">
        <h1>{isRegister ? "Create Account" : "Welcome Back"}</h1>
        <p>
          {isRegister
            ? "Join us to find your dream university."
            : "Sign in to access your dashboard."}
        </p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={submit}>
        {isRegister && (
          <div className="auth-form-group">
            <label htmlFor="auth-fullname">Full Name</label>
            <input
              id="auth-fullname"
              className="auth-input"
              placeholder="Jane Doe"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
        )}

        <div className="auth-form-group">
          <label htmlFor="auth-email">Email Address</label>
          <input
            id="auth-email"
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 8 characters"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ paddingRight: "40px" }}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        {isRegister && (
          <div className="auth-form-group">
            <label>I am a</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${form.role === "student" ? "active" : ""}`}
                onClick={() => setForm({ ...form, role: "student" })}
              >
                Student
              </button>
              <button
                type="button"
                className={`role-btn ${form.role === "counselor" ? "active" : ""}`}
                onClick={() => setForm({ ...form, role: "counselor" })}
              >
                Counselor
              </button>
            </div>
          </div>
        )}

        <button className="auth-btn" disabled={loading} type="submit">
          {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
        </button>

        {!isRegister && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <a href="#" style={{ color: "#2563eb", fontSize: "0.875rem", textDecoration: "none" }}>
              Forgot password?
            </a>
          </div>
        )}
      </form>

      <div className="auth-links">
        {isRegister ? (
          <>Already have an account? <Link to="/login">Login</Link></>
        ) : (
          <>Don't have an account? <Link to="/register">Register</Link></>
        )}
      </div>
    </>
  );

  if (isRegister) {
    return (
      <div className="auth-wrapper register-mode">
        <div className="register-left">
          <h2>Your Global Education<br/>Journey Starts Here</h2>
          <img src="/assets/register_illustration.png" alt="University Campus" />
        </div>
        <div className="register-right">
          <div style={{ maxWidth: "480px", width: "100%", margin: "0 auto" }}>
            {renderFormFields()}
          </div>
        </div>
      </div>
    );
  }

  // Login Mode
  return (
    <div className="auth-wrapper login-mode">
      <div className="login-card">
        <div className="login-left">
          <img src="/assets/login_illustration.png" alt="Globe and Travel" />
        </div>
        <div className="login-right">
          {renderFormFields()}
        </div>
      </div>
    </div>
  );
}
