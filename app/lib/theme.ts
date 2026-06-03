/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Collectium theme registry v4
 *
 * Definering / formål:
 * Standard register for nytt skin-system. Gamle template-navn mappes til nye skins
 * for bakoverkompatibilitet.
 *
 * Bruksområde:
 * Designpanel, global frontend, app/layout.tsx og CollectiumFrontController.
 *
 * Berørte sider / routes:
 * - Alle app-ruter
 *
 * Berørte DB-brytere / feature_keys:
 * - template.skin.view
 * - template.skin.switch
 */

export type CollectiumSkin = "signature-light" | "signature-dark" | "minimal-light" | "minimal-dark";
export type LegacyTemplate = "collectium" | "enkel" | "museum" | "finans";
export type CollectiumTemplate = LegacyTemplate;
export type ViewportMode = "mobile" | "tablet" | "pc" | "wide" | "tv";

export const LOCKED_DEFAULT_SKIN: CollectiumSkin = "signature-light";
export const LOCKED_DEFAULT: LegacyTemplate = "collectium";

export const SKINS: ReadonlyArray<{ id: CollectiumSkin; label: string; description: string; template: LegacyTemplate; accent: string }> = [
  { id: "signature-light", label: "Signature lys", description: "Collectium arkiv / gull / varm lys", template: "collectium", accent: "#d6a641" },
  { id: "signature-dark", label: "Signature mørk", description: "Museum / arkiv / mørk premium", template: "collectium", accent: "#d8b45a" },
  { id: "minimal-light", label: "Minimal lys", description: "Ren lys Collectium / blå-hvit", template: "enkel", accent: "#1e5a9a" },
  { id: "minimal-dark", label: "Minimal mørk", description: "Finans / analyse / mørk", template: "enkel", accent: "#27a777" },
];

export const THEMES = SKINS;

export function normalizeSkin(value?: string | null): CollectiumSkin {
  if (value === "signature-dark" || value === "museum") return "signature-dark";
  if (value === "minimal-light" || value === "enkel") return "minimal-light";
  if (value === "minimal-dark" || value === "finans") return "minimal-dark";
  return "signature-light";
}

export function templateForSkin(skin: CollectiumSkin): LegacyTemplate {
  return skin.startsWith("minimal") ? "enkel" : "collectium";
}

export function setSkin(value: CollectiumSkin | LegacyTemplate): void {
  if (typeof document === "undefined") return;
  const skin = normalizeSkin(value);
  const template = templateForSkin(skin);
  document.documentElement.dataset.skin = skin;
  document.body.dataset.skin = skin;
  document.documentElement.dataset.template = template;
  document.body.dataset.template = template;
  document.documentElement.dataset.collectiumFront = "v4";
  document.body.dataset.collectiumFront = "v4";
  try {
    window.localStorage.setItem("collectium-skin", skin);
    window.localStorage.setItem("ct-skin", skin);
    window.localStorage.setItem("collectium-template", template);
    window.localStorage.setItem("ct-template", template);
  } catch {}
}

export function setTemplate(template: LegacyTemplate): void {
  setSkin(template);
}

export function setViewport(vp: ViewportMode): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.vp = vp;
  document.body.dataset.vp = vp;
  try { window.localStorage.setItem("collectium-vp", vp); } catch {}
}

export function getStoredSkin(): CollectiumSkin {
  if (typeof window === "undefined") return LOCKED_DEFAULT_SKIN;
  try {
    return normalizeSkin(window.localStorage.getItem("collectium-skin") || window.localStorage.getItem("ct-skin") || window.localStorage.getItem("collectium-template"));
  } catch {
    return LOCKED_DEFAULT_SKIN;
  }
}

export function getStoredTemplate(): LegacyTemplate {
  return templateForSkin(getStoredSkin());
}
