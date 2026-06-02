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
 * CT-FILE-ADMIN-MOBILE-NAV-002 / CHANGE-2026-06-02-0017
 */

import Link from 'next/link';

type CollectiumMobileNavigationRole = 'admin' | 'member' | 'dealer' | string;

type MobileNavigationItem = {
  href: string;
  label: string;
  icon: string;
};

type CollectiumMobileNavigationProps = {
  role?: CollectiumMobileNavigationRole;
  activeHref?: string;
  className?: string;
};

const adminNavigationItems: MobileNavigationItem[] = [
  { href: '/admin/kontroll', label: 'Kontroll', icon: '●' },
  { href: '/admin/brukere', label: 'Brukere', icon: '◆' },
  { href: '/admin/logger', label: 'Logg', icon: '■' },
  { href: '/admin/meldinger', label: 'Meldinger', icon: '✉' },
  { href: '/admin/system', label: 'System', icon: '⚙' },
];

const memberNavigationItems: MobileNavigationItem[] = [
  { href: '/min-side', label: 'Min side', icon: '●' },
  { href: '/katalog', label: 'Katalog', icon: '◆' },
  { href: '/index', label: 'Index', icon: '■' },
  { href: '/auksjon', label: 'Auksjon', icon: '▲' },
  { href: '/butikk', label: 'Butikk', icon: '□' },
];

function getNavigationItems(role: CollectiumMobileNavigationRole): MobileNavigationItem[] {
  if (role === 'member') {
    return memberNavigationItems;
  }

  return adminNavigationItems;
}

export function CollectiumMobileNavigation({
  role = 'admin',
  activeHref,
  className = '',
}: CollectiumMobileNavigationProps) {
  const navigationItems = getNavigationItems(role);

  return (
    <nav
      className={`collectium-admin-mobile-nav ${className}`.trim()}
      aria-label="Collectium mobilnavigasjon"
    >
      {navigationItems.map((item) => {
        const isActive = activeHref === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`collectium-admin-mobile-nav__item${isActive ? ' is-active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="collectium-admin-mobile-nav__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="collectium-admin-mobile-nav__label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
