"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AdminUsersClient v17
 *
 * Definering / formål:
 * Administrasjonsside for brukere, medlemskap, kundeaktivitet og support. Brukerlisten
 * ekspanderer ved klikk og gir rask oversikt over kontakt, samlergrupper, samlerverdi,
 * online-tid, mest brukte sider, status for samling/auksjon/nettbutikk og supportbehov.
 *
 * Bruksområde:
 * Brukes i innlogget adminflate /admin/brukere.
 *
 * Berørte sider / routes:
 * - /admin/brukere
 * - /admin/kunde/[userId]
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.users.view
 * - admin.users.edit
 * - admin.users.activity.view
 * - admin.users.collection.view
 * - admin.users.payments.view
 * - admin.customer.presentation.view
 */

import { useMemo, useState } from "react";
import styles from "../landing/collectium-frontpage.module.css";

type Membership = "Free" | "Bronze" | "Silver" | "Gold" | "Platinum";
type UserStatus = "active" | "suspended" | "pending" | "offline";
type KycStatus = "verified" | "pending" | "not_started";
type Presence = "Admin" | "Påloggede" | "Avloggede";

type AdminUser = {
  id: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  status: UserStatus;
  presence: Presence;
  membership: Membership;
  kyc: KycStatus;
  collectionValue: string;
  objects: number;
  groups: Array<{ name: string; count: number; value: string }>;
  auction: string;
  shop: string;
  collector: string;
  lastOnline: string;
  onlineToday: string;
  onlineMonth: string;
  yearlyRevenue: string;
  since: string;
  mostUsedPages: Array<{ page: string; percent: number }>;
  supportFlag: string;
  activityLog: string[];
};

const users: AdminUser[] = [
  {
    id: "92121216",
    initials: "OB",
    name: "Ola Berg",
    email: "ola@example.no",
    phone: "92121216",
    country: "Norge",
    address: "Storgata 12, 0155 Oslo",
    status: "suspended",
    presence: "Påloggede",
    membership: "Gold",
    kyc: "pending",
    collectionValue: "128 450 kr",
    objects: 247,
    groups: [
      { name: "Sedler", count: 128, value: "88 200 kr" },
      { name: "Mynter", count: 96, value: "31 800 kr" },
      { name: "Dokumenter", count: 23, value: "8 450 kr" },
    ],
    auction: "3 bud",
    shop: "2 objekter til salgs",
    collector: "Aktiv samler",
    lastOnline: "i dag 14:28",
    onlineToday: "2 t 14 min",
    onlineMonth: "38 t 20 min",
    yearlyRevenue: "2 490 kr",
    since: "14.02.2026",
    mostUsedPages: [
      { page: "Katalog", percent: 42 },
      { page: "Min samling", percent: 28 },
      { page: "Auksjon", percent: 18 },
      { page: "Index", percent: 12 },
    ],
    supportFlag: "Trenger hjelp i katalogfilter",
    activityLog: ["14:28 åpnet katalog", "14:12 filtrerte Norske sedler", "13:55 la NSNR 23a i ønskeliste", "12:02 forsøkte å åpne auksjon"],
  },
  {
    id: "10000018",
    initials: "KH",
    name: "Kari Hansen",
    email: "kari@example.no",
    phone: "10000018",
    country: "Norge",
    address: "Fjordveien 4, Bergen",
    status: "active",
    presence: "Avloggede",
    membership: "Silver",
    kyc: "verified",
    collectionValue: "42 800 kr",
    objects: 84,
    groups: [
      { name: "Mynter", count: 58, value: "29 400 kr" },
      { name: "Sedler", count: 26, value: "13 400 kr" },
    ],
    auction: "Ingen aktive",
    shop: "Ingen butikkobjekter",
    collector: "Privat samling",
    lastOnline: "i går 20:11",
    onlineToday: "0 min",
    onlineMonth: "12 t 10 min",
    yearlyRevenue: "6 000 kr",
    since: "03.01.2026",
    mostUsedPages: [
      { page: "Min samling", percent: 48 },
      { page: "Katalog", percent: 34 },
      { page: "Historie", percent: 18 },
    ],
    supportFlag: "Ingen aktiv sak",
    activityLog: ["i går 20:11 åpnet Min samling", "i går 19:50 lastet opp bilde", "mandag 21:22 redigerte notat"],
  },
  {
    id: "ADMIN-001",
    initials: "CA",
    name: "Collectium Admin",
    email: "admin@collectium.no",
    phone: "-",
    country: "Norge",
    address: "Collectium system",
    status: "active",
    presence: "Admin",
    membership: "Platinum",
    kyc: "verified",
    collectionValue: "0 kr",
    objects: 0,
    groups: [],
    auction: "Admin",
    shop: "Admin",
    collector: "Systembruker",
    lastOnline: "nå",
    onlineToday: "4 t 02 min",
    onlineMonth: "104 t",
    yearlyRevenue: "0 kr",
    since: "01.01.2026",
    mostUsedPages: [
      { page: "Admin", percent: 62 },
      { page: "Katalog", percent: 18 },
      { page: "DB 8.4", percent: 20 },
    ],
    supportFlag: "Systembruker",
    activityLog: ["nå åpnet brukeradmin", "14:11 sjekket DB 8.4", "13:02 åpnet adminlogg"],
  },
  {
    id: "DEALER-01",
    initials: "DF",
    name: "Demo Forhandler",
    email: "demo.forhandler@collectium.no",
    phone: "-",
    country: "Norge",
    address: "Forhandlergata 1",
    status: "active",
    presence: "Påloggede",
    membership: "Gold",
    kyc: "verified",
    collectionValue: "0 kr",
    objects: 0,
    groups: [
      { name: "Sedler", count: 0, value: "0 kr" },
      { name: "Mynter", count: 0, value: "0 kr" },
    ],
    auction: "Auksjon aktiv",
    shop: "Nettbutikk aktiv",
    collector: "Forhandlerkonto",
    lastOnline: "12.05",
    onlineToday: "31 min",
    onlineMonth: "18 t",
    yearlyRevenue: "20 000 kr",
    since: "18.02.2026",
    mostUsedPages: [
      { page: "Forhandler", percent: 44 },
      { page: "Auksjon", percent: 34 },
      { page: "Katalog", percent: 22 },
    ],
    supportFlag: "Avtale må kontrolleres",
    activityLog: ["12.05 opprettet auksjonsutkast", "11.05 åpnet forhandlerpanel"],
  },
];

