/**
 * Minimal API client using fetch with JSON and token support.
 * Reads base URL from REACT_APP_API_BASE_URL.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Get stored auth token (if any).
 */
function getToken() {
  try {
    return localStorage.getItem("auth_token") || "";
  } catch {
    return "";
  }
}

/**
 * Create headers including JSON and Authorization (if token exists).
 */
function createHeaders(extra = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...extra,
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Generic request wrapper.
 */
async function request(path, options = {}) {
  if (!API_BASE_URL) {
    console.warn("REACT_APP_API_BASE_URL is not set. Using relative paths may fail.");
  }
  const url = `${API_BASE_URL || ""}${path}`;
  const resp = await fetch(url, options);
  const contentType = resp.headers.get("content-type") || "";
  let data = null;
  if (contentType.includes("application/json")) {
    data = await resp.json();
  } else {
    data = await resp.text();
  }

  if (!resp.ok) {
    const message = (data && data.message) || `Request failed: ${resp.status}`;
    const error = new Error(message);
    error.status = resp.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export const api = {
  // PUBLIC_INTERFACE
  async login(email, password) {
    return request("/auth/login", {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({ email, password }),
    });
  },
  // PUBLIC_INTERFACE
  async register(name, email, password) {
    return request("/auth/register", {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
  },
  // PUBLIC_INTERFACE
  async me() {
    return request("/auth/me", {
      method: "GET",
      headers: createHeaders(),
    });
  },
  // PUBLIC_INTERFACE
  async searchEvents(query, fromDate, toDate, location) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
    if (location) params.set("location", location);
    return request(`/events/search?${params.toString()}`, {
      method: "GET",
      headers: createHeaders(),
    });
  },
  // PUBLIC_INTERFACE
  async getEventById(eventId) {
    return request(`/events/${eventId}`, { headers: createHeaders() });
  },
  // PUBLIC_INTERFACE
  async getEventSeats(eventId) {
    return request(`/events/${eventId}/seats`, { headers: createHeaders() });
  },
  // PUBLIC_INTERFACE
  async createBooking({ eventId, seats, paymentMethod, paymentToken }) {
    return request("/bookings", {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({ eventId, seats, paymentMethod, paymentToken }),
    });
  },
  // PUBLIC_INTERFACE
  async getMyBookings() {
    return request("/bookings/me", { headers: createHeaders() });
  },
  // PUBLIC_INTERFACE
  async getBookingById(bookingId) {
    return request(`/bookings/${bookingId}`, { headers: createHeaders() });
  },
  // PUBLIC_INTERFACE
  async cancelBooking(bookingId) {
    return request(`/bookings/${bookingId}/cancel`, {
      method: "POST",
      headers: createHeaders(),
    });
  },
};
