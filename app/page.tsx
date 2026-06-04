// app/page.tsx
// Placeholder landing. Pages get added later — this proves the shell,
// design system and Design mega menu work.

import AppShell from "./components/AppShell";

export default function Page() {
  return (
    <AppShell>
      <header style={{ marginBottom: 32 }}>
        <span
          style={{
            display: "inline-block",
            padding: "5px 12px",
            background:
              "color-mix(in srgb, var(--ct-accent-soft) 14%, transparent)",
            color: "var(--ct-accent-dark)",
            border:
              "1px solid color-mix(in srgb, var(--ct-accent-soft) 45%, transparent)",
            borderRadius: 99,
            fontFamily: "var(--ct-font-ui)",
            fontSize: "0.78em",
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
            fontSize: "2.4em",
            letterSpacing: "-0.02em",
            color: "var(--ct-text)",
            lineHeight: 1.05,
          }}
        >
          Collectium · For samlere, for historien
        </h1>
        <p
          style={{
            maxWidth: 680,
            color: "var(--ct-text-soft)",
            fontFamily: "var(--ct-font-body)",
            fontSize: "1.14em",
            lineHeight: 1.6,
          }}
        >
          Velkommen til Collectium. Bytt design, skjermstørrelse og tekststørrelse
          fra Design-knappen nederst i sidemenyen. Innholdet bygges inn senere.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        <article className="ct-card">
          <div className="ct-card-title">Katalog</div>
          <div className="ct-card-meta">Sedler · mynter · samleobjekter</div>
          <p
            style={{
              marginTop: 12,
              color: "var(--ct-text-soft)",
              fontFamily: "var(--ct-font-body)",
              lineHeight: 1.6,
            }}
          >
            Bygges senere. Designet er klart — kort, paneler og tabber er
            tilgjengelige som CSS-klasser.
          </p>
          <div className="ct-sig" aria-hidden>
            <span className="ct-sig-rise" />
            <span className="ct-sig-word">Collectium</span>
            <span className="ct-sig-corner" />
          </div>
        </article>

        <article className="ct-card">
          <div className="ct-card-title">Min samling</div>
          <div className="ct-card-meta">Personlig arkiv og notater</div>
          <p
            style={{
              marginTop: 12,
              color: "var(--ct-text-soft)",
              fontFamily: "var(--ct-font-body)",
              lineHeight: 1.6,
            }}
          >
            Plassholder. Knapper, piller og signaturhjørne er på plass.
          </p>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button className="ct-btn" type="button">
              <i className="ti ti-bookmark" /> Samling
            </button>
            <button className="ct-btn ct-btn--secondary" type="button">
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
          <div className="ct-card-title">Marked</div>
          <div className="ct-card-meta">Auksjoner · forhandlere · trender</div>
          <p
            style={{
              marginTop: 12,
              color: "var(--ct-text-soft)",
              fontFamily: "var(--ct-font-body)",
              lineHeight: 1.6,
            }}
          >
            Kommer.
          </p>
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
