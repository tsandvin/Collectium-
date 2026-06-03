"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CollectiumAppShell v19
 *
 * Definering / formål:
 * Innlogget Collectium-appshell med låst sidemeny, toppmeny, designpanel, varselmeny,
 * admin-dashboard og ruting til adminmoduler. Prosesser-knappen er fjernet fra topbar;
 * prosesshendelser ligger i varselmenyen sammen med meldinger og aktiviteter. Dette er frontend-/previewlag som senere
 * kobles til DB 8.4, MariaDB og ekte API-kontrakter.
 *
 * Bruksområde:
 * Brukes av /minside, /admin, /admin/brukere, /admin/innstillinger, /admin/kunde/[userId]
 * og /admin/forhandlere, samt /katalog.
 *
 * Berørte sider / routes:
 * - /minside
 * - /admin
 * - /admin/brukere
 * - /admin/innstillinger
 * - /admin/kunde/[userId]
 * - /admin/forhandlere
 *
 * Berørte DB-brytere / feature_keys:
 * - profile.view
 * - admin.control.view
 * - admin.users.view
 * - admin.users.activity.view
 * - admin.customer.presentation.view
 * - admin.dealers.view
 * - admin.settings.view
 * - admin.notifications.view
 * - admin.design.control
 * - auth.logout
 */

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import AdminDealersClient from "../admin/AdminDealersClient";
import AdminSettingsClient from "../admin/AdminSettingsClient";
import AdminUsersClient from "../admin/AdminUsersClient";
import { allDemoUsers, formatKr } from "../admin/collectiumDemoUsers";
import CustomerPresentationClient from "../admin/CustomerPresentationClient";
import CatalogWorkspaceClient from "../catalog/CatalogWorkspaceClient";
import styles from "../landing/collectium-frontpage.module.css";

type Session = {
  email: string;
  name: string;
  role: string;
  membership: string;
  createdAt: string;
};

type AppPage = "minside" | "admin" | "catalog";
type AdminModule = "dashboard" | "users" | "settings" | "customer" | "dealers";
type NotificationIconType = "object" | "collection" | "support" | "market" | "system" | "dealer" | "auction" | "user";

type CollectiumAppShellProps = {
  page: AppPage;
  adminModule?: AdminModule;
  customerId?: string;
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
  { label: "Forhandlere", href: "/admin/forhandlere", module: "dealers" },
  { label: "Innstillinger", href: "/admin/innstillinger", module: "settings" },
];

const notifications = [
  { type: "Varsel", title: "Ny forhandlersøknad", text: "Demo Forhandler mangler avtaledokumentasjon." },
  { type: "Prosess", title: "DB 8.4-kontroll", text: "3 action-routes må kobles mot API før produksjon." },
  { type: "Aktivitet", title: "Kunde trenger hjelp", text: "Ola Berg har høy feilmengde i katalogfilter siste døgn." },
];

