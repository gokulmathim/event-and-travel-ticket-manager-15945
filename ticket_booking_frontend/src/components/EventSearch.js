import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import EventCard from "./EventCard";
import "./EventSearch.css";

// PUBLIC_INTERFACE
export default function EventSearch() {
  /** Displays search inputs and event results list. */
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  const runSearch = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await api.searchEvents(query, fromDate, toDate, location);
      setEvents(Array.isArray(res) ? res : (res?.items || []));
    } catch (e) {
      setError(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="search-root">
      <div className="search-filters">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <button onClick={runSearch} disabled={loading}>{loading ? "Searching..." : "Search"}</button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {!loading && events.length === 0 && <div className="muted">No events found.</div>}

      <div className="events-grid">
        {events.map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    </section>
  );
}
