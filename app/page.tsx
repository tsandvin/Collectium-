/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Collectium Frontpage / Landing v13
 *
 * Definering / formål:
 * Ny responsiv forside for app.collectium.no. Siden presenterer Collectium-konseptet,
 * hovedfunksjoner, medlemskap, aktivitet, tilbud og innganger til katalog, samling,
 * auksjon, forhandler, index og historie/museum.
 *
 * Bruksområde:
 * Brukes som offentlig startside i Next.js App Router.
 *
 * Berørte sider / routes:
 * - /
 * - /medlemskap
 * - /katalog
 * - /samling
 * - /auksjon
 * - /forhandler
 * - /index
 * - /relasjon
 *
 * Berørte DB-brytere / feature_keys:
 * - landing.view
 * - landing.register
 * - landing.login
 * - landing.membership
 * - landing.featured_objects
 * - index.trending
 * - index.market
 * - catalog.view
 *
 * Berørte API-ruter:
 * - GET /api/landing/summary              (senere)
 * - GET /api/membership/plans             (senere)
 * - GET /api/index/trending               (senere)
 * - GET /api/catalog/featured             (senere)
 *
 * Berørte tabeller / views:
 * - ct_v_landing_summary                  (senere)
 * - ct_membership_plans                   (senere)
 * - ct_v_catalog_market_summary           (senere)
 * - ct_v_index_trending                   (senere)
 *
 * Dataretning:
 * MariaDB → API/backend → Next.js → React → UI
 *
 * Logging:
 * log_category: landing
 * log_action: view
 *
 * Versjon:
 * CT-FILE-LANDING-0013 / CHANGE-2026-06-02-0013
 *
 * Endringsregel:
 * Dette er en ny modul. Den overskriver ikke global AppShell, Topbar, Sidebar eller DB-kobling.
 */

import CollectiumFrontpageClient from "../components/landing/CollectiumFrontpageClient";

export default function Page() {
  return <CollectiumFrontpageClient />;
}
