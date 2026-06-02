/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AdminControlTabs
 *
 * Definering / formål:
 * Fane-/tabnavigasjon for Admin kontrollside.
 *
 * Bruksområde:
 * Brukes av /admin/kontroll for å vise hovedfaner i adminpanelet.
 *
 * Berørte sider / routes:
 * - /admin/kontroll
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.control.view
 * - admin.system.dashboard.view
 * - admin.users.view
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
 * CT-FILE-ADMIN-CONTROL-TABS-001 / CHANGE-2026-06-02-0017
 */

import Link from 'next/link';

type AdminControlTab = {
  href: string;
  label: string;
  description?: string;
};

type AdminControlTabsProps = {
  tabs?: AdminControlTab[];
  activeHref?: string;
  className?: string;
};

const defaultTabs: AdminControlTab[] = [
  {
    href: '/admin/kontroll',
    label: 'Admin kontroll',
    description: 'DB, API, system og deploy',
  },
  {
    href: '/admin/brukere',
    label: 'Brukere',
    description: 'Kunder, roller, aktivitet og medlemskap',
  },
  {
    href: '/admin/logger',
    label: 'Admin logg',
    description: 'Endringer, feil og prosesslogg',
  },
  {
    href: '/admin/meldinger',
    label: 'Meldinger',
    description: 'Varsler, support og intern dialog',
  },
];

export function AdminControlTabs({
  tabs = defaultTabs,
  activeHref = '/admin/kontroll',
  className = '',
}: AdminControlTabsProps) {
  return (
    <nav className={`collectium-admin-tabs ${className}`.trim()} aria-label="Admin faner">
      {tabs.map((tab) => {
        const isActive = tab.href === activeHref;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`collectium-admin-tabs__item${isActive ? ' is-active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="collectium-admin-tabs__label">{tab.label}</span>
            {tab.description ? (
              <span className="collectium-admin-tabs__description">{tab.description}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
