import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { palette } from "../theme";
import "./Navbar.css";

// PUBLIC_INTERFACE
export default function Navbar({ onSearch }) {
  /** Top navigation bar with app brand, search, and user menu. */
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (typeof onSearch === "function") onSearch(query);
    if (location.pathname !== "/") navigate(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="nav-root">
      <div className="nav-inner">
        <div className="nav-left">
          <Link to="/" className="brand">
            <span className="brand-mark">🎟️</span>
            <span className="brand-text">Ticketa</span>
          </Link>
        </div>
        <form className="nav-search" onSubmit={handleSearch} role="search" aria-label="Search events">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, destinations..."
            aria-label="Search"
          />
          <button type="submit" style={{ background: palette.primary }}>Search</button>
        </form>
        <nav className="nav-right">
          <Link to="/bookings" className="nav-link">My Bookings</Link>
          {user ? (
            <>
              <Link to="/profile" className="nav-link">{user.name || "Profile"}</Link>
              <button className="nav-btn" onClick={() => { logout(); navigate("/"); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
