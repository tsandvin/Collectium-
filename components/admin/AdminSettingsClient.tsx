"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AdminSettingsClient v16
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
import styles from "../landing/collectium-frontpage.module.css";

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
  const [mounted, setMounted] = useState(false);
  const [demoAccessPaused, setDemoAccessPaused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setDemoAccessPaused(window.localStorage.getItem("collectium-demo-users-paused") === "true");
  }, [mounted]);

  function updateDemoAccessPaused(next: boolean) {
    setDemoAccessPaused(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("collectium-demo-users-paused", String(next));
      window.dispatchEvent(new CustomEvent("collectium-demo-access-change", { detail: { paused: next } }));
    }
  }

  return (
    <div className={styles.adminSettingsPage}>
      <section className={styles.adminPageHeader}>
        <div>
          <p className={styles.kicker}>Admin / innstillinger</p>
          <h1>Organiser innstillinger</h1>
          <p>Kontrollflate for design, medlemskap, tilgang, API-ruter, prosesser og systemstatus.</p>
        </div>
        <div className={styles.adminHeaderActions}>
          <a className={styles.secondaryButton} href="/admin/brukere">Brukere</a>
          <a className={styles.secondaryButton} href="/admin">Dashboard</a>
        </div>
      </section>

      <section className={styles.settingsSplit}>
        <aside className={`${styles.settingsMenu} ct-panel`}>
          <h2>Innstillingsgrupper</h2>
          {sections.map((section) => (
            <button key={section} type="button" onClick={() => setActive(section)} className={active === section ? styles.settingsMenuActive : ""}>
              {section}
            </button>
          ))}
        </aside>

        <main className={`${styles.settingsContent} ct-panel`}>
          <p className={styles.kicker}>{active}</p>
          <h2>{active}</h2>
          <p>
            Denne modulen organiserer hvilke kontroller som senere skal lagres i MariaDB og styres via DB 8.4.
            Ingen knapp skal bare være visuell; den skal ha feature_key, action_route eller være tydelig lokal template-kontroll.
          </p>

          <div className={styles.demoSettingsRow}>
            <div>
              <strong>Stopp demo-brukere</strong>
              <p>
                Stopper alle demo-brukere fra testtilgang uten å slette aktivitetsdata, kundekilde,
                kundenummer eller eierhistorikk. Admin/superadmin beholdes.
              </p>
              <small>Feature: admin.demo_users.access.toggle</small>
            </div>
            <button
              type="button"
              className={demoAccessPaused ? styles.secondaryButton : styles.goldButton}
              data-feature-key="admin.demo_users.access.toggle"
              onClick={() => updateDemoAccessPaused(!demoAccessPaused)}
            >
              {demoAccessPaused ? "Åpne demo-tilgang" : "Stopp demo-brukere"}
            </button>
          </div>

          <div className={styles.settingsGrid}>
            <SettingCard title="Status" value="Klar for kobling" text="Viser hvordan denne innstillingen skal kobles til API/backend." />
            <SettingCard title="Feature keys" value="Defineres" text="feature_key, access_rule og action_route må registreres før skriving." />
            <SettingCard title="Logging" value="Påkrevd" text="Alle adminendringer skal logges med bruker, tidspunkt og kategori." />
            <SettingCard title="Svar til ChatGPT" value="Kopierbar status" text="Senere skal admin se hva som fungerer og hva som mangler." />
          </div>
        </main>
      </section>
    </div>
  );
}

function SettingCard({ title, value, text }: { title: string; value: string; text: string }) {
  return (
    <article className={`${styles.infoBox} ct-card`}>
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </article>
  );
}
