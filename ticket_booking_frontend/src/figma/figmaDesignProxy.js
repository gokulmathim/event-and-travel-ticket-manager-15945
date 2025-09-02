//
// Safe proxy loader for Figma design JSON, compliant with CRA restrictions.
// Attempts to load a JSON copy placed inside src (preferred) or fetches from /figmafiles at runtime if served from public.
// Returns {} when not available, so callers can gracefully fallback.
//

// Try to import a colocated file under src if present.
// You can optionally copy the design JSON to src/figma/design_system.json for local development.
let localDesign = {};
try {
  // This path is optional; if the file doesn't exist, catch will handle it.
  // eslint-disable-next-line import/no-webpack-loader-syntax
  localDesign = require("./design_system.json");
} catch (e) {
  localDesign = {};
}

// PUBLIC_INTERFACE
export async function loadFigmaDesign() {
  /**
   * Attempt to load the Figma design system JSON.
   * Priority:
   * 1) Local colocated file (src/figma/design_system.json) if bundled
   * 2) Fetch from /figmafiles/... if the server serves it from public/
   * 3) Fallback to {}
   */
  if (localDesign && Object.keys(localDesign).length > 0) {
    return localDesign;
  }

  // Try to fetch from a public path if available at runtime.
  // Note: Place your JSON under public/figmafiles/ to allow this to succeed without bundling.
  const defaultPublicPath = "/figmafiles/design_system_b2c-15936-BU9ylzovRurd2coMTEsWhv.json";
  try {
    const resp = await fetch(defaultPublicPath, { cache: "no-cache" });
    if (resp.ok) {
      return await resp.json();
    }
  } catch (_) {
    // ignore
  }

  return {};
}
