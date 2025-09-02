import React from "react";
import { Link } from "react-router-dom";
import "./EventCard.css";

// PUBLIC_INTERFACE
export default function EventCard({ event }) {
  /** Card that shows event summary with CTA to view/select seats */
  return (
    <article className="event-card">
      <div className="event-card-body">
        <h3 className="event-title">{event.title || "Untitled Event"}</h3>
        <div className="event-meta">
          <span>{event.location || "TBA"}</span>
          <span>•</span>
          <span>{event.date ? new Date(event.date).toLocaleString() : "TBA"}</span>
        </div>
        <p className="event-desc">{event.description || "No description provided."}</p>
      </div>
      <div className="event-card-footer">
        <Link className="btn-primary" to={`/events/${event.id}`}>View & Select Seats</Link>
      </div>
    </article>
  );
}
