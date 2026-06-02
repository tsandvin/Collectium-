/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Admin brukere v16
 *
 * Definering / formål:
 * Administrasjon av brukere, medlemskap, KYC, auksjon, historikk og innstillinger.
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.users.view
 * - admin.membership.view
 * - admin.users.edit
 */

import CollectiumAppShell from "../../../components/app/CollectiumAppShell";

export default function AdminUsersPage() {
  return <CollectiumAppShell page="admin" adminModule="users" />;
}
