/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Admin v15
 *
 * Definering / formål:
 * Første adminside med app-shell og superadmin-kontroll via session.
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.control.view
 * - admin.users.manage
 */

import CollectiumAppShell from "../../components/app/CollectiumAppShell";

export default function AdminPage() {
  return <CollectiumAppShell page="admin" />;
}
