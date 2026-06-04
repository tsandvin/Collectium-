export default function NotFound() {
  return (
    <div style={{ padding: "60px 0", textAlign: "center" }}>
      <div
        style={{
          fontFamily: "var(--ct-font-display)",
          fontSize: "3em",
          color: "var(--ct-text)",
          marginBottom: 12,
        }}
      >
        404
      </div>
      <p
        style={{
          color: "var(--ct-text-soft)",
          fontFamily: "var(--ct-font-body)",
          fontSize: "1.14em",
        }}
      >
        Siden finnes ikke ennå.
      </p>
    </div>
  );
}
