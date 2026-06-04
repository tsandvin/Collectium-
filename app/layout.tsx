import type { Metadata } from "next";
import Script from "next/script";
import AppShell from "../components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collectium",
  description: "Collectium katalog, samling, historie, finans og auksjon.",
};

const bootstrap = `
(function(){
  try {
    var storage = window.localStorage;
    var template = storage && storage.getItem("ct:template");
    var viewport = storage && storage.getItem("ct:vp");
    var fontBase = storage && storage.getItem("ct:font-base");

    var safeTemplate = (template === "collectium" || template === "enkel" || template === "museum" || template === "finans") ? template : "collectium";
    var safeViewport = (viewport === "mobile" || viewport === "tablet" || viewport === "pc" || viewport === "wide" || viewport === "tv") ? viewport : "pc";
    var safeFontBase = parseInt(fontBase, 10);
    if (!(safeFontBase >= 12 && safeFontBase <= 18)) safeFontBase = 14;

    var html = document.documentElement;
    html.setAttribute("data-template", safeTemplate);
    html.setAttribute("data-skin", "signature-light");
    html.setAttribute("data-vp", safeViewport);
    html.style.setProperty("--ct-font-base", safeFontBase + "px");
  } catch (error) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="no"
      data-template="collectium"
      data-skin="signature-light"
      data-vp="pc"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700;800;900&family=Fraunces:wght@300;400;500;700;800&family=Cinzel:wght@400;500;600;700;800&family=Source+Serif+4:wght@300;400;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
        <Script id="ct-bootstrap" strategy="beforeInteractive">
          {bootstrap}
        </Script>
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
