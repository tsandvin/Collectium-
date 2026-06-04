/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Root Layout Minimal
 *
 * Definering / formål:
 * Minimal global layout uten sidebar og topmeny.
 *
 * Bruksområde:
 * Brukes midlertidig for ren frontend med kun forside, login og logout.
 *
 * Berørte sider / routes:
 * - /
 * - /login
 * - /logout
 *
 * Berørte DB-brytere / feature_keys:
 * - landing.view
 * - auth.login
 * - auth.logout
 *
 * Berørte API-ruter:
 * - POST /api/auth/login
 * - POST /api/auth/logout
 * - GET /api/auth/session
 *
 * Berørte tabeller / views:
 * - ct_users
 * - ct_user_sessions
 *
 * Dataretning:
 * MariaDB/API -> Next.js/React -> UI
 *
 * Logging:
 * log_category: shell
 * log_action: minimal_layout
 *
 * Endringsregel:
 * Fjerner bare aktiv frontend shell. API, DB, config og env skal ikke endres.
 */

import type { Metadata } from "next";
import "./globals.css";
import "./collectium-brand-tokens.css";
import "./collectium-front-foundation.css";

export const metadata: Metadata = {
  title: "Collectium",
  description: "Collectium frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" data-template="collectium" data-skin="signature-light" data-vp="pc">
      <body>{children}</body>
    </html>
  );
}
