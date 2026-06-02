/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Min side v15
 *
 * Definering / formål:
 * Første innloggede Min side med app-shell og session-kontroll.
 *
 * Berørte DB-brytere / feature_keys:
 * - profile.view
 * - collection.view
 */

import CollectiumAppShell from "../../components/app/CollectiumAppShell";

export default function MinSidePage() {
  return <CollectiumAppShell page="minside" />;
}
