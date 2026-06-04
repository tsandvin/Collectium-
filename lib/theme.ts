// lib/theme.ts
// Collectium · design registry · v5
//
// Default standard: collectium / pc / 14px.
// The Design mega menu lets users switch template, viewport and font size.

/* -------------------------------------------------------------------------
 * Storage keys (the ONLY keys the design system writes)
 * ------------------------------------------------------------------------- */

export const STORAGE_TEMPLATE = "ct:template";
export const STORAGE_VIEWPORT = "ct:vp";
export const STORAGE_FONT_BASE = "ct:font-base";

/* -------------------------------------------------------------------------
 * Templates
 * ------------------------------------------------------------------------- */

export type Template = "collectium" | "enkel" | "museum" | "finans";

export const DEFAULT_TEMPLATE: Template = "collectium";

export type TemplateMeta = {
  id: Template;
  label: string;
  description: string;
  /** Two-stop gradient used for the preview swatch in the mega menu. */
  swatch: [string, string];
  /** Accent dot color (the primary brand color). */
  accent: string;
  /** Short tone label shown next to the name. */
  tone: "Lys" | "Mørk";
};

export const TEMPLATES: ReadonlyArray<TemplateMeta> = [
  {
    id: "collectium",
    label: "Collectium",
    description: "Signature · pergament, navy og gull.",
    swatch: ["#f8f1e6", "#d6a641"],
    accent: "#145c38",
    tone: "Lys",
  },
  {
    id: "enkel",
    label: "Enkel",
    description: "Minimal · skandinavisk hvit med blå aksent.",
    swatch: ["#ffffff", "#1e5a9a"],
    accent: "#1e5a9a",
    tone: "Lys",
  },
  {
    id: "museum",
    label: "Museum",
    description: "Galleri · mørk koks med gull og latin.",
    swatch: ["#1a1a1c", "#b99a55"],
    accent: "#b99a55",
    tone: "Mørk",
  },
  {
    id: "finans",
    label: "Finans",
    description: "Terminal · markedsfeed med smaragd.",
    swatch: ["#162028", "#27a777"],
    accent: "#27a777",
    tone: "Mørk",
  },
];

/* -------------------------------------------------------------------------
 * Viewports
 * ------------------------------------------------------------------------- */

export type Viewport = "mobile" | "tablet" | "pc" | "wide" | "tv";

export const DEFAULT_VIEWPORT: Viewport = "pc";

export type ViewportMeta = {
  id: Viewport;
  label: string;
  width: string;
  icon: string; // tabler icon class name
  hint?: string;
};

export const VIEWPORTS: ReadonlyArray<ViewportMeta> = [
  { id: "mobile", label: "Mobil", width: "430 px", icon: "ti-device-mobile" },
  { id: "tablet", label: "Nettbrett", width: "780 px", icon: "ti-device-tablet" },
  { id: "pc", label: "PC", width: "1280 px", icon: "ti-device-desktop", hint: "Standard" },
  { id: "wide", label: "Bredskjerm", width: "1840 px", icon: "ti-device-desktop-analytics" },
  { id: "tv", label: 'TV 40"+', width: "2200 px · skala 1.18", icon: "ti-device-tv" },
];

/* -------------------------------------------------------------------------
 * Font size
 * ------------------------------------------------------------------------- */

export const FONT_BASE_MIN = 12;
export const FONT_BASE_MAX = 18;
export const FONT_BASE_DEFAULT = 14;

/* -------------------------------------------------------------------------
 * Validators
 * ------------------------------------------------------------------------- */

export function isTemplate(v: unknown): v is Template {
  return v === "collectium" || v === "enkel" || v === "museum" || v === "finans";
}

export function isViewport(v: unknown): v is Viewport {
  return (
    v === "mobile" ||
    v === "tablet" ||
    v === "pc" ||
    v === "wide" ||
    v === "tv"
  );
}

export function clampFontBase(n: number): number {
  if (!Number.isFinite(n)) return FONT_BASE_DEFAULT;
  if (n < FONT_BASE_MIN) return FONT_BASE_MIN;
  if (n > FONT_BASE_MAX) return FONT_BASE_MAX;
  return Math.round(n);
}

/* -------------------------------------------------------------------------
 * Storage (read)
 * ------------------------------------------------------------------------- */

export function readTemplate(): Template {
  if (typeof window === "undefined") return DEFAULT_TEMPLATE;
  try {
    const v = window.localStorage.getItem(STORAGE_TEMPLATE);
    return isTemplate(v) ? v : DEFAULT_TEMPLATE;
  } catch {
    return DEFAULT_TEMPLATE;
  }
}

export function readViewport(): Viewport {
  if (typeof window === "undefined") return DEFAULT_VIEWPORT;
  try {
    const v = window.localStorage.getItem(STORAGE_VIEWPORT);
    return isViewport(v) ? v : DEFAULT_VIEWPORT;
  } catch {
    return DEFAULT_VIEWPORT;
  }
}

export function readFontBase(): number {
  if (typeof window === "undefined") return FONT_BASE_DEFAULT;
  try {
    const v = window.localStorage.getItem(STORAGE_FONT_BASE);
    if (!v) return FONT_BASE_DEFAULT;
    const n = parseInt(v, 10);
    return clampFontBase(n);
  } catch {
    return FONT_BASE_DEFAULT;
  }
}

/* -------------------------------------------------------------------------
 * Apply + Persist
 * ------------------------------------------------------------------------- */

export function applyTemplate(t: Template): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.template = t;
  try {
    window.localStorage.setItem(STORAGE_TEMPLATE, t);
  } catch { /* ignore */ }
}

export function applyViewport(v: Viewport): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.vp = v;
  try {
    window.localStorage.setItem(STORAGE_VIEWPORT, v);
  } catch { /* ignore */ }
}

export function applyFontBase(px: number): void {
  if (typeof document === "undefined") return;
  const n = clampFontBase(px);
  document.documentElement.style.setProperty("--ct-font-base", `${n}px`);
  try {
    window.localStorage.setItem(STORAGE_FONT_BASE, String(n));
  } catch { /* ignore */ }
}

/**
 * Reset everything to the locked standard.
 */
export function resetDesign(): void {
  applyTemplate(DEFAULT_TEMPLATE);
  applyViewport(DEFAULT_VIEWPORT);
  applyFontBase(FONT_BASE_DEFAULT);
}