const membershipTabs: Array<"Alle" | Membership> = ["Alle", "Free", "Bronze", "Silver", "Gold", "Platinum"];
const archiveTabs: Presence[] = ["Admin", "Påloggede", "Avloggede"];
const profileTabs = ["Profil", "Medlemskap", "Samling", "Auksjon", "Historikk", "Sikkerhet", "KYC", "Prosess", "Innstillinger", "Admin"];

function statusLabel(status: UserStatus) {
  if (status === "active") return "Aktiv";
  if (status === "suspended") return "Suspendert";
  if (status === "offline") return "Avlogget";
  return "Venter";
}

function kycLabel(status: KycStatus) {
  if (status === "verified") return "Verifisert";
  if (status === "pending") return "Venter";
  return "Ikke startet";
}

export default function AdminUsersClient() {
  const [search, setSearch] = useState("");
  const [membership, setMembership] = useState<"Alle" | Membership>("Alle");
  const [status, setStatus] = useState<"Alle" | UserStatus>("Alle");
  const [kyc, setKyc] = useState<"Alle" | KycStatus>("Alle");
  const [archive, setArchive] = useState<Presence>("Admin");
  const [expandedId, setExpandedId] = useState(users[0].id);
  const [selected, setSelected] = useState<AdminUser>(users[0]);
  const [tab, setTab] = useState("Medlemskap");

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const textMatch = `${user.name} ${user.email} ${user.phone} ${user.id}`.toLowerCase().includes(search.toLowerCase());
      const membershipMatch = membership === "Alle" || user.membership === membership;
      const statusMatch = status === "Alle" || user.status === status;
      const kycMatch = kyc === "Alle" || user.kyc === kyc;
      const archiveMatch = archive === "Admin" ? true : user.presence === archive;
      return textMatch && membershipMatch && statusMatch && kycMatch && archiveMatch;
    });
  }, [search, membership, status, kyc, archive]);

  function selectUser(user: AdminUser) {
    setSelected(user);
    setExpandedId((current) => (current === user.id ? "" : user.id));
  }

  return (
    <div className={styles.adminUsersPage}>
      <section className={styles.adminPageHeader}>
        <div>
          <p className={styles.kicker}>Admin / brukere</p>
          <h1>Brukere og medlemskap</h1>
          <p>Brukeroversikt med medlemskap, kundeaktivitet, supportlogg, samling, auksjon og nettbutikkstatus.</p>
        </div>
        <div className={styles.adminHeaderActions}>
          <a href="/admin" className={styles.secondaryButton}>Admin dashboard</a>
          <button className={styles.goldButton} type="button" data-feature-key="admin.users.create">Ny bruker</button>
        </div>
      </section>

      <section className={styles.adminStatsGrid}>
        <StatCard value="184" label="Aktive brukere" note="+4,2% · 236 totalt" tone="green" />
        <StatCard value="128" label="Vinnende bud (år)" note="+18% vs i fjor" tone="gold" />
        <StatCard value="11" label="KYC status" note="173 verifisert" tone="red" />
        <StatCard value={'2,4"'} label="Omsetning hittil i år" note="180 000 kr fee" tone="blue" />
      </section>

      <section className={`${styles.adminFilterBar} ct-panel`}>
        <label>
          Søk bruker
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Navn, e-post, telefon eller ID" />
        </label>
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value as "Alle" | UserStatus)}>
            <option>Alle</option>
            <option value="active">Aktiv</option>
            <option value="suspended">Suspendert</option>
            <option value="pending">Venter</option>
            <option value="offline">Avlogget</option>
          </select>
        </label>
        <label>
          KYC
          <select value={kyc} onChange={(event) => setKyc(event.target.value as "Alle" | KycStatus)}>
            <option>Alle</option>
            <option value="verified">Verifisert</option>
            <option value="pending">Venter</option>
            <option value="not_started">Ikke startet</option>
          </select>
        </label>
        <label>
          Medlemskap
          <select value={membership} onChange={(event) => setMembership(event.target.value as "Alle" | Membership)}>
            {membershipTabs.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button type="button" className={styles.goldButton}>Filtrer</button>
      </section>

      <section className={styles.adminUserWorkspaceWide}>
        <div className={`${styles.adminUserList} ct-panel`}>
          <div className={styles.archiveTabs}>
            {archiveTabs.map((item) => (
              <button key={item} type="button" onClick={() => setArchive(item)} className={archive === item ? styles.archiveTabActive : ""}>
                {item}
              </button>
            ))}
          </div>

          <div className={styles.adminTabs}>
            {membershipTabs.map((item) => (
              <button key={item} type="button" onClick={() => setMembership(item)} className={membership === item ? styles.adminTabActive : ""}>
                {item}
              </button>
            ))}
          </div>

          <div className={styles.adminUserTableHeader}>
            <span>Bruker</span><span>Status</span><span>KYC</span><span>Samling</span><span>Auksjon</span><span>Handling</span>
          </div>

          {filtered.map((user) => (
            <div key={user.id} className={`${styles.adminUserExpandable} ${selected.id === user.id ? styles.adminUserRowActive : ""}`}>
              <button type="button" className={styles.adminUserRow} onClick={() => selectUser(user)}>
                <span className={styles.userIdentity}><b>{user.initials}</b><strong>{user.name}</strong><small>{user.email} / {user.id}</small></span>
                <span><em className={`${styles.statusPill} ${styles[user.status]}`}>{statusLabel(user.status)}</em></span>
                <span><em className={`${styles.statusPill} ${styles[user.kyc]}`}>{kycLabel(user.kyc)}</em></span>
                <span><strong>{user.collectionValue}</strong><small>{user.objects} objekter</small></span>
                <span><strong>{user.auction}</strong></span>
                <span><i>Åpne ark</i><small>Klikk for profilkort</small></span>
              </button>
              {expandedId === user.id ? <ExpandedUserRow user={user} /> : null}
            </div>
          ))}
        </div>

        <UserArchiveCard user={selected} activeTab={tab} onTabChange={setTab} />
      </section>
    </div>
  );
}

