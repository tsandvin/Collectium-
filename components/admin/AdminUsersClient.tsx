
"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AdminUsersClient v21
 *
 * Definering / formål:
 * Fullbredde administrasjonsside for kunder, medlemmer og forhandlere med
 * sortering, arkivfaner, resultatvolum, demoaktivitet, brukernavn, ny bruker-
 * opprettelse, kundekilde, kundenummer, slette-/bevaringsregel og
 * profilfletting. Dette er frontend-/previewlag som senere skal kobles til
 * MariaDB/API og DB 8.4 action-routes.
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
import PageHeader from "../ui/collectium/PageHeader";
import ContentPanel from "../ui/collectium/ContentPanel";
import InfoCard from "../ui/collectium/InfoCard";
import StatusCard from "../ui/collectium/StatusCard";
import ArchiveTabs from "../ui/collectium/ArchiveTabs";
import ActionButton from "../ui/collectium/ActionButton";
import DataTable from "../ui/collectium/DataTable";
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
  if (tab === "Paalogget") return "Påloggede";
  if (tab === "Avlogget") return "Avloggede";
  return "Admin";
}

function getUsername(user: AdminUser) {
  return user.username || user.email.split("@")[0] || user.name.toLowerCase().replace(/\s+/g, ".");
}

function isNewUser(user: AdminUser) {
  // Demo-regel: lave/jevne sekvenser er markert som nye i dag for å vise fanetall.
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

  return (
    <span className={styles.adminTabLabelWrap}>
      <span className={styles.adminTabLabelMain}>{tab} {scoped.length}</span>
      <span className={styles.adminTabLabelMeta}>
        NY <span>{newCount}</span> / i går <span>{yesterdayCount}</span>
      </span>
    </span>
  );
}

