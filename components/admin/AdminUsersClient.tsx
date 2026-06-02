"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AdminUsersClient v20
 *
 * Definering / formål:
 * Fullbredde administrasjonsside for 20 demo-brukere med realistisk aktivitet,
 * kundekilde, kundenummer, personvern/sletteregel, eierhistorikk og profilfletting.
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
 * - admin.users.delete.request
 * - admin.users.delete.personal_data
 * - admin.users.ownership_history.preserve
 * - admin.users.merge_profiles
 * - admin.customer.presentation.view
 * - admin.customer.origin.view
 */

import { useMemo, useState } from "react";
import styles from "../landing/collectium-frontpage.module.css";
import {
  accountDeletionRule,
  allDemoUsers,
  customerNumberRule,
  formatKr,
  formatMinutes,
  type AdminUser,
  type CustomerOriginType,
  type KycStatus,
  type Membership,
  type Presence,
  type UserStatus,
} from "./collectiumDemoUsers";

const membershipTabs: Array<"Alle" | Membership | "Forhandlere"> = ["Alle", "Free", "Bronze", "Silver", "Gold", "Platinum", "Forhandlere"];
const archiveTabs: Presence[] = ["Admin", "Paalogget", "Avlogget"];
const originFilters: Array<"Alle" | CustomerOriginType> = ["Alle", "organisk", "forhandler", "auksjon", "nettbutikk", "museum", "kampanje", "admin_support", "import"];

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

export default function AdminUsersClient() {
  const [search, setSearch] = useState("");
  const [membership, setMembership] = useState<"Alle" | Membership | "Forhandlere">("Alle");
  const [status, setStatus] = useState<"Alle" | UserStatus>("Alle");
  const [kyc, setKyc] = useState<"Alle" | KycStatus>("Alle");
  const [origin, setOrigin] = useState<"Alle" | CustomerOriginType>("Alle");
  const [archive, setArchive] = useState<Presence>("Paalogget");
  const [expandedId, setExpandedId] = useState(allDemoUsers[1].id);

  const summary = useMemo(() => {
    const active = allDemoUsers.filter((u) => u.status === "active" || u.status === "suspended").length;
    const openSupport = allDemoUsers.reduce((sum, u) => sum + u.supportOpenCases, 0);
    const totalValue = allDemoUsers.reduce((sum, u) => sum + u.collectionValue, 0);
    const deleteRequests = allDemoUsers.filter((u) => u.status === "deleted_requested" || u.deletionMode !== "active").length;
    return { active, openSupport, totalValue, deleteRequests };
  }, []);

  const filtered = useMemo(() => {
    return allDemoUsers.filter((user) => {
      const textMatch = `${user.name} ${user.email} ${user.phone} ${user.id} ${user.customerNumber} ${user.originSource} ${user.address}`.toLowerCase().includes(search.toLowerCase());
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
          <p>Brukeroversikt med 20 demo-kunder, kundekilde, aktivitetsdata, sletteregel, eierhistorikk og profilfletting.</p>
        </div>
        <div className={styles.adminHeaderActions}>
          <a href="/admin" className={styles.secondaryButton}>Admin dashboard</a>
          <button className={styles.goldButton} type="button" data-feature-key="admin.users.create">Ny bruker</button>
        </div>
      </section>

      <section className={styles.adminStatsGrid}>
        <StatCard value={String(summary.active)} label="Aktive / synlige brukere" note={`${allDemoUsers.length} demo-profiler totalt`} tone="green" />
        <StatCard value={String(summary.openSupport)} label="Åpne supportindikasjoner" note="brukes av supportverktøy" tone="gold" />
        <StatCard value={String(summary.deleteRequests)} label="Slette/anonymiseringsregler" note="persondata vs eierhistorikk" tone="red" />
        <StatCard value={formatKr(summary.totalValue)} label="Samlet registrert verdi" note="demoaktivitet / samlingsdata" tone="blue" />
      </section>

      <section className={`${styles.adminFilterBarV18} ct-panel`}>
        <label>
          Søk bruker
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Navn, e-post, telefon, kundenummer, adresse eller ID" />
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
          <p className={styles.kicker}>Låst brukerregel</p>
          <h2>{accountDeletionRule.title}</h2>
          <p>{accountDeletionRule.short}</p>
        </div>
        <div className={styles.retentionRuleGrid}>
          <article><b>Kundenummer</b><span>{customerNumberRule.customer}</span><small>Eksempel {customerNumberRule.exampleCustomer}</small></article>
          <article><b>Forhandlernummer</b><span>{customerNumberRule.dealer}</span><small>Eksempel {customerNumberRule.exampleDealer}</small></article>
          <article><b>Eierhistorikk</b><span>Beholdes</span><small>Persondata kan slettes/anonymiseres uten å ødelegge proveniens.</small></article>
          <article><b>Profilfletting</b><span>Admin-kontroll</span><small>Ny e-post + samme bosted/eiendel kan kobles til gammel eierhistorikk.</small></article>
        </div>
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
                {archiveLabel(item)}
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
              <span><em className={`${styles.statusPill} ${styles[user.status] || ""}`}>{statusLabel(user.status)}</em></span>
              <span><em className={`${styles.statusPill} ${styles[user.kyc]}`}>{kycLabel(user.kyc)}</em></span>
              <span><strong>{formatKr(user.collectionValue)}</strong><small>{user.objects} objekter</small></span>
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
    <div className={styles.expandedUserRowV20}>
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
        <h3>Første aktivitet</h3>
        <p>Første side: {user.originFirstPage}</p>
        <p>Objektgruppe: {user.originFirstObjectGroup}</p>
        <p>Kanal: {user.originRegisteredChannel}</p>
      </div>
      <div>
        <h3>Samlergrupper</h3>
        {user.groups.length ? user.groups.map((group) => (
          <p key={group.name}><b>{group.name}</b> · {group.count} objekter · {formatKr(group.value)}</p>
        )) : <p>Ingen grupper registrert</p>}
      </div>
      <div>
        <h3>Aktivitet/support</h3>
        <p>Online i dag: {formatMinutes(user.onlineTodayMin)}</p>
        <p>Online måned: {formatMinutes(user.onlineMonthMin)}</p>
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
        <a href={`/admin/kunde/${encodeURIComponent(user.id)}`} className={styles.goldButton} data-feature-key="admin.customer.presentation.view">Åpne kundepresentasjon</a>
      </div>
    </div>
  );
}
