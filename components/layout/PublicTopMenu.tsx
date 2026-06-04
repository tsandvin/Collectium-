"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * PublicTopMenu v14
 *
 * Definering / formål:
 * Offentlig toppmeny for Collectium landing, login og registrering. Menyen viser ikke
 * innlogget sidemeny. Den har egen Design-knapp som åpner skin-valg, typografislidere, luft/spacing og skjermmodus for offentlig template. Valgene lagres i localStorage og settes som CSS-variabler på documentElement/body.
 *
 * Bruksområde:
 * Brukes på /, /login og /registrering før brukeren er logget inn.
 *
 * Berørte sider / routes:
 * - /
 * - /login
 * - /registrering
 * - /katalog
 *
 * Berørte DB-brytere / feature_keys:
 * - landing.view
 * - auth.login
 * - auth.register
 * - catalog.view
 * - landing.membership
 *
 * Berørte API-ruter:
 * - POST /api/auth/login        (senere)
 * - POST /api/auth/register     (senere)
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: navigation
 * log_action: public_topmenu.view
 */

import { useEffect, useState } from "react";
import { type CollectiumSkin, normalizeSkin, templateForSkin } from "../../app/lib/theme";
import styles from "../landing/collectium-frontpage.module.css";

const publicLinks = [
  { label: "Katalog", href: "/katalog", featureKey: "catalog.view" },
  {
    label: "Medlemskap",
    href: "/medlemskap",
    featureKey: "landing.membership",
  },
  { label: "Forhandlere", href: "/forhandler", featureKey: "dealer.view" },
  { label: "Auksjon", href: "/auksjon", featureKey: "auction.view" },
];

const skins: Array<{ key: CollectiumSkin; label: string; note: string }> = [
  {
    key: "signature-light",
    label: "Signature Lys",
    note: "8px hjørne, svak indre ramme og signaturhjørne",
  },
  {
    key: "signature-dark",
    label: "Signature Mørk",
    note: "grå/svart museumsflate",
  },
  {
    key: "minimal-light",
    label: "Minimal Lys",
    note: "minimal blå/hvit objekt- og relasjonspresentasjon",
  },
  {
    key: "minimal-dark",
    label: "Minimal Mørk",
    note: "mørk blå finansflate",
  },
];


export type PublicViewportMode = "normal" | "mobile" | "tablet" | "desktop" | "wide";

type DesignState = {
  bodySize: number;
  titleSize: number;
  headlineSize: number;
  fieldAir: number;
  viewportMode: PublicViewportMode;
};

const defaultDesign: DesignState = {
  bodySize: 15,
  titleSize: 21,
  headlineSize: 38,
  fieldAir: 18,
  viewportMode: "normal",
};

const viewportLabels: Array<{ key: PublicViewportMode; label: string }> = [
  { key: "normal", label: "Normal" },
  { key: "mobile", label: "Mobil" },
  { key: "tablet", label: "Tablet" },
  { key: "desktop", label: "Desktop" },
  { key: "wide", label: "Bred" },
];

function readSavedDesign(): Partial<DesignState> {
  try {
    const raw = window.localStorage.getItem("collectium.public.design");
    if (!raw) return {};
    return JSON.parse(raw) as Partial<DesignState>;
  } catch {
    return {};
  }
}

function clampValue(value: unknown, min: number, max: number, fallback: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, numeric));
}

type PublicTopMenuProps = {
  skin: CollectiumSkin;
  logoSrc: string;
  onSkinChange: (skin: CollectiumSkin) => void;
};

