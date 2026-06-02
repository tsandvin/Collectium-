
"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AdminUsersClient v21
 *
 * Definering / formÃ¥l:
 * Fullbredde administrasjonsside for kunder, medlemmer og forhandlere med
 * sortering, arkivfaner, resultatvolum, demoaktivitet, brukernavn, ny bruker-
 * opprettelse, kundekilde, kundenummer, slette-/bevaringsregel og
 * profilfletting. Dette er frontend-/previewlag som senere skal kobles til
 * MariaDB/API og DB 8.4 action-routes.
 *
 * BruksomrÃ¥de:
 * Brukes i innlogget adminflate /admin/brukere.
 *
 * BerÃ¸rte sider / routes:
 * - /admin/brukere
 * - /admin/kunde/[userId]
 *
 * BerÃ¸rte DB-brytere / feature_keys:
 * - admin.users.view
 * - admin.users.create
 * - admin.users.edit
 * - admin.users.disable
 * - admin.users.delete.request
 * - admin.users.delete.personal_data
 * - admin.users.ownership_history.preserve
 * - admin.users.merge_profiles
 * - admin.customer.presentation.view
 * - admin.customer.origin.view
 */

import { useEffect, useMemo, useState } from "react";
import styles from "../landing/collectium-frontpage.module.css";
import {
  accountDeletionRule,
  allDemoUsers,
  customerNumberRule,
  formatKr,
  formatMinutes,
  type AdminUser,
  type CustomerOriginType,
  type CustomerType,
  type KycStatus,
  type Membership,
  type Presence,
  type UserStatus,
} from "./collectiumDemoUsers";

const membershipTabs: Array<"Alle" | Membership | "Forhandlere"> = ["Alle", "Free", "Bronze", "Silver", "Gold", "Platinum", "Forhandlere"];
const archiveTabs: Presence[] = ["Admin", "Paalogget", "Avlogget"];
const originFilters: Array<"Alle" | CustomerOriginType> = ["Alle", "organisk", "forhandler", "auksjon", "nettbutikk", "museum", "kampanje", "admin_support", "import"];
type SortKey = "user" | "customerNumber" | "source" | "status" | "kyc" | "collection" | "auction" | "action";
type SortDirection = "asc" | "desc";

type NewUserForm = {
  name: string;
  username: string;
  email: string;
  phone: string;
  countryCode: "NO" | "SE" | "DK" | "FI" | "US";
  membership: Membership;
  customerType: CustomerType;
  originType: CustomerOriginType;
};

