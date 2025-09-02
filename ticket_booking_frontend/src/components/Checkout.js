import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import "./Checkout.css";

// PUBLIC_INTERFACE
export default function Checkout() {
  /**
   * Checkout screen: shows selected seats, captures payment method,
   * and triggers booking creation with the backend. Payment tokenization
   * is mocked via a simple form; a real integration should be handled by the backend + provider SDK.
   */
  const { selectedEvent, selectedSeats, paymentMethod, setPaymentMethod, paymentToken, setPaymentToken, reset } =
    useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const seatCount = selectedSeats.length;
  const pricePerSeat = useMemo(() => (selectedEvent?.price ? Number(selectedEvent.price) : 49), [selectedEvent]);
  const total = pricePerSeat * seatCount;

  if (!selectedEvent) {
    return (
      <section className="checkout-root">
        <div className="muted">No event selected. Go back to browse events.</div>
      </section>
    );
  }

  const onPlaceOrder = async () => {
    if (!user) {
      navigate("/login", { state: { redirectTo: "/checkout" } });
      return;
    }
    if (!paymentToken) {
      setError("Please enter your payment details to continue.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.createBooking({
        eventId: selectedEvent.id,
        seats: selectedSeats.map((s) => s.id),
        paymentMethod,
        paymentToken,
      });
      reset();
      navigate(`/bookings/${res.id || res.bookingId || "success"}`);
    } catch (e) {
      setError(e.message || "Failed to complete booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout-root">
      <div className="checkout-grid">
        <div className="checkout-main">
          <h2>Checkout</h2>
          <div className="summary">
            <div>
              <div className="muted">Event</div>
              <div className="value">{selectedEvent.title}</div>
            </div>
            <div>
              <div className="muted">Seats</div>
              <div className="value">{seatCount} seat(s)</div>
            </div>
            <div>
              <div className="muted">Price</div>
              <div className="value">${pricePerSeat.toFixed(2)}</div>
            </div>
            <div>
              <div className="muted">Total</div>
              <div className="value strong">${total.toFixed(2)}</div>
            </div>
          </div>

          <h3>Payment</h3>
          <div className="payment">
            <div className="method">
              <label className={paymentMethod === "card" ? "active" : ""}>
                <input
                  type="radio"
                  name="method"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Card
              </label>
              <label className={paymentMethod === "wallet" ? "active" : ""}>
                <input
                  type="radio"
                  name="method"
                  checked={paymentMethod === "wallet"}
                  onChange={() => setPaymentMethod("wallet")}
                />
                Wallet
              </label>
            </div>
            <div className="token">
              <input
                placeholder="Payment token or mock card: 4242 4242 4242 4242"
                value={paymentToken}
                onChange={(e) => setPaymentToken(e.target.value)}
              />
              <div className="help">
                Note: In production, use your payment provider SDK (publishable key via REACT_APP_PAYMENT_PUBLIC_KEY) and
                tokenize on the client. Private keys must remain on the backend.
              </div>
            </div>
          </div>

          {error && <div className="alert error">{error}</div>}

          <div className="actions">
            <button className="btn-secondary" onClick={() => navigate(-1)}>Back</button>
            <button className="btn-primary" onClick={onPlaceOrder} disabled={loading}>
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
