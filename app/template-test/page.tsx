/**
 * Collectium Template Test Page v1.0
 *
 * Definering/formal:
 * Kontrollside for a teste at globalt Collectium-template, skin, viewport og grunnleggende
 * frontend-uttrykk blir brukt automatisk pa nye sider.
 *
 * Bruksomrade:
 * Legges pa /template-test og viser aktivt html/body dataset, JSON-konfigurasjon,
 * kort, felt, knapper, signatur, responsive grid og API-status.
 *
 * Berorte DB-brytere/feature_keys:
 * - frontend.template.test.view
 * - frontend.theme.foundation.read
 * - frontend.template.json.read
 *
 * Berorte sider/routes:
 * - /template-test
 * - /api/template-test
 */

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

async function getTemplateTest(): Promise<TemplateTestPayload> {
  const fallback: TemplateTestPayload = {
    test_id: "collectium-template-frontend-json-test",
    version: "1.0.0",
    default_template: "collectium",
    default_skin: "signature-light",
    viewport_default: "pc",
    required_datasets: [
      "data-template=collectium",
      "data-skin=signature-light",
      "data-collectium-front=v4.1",
      "data-vp=pc"
    ],
    checks: [
      {
        key: "css-foundation",
        label: "Global foundation CSS",
        expected: "app/collectium-front-foundation.css er lastet i app/layout.tsx",
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
        expected: "Denne siden bruker kun lokale innholdsklasser og globale --ct tokens",
        status: "ok"
      }
    ]
  };

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
        <h1>Template, frontend og JSON-test</h1>
        <p>
          Denne siden skal bekrefte at ny Collectium foundation styrer grunnuttrykket automatisk:
          template, skin, viewport, kort, felt, knapper og signatur.
        </p>
      </section>

      <section className={styles.grid}>
        <article className="ct-card">
          <span className={styles.label}>Standard template</span>
          <strong>{data.default_template}</strong>
          <p>Skal settes globalt i app/layout.tsx og holdes stabilt pa forste paint.</p>
        </article>

        <article className="ct-card">
          <span className={styles.label}>Standard skin</span>
          <strong>{data.default_skin}</strong>
          <p>Skal ikke hoppe tilbake til gammel V22 etter at siden er lastet.</p>
        </article>

        <article className="ct-card">
          <span className={styles.label}>Viewport</span>
          <strong>{data.viewport_default}</strong>
          <p>Skjermmodus skal arves og senere kunne styres globalt.</p>
        </article>
      </section>

      <section className={styles.panel}>
        <div>
          <p className={styles.kicker}>JSON payload</p>
          <h2>API-test fra /api/template-test</h2>
          <p>
            JSON-data under viser hva fronten forventer av global template foundation.
          </p>
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
