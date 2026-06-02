import "./globals.css";

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
        <script src="/assets/collectium-signature.js" defer />
      </body>
    </html>
  );
}
