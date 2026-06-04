// app/api/object/presentation/route.ts
//
// GET /api/object/presentation?source_key=&object_group=&object_id=
//
// Resolves a full object presentation from DB 8.4 views.
// feature_key: object.presentation.view

import { NextResponse } from "next/server";
import { mockObjectData } from "../../../../lib/object/mock-data";
import type {
  ObjectGroup,
  ObjectPresentationData,
} from "../../../../lib/object/types";

function isObjectGroup(s: string | null): s is ObjectGroup {
  return s === "banknote" || s === "coin" || s === "collectible";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sourceKey = url.searchParams.get("source_key");
  const objectGroup = url.searchParams.get("object_group");
  const objectId = url.searchParams.get("object_id");

  if (!sourceKey) {
    return NextResponse.json(
      { error: "missing_param", param: "source_key" },
      { status: 400 },
    );
  }
  if (!isObjectGroup(objectGroup)) {
    return NextResponse.json(
      {
        error: "invalid_param",
        param: "object_group",
        valid: ["banknote", "coin", "collectible"],
      },
      { status: 400 },
    );
  }
  const idNum = objectId ? parseInt(objectId, 10) : NaN;
  if (!Number.isFinite(idNum)) {
    return NextResponse.json(
      { error: "invalid_param", param: "object_id" },
      { status: 400 },
    );
  }

  // ============================================================
  // PRODUCTION DB QUERIES (Prisma/raw SQL):
  //
  // const [obj, titles, images, market, ctx, rels] = await db.$transaction([
  //   db.$queryRaw`SELECT * FROM ct_v_catalog_objects_resolved
  //                WHERE source_key=${sourceKey}
  //                  AND object_group=${objectGroup}
  //                  AND object_id=${idNum}`,
  //   db.$queryRaw`SELECT * FROM ct_v_catalog_object_titles ...`,
  //   db.$queryRaw`SELECT * FROM ct_v_catalog_object_images_resolved ...`,
  //   db.$queryRaw`SELECT * FROM ct_v_catalog_market_summary ...`,
  //   db.$queryRaw`SELECT * FROM ct_v_catalog_year_context ...`,
  //   db.$queryRaw`SELECT * FROM ct_v_catalog_relations ...`,
  // ]);
  //
  // const userSlice = session
  //   ? await loadUserSlice(session.userId, sourceKey, objectGroup, idNum)
  //   : emptyUserSlice();
  //
  // const data = shape(obj, titles, images, market, ctx, rels, userSlice);
  //
  // // Log feature usage to ct_event_log
  // await db.ct_event_log.create({
  //   data: { feature_key: "object.presentation.view",
  //           source_key: sourceKey,
  //           object_group: objectGroup,
  //           object_id: idNum,
  //           user_id: session?.userId ?? null },
  // });
  //
  // return NextResponse.json(data);
  // ============================================================

  const data: ObjectPresentationData = mockObjectData({
    source_key: sourceKey,
    object_group: objectGroup,
    object_id: idNum,
  });

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
    },
  });
}
