// app/layout.tsx
// Collectium · root layout · v3.0
// Locked default template: "collectium"
// Switchable at runtime via the data-template attribute on <html>

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collectium · Arkiv",
  description:
    "Collectium · for samlere, for historien. Katalog over mynter, sedler og samleobjekter.",
};

/**
 * COLLECTIUM_LOCKED_DEFAULT
 * This is the locked default template. Do not change without updating
 * the brand/UX docs. Switching is allowed at runtime via:
 *   document.documentElement.dataset.template = "enkel" | "museum" | "finans"
 * but the SSR-rendered default must remain "collectium".
 */
export const COLLECTIUM_LOCKED_DEFAULT = "collectium" as const;

export type CollectiumTemplate =
  | "collectium"
  | "enkel"
  | "museum"
  | "finans";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="no"
      data-template={COLLECTIUM_LOCKED_DEFAULT}
      data-vp="pc"
      suppressHydrationWarning
    >
      <head>
        {/* Pre-connect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700;800;900&family=Fraunces:wght@300;400;500;700;800&family=Cinzel:wght@400;500;600;700;800&family=Source+Serif+4:wght@300;400;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Tabler icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/[email protected]/dist/tabler-icons.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