export default function PublicTopMenu({
  skin,
  logoSrc,
  onSkinChange,
}: PublicTopMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [designOpen, setDesignOpen] = useState(false);
  const [design, setDesign] = useState<DesignState>(defaultDesign);

  useEffect(() => {
    try {
      const rawSkin = window.localStorage.getItem("collectium-skin") || window.localStorage.getItem("ct-skin") || window.localStorage.getItem("collectium.public.skin");
      const savedSkin = normalizeSkin(rawSkin);
      onSkinChange(savedSkin);
      const saved = readSavedDesign();
      setDesign({
        bodySize: clampValue(saved.bodySize, 9, 17, defaultDesign.bodySize),
        titleSize: clampValue(saved.titleSize, 16, 25, defaultDesign.titleSize),
        headlineSize: clampValue(saved.headlineSize, 18, 42, defaultDesign.headlineSize),
        fieldAir: clampValue(saved.fieldAir, 10, 34, defaultDesign.fieldAir),
        viewportMode:
          saved.viewportMode && viewportLabels.some((item) => item.key === saved.viewportMode)
            ? saved.viewportMode
            : defaultDesign.viewportMode,
      });
    } catch {
      // Design settings are optional.
    }
  }, [onSkinChange]);

  useEffect(() => {
    const template = templateForSkin(skin);
    document.body.dataset.template = template;
    document.documentElement.dataset.template = template;
    document.body.dataset.skin = skin;
    document.documentElement.dataset.skin = skin;
    try {
      window.localStorage.setItem("collectium-skin", skin);
      window.localStorage.setItem("ct-skin", skin);
      window.localStorage.setItem("collectium-template", template);
      window.localStorage.setItem("ct-template", template);
    } catch {
      // localStorage is optional.
    }
  }, [skin]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--ct-body-size", `${design.bodySize}px`);
    root.style.setProperty("--ct-title-size", `${design.titleSize}px`);
    root.style.setProperty("--ct-headline-size", `${design.headlineSize}px`);
    root.style.setProperty("--ct-field-air", `${design.fieldAir}px`);
    document.body.dataset.viewportMode = design.viewportMode;
    try {
      window.localStorage.setItem("collectium.public.design", JSON.stringify(design));
    } catch {
      // localStorage is optional.
    }
  }, [design]);

  const updateDesign = (key: keyof DesignState, value: number | PublicViewportMode) => {
    setDesign((current) => ({ ...current, [key]: value }));
  };

  const resetDesign = () => setDesign(defaultDesign);

  return (
    <header className={styles.topbar}>
      <a className={styles.logoLink} href="/" aria-label="Collectium hjem">
        <img src={logoSrc} alt="Collectium" className={styles.logo} />
      </a>

      <nav className={styles.nav} aria-label="Offentlig toppmeny">
        {publicLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            data-feature-key={item.featureKey}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className={styles.headerActions}>
        <div className={styles.designMenuWrap}>
          <button
            type="button"
            className={styles.designButton}
            aria-expanded={designOpen}
            aria-controls="collectium-public-design-panel"
            onClick={() => setDesignOpen((value) => !value)}
          >
            Design
          </button>
          {designOpen && (
            <div
              id="collectium-public-design-panel"
              className={styles.designPopover}
            >
              <strong>Design</strong>
              <span>Template, skrift, luft og skjermmodus lagres og følger sidene.</span>

              <div className={styles.designGroup}>
                <b>Template</b>
                <div className={styles.skinButtons}>
                  {skins.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onSkinChange(item.key)}
                      className={skin === item.key ? styles.activeSkin : ""}
                      title={item.note}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.designSliderGrid}>
                <label>
                  <span>Hovedskrift {design.bodySize}px</span>
                  <input
                    type="range"
                    min="9"
                    max="17"
                    value={design.bodySize}
                    onChange={(event) => updateDesign("bodySize", Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>Overskrift {design.titleSize}px</span>
                  <input
                    type="range"
                    min="16"
                    max="25"
                    value={design.titleSize}
                    onChange={(event) => updateDesign("titleSize", Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>Headline {design.headlineSize}px</span>
                  <input
                    type="range"
                    min="18"
                    max="42"
                    value={design.headlineSize}
                    onChange={(event) => updateDesign("headlineSize", Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>Luft i bokser {design.fieldAir}px</span>
                  <input
                    type="range"
                    min="10"
                    max="34"
                    value={design.fieldAir}
                    onChange={(event) => updateDesign("fieldAir", Number(event.target.value))}
                  />
                </label>
              </div>

              <div className={styles.designGroup}>
                <b>Skjermstørrelse</b>
                <div className={styles.viewportButtons}>
                  {viewportLabels.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={design.viewportMode === item.key ? styles.activeSkin : ""}
                      onClick={() => updateDesign("viewportMode", item.key)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" className={styles.resetDesignButton} onClick={resetDesign}>
                Nullstill design
              </button>
            </div>
          )}
        </div>
        <a
          href="/login"
          className={styles.ghostButton}
          data-feature-key="auth.login"
        >
          Logg inn
        </a>
        <a
          href="/registrering"
          className={styles.primaryButton}
          data-feature-key="auth.register"
        >
          Kom i gang gratis
        </a>
        <button
          className={styles.menuButton}
          aria-label="Åpne meny"
          onClick={() => setMenuOpen((value) => !value)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <nav className={styles.mobileMenu} aria-label="Mobilmeny">
          {publicLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              data-feature-key={item.featureKey}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => setDesignOpen((value) => !value)}
          >
            Design
          </button>
          <a href="/login" data-feature-key="auth.login">
            Logg inn
          </a>
          <a href="/registrering" data-feature-key="auth.register">
            Registrering
          </a>
        </nav>
      )}
    </header>
  );
}
