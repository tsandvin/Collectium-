import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", background: "#ffffff", color: "#061827", padding: "32px" }}>
      <p style={{ margin: "0 0 12px", fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Collectium
      </p>
      <h1 style={{ margin: "0 0 12px", fontSize: "32px" }}>Siden finnes ikke</h1>
      <p style={{ margin: "0 0 16px" }}>Denne siden finnes ikke i minimal kjerne.</p>
      <Link href="/" style={{ color: "#061827", textDecoration: "underline" }}>
        Til forsiden
      </Link>
    </main>
  );
}
