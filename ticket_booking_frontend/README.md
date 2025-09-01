# Ticket Booking Frontend (React)

A modern, clean, responsive web app for searching events, selecting seats, booking tickets, managing bookings, and viewing history. Uses a light theme with:
- Primary: #1565c0
- Secondary: #43a047
- Accent: #ffca28

## Features
- User authentication (login/register, token stored in localStorage)
- Search & Browse events with filters (query, location, date range)
- View Event details with interactive seat selection grid, cart, and totals
- Booking & Checkout workflow with payment method and token capture (mock integration)
- Booking creation, listing, details view, and cancellation
- User Dashboard: Profile and My Bookings pages
- Responsive layout, modern styling with CSS variables
- Environment-based configuration
- Optional Figma design token theming via a JSON file

## Environment Variables
Copy `.env.example` to `.env` and set:
- `REACT_APP_API_BASE_URL` - Base URL for the backend API (e.g., http://localhost:4000/api)
- `REACT_APP_PAYMENT_PUBLIC_KEY` - Publishable key for your payment provider (used by the client side if integrating a real SDK)
- `REACT_APP_SITE_URL` - Site URL for email/redirect flows (optional)
- `REACT_APP_FIGMA_THEME_ENABLED` - Set to `true` to enable Figma-based theming

## Figma Theming
If `REACT_APP_FIGMA_THEME_ENABLED=true`, the app will map tokens from the provided Figma design system JSON (in `figmafiles/`) into CSS variables at runtime.
- Fallbacks are used if tokens are missing or mapping fails.
- If mapping fails, the default theme remains active.

## Development
- `npm start` - Start the dev server (http://localhost:3000)
- `npm test` - Run tests
- `npm run build` - Build for production

## Backend Endpoints Expected
- POST /auth/login
- POST /auth/register
- GET /auth/me
- GET /events/search
- GET /events/:id
- GET /events/:id/seats
- POST /bookings
- GET /bookings/me
- GET /bookings/:id
- POST /bookings/:id/cancel

## Payment Notes
Replace the mock payment token input in Checkout with your provider's client SDK as needed. Keep secret keys on the server only and use `REACT_APP_PAYMENT_PUBLIC_KEY` for publishable client-side keys.
