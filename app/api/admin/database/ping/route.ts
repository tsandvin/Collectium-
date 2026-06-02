/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Admin database ping API
 *
 * Definering / formål:
 * Tester at Next.js server-side kan koble til MariaDB via src/db/mariadb.ts.
 *
 * Bruksområde:
 * Brukes i Fase 2 for å bekrefte DB_HOST, DB_NAME, DB_USER, DB_PASSWORD og DB_PORT.
 *
 * Berørte sider / routes:
 * - /api/admin/database/ping
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.database.ping
 * - database.connection
 *
 * Berørte API-ruter:
 * - GET /api/admin/database/ping
 *
 * Berørte tabeller / views:
 * - SELECT 1 AS ping_result
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js route handler -> JSON
 *
 * Logging:
 * log_category: database
 * log_action: ping
 *
 * Versjon:
 * CT-FILE-API-DBPING-0001 / CHANGE-2026-05-31-0003
 *
 * Endringsregel:
 * Kun server-side. Skal ikke importeres i client components.
 */

import { NextResponse } from "next/server";
import { ctPing } from "@/db/mariadb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ok = await ctPing();

    return NextResponse.json({
      ok,
      source: "mariadb",
      route: "/api/admin/database/ping",
      data: {
        ping: ok ? "OK" : "FAILED",
      },
      errors: [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        source: "mariadb",
        route: "/api/admin/database/ping",
        data: null,
        errors: [
          {
            code: "DB_PING_FAILED",
            message: error instanceof Error ? error.message : "Unknown database error",
          },
        ],
      },
      { status: 500 }
    );
  }
}
