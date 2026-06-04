import Link from "next/link";

const menuItems = [
  { label: "Startside", href: "/", status: "Aktiv" },
  { label: "Logg inn", href: "/login", status: "Auth" },
  { label: "Min side", href: "/min-side", status: "V1" },
  { label: "Katalog", href: "/katalog", status: "Neste" },
  { label: "Auksjon", href: "/auksjon", status: "Neste" },
  { label: "Admin", href: "/admin", status: "Neste" },
];

const statusCards = [
  { label: "Next.js", value: "OK", note: "Minimal core bygger i Vercel" },
  { label: "React", value: "OK", note: "Startside V1 aktiv" },
  { label: "MariaDB", value: "Neste", note: "Skal kobles via API" },
  { label: "DB 8.4", value: "Neste", note: "Sider, brytere, tilgang og logging" },
];

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #eaf2f7 0%, #f8fbfd 42%, #ffffff 100%)", color: "#071827" }}>
      <div style={{ display: "grid", gridTemplateColumns: "260px minmax(0, 1fr)", minHeight: "100vh" }}>
        <aside style={{ borderRight: "1px solid #d8e6ef", background: "rgba(255,255,255,0.82)", padding: "24px", position: "sticky", top: 0, height: "100vh" }}>
          <div style={{ marginBottom: "28px" }}>
            <p style={{ margin: 0, fontSize: "11px", fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", color: "#2e6f95" }}>
              Collectium
            </p>
            <h2 style={{ margin: "8px 0 0", fontSize: "22px", letterSpacing: "-0.03em" }}>
              Startside V1
            </h2>
          </div>

          <nav aria-label="Collectium sidemeny" style={{ display: "grid", gap: "8px" }}>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "12px 13px",
                  borderRadius: "15px",
                  border: "1px solid #dbe8f0",
                  background: item.href === "/" ? "#071827" : "#ffffff",
                  color: item.href === "/" ? "#ffffff" : "#071827",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 800,
                }}
              >
                <span>{item.label}</span>
                <span style={{ fontSize: "10px", opacity: 0.72 }}>{item.status}</span>
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: "26px", padding: "14px", borderRadius: "18px", background: "#eef6fb", border: "1px solid #d8e6ef" }}>
            <p style={{ margin: "0 0 6px", fontSize: "12px", fontWeight: 900 }}>Renset kjerne</p>
            <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.55, color: "#4c6172" }}>
              Bygger videre kontrollert med Next.js, React, API og MariaDB som sannhet.
            </p>
          </div>
        </aside>

        <section style={{ padding: "34px", display: "grid", alignContent: "start", gap: "24px" }}>
          <header style={{ border: "1px solid #d8e6ef", background: "rgba(255,255,255,0.9)", borderRadius: "28px", padding: "34px", boxShadow: "0 20px 70px rgba(7, 24, 39, 0.08)" }}>
            <p style={{ margin: "0 0 12px", fontSize: "11px", fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", color: "#2e6f95" }}>
              Clean rebuild baseline
            </p>
            <h1 style={{ margin: "0 0 18px", maxWidth: "860px", fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 0.96, letterSpacing: "-0.065em" }}>
              Collectium bygges paa nytt fra en ren kontrollkjerne.
            </h1>
            <p style={{ margin: "0 0 26px", maxWidth: "760px", fontSize: "17px", lineHeight: 1.7, color: "#40576a" }}>
              Dette er Startside V1 for ny Next.js / React-app. Frontend skal vise data og handlinger, mens API, MariaDB og DB 8.4 skal styre sannhet, tilgang, features og logging.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <Link href="/login" style={{ display: "inline-flex", padding: "13px 18px", borderRadius: "999px", background: "#071827", color: "#ffffff", textDecoration: "none", fontWeight: 900 }}>
                Logg inn
              </Link>
              <Link href="/min-side" style={{ display: "inline-flex", padding: "13px 18px", borderRadius: "999px", background: "#ffffff", color: "#071827", textDecoration: "none", fontWeight: 900, border: "1px solid #cddfe9" }}>
                Min side
              </Link>
              <Link href="/logout" style={{ display: "inline-flex", padding: "13px 18px", borderRadius: "999px", background: "#eef6fb", color: "#071827", textDecoration: "none", fontWeight: 900, border: "1px solid #d8e6ef" }}>
                Logg ut
              </Link>
            </div>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "14px" }}>
            {statusCards.map((card) => (
              <article key={card.label} style={{ background: "#ffffff", border: "1px solid #d8e6ef", borderRadius: "22px", padding: "20px", boxShadow: "0 14px 45px rgba(7, 24, 39, 0.06)" }}>
                <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: 900, color: "#567086" }}>{card.label}</p>
                <strong style={{ display: "block", marginBottom: "8px", fontSize: "26px", letterSpacing: "-0.04em" }}>{card.value}</strong>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.55, color: "#526879" }}>{card.note}</p>
              </article>
            ))}
          </div>

          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
            <article style={{ background: "#ffffff", border: "1px solid #d8e6ef", borderRadius: "22px", padding: "22px" }}>
              <h2 style={{ margin: "0 0 10px", fontSize: "20px" }}>Neste byggesteg</h2>
              <ol style={{ margin: 0, paddingLeft: "20px", color: "#40576a", lineHeight: 1.85 }}>
                <li>Session og auth-status</li>
                <li>Min side med medlemskap</li>
                <li>Global topbar og sidemeny</li>
                <li>Admin kontroll</li>
                <li>Katalog og API-koblinger</li>
              </ol>
            </article>

            <article style={{ background: "#ffffff", border: "1px solid #d8e6ef", borderRadius: "22px", padding: "22px" }}>
              <h2 style={{ margin: "0 0 10px", fontSize: "20px" }}>Regel</h2>
              <p style={{ margin: 0, color: "#40576a", lineHeight: 1.7 }}>
                Ingen katalogdata, priser, filterverdier, medlemskap eller tilgang skal hardkodes i frontend. Alt skal senere gjennom API, feature_keys, access rules og MariaDB.
              </p>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