function archiveTabText(users: AdminUser[], tab: Presence) {
  const scoped = users.filter((user) => tab === "Admin" ? user.presence === "Admin" || user.membership === "Platinum" : user.presence === tab);
  const newCount = scoped.filter(isNewUser).length;

  return (
    <span className={styles.adminTabLabelWrap}>
      <span className={styles.adminTabLabelMain}>{archiveLabel(tab)} {scoped.length}</span>
      <span className={styles.adminTabLabelMeta}>
        NY <span>{newCount}</span>
      </span>
    </span>
  );
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
        supportFlag: "Demo-tilgang er stoppet av admin. Brukeren kan ikke brukes til innlogging/testtilgang før demo-tilgang åpnes igjen.",
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
    return sortDirection === "asc" ? " ↑" : " ↓";
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
    <div className="ct-page">
      <PageHeader kicker="Admin / brukere" title="Brukere og medlemskap" description="Brukeroversikt med demo-kunder, brukernavn, kundekilde, aktivitetsdata, sletteregel, eierhistorikk og profilfletting.">
        <a href="/admin" className="ct-btn">Admin dashboard</a>
        <ActionButton variant="gold" data-feature-key="admin.users.create" onClick={() => setCreateOpen((open) => !open)}>
          Opprett ny bruker
        </ActionButton>
        <button
          type="button"
          className={`ct-btn ${demoAccessPaused ? "" : "ct-btn-gold"}`}
          data-feature-key="admin.demo_users.access.toggle"
          title={demoAccessPaused ? "Demo-brukere er stoppet. Klikk for å åpne demo-tilgang igjen." : "Stopper alle demo-brukere fra å brukes som testtilgang. Admin/superadmin beholdes."}
          aria-label={demoAccessPaused ? "Demo-brukere er stoppet. Åpne demo-tilgang igjen." : "Stopp demo-brukere fra testtilgang."}
          onClick={() => updateDemoAccessPaused(!demoAccessPaused)}
        >
          {demoAccessPaused ? "Åpne demo-tilgang" : "Stopp demo-brukere"}
        </button>
      </PageHeader>

      {createOpen ? <CreateUserPanel value={newUser} onChange={setNewUser} onCreate={createUser} onCancel={() => setCreateOpen(false)} /> : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        <StatusCard value={String(resultSummary.totalUsers)} label="Brukere i resultatet" note={membership === "Alle" ? "Total i valgt arkiv/status" : `Kun ${membership}`} tone="green" />
        <StatusCard value={String(resultSummary.objects)} label="Samleobjekter" note="sum i filtrert brukerresultat" tone="gold" />
        <StatusCard value={formatKr(resultSummary.value)} label="Estimert samlerverdi" note="sum for valgte brukere" tone="blue" />
        <StatusCard value={formatMinutes(resultSummary.online)} label="Online i dag" note={`${resultSummary.support} supportindikasjoner · ${resultSummary.auctions} med auksjonsaktivitet`} tone="red" />
      </div>

      <ContentPanel style={{ display: "grid", gap: "12px", gridTemplateColumns: "minmax(240px, 2fr) repeat(3, minmax(140px, 1fr)) auto", alignItems: "end", marginBottom: "20px" }}>
        <label className="ct-field">
          <span className="ct-label">Søk bruker</span>
          <input className="ct-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Navn, brukernavn, e-post, kundenummer..." />
        </label>
        <label className="ct-field">
          <span className="ct-label">Status</span>
          <select className="ct-select" value={status} onChange={(event) => setStatus(event.target.value as any)}>
            <option>Alle</option>
            <option value="active">Aktiv</option>
            <option value="suspended">Suspendert</option>
            <option value="pending">Venter</option>
            <option value="offline">Avlogget</option>
            <option value="deleted_requested">Sletting forespurt</option>
            <option value="anonymized">Anonymisert</option>
          </select>
        </label>
        <label className="ct-field">
          <span className="ct-label">KYC</span>
          <select className="ct-select" value={kyc} onChange={(event) => setKyc(event.target.value as any)}>
            <option>Alle</option>
            <option value="verified">Verifisert</option>
            <option value="pending">Venter</option>
            <option value="not_started">Ikke startet</option>
          </select>
        </label>
        <label className="ct-field">
          <span className="ct-label">Kundekilde</span>
          <select className="ct-select" value={origin} onChange={(event) => setOrigin(event.target.value as any)}>
            {originFilters.map((item) => <option key={item} value={item}>{item === "Alle" ? "Alle" : originLabel(item)}</option>)}
          </select>
        </label>
        <ActionButton variant="gold" type="button">Filtrer</ActionButton>
      </ContentPanel>

      <ContentPanel style={{ marginBottom: "20px" }}>
        <p className="ct-kicker">Låst brukerregel</p>
        <h2 className="ct-title" style={{ fontSize: "1.3rem", marginBottom: "12px" }}>{accountDeletionRule.title}</h2>
        <p className="ct-description" style={{ marginBottom: "16px" }}>{accountDeletionRule.short}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <InfoCard title="Kundenummer">
            <span style={{ fontSize: "1.1rem", fontWeight: "bold", display: "block" }}>{customerNumberRule.customer}</span>
            <small style={{ color: "var(--ct-text-muted)" }}>Eksempel {customerNumberRule.exampleCustomer}</small>
          </InfoCard>
          <InfoCard title="Forhandlernummer">
            <span style={{ fontSize: "1.1rem", fontWeight: "bold", display: "block" }}>{customerNumberRule.dealer}</span>
            <small style={{ color: "var(--ct-text-muted)" }}>Eksempel {customerNumberRule.exampleDealer}</small>
          </InfoCard>
          <InfoCard title="Eierhistorikk">
            <span>Beholdes</span>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "var(--ct-text-soft)" }}>Persondata kan slettes/anonymiseres uten å ødelegge proveniens.</p>
          </InfoCard>
          <InfoCard title="Profilfletting">
            <span>Admin-kontroll</span>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "var(--ct-text-soft)" }}>Ny e-post + samme bosted/eiendel kan kobles til gammel eierhistorikk.</p>
          </InfoCard>
        </div>
      </ContentPanel>

      <ContentPanel>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", borderBottom: "1px solid var(--ct-border-strong)", marginBottom: "12px" }}>
          <ArchiveTabs
            items={membershipTabs.map((tab) => ({ key: tab, label: membershipTabText(visibleUsers, tab) }))}
            activeKey={membership}
            onChange={(key) => setMembership(key as any)}
            className="ct-archive-tabs"
            style={{ borderBottom: 0, marginBottom: 0 }}
          />
          <ArchiveTabs
            items={archiveTabs.map((tab) => ({ key: tab, label: archiveTabText(visibleUsers, tab) }))}
            activeKey={archive}
            onChange={(key) => setArchive(key as any)}
            className="ct-archive-tabs"
            style={{ borderBottom: 0, marginBottom: 0 }}
          />
        </div>

        <DataTable
          headers={[
            <button key="user" type="button" style={{ background: "none", border: 0, color: "inherit", font: "inherit", fontWeight: "inherit", cursor: "pointer", textTransform: "inherit" }} onClick={() => handleSort("user")}>Bruker{sortMark("user")}</button>,
            <button key="num" type="button" style={{ background: "none", border: 0, color: "inherit", font: "inherit", fontWeight: "inherit", cursor: "pointer", textTransform: "inherit" }} onClick={() => handleSort("customerNumber")}>Kundenummer{sortMark("customerNumber")}</button>,
            <button key="src" type="button" style={{ background: "none", border: 0, color: "inherit", font: "inherit", fontWeight: "inherit", cursor: "pointer", textTransform: "inherit" }} onClick={() => handleSort("source")}>Kilde{sortMark("source")}</button>,
            <button key="status" type="button" style={{ background: "none", border: 0, color: "inherit", font: "inherit", fontWeight: "inherit", cursor: "pointer", textTransform: "inherit" }} onClick={() => handleSort("status")}>Status{sortMark("status")}</button>,
            <button key="kyc" type="button" style={{ background: "none", border: 0, color: "inherit", font: "inherit", fontWeight: "inherit", cursor: "pointer", textTransform: "inherit" }} onClick={() => handleSort("kyc")}>KYC{sortMark("kyc")}</button>,
            <button key="coll" type="button" style={{ background: "none", border: 0, color: "inherit", font: "inherit", fontWeight: "inherit", cursor: "pointer", textTransform: "inherit" }} onClick={() => handleSort("collection")}>Samling{sortMark("collection")}</button>,
            <button key="auc" type="button" style={{ background: "none", border: 0, color: "inherit", font: "inherit", fontWeight: "inherit", cursor: "pointer", textTransform: "inherit" }} onClick={() => handleSort("auction")}>Auksjon{sortMark("auction")}</button>,
            <button key="act" type="button" style={{ background: "none", border: 0, color: "inherit", font: "inherit", fontWeight: "inherit", cursor: "pointer", textTransform: "inherit" }} onClick={() => handleSort("action")}>Handling{sortMark("action")}</button>
          ]}
          className="ct-user-table"
          style={{ display: "grid", gridTemplateColumns: "minmax(210px, 1.5fr) minmax(150px, 1fr) minmax(150px, 1fr) 0.75fr 0.75fr 0.85fr 0.9fr 0.8fr" }}
        >
          {filtered.map((user) => (
            <div key={user.id} className={`ct-user-expandable-row ${expandedId === user.id ? "active" : ""}`} style={{ borderBottom: "1px solid var(--ct-border)" }}>
              <button
                type="button"
                className="ct-btn"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(210px, 1.5fr) minmax(150px, 1fr) minmax(150px, 1fr) 0.75fr 0.75fr 0.85fr 0.9fr 0.8fr",
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: 0,
                  borderRadius: 0,
                  minHeight: "76px",
                  padding: "12px 16px"
                }}
                onClick={() => toggleUser(user)}
              >
                <span className={styles.userIdentity}><b>{user.initials}</b><strong>{user.name}</strong><small>@{getUsername(user)} · {user.email}</small></span>
                <span><strong>{user.customerNumber}</strong><small>{user.customerCountryCode} · {user.customerNumberYear}</small></span>
                <span><strong>{originLabel(user.originType)}</strong><small>{user.originSource}</small></span>
                <span><em className={`${styles.statusPill} ${styles[user.status] || ""}`}>{statusLabel(user.status)}</em></span>
                <span><em className={`${styles.statusPill} ${styles[user.kyc]}`}>{kycLabel(user.kyc)}</em></span>
                <span><strong>{formatKr(user.collectionValue)}</strong><small>{user.objects} objekter</small></span>
                <span><strong>{user.auction}</strong><small>{user.shop}</small></span>
                <span><i>Åpne ark</i><small>Klikk for hurtigvisning</small></span>
              </button>
              {expandedId === user.id ? <ExpandedUserRow user={user} username={getUsername(user)} /> : null}
            </div>
          ))}
        </DataTable>
      </ContentPanel>
    </div>
  );
}

