/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Root Layout Minimal White
 *
 * Definering / formål:
 * Minimal global root layout uten sidebar, topmeny, skin-runtime eller permanent Collectium-bakgrunn.
 *
 * Bruksområde:
 * Brukes for ren frontend-baseline med kun /, /login og /logout.
 *
 * Berørte sider / routes:
 * - /
 * - /login
 * - /logout
 * - /_not-found
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
 * log_action: minimal_white_layout
 *
 * Endringsregel:
 * Ingen DB-config, API, env, package eller backend endres.
 */

import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="no">
      <body style={{ margin: 0, background: "#ffffff", color: "#061827" }}>
        {children}
      </body>
    </html>
  );
}
