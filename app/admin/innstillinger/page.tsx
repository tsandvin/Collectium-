/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Admin innstillinger v16
 *
 * Definering / formål:
 * Administrasjon av Collectium-innstillinger for design, tilgang, moduler, API-ruter og system.
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.settings.view
 * - admin.access.rules
 */

import CollectiumAppShell from "../../../components/app/CollectiumAppShell";

export default function AdminSettingsPage() {
  return <CollectiumAppShell page="admin" adminModule="settings" />;
}
