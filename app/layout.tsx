import type { Metadata } from "next";
import "./globals.css";
import "./collectium-brand-tokens.css";
import "./collectium-front-foundation.css";
import "./collectium-shell-visibility-fix.css";
import CollectiumFrontController from "./CollectiumFrontController";

export const metadata: Metadata = {
  title: "Collectium",
  description: "Collectium · relasjonskatalog, samling, marked, auksjon og historisk objektdata.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="no"
      data-template="collectium"
      data-skin="signature-light"
      data-collectium-front="v4.1"
      data-vp="pc"
      suppressHydrationWarning
    >
      <body
        data-template="collectium"
        data-skin="signature-light"
        data-collectium-front="v4.1"
        data-vp="pc"
        suppressHydrationWarning
      >
        <CollectiumFrontController />
        {children}
      </body>
    </html>
  );
}
