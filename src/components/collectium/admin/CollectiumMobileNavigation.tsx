/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CollectiumMobileNavigation
 *
 * Definering / formål:
 * Mobil admin-navigasjon for Collectium admin/kontroll.
 *
 * Bruksområde:
 * Brukes av /admin/kontroll for mobil footer/fane-navigasjon.
 *
 * Berørte sider / routes:
 * - /admin/kontroll
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.control.view
 * - admin.users.view
 * - admin.system.dashboard.view
 *
 * Berørte API-ruter:
 * - Ingen direkte API-kall i denne komponenten.
 *
 * Berørte tabeller / views:
 * - Ingen direkte DB-tilgang.
 *
 * Dataretning:
 * Lokal React UI → navigasjon
 *
 * Logging:
 * Ingen direkte logging.
 *
 * Versjon:
 * CT-FILE-ADMIN-MOBILE-NAV-001 / CHANGE-2026-06-02-0017
 */

import Link from 'next/link';

type MobileNavigationItem = {
  href: string;
  label: string;
  icon: string;
};

const mobileNavigationItems: MobileNavigationItem[] = [
  { href: '/admin/kontroll', label: 'Kontroll', icon: '●' },
  { href: '/admin/brukere', label: 'Brukere', icon: '◆' },
  { href: '/admin/logger', label: 'Logg', icon: '■' },
  { href: '/admin/meldinger', label: 'Meldinger', icon: '✉' },
  { href: '/admin/system', label: 'System', icon: '⚙' },
];

export function CollectiumMobileNavigation() {
  return (
    <nav className="collectium-admin-mobile-nav" aria-label="Admin mobilnavigasjon">
      {mobileNavigationItems.map((item) => (
        <Link key={item.href} href={item.href} className="collectium-admin-mobile-nav__item">
          <span className="collectium-admin-mobile-nav__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="collectium-admin-mobile-nav__label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
