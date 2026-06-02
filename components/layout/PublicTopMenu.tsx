"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * PublicTopMenu v13
 *
 * Definering / formål:
 * Offentlig toppmeny for Collectium landing, login og registrering. Menyen viser ikke
 * innlogget sidemeny. Den har egen Design-knapp som åpner skin-valg for offentlig template.
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

import { useState } from "react";
import styles from "../landing/collectium-frontpage.module.css";

export type PublicSkin = "collectium" | "enkel" | "museum" | "finans";

const publicLinks = [
  { label: "Katalog", href: "/katalog", featureKey: "catalog.view" },
  {
    label: "Medlemskap",
    href: "/medlemskap",
    featureKey: "landing.membership",
  },
  { label: "Forhandlere", href: "/forhandlere", featureKey: "dealer.view" },
  { label: "Auksjon", href: "/auksjon", featureKey: "auction.view" },
];

const skins: Array<{ key: PublicSkin; label: string; note: string }> = [
  {
    key: "collectium",
    label: "Collectium",
    note: "8px hjørne, svak indre ramme og signaturhjørne",
  },
  {
    key: "enkel",
    label: "Enkel",
    note: "12px hjørne, Comfortaa og enkel signatur",
  },
  { key: "museum", label: "Museum", note: "grå/svart museumsflate" },
  { key: "finans", label: "Finans", note: "mørk blå finansflate" },
];

type PublicTopMenuProps = {
  skin: PublicSkin;
  logoSrc: string;
  onSkinChange: (skin: PublicSkin) => void;
};

export default function PublicTopMenu({
  skin,
  logoSrc,
  onSkinChange,
}: PublicTopMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [designOpen, setDesignOpen] = useState(false);

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
              <strong>Velg template</strong>
              <span>
                Offentlig visning. Innlogget sidemeny kommer etter login.
              </span>
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
