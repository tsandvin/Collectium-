/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CollectiumMobileNavigation
 *
 * Definering / formål:
 * Rollebasert mobil bunnnavigasjon for innlogget admin og medlem.
 * Admin får snarvei til Admin kontroll, Brukere, Admin logg og Meldinger.
 * Medlem får Min side, Katalog, Index, Auksjon og Butikk.
 *
 * Bruksområde:
 * Brukes i global layout/AppShell eller på admin/medlemsflater som fast mobil footer.
 *
 * Berørte sider / routes:
 * - /admin/kontroll
 * - /admin/brukere
 * - /admin/logger
 * - /admin/meldinger
 * - /min-side
 * - /katalog
 * - /index
 * - /auksjon
 * - /butikk
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.control.view
 * - admin.users.view
 * - admin.logs.view
 * - admin.messages.view
 * - profile.view
 * - catalog.view
 * - index.view
 * - auction.view
 * - shop.view
 *
 * Berørte API-ruter:
 * - GET /api/auth/session
 * - GET /api/admin/system/dashboard
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: navigation
 * log_action: mobile_footer.open
 *
 * Versjon:
 * CT-FILE-ADMIN-MOBILE-0001 / CHANGE-2026-06-02-0001
 */

import Link from 'next/link';

export type CollectiumUserRole = 'guest' | 'member' | 'dealer' | 'admin' | 'superadmin';

export type MobileNavItem = {
  label: string;
  href: string;
  icon: string;
  featureKey: string;
  badge?: string | number;
};

const adminItems: MobileNavItem[] = [
  { label: 'Kontroll', href: '/admin/kontroll', icon: '⌁', featureKey: 'admin.control.view', badge: 'OK' },
  { label: 'Brukere', href: '/admin/brukere', icon: '◉', featureKey: 'admin.users.view', badge: 12 },
  { label: 'Logg', href: '/admin/logger', icon: '≡', featureKey: 'admin.logs.view', badge: 4 },
  { label: 'Meldinger', href: '/admin/meldinger', icon: '✉', featureKey: 'admin.messages.view', badge: 3 },
  { label: 'Innst.', href: '/admin/innstillinger', icon: '⚙', featureKey: 'admin.settings.view' },
];

const memberItems: MobileNavItem[] = [
  { label: 'Min side', href: '/min-side', icon: '◎', featureKey: 'profile.view' },
  { label: 'Katalog', href: '/katalog', icon: '▦', featureKey: 'catalog.view' },
  { label: 'Index', href: '/index', icon: '↗', featureKey: 'index.view' },
  { label: 'Auksjon', href: '/auksjon', icon: '◆', featureKey: 'auction.view' },
  { label: 'Butikk', href: '/butikk', icon: '▣', featureKey: 'shop.view' },
];

export function CollectiumMobileNavigation({
  role,
  activeHref,
}: {
  role: CollectiumUserRole;
  activeHref?: string;
}) {
  const isAdmin = role === 'admin' || role === 'superadmin';
  const items = isAdmin ? adminItems : memberItems;

  if (role === 'guest') return null;

  return (
    <nav className="ct-mobile-footer" aria-label={isAdmin ? 'Admin mobilmeny' : 'Medlem mobilmeny'}>
      {items.map((item) => {
        const active = activeHref ? activeHref === item.href : false;
        return (
          <Link
            key={item.featureKey}
            href={item.href}
            className={`ct-mobile-footer__item${active ? ' is-active' : ''}`}
            data-feature-key={item.featureKey}
          >
            <span className="ct-mobile-footer__icon" aria-hidden="true">{item.icon}</span>
            <span className="ct-mobile-footer__label">{item.label}</span>
            {item.badge !== undefined ? <span className="ct-mobile-footer__badge">{item.badge}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
