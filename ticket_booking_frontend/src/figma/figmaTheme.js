//
//
// Figma token mapping utilities.
// Purpose: Translate the extracted Figma JSON design system into runtime theme values and CSS variables.
//
// Notes:
// - Resolves color references like "color_f8f8f8" to hex values.
// - Picks practical defaults if some tokens are missing.
// - Produces a small, normalized theme (colors, radii, shadows) compatible with the existing app.
// - Intended to be optional: can be gated by an env flag.
//
import { loadFigmaDesign } from "./figmaDesignProxy";

// Helpers to safely read values with fallbacks.
const get = (obj, path, fallback = undefined) => {
  try {
    const parts = path.split(".");
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return fallback;
      cur = cur[p];
    }
    return cur == null ? fallback : cur;
  } catch {
    return fallback;
  }
};

const resolveColorRef = (design, refOrHex, fallback) => {
  // refOrHex may be something like "color_f8f8f8" or a hex string "#fff..."
  if (!refOrHex) return fallback;
  if (typeof refOrHex === "string" && refOrHex.startsWith("#")) return refOrHex;
  const colorEntry = get(design, `design_system.colors.${refOrHex}`);
  if (colorEntry && colorEntry.hex) return colorEntry.hex;
  return fallback;
};

const pickFirstHex = (design, keys, fallback) => {
  for (const k of keys) {
    const hex = resolveColorRef(design, k, null);
    if (hex) return hex;
  }
  return fallback;
};

const toPx = (n, fallback) => {
  if (typeof n === "number" && isFinite(n)) return `${Math.round(n)}px`;
  return fallback;
};

const boxShadowFrom = (sh) => {
  // Convert figma shadow to CSS: offset_x offset_y blur color (no spread)
  if (!sh) return null;
  const { offset_x, offset_y, blur, color } = sh;
  const safeColor = color || "#000000";
  const ox = typeof offset_x === "number" ? `${offset_x}px` : "0px";
  const oy = typeof offset_y === "number" ? `${offset_y}px` : "0px";
  const b = typeof blur === "number" ? `${blur}px` : "0px";
  return `${ox} ${oy} ${b} 0 ${safeColor}33`; // add 20% alpha for subtlety
};

const nearestRadii = (arr) => {
  // Given a long list of numeric radii, pick representative small/medium/large and pill.
  // Strategy: sort unique numeric values, choose quartiles.
  const nums = (Array.isArray(arr) ? arr : [])
    .filter((v) => typeof v === "number" && isFinite(v))
    .sort((a, b) => a - b);
  if (nums.length < 4) {
    return {
      sm: "8px",
      md: "12px",
      lg: "16px",
      pill: "999px",
    };
  }
  const q = (p) => nums[Math.min(nums.length - 1, Math.max(0, Math.round((nums.length - 1) * p)))];
  const sm = toPx(q(0.1), "8px");
  const md = toPx(q(0.2), "12px");
  const lg = toPx(q(0.3), "16px");
  return { sm, md, lg, pill: "999px" };
};

/**
 * Internal: map a loaded JSON design object to a normalized theme structure.
 */
