/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Collectium cookie session helper v15
 *
 * Definering / formål:
 * Server-only helper for temporary Collectium auth sessions in Next.js route handlers.
 * This is not a replacement for MariaDB auth. It gives login/register/minside/admin a
 * controlled working flow until DB-backed authentication is connected.
 *
 * Bruksområde:
 * Used by /api/auth/login, /api/auth/register, /api/auth/logout and /api/auth/session.
 *
 * Berørte sider / routes:
 * - /login
 * - /registrering
 * - /minside
 * - /admin
 *
 * Berørte DB-brytere / feature_keys:
 * - auth.login
 * - auth.register
 * - auth.session.create
 * - profile.view
 * - admin.control.view
 *
 * Berørte API-ruter:
 * - POST /api/auth/login
 * - POST /api/auth/register
 * - POST /api/auth/logout
 * - GET /api/auth/session
 *
 * Dataretning:
 * API/backend -> Next.js -> React -> UI. MariaDB auth should replace this helper later.
 *
 * Logging:
 * log_category: auth
 * log_action: session
 */

import crypto from "node:crypto";

export type CollectiumRole = "guest" | "user" | "collector" | "dealer" | "admin" | "superadmin";

export type CollectiumSession = {
  email: string;
  name: string;
  role: CollectiumRole;
  membership: "Free" | "Bronze" | "Silver" | "Gold" | "Platinum" | "Admin";
  createdAt: string;
};

export const COLLECTIUM_SESSION_COOKIE = "ct_session";

function getSecret() {
  return process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || "collectium-local-dev-session-secret";
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function createSessionToken(session: CollectiumSession) {
  const payload = base64UrlEncode(JSON.stringify(session));
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string | null): CollectiumSession | null {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (!safeEqual(sign(payload), signature)) return null;

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as CollectiumSession;
    if (!parsed.email || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function normalizeMembership(value: unknown): CollectiumSession["membership"] {
  const raw = String(value || "Free").toLowerCase();
  if (raw.includes("platinum")) return "Platinum";
  if (raw.includes("gold")) return "Gold";
  if (raw.includes("silver")) return "Silver";
  if (raw.includes("bronze")) return "Bronze";
  if (raw.includes("admin")) return "Admin";
  return "Free";
}

export function isConfiguredSuperAdmin(email: string, password: string) {
  const configuredEmail = process.env.COLLECTIUM_SUPERADMIN_EMAIL;
  const configuredPassword = process.env.COLLECTIUM_SUPERADMIN_PASSWORD;
  if (!configuredEmail || !configuredPassword) return false;
  return email.trim().toLowerCase() === configuredEmail.trim().toLowerCase() && password === configuredPassword;
}

export function createCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
