import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Auth.css";

// PUBLIC_INTERFACE
export default function Login() {
  /** Login page */
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectTo);
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-root">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Welcome back</h2>
        <p className="muted">Sign in to continue</p>
        {error && <div className="alert error">{error}</div>}
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="btn-primary" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        <div className="switch">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </form>
    </section>
  );
}
