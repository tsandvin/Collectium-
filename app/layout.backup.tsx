// app/layout.tsx
// Root layout for Collectium.
// A pre-hydration inline script reads localStorage and writes the
// template / viewport / font-base to <html> BEFORE the first paint so
// the user never sees a flash of the wrong design.

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collectium",
  description: "For samlere · For historien",
};

const bootstrap = `
(function(){
  try {
    var s = window.localStorage;
    var t = s && s.getItem("ct:template");
    var v = s && s.getItem("ct:vp");
    var f = s && s.getItem("ct:font-base");

    var tpl = (t === "collectium" || t === "enkel" || t === "museum" || t === "finans") ? t : "collectium";
    var vp  = (v === "mobile" || v === "tablet" || v === "pc" || v === "wide" || v === "tv") ? v : "pc";
    var fb  = parseInt(f, 10);
    if (!(fb >= 12 && fb <= 18)) fb = 14;

    var h = document.documentElement;
    h.setAttribute("data-template", tpl);
    h.setAttribute("data-vp", vp);
    h.style.setProperty("--ct-font-base", fb + "px");
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="no" data-template="collectium" data-vp="pc" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700;800;900&family=Fraunces:wght@300;400;500;700;800&family=Cinzel:wght@400;500;600;700;800&family=Source+Serif+4:wght@300;400;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/[email protected]/dist/tabler-icons.min.css"
        />
        <Script id="ct-bootstrap" strategy="beforeInteractive">
          {bootstrap}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
