// app/page.tsx
// Sample landing page using AppShell.
// Demonstrates the locked watermark placement: bottom of sidebar + top of content.

import AppShell from "./components/AppShell";

export default function HomePage() {
  return (
    <AppShell>
      <header style={{ margin: "40px 0 28px" }}>
        <span
          style={{
            display: "inline-block",
            padding: "5px 12px",
            background: "color-mix(in srgb, var(--ct-accent-soft) 14%, transparent)",
            color: "var(--ct-accent-dark)",
            border: "1px solid color-mix(in srgb, var(--ct-accent-soft) 45%, transparent)",
            borderRadius: "99px",
            fontFamily: "var(--ct-font-ui)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Arkiv · Anno 2026
        </span>
        <h1
          style={{
            margin: "16px 0 8px",
            fontFamily: "var(--ct-font-display)",
            fontWeight: "var(--w-display)" as unknown as number,
            fontSize: "clamp(28px, 3vw, 44px)",
            letterSpacing: "-0.02em",
            color: "var(--ct-text)",
          }}
        >
          Collectium · For samlere, for historien
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: 680,
            color: "var(--ct-text-soft)",
            fontFamily: "var(--ct-font-body)",
            fontSize: 16,
            lineHeight: 1.6,
          }}
        >
          Katalog over mynter, sedler og samleobjekter — med kilder, varianter,
          gradering, sjeldenhet, markedsverdier og historisk kontekst.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 18,
        }}
      >
        <article className="ct-card">
          <div className="ct-card-title">10 kroner 1949 A</div>
          <div className="ct-card-meta">Norges Bank · Haakon VII</div>
          <div style={{ marginTop: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span className="ct-pill">1949</span>
            <span className="ct-pill">A-litra</span>
            <span className="ct-pill">Seddel</span>
          </div>
          <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
            <button className="ct-btn">
              <i className="ti ti-bookmark" /> Samling
            </button>
            <button className="ct-btn ct-btn--secondary">
              <i className="ti ti-heart" /> Ønskeliste
            </button>
          </div>
          <div className="ct-sig" aria-hidden>
            <span className="ct-sig-rise" />
            <span className="ct-sig-word">Collectium</span>
            <span className="ct-sig-corner" />
          </div>
        </article>

        <article className="ct-card">
          <div className="ct-card-title">5 kroner 1962</div>
          <div className="ct-card-meta">Norges Bank · A-litra</div>
          <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
            <button className="ct-btn ct-btn--gold">
              <i className="ti ti-gavel" /> Auksjon
            </button>
          </div>
          <div className="ct-sig" aria-hidden>
            <span className="ct-sig-rise" />
            <span className="ct-sig-word">Collectium</span>
            <span className="ct-sig-corner" />
          </div>
        </article>

        <article className="ct-card">
          <div className="ct-card-title">100 kroner 1945</div>
          <div className="ct-card-meta">London-utgaven</div>
          <div className="ct-sig" aria-hidden>
            <span className="ct-sig-rise" />
            <span className="ct-sig-word">Collectium</span>
            <span className="ct-sig-corner" />
          </div>
        </article>
      </section>
    </AppShell>
  );
}
