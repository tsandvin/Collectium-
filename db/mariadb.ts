/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * db/mariadb
 *
 * Definering / formål:
 * Midlertidig server-side MariaDB bridge for Next.js build og API-ruter.
 * Skal senere kobles til ekte MariaDB-driver og DB 8.4-kontroll.
 *
 * Berørte sider / routes:
 * - /api/admin/database/ping
 * - /api/admin/system/db84-*
 * - /api/catalog/search-db-test
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.database.ping
 * - admin.system.db84.status
 * - catalog.search
 *
 * Dataretning:
 * API/backend -> MariaDB fallback
 */

export type CtQueryParams = unknown[];

export async function ctQuery<T = Record<string, unknown>>(
  _sql: string,
  _params: CtQueryParams = []
): Promise<T[]> {
  return [];
}

export async function ctPing() {
  return {
    ok: true,
    source: "collectium-build-fallback",
    message: "MariaDB bridge exists. Real DB connection must be configured later.",
    env: {
      hasHost: Boolean(process.env.DB_HOST),
      hasDatabase: Boolean(process.env.DB_NAME),
      hasUser: Boolean(process.env.DB_USER),
      hasPassword: Boolean(process.env.DB_PASSWORD),
    },
  };
}
