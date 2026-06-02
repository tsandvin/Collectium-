/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Katalog v22
 *
 * Definering / formål:
 * Innlogget katalogside med CollectiumAppShell, sidemeny, toppmeny og mobil filter-lag.
 *
 * Berørte DB-brytere / feature_keys:
 * - catalog.view
 * - catalog.search
 * - catalog.filters
 * - catalog.object.open
 */

import CollectiumAppShell from "../../components/app/CollectiumAppShell";

export default function CatalogPage() {
  return <CollectiumAppShell page="catalog" />;
}
