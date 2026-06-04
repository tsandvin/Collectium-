/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Collectium frontpage route v27
 *
 * Definering / formål:
 * Public landing route for Collectium. Imports the professional v27 frontpage component.
 *
 * Bruksområde:
 * Used as app/page.tsx in Next.js App Router.
 *
 * Berørte sider / routes:
 * - /
 * - /katalog
 * - /medlemskap
 * - /forhandler
 * - /auksjon
 * - /registrering
 * - /login
 *
 * Berørte DB-brytere / feature_keys:
 * - landing.view
 * - landing.register
 * - landing.login
 * - landing.membership
 * - landing.featured_objects
 *
 * Berørte API-ruter:
 * - Future: GET /api/frontpage/summary
 * - Future: GET /api/frontpage/market-preview
 *
 * Berørte tabeller / views:
 * - Future: ct_v_catalog_objects_resolved
 * - Future: ct_v_catalog_market_summary
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: landing
 * log_action: view
 *
 * Versjon:
 * CT-FRONT-0027 / CHANGE-2026-06-04-0003
 *
 * Endringsregel:
 * Replace only app/page.tsx and add versioned frontpage component files.
 */

import CollectiumFrontpageV27 from "../components/frontpage/CollectiumFrontpageV27";

export default function HomePage() {
  return <CollectiumFrontpageV27 />;
}
