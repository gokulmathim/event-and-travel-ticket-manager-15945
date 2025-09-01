/**
 * Theme variables and helpers for the app.
 * This centralizes color palette and common spacing/typography tokens.
 *
 * Supports optional Figma token application when FIGMA_THEME_ENABLED === "true".
 */
import { applyFigmaTokensToCSSVariables } from "./figma/figmaTheme";

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

// PUBLIC_INTERFACE
export const setCSSVariables = () => {
  /**
   * Set CSS variables on :root using either built-in theme or Figma tokens if enabled.
   *
   * Env:
   * - FIGMA_THEME_ENABLED: "true" to apply Figma tokens from figmafiles JSON.
   */
  const root = document.documentElement;

  // If Figma is enabled, try applying Figma tokens first.
  const useFigma = String(process.env.REACT_APP_FIGMA_THEME_ENABLED || process.env.FIGMA_THEME_ENABLED || "").toLowerCase() === "true";
  if (useFigma) {
    try {
      applyFigmaTokensToCSSVariables(root);
      return; // done
    } catch (e) {
      // Fallback to default theme if anything goes wrong.
      // eslint-disable-next-line no-console
      console.warn("Figma theme application failed, falling back to default theme:", e);
    }
  }

  // Default app theme fallback.
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
