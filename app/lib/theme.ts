export const LOCKED_DEFAULT: CollectiumTemplate = "collectium";

export type CollectiumTemplate = "collectium" | "enkel" | "museum" | "finans";

export type ThemeMeta = {
  id: CollectiumTemplate;
  label: string;
  description: string;
  accent: string;
};

export const THEMES: ReadonlyArray<ThemeMeta> = [
  {
    id: "collectium",
    label: "Collectium",
    description: "For samlere - for historien",
    accent: "#d6a641",
  },
  {
    id: "enkel",
    label: "Enkel",
    description: "Minimal skandinavisk object & relation",
    accent: "#1e5a9a",
  },
  {
    id: "museum",
    label: "Museum",
    description: "Mork galleri-stil med gull og latin",
    accent: "#b99a55",
  },
  {
    id: "finans",
    label: "Finans",
    description: "Terminal markeds-feed smaragd",
    accent: "#27a777",
  },
];

export type ViewportMode = "mobile" | "tablet" | "pc" | "wide" | "tv";

export function setTemplate(template: CollectiumTemplate): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.template = template;
  document.body.dataset.template = template;
  try {
    window.localStorage?.setItem("ct-template", template);
  } catch {
    /* ignore quota / private-mode errors */
  }
}

export function setViewport(vp: ViewportMode): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.vp = vp;
  document.body.dataset.vp = vp;
}

export function getStoredTemplate(): CollectiumTemplate {
  if (typeof window === "undefined") return LOCKED_DEFAULT;
  try {
    const v = window.localStorage?.getItem("ct-template");
    if (v === "collectium" || v === "enkel" || v === "museum" || v === "finans") {
      return v;
    }
  } catch {
    /* ignore */
  }
  return LOCKED_DEFAULT;
}
