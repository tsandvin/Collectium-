/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Admin brukere page v24
 *
 * Definering / formal:
 * Next.js route for ny Collectium admin-brukerside.
 * Siden rendrer AdminUsersClient inne i eksisterende global AppShell.
 *
 * Bruksomrade:
 * Route: /admin/brukere
 *
 * Berorte sider / routes:
 * - /admin/brukere
 *
 * Berorte DB-brytere / feature_keys:
 * - admin.users.view
 * - admin.users.search
 * - admin.users.detail.view
 * - admin.users.edit
 * - admin.users.disable
 * - admin.users.roles.manage
 * - admin.users.sessions.view
 * - admin.users.activity.view
 * - admin.users.collection.view
 * - admin.users.payments.view
 *
 * Berorte API-ruter:
 * - GET /api/admin/users
 *
 * Berorte tabeller / views:
 * - ct_users
 * - ct_user_profiles
 * - ct_memberships
 * - ct_user_roles
 * - ct_user_sessions
 * - ct_v_feature_access_resolved
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: admin.users
 * log_action: view
 *
 * Versjon:
 * CT-PAGE-ADMIN-USERS-V24 / CHANGE-2026-06-04-admin-users-v24
 *
 * Endringsregel:
 * Sidefilen skal ikke eie design, bakgrunn, panel, kort, skygge eller farger.
 */

import AdminUsersClient from "../../../components/admin/AdminUsersClient";

export const metadata = {
  title: "Admin brukere | Collectium",
  description: "Kontrollert adminside for brukere, medlemskap, roller og samlerstatus.",
};

export default function AdminUsersPage() {
  return <AdminUsersClient />;
}
