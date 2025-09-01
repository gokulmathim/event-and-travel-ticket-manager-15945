/**
 * Booking context to hold active selection and progress through booking flow.
 */
import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext(null);

// PUBLIC_INTERFACE
export function useBooking() {
  /** Access the booking context. */
  return useContext(BookingContext);
}

// PUBLIC_INTERFACE
export function BookingProvider({ children }) {
  /**
   * Tracks selected event, seats, and tentative booking data through the flow.
   */
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentToken, setPaymentToken] = useState("");

  const reset = () => {
    setSelectedEvent(null);
    setSelectedSeats([]);
    setPaymentMethod("card");
    setPaymentToken("");
  };

  const value = {
    selectedEvent,
    setSelectedEvent,
    selectedSeats,
    setSelectedSeats,
    paymentMethod,
    setPaymentMethod,
    paymentToken,
    setPaymentToken,
    reset,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