function buildNotificationSections() {
  const activeDemoUsers = allDemoUsers.filter((user) => user.presence !== "Admin" && user.status !== "anonymized");
  const objectAdds = activeDemoUsers
    .map((user) => ({ user, count: user.dailyObjectAdds ?? 0 }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || b.user.objects - a.user.objects);
  const supportUsers = activeDemoUsers
    .filter((user) => user.supportOpenCases > 0 || user.kyc !== "verified" || user.status === "deleted_requested" || user.status === "pending")
    .sort((a, b) => b.supportOpenCases - a.supportOpenCases);
  const catalogUsers = activeDemoUsers.filter((user) => user.objects > 0).sort((a, b) => b.objects - a.objects);
  const marketUsers = activeDemoUsers
    .filter((user) => user.auction !== "Ingen" || user.shop !== "Ingen" || user.customerType === "dealer")
    .sort((a, b) => b.collectionValue - a.collectionValue);
  const onlineUsers = activeDemoUsers.filter((user) => user.presence === "Paalogget").sort((a, b) => b.onlineTodayMin - a.onlineTodayMin);

  return [
    {
      key: "daily",
      title: "Demoaktivitet i dag",
      iconType: "object" as NotificationIconType,
      metric: `${objectAdds.reduce((sum, item) => sum + item.count, 0)} nye objekter`,
      items: objectAdds.slice(0, 5).map(({ user, count }) => ({
        href: `/admin/kunde/${encodeURIComponent(user.id)}`,
        iconType: "object" as NotificationIconType,
        title: user.name,
        text: `${count} nye objekter lagt til i dag - ${user.groups[0]?.name ?? user.originFirstObjectGroup}`,
        meta: user.customerNumber,
      })),
    },
    {
      key: "objects",
      title: "Objekter og samling",
      iconType: "collection" as NotificationIconType,
      metric: `${catalogUsers.reduce((sum, user) => sum + user.objects, 0).toLocaleString("nb-NO")} objekter`,
      items: catalogUsers.slice(0, 5).map((user) => ({
        href: `/admin/kunde/${encodeURIComponent(user.id)}`,
        iconType: "collection" as NotificationIconType,
        title: user.name,
        text: `${user.objects.toLocaleString("nb-NO")} objekter - ${formatKr(user.collectionValue)}`,
        meta: user.groups.map((group) => `${group.name} ${group.count}`).slice(0, 2).join(" - ") || user.collector,
      })),
    },
    {
      key: "support",
      title: "Support og KYC",
      iconType: "support" as NotificationIconType,
      metric: `${supportUsers.length} saker`,
      items: supportUsers.slice(0, 5).map((user) => ({
        href: `/admin/kunde/${encodeURIComponent(user.id)}`,
        iconType: "support" as NotificationIconType,
        title: user.name,
        text: user.supportFlag,
        meta: `KYC: ${user.kyc} - status: ${user.status}`,
      })),
    },
    {
      key: "market",
      title: "Marked og forhandler",
      iconType: "market" as NotificationIconType,
      metric: `${marketUsers.length} aktive`,
      items: marketUsers.slice(0, 5).map((user) => ({
        href: `/admin/kunde/${encodeURIComponent(user.id)}`,
        iconType: (user.customerType === "dealer"
          ? "dealer"
          : user.auction !== "Ingen"
            ? "auction"
            : "market") as NotificationIconType,
        title: user.name,
        text: `${user.auction} - ${user.shop}`,
        meta: user.customerType === "dealer" ? "Forhandlerkonto" : user.originSource,
      })),
    },
    {
      key: "system",
      title: "System og tilgang",
      iconType: "system" as NotificationIconType,
      metric: `${onlineUsers.length} paalogget`,
      items: [
        ...onlineUsers.slice(0, 3).map((user) => ({
          href: `/admin/kunde/${encodeURIComponent(user.id)}`,
          iconType: "user" as NotificationIconType,
          title: user.name,
          text: `${user.onlineTodayMin} min online i dag - ${user.lastOnline}`,
          meta: user.mostUsedPages.map((page) => page.page).slice(0, 3).join(" - "),
        })),
        {
          href: "/admin/kontroll",
          iconType: "system" as NotificationIconType,
          title: "DB 8.4-kontroll",
          text: "Kontroller API-ruter, feature access og action-routes.",
          meta: "admin.control.view",
        },
      ],
    },
  ];
}

const notificationSections = buildNotificationSections();

function applyCollectiumDesign(template: string) {
  if (typeof document === "undefined") return;
  document.body.setAttribute("data-template", template);
  document.documentElement.setAttribute("data-template", template);
  window.localStorage.setItem("collectium-template", template);
}


export default function CollectiumAppShell({ page, adminModule = "dashboard", customerId }: CollectiumAppShellProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [designOpen, setDesignOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const savedTemplate = window.localStorage.getItem("collectium-template") || "collectium";
    applyCollectiumDesign(savedTemplate);
  }, []);

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
    <main className={styles.appShell} data-page={page}>
      <aside className={styles.appSidebar}>
        <a href="/" className={styles.appBrandBlock}>
          <img src="/brand/collectium-logo-white.png" alt="Collectium" />
          <small>Beta v22</small>
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
            <div className={styles.topbarMenuWrap}>
              <button type="button" onClick={() => { setDesignOpen((open) => !open); setNotificationsOpen(false); }} data-feature-key="admin.design.control">Design</button>
            </div>
            <div className={styles.topbarMenuWrap}>
              <button type="button" onClick={() => { setNotificationsOpen((open) => !open); setDesignOpen(false); }} data-feature-key="admin.notifications.view">Varsler <b>{notificationSections.length}</b></button>
            </div>
            <button type="button" onClick={logout} data-feature-key="auth.logout">Logg ut</button>
          </div>
        </header>

        <DesignMenuPortal open={designOpen} onClose={() => setDesignOpen(false)}>
          <DesignOverlay />
        </DesignMenuPortal>
        <NotificationMenuPortal open={notificationsOpen} onClose={() => setNotificationsOpen(false)}>
          <NotificationOverlay />
        </NotificationMenuPortal>

        {isAdminPage ? <AdminContent module={adminModule} session={session} customerId={customerId} /> : page === "catalog" ? <CatalogWorkspaceClient /> : <MyPageContent session={session} />}
      </section>
    </main>
  );
}

