import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import "./Bookings.css";

// PUBLIC_INTERFACE
export default function BookingDetails() {
  /** Shows details for a single booking, allows cancellation. */
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");

  const load = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await api.getBookingById(bookingId);
      setBooking(res);
    } catch (e) {
      setError(e.message || "Failed to load booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const onCancel = async () => {
    try {
      setCancelError("");
      await api.cancelBooking(bookingId);
      await load();
    } catch (e) {
      setCancelError(e.message || "Failed to cancel booking");
    }
  };

  return (
    <section className="bookings-root">
      <h2>Booking Details</h2>
      {loading && <div className="muted">Loading...</div>}
      {error && <div className="alert error">{error}</div>}
      {booking && (
        <div className="booking-detail-card">
          <div className="row">
            <div className="label">Booking ID</div>
            <div className="value">{booking.id}</div>
          </div>
          <div className="row">
            <div className="label">Event</div>
            <div className="value">{booking.eventTitle || "-"}</div>
          </div>
          <div className="row">
            <div className="label">Seats</div>
            <div className="value">
              {Array.isArray(booking.seats) ? booking.seats.join(", ") : "-"}
            </div>
          </div>
          <div className="row">
            <div className="label">Status</div>
            <div className="value"><strong>{booking.status || "-"}</strong></div>
          </div>
          <div className="row">
            <div className="label">Total</div>
            <div className="value">${Number(booking.total || 0).toFixed(2)}</div>
          </div>
          {cancelError && <div className="alert error">{cancelError}</div>}
          {booking.status !== "cancelled" && (
            <div className="actions">
              <button className="btn-danger" onClick={onCancel}>Cancel booking</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