function statusLabel(status: UserStatus) {
  if (status === "active") return "Aktiv";
  if (status === "suspended") return "Suspendert";
  if (status === "pending") return "Venter";
  if (status === "deleted_requested") return "Sletting forespurt";
  if (status === "anonymized") return "Anonymisert";
  return "Avlogget";
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

function archiveLabel(tab: Presence) {
  if (tab === "Paalogget") return "PÃ¥loggede";
  if (tab === "Avlogget") return "Avloggede";
  return "Admin";
}

function getUsername(user: AdminUser) {
  return user.username || user.email.split("@")[0] || user.name.toLowerCase().replace(/\s+/g, ".");
}

function isNewUser(user: AdminUser) {
  // Demo-regel: lave/jevne sekvenser er markert som nye i dag for Ã¥ vise fanetall.
  return user.customerNumberSequence > 0 && user.customerNumberSequence % 5 === 0;
}

function isYesterdayUser(user: AdminUser) {
  return user.customerNumberSequence > 0 && user.customerNumberSequence % 4 === 0;
}

function matchesMembershipTab(user: AdminUser, tab: "Alle" | Membership | "Forhandlere") {
  if (tab === "Alle") return true;
  if (tab === "Forhandlere") return user.customerType === "dealer";
  return user.membership === tab;
}

function membershipTabText(users: AdminUser[], tab: "Alle" | Membership | "Forhandlere") {
  const scoped = users.filter((user) => matchesMembershipTab(user, tab));
  const newCount = scoped.filter(isNewUser).length;
  const yesterdayCount = scoped.filter(isYesterdayUser).length;
  return `${tab} ${scoped.length} (NY ${newCount} / i gÃ¥r ${yesterdayCount})`;
}

function archiveTabText(users: AdminUser[], tab: Presence) {
  const scoped = users.filter((user) => tab === "Admin" ? user.presence === "Admin" || user.membership === "Platinum" : user.presence === tab);
  const newCount = scoped.filter(isNewUser).length;
  return `${archiveLabel(tab)} ${scoped.length} (NY ${newCount})`;
}

function sortValue(user: AdminUser, key: SortKey) {
  if (key === "user") return `${user.name} ${getUsername(user)} ${user.email}`;
  if (key === "customerNumber") return user.customerNumber;
  if (key === "source") return user.originSource;
  if (key === "status") return user.status;
  if (key === "kyc") return user.kyc;
  if (key === "collection") return user.collectionValue;
  if (key === "auction") return user.auction;
  return user.supportOpenCases;
}

function createCustomerNumber(countryCode: string, users: AdminUser[], customerType: CustomerType) {
  const prefix = customerType === "dealer" ? "CTD" : "CT";
  const year = new Date().getFullYear();
  const maxSeq = users
    .filter((user) => user.customerCountryCode === countryCode && user.customerType === customerType)
    .reduce((max, user) => Math.max(max, user.customerNumberSequence || 0), 0);
  return `${prefix}-${countryCode}-${year}-${String(maxSeq + 1).padStart(6, "0")}`;
}

function makeInitials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "NY";
}

const defaultNewUser: NewUserForm = {
  name: "",
  username: "",
  email: "",
  phone: "",
  countryCode: "NO",
  membership: "Free",
  customerType: "customer",
  originType: "admin_support",
};