function CreateUserPanel({ value, onChange, onCreate, onCancel }: { value: NewUserForm; onChange: (value: NewUserForm) => void; onCreate: () => void; onCancel: () => void }) {
  return (
    <ContentPanel style={{ marginBottom: "20px" }}>
      <div>
        <p className="ct-kicker">Adminhandling</p>
        <h2 className="ct-title" style={{ fontSize: "1.3rem" }}>Opprett ny bruker</h2>
        <p className="ct-description">Demo-opprettelse i frontend. Senere skal dette kobles til <b>admin.users.create</b> og MariaDB/API med passordflyt/e-postverifisering.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginTop: "12px", width: "100%" }}>
        <label className="ct-field"><span className="ct-label">Navn</span><input className="ct-input" value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} placeholder="Navn" /></label>
        <label className="ct-field"><span className="ct-label">Brukernavn</span><input className="ct-input" value={value.username} onChange={(event) => onChange({ ...value, username: event.target.value })} placeholder="brukernavn" /></label>
        <label className="ct-field"><span className="ct-label">E-post</span><input className="ct-input" value={value.email} onChange={(event) => onChange({ ...value, email: event.target.value })} placeholder="epost@example.no" /></label>
        <label className="ct-field"><span className="ct-label">Telefon</span><input className="ct-input" value={value.phone} onChange={(event) => onChange({ ...value, phone: event.target.value })} placeholder="telefon" /></label>
        <label className="ct-field"><span className="ct-label">Land</span><select className="ct-select" value={value.countryCode} onChange={(event) => onChange({ ...value, countryCode: event.target.value as any })}><option>NO</option><option>SE</option><option>DK</option><option>FI</option><option>US</option></select></label>
        <label className="ct-field"><span className="ct-label">Medlemskap</span><select className="ct-select" value={value.membership} onChange={(event) => onChange({ ...value, membership: event.target.value as any })}><option>Free</option><option>Bronze</option><option>Silver</option><option>Gold</option><option>Platinum</option></select></label>
        <label className="ct-field"><span className="ct-label">Kundetype</span><select className="ct-select" value={value.customerType} onChange={(event) => onChange({ ...value, customerType: event.target.value as any })}><option value="customer">Kunde</option><option value="dealer">Forhandler</option></select></label>
        <label className="ct-field"><span className="ct-label">Kilde</span><select className="ct-select" value={value.originType} onChange={(event) => onChange({ ...value, originType: event.target.value as any })}>{originFilters.filter((item) => item !== "Alle").map((item) => <option key={item} value={item}>{originLabel(item as any)}</option>)}</select></label>
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <ActionButton onClick={onCancel}>Avbryt</ActionButton>
        <ActionButton variant="gold" data-feature-key="admin.users.create" onClick={onCreate}>Opprett bruker</ActionButton>
      </div>
    </ContentPanel>
  );
}

