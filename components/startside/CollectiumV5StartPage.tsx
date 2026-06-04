const cards = [
  {
    title: "Katalog",
    meta: "Sedler · mynter · samleobjekter",
    body: "Egen inngang til objekter, kilder, varianter, relasjoner og visningsmoduser.",
  },
  {
    title: "Min samling",
    meta: "Personlig arkiv og notater",
    body: "Samle status, ønsker, favoritter, egne notater, dokumentasjon og verdier i én flate.",
  },
  {
    title: "Marked",
    meta: "Auksjoner · forhandlere · trender",
    body: "Se verdi, observasjoner, likviditet, historikk og relevante markedsbevegelser.",
  },
];

export default function CollectiumV5StartPage() {
  return (
    <>
      <header style={{ marginBottom: 32 }}>
        <span
          style={{
            display: "inline-block",
            padding: "5px 12px",
            background: "color-mix(in srgb, var(--ct-accent-soft) 14%, transparent)",
            color: "var(--ct-accent-dark)",
            border: "1px solid color-mix(in srgb, var(--ct-accent-soft) 45%, transparent)",
            borderRadius: 99,
            fontFamily: "var(--ct-font-ui)",
            fontSize: "0.78em",
            fontWeight: 600,
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
          Dette er egen startside for v5-skallet. Designknappen nederst i sidemenyen styrer
          tema, skjermstørrelse og tekststørrelse uten at siden lager egen layout.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {cards.map((card) => (
          <article className="ct-card" key={card.title}>
            <div className="ct-card-title">{card.title}</div>
            <div className="ct-card-meta">{card.meta}</div>
            <p
              style={{
                marginTop: 12,
                color: "var(--ct-text-soft)",
                fontFamily: "var(--ct-font-body)",
                lineHeight: 1.6,
              }}
            >
              {card.body}
            </p>
            <div className="ct-sig" aria-hidden>
              <span className="ct-sig-rise" />
              <span className="ct-sig-word">Collectium</span>
              <span className="ct-sig-corner" />
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
