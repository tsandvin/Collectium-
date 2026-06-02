"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AdminUsersClient v18
 *
 * Definering / formål:
 * Fullbredde administrasjonsside for kunder, medlemskap, kundekilde/opprinnelse,
 * aktivitet, support, samling, auksjon og nettbutikkstatus. Brukerlisten bruker
 * arkivfaner med medlemskap/forhandlere til venstre og Admin/Påloggede/Avloggede
 * til høyre. Rader ekspanderer og kan åpne egen kundepresentasjon.
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
 * - admin.users.disable
 * - admin.users.roles.manage
 * - admin.users.sessions.view
 * - admin.users.activity.view
 * - admin.users.collection.view
 * - admin.users.payments.view
 * - admin.customer.presentation.view
 * - admin.customer.origin.view
 *
 * Berørte fremtidige DB-felt:
 * - customer_number
 * - customer_country_code
 * - customer_number_year
 * - customer_number_sequence
 * - customer_origin_type
 * - customer_origin_source
 * - customer_origin_referrer
 * - customer_origin_campaign
 * - customer_origin_dealer_id
 * - customer_origin_first_page
 * - customer_origin_first_object_group
 */

import { useMemo, useState } from "react";
import styles from "../landing/collectium-frontpage.module.css";

type Membership = "Free" | "Bronze" | "Silver" | "Gold" | "Platinum";
type UserStatus = "active" | "suspended" | "pending" | "offline";
type KycStatus = "verified" | "pending" | "not_started";
type Presence = "Admin" | "Påloggede" | "Avloggede";
type CustomerType = "customer" | "dealer";
type CustomerOriginType = "organisk" | "forhandler" | "auksjon" | "nettbutikk" | "museum" | "kampanje" | "admin_support" | "import";

type AdminUser = {
  id: string;
  customerNumber: string;
  customerCountryCode: string;
  customerNumberYear: number;
  customerNumberSequence: number;
  customerType: CustomerType;
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
  originType: CustomerOriginType;
  originSource: string;
  originReferrer: string;
  originCampaign: string;
  originDealerId?: string;
  originFirstPage: string;
  originFirstObjectGroup: string;
  originRegisteredChannel: string;
  mostUsedPages: Array<{ page: string; percent: number }>;
  supportFlag: string;
  activityLog: string[];
};

const users: AdminUser[] = [
  {
    id: "92121216",
    customerNumber: "CT-NO-2026-000001",
    customerCountryCode: "NO",
    customerNumberYear: 2026,
    customerNumberSequence: 1,
    customerType: "customer",
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
    shop: "2 butikkobjekter",
    collector: "Aktiv samler",
    lastOnline: "i dag 14:28",
    onlineToday: "2 t 14 min",
    onlineMonth: "38 t 20 min",
    yearlyRevenue: "20 000 kr",
    since: "14.02.2026",
    originType: "forhandler",
    originSource: "Invitert av forhandler",
    originReferrer: "Demo Forhandler",
    originCampaign: "Vårkampanje 2026",
    originDealerId: "CTD-NO-2026-000001",
    originFirstPage: "/registrering",
    originFirstObjectGroup: "Sedler",
    originRegisteredChannel: "app.collectium.no",
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
    customerNumber: "CT-NO-2026-000018",
    customerCountryCode: "NO",
    customerNumberYear: 2026,
    customerNumberSequence: 18,
    customerType: "customer",
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
    originType: "organisk",
    originSource: "Organisk registrering",
    originReferrer: "Google / søk",
    originCampaign: "Ingen",
    originFirstPage: "/",
    originFirstObjectGroup: "Mynter",
    originRegisteredChannel: "app.collectium.no",
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
    customerNumber: "CT-NO-2026-000000",
    customerCountryCode: "NO",
    customerNumberYear: 2026,
    customerNumberSequence: 0,
    customerType: "customer",
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
    originType: "admin_support",
    originSource: "Admin-opprettet",
    originReferrer: "Collectium system",
    originCampaign: "Intern",
    originFirstPage: "/admin",
    originFirstObjectGroup: "System",
    originRegisteredChannel: "admin",
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
    customerNumber: "CTD-NO-2026-000001",
    customerCountryCode: "NO",
    customerNumberYear: 2026,
    customerNumberSequence: 1,
    customerType: "dealer",
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
    originType: "admin_support",
    originSource: "Forhandlerregistrering",
    originReferrer: "Admin/support",
    originCampaign: "Forhandlerpilot 2026",
    originFirstPage: "/forhandler",
    originFirstObjectGroup: "Sedler og mynter",
    originRegisteredChannel: "app.collectium.no",
    mostUsedPages: [
      { page: "Forhandler", percent: 44 },
      { page: "Auksjon", percent: 34 },
      { page: "Katalog", percent: 22 },
    ],
    supportFlag: "Avtale må kontrolleres",
    activityLog: ["12.05 opprettet auksjonsutkast", "11.05 åpnet forhandlerpanel"],
  },
];

