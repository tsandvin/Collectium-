export const DEFAULT_TEMPLATE = "collectium";
export const DEFAULT_SKIN = "signature-light";
export const DEFAULT_VIEWPORT = "pc";
export const FRONT_VERSION = "v4.1";

export type CollectiumTemplate = "collectium" | "enkel";
export type CollectiumSkin = "signature-light" | "signature-dark" | "minimal-light" | "minimal-dark";
export type ViewportMode = "mobile" | "tablet" | "pc" | "wide" | "tv";

export type ThemeMeta = {
  id: CollectiumSkin;
  label: string;
  description: string;
  accent: string;
};

export const THEMES: ReadonlyArray<ThemeMeta> = [
  {
    id: "signature-light",
    label: "Signature Lys",
    description: "For samlere - for historien",
    accent: "#145c38",
  },
  {
    id: "signature-dark",
    label: "Signature Mørk",
    description: "Mørk galleri-stil med gull og latin",
    accent: "#b99a55",
  },
  {
    id: "minimal-light",
    label: "Minimal Lys",
    description: "Minimal skandinavisk objekt & relasjon",
    accent: "#1e5a9a",
  },
  {
    id: "minimal-dark",
    label: "Minimal Mørk",
    description: "Terminal markeds-feed smaragd",
    accent: "#27a777",
  },
];

export function normalizeSkin(value: string | null | undefined): CollectiumSkin {
  if (!value) return DEFAULT_SKIN;
  const cleaned = value.trim().toLowerCase();
  if (cleaned === "signature-dark" || cleaned === "museum") return "signature-dark";
  if (cleaned === "minimal-light" || cleaned === "enkel" || cleaned === "samler") return "minimal-light";
  if (cleaned === "minimal-dark" || cleaned === "finans") return "minimal-dark";
  if (cleaned === "signature-light" || cleaned === "collectium") return "signature-light";
  return DEFAULT_SKIN;
}

export function templateForSkin(skin: CollectiumSkin): CollectiumTemplate {
  return skin.startsWith("minimal") ? "enkel" : "collectium";
}

export function getLegacyClass(skin: CollectiumSkin): string {
  if (skin === "signature-dark") return "museum";
  if (skin === "minimal-light") return "enkel";
  if (skin === "minimal-dark") return "finans";
  return "collectium";
}

export function applyTheme(skinValue: string | null | undefined, viewportValue?: string | null | undefined): void {
  if (typeof document === "undefined") return;
  
  const skin = normalizeSkin(skinValue);
  const template = templateForSkin(skin);
  const vp = (viewportValue || document.documentElement.dataset.vp || document.body.dataset.vp || DEFAULT_VIEWPORT) as ViewportMode;

  document.documentElement.dataset.template = template;
  document.body.dataset.template = template;
  document.documentElement.dataset.skin = skin;
  document.body.dataset.skin = skin;
  document.documentElement.dataset.collectiumFront = FRONT_VERSION;
  document.body.dataset.collectiumFront = FRONT_VERSION;
  document.documentElement.dataset.vp = vp;
  document.body.dataset.vp = vp;

  try {
    window.localStorage.setItem("collectium-skin", skin);
    window.localStorage.setItem("ct-skin", skin);
    window.localStorage.setItem("collectium-template", template);
    window.localStorage.setItem("ct-template", template);
    window.localStorage.setItem("collectium-vp", vp);
    window.localStorage.setItem("ct-vp", vp);

    // Clean up legacy items
    const legacyKeys = [
      "collectium.public.design",
      "collectium-template-old",
      "collectium-template-v22",
      "collectium-design-template",
      "collectium-design-skin",
      "collectium.public.skin"
    ];
    for (const key of legacyKeys) {
      window.localStorage.removeItem(key);
    }
  } catch {
    /* ignore private mode / storage errors */
  }
}
