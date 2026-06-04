"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AdminSettingsClient v22
 *
 * Definering / formål:
 * Adminside for organisering av innstillinger, design, tilgang, DB 8.4 og systemmoduler.
 * Preview/frontend-modul med kontroller som senere kobles til MariaDB/API.
 *
 * Berørte sider / routes:
 * - /admin/innstillinger
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.settings.view
 * - admin.settings.design
 * - admin.access.rules
 * - admin.routes.view
 */

import { useEffect, useState } from "react";
import PageHeader from "../ui/collectium/PageHeader";
import ContentPanel from "../ui/collectium/ContentPanel";
import InfoCard from "../ui/collectium/InfoCard";
import ActionButton from "../ui/collectium/ActionButton";

const sections = [
  "Design og template",
  "Medlemskap og tilgang",
  "Forhandleravtaler",
  "Auksjon og nettbutikk",
  "Katalog og relasjoner",
  "DB 8.4 / API-ruter",
  "Varsler og prosesser",
  "Sikkerhet og superadmin",
];

export default function AdminSettingsClient() {
  const [active, setActive] = useState(sections[0]);
  const [demoAccessPaused, setDemoAccessPaused] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDemoAccessPaused(window.localStorage.getItem("collectium-demo-users-paused") === "true");
  }, []);

  function updateDemoAccessPaused(next: boolean) {
    setDemoAccessPaused(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("collectium-demo-users-paused", String(next));
      window.dispatchEvent(new CustomEvent("collectium-demo-access-change", { detail: { paused: next } }));
    }
  }

  return (
    <div className="ct-page">
      <PageHeader
        kicker="Admin / innstillinger"
        title="Organiser innstillinger"
        description="Kontrollflate for design, medlemskap, tilgang, API-ruter, prosesser og systemstatus."
      >
        <a className="ct-btn" href="/admin/brukere">
          Brukere
        </a>
        <a className="ct-btn" href="/admin">
          Dashboard
        </a>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "20px", alignItems: "start" }}>
        <ContentPanel>
          <h3 className="ct-card-title" style={{ marginBottom: "12px", fontSize: "1.05rem" }}>Innstillingsgrupper</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sections.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActive(section)}
                className={`ct-btn ${active === section ? "ct-btn-gold" : ""}`}
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  background: active === section ? "var(--ct-active-bg)" : "none",
                  color: active === section ? "var(--ct-active-text)" : "var(--ct-text)",
                  border: "1px solid var(--ct-border)",
                  borderRadius: "8px"
                }}
              >
                {section}
              </button>
            ))}
          </div>
        </ContentPanel>

        <ContentPanel>
          <p className="ct-kicker">{active}</p>
          <h2 className="ct-title" style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{active}</h2>
          <p className="ct-description" style={{ marginBottom: "20px" }}>
            Denne modulen organiserer hvilke kontroller som senere skal lagres i MariaDB og styres via DB 8.4.
            Ingen knapp skal bare være visuell; den skal ha feature_key, action_route eller være tydelig lokal template-kontroll.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              border: "1px solid var(--ct-border)",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "20px"
            }}
          >
            <div>
              <strong style={{ display: "block", fontSize: "0.95rem" }}>Stopp demo-brukere</strong>
              <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "var(--ct-text-soft)" }}>
                Stopper alle demo-brukere fra testtilgang uten å slette aktivitetsdata, kundekilde,
                kundenummer eller eierhistorikk. Admin/superadmin beholdes.
              </p>
              <small style={{ color: "var(--ct-text-muted)", fontSize: "0.75rem" }}>Feature: admin.demo_users.access.toggle</small>
            </div>
            <ActionButton
              type="button"
              variant={demoAccessPaused ? "secondary" : "gold"}
              data-feature-key="admin.demo_users.access.toggle"
              onClick={() => updateDemoAccessPaused(!demoAccessPaused)}
            >
              {demoAccessPaused ? "Åpne demo-tilgang" : "Stopp demo-brukere"}
            </ActionButton>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <SettingCard title="Status" value="Klar for kobling" text="Viser hvordan denne innstillingen skal kobles til API/backend." />
            <SettingCard title="Feature keys" value="Defineres" text="feature_key, access_rule og action_route må registreres før skriving." />
            <SettingCard title="Logging" value="Påkrevd" text="Alle adminendringer skal logges med bruker, tidspunkt og kategori." />
            <SettingCard title="Svar til ChatGPT" value="Kopierbar status" text="Senere skal admin se hva som fungerer og hva som mangler." />
          </div>
        </ContentPanel>
      </div>
    </div>
  );
}

function SettingCard({ title, value, text }: { title: string; value: string; text: string }) {
  return (
    <InfoCard title={title}>
      <strong style={{ display: "block", fontSize: "1.1rem", color: "var(--ct-brand-primary)", marginBottom: "4px" }}>{value}</strong>
      <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--ct-text-soft)" }}>{text}</p>
    </InfoCard>
  );
}
