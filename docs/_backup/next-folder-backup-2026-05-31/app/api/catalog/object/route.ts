/**
 * COLLECTIUM FILE HEADER
 * Overskrift: Next.js catalog object proxy route
 * Definering / formål: Proxy fra Next.js til PHP/API bridge for ett katalogobjekt.
 * Bruksområde: /api/catalog/object
 * Berørte DB-brytere/feature_keys: catalog.object.open
 * Versjon: CT-NEXT-API-CATALOG-OBJECT-0001
 */

import { NextRequest, NextResponse } from "next/server";
import { collectiumApiGet } from "@/lib/collectiumApi";

export async function GET(request: NextRequest) {
  const sourceKey = request.nextUrl.searchParams.get("source_key") || "";
  const objectGroup = request.nextUrl.searchParams.get("object_group") || "";
  const objectId = request.nextUrl.searchParams.get("object_id") || "";
  const data = await collectiumApiGet("catalog-object.php", {
    source_key: sourceKey,
    object_group: objectGroup,
    object_id: objectId,
  });
  return NextResponse.json({ ok: true, data });
}
