import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collectium",
  description: "Collectium minimal core",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
