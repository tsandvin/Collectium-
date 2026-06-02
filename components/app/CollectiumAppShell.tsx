"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CollectiumAppShell v16
 *
 * Definering / formål:
 * Innlogget app-shell med global sidemeny og toppmeny for Min side og Admin.
 * Shell henter session fra /api/auth/session og viser tilgangsstyrt innhold.
 *
 * Bruksområde:
 * Brukes av /minside, /admin, /admin/brukere og /admin/innstillinger.
 *
 * Berørte sider / routes:
 * - /minside
 * - /admin
 * - /admin/brukere
 * - /admin/innstillinger
 * - /katalog
 * - /samling
 * - /auksjon
 * - /forhandler
 *
 * Berørte DB-brytere / feature_keys:
 * - profile.view
 * - admin.control.view
 * - admin.users.view
 * - admin.settings.view
 * - auth.logout
 *
 * Berørte API-ruter:
 * - GET /api/auth/session
 * - POST /api/auth/logout
 *
 * Dataretning:
 * API/backend -> Next.js -> React -> UI.
 */

import { useEffect, useState } from "react";
import AdminSettingsClient from "../admin/AdminSettingsClient";
import AdminUsersClient from "../admin/AdminUsersClient";
import styles from "../landing/collectium-frontpage.module.css";

type Session = {
  email: string;
  name: string;
  role: string;
  membership: string;
  createdAt: string;
};

type AppPage = "minside" | "admin";
type AdminModule = "dashboard" | "users" | "settings";

type CollectiumAppShellProps = {
  page: AppPage;
  adminModule?: AdminModule;
};

const mainMenu = [
  { label: "Min side", href: "/minside" },
  { label: "Katalog", href: "/katalog" },
  { label: "Samling", href: "/samling" },
  { label: "Auksjon", href: "/auksjon" },
  { label: "Forhandler", href: "/forhandler" },
  { label: "Admin", href: "/admin" },
];

const adminMenu = [
  { label: "Admin arbeidsflate", href: "/admin", module: "dashboard" },
  { label: "Brukere og medlemskap", href: "/admin/brukere", module: "users" },
  { label: "Innstillinger", href: "/admin/innstillinger", module: "settings" },
];

export default function CollectiumAppShell({ page, adminModule = "dashboard" }: CollectiumAppShellProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setSession(data.session || null))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  if (loading) {
    return <main className={styles.appLoading}>Laster Collectium ...</main>;
  }

  if (!session) {
    return (
      <main className={`${styles.page} ${styles.collectium}`}>
        <section className={`${styles.lockedNotice} ct-card`}>
          <h1>Logg inn for å åpne Collectium</h1>
          <p>Min side og admin krever innlogging.</p>
          <a href="/login" className={styles.primaryButton} data-feature-key="auth.login">
            Logg inn
          </a>
        </section>
      </main>
    );
  }

  const isSuperAdmin = session.role === "superadmin";
  const isAdminPage = page === "admin";

  if (isAdminPage && !isSuperAdmin) {
    return (
      <main className={`${styles.page} ${styles.collectium}`}>
        <section className={`${styles.lockedNotice} ct-card`}>
          <h1>Ingen admintilgang</h1>
          <p>Du er logget inn som {session.email}, men denne brukeren er ikke superadmin.</p>
          <a href="/minside" className={styles.primaryButton}>
            Gå til Min side
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.appShell}>
      <aside className={styles.appSidebar}>
        <a href="/" className={styles.appBrandBlock}>
          <span>C</span>
          <strong>Collectium</strong>
          <small>V16 låst sidemeny</small>
        </a>

        <p className={styles.sidebarLabel}>Hovedmeny</p>
        <nav>
          {mainMenu.map((item) => (
            <a key={item.href} href={item.href} className={isActive(page, item.href, adminModule) ? styles.activeAppLink : ""}>
              {item.label}
            </a>
          ))}
        </nav>

        {isSuperAdmin ? (
          <div className={styles.sidebarGroup}>
            <p className={styles.sidebarLabel}>Admin</p>
            {adminMenu.map((item) => (
              <a key={item.href} href={item.href} className={adminModule === item.module ? styles.activeAppLink : ""}>
                {item.label}
              </a>
            ))}
          </div>
        ) : null}

        <div className={`${styles.sidebarUserCard} ct-card`}>
          <strong>{session.name}</strong>
          <small>{session.membership} · {session.role}</small>
        </div>
      </aside>

      <section className={styles.appMain}>
        <header className={styles.appTopbar}>
          <a href="/admin" className={styles.topbarButton}>Admin</a>
          <label className={styles.appSearch}>
            <span>Søk</span>
            <input placeholder="Collectium-Katalogen" />
          </label>
          <div className={styles.appTopbarActions}>
            <button type="button">Design</button>
            <button type="button">Prosesser <b>0</b></button>
            <button type="button">Varsler <b>0</b></button>
            <button type="button" onClick={logout} data-feature-key="auth.logout">Logg ut</button>
          </div>
        </header>

        {isAdminPage ? <AdminContent module={adminModule} session={session} /> : <MyPageContent session={session} />}
      </section>
    </main>
  );
}

