"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AdminUsersClient v24
 *
 * Definering / formal:
 * Ny kontrollert admin-brukerside for Collectium. Komponenten viser brukeroversikt,
 * medlemskap, rolle, status, siste aktivitet, samlingstall, risiko, ekspanderte
 * brukerdetaljer og systemhandlinger uten side-eid visuell styling.
 *
 * Bruksomrade:
 * Brukes av /admin/brukere som klientkomponent inne i global Collectium AppShell.
 * Komponenten skal kun vise data fra API/backend og lokale empty/error/loading states.
 *
 * Berorte sider / routes:
 * - /admin/brukere
 *
 * Berorte DB-brytere / feature_keys:
 * - admin.users.view
 * - admin.users.search
 * - admin.users.detail.view
 * - admin.users.edit
 * - admin.users.disable
 * - admin.users.roles.manage
 * - admin.users.sessions.view
 * - admin.users.activity.view
 * - admin.users.collection.view
 * - admin.users.payments.view
 *
 * Berorte API-ruter:
 * - GET /api/admin/users
 * - GET /api/admin/users?search=&role=&membership=&status=
 *
 * Berorte tabeller / views:
 * - ct_users
 * - ct_user_profiles
 * - ct_memberships
 * - ct_user_roles
 * - ct_user_sessions
 * - ct_collection_items
 * - ct_user_object_states
 * - ct_collection_transactions
 * - ct_v_feature_access_resolved
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: admin.users
 * log_action: view/search/detail
 *
 * Versjon:
 * CT-FILE-ADMIN-USERS-V24.1 / CHANGE-2026-06-04-admin-users-v24.1
 *
 * Endringsregel:
 * Ingen side-eid bakgrunn, farger, border, shadow, radius eller paneldesign.
 * Visuell styling skal komme fra globale ct-komponenter og globale design tokens.
 */

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../ui/collectium/PageHeader";
import ContentPanel from "../ui/collectium/ContentPanel";
import InfoCard from "../ui/collectium/InfoCard";
import StatusCard from "../ui/collectium/StatusCard";
import ArchiveTabs from "../ui/collectium/ArchiveTabs";
import ActionButton from "../ui/collectium/ActionButton";
import DataTable from "../ui/collectium/DataTable";
import EmptyState from "../ui/collectium/EmptyState";

type UserRole = "guest" | "free" | "bronze" | "silver" | "gold" | "platinum" | "dealer" | "admin" | "superadmin";
type UserStatus = "active" | "pending" | "disabled" | "blocked" | "review";
type UserRisk = "low" | "medium" | "high" | "unknown";

type AdminUser = {
  user_id: number | string;
  customer_number?: string | null;
  username?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  role: UserRole | string;
  membership: string;
  status: UserStatus | string;
  kyc_status?: string | null;
  dealer_status?: string | null;
  collection_count?: number | null;
  wishlist_count?: number | null;
  favorite_count?: number | null;
  active_bids?: number | null;
  active_purchases?: number | null;
  active_sales?: number | null;
  estimated_collection_value?: number | null;
  objects_without_value?: number | null;
  last_login_at?: string | null;
  created_at?: string | null;
  most_used_pages?: Array<{ label: string; count: number }>;
  feature_flags?: Array<{ feature_key: string; access_state: string }>;
  notes?: string | null;
  risk?: UserRisk;
};

type ApiResponse = {
  ok?: boolean;
  data?: AdminUser[] | { users?: AdminUser[] };
  meta?: {
    total?: number;
    active?: number;
    pending?: number;
    disabled?: number;
    dealers?: number;
    admins?: number;
    collection_objects?: number;
    users_without_membership?: number;
  };
  errors?: Array<{ message?: string }>;
  message?: string;
};

type Filters = {
  query: string;
  role: string;
  membership: string;
  status: string;
};

const ROLE_TABS = [
  { key: "all", label: "Alle" },
  { key: "member", label: "Medlemmer" },
  { key: "dealer", label: "Forhandlere" },
  { key: "admin", label: "Admin" },
  { key: "review", label: "Til kontroll" },
];

const MEMBERSHIP_TABS = [
  { key: "all", label: "Alle" },
  { key: "free", label: "Free" },
  { key: "bronze", label: "Bronze" },
  { key: "silver", label: "Silver" },
  { key: "gold", label: "Gold" },
  { key: "platinum", label: "Platinum" },
];

