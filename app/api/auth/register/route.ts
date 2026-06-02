/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Auth register API v15
 *
 * Definering / formål:
 * Temporary registration endpoint. It creates a local signed session cookie without
 * writing to MariaDB. Production registration must later write through DB 8.4/auth.
 *
 * Berørte DB-brytere / feature_keys:
 * - auth.register
 * - auth.membership.create
 * - auth.session.create
 */

import { NextRequest, NextResponse } from "next/server";
import {
  COLLECTIUM_SESSION_COOKIE,
  createCookieOptions,
  createSessionToken,
  normalizeMembership,
  type CollectiumSession,
} from "../../../../lib/auth/collectiumSession";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "Collectium bruker").trim();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "MISSING_FIELDS", message: "E-post og passord må fylles ut." },
      { status: 400 },
    );
  }

  const session: CollectiumSession = {
    email,
    name: name || email,
    role: "collector",
    membership: normalizeMembership(body.membership),
    createdAt: new Date().toISOString(),
  };

  const response = NextResponse.json({
    ok: true,
    session,
    message: "Midlertidig konto/session opprettet. MariaDB-lagring kobles senere.",
  });
  response.cookies.set(COLLECTIUM_SESSION_COOKIE, createSessionToken(session), createCookieOptions());
  return response;
}
