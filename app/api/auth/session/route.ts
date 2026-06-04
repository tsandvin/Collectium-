import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const loggedIn = cookie.includes("collectium_session=");

  return NextResponse.json({
    ok: true,
    authenticated: loggedIn,
  });
}
