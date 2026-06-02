/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * DB 8.4 action-route schema inspector
 *
 * Definering / formål:
 * Leser kolonnene i ct_feature_action_routes og eksisterende rader for valgte feature_keys.
 *
 * Bruksområde:
 * Brukes før repair av manglende action-routes, slik at vi ikke gjetter kolonnenavn.
 *
 * Berørte sider / routes:
 * - /api/admin/system/db84-routes-schema
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.control.view
 * - auth.login
 * - auth.logout
 * - auth.register
 * - catalog.search
 * - catalog.filters
 * - catalog.object.open
 *
 * Berørte API-ruter:
 * - GET /api/admin/system/db84-routes-schema
 *
 * Berørte tabeller / views:
 * - INFORMATION_SCHEMA.COLUMNS
 * - ct_feature_action_routes
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js route handler -> JSON
 *
 * Logging:
 * log_category: admin.system
 * log_action: db84_routes_schema
 *
 * Versjon:
 * CT-FILE-API-DB84ROUTESCHEMA-0002 / CHANGE-2026-05-31-0006
 *
 * Endringsregel:
 * Kun read-only schema/statuskontroll. Skal ikke skrive til database.
 */

import { NextResponse } from "next/server";
import { ctQuery } from "@/db/mariadb";

export const dynamic = "force-dynamic";

type ColumnRow = {
  column_name: string;
  column_type: string;
  is_nullable: string;
  column_default: string | null;
  extra: string;
};

type RouteRow = Record<string, unknown>;

function jsonSafe<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, currentValue) => {
      if (typeof currentValue === "bigint") {
        const asNumber = Number(currentValue);
        return Number.isSafeInteger(asNumber) ? asNumber : currentValue.toString();
      }

      return currentValue;
    })
  ) as T;
}

export async function GET() {
  const featureKeys = [
    "admin.control.view",
    "auth.login",
    "auth.logout",
    "auth.register",
    "catalog.search",
    "catalog.filters",
    "catalog.object.open",
  ];

  try {
    const columns = await ctQuery<ColumnRow>(
      `
      SELECT
        COLUMN_NAME AS column_name,
        COLUMN_TYPE AS column_type,
        IS_NULLABLE AS is_nullable,
        COLUMN_DEFAULT AS column_default,
        EXTRA AS extra
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'ct_feature_action_routes'
      ORDER BY ORDINAL_POSITION
      `
    );

    const routes = await ctQuery<RouteRow>(
      `
      SELECT *
      FROM ct_feature_action_routes
      WHERE feature_key IN (${featureKeys.map(() => "?").join(",")})
      ORDER BY feature_key
      `,
      featureKeys
    );

    return NextResponse.json(
      jsonSafe({
        ok: true,
        source: "mariadb",
        route: "/api/admin/system/db84-routes-schema",
        data: {
          table: "ct_feature_action_routes",
          columns,
          checked_feature_keys: featureKeys,
          existing_routes: routes,
        },
        errors: [],
      })
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        source: "mariadb",
        route: "/api/admin/system/db84-routes-schema",
        data: null,
        errors: [
          {
            code: "DB84_ROUTES_SCHEMA_FAILED",
            message: error instanceof Error ? error.message : "Unknown database error",
          },
        ],
      },
      { status: 500 }
    );
  }
}