function isActive(page: AppPage, href: string, adminModule: AdminModule) {
  if (page === "minside" && href === "/minside") return true;
  if (page === "catalog" && href === "/katalog") return true;
  if (page === "admin" && href === "/admin" && adminModule === "dashboard") return true;
  return false;
}

function setDesignVars(key: string, value: string) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(key, value);
  document.body.style.setProperty(key, value);
  window.localStorage.setItem(`collectium-design-${key}`, value);
}

function DesignMenuPortal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Lukk designmeny"
        className={styles.designOverlayBackdrop}
        onClick={onClose}
      />
      <div className={styles.designOverlayPanel} role="dialog" aria-modal="true" aria-label="Design">
        {children}
      </div>
    </>,
    document.body
  );
}

function NotificationMenuPortal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Lukk varselmeny"
        className={styles.notificationOverlayBackdrop}
        onClick={onClose}
      />
      {children}
    </>,
    document.body,
  );
}

function DesignOverlay() {
  return (
    <div className={`${styles.designOverlay} ct-card`}>
      <strong>Design</strong>
      <p>Styrer innlogget arbeidsflate globalt.</p>
      <div className={styles.designButtonGrid}>
        {[
          ["collectium", "Collectium"],
          ["enkel", "Samleren"],
          ["museum", "Museum"],
          ["finans", "Finans"],
        ].map(([key, label]) => (
          <button key={key} type="button" onClick={() => applyCollectiumDesign(key)}>{label}</button>
        ))}
      </div>
      <label>Hovedskrift <input type="range" min="9" max="17" defaultValue="13" onChange={(event) => setDesignVars("--ct-body-size", `${event.target.value}px`)} /></label>
      <label>Overskrift <input type="range" min="16" max="25" defaultValue="20" onChange={(event) => setDesignVars("--ct-title-size", `${event.target.value}px`)} /></label>
      <label>Headline <input type="range" min="18" max="42" defaultValue="32" onChange={(event) => setDesignVars("--ct-headline-size", `${event.target.value}px`)} /></label>
      <label>Luft i bokser <input type="range" min="8" max="28" defaultValue="16" onChange={(event) => setDesignVars("--ct-card-pad", `${event.target.value}px`)} /></label>
      <div className={styles.designButtonGrid}>
        <button type="button" onClick={() => document.body.setAttribute("data-screen", "normal")}>Normal</button>
        <button type="button" onClick={() => document.body.setAttribute("data-screen", "wide")}>Bred</button>
        <button type="button" onClick={() => document.body.setAttribute("data-screen", "tv")}>TV</button>
      </div>
    </div>
  );
}