function StatCard({ value, label, note, tone }: { value: string; label: string; note: string; tone: "green" | "gold" | "red" | "blue" }) {
  return (
    <article className={`${styles.adminStatCard} ${styles[tone]} ct-card`}>
      <strong>{value}</strong>
      <span>{label}</span>
      <small>{note}</small>
    </article>
  );
}

function ExpandedUserRow({ user }: { user: AdminUser }) {
  return (
    <div className={styles.expandedUserRow}>
      <div>
        <h3>Kontakt</h3>
        <p>{user.email}</p>
        <p>{user.phone}</p>
        <p>{user.address}</p>
      </div>
      <div>
        <h3>Samlergrupper</h3>
        {user.groups.length ? user.groups.map((group) => (
          <p key={group.name}><b>{group.name}</b> · {group.count} objekter · {group.value}</p>
        )) : <p>Ingen grupper registrert</p>}
      </div>
      <div>
        <h3>Status</h3>
        <p>Samler: {user.collector}</p>
        <p>Auksjon: {user.auction}</p>
        <p>Nettbutikk: {user.shop}</p>
      </div>
      <div>
        <h3>Aktivitet/support</h3>
        <p>Online i dag: {user.onlineToday}</p>
        <p>Mest brukt: {user.mostUsedPages[0]?.page}</p>
        <p>Support: {user.supportFlag}</p>
        <a href={`/admin/kunde/${encodeURIComponent(user.id)}`} className={styles.secondaryButton} data-feature-key="admin.customer.presentation.view">Åpne kundepresentasjon</a>
      </div>
    </div>
  );
}

