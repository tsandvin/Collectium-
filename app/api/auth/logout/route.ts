/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Auth logout API v15
 *
 * Definering / formål:
 * Clears the temporary Collectium session cookie.
 *
 * Berørte DB-brytere / feature_keys:
 * - auth.logout
 */

import { NextResponse } from "next/server";
import { COLLECTIUM_SESSION_COOKIE } from "../../../../lib/auth/collectiumSession";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COLLECTIUM_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
