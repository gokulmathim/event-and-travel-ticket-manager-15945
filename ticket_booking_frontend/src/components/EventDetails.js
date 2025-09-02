import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";
import "./EventDetails.css";

// Basic seat map renderer (grid-based)
function Seat({ seat, selected, onToggle }) {
  const status = seat.status || "available"; // available, reserved, taken
  let className = "seat";
  className += ` ${status}`;
  if (selected) className += " selected";
  const disabled = status !== "available";
  return (
    <button
      disabled={disabled}
      className={className}
      onClick={() => onToggle(seat)}
      aria-pressed={selected}
      aria-label={`Seat ${seat.row}${seat.number} - ${status}`}
      title={`Seat ${seat.row}${seat.number} - ${status}`}
    >
      {seat.row}{seat.number}
    </button>
  );
}

// PUBLIC_INTERFACE
export default function EventDetails() {
  /** Event detail page with seat selection UI and booking actions. */
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedSeats, setSelectedSeats, setSelectedEvent } = useBooking();

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [seats, setSeats] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError("");
        setLoading(true);
        const ev = await api.getEventById(eventId);
        const st = await api.getEventSeats(eventId);
        if (!mounted) return;
        setEventData(ev);
        setSeats(Array.isArray(st) ? st : (st?.seats || []));
        setSelectedEvent(ev);
      } catch (e) {
        setError(e.message || "Failed to load event");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const pricePerSeat = useMemo(() => {
    if (eventData?.price) return Number(eventData.price);
    return 49.0;
  }, [eventData]);

  const total = pricePerSeat * selectedSeats.length;

  const toggleSeat = (seat) => {
    const exists = selectedSeats.find((s) => s.id === seat.id);
    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const proceedToCheckout = () => {
    if (!user) {
      navigate("/login", { state: { redirectTo: `/events/${eventId}` } });
      return;
    }
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat to continue.");
      return;
    }
    navigate("/checkout");
  };

  return (
    <section className="details-root">
      {loading && <div className="muted">Loading...</div>}
      {error && <div className="alert error">{error}</div>}
      {!loading && eventData && (
        <div className="details-grid">
          <div className="details-main">
            <h2>{eventData.title}</h2>
            <div className="meta">
              <span>{eventData.location || "TBA"}</span>
              <span>•</span>
              <span>{eventData.date ? new Date(eventData.date).toLocaleString() : "TBA"}</span>
            </div>
            <p className="desc">{eventData.description || "No description available."}</p>

            <h3>Select Seats</h3>
            <div className="seat-legend">
              <span><span className="legend-box available" /> Available</span>
              <span><span className="legend-box reserved" /> Reserved</span>
              <span><span className="legend-box taken" /> Taken</span>
              <span><span className="legend-box selected" /> Selected</span>
            </div>

            <div className="seat-map" role="grid" aria-label="Seat map">
              {seats.map((seat) => {
                const isSelected = !!selectedSeats.find((s) => s.id === seat.id);
                return (
                  <Seat
                    key={seat.id}
                    seat={seat}
                    selected={isSelected}
                    onToggle={toggleSeat}
                  />
                );
              })}
            </div>
          </div>
          <aside className="details-aside">
            <div className="cart">
              <h4>Selected Seats</h4>
              {selectedSeats.length === 0 ? (
                <div className="muted">No seats selected.</div>
              ) : (
                <ul>
                  {selectedSeats.map((s) => (
                    <li key={s.id}>{s.row}{s.number}</li>
                  ))}
                </ul>
              )}
              <div className="total">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <button className="btn-primary" onClick={proceedToCheckout}>Proceed to Checkout</button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
