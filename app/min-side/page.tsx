import Link from "next/link";

export default function MinSidePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#eef4f8", color: "#071827", padding: "32px" }}>
      <section style={{ maxWidth: "920px", margin: "0 auto", background: "#ffffff", border: "1px solid #d8e6ef", borderRadius: "24px", padding: "28px", boxShadow: "0 18px 50px rgba(7, 24, 39, 0.08)" }}>
        <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2e6f95" }}>
          Collectium / Min side
        </p>
        <h1 style={{ margin: "0 0 14px", fontSize: "34px", lineHeight: 1.08 }}>
          Min side V1
        </h1>
        <p style={{ margin: "0 0 22px", maxWidth: "640px", fontSize: "15px", lineHeight: 1.7, color: "#40576a" }}>
          Dette er en midlertidig kontrollflate for innlogget bruker. Neste steg er aa koble session, medlemskap, samling, varsler og prosesser mot API og MariaDB.
        </p>
        <Link href="/" style={{ display: "inline-flex", padding: "11px 16px", borderRadius: "999px", background: "#071827", color: "#ffffff", textDecoration: "none", fontWeight: 800 }}>
          Tilbake til startside
        </Link>
      </section>
    </main>
  );
}
