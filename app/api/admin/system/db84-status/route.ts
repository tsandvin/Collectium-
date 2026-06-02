/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Admin DB 8.4 status API
 *
 * Definering / formål:
 * Kontrollerer at DB 8.4-kjeden finnes i MariaDB: sider, features/brytere,
 * side-feature-koblinger, tilgang, action-routes og kritiske catalog views.
 *
 * Bruksområde:
 * Brukes av admin/systemkontroll før katalog og API kobles videre til ekte data.
 *
 * Berørte sider / routes:
 * - /api/admin/system/db84-status
 * - /admin/kontroll
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.system.db84_status.view
 * - admin.control.view
 * - catalog.search
 * - catalog.filters
 * - catalog.object.open
 *
 * Berørte API-ruter:
 * - GET /api/admin/system/db84-status
 *
 * Berørte tabeller / views:
 * - ct_app_pages
 * - ct_app_features
 * - ct_app_page_features
 * - ct_feature_access_rules
 * - ct_v_feature_access_resolved
 * - ct_feature_action_routes
 * - ct_v_catalog_objects_resolved
 * - ct_v_catalog_filter_values
 * - ct_v_catalog_filter_counts
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js route handler -> JSON
 *
 * Logging:
 * log_category: admin.system
 * log_action: db84_status
 *
 * Versjon:
 * CT-FILE-API-DB84STATUS-0001 / CHANGE-2026-05-31-0004
 *
 * Endringsregel:
 * Kun read-only statuskontroll. Skal ikke skrive til database.
 */

import { NextResponse } from "next/server";
import { ctQuery } from "@/db/mariadb";

export const dynamic = "force-dynamic";

type CountRow = {
  count_value: number;
};

type FeatureRouteRow = {
  feature_key: string;
  feature_count: number;
  route_count: number;
};

async function countTableOrView(name: string): Promise<{
  name: string;
  ok: boolean;
  count: number | null;
  error: string | null;
}> {
  try {
    const rows = await ctQuery<CountRow>(`SELECT COUNT(*) AS count_value FROM \`${name}\``);
    return {
      name,
      ok: true,
      count: Number(rows[0]?.count_value ?? 0),
      error: null,
    };
  } catch (error) {
    return {
      name,
      ok: false,
      count: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  const requiredTablesAndViews = [
    "ct_app_pages",
    "ct_app_features",
    "ct_app_page_features",
    "ct_feature_access_rules",
    "ct_v_feature_access_resolved",
    "ct_feature_action_routes",
    "ct_v_catalog_objects_resolved",
    "ct_v_catalog_filter_values",
    "ct_v_catalog_filter_counts",
  ];

  const requiredFeatureKeys = [
    "admin.control.view",
    "catalog.search",
    "catalog.filters",
    "catalog.object.open",
    "auth.login",
    "auth.logout",
    "auth.register",
  ];

  try {
    const tableChecks = await Promise.all(
      requiredTablesAndViews.map((name) => countTableOrView(name))
    );

    let featureChecks: FeatureRouteRow[] = [];

    try {
      featureChecks = await ctQuery<FeatureRouteRow>(
        `
        SELECT
          f.feature_key,
          COUNT(DISTINCT f.feature_key) AS feature_count,
          COUNT(DISTINCT r.id) AS route_count
        FROM ct_app_features f
        LEFT JOIN ct_feature_action_routes r
          ON r.feature_key = f.feature_key
        WHERE f.feature_key IN (${requiredFeatureKeys.map(() => "?").join(",")})
        GROUP BY f.feature_key
        ORDER BY f.feature_key
        `,
        requiredFeatureKeys
      );
    } catch {
      featureChecks = [];
    }

    const featureStatus = requiredFeatureKeys.map((featureKey) => {
      const found = featureChecks.find((row) => row.feature_key === featureKey);

      return {
        feature_key: featureKey,
        feature_exists: Number(found?.feature_count ?? 0) > 0,
        action_route_exists: Number(found?.route_count ?? 0) > 0,
      };
    });

    const ok =
      tableChecks.every((check) => check.ok) &&
      featureStatus.every((check) => check.feature_exists);

    return NextResponse.json({
      ok,
      source: "mariadb",
      route: "/api/admin/system/db84-status",
      data: {
        table_checks: tableChecks,
        feature_checks: featureStatus,
      },
      errors: [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        source: "mariadb",
        route: "/api/admin/system/db84-status",
        data: null,
        errors: [
          {
            code: "DB84_STATUS_FAILED",
            message: error instanceof Error ? error.message : "Unknown database error",
          },
        ],
      },
      { status: 500 }
    );
  }
}
