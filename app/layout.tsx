/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Collectium root layout without duplicate shell
 *
 * Definering / formål:
 * Laster Collectium Theme System v3 globalt uten å legge en ny AppShell rundt
 * eksisterende sider. Dette hindrer dobbelt sidemeny og testknapper i topbar.
 *
 * Bruksområde:
 * Root layout for Next.js App Router.
 *
 * Berørte sider / routes:
 * - Alle routes under app/
 *
 * Berørte DB-brytere / feature_keys:
 * - template.skin.view
 * - template.skin.switch
 *
 * Dataretning:
 * MariaDB/API styrer systemdata. Dette er kun globalt layout-/designlag.
 *
 * Versjon:
 * CT-THEME-0032 / NO-DOUBLE-SHELL
 */

import type { Metadata } from "next";
import "./globals.css";
import "./collectium-brand-tokens.css";

export const metadata: Metadata = {
  title: "Collectium",
  description: "Collectium · for samlere, for historien.",
};

export const COLLECTIUM_LOCKED_DEFAULT = "collectium" as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="no"
      data-template={COLLECTIUM_LOCKED_DEFAULT}
      data-skin="signature-light"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
