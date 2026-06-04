"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * PublicTopMenu v14 - Locked Standard
 *
 * Definering / formål:
 * Offentlig toppmeny for Collectium landing, login og registrering. Menyen viser ikke
 * innlogget sidemeny. Locked standard for Signature Lys.
 */

import { useEffect, useState } from "react";
import { applyTheme } from "../../app/lib/theme";
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

type PublicTopMenuProps = {
  skin?: string;
  logoSrc?: string;
  onSkinChange?: (skin: any) => void;
};

export default function PublicTopMenu({
  skin,
  logoSrc = "/brand/collectium-logo-dark.png",
  onSkinChange,
}: PublicTopMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    applyTheme();
  }, []);

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
