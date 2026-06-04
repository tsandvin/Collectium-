import type { Template } from "../../lib/theme";

export type CollectiumSkin = {
  id: Template;
  label: string;
  tone: "light" | "dark";
  description: string;
  htmlTemplate: Template;
};

export const COLLECTIUM_SKINS: ReadonlyArray<CollectiumSkin> = [
  {
    id: "collectium",
    label: "Collectium",
    tone: "light",
    description: "Signature light med pergament, navy, grønn og gull.",
    htmlTemplate: "collectium",
  },
  {
    id: "enkel",
    label: "Enkel",
    tone: "light",
    description: "Ren lys visning med blå aksent for raske arbeidsflater.",
    htmlTemplate: "enkel",
  },
  {
    id: "museum",
    label: "Museum",
    tone: "dark",
    description: "Mørk galleri-/arkivvisning med gull og roligere kontrast.",
    htmlTemplate: "museum",
  },
  {
    id: "finans",
    label: "Finans",
    tone: "dark",
    description: "Markedsvisning med mørk teal, smaragd og datatettere flater.",
    htmlTemplate: "finans",
  },
];

export function getCollectiumSkin(id: Template): CollectiumSkin {
  return COLLECTIUM_SKINS.find((skin) => skin.id === id) ?? COLLECTIUM_SKINS[0];
}