export default function AdminUsersClient() {
  const [users, setUsers] = useState<AdminUser[]>(allDemoUsers as AdminUser[]);
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

  const visibleUsers = useMemo(() => {
    if (!demoAccessPaused) return users;
    return users.map((user) => {
      if (user.id === "ADMIN-001") return user;
      return {
        ...user,
        status: "suspended" as UserStatus,
        presence: "Avlogget" as Presence,
        supportFlag: "Demo-tilgang er stoppet av admin. Brukeren kan ikke brukes til innlogging/testtilgang fÃ¸r demo-tilgang Ã¥pnes igjen.",
        supportOpenCases: Math.max(user.supportOpenCases, 1),
      };
    });
  }, [users, demoAccessPaused]);
  const [search, setSearch] = useState("");
  const [membership, setMembership] = useState<"Alle" | Membership | "Forhandlere">("Alle");
  const [status, setStatus] = useState<"Alle" | UserStatus>("Alle");
  const [kyc, setKyc] = useState<"Alle" | KycStatus>("Alle");
  const [origin, setOrigin] = useState<"Alle" | CustomerOriginType>("Alle");
  const [archive, setArchive] = useState<Presence>("Paalogget");
  const [expandedId, setExpandedId] = useState(users[1]?.id || "");
  const [sortKey, setSortKey] = useState<SortKey>("user");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [createOpen, setCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState<NewUserForm>(defaultNewUser);

  const filtered = useMemo(() => {
    const rows = visibleUsers.filter((user) => {
      const textMatch = `${user.name} ${getUsername(user)} ${user.email} ${user.phone} ${user.id} ${user.customerNumber} ${user.originSource} ${user.address}`.toLowerCase().includes(search.toLowerCase());
      const membershipMatch = matchesMembershipTab(user, membership);
      const statusMatch = status === "Alle" || user.status === status;
      const kycMatch = kyc === "Alle" || user.kyc === kyc;
      const originMatch = origin === "Alle" || user.originType === origin;
      const archiveMatch = archive === "Admin" ? user.presence === "Admin" || user.membership === "Platinum" : user.presence === archive;
      return textMatch && membershipMatch && statusMatch && kycMatch && originMatch && archiveMatch;
    });

    return [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      const order = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv), "nb");
      return sortDirection === "asc" ? order : -order;
    });
  }, [visibleUsers, search, membership, status, kyc, origin, archive, sortKey, sortDirection]);

  const resultSummary = useMemo(() => {
    const totalUsers = filtered.length;
    const objects = filtered.reduce((sum, user) => sum + user.objects, 0);
    const value = filtered.reduce((sum, user) => sum + user.collectionValue, 0);
    const online = filtered.reduce((sum, user) => sum + user.onlineTodayMin, 0);
    const support = filtered.reduce((sum, user) => sum + user.supportOpenCases, 0);
    const auctions = filtered.filter((user) => !user.auction.toLowerCase().includes("ingen")).length;
    return { totalUsers, objects, value, online, support, auctions };
  }, [filtered]);

  function toggleUser(user: AdminUser) {
    setExpandedId((current) => (current === user.id ? "" : user.id));
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  function sortMark(key: SortKey) {
    if (sortKey !== key) return "";
    return sortDirection === "asc" ? " â†‘" : " â†“";
  }

  function createUser() {
    const name = newUser.name.trim() || "Ny Collectium-bruker";
    const email = newUser.email.trim() || `${newUser.username || "ny.bruker"}@example.no`;
    const username = newUser.username.trim() || email.split("@")[0];
    const customerNumber = createCustomerNumber(newUser.countryCode, users, newUser.customerType);
    const sequence = Number(customerNumber.split("-").pop()) || users.length + 1;
    const created: AdminUser = {
      id: `USR-DEMO-${Date.now()}`,
      userIdInternal: `USR-DEMO-${Date.now()}`,
      customerNumber,
      customerCountryCode: newUser.countryCode,
      customerNumberYear: new Date().getFullYear(),
      customerNumberSequence: sequence,
      customerType: newUser.customerType,
      username,
      initials: makeInitials(name),
      name,
      email,
      phone: newUser.phone || "Ikke registrert",
      country: newUser.countryCode === "SE" ? "Sverige" : newUser.countryCode === "DK" ? "Danmark" : newUser.countryCode === "FI" ? "Finland" : newUser.countryCode === "US" ? "USA" : "Norge",
      address: "Ikke registrert",
      status: "pending",
      presence: "Avlogget",
      membership: newUser.membership,
      kyc: "not_started",
      collectionValue: 0,
      objects: 0,
      groups: [],
      auction: "Ingen",
      shop: "Ingen",
      collector: "Ny bruker",
      lastOnline: "ikke logget inn",
      onlineTodayMin: 0,
      onlineMonthMin: 0,
      yearlyRevenue: 0,
      since: new Date().toLocaleDateString("nb-NO"),
      originType: newUser.originType,
      originSource: originLabel(newUser.originType),
      originReferrer: "Admin-opprettet",
      originCampaign: "Admin brukeropprettelse",
      originFirstPage: "/admin/brukere",
      originFirstObjectGroup: "Ikke valgt",
      originRegisteredChannel: "admin",
      mostUsedPages: [{ page: "Ikke startet", percent: 100 }],
      activityByDay: [0,0,0,0,0,0,0,0,0,0,0,0],
      supportFlag: "Ny bruker opprettet av admin",
      supportOpenCases: 0,
      activityLog: ["Admin opprettet bruker i demo-UI"],
      deletionMode: "active",
      deletionPreference: "bevar_konto",
      ownershipHistoryPolicy: "Eierhistorikk beholdes med aktiv profil.",
      mergeCandidates: [],
    };
    setUsers((current) => [created, ...current]);
    setExpandedId(created.id);
    setCreateOpen(false);
    setNewUser(defaultNewUser);
  }

  return (
    <div className={styles.adminUsersPageFull}>
      <section className={styles.adminPageHeader}>
        <div>
          <p className={styles.kicker}>Admin / brukere</p>
          <h1>Brukere og medlemskap</h1>
          <p>Brukeroversikt med demo-kunder, brukernavn, kundekilde, aktivitetsdata, sletteregel, eierhistorikk og profilfletting.</p>
        </div>
        <div className={styles.adminHeaderActions}>
          <a href="/admin" className={styles.secondaryButton}>Admin dashboard</a>
          <button className={styles.goldButton} type="button" data-feature-key="admin.users.create" onClick={() => setCreateOpen((open) => !open)}>
            Opprett ny bruker
          </button>
        </div>
      </section>

      {createOpen ? <CreateUserPanel value={newUser} onChange={setNewUser} onCreate={createUser} onCancel={() => setCreateOpen(false)} /> : null}

      <section className={`${styles.demoAccessPanel} ct-panel`} data-demo-paused={demoAccessPaused ? "true" : "false"}>
        <div>
          <p className={styles.kicker}>Demo-tilgang</p>
          <h2>{demoAccessPaused ? "Demo-brukere er stoppet" : "Demo-brukere er Ã¥pne"}</h2>
          <p>
            Denne bryteren stopper alle demo-brukere fra Ã¥ brukes som testtilgang. Admin/superadmin beholdes,
            og historikk, kundekilde, eierhistorikk og aktivitetsdata vises fortsatt for kontroll.
          </p>
        </div>
        <button
          type="button"
          className={demoAccessPaused ? styles.secondaryButton : styles.goldButton}
          data-feature-key="admin.demo_users.access.toggle"
          onClick={() => updateDemoAccessPaused(!demoAccessPaused)}
        >
          {demoAccessPaused ? "Ã…pne demo-tilgang" : "Stopp demo-brukere"}
        </button>
      </section>

      <section className={styles.adminStatsGrid}>
        <StatCard value={String(resultSummary.totalUsers)} label="Brukere i resultatet" note={membership === "Alle" ? "Total i valgt arkiv/status" : `Kun ${membership}`} tone="green" />
        <StatCard value={String(resultSummary.objects)} label="Samleobjekter" note="sum i filtrert brukerresultat" tone="gold" />
        <StatCard value={formatKr(resultSummary.value)} label="Estimert samlerverdi" note="sum for valgte brukere" tone="blue" />
        <StatCard value={formatMinutes(resultSummary.online)} label="Online i dag" note={`${resultSummary.support} supportindikasjoner Â· ${resultSummary.auctions} med auksjonsaktivitet`} tone="red" />
      </section>

      <section className={`${styles.adminFilterBarV18} ct-panel`}>
        <label>
          SÃ¸k bruker
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Navn, brukernavn, e-post, telefon, kundenummer, adresse eller ID" />
        </label>
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value as "Alle" | UserStatus)}>
            <option>Alle</option>
            <option value="active">Aktiv</option>
            <option value="suspended">Suspendert</option>
            <option value="pending">Venter</option>
            <option value="offline">Avlogget</option>
            <option value="deleted_requested">Sletting forespurt</option>
            <option value="anonymized">Anonymisert</option>
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

      <section className={`${styles.retentionRulePanel} ct-panel`}>
        <div>
          <p className={styles.kicker}>LÃ¥st brukerregel</p>
          <h2>{accountDeletionRule.title}</h2>
          <p>{accountDeletionRule.short}</p>
        </div>
        <div className={styles.retentionRuleGrid}>
          <article><b>Kundenummer</b><span>{customerNumberRule.customer}</span><small>Eksempel {customerNumberRule.exampleCustomer}</small></article>
          <article><b>Forhandlernummer</b><span>{customerNumberRule.dealer}</span><small>Eksempel {customerNumberRule.exampleDealer}</small></article>
          <article><b>Eierhistorikk</b><span>Beholdes</span><small>Persondata kan slettes/anonymiseres uten Ã¥ Ã¸delegge proveniens.</small></article>
          <article><b>Profilfletting</b><span>Admin-kontroll</span><small>Ny e-post + samme bosted/eiendel kan kobles til gammel eierhistorikk.</small></article>
        </div>
      </section>

      <section className={`${styles.adminUserListFull} ct-panel`}>
        <div className={styles.userArchiveTabsSplit}>
          <div className={styles.archiveTabsLeft} aria-label="Medlemskap og kundetype">
            {membershipTabs.map((item) => (
              <button key={item} type="button" onClick={() => setMembership(item)} className={membership === item ? styles.archiveTabActive : ""}>
                {membershipTabText(visibleUsers, item)}
              </button>
            ))}
          </div>
          <div className={styles.archiveTabsRight} aria-label="Statusfaner">
            {archiveTabs.map((item) => (
              <button key={item} type="button" onClick={() => setArchive(item)} className={archive === item ? styles.archiveTabActive : ""}>
                {archiveTabText(visibleUsers, item)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.adminUserTableHeaderV18}>
          <button type="button" onClick={() => handleSort("user")}>Bruker{sortMark("user")}</button>
          <button type="button" onClick={() => handleSort("customerNumber")}>Kundenummer{sortMark("customerNumber")}</button>
          <button type="button" onClick={() => handleSort("source")}>Kilde{sortMark("source")}</button>
          <button type="button" onClick={() => handleSort("status")}>Status{sortMark("status")}</button>
          <button type="button" onClick={() => handleSort("kyc")}>KYC{sortMark("kyc")}</button>
          <button type="button" onClick={() => handleSort("collection")}>Samling{sortMark("collection")}</button>
          <button type="button" onClick={() => handleSort("auction")}>Auksjon{sortMark("auction")}</button>
          <button type="button" onClick={() => handleSort("action")}>Handling{sortMark("action")}</button>
        </div>

        {filtered.map((user) => (
          <div key={user.id} className={`${styles.adminUserExpandable} ${expandedId === user.id ? styles.adminUserRowActive : ""}`}>
            <button type="button" className={styles.adminUserRowV18} onClick={() => toggleUser(user)}>
              <span className={styles.userIdentity}><b>{user.initials}</b><strong>{user.name}</strong><small>@{getUsername(user)} Â· {user.email}</small></span>
              <span><strong>{user.customerNumber}</strong><small>{user.customerCountryCode} Â· {user.customerNumberYear}</small></span>
              <span><strong>{originLabel(user.originType)}</strong><small>{user.originSource}</small></span>
              <span><em className={`${styles.statusPill} ${styles[user.status] || ""}`}>{statusLabel(user.status)}</em></span>
              <span><em className={`${styles.statusPill} ${styles[user.kyc]}`}>{kycLabel(user.kyc)}</em></span>
              <span><strong>{formatKr(user.collectionValue)}</strong><small>{user.objects} objekter</small></span>
              <span><strong>{user.auction}</strong><small>{user.shop}</small></span>
              <span><i>Ã…pne ark</i><small>Klikk for hurtigvisning</small></span>
            </button>
            {expandedId === user.id ? <ExpandedUserRow user={user} username={getUsername(user)} /> : null}
          </div>
        ))}
      </section>
    </div>
  );
}

function CreateUserPanel({ value, onChange, onCreate, onCancel }: { value: NewUserForm; onChange: (value: NewUserForm) => void; onCreate: () => void; onCancel: () => void }) {
  return (
    <section className={`${styles.createUserPanel} ct-panel`}>
      <div>
        <p className={styles.kicker}>Adminhandling</p>
        <h2>Opprett ny bruker</h2>
        <p>Demo-opprettelse i frontend. Senere skal dette kobles til <b>admin.users.create</b> og MariaDB/API med passordflyt/e-postverifisering.</p>
      </div>
      <label>Navn<input value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} placeholder="Navn" /></label>
      <label>Brukernavn<input value={value.username} onChange={(event) => onChange({ ...value, username: event.target.value })} placeholder="brukernavn" /></label>
      <label>E-post<input value={value.email} onChange={(event) => onChange({ ...value, email: event.target.value })} placeholder="epost@example.no" /></label>
      <label>Telefon<input value={value.phone} onChange={(event) => onChange({ ...value, phone: event.target.value })} placeholder="telefon" /></label>
      <label>Land<select value={value.countryCode} onChange={(event) => onChange({ ...value, countryCode: event.target.value as NewUserForm["countryCode"] })}><option>NO</option><option>SE</option><option>DK</option><option>FI</option><option>US</option></select></label>
      <label>Medlemskap<select value={value.membership} onChange={(event) => onChange({ ...value, membership: event.target.value as Membership })}><option>Free</option><option>Bronze</option><option>Silver</option><option>Gold</option><option>Platinum</option></select></label>
      <label>Kundetype<select value={value.customerType} onChange={(event) => onChange({ ...value, customerType: event.target.value as CustomerType })}><option value="customer">Kunde</option><option value="dealer">Forhandler</option></select></label>
      <label>Kilde<select value={value.originType} onChange={(event) => onChange({ ...value, originType: event.target.value as CustomerOriginType })}>{originFilters.filter((item) => item !== "Alle").map((item) => <option key={item} value={item}>{originLabel(item as CustomerOriginType)}</option>)}</select></label>
      <div className={styles.createUserActions}>
        <button type="button" className={styles.secondaryButton} onClick={onCancel}>Avbryt</button>
        <button type="button" className={styles.goldButton} data-feature-key="admin.users.create" onClick={onCreate}>Opprett bruker</button>
      </div>
    </section>
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

function ExpandedUserRow({ user, username }: { user: AdminUser; username: string }) {
  return (
    <div className={styles.expandedUserRowV20}>
      <div>
        <h3>Kontakt</h3>
        <p>@{username}</p>
        <p>{user.email}</p>
        <p>{user.phone}</p>
        <p>{user.address}</p>
        <p>{user.country} Â· {user.customerCountryCode}</p>
      </div>
      <div>
        <h3>Kundenummer</h3>
        <p><b>{user.customerNumber}</b></p>
        <p>Intern DB-ID: {user.userIdInternal}</p>
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
        <h3>FÃ¸rste aktivitet</h3>
        <p>FÃ¸rste side: {user.originFirstPage}</p>
        <p>Objektgruppe: {user.originFirstObjectGroup}</p>
        <p>Kanal: {user.originRegisteredChannel}</p>
      </div>
      <div>
        <h3>Samlergrupper</h3>
        {user.groups.length ? user.groups.map((group) => (
          <p key={group.name}><b>{group.name}</b> Â· {group.count} objekter Â· {formatKr(group.value)}</p>
        )) : <p>Ingen grupper registrert</p>}
      </div>
      <div>
        <h3>Aktivitet/support</h3>
        <p>Online i dag: {formatMinutes(user.onlineTodayMin)}</p>
        <p>Online mÃ¥ned: {formatMinutes(user.onlineMonthMin)}</p>
        <p>Mest brukt: {user.mostUsedPages[0]?.page}</p>
        <p>Support: {user.supportFlag}</p>
      </div>
      <div>
        <h3>Sletting / historikk</h3>
        <p>Valg: {user.deletionPreference}</p>
        <p>{user.ownershipHistoryPolicy}</p>
        <p>Feature: admin.users.ownership_history.preserve</p>
      </div>
      <div>
        <h3>Profilfletting</h3>
        {user.mergeCandidates.length ? user.mergeCandidates.map((candidate) => (
          <p key={candidate.userId}><b>{candidate.confidence}%</b> match mot {candidate.userId}: {candidate.reason}</p>
        )) : <p>Ingen flettingsforslag</p>}
      </div>
      <div className={styles.expandedUserActions}>
        <h3>Kundepresentasjon</h3>
        <p>Egen side med full profil, aktivitet, grafer, supportlogg, slettevalg og profilfletting.</p>
        <a href={`/admin/kunde/${encodeURIComponent(user.id)}`} className={styles.goldButton} data-feature-key="admin.customer.presentation.view">Ã…pne kundepresentasjon</a>
      </div>
    </div>
  );
}
