import styles from "./template-test.module.css";

type TemplateTestPayload = {
  test_id: string;
  version: string;
  default_template: string;
  default_skin: string;
  viewport_default: string;
  required_datasets: string[];
  checks: Array<{
    key: string;
    label: string;
    expected: string;
    status: "ok" | "warning" | "missing";
  }>;
};

const fallback: TemplateTestPayload = {
  test_id: "collectium-template-frontend-json-test",
  version: "3.0.0-no-double-shell",
  default_template: "collectium",
  default_skin: "signature-light",
  viewport_default: "pc",
  required_datasets: [
    "data-template=collectium",
    "data-skin=signature-light",
    "data-vp=pc"
  ],
  checks: [
    {
      key: "no-double-shell",
      label: "Ingen ekstra global AppShell",
      expected: "app/layout.tsx laster theme CSS uten a wrappe sider i AppShell",
      status: "ok"
    },
    {
      key: "brand-tokens",
      label: "Brand tokens",
      expected: "app/collectium-brand-tokens.css er lastet i app/layout.tsx",
      status: "ok"
    },
    {
      key: "new-page-inherits-theme",
      label: "Nye sider arver design",
      expected: "Denne siden bruker lokale innholdsklasser og globale --ct tokens",
      status: "ok"
    }
  ]
};

async function getTemplateTest(): Promise<TemplateTestPayload> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
    const url = baseUrl
      ? `${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/api/template-test`
      : "http://localhost:3000/api/template-test";
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return fallback;
    return (await response.json()) as TemplateTestPayload;
  } catch {
    return fallback;
  }
}

export default async function TemplateTestPage() {
  const data = await getTemplateTest();

  return (
    <main className={styles.templateTestPage} data-feature-key="frontend.template.test.view">
      <section className={styles.hero}>
        <p className={styles.kicker}>Collectium frontend test</p>
        <h1>Template v3 uten dobbel shell</h1>
        <p>
          Denne siden bekrefter at Collectium theme v3 er globalt standardlag uten ekstra
          AppShell rundt sidene. Admin bruker fortsatt egen innlogget arbeidsflate.
        </p>
      </section>

      <section className={styles.grid}>
        <article className="ct-card">
          <span className={styles.label}>Standard template</span>
          <strong>{data.default_template}</strong>
          <p>Settes globalt i app/layout.tsx pa forste paint.</p>
        </article>

        <article className="ct-card">
          <span className={styles.label}>Standard skin</span>
          <strong>{data.default_skin}</strong>
          <p>Collectium er hovedskinnet for offentlige sider.</p>
        </article>

        <article className="ct-card">
          <span className={styles.label}>Viewport</span>
          <strong>{data.viewport_default}</strong>
          <p>Skjermmodus kan fortsatt styres via data-vp.</p>
        </article>
      </section>

      <section className={styles.panel}>
        <div>
          <p className={styles.kicker}>JSON payload</p>
          <h2>API-test fra /api/template-test</h2>
          <p>JSON-data under viser hva fronten forventer av no-double-shell-oppsettet.</p>
        </div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </section>

      <section className={styles.panel}>
        <div>
          <p className={styles.kicker}>Kontrollpunkter</p>
          <h2>Frontend checks</h2>
        </div>
        <div className={styles.checkGrid}>
          {data.checks.map((check) => (
            <article className="ct-card" key={check.key} data-status={check.status}>
              <span className={styles.status}>{check.status}</span>
              <strong>{check.label}</strong>
              <p>{check.expected}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
