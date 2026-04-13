import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setSession } from "../lib/auth";

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card" onSubmit={submit}>
        <h2>{isRegister ? "Create Account" : "Login"}</h2>

        {isRegister && (
          <label>
            Full Name
            <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </label>
        )}

        <label>
          Email
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>

        <label>
          Password
          <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>

        {isRegister && (
          <label>
            Role
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="counselor">Counselor</option>
            </select>
          </label>
        )}

        {error && <p className="error">{error}</p>}

        <button disabled={loading}>{loading ? "Please wait..." : isRegister ? "Register" : "Login"}</button>

        {isRegister ? (
          <p>Already have an account? <Link to="/login">Login</Link></p>
        ) : (
          <p>No account yet? <Link to="/register">Create one</Link></p>
        )}
      </form>
    </div>
  );
}
