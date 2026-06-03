export const metadata = {
  title: "Collectium",
  description: "Collectium Next.js app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
