/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Admin Kontrollside
 *
 * Definering / formål:
 * Next.js-side for admin kontroll med tab-basert mobil/desktop UI, online status,
 * dashboard for teknisk DB, Vercel, aktivitet, brukere, admin logg, meldinger og avanserte innstillinger.
 *
 * Bruksområde:
 * Route: /admin/kontroll
 *
 * Berørte sider / routes:
 * - /admin/kontroll
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.control.view
 * - admin.system.dashboard.view
 * - admin.system.db_map.view
 * - admin.system.vercel_status.view
 * - admin.activity.view
 * - admin.users.view
 * - admin.logs.view
 * - admin.messages.view
 * - admin.settings.view
 *
 * Berørte API-ruter:
 * - GET /api/admin/system/dashboard
 * - GET /api/admin/system/db-map
 * - GET /api/admin/system/vercel-status
 * - GET /api/admin/activity
 * - GET /api/admin/users/summary
 * - GET /api/admin/logs/latest
 * - GET /api/admin/messages
 * - GET /api/admin/settings
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: admin
 * log_action: control.view
 *
 * Versjon:
 * CT-FILE-ADMIN-CONTROL-PAGE-0001 / CHANGE-2026-06-02-0001
 */

import CollectiumAppShell from '@/components/app/CollectiumAppShell';
import { AdminControlTabs } from '@/components/collectium/admin/AdminControlTabs';
import '@/styles/collectium-admin-mobile-tabs.css';

export default function AdminControlPage() {
  return (
    <CollectiumAppShell page="admin" adminModule="control">
      <AdminControlTabs />
    </CollectiumAppShell>
  );
}
