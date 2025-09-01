/**
 * Theme variables and helpers for the app.
 * This centralizes color palette and common spacing/typography tokens.
 */
export const palette = {
  primary: "#1565c0",
  secondary: "#43a047",
  accent: "#ffca28",
  text: "#1f2937",
  textMuted: "#6b7280",
  bg: "#ffffff",
  bgSoft: "#f8fafc",
  border: "#e5e7eb",
  danger: "#e53935",
  success: "#2e7d32",
};

export const shadows = {
  sm: "0 1px 2px rgba(0,0,0,0.06)",
  md: "0 2px 6px rgba(0,0,0,0.08)",
  lg: "0 8px 20px rgba(0,0,0,0.12)",
};

export const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  pill: "999px",
};

export const spacing = (n) => `${n * 8}px`;

export const setCSSVariables = () => {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", palette.primary);
  root.style.setProperty("--color-secondary", palette.secondary);
  root.style.setProperty("--color-accent", palette.accent);
  root.style.setProperty("--color-text", palette.text);
  root.style.setProperty("--color-text-muted", palette.textMuted);
  root.style.setProperty("--color-bg", palette.bg);
  root.style.setProperty("--color-bg-soft", palette.bgSoft);
  root.style.setProperty("--color-border", palette.border);
  root.style.setProperty("--shadow-sm", shadows.sm);
  root.style.setProperty("--shadow-md", shadows.md);
  root.style.setProperty("--shadow-lg", shadows.lg);
  root.style.setProperty("--radius-sm", radii.sm);
  root.style.setProperty("--radius-md", radii.md);
  root.style.setProperty("--radius-lg", radii.lg);
  root.style.setProperty("--radius-pill", radii.pill);
};
