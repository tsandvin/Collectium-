import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#ffffff", color: "#061827", padding: "32px" }}>
      <p style={{ margin: "0 0 12px", fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Collectium
      </p>

      <h1 style={{ margin: "0 0 16px", fontSize: "42px", lineHeight: 1.05 }}>
        Collectium start
      </h1>

      <p style={{ margin: "0 0 24px", maxWidth: "640px", fontSize: "16px", lineHeight: 1.6 }}>
        Minimal Next.js / React kjerne er aktiv.
      </p>

      <Link href="/login" style={{ color: "#061827", textDecoration: "underline", fontWeight: 700 }}>
        Logg inn
      </Link>
    </main>
  );
}
