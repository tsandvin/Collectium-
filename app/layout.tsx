import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Collectium",
  description: "Collectium app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <head>
        <link rel="stylesheet" href="/assets/collectium-signature.css" />
      </head>
      <body>
        {children}
        <Script src="/assets/collectium-signature.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
