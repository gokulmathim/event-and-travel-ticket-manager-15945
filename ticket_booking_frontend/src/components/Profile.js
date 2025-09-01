import React from "react";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

// PUBLIC_INTERFACE
export default function Profile() {
  /** Simple profile view for the current user */
  const { user } = useAuth();

  if (!user) {
    return (
      <section className="profile-root">
        <div className="muted">You are not logged in.</div>
      </section>
    );
  }

  return (
    <section className="profile-root">
      <div className="card">
        <h2>Profile</h2>
        <div className="row">
          <span className="label">Name</span>
          <span className="value">{user.name || "-"}</span>
        </div>
        <div className="row">
          <span className="label">Email</span>
          <span className="value">{user.email || "-"}</span>
        </div>
      </div>
    </section>
  );
}
