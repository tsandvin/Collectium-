import CollectiumAppShell from "../../components/app/CollectiumAppShell";

export default function Page() {
  return (
    <CollectiumAppShell page="samling">
      <section className="ct-panel">
        <h1 className="ct-title">samling</h1>
        <p className="ct-muted">Produksjonsklar sidekontainer. Koble inn DB 8.4 features og API-ruter her.</p>
      </section>
    </CollectiumAppShell>
  );
}