function NotificationOverlay() {
  return (
    <div className={`${styles.notificationOverlay} ct-card`} role="dialog" aria-modal="true" aria-label="Varsler og aktivitet">
      <div className={styles.notificationMegaHeader}>
        <div>
          <strong>Varsler og aktivitet</strong>
          <p>Reell demoaktivitet, samling, support, marked og systemstatus.</p>
        </div>
        <span>{notificationSections.length} grupper</span>
      </div>
      <div className={styles.notificationMegaGrid}>
        {notificationSections.map((section) => (
          <section key={section.key} className={styles.notificationMegaSection}>
            <header>
              <i className={styles.notificationSectionIcon} aria-hidden="true">
                <NotificationActivityIcon type={section.iconType} />
              </i>
              <span>{section.title}</span>
              <b>{section.metric}</b>
            </header>
            {section.items.map((item) => (
              <a key={`${section.key}-${item.title}-${item.meta}`} href={item.href} data-activity-type={item.iconType}>
                <i className={styles.notificationItemIcon} aria-hidden="true">
                  <NotificationActivityIcon type={item.iconType} />
                </i>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                  <em>{item.meta}</em>
                </span>
              </a>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

function NotificationActivityIcon({ type }: { type: NotificationIconType }) {
  if (type === "object") {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M5 7h14v10H5z" />
        <path d="M8 10h8M8 13h5" />
      </svg>
    );
  }

  if (type === "collection") {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M5 8l7-3 7 3-7 3-7-3z" />
        <path d="M5 12l7 3 7-3M5 16l7 3 7-3" />
      </svg>
    );
  }

  if (type === "support") {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M12 4l7 3v5c0 4.2-2.8 7.2-7 8-4.2-.8-7-3.8-7-8V7l7-3z" />
        <path d="M9 12l2 2 4-5" />
      </svg>
    );
  }

  if (type === "market" || type === "auction") {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M8 8l5 5M10 6l5 5M4 20h10" />
        <path d="M6 10l4-4 7 7-4 4z" />
      </svg>
    );
  }

  if (type === "dealer") {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M7 18V9l5-3 5 3v9M5 18h14" />
        <path d="M9 18v-5h6v5" />
      </svg>
    );
  }

  if (type === "user") {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M12 4v10" />
      <path d="M12 18h.01" />
      <path d="M5 20h14L12 4z" />
    </svg>
  );
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

function AdminContent({ module, session, customerId }: { module: AdminModule; session: Session; customerId?: string }) {
  if (module === "users") return <AdminUsersClient />;
  if (module === "settings") return <AdminSettingsClient />;
  if (module === "customer") return <CustomerPresentationClient userId={customerId || "92121216"} />;
  if (module === "dealers") return <AdminDealersClient />;

  return <AdminDashboard session={session} />;
}

function AdminDashboard({ session }: { session: Session }) {
  const modules = useMemo(() => [
    ["Systemstatus", "Database OK, API-ruter varsler, 3 manglende action-routes", "Grønn/gul"],
    ["Brukere", "184 aktive, 11 KYC-saker, 3 supportvarsler", "Brukere"],
    ["Medlemskap", "Bronze/Silver/Gold/Platinum og rabatter", "Tilgang"],
    ["Forhandlere", "Søknader, avtaler, fee og kategoriadgang", "Forhandler"],
    ["Innleveringer", "Objekter til vurdering og prosess", "Prosess"],
    ["Auksjon", "Aktive, kommende, avsluttede og oppgjør", "Marked"],
    ["Nettbutikk", "Objekter, lager, salg og retur", "Salg"],
    ["Katalog", "Kilder, objekter, relasjoner og filter", "Data"],
    ["Objektgodkjenning", "AI/importforslag venter", "Godkjenning"],
    ["Datakvalitet", "Uten bilde, verdi, relasjon, kilde", "Kontroll"],
    ["Betaling/gebyrer", "Stripe, Vipps, Collectium-fee", "Økonomi"],
    ["Sider/brytere/API", "DB 8.4-kjede og action-routes", "Teknisk"],
  ], []);

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
      <section className={styles.adminControlGrid}>
        {modules.map(([title, text, tag]) => (
          <a key={title} href={title === "Brukere" ? "/admin/brukere" : title === "Forhandlere" ? "/admin/forhandlere" : "/admin"} className={`${styles.adminControlCard} ct-card`}>
            <span>{tag}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </a>
        ))}
      </section>
    </>
  );
}
