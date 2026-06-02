/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * MariaDB server-only databaseklient
 *
 * Definering / formål:
 * Oppretter én trygg MariaDB connection pool for Next.js server-side bruk.
 *
 * Bruksområde:
 * Brukes kun fra API routes, server components og server-side queryfiler.
 *
 * Berørte sider / routes:
 * - /api/*
 * - /katalog
 * - /admin/kontroll
 *
 * Berørte DB-brytere / feature_keys:
 * - database.connection
 * - catalog.search
 * - catalog.filters
 *
 * Berørte API-ruter:
 * - GET /api/catalog/search
 * - GET /api/catalog/filter
 *
 * Berørte tabeller / views:
 * - MariaDB DB 8.3 / DB 8.4 views etter modul
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: database
 * log_action: connection
 *
 * Versjon:
 * CT-FILE-DB-0001 / CHANGE-2026-05-31-0002
 *
 * Endringsregel:
 * Server-only. Skal aldri importeres i Client Components.
 */

import "server-only";
import * as mariadb from "mariadb";

const requiredEnv = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const globalForMariaDb = globalThis as unknown as {
  collectiumMariaDbPool?: mariadb.Pool;
};

export const ctPool =
  globalForMariaDb.collectiumMariaDbPool ??
  mariadb.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 5),
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 10000),
    acquireTimeout: Number(process.env.DB_ACQUIRE_TIMEOUT || 10000),
    idleTimeout: Number(process.env.DB_IDLE_TIMEOUT || 60),
    charset: "utf8mb4",
  });

if (process.env.NODE_ENV !== "production") {
  globalForMariaDb.collectiumMariaDbPool = ctPool;
}

export async function ctQuery<T = unknown>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  let connection: mariadb.PoolConnection | undefined;

  try {
    connection = await ctPool.getConnection();
    const rows = await connection.query(sql, params);
    return rows as T[];
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function ctPing(): Promise<boolean> {
  const rows = await ctQuery<{ ping_result: number }>("SELECT 1 AS ping_result");
  return rows[0]?.ping_result === 1;
}
