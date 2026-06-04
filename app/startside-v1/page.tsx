/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Startside V1 route
 *
 * Definering / formål:
 * Next.js route for versjonert Collectium startside testvisning.
 *
 * Bruksområde:
 * Kan åpnes på /startside-v1 uten å erstatte eksisterende root-startside.
 *
 * Berørte sider / routes:
 * - /startside-v1
 *
 * Berørte DB-brytere / feature_keys:
 * - landing.view
 * - auth.login
 * - auth.logout
 * - profile.view
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Versjon:
 * CT-STARTSIDE-V1 / CHANGE-2026-06-04-0001
 */

import CollectiumStartsideV1 from "../../components/startside/CollectiumStartsideV1";

export default function StartsideV1Page() {
  return <CollectiumStartsideV1 />;
}
