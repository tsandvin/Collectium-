"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CollectiumFrontController v4.1
 *
 * Definering / formål:
 * Global klientkontroller som låser Collectium sitt nye grunnuttrykk etter hydration.
 * Den stopper gamle localStorage-verdier, eldre V22-designpaneler og CSS-moduler fra
 * å sette siden tilbake til gammelt skin etter første visning.
 *
 * Bruksområde:
 * Importeres i app/layout.tsx og gjelder hele frontend. Nye sider får automatisk
 * Collectium sitt nye standarddesign fordi layout + global CSS gjelder alle app-ruter.
 *
 * Berørte sider / routes:
 * - Alle app-ruter
 *
 * Berørte DB-brytere / feature_keys:
 * - template.skin.view
 * - template.skin.switch
 * - admin.design.control
 */

import { useEffect } from "react";

type CollectiumSkin = "signature-light" | "signature-dark" | "minimal-light" | "minimal-dark";
type CollectiumViewport = "mobile" | "tablet" | "pc" | "wide" | "tv";

const DEFAULT_SKIN: CollectiumSkin = "signature-light";
const DEFAULT_VIEWPORT: CollectiumViewport = "pc";
const FRONT_VERSION = "v4.1";

function normalizeSkin(value: string | null | undefined): CollectiumSkin {
  if (value === "signature-dark" || value === "museum") return "signature-dark";
  if (value === "minimal-light" || value === "enkel") return "minimal-light";
  if (value === "minimal-dark" || value === "finans") return "minimal-dark";
  return DEFAULT_SKIN;
}

function templateForSkin(skin: CollectiumSkin) {
  return skin.startsWith("minimal") ? "enkel" : "collectium";
}

function writeDataset(skin: CollectiumSkin, viewport: CollectiumViewport) {
  const template = templateForSkin(skin);

  document.documentElement.dataset.template = template;
  document.body.dataset.template = template;
  document.documentElement.dataset.skin = skin;
  document.body.dataset.skin = skin;
  document.documentElement.dataset.collectiumFront = FRONT_VERSION;
  document.body.dataset.collectiumFront = FRONT_VERSION;
  document.documentElement.dataset.vp = viewport;
  document.body.dataset.vp = viewport;
}

function applyFrontFoundation(skinValue?: string | null, forceDefault = false) {
  const storedSkin = forceDefault
    ? DEFAULT_SKIN
    : normalizeSkin(
        skinValue ||
          window.localStorage.getItem("collectium-skin") ||
          window.localStorage.getItem("ct-skin") ||
          DEFAULT_SKIN,
      );

  const viewport = (window.localStorage.getItem("collectium-vp") || DEFAULT_VIEWPORT) as CollectiumViewport;
  const skin = normalizeSkin(storedSkin);
  const template = templateForSkin(skin);

  writeDataset(skin, viewport);

  window.localStorage.setItem("collectium-skin", skin);
  window.localStorage.setItem("ct-skin", skin);
  window.localStorage.setItem("collectium-template", template);
  window.localStorage.setItem("ct-template", template);
  window.localStorage.setItem("collectium-front-version", FRONT_VERSION);
}

function clearLegacyDesignStorage() {
  const legacyKeys = [
    "collectium.public.design",
    "collectium-template-old",
    "collectium-template-v22",
    "collectium-design-template",
    "collectium-design-skin",
  ];

  for (const key of legacyKeys) {
    window.localStorage.removeItem(key);
  }
}

export default function CollectiumFrontController() {
  useEffect(() => {
    try {
      clearLegacyDesignStorage();
      applyFrontFoundation(DEFAULT_SKIN, true);

      const observer = new MutationObserver(() => {
        const currentSkin = normalizeSkin(document.body.dataset.skin || document.documentElement.dataset.skin);
        const currentVp = (document.body.dataset.vp || document.documentElement.dataset.vp || DEFAULT_VIEWPORT) as CollectiumViewport;

        if (
          document.body.dataset.collectiumFront !== FRONT_VERSION ||
          document.documentElement.dataset.collectiumFront !== FRONT_VERSION ||
          !document.body.dataset.skin ||
          !document.documentElement.dataset.skin
        ) {
          writeDataset(currentSkin, currentVp);
        }
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-template", "data-skin", "data-vp", "data-collectium-front"],
      });
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["data-template", "data-skin", "data-vp", "data-collectium-front"],
      });

      const guard = window.setInterval(() => {
        const skin = normalizeSkin(window.localStorage.getItem("collectium-skin") || DEFAULT_SKIN);
        const vp = (window.localStorage.getItem("collectium-vp") || DEFAULT_VIEWPORT) as CollectiumViewport;
        writeDataset(skin, vp);
      }, 250);

      return () => {
        observer.disconnect();
        window.clearInterval(guard);
      };
    } catch {
      return;
    }
  }, []);

  return null;
}
