/**
 * COLLECTIUM FILE HEADER
 * Overskrift: Next.js catalog filter proxy route
 * Definering / formål: Proxy fra Next.js til PHP/API bridge for katalogfilter.
 * Bruksområde: /api/catalog/filter
 * Berørte DB-brytere/feature_keys: catalog.filters
 * Versjon: CT-NEXT-API-CATALOG-FILTER-0001
 */

import { NextRequest, NextResponse } from "next/server";
import { collectiumApiGet } from "@/lib/collectiumApi";

export async function GET(request: NextRequest) {
  const sourceKey = request.nextUrl.searchParams.get("source_key") || "norske_sedler";
  const objectGroup = request.nextUrl.searchParams.get("object_group") || "banknote";
  const data = await collectiumApiGet("catalog-filter.php", { source_key: sourceKey, object_group: objectGroup });
  return NextResponse.json({ ok: true, data });
}
