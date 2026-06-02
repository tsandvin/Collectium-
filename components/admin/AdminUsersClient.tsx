"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AdminUsersClient v16
 *
 * Definering / formål:
 * Interaktiv administrasjonsside for brukere, medlemskap, KYC, auksjonsstatus og brukerark.
 * Dette er en frontend-/preview-modul med mockdata som senere skal kobles til MariaDB/API.
 *
 * Bruksområde:
 * Brukes i innlogget adminflate /admin/brukere.
 *
 * Berørte sider / routes:
 * - /admin/brukere
 * - /admin
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.users.view
 * - admin.users.edit
 * - admin.membership.view
 * - admin.membership.edit
 * - admin.users.activity.view
 * - admin.users.security.view
 * - admin.users.kyc.view
 *
 * Berørte API-ruter senere:
 * - GET /api/admin/users/summary
 * - GET /api/admin/users/search
 * - GET /api/admin/users/[id]
 * - PATCH /api/admin/users/[id]
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI.
 */

import { useMemo, useState } from "react";
import styles from "../landing/collectium-frontpage.module.css";

type Membership = "Free" | "Bronze" | "Silver" | "Gold" | "Platinum";
type UserStatus = "active" | "suspended" | "pending";
type KycStatus = "verified" | "pending" | "not_started";

type AdminUser = {
  id: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  membership: Membership;
  kyc: KycStatus;
  collectionValue: string;
  objects: number;
  auction: string;
  lastOnline: string;
  yearlyRevenue: string;
  since: string;
};

const users: AdminUser[] = [
  {
    id: "92121216",
    initials: "OB",
    name: "Ola Berg",
    email: "ola@example.no",
    phone: "92121216",
    status: "suspended",
    membership: "Gold",
    kyc: "pending",
    collectionValue: "128 450 kr",
    objects: 247,
    auction: "3 bud",
    lastOnline: "i dag 14:28",
    yearlyRevenue: "2 490 kr",
    since: "14.02.2026",
  },
  {
    id: "10000018",
    initials: "KH",
    name: "Kari Hansen",
    email: "kari@example.no",
    phone: "10000018",
    status: "active",
    membership: "Silver",
    kyc: "verified",
    collectionValue: "42 800 kr",
    objects: 84,
    auction: "Ingen aktive",
    lastOnline: "i går 20:11",
    yearlyRevenue: "6 000 kr",
    since: "03.01.2026",
  },
  {
    id: "ADMIN-001",
    initials: "CA",
    name: "Collectium Admin",
    email: "admin@collectium.no",
    phone: "-",
    status: "active",
    membership: "Platinum",
    kyc: "verified",
    collectionValue: "0 kr",
    objects: 0,
    auction: "Admin",
    lastOnline: "nå",
    yearlyRevenue: "0 kr",
    since: "01.01.2026",
  },
  {
    id: "DEALER-01",
    initials: "DF",
    name: "Demo Forhandler",
    email: "demo.forhandler@collectium.no",
    phone: "-",
    status: "active",
    membership: "Gold",
    kyc: "verified",
    collectionValue: "0 kr",
    objects: 0,
    auction: "Auksjon aktiv",
    lastOnline: "12.05",
    yearlyRevenue: "20 000 kr",
    since: "18.02.2026",
  },
  {
    id: "BRONZE-01",
    initials: "DB",
    name: "Demo Bronsemedlem",
    email: "demo.bronse@collectium.no",
    phone: "-",
    status: "active",
    membership: "Bronze",
    kyc: "pending",
    collectionValue: "12 400 kr",
    objects: 19,
    auction: "Ingen aktive",
    lastOnline: "mandag",
    yearlyRevenue: "199 kr/mnd",
    since: "21.04.2026",
  },
];

const membershipTabs: Array<"Alle" | Membership> = ["Alle", "Free", "Bronze", "Silver", "Gold", "Platinum"];
const profileTabs = ["Profil", "Medlemskap", "Samling", "Auksjon", "Historikk", "Sikkerhet", "KYC", "Prosess", "Innstillinger", "Admin"];

function statusLabel(status: UserStatus) {
  if (status === "active") return "Aktiv";
  if (status === "suspended") return "Suspendert";
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
  const [selected, setSelected] = useState<AdminUser>(users[0]);
  const [tab, setTab] = useState("Medlemskap");

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const textMatch = `${user.name} ${user.email} ${user.phone} ${user.id}`.toLowerCase().includes(search.toLowerCase());
      const membershipMatch = membership === "Alle" || user.membership === membership;
      const statusMatch = status === "Alle" || user.status === status;
      const kycMatch = kyc === "Alle" || user.kyc === kyc;
      return textMatch && membershipMatch && statusMatch && kycMatch;
    });
  }, [search, membership, status, kyc]);

  return (
    <div className={styles.adminUsersPage}>
      <section className={styles.adminPageHeader}>
        <div>
          <p className={styles.kicker}>Admin / brukere</p>
          <h1>Brukere og medlemskap</h1>
          <p>Brukeroversikt med medlemskapsfilter, KYC, auksjon, historikk og redigering.</p>
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

      <section className={styles.adminUserWorkspace}>
        <div className={`${styles.adminUserList} ct-panel`}>
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
            <button key={user.id} type="button" className={`${styles.adminUserRow} ${selected.id === user.id ? styles.adminUserRowActive : ""}`} onClick={() => setSelected(user)}>
              <span className={styles.userIdentity}><b>{user.initials}</b><strong>{user.name}</strong><small>{user.email} / {user.id}</small></span>
              <span><em className={`${styles.statusPill} ${styles[user.status]}`}>{statusLabel(user.status)}</em></span>
              <span><em className={`${styles.statusPill} ${styles[user.kyc]}`}>{kycLabel(user.kyc)}</em></span>
              <span><strong>{user.collectionValue}</strong><small>{user.objects} objekter</small></span>
              <span><strong>{user.auction}</strong></span>
              <span><i>Åpne ark</i><small>Klikk for profilkort</small></span>
            </button>
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

function UserArchiveCard({ user, activeTab, onTabChange }: { user: AdminUser; activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <aside className={`${styles.userArchiveCard} ct-panel`}>
      <div className={styles.userArchiveTop}>
        <div className={styles.bigInitials}>{user.initials}</div>
        <div>
          <h2>{user.name}</h2>
          <p>{user.email} · {user.phone}</p>
          <p>{user.membership}-medlem · Samler sedler og mynter · KYC {kycLabel(user.kyc).toLowerCase()}</p>
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
      <InfoBox title="Medlemskapsdetaljer" value="Årlig" note="Pris, fornyelse, rabatt og prøveperiode" action="Se alle detaljer" />
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
      <InfoBox title="Feature/status" value="DB 8.4" note="Kobles mot feature_key, action_route og logg." />
      <InfoBox title="Neste steg" value="API" note="Henter data fra MariaDB i neste fase." />
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