const membershipTabs: Array<"Alle" | Membership | "Forhandlere"> = ["Alle", "Free", "Bronze", "Silver", "Gold", "Platinum", "Forhandlere"];
const archiveTabs: Presence[] = ["Admin", "Påloggede", "Avloggede"];
const originFilters: Array<"Alle" | CustomerOriginType> = ["Alle", "organisk", "forhandler", "auksjon", "nettbutikk", "museum", "kampanje", "admin_support", "import"];

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

function originLabel(origin: CustomerOriginType) {
  const labels: Record<CustomerOriginType, string> = {
    organisk: "Organisk",
    forhandler: "Forhandler",
    auksjon: "Auksjon",
    nettbutikk: "Nettbutikk",
    museum: "Museum",
    kampanje: "Kampanje",
    admin_support: "Admin/support",
    import: "Import",
  };
  return labels[origin];
}

export default function AdminUsersClient() {
  const [search, setSearch] = useState("");
  const [membership, setMembership] = useState<"Alle" | Membership | "Forhandlere">("Alle");
  const [status, setStatus] = useState<"Alle" | UserStatus>("Alle");
  const [kyc, setKyc] = useState<"Alle" | KycStatus>("Alle");
  const [origin, setOrigin] = useState<"Alle" | CustomerOriginType>("Alle");
  const [archive, setArchive] = useState<Presence>("Påloggede");
  const [expandedId, setExpandedId] = useState(users[1].id);

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const textMatch = `${user.name} ${user.email} ${user.phone} ${user.id} ${user.customerNumber} ${user.originSource}`.toLowerCase().includes(search.toLowerCase());
      const membershipMatch = membership === "Alle" || (membership === "Forhandlere" ? user.customerType === "dealer" : user.membership === membership);
      const statusMatch = status === "Alle" || user.status === status;
      const kycMatch = kyc === "Alle" || user.kyc === kyc;
      const originMatch = origin === "Alle" || user.originType === origin;
      const archiveMatch = archive === "Admin" ? user.presence === "Admin" || user.membership === "Platinum" : user.presence === archive;
      return textMatch && membershipMatch && statusMatch && kycMatch && originMatch && archiveMatch;
    });
  }, [search, membership, status, kyc, origin, archive]);

  function toggleUser(user: AdminUser) {
    setExpandedId((current) => (current === user.id ? "" : user.id));
  }

  return (
    <div className={styles.adminUsersPageFull}>
      <section className={styles.adminPageHeader}>
        <div>
          <p className={styles.kicker}>Admin / brukere</p>
          <h1>Brukere og medlemskap</h1>
          <p>Brukeroversikt med medlemskap, kundenummer, kundekilde, aktivitet, supportlogg, samling, auksjon og nettbutikkstatus.</p>
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

      <section className={`${styles.adminFilterBarV18} ct-panel`}>
        <label>
          Søk bruker
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Navn, e-post, telefon, kundenummer eller ID" />
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
          Kundekilde
          <select value={origin} onChange={(event) => setOrigin(event.target.value as "Alle" | CustomerOriginType)}>
            {originFilters.map((item) => <option key={item} value={item}>{item === "Alle" ? "Alle" : originLabel(item)}</option>)}
          </select>
        </label>
        <button type="button" className={styles.goldButton}>Filtrer</button>
      </section>

      <section className={`${styles.adminUserListFull} ct-panel`}>
        <div className={styles.userArchiveTabsSplit}>
          <div className={styles.archiveTabsLeft} aria-label="Medlemskap og kundetype">
            {membershipTabs.map((item) => (
              <button key={item} type="button" onClick={() => setMembership(item)} className={membership === item ? styles.archiveTabActive : ""}>
                {item}
              </button>
            ))}
          </div>
          <div className={styles.archiveTabsRight} aria-label="Statusfaner">
            {archiveTabs.map((item) => (
              <button key={item} type="button" onClick={() => setArchive(item)} className={archive === item ? styles.archiveTabActive : ""}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.adminUserTableHeaderV18}>
          <span>Bruker</span><span>Kundenummer</span><span>Kilde</span><span>Status</span><span>KYC</span><span>Samling</span><span>Auksjon</span><span>Handling</span>
        </div>

        {filtered.map((user) => (
          <div key={user.id} className={`${styles.adminUserExpandable} ${expandedId === user.id ? styles.adminUserRowActive : ""}`}>
            <button type="button" className={styles.adminUserRowV18} onClick={() => toggleUser(user)}>
              <span className={styles.userIdentity}><b>{user.initials}</b><strong>{user.name}</strong><small>{user.email} / {user.id}</small></span>
              <span><strong>{user.customerNumber}</strong><small>{user.customerCountryCode} · {user.customerNumberYear}</small></span>
              <span><strong>{originLabel(user.originType)}</strong><small>{user.originSource}</small></span>
              <span><em className={`${styles.statusPill} ${styles[user.status]}`}>{statusLabel(user.status)}</em></span>
              <span><em className={`${styles.statusPill} ${styles[user.kyc]}`}>{kycLabel(user.kyc)}</em></span>
              <span><strong>{user.collectionValue}</strong><small>{user.objects} objekter</small></span>
              <span><strong>{user.auction}</strong><small>{user.shop}</small></span>
              <span><i>Åpne ark</i><small>Klikk for hurtigvisning</small></span>
            </button>
            {expandedId === user.id ? <ExpandedUserRow user={user} /> : null}
          </div>
        ))}
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
    <div className={styles.expandedUserRowV18}>
      <div>
        <h3>Kontakt</h3>
        <p>{user.email}</p>
        <p>{user.phone}</p>
        <p>{user.address}</p>
        <p>{user.country} · {user.customerCountryCode}</p>
      </div>
      <div>
        <h3>Kundenummer</h3>
        <p><b>{user.customerNumber}</b></p>
        <p>Format: {user.customerType === "dealer" ? "CTD" : "CT"}-[LAND]-[ÅR]-[LØPENR]</p>
        <p>Sekvens: {String(user.customerNumberSequence).padStart(6, "0")}</p>
      </div>
      <div>
        <h3>Kundekilde</h3>
        <p>{user.originSource}</p>
        <p>Referrer: {user.originReferrer}</p>
        <p>Kampanje: {user.originCampaign}</p>
        {user.originDealerId ? <p>Forhandler: {user.originDealerId}</p> : null}
      </div>
      <div>
        <h3>Første aktivitet</h3>
        <p>Første side: {user.originFirstPage}</p>
        <p>Objektgruppe: {user.originFirstObjectGroup}</p>
        <p>Kanal: {user.originRegisteredChannel}</p>
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
      </div>
      <div className={styles.expandedUserActions}>
        <h3>Kundepresentasjon</h3>
        <p>Egen side med full profil, aktivitet, grafer, supportlogg og systemgrunnlag.</p>
        <a href={`/admin/kunde/${encodeURIComponent(user.id)}`} className={styles.goldButton} data-feature-key="admin.customer.presentation.view">Åpne kundepresentasjon</a>
      </div>
    </div>
  );
}
