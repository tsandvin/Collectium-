/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Collectium startside v23
 *
 * Definering / formaal:
 * Offentlig startside for Collectium med levende objektpresentasjon, historiske felt,
 * forhandlerposisjon og medlemskap/CTA. Siden bruker global layout fra app-shell og
 * legger bare inn sideinnhold.
 *
 * Bruksomraade:
 * Brukes som appens offentlige startside i Next.js App Router.
 *
 * Berorte sider / routes:
 * - /
 * - /katalog
 * - /registrering
 * - /login
 * - /min-side
 * - /forhandler
 *
 * Berorte DB-brytere / feature_keys:
 * - landing.view
 * - landing.register
 * - landing.login
 * - landing.featured_objects
 * - catalog.view
 * - catalog.object.open
 * - collection.view
 *
 * Berorte API-ruter:
 * - Fremtidig: GET /api/frontpage/featured-objects
 * - Fremtidig: GET /api/catalog/object
 *
 * Berorte tabeller / views:
 * - Fremtidig: ct_v_catalog_objects_resolved
 * - Fremtidig: ct_v_catalog_object_titles
 * - Fremtidig: ct_v_catalog_relations
 * - Fremtidig: ct_v_catalog_market_summary
 *
 * Dataretning:
 * Kataloggrunnlag -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: landing
 * log_action: view
 *
 * Versjon:
 * CT-FRONT-0023 / CHANGE-2026-06-04-0001
 *
 * Endringsregel:
 * Dette er ny startsidemodul. Global shell, skin, topbar, sidebar og globale designfiler
 * skal ikke overskrives av denne siden.
 */

import CollectiumFrontpageV23 from "../components/frontpage/CollectiumFrontpageV23";

export default function HomePage() {
  return <CollectiumFrontpageV23 />;
}
