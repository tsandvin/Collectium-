import { AdminUserSearchInsightRow } from "../../../components/admin/AdminUserSearchInsightRow";
import "../../../styles/collectium-admin-users-v20-1.css";
/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Admin brukere v16
 *
 * Definering / formÃ¥l:
 * Administrasjon av brukere, medlemskap, KYC, auksjon, historikk og innstillinger.
 *
 * BerÃ¸rte DB-brytere / feature_keys:
 * - admin.users.view
 * - admin.membership.view
 * - admin.users.edit
 */

import CollectiumAppShell from "../../../components/app/CollectiumAppShell";

export default function AdminUsersPage() {
  return <CollectiumAppShell page="admin" adminModule="users" />;
}


