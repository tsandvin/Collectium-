/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Auth login API v15
 *
 * Definering / formål:
 * Temporary Next.js login endpoint for Collectium public login. Superadmin login is
 * controlled by server-only environment variables. Normal DB-backed auth must later
 * replace this route.
 *
 * Berørte sider / routes:
 * - /login
 * - /minside
 * - /admin
 *
 * Berørte DB-brytere / feature_keys:
 * - auth.login
 * - auth.session.create
 *
 * Berørte API-ruter:
 * - POST /api/auth/login
 *
 * Logging:
 * log_category: auth
 * log_action: login
 */

import { NextRequest, NextResponse } from "next/server";
import {
  COLLECTIUM_SESSION_COOKIE,
  createCookieOptions,
  createSessionToken,
  isConfiguredSuperAdmin,
  type CollectiumSession,
} from "../../../../lib/auth/collectiumSession";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "MISSING_CREDENTIALS", message: "E-post og passord må fylles ut." },
      { status: 400 },
    );
  }

  let session: CollectiumSession | null = null;

  if (isConfiguredSuperAdmin(email, password)) {
    session = {
      email,
      name: "Collectium superadmin",
      role: "superadmin",
      membership: "Admin",
      createdAt: new Date().toISOString(),
    };
  }

  if (!session) {
    return NextResponse.json(
      {
        ok: false,
        error: "LOGIN_NOT_CONNECTED",
        message:
          "Innlogging er klar i frontend/API, men brukeren finnes ikke i auth-kilden ennå. Sett COLLECTIUM_SUPERADMIN_EMAIL og COLLECTIUM_SUPERADMIN_PASSWORD i Vercel for midlertidig superadmin, eller koble MariaDB-auth.",
      },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true, session });
  response.cookies.set(COLLECTIUM_SESSION_COOKIE, createSessionToken(session), createCookieOptions());
  return response;
}
