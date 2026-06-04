import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { ok: false, error: "MISSING_CREDENTIALS" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({
    ok: true,
    user: {
      email: body.email,
    },
  });

  response.cookies.set("collectium_session", "minimal-session", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
