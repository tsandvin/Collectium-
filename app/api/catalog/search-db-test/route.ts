import { NextResponse } from "next/server";
import { ctQuery } from "@/db/mariadb";

export const dynamic = "force-dynamic";

type CatalogRow = Record<string, unknown>;

function safeJson<T>(value: T): T {
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

function cleanLimit(value: string | null): number {
  const parsed = Number(value ?? 25);
  if (!Number.isFinite(parsed)) return 25;
  return Math.min(Math.max(parsed, 1), 100);
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  const sourceKey = url.searchParams.get("source_key") || "norske_sedler";
  const objectGroup = url.searchParams.get("object_group") || "banknote";
  const q = (url.searchParams.get("q") || "").trim();
  const limit = cleanLimit(url.searchParams.get("limit"));

  try {
    const params: unknown[] = [sourceKey, objectGroup];
    let where = "WHERE source_key = ? AND object_group = ?";

    if (q !== "") {
      where += `
        AND (
          CAST(object_id AS CHAR) LIKE ?
          OR COALESCE(collectium_title, '') LIKE ?
          OR COALESCE(source_catalog_number, '') LIKE ?
          OR COALESCE(local_catalog_number, '') LIKE ?
        )
      `;
      const like = `%${q}%`;
      params.push(like, like, like, like);
    }

    params.push(limit);

    const rows = await ctQuery<CatalogRow>(
      `
      SELECT *
      FROM ct_v_catalog_objects_resolved
      ${where}
      LIMIT ?
      `,
      params
    );

    return NextResponse.json(
      safeJson({
        ok: true,
        source: "mariadb",
        route: "/api/catalog/search-db-test",
        data: {
          source_key: sourceKey,
          object_group: objectGroup,
          q,
          limit,
          count: rows.length,
          objects: rows,
        },
        errors: [],
      })
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        source: "mariadb",
        route: "/api/catalog/search-db-test",
        data: null,
        errors: [
          {
            code: "CATALOG_SEARCH_DB_TEST_FAILED",
            message: error instanceof Error ? error.message : "Unknown database error",
          },
        ],
      },
      { status: 500 }
    );
  }
}
