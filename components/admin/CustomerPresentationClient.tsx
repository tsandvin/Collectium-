"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CustomerPresentationClient v21
 *
 * Definering / formål:
 * Kundepresentasjon for support/admin med kundenummer, kundekilde/opprinnelse,
 * aktivitet, påloggingstid, mest brukte sider, samlergrupper, sletteregel,
 * eierhistorikk og profilfletting.
 *
 * Bruksområde:
 * Brukes av /admin/kunde/[userId].
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.customer.presentation.view
 * - admin.customer.origin.view
 * - admin.users.activity.view
 * - admin.users.collection.view
 * - admin.users.support.view
 * - admin.users.delete.personal_data
 * - admin.users.ownership_history.preserve
 * - admin.users.merge_profiles
 */

import PageHeader from "../ui/collectium/PageHeader";
import ContentPanel from "../ui/collectium/ContentPanel";
import InfoCard from "../ui/collectium/InfoCard";
import StatusCard from "../ui/collectium/StatusCard";
import ActionButton from "../ui/collectium/ActionButton";
import { accountDeletionRule, findDemoUser, formatKr, formatMinutes } from "./collectiumDemoUsers";

type CustomerPresentationClientProps = {
  userId: string;
};

export default function CustomerPresentationClient({ userId }: CustomerPresentationClientProps) {
  const user = findDemoUser(userId);
  const username = user.username || user.email.split("@")[0];

  return (
    <div className="ct-page">
      <PageHeader
        kicker="Admin / kundepresentasjon"
        title={user.name}
        description={`${user.customerNumber} · @${username} · {user.email} · ${user.membership}-medlem · ${user.customerType === "dealer" ? "Forhandler" : "Kunde"}`}
      >
        <a href="/admin/brukere" className="ct-btn">Til brukerliste</a>
        <ActionButton variant="gold">Opprett supportsak</ActionButton>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        <StatusCard label="Kundenummer" value={user.customerNumber} note={`Landkode ${user.customerCountryCode} · år ${user.customerNumberYear}`} tone="neutral" />
        <StatusCard label="Total samlerverdi" value={formatKr(user.collectionValue)} note={`${user.objects} objekter`} tone="gold" />
        <StatusCard label="Online i dag" value={formatMinutes(user.onlineTodayMin)} note={`${formatMinutes(user.onlineMonthMin)} siste måned`} tone="blue" />
        <StatusCard label="Supportstatus" value={user.supportOpenCases ? "Trenger oppfølging" : "OK"} note={user.supportFlag} tone={user.supportOpenCases ? "red" : "green"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" }}>
        <ContentPanel>
          <h2 className="ct-title" style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Kundeopprinnelse</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <KeyValuePair label="Kildetype" value={user.originSource} />
            <KeyValuePair label="Første side" value={user.originFirstPage} />
            <KeyValuePair label="Kampanje" value={user.originCampaign} />
            <KeyValuePair label="Første objektgruppe" value={user.originFirstObjectGroup} />
            <KeyValuePair label="Registrert kanal" value={user.originRegisteredChannel} />
            <KeyValuePair label="Brukernavn" value={`@${username}`} />
            <KeyValuePair label="Intern DB-ID" value={user.userIdInternal} />
          </div>
        </ContentPanel>

        <ContentPanel>
          <h2 className="ct-title" style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Aktivitet siste periode</h2>
          <div style={{ display: "flex", gap: "4px", alignItems: "end", height: "120px", padding: "10px", background: "rgba(0,0,0,0.02)", borderRadius: "8px", border: "1px solid var(--ct-border)", marginBottom: "12px" }} aria-label="Påloggingsgraf">
            {user.activityByDay.map((value, index) => (
              <span key={index} style={{ flex: 1, height: `${value}%`, background: "var(--ct-brand-primary)", borderRadius: "2px 2px 0 0", minHeight: "2px" }} title={`${value}%`} />
            ))}
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--ct-text-soft)", margin: 0 }}>Grafen viser online-aktivitet, og skal senere hentes fra aktivitetslogg i MariaDB.</p>
        </ContentPanel>

        <ContentPanel>
          <h2 className="ct-title" style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Mest brukte sider</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {user.mostUsedPages.map((item) => (
              <div key={item.page} style={{ display: "grid", gridTemplateColumns: "120px 1fr 40px", gap: "12px", alignItems: "center", padding: "4px 0" }}>
                <b style={{ fontSize: "0.85rem", fontWeight: "600" }}>{item.page}</b>
                <div style={{ height: "6px", background: "var(--ct-border)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.percent}%`, background: "var(--ct-brand-primary)" }} />
                </div>
                <span style={{ fontSize: "0.85rem", textAlign: "right", color: "var(--ct-text-soft)" }}>{item.percent}%</span>
              </div>
            ))}
          </div>
        </ContentPanel>

        <ContentPanel>
          <h2 className="ct-title" style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Samling og marked</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {user.groups.length ? user.groups.map((group) => (
              <KeyValuePair key={group.name} label={group.name} value={`${group.count} objekter · ${formatKr(group.value)}`} />
            )) : <KeyValuePair label="Samling" value="Ingen objekter registrert" />}
            <KeyValuePair label="Auksjon" value={user.auction} />
            <KeyValuePair label="Nettbutikk" value={user.shop} />
            <KeyValuePair label="Risiko" value={`${user.supportOpenCases} åpen supportindikasjon`} />
          </div>
        </ContentPanel>

        <ContentPanel>
          <h2 className="ct-title" style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Sletting, bevaring og eierhistorikk</h2>
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "12px" }}>
            <KeyValuePair label="Kundens valg" value={user.deletionPreference} />
            <KeyValuePair label="Profilstatus" value={user.deletionMode} />
            <KeyValuePair label="Eierhistorikk" value={user.ownershipHistoryPolicy} />
            <KeyValuePair label="Regel" value="Persondata kan slettes, men eierrekken bevares." />
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {accountDeletionRule.rules.slice(0, 4).map((rule) => (
              <li key={rule} style={{ padding: "6px 0", borderBottom: "1px solid var(--ct-border)", fontSize: "0.85rem", color: "var(--ct-text-soft)" }}>
                {rule}
              </li>
            ))}
          </ul>
        </ContentPanel>

        <ContentPanel>
          <h2 className="ct-title" style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Profilfletting</h2>
          {user.mergeCandidates.length ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {user.mergeCandidates.map((candidate) => (
                <KeyValuePair key={candidate.userId} label={`${candidate.confidence}% match`} value={`${candidate.userId} · ${candidate.reason}`} />
              ))}
              <KeyValuePair label="Adminhandling" value="Slå sammen profiler etter kontroll av e-post og eiendeler." />
            </div>
          ) : <p style={{ fontSize: "0.9rem", color: "var(--ct-text-soft)" }}>Ingen flettingsforslag for denne profilen.</p>}
        </ContentPanel>

        <ContentPanel>
          <h2 className="ct-title" style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Supportverktøy</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <KeyValuePair label="Siste feilside" value={user.mostUsedPages[0]?.page || "Ikke registrert"} />
            <KeyValuePair label="Feiltype" value={user.supportFlag} />
            <KeyValuePair label="Anbefalt hjelp" value="Bruk aktivitetslogg og mest brukte sider for å feilsøke." />
            <KeyValuePair label="Kontakt" value="Send melding / opprett supportsak" />
          </div>
        </ContentPanel>

        <ContentPanel>
          <h2 className="ct-title" style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Aktivitetslogg</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {user.activityLog.map((entry, index) => (
              <li key={`${entry}-${index}`} style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: "1px solid var(--ct-border)", fontSize: "0.85rem" }}>
                <b style={{ color: "var(--ct-brand-primary)", minWidth: "50px" }}>{index === 0 ? "Siste" : `#${index + 1}`}</b>
                <span style={{ color: "var(--ct-text)" }}>{entry}</span>
              </li>
            ))}
          </ul>
        </ContentPanel>
      </div>
    </div>
  );
}

function KeyValuePair({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 0", borderBottom: "1px solid var(--ct-border)", gap: "16px" }}>
      <span style={{ color: "var(--ct-text-soft)", fontSize: "0.88rem" }}>{label}</span>
      <strong style={{ fontSize: "0.88rem", textAlign: "right", color: "var(--ct-text)" }}>{value}</strong>
    </div>
  );
}
