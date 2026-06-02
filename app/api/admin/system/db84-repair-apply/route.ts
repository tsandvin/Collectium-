import { NextResponse } from "next/server";
import { ctQuery } from "@/db/mariadb";

export const dynamic = "force-dynamic";

type FeatureRow = {
  id: number | bigint;
  feature_key: string;
};

type CountRow = {
  count_value: number | bigint;
};

const repairs = [
  {
    feature_key: "admin.control.view",
    action_key: "admin.control.view.route",
    action_name_no: "Vis admin kontrollpanel",
    calculation_type: "read",
    http_method: "GET",
    api_endpoint: "/api/admin/control",
    route_path: "/api/admin/control",
    handler_file: "app/api/admin/control/route.ts",
    log_category: "admin",
    log_action: "control_view",
    requires_login: 1,
    sort_order: 100,
  },
  {
    feature_key: "auth.login",
    action_key: "auth.login.route",
    action_name_no: "Logg inn",
    calculation_type: "create",
    http_method: "POST",
    api_endpoint: "/api/auth/login",
    route_path: "/api/auth/login",
    handler_file: "app/api/auth/login/route.ts",
    read_table: "ct_users",
    write_table: "ct_user_sessions",
    log_category: "auth",
    log_action: "login",
    requires_login: 0,
    requires_csrf: 1,
    requires_audit: 1,
    writes_audit_log: 1,
    sort_order: 110,
  },
  {
    feature_key: "auth.logout",
    action_key: "auth.logout.route",
    action_name_no: "Logg ut",
    calculation_type: "update",
    http_method: "POST",
    api_endpoint: "/api/auth/logout",
    route_path: "/api/auth/logout",
    handler_file: "app/api/auth/logout/route.ts",
    read_table: "ct_user_sessions",
    write_table: "ct_user_sessions",
    log_category: "auth",
    log_action: "logout",
    requires_login: 1,
    requires_csrf: 1,
    requires_audit: 1,
    writes_audit_log: 1,
    sort_order: 120,
  },
];

function safe(value: unknown) {
  return JSON.parse(
    JSON.stringify(value, (_key, currentValue) =>
      typeof currentValue === "bigint" ? Number(currentValue) : currentValue
    )
  );
}

async function getFeature(featureKey: string): Promise<FeatureRow | null> {
  const rows = await ctQuery<FeatureRow>(
    "SELECT id, feature_key FROM ct_app_features WHERE feature_key = ? LIMIT 1",
    [featureKey]
  );
  return rows[0] ?? null;
}

async function getRouteCount(featureKey: string): Promise<number> {
  const rows = await ctQuery<CountRow>(
    "SELECT COUNT(*) AS count_value FROM ct_feature_action_routes WHERE feature_key = ?",
    [featureKey]
  );
  return Number(rows[0]?.count_value ?? 0);
}

export async function POST(request: Request) {
  const url = new URL(request.url);

  if (url.searchParams.get("apply") !== "YES") {
    return NextResponse.json(
      {
        ok: false,
        source: "mariadb",
        route: "/api/admin/system/db84-repair-apply",
        data: {
          repair_mode: "locked",
          message: "Add ?apply=YES to execute repair.",
        },
        errors: [],
      },
      { status: 400 }
    );
  }

  const results = [];

  try {
    for (const repair of repairs) {
      const feature = await getFeature(repair.feature_key);

      if (!feature) {
        results.push({
          feature_key: repair.feature_key,
          status: "SKIPPED",
          reason: "FEATURE_NOT_FOUND",
        });
        continue;
      }

      const routeCount = await getRouteCount(repair.feature_key);

      if (routeCount > 0) {
        results.push({
          feature_key: repair.feature_key,
          status: "SKIPPED",
          reason: "ROUTE_ALREADY_EXISTS",
          route_count: routeCount,
        });
        continue;
      }

      await ctQuery(
        `
        INSERT INTO ct_feature_action_routes (
          feature_id,
          feature_key,
          action_key,
          action_name_no,
          calculation_type,
          http_method,
          api_endpoint,
          route_path,
          handler_file,
          read_table,
          write_table,
          requires_login,
          writes_event_log,
          writes_audit_log,
          log_category,
          log_action,
          requires_csrf,
          requires_audit,
          active,
          is_active,
          is_enabled,
          sort_order
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, 1, 1, 1, ?
        )
        `,
        [
          Number(feature.id),
          repair.feature_key,
          repair.action_key,
          repair.action_name_no,
          repair.calculation_type,
          repair.http_method,
          repair.api_endpoint,
          repair.route_path,
          repair.handler_file,
          repair.read_table ?? null,
          repair.write_table ?? null,
          repair.requires_login,
          repair.writes_audit_log ?? 0,
          repair.log_category,
          repair.log_action,
          repair.requires_csrf ?? 0,
          repair.requires_audit ?? 0,
          repair.sort_order,
        ]
      );

      results.push({
        feature_key: repair.feature_key,
        status: "INSERTED",
      });
    }

    return NextResponse.json(
      safe({
        ok: true,
        source: "mariadb",
        route: "/api/admin/system/db84-repair-apply",
        data: {
          repair_mode: "applied",
          results,
        },
        errors: [],
      })
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        source: "mariadb",
        route: "/api/admin/system/db84-repair-apply",
        data: { results },
        errors: [
          {
            code: "DB84_REPAIR_APPLY_FAILED",
            message: error instanceof Error ? error.message : "Unknown database error",
          },
        ],
      },
      { status: 500 }
    );
  }
}
