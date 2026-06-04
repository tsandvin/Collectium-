/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Collectium Startside V1
 *
 * Definering / formål:
 * Versjonert startside for Collectium med login, logout, Min side og sidemeny.
 * Siden er laget som en trygg første inngang til app.collectium.no uten å eie auth-,
 * medlemskap-, katalog- eller DB-sannhet i frontend.
 *
 * Bruksområde:
 * Brukes av app/page.tsx eller app/startside-v1/page.tsx som offentlig startflate.
 *
 * Berørte sider / routes:
 * - /
 * - /startside-v1
 * - /login
 * - /min-side
 * - /katalog
 * - /index
 * - /auksjon
 * - /forhandler
 * - /admin
 *
 * Berørte DB-brytere / feature_keys:
 * - landing.view
 * - auth.login
 * - auth.logout
 * - profile.view
 * - catalog.view
 * - index.view
 * - auction.view
 * - dealer.view
 * - admin.control.view
 *
 * Berørte API-ruter:
 * - GET /api/auth/session
 * - POST /api/auth/logout
 *
 * Berørte tabeller / views:
 * - ct_users
 * - ct_user_sessions
 * - ct_v_app_menu
 * - ct_v_feature_access_resolved
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: landing
 * log_action: view
 *
 * Versjon:
 * CT-STARTSIDE-V1 / CHANGE-2026-06-04-0001
 *
 * Endringsregel:
 * Dette er en ny versjonert startside. Kjernefiler skal ikke overskrives uten snapshot,
 * manifest og godkjenning.
 */

import Link from "next/link";
import styles from "./CollectiumStartsideV1.module.css";

type MenuItem = {
  label: string;
  href: string;
  featureKey: string;
  description: string;
};

const menuItems: MenuItem[] = [
  {
    label: "Startside",
    href: "/",
    featureKey: "landing.view",
    description: "Inngang til Collectium-plattformen",
  },
  {
    label: "Katalog",
    href: "/katalog",
    featureKey: "catalog.view",
    description: "Relasjonskatalog for objekter, historie og marked",
  },
  {
    label: "Index",
    href: "/index",
    featureKey: "index.view",
    description: "Markedsindex, utvikling og sammenligning",
  },
  {
    label: "Min side",
    href: "/min-side",
    featureKey: "profile.view",
    description: "Profil, medlemskap, samling, varsler og prosesser",
  },
  {
    label: "Samling",
    href: "/samling",
    featureKey: "collection.view",
    description: "Private objekter, ønskeliste, favoritter og transaksjoner",
  },
  {
    label: "Auksjon",
    href: "/auksjon",
    featureKey: "auction.view",
    description: "Auksjonsobjekter og budflyt",
  },
  {
    label: "Forhandler",
    href: "/forhandler",
    featureKey: "dealer.view",
    description: "Forhandlerflate for innlevering, lager og salg",
  },
  {
    label: "Admin",
    href: "/admin",
    featureKey: "admin.control.view",
    description: "Kontrollsenter for brukere, DB, API og systemstatus",
  },
];

const statusCards = [
  { label: "MariaDB", value: "Sannhet", note: "Data, tilgang og relasjoner" },
  { label: "API", value: "Mellomlag", note: "Session, handlinger og logging" },
  { label: "React", value: "Visning", note: "Komponenter og brukergrensesnitt" },
];

export default function CollectiumStartsideV1() {
  return (
    <main className={styles.pageShell} aria-labelledby="collectium-startside-v1-title">
      <aside className={styles.sideMenu} aria-label="Collectium sidemeny">
        <div className={styles.brandBlock}>
          <span className={styles.brandMark}>C</span>
          <div>
            <strong>Collectium</strong>
            <span>Startside V1</span>
          </div>
        </div>

        <nav className={styles.navList}>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navItem}>
              <span>{item.label}</span>
              <small>{item.featureKey}</small>
            </Link>
          ))}
        </nav>
      </aside>

      <section className={styles.contentArea}>
        <header className={styles.topbar}>
          <div>
            <span className={styles.kicker}>app.collectium.no</span>
            <h1 id="collectium-startside-v1-title">Collectium startside</h1>
          </div>

          <div className={styles.authActions} aria-label="Innlogging og brukerhandlinger">
            <Link href="/login" className={styles.primaryButton}>
              Logg inn
            </Link>
            <form action="/api/auth/logout" method="post">
              <button className={styles.secondaryButton} type="submit">
                Logg ut
              </button>
            </form>
            <Link href="/min-side" className={styles.secondaryButton}>
              Min side
            </Link>
          </div>
        </header>

        <section className={styles.heroPanel}>
          <div className={styles.heroText}>
            <span className={styles.kicker}>Samler · Historie · Finans</span>
            <h2>Én inngang til katalog, samling, auksjon, index og kontroll.</h2>
            <p>
              Startside V1 er en ren første app-flate. Den viser sidemeny, login, logout og Min side,
              men lar fortsatt MariaDB, API og DB 8.4 være sannheten for tilgang, data og handlinger.
            </p>
            <div className={styles.heroActions}>
              <Link href="/katalog" className={styles.primaryButton}>
                Åpne katalog
              </Link>
              <Link href="/min-side" className={styles.ghostButton}>
                Gå til Min side
              </Link>
            </div>
          </div>

          <div className={styles.loginPanel} aria-label="Innloggingspanel">
            <h3>Brukerstatus</h3>
            <p>
              Når auth/session kobles på, skal dette feltet vise faktisk innlogget bruker,
              medlemskap, rolle og tilgang fra API.
            </p>
            <div className={styles.loginGrid}>
              <Link href="/login" className={styles.loginTile}>
                <strong>Logg inn</strong>
                <span>auth.login</span>
              </Link>
              <form action="/api/auth/logout" method="post" className={styles.loginTileForm}>
                <button type="submit" className={styles.loginTileButton}>
                  <strong>Logg ut</strong>
                  <span>auth.logout</span>
                </button>
              </form>
              <Link href="/min-side" className={styles.loginTile}>
                <strong>Min side</strong>
                <span>profile.view</span>
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.statusGrid} aria-label="Systemmodell">
          {statusCards.map((card) => (
            <article key={card.label} className={styles.statusCard}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <p>{card.note}</p>
            </article>
          ))}
        </section>

        <section className={styles.moduleGrid} aria-label="Hovedmoduler">
          {menuItems.slice(1).map((item) => (
            <article key={item.href} className={styles.moduleCard}>
              <div>
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </div>
              <Link href={item.href}>Åpne</Link>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
