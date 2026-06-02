/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * AdminUserSearchInsightRow
 *
 * Definering / formål:
 * Ekstra boksrad for admin/brukere som viser søk, sortering, samling, type,
 * medlemsfordeling og utvikling fra forrige måned.
 *
 * Bruksområde:
 * Importeres i components/admin/AdminUsersClient.tsx eller app/admin/brukere/page.tsx.
 *
 * Berørte sider / routes:
 * - /admin/brukere
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.users.view
 * - admin.users.activity.view
 *
 * Dataretning:
 * Demo-data -> React UI. Skal senere erstattes av MariaDB/API.
 */

import {
  adminUserSearchSummary,
  formatKr,
  type Membership,
} from "./collectiumDemoUsers";

const membershipOrder: Membership[] = ["Free", "Bronze", "Silver", "Gold", "Platinum"];

export function AdminUserSearchInsightRow() {
  const summary = adminUserSearchSummary;

  return (
    <section className="ct-admin-user-insight-row" aria-label="Brukersøk og medlemsutvikling">
      <article className="ct-admin-user-insight-card ct-admin-user-insight-card--wide">
        <span className="ct-admin-user-insight-label">Søk / sortering</span>
        <strong>{summary.visibleUsers} synlige</strong>
        <p>
          {summary.totalUsers} profiler totalt · {summary.totalObjects} objekter ·{" "}
          {summary.totalGroups} samlingsgrupper
        </p>
      </article>

      <article className="ct-admin-user-insight-card">
        <span className="ct-admin-user-insight-label">Samling</span>
        <strong>{formatKr(summary.totalCollectionValue)}</strong>
        <p>registrert demo-/samlingsverdi</p>
      </article>

      <article className="ct-admin-user-insight-card">
        <span className="ct-admin-user-insight-label">Type</span>
        <strong>{summary.customerTypeCounts.customer} kunder</strong>
        <p>{summary.customerTypeCounts.dealer} forhandlerprofiler</p>
      </article>

      <article className="ct-admin-user-insight-card">
        <span className="ct-admin-user-insight-label">Styrte testprofiler</span>
        <strong>{summary.controlledOrganicBots}</strong>
        <p>organiske bot-profiler tester normal bruk</p>
      </article>

      {membershipOrder.map((membership) => (
        <article key={membership} className="ct-admin-user-insight-card ct-admin-user-insight-card--small">
          <span className="ct-admin-user-insight-label">Nye {membership}</span>
          <strong>{summary.membershipCounts[membership]}</strong>
          <p>
            {membership === "Free"
              ? "gratis / start"
              : membership === "Bronze"
                ? "lav inngang"
                : membership === "Silver"
                  ? "aktiv samler"
                  : membership === "Gold"
                    ? "proff/forhandler"
                    : "full tilgang"}
          </p>
        </article>
      ))}

      <article className="ct-admin-user-insight-card ct-admin-user-insight-card--growth">
        <span className="ct-admin-user-insight-label">Utvikling fra forrige mnd</span>
        <strong>+{summary.monthDevelopment.percentChange}%</strong>
        <p>
          {summary.monthDevelopment.newMembersThisMonth} nye nå mot{" "}
          {summary.monthDevelopment.newMembersPreviousMonth} forrige måned
        </p>
      </article>
    </section>
  );
}
