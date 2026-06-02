import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Next API virker. MariaDB direkte er deaktivert.",
  });
}