/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Auth session API v15
 *
 * Definering / formål:
 * Reads the signed Collectium session cookie for frontend shell, Min side and admin.
 *
 * Berørte DB-brytere / feature_keys:
 * - auth.session.view
 */

import { NextRequest, NextResponse } from "next/server";
import { COLLECTIUM_SESSION_COOKIE, verifySessionToken } from "../../../../lib/auth/collectiumSession";

export async function GET(request: NextRequest) {
  const session = verifySessionToken(request.cookies.get(COLLECTIUM_SESSION_COOKIE)?.value);
  return NextResponse.json({ ok: true, authenticated: Boolean(session), session });
}
