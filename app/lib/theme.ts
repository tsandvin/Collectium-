export const DEFAULT_TEMPLATE = "collectium";
export const DEFAULT_SKIN = "signature-light";
export const DEFAULT_VIEWPORT = "pc";
export const FRONT_VERSION = "v4.1";

export type CollectiumTemplate = "collectium";
export type CollectiumSkin = "signature-light";
export type ViewportMode = "pc";

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
    description: "For samlere - for historien (Standard)",
    accent: "#145c38",
  },
];

export function normalizeSkin(value?: string | null | undefined): CollectiumSkin {
  return DEFAULT_SKIN;
}

export function templateForSkin(skin?: CollectiumSkin): CollectiumTemplate {
  return DEFAULT_TEMPLATE;
}

export function getLegacyClass(skin?: CollectiumSkin): string {
  return "collectium";
}

export function applyTheme(skinValue?: string | null | undefined, viewportValue?: string | null | undefined): void {
  if (typeof document === "undefined") return;

  document.documentElement.dataset.template = DEFAULT_TEMPLATE;
  document.body.dataset.template = DEFAULT_TEMPLATE;
  document.documentElement.dataset.skin = DEFAULT_SKIN;
  document.body.dataset.skin = DEFAULT_SKIN;
  document.documentElement.dataset.collectiumFront = FRONT_VERSION;
  document.body.dataset.collectiumFront = FRONT_VERSION;
  document.documentElement.dataset.vp = DEFAULT_VIEWPORT;
  document.body.dataset.vp = DEFAULT_VIEWPORT;

  try {
    // Clear all theme/design settings in localStorage
    const keysToRemove = [
      "collectium-skin",
      "ct-skin",
      "collectium-template",
      "ct-template",
      "collectium-vp",
      "ct-vp",
      "collectium.public.design",
      "collectium-template-old",
      "collectium-template-v22",
      "collectium-design-template",
      "collectium-design-skin",
      "collectium.public.skin"
    ];
    for (const key of keysToRemove) {
      window.localStorage.removeItem(key);
    }

    // Proactively scan for any extra collectium-design values
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && (key.startsWith("collectium-design-") || key.startsWith("ct-design-"))) {
        window.localStorage.removeItem(key);
        i--;
      }
    }
  } catch {
    /* ignore private mode / storage errors */
  }
}