const STATUS_TABS = [
  { key: "all", label: "Alle statuser" },
  { key: "active", label: "Aktiv" },
  { key: "pending", label: "Venter" },
  { key: "review", label: "Kontroll" },
  { key: "disabled", label: "Deaktivert" },
];

const TABLE_HEADERS = [
  "Bruker",
  "Kundenr.",
  "Rolle",
  "Medlemskap",
  "Status",
  "KYC",
  "Samling",
  "Auksjon",
  "Handling",
];

const EMPTY_FILTERS: Filters = {
  query: "",
  role: "all",
  membership: "all",
  status: "all",
};

function normalizeUsers(payload: ApiResponse): AdminUser[] {
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && "users" in payload.data && Array.isArray(payload.data.users)) return payload.data.users;
  return [];
}

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "Ikke registrert";
  return new Intl.NumberFormat("nb-NO").format(value);
}

function formatCurrency(value: number | null | undefined): string {
  if (!value || value <= 0) return "Ikke vurdert";
  return new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "Ikke registrert";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("nb-NO", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function roleLabel(role: string): string {
  const map: Record<string, string> = {
    guest: "Gjest",
    free: "Free",
    bronze: "Bronze",
    silver: "Silver",
    gold: "Gold",
    platinum: "Platinum",
    dealer: "Forhandler",
    admin: "Admin",
    superadmin: "Superadmin",
  };
  return map[role] ?? role;
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active: "Aktiv",
    pending: "Venter",
    disabled: "Deaktivert",
    blocked: "Blokkert",
    review: "Til kontroll",
  };
  return map[status] ?? status;
}

function riskLabel(risk: UserRisk | undefined): string {
  const map: Record<UserRisk, string> = {
    low: "Lav",
    medium: "Medium",
    high: "Hoy",
    unknown: "Ukjent",
  };
  return map[risk ?? "unknown"];
}

function filterUsers(users: AdminUser[], filters: Filters): AdminUser[] {
  return users.filter((user) => {
    const haystack = [user.user_id, user.customer_number, user.username, user.name, user.email, user.role, user.membership, user.status]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const queryMatch = filters.query.trim() ? haystack.includes(filters.query.trim().toLowerCase()) : true;

    const roleMatch =
      filters.role === "all" ||
      (filters.role === "member" && !["dealer", "admin", "superadmin"].includes(String(user.role))) ||
      (filters.role === "dealer" && String(user.role) === "dealer") ||
      (filters.role === "admin" && ["admin", "superadmin"].includes(String(user.role))) ||
      (filters.role === "review" && ["review", "pending"].includes(String(user.status)));

    const membershipMatch = filters.membership === "all" || String(user.membership).toLowerCase() === filters.membership;
    const statusMatch = filters.status === "all" || String(user.status) === filters.status;

    return queryMatch && roleMatch && membershipMatch && statusMatch;
  });
}

export default function AdminUsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [expandedUserId, setExpandedUserId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setErrorMessage(null);

      try {
        const params = new URLSearchParams();
        if (filters.query.trim()) params.set("search", filters.query.trim());
        if (filters.role !== "all") params.set("role", filters.role);
        if (filters.membership !== "all") params.set("membership", filters.membership);
        if (filters.status !== "all") params.set("status", filters.status);

        const response = await fetch(`/api/admin/users${params.toString() ? `?${params.toString()}` : ""}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`API svarte ${response.status}`);
        }

        const payload = (await response.json()) as ApiResponse;
        if (payload.ok === false) {
          throw new Error(payload.message ?? payload.errors?.[0]?.message ?? "API returnerte feilstatus");
        }

        if (!cancelled) setUsers(normalizeUsers(payload));
      } catch (error) {
        if (!cancelled) {
          setUsers([]);
          setErrorMessage(error instanceof Error ? error.message : "Kunne ikke hente brukere");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, [filters.query, filters.role, filters.membership, filters.status]);

  const filteredUsers = useMemo(() => filterUsers(users, filters), [users, filters]);
  const expandedUser = useMemo(() => users.find((user) => user.user_id === expandedUserId) ?? null, [users, expandedUserId]);

  const metrics = useMemo(() => {
    const active = users.filter((user) => user.status === "active").length;
    const pending = users.filter((user) => ["pending", "review"].includes(String(user.status))).length;
    const dealers = users.filter((user) => user.role === "dealer").length;
    const admins = users.filter((user) => ["admin", "superadmin"].includes(String(user.role))).length;
    const collectionObjects = users.reduce((sum, user) => sum + (user.collection_count ?? 0), 0);
    const missingValues = users.reduce((sum, user) => sum + (user.objects_without_value ?? 0), 0);

    return { active, pending, dealers, admins, collectionObjects, missingValues };
  }, [users]);

  return (
    <div className="ct-page" data-page-key="next.admin.users" data-feature-key="admin.users.view">
      <PageHeader
        kicker="Admin / brukere"
        title="Brukere og medlemskap"
        description="Kontrollert brukeroversikt koblet mot admin.users.*. Siden viser bare data fra API/backend og bruker global Collectium-design."
      >
        <ActionButton variant="secondary" data-feature-key="admin.users.search" onClick={() => setFilters(EMPTY_FILTERS)}>
          Nullstill filter
        </ActionButton>
        <ActionButton variant="primary" data-feature-key="admin.users.edit" disabled title="Krever aktiv API-action-route">
          Opprett bruker
        </ActionButton>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--ct-space-3, 12px)" }}>
        <StatusCard value={formatNumber(users.length)} label="Brukere" note="Totalt i aktivt API-utvalg" tone="blue" />
        <StatusCard value={formatNumber(metrics.active)} label="Aktive" note="status = active" tone="green" />
        <StatusCard value={formatNumber(metrics.pending)} label="Til kontroll" note="pending / review" tone="gold" />
        <StatusCard value={formatNumber(metrics.dealers)} label="Forhandlere" note="rolle = dealer" tone="blue" />
        <StatusCard value={formatNumber(metrics.admins)} label="Admin" note="admin / superadmin" tone="red" />
        <StatusCard value={formatNumber(metrics.missingValues)} label="Objekter uten verdi" note="0 kr = ikke vurdert" tone="gold" />
      </div>

      <ContentPanel>
        <div style={{ display: "grid", gap: "var(--ct-space-3, 12px)" }}>
          <InfoCard title="Sok og filter">
            <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 1fr) auto", gap: "var(--ct-space-3, 12px)", alignItems: "end" }}>
              <label className="ct-field">
                <span>Sok etter bruker, e-post, kundenummer eller rolle</span>
                <input
                  value={filters.query}
                  onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
                  placeholder="Sok i brukere"
                  aria-label="Sok i brukere"
                />
              </label>
              <ActionButton variant="secondary" data-feature-key="admin.users.search" onClick={() => setFilters((current) => ({ ...current }))}>
                Oppdater
              </ActionButton>
            </div>
          </InfoCard>

          <ArchiveTabs items={ROLE_TABS} activeKey={filters.role} onChange={(role) => setFilters((current) => ({ ...current, role }))} />
          <ArchiveTabs items={MEMBERSHIP_TABS} activeKey={filters.membership} onChange={(membership) => setFilters((current) => ({ ...current, membership }))} />
          <ArchiveTabs items={STATUS_TABS} activeKey={filters.status} onChange={(status) => setFilters((current) => ({ ...current, status }))} />
        </div>
      </ContentPanel>

      <ContentPanel>
        {loading ? (
          <EmptyState message="Henter brukere" description="Kobler til /api/admin/users via admin.users.view." />
        ) : errorMessage ? (
          <EmptyState message="Kunne ikke hente brukere" description={`${errorMessage}. Kontroller feature_key admin.users.view, API-route /api/admin/users og DB 8.4-kjeden.`} />
        ) : filteredUsers.length === 0 ? (
          <EmptyState message="Ingen brukere funnet" description="Filteret returnerte ingen brukere. Nullstill filter eller kontroller API-datakilden." />
        ) : (
          <DataTable headers={TABLE_HEADERS}>
            {filteredUsers.map((user) => {
              const isExpanded = expandedUserId === user.user_id;
              return (
                <div key={user.user_id} className="ct-data-table-row" data-user-id={String(user.user_id)}>
                  <div className="ct-data-table-cell">
                    <strong>{user.name || user.username || "Navn mangler"}</strong>
                    <span>{user.email || "E-post mangler"}</span>
                  </div>
                  <div className="ct-data-table-cell">{user.customer_number || String(user.user_id)}</div>
                  <div className="ct-data-table-cell">{roleLabel(String(user.role))}</div>
                  <div className="ct-data-table-cell">{user.membership || "Ikke satt"}</div>
                  <div className="ct-data-table-cell">{statusLabel(String(user.status))}</div>
                  <div className="ct-data-table-cell">{user.kyc_status || "Ikke kontrollert"}</div>
                  <div className="ct-data-table-cell">{formatNumber(user.collection_count)}</div>
                  <div className="ct-data-table-cell">{formatNumber(user.active_bids)}</div>
                  <div className="ct-data-table-cell">
                    <ActionButton
                      variant="secondary"
                      data-feature-key="admin.users.detail.view"
                      onClick={() => setExpandedUserId(isExpanded ? null : user.user_id)}
                    >
                      {isExpanded ? "Lukk" : "Apne"}
                    </ActionButton>
                  </div>

                  {isExpanded ? (
                    <div className="ct-data-table-expanded" style={{ gridColumn: "1 / -1" }}>
                      <ExpandedUserPanel user={user} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </DataTable>
        )}
      </ContentPanel>

      {expandedUser ? (
        <ContentPanel>
          <InfoCard title="Aktive kontrollhandlinger">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ct-space-2, 8px)" }}>
              <ActionButton variant="secondary" data-feature-key="admin.users.sessions.view" disabled>
                Se sesjoner
              </ActionButton>
              <ActionButton variant="secondary" data-feature-key="admin.users.activity.view" disabled>
                Se aktivitet
              </ActionButton>
              <ActionButton variant="secondary" data-feature-key="admin.users.collection.view" disabled>
                Se samling
              </ActionButton>
              <ActionButton variant="secondary" data-feature-key="admin.users.payments.view" disabled>
                Se betalinger
              </ActionButton>
              <ActionButton variant="secondary" data-feature-key="admin.users.roles.manage" disabled>
                Endre rolle
              </ActionButton>
              <ActionButton variant="secondary" data-feature-key="admin.users.disable" disabled>
                Deaktiver
              </ActionButton>
            </div>
            <p className="ct-description">
              Handlingene er bevisst deaktivert til action-routes, access state og write_table er verifisert i DB 8.4.
            </p>
          </InfoCard>
        </ContentPanel>
      ) : null}
    </div>
  );
}

function ExpandedUserPanel({ user }: { user: AdminUser }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--ct-space-3, 12px)" }}>
      <InfoCard title="Profil">
        <KeyValue label="Brukernavn" value={user.username || "Ikke registrert"} />
        <KeyValue label="Telefon" value={user.phone || "Ikke registrert"} />
        <KeyValue label="Land" value={user.country || "Ikke registrert"} />
        <KeyValue label="Opprettet" value={formatDate(user.created_at)} />
        <KeyValue label="Siste innlogging" value={formatDate(user.last_login_at)} />
      </InfoCard>

      <InfoCard title="Samlerstatus">
        <KeyValue label="Objekter" value={formatNumber(user.collection_count)} />
        <KeyValue label="Onskeliste" value={formatNumber(user.wishlist_count)} />
        <KeyValue label="Favoritter" value={formatNumber(user.favorite_count)} />
        <KeyValue label="Estimert verdi" value={formatCurrency(user.estimated_collection_value)} />
        <KeyValue label="Uten verdi" value={formatNumber(user.objects_without_value)} />
      </InfoCard>

      <InfoCard title="Marked og prosess">
        <KeyValue label="Aktive bud" value={formatNumber(user.active_bids)} />
        <KeyValue label="Aktive kjop" value={formatNumber(user.active_purchases)} />
        <KeyValue label="Aktive salg" value={formatNumber(user.active_sales)} />
        <KeyValue label="Forhandlerstatus" value={user.dealer_status || "Ikke forhandler"} />
        <KeyValue label="Risiko" value={riskLabel(user.risk)} />
      </InfoCard>

      <InfoCard title="Mest brukte sider">
        {user.most_used_pages?.length ? (
          user.most_used_pages.map((page) => <KeyValue key={page.label} label={page.label} value={formatNumber(page.count)} />)
        ) : (
          <p className="ct-description">Ingen aktivitetsdata registrert.</p>
        )}
      </InfoCard>

      <InfoCard title="Feature/access">
        {user.feature_flags?.length ? (
          user.feature_flags.map((feature) => <KeyValue key={feature.feature_key} label={feature.feature_key} value={feature.access_state} />)
        ) : (
          <p className="ct-description">Feature state hentes ikke i denne responsen.</p>
        )}
      </InfoCard>

      <InfoCard title="Adminnotat">
        <p className="ct-description">{user.notes || "Ingen adminnotater registrert."}</p>
      </InfoCard>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="ct-key-value">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
