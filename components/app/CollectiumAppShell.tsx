"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CollectiumAppShell v15
 *
 * Definering / formål:
 * Innlogget app-shell med global sidemeny for Min side og Admin. Shell henter session
 * fra /api/auth/session og viser tilgangsstyrt innhold.
 *
 * Bruksområde:
 * Brukes av /minside og /admin.
 *
 * Berørte sider / routes:
 * - /minside
 * - /admin
 * - /katalog
 * - /samling
 * - /auksjon
 * - /forhandler
 *
 * Berørte DB-brytere / feature_keys:
 * - profile.view
 * - admin.control.view
 * - auth.logout
 *
 * Berørte API-ruter:
 * - GET /api/auth/session
 * - POST /api/auth/logout
 *
 * Dataretning:
 * API/backend -> Next.js -> React -> UI.
 *
 * Logging:
 * log_category: app_shell
 * log_action: view
 */

import { useEffect, useState } from "react";
import styles from "../landing/collectium-frontpage.module.css";

type Session = {
  email: string;
  name: string;
  role: string;
  membership: string;
  createdAt: string;
};

type CollectiumAppShellProps = {
  page: "minside" | "admin";
};

const menu = [
  { label: "Min side", href: "/minside" },
  { label: "Katalog", href: "/katalog" },
  { label: "Samling", href: "/samling" },
  { label: "Auksjon", href: "/auksjon" },
  { label: "Forhandler", href: "/forhandler" },
  { label: "Admin", href: "/admin" },
];

export default function CollectiumAppShell({ page }: CollectiumAppShellProps) {
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
        <a href="/" className={styles.appLogo}>Collectium</a>
        <nav>
          {menu.map((item) => (
            <a key={item.href} href={item.href} className={page === "admin" && item.href === "/admin" ? styles.activeAppLink : ""}>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <section className={styles.appMain}>
        <header className={`${styles.appHeader} ct-panel`}>
          <div>
            <p className={styles.kicker}>{isAdminPage ? "Admin kontroll" : "Min side"}</p>
            <h1>{isAdminPage ? "Collectium Admin" : "Velkommen til Collectium"}</h1>
          </div>
          <div className={styles.sessionBox}>
            <strong>{session.name}</strong>
            <span>{session.email}</span>
            <span>{session.role} · {session.membership}</span>
            <button type="button" onClick={logout} data-feature-key="auth.logout">Logg ut</button>
          </div>
        </header>

        {isAdminPage ? <AdminContent /> : <MyPageContent session={session} />}
      </section>
    </main>
  );
}

function MyPageContent({ session }: { session: Session }) {
  return (
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
  );
}

function AdminContent() {
  return (
    <div className={styles.appGrid}>
      <section className={`${styles.appCard} ct-card`}>
        <h2>Systemstatus</h2>
        <p>Adminside er tilgjengelig for superadmin-session. DB 8.4-kontroll kobles videre.</p>
      </section>
      <section className={`${styles.appCard} ct-card`}>
        <h2>Brukere og medlemskap</h2>
        <p>Brukeradministrasjon skal senere kobles mot MariaDB og feature/access-regler.</p>
      </section>
      <section className={`${styles.appCard} ct-card`}>
        <h2>Datakvalitet</h2>
        <p>Katalog, relasjoner, API-ruter og importstatus skal vises her.</p>
      </section>
    </div>
  );
}
