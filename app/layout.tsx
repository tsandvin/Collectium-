import type { Metadata } from "next";
import "./globals.css";
import "./collectium-brand-tokens.css";

export const metadata: Metadata = {
  title: "Collectium",
  description: "Collectium - for samlere, for historien.",
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
      data-vp="pc"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
