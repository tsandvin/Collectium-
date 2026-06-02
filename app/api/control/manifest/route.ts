import { NextResponse } from "next/server";
import manifest from "@/data/control_manifest.json";

export async function GET() {
  return NextResponse.json(manifest);
}