function UserArchiveCard({ user, activeTab, onTabChange }: { user: AdminUser; activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <aside className={`${styles.userArchiveCard} ct-panel`}>
      <div className={styles.userArchiveTop}>
        <div className={styles.bigInitials}>{user.initials}</div>
        <div>
          <h2>{user.name}</h2>
          <p>{user.email} · {user.phone}</p>
          <p>{user.membership}-medlem · {user.collector} · KYC {kycLabel(user.kyc).toLowerCase()}</p>
        </div>
        <div className={styles.userOnline}>Sist online: <b>{user.lastOnline}</b> ●</div>
      </div>

      <nav className={styles.userProfileTabs}>
        {profileTabs.map((item) => (
          <button key={item} type="button" onClick={() => onTabChange(item)} className={activeTab === item ? styles.adminTabActive : ""}>
            {item}
          </button>
        ))}
      </nav>

      {activeTab === "Medlemskap" ? <MembershipPanel user={user} /> : <GenericPanel user={user} activeTab={activeTab} />}
    </aside>
  );
}

function MembershipPanel({ user }: { user: AdminUser }) {
  return (
    <div className={styles.membershipGrid}>
      <InfoBox title="Nåværende medlemskap" value={user.membership} note="Tilgang, filter og medlemsfordeler" action="Endre medlemskap" />
      <InfoBox title="Ble medlem" value={user.since} note="Invitert av Collectium" />
      <InfoBox title="Medlemskapet går ut" value="01.12.2027" note="Automatisk fornyelse kan styres" action="Forleng medlemskap" />
      <InfoBox title="Betalingsstatus" value="Betalt" note={`Neste fornyelse ${user.yearlyRevenue}`} action="Fakturaer" />
      <InfoBox title="Samlerverdi" value={user.collectionValue} note={`${user.objects} objekter fordelt på ${user.groups.length || 0} grupper`} action="Se samling" />
      <InfoBox title="Inkludert tilgang" value="Aktiv" note="Auksjon, samling, rapporter og statistikk" action="Se fordeler" />
      <InfoBox title="Kampanje / rabatt" value="Vårkampanje 2026" note="Gyldig til 30.06.2026" />
      <InfoBox title="Historikk" value="Oppgradert" note="Free → Gold / fornyet medlemskap" action="Se historikk" />
    </div>
  );
}

function GenericPanel({ user, activeTab }: { user: AdminUser; activeTab: string }) {
  return (
    <div className={styles.membershipGrid}>
      <InfoBox title={`${activeTab} status`} value="Klar" note={`${activeTab} for ${user.name} vises her når API er koblet.`} />
      <InfoBox title="Aktivitetsgrunnlag" value={user.onlineMonth} note="Samlet online-tid siste 30 dager" />
      <InfoBox title="Support" value={user.supportFlag} note="Brukes for å hjelpe kunden raskere." />
    </div>
  );
}

function InfoBox({ title, value, note, action }: { title: string; value: string; note: string; action?: string }) {
  return (
    <article className={`${styles.infoBox} ct-card`}>
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{note}</p>
      {action ? <button type="button">{action}</button> : null}
    </article>
  );
}