function ExpandedUserRow({ user, username }: { user: AdminUser; username: string }) {
  return (
    <div style={{ padding: "18px", background: "color-mix(in srgb, var(--ct-panel-solid) 92%, transparent)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", borderBottom: "1px solid var(--ct-border)" }}>
      <InfoCard title="Kontakt">
        <p style={{ margin: "2px 0" }}>@{username}</p>
        <p style={{ margin: "2px 0" }}>{user.email}</p>
        <p style={{ margin: "2px 0" }}>{user.phone}</p>
        <p style={{ margin: "2px 0" }}>{user.address}</p>
        <p style={{ margin: "2px 0" }}>{user.country} · {user.customerCountryCode}</p>
      </InfoCard>
      <InfoCard title="Kundenummer">
        <p style={{ margin: "2px 0" }}><b>{user.customerNumber}</b></p>
        <p style={{ margin: "2px 0" }}>Intern DB-ID: {user.userIdInternal}</p>
        <p style={{ margin: "2px 0" }}>Sekvens: {String(user.customerNumberSequence).padStart(6, "0")}</p>
      </InfoCard>
      <InfoCard title="Kundekilde">
        <p style={{ margin: "2px 0" }}>{user.originSource}</p>
        <p style={{ margin: "2px 0" }}>Referrer: {user.originReferrer}</p>
        <p style={{ margin: "2px 0" }}>Kampanje: {user.originCampaign}</p>
        {user.originDealerId ? <p style={{ margin: "2px 0" }}>Forhandler: {user.originDealerId}</p> : null}
      </InfoCard>
      <InfoCard title="Første aktivitet">
        <p style={{ margin: "2px 0" }}>Første side: {user.originFirstPage}</p>
        <p style={{ margin: "2px 0" }}>Objektgruppe: {user.originFirstObjectGroup}</p>
        <p style={{ margin: "2px 0" }}>Kanal: {user.originRegisteredChannel}</p>
      </InfoCard>
      <InfoCard title="Samlergrupper">
        {user.groups.length ? user.groups.map((group) => (
          <p key={group.name} style={{ margin: "2px 0" }}><b>{group.name}</b> · {group.count} objekter · {formatKr(group.value)}</p>
        )) : <p style={{ margin: "2px 0" }}>Ingen grupper registrert</p>}
      </InfoCard>
      <InfoCard title="Aktivitet/support">
        <p style={{ margin: "2px 0" }}>Online i dag: {formatMinutes(user.onlineTodayMin)}</p>
        <p style={{ margin: "2px 0" }}>Online måned: {formatMinutes(user.onlineMonthMin)}</p>
        <p style={{ margin: "2px 0" }}>Mest brukt: {user.mostUsedPages[0]?.page}</p>
        <p style={{ margin: "2px 0" }}>Support: {user.supportFlag}</p>
      </InfoCard>
      <InfoCard title="Sletting / historikk">
        <p style={{ margin: "2px 0" }}>Valg: {user.deletionPreference}</p>
        <p style={{ margin: "2px 0" }}>{user.ownershipHistoryPolicy}</p>
        <p style={{ margin: "2px 0" }}>Feature: admin.users.ownership_history.preserve</p>
      </InfoCard>
      <InfoCard title="Profilfletting">
        {user.mergeCandidates.length ? user.mergeCandidates.map((candidate) => (
          <p key={candidate.userId} style={{ margin: "2px 0" }}><b>{candidate.confidence}% match</b> {candidate.reason}</p>
        )) : <p style={{ margin: "2px 0" }}>Ingen flettingsforslag</p>}
      </InfoCard>
      <InfoCard title="Kundepresentasjon">
        <p style={{ margin: "0 0 12px 0" }}>Egen side med full profil, aktivitet, grafer, supportlogg, slettevalg og profilfletting.</p>
        <a href={`/admin/kunde/${encodeURIComponent(user.id)}`} className="ct-btn ct-btn-gold" data-feature-key="admin.customer.presentation.view">Åpne kundepresentasjon</a>
      </InfoCard>
    </div>
  );
}
