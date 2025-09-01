/**
 * App entry: sets theme variables, renders navbar and page routes.
 * Provides authentication and booking contexts.
 */
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { setCSSVariables } from "./theme";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";

import Navbar from "./components/Navbar";
import EventSearch from "./components/EventSearch";
import EventDetails from "./components/EventDetails";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import BookingsList from "./components/BookingsList";
import BookingDetails from "./components/BookingDetails";

import "./App.css";

// PUBLIC_INTERFACE
function App() {
  /** Root application component providing context and routes. */
  useEffect(() => {
    const run = async () => {
      try {
        await setCSSVariables();
      } catch (_) {
        // ignore theming errors; CSS falls back to defaults via CSS vars in index.css
      }
    };
    run();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<EventSearch />} />
              <Route path="/events/:eventId" element={<EventDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/bookings" element={<BookingsList />} />
              <Route path="/bookings/:bookingId" element={<BookingDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
