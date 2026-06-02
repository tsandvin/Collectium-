import { NextRequest, NextResponse } from "next/server";
import { getResolvedObject, getResolvedObjects, getSources } from "@/lib/data/collectiumMockData";
import { objectFilterOrder } from "@/lib/specs/collectiumSpecs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source_key = searchParams.get("source_key") ?? "norske_sedler";
  const object_group = searchParams.get("object_group") ?? "banknote";
  const object_id = searchParams.get("object_id") ?? "NO-BN-1949-10-A";
  const object = getResolvedObject(source_key, object_group, object_id);
  return NextResponse.json({ sources: getSources(), object, objects: getResolvedObjects(), filterOrder: objectFilterOrder });
}
