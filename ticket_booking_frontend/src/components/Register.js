import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration page */
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (e) {
      setError(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-root">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Create account</h2>
        <p className="muted">Join Ticketa to book your next experience</p>
        {error && <div className="alert error">{error}</div>}
        <label>
          Full name
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="btn-primary" type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
        <div className="switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </section>
  );
}
