import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import "./Bookings.css";

// PUBLIC_INTERFACE
export default function BookingsList() {
  /** Lists all bookings for the current user */
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError("");
        setLoading(true);
        const res = await api.getMyBookings();
        if (!mounted) return;
        setBookings(Array.isArray(res) ? res : (res?.items || []));
      } catch (e) {
        setError(e.message || "Failed to load bookings");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <section className="bookings-root">
      <h2>My Bookings</h2>
      {loading && <div className="muted">Loading...</div>}
      {error && <div className="alert error">{error}</div>}
      {!loading && bookings.length === 0 && <div className="muted">No bookings yet.</div>}
      <div className="booking-list">
        {bookings.map((b) => (
          <article key={b.id} className="booking-card">
            <div className="title">{b.eventTitle || `Booking ${b.id}`}</div>
            <div className="meta">{b.date ? new Date(b.date).toLocaleString() : "-"}</div>
            <div className="status">Status: <strong>{b.status || "confirmed"}</strong></div>
            <div className="actions">
              <Link to={`/bookings/${b.id}`} className="btn-secondary">View</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