function isActive(page: AppPage, href: string, adminModule: AdminModule) {
  if (page === "minside" && href === "/minside") return true;
  if (page === "admin" && href === "/admin" && adminModule === "dashboard") return true;
  return false;
}

function MyPageContent({ session }: { session: Session }) {
  return (
    <>
      <section className={`${styles.appHeader} ct-panel`}>
        <div>
          <p className={styles.kicker}>Min side</p>
          <h1>Velkommen til Collectium</h1>
          <p>Dette er innlogget arbeidsflate. Sidemeny, varsler og samlingsfunksjoner styres herfra.</p>
        </div>
        <div className={styles.sessionBox}>
          <strong>{session.name}</strong>
          <span>{session.email}</span>
          <span>{session.role} · {session.membership}</span>
        </div>
      </section>
      <div className={styles.appGrid}>
        <section className={`${styles.appCard} ct-card`}>
          <h2>Min samling</h2>
          <p>Samling, ønskeliste, favoritter og private notater kobles mot MariaDB senere.</p>
          <strong>Medlemskap: {session.membership}</strong>
        </section>
        <section className={`${styles.appCard} ct-card`}>
          <h2>Katalogstatus</h2>
          <p>Åpne katalogen, lagre objekter og bygg relasjonsbasert samling.</p>
          <a href="/katalog">Åpne katalog</a>
        </section>
        <section className={`${styles.appCard} ct-card`}>
          <h2>Aktivitet</h2>
          <p>Her kommer varsler, prosesser, auksjoner og samlingsaktivitet.</p>
        </section>
      </div>
    </>
  );
}

function AdminContent({ module, session }: { module: AdminModule; session: Session }) {
  if (module === "users") return <AdminUsersClient />;
  if (module === "settings") return <AdminSettingsClient />;

  return (
    <>
      <section className={`${styles.appHeader} ct-panel`}>
        <div>
          <p className={styles.kicker}>Admin kontroll</p>
          <h1>Collectium Admin</h1>
          <p>Kontrollsenter for brukere, medlemskap, forhandlere, DB/API, datakvalitet og prosesser.</p>
        </div>
        <div className={styles.sessionBox}>
          <strong>Collectium superadmin</strong>
          <span>{session.email}</span>
          <span>{session.role} · Admin</span>
        </div>
      </section>
      <div className={styles.appGrid}>
        <a href="/admin/brukere" className={`${styles.appCard} ct-card`}>
          <h2>Brukere og medlemskap</h2>
          <p>Administrer medlemskap, KYC, status, roller, samling, auksjon og profilark.</p>
        </a>
        <a href="/admin/innstillinger" className={`${styles.appCard} ct-card`}>
          <h2>Innstillinger</h2>
          <p>Organiser design, tilgang, forhandleravtaler, API-ruter og systeminnstillinger.</p>
        </a>
        <section className={`${styles.appCard} ct-card`}>
          <h2>Datakvalitet</h2>
          <p>Katalog, relasjoner, API-ruter og importstatus skal vises her.</p>
        </section>
      </div>
    </>
  );
}