function mapLoadedDesign(design) {
  const colors = get(design, "design_system.colors", {});

  // Base color fallbacks (from existing app theme)
  const defaultTheme = {
    primary: "#1565c0",
    secondary: "#43a047",
    accent: "#ffca28",
    text: "#1f2937",
    textMuted: "#6b7280",
    bg: "#ffffff",
    bgSoft: "#f8f8f8",
    border: "#e5e7eb",
    danger: "#e53935",
    success: "#2e7d32",
  };

  // Try to discover primary-like colors
  const primary =
    resolveColorRef(design, "color_primary", null) ||
    // Popular standout tokens in provided JSON
    resolveColorRef(design, "color_9747ff", null) ||
    resolveColorRef(design, "color_50cbfb", null) ||
    defaultTheme.primary;

  // Secondary and accent guesses from the dataset
  const secondary =
    resolveColorRef(design, "color_secondary", null) ||
    resolveColorRef(design, "color_5bdf81", null) ||
    defaultTheme.secondary;

  const accent = pickFirstHex(design, ["color_ffc700", "color_ffd660", "color_ffb91f"], defaultTheme.accent);

  const text = pickFirstHex(design, ["color_101211", "color_000000", "color_201c22"], defaultTheme.text);

  const textMuted = pickFirstHex(design, ["color_686868", "color_b3b3b3", "color_acacac"], defaultTheme.textMuted);

  const bg = pickFirstHex(design, ["color_ffffff", "color_f9f9f9"], defaultTheme.bg);
  const bgSoft = pickFirstHex(design, ["color_f8f8f8", "color_efefef"], defaultTheme.bgSoft);
  const border = pickFirstHex(design, ["color_dedede", "color_e3e3e3", "color_dfdfdf"], defaultTheme.border);
  const danger = pickFirstHex(design, ["color_ed3d23", "color_cc0000", "color_ff0000"], defaultTheme.danger);
  const success = pickFirstHex(design, ["color_5bdf81", "color_089b32"], defaultTheme.success);

  // Radii: derive from large list; fallback to defaults
  const radii = nearestRadii(get(design, "design_system.border_radius", []));

  // Shadows: pick some of the provided drop shadows and downscale intensity for UI use
  const figmaShadows = get(design, "design_system.shadows", {});
  const s0 = boxShadowFrom(get(figmaShadows, "shadow_7")) || "0 1px 2px rgba(0,0,0,0.06)";
  const s1 = boxShadowFrom(get(figmaShadows, "shadow_8")) || "0 2px 6px rgba(0,0,0,0.08)";
  const s2 = boxShadowFrom(get(figmaShadows, "shadow_9")) || "0 8px 20px rgba(0,0,0,0.12)";

  return {
    colors: { primary, secondary, accent, text, textMuted, bg, bgSoft, border, danger, success },
    radii,
    shadows: { sm: s0, md: s1, lg: s2 },
  };
}

/**
 * PUBLIC_INTERFACE
 * Asynchronously load the Figma design and map to theme.
 */
export async function mapFigmaDesignToTheme() {
  const design = await loadFigmaDesign();
  return mapLoadedDesign(design || {});
}

/**
 * PUBLIC_INTERFACE
 * Apply mapped Figma theme values to CSS variables on rootEl (document.documentElement).
 * Returns true if theme applied, false otherwise.
 */
export async function applyFigmaTokensToCSSVariables(rootEl) {
  const t = await mapFigmaDesignToTheme();
  if (!t || !t.colors) return false;
  const root = rootEl || document.documentElement;
  root.style.setProperty("--color-primary", t.colors.primary);
  root.style.setProperty("--color-secondary", t.colors.secondary);
  root.style.setProperty("--color-accent", t.colors.accent);
  root.style.setProperty("--color-text", t.colors.text);
  root.style.setProperty("--color-text-muted", t.colors.textMuted);
  root.style.setProperty("--color-bg", t.colors.bg);
  root.style.setProperty("--color-bg-soft", t.colors.bgSoft);
  root.style.setProperty("--color-border", t.colors.border);

  root.style.setProperty("--shadow-sm", t.shadows.sm);
  root.style.setProperty("--shadow-md", t.shadows.md);
  root.style.setProperty("--shadow-lg", t.shadows.lg);

  root.style.setProperty("--radius-sm", t.radii.sm);
  root.style.setProperty("--radius-md", t.radii.md);
  root.style.setProperty("--radius-lg", t.radii.lg);
  root.style.setProperty("--radius-pill", t.radii.pill);
  return true;
}

export default {
  mapFigmaDesignToTheme,
  applyFigmaTokensToCSSVariables,
}
