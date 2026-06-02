/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * DB 8.4 repair preview API
 *
 * Definering / formål:
 * Lager read-only forhåndsvisning av manglende action-routes i DB 8.4.
 *
 * Bruksområde:
 * Brukes før man eventuelt oppretter manglende rader i ct_feature_action_routes.
 *
 * Berørte sider / routes:
 * - /api/admin/system/db84-repair-preview
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.control.view
 * - auth.login
 * - auth.logout
 *
 * Berørte API-ruter:
 * - GET /api/admin/system/db84-repair-preview
 *
 * Berørte tabeller / views:
 * - ct_app_features
 * - ct_feature_action_routes
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js route handler -> JSON
 *
 * Logging:
 * log_category: admin.system
 * log_action: db84_repair_preview
 *
 * Versjon:
 * CT-FILE-API-DB84REPAIRPREVIEW-0001 / CHANGE-2026-05-31-0007
 *
 * Endringsregel:
 * Read-only. Skal ikke skrive til database.
 */

import { NextResponse } from "next/server";
import { ctQuery } from "@/db/mariadb";

export const dynamic = "force-dynamic";

type FeatureRow = {
  id: number | bigint;
  feature_key: string;
  feature_name_no: string | null;
};

type ExistingRouteRow = {
  feature_key: string;
  route_count: number | bigint;
};

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
  const missingFeatureKeys = [
    "admin.control.view",
    "auth.login",
    "auth.logout",
  ];

  const suggestedRoutes: Record<string, Partial<Record<string, unknown>>> = {
    "admin.control.view": {
      action_key: "admin.control.view.route",
      action_name_no: "Vis admin kontrollpanel",
      description_no: "Next.js/API-rute for admin kontrollstatus.",
      calculation_type: "read",
      http_method: "GET",
      frontend_component_key: "admin_control",
      php_file: null,
      api_endpoint: "/api/admin/control",
      route_path: "/api/admin/control",
      handler_file: "app/api/admin/control/route.ts",
      read_table: null,
      read_view: null,
      write_table: null,
      requires_login: 1,
      writes_event_log: 1,
      writes_audit_log: 0,
      log_category: "admin",
      log_action: "control_view",
      requires_csrf: 0,
      requires_audit: 0,
      active: 1,
      is_active: 1,
      is_enabled: 1,
      sort_order: 100,
      admin_explanation_no: "Kobler admin.control.view til Next.js admin control API.",
      frontend_explanation_no: "Viser teknisk kontrollstatus for admin.",
    },
    "auth.login": {
      action_key: "auth.login.route",
      action_name_no: "Logg inn",
      description_no: "Next.js/API-rute for innlogging.",
      calculation_type: "create",
      http_method: "POST",
      frontend_component_key: "auth_login_form",
      php_file: null,
      api_endpoint: "/api/auth/login",
      route_path: "/api/auth/login",
      handler_file: "app/api/auth/login/route.ts",
      read_table: "ct_users",
      read_view: null,
      write_table: "ct_user_sessions",
      requires_login: 0,
      writes_event_log: 1,
      writes_audit_log: 1,
      log_category: "auth",
      log_action: "login",
      requires_csrf: 1,
      requires_audit: 1,
      active: 1,
      is_active: 1,
      is_enabled: 1,
      sort_order: 110,
      admin_explanation_no: "Kobler auth.login til Next.js login API.",
      frontend_explanation_no: "Logger bruker inn.",
    },
    "auth.logout": {
      action_key: "auth.logout.route",
      action_name_no: "Logg ut",
      description_no: "Next.js/API-rute for utlogging.",
      calculation_type: "update",
      http_method: "POST",
      frontend_component_key: "auth_logout_button",
      php_file: null,
      api_endpoint: "/api/auth/logout",
      route_path: "/api/auth/logout",
      handler_file: "app/api/auth/logout/route.ts",
      read_table: "ct_user_sessions",
      read_view: null,
      write_table: "ct_user_sessions",
      requires_login: 1,
      writes_event_log: 1,
      writes_audit_log: 1,
      log_category: "auth",
      log_action: "logout",
      requires_csrf: 1,
      requires_audit: 1,
      active: 1,
      is_active: 1,
      is_enabled: 1,
      sort_order: 120,
      admin_explanation_no: "Kobler auth.logout til Next.js logout API.",
      frontend_explanation_no: "Logger bruker ut.",
    },
  };

  try {
    const features = await ctQuery<FeatureRow>(
      `
      SELECT id, feature_key, feature_name_no
      FROM ct_app_features
      WHERE feature_key IN (${missingFeatureKeys.map(() => "?").join(",")})
      ORDER BY feature_key
      `,
      missingFeatureKeys
    );

    const existingRoutes = await ctQuery<ExistingRouteRow>(
      `
      SELECT feature_key, COUNT(*) AS route_count
      FROM ct_feature_action_routes
      WHERE feature_key IN (${missingFeatureKeys.map(() => "?").join(",")})
      GROUP BY feature_key
      ORDER BY feature_key
      `,
      missingFeatureKeys
    );

    const preview = missingFeatureKeys.map((featureKey) => {
      const feature = features.find((row) => row.feature_key === featureKey);
      const existing = existingRoutes.find((row) => row.feature_key === featureKey);
      const routeCount = Number(existing?.route_count ?? 0);

      return {
        feature_key: featureKey,
        feature_exists: Boolean(feature),
        feature_id: feature ? Number(feature.id) : null,
        current_route_count: routeCount,
        needs_repair: Boolean(feature) && routeCount === 0,
        suggested_insert: feature
          ? {
              feature_id: Number(feature.id),
              feature_key: featureKey,
              ...suggestedRoutes[featureKey],
            }
          : null,
      };
    });

    return NextResponse.json(
      jsonSafe({
        ok: true,
        source: "mariadb",
        route: "/api/admin/system/db84-repair-preview",
        data: {
          repair_mode: "preview_only",
          target_table: "ct_feature_action_routes",
          preview,
        },
        errors: [],
      })
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        source: "mariadb",
        route: "/api/admin/system/db84-repair-preview",
        data: null,
        errors: [
          {
            code: "DB84_REPAIR_PREVIEW_FAILED",
            message: error instanceof Error ? error.message : "Unknown database error",
          },
        ],
      },
      { status: 500 }
    );
  }
}
