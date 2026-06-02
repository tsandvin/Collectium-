/**
 * COLLECTIUM FILE HEADER
 * Overskrift: Next.js catalog search proxy route
 * Definering / formål: Proxy fra Next.js til PHP/API bridge for katalogsøk.
 * Bruksområde: /api/catalog/search
 * Berørte DB-brytere/feature_keys: catalog.search
 * Versjon: CT-NEXT-API-CATALOG-SEARCH-0001
 */

import { NextRequest, NextResponse } from "next/server";
import { collectiumApiGet } from "@/lib/collectiumApi";

export async function GET(request: NextRequest) {
  const sourceKey = request.nextUrl.searchParams.get("source_key") || "norske_sedler";
  const objectGroup = request.nextUrl.searchParams.get("object_group") || "banknote";
  const q = request.nextUrl.searchParams.get("q") || "";
  const data = await collectiumApiGet("catalog-search.php", { source_key: sourceKey, object_group: objectGroup, q });
  return NextResponse.json({ ok: true, data });
}
