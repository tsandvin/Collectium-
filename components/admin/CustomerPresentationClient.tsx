"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CustomerPresentationClient v20
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

import styles from "../landing/collectium-frontpage.module.css";
import { accountDeletionRule, findDemoUser, formatKr, formatMinutes } from "./collectiumDemoUsers";

type CustomerPresentationClientProps = {
  userId: string;
};

export default function CustomerPresentationClient({ userId }: CustomerPresentationClientProps) {
  const user = findDemoUser(userId);
  const username = user.username || user.email.split("@")[0];

  return (
    <div className={styles.customerPage}>
      <section className={`${styles.customerHero} ct-panel`}>
        <div>
          <p className={styles.kicker}>Admin / kundepresentasjon</p>
          <h1>{user.name}</h1>
          <p>{user.customerNumber} · @{username} · {user.email} · {user.membership}-medlem · {user.customerType === "dealer" ? "Forhandler" : "Kunde"}</p>
        </div>
        <div className={styles.customerHeroActions}>
          <a href="/admin/brukere" className={styles.secondaryButton}>Til brukerliste</a>
          <button type="button" className={styles.goldButton}>Opprett supportsak</button>
        </div>
      </section>

      <section className={styles.customerMetricGrid}>
        <article className="ct-card"><span>Kundenummer</span><strong>{user.customerNumber}</strong><small>Landkode {user.customerCountryCode} · år {user.customerNumberYear}</small></article>
        <article className="ct-card"><span>Total samlerverdi</span><strong>{formatKr(user.collectionValue)}</strong><small>{user.objects} objekter</small></article>
        <article className="ct-card"><span>Online i dag</span><strong>{formatMinutes(user.onlineTodayMin)}</strong><small>{formatMinutes(user.onlineMonthMin)} siste måned</small></article>
        <article className="ct-card"><span>Supportstatus</span><strong>{user.supportOpenCases ? "Trenger oppfølging" : "OK"}</strong><small>{user.supportFlag}</small></article>
      </section>

      <section className={styles.customerWorkspace}>
        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Kundeopprinnelse</h2>
          <div className={styles.customerListGrid}>
            <p><b>Kildetype</b><span>{user.originSource}</span></p>
            <p><b>Første side</b><span>{user.originFirstPage}</span></p>
            <p><b>Kampanje</b><span>{user.originCampaign}</span></p>
            <p><b>Første objektgruppe</b><span>{user.originFirstObjectGroup}</span></p>
            <p><b>Registrert kanal</b><span>{user.originRegisteredChannel}</span></p>
            <p><b>Brukernavn</b><span>@{username}</span></p>
            <p><b>Intern DB-ID</b><span>{user.userIdInternal}</span></p>
          </div>
        </div>

        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Aktivitet siste periode</h2>
          <div className={styles.activityGraph} aria-label="Påloggingsgraf">
            {user.activityByDay.map((value, index) => (
              <span key={index} style={{ height: `${value}%` }} title={`${value}%`} />
            ))}
          </div>
          <p>Grafen viser online-aktivitet, og skal senere hentes fra aktivitetslogg i MariaDB.</p>
        </div>

        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Mest brukte sider</h2>
          {user.mostUsedPages.map((item) => (
            <div className={styles.pageUseRow} key={item.page}>
              <b>{item.page}</b>
              <span><i style={{ width: `${item.percent}%` }} /></span>
              <em>{item.percent}%</em>
            </div>
          ))}
        </div>

        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Samling og marked</h2>
          <div className={styles.customerListGrid}>
            {user.groups.length ? user.groups.map((group) => (
              <p key={group.name}><b>{group.name}</b><span>{group.count} objekter · {formatKr(group.value)}</span></p>
            )) : <p><b>Samling</b><span>Ingen objekter registrert</span></p>}
            <p><b>Auksjon</b><span>{user.auction}</span></p>
            <p><b>Nettbutikk</b><span>{user.shop}</span></p>
            <p><b>Risiko</b><span>{user.supportOpenCases} åpen supportindikasjon</span></p>
          </div>
        </div>

        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Sletting, bevaring og eierhistorikk</h2>
          <div className={styles.customerListGrid}>
            <p><b>Kundens valg</b><span>{user.deletionPreference}</span></p>
            <p><b>Profilstatus</b><span>{user.deletionMode}</span></p>
            <p><b>Eierhistorikk</b><span>{user.ownershipHistoryPolicy}</span></p>
            <p><b>Regel</b><span>Persondata kan slettes, men objektets eierrekke bevares.</span></p>
          </div>
          <ul className={styles.activityLog}>
            {accountDeletionRule.rules.slice(0, 4).map((rule) => <li key={rule}><b>Regel</b><span>{rule}</span></li>)}
          </ul>
        </div>

        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Profilfletting</h2>
          {user.mergeCandidates.length ? (
            <div className={styles.customerListGrid}>
              {user.mergeCandidates.map((candidate) => (
                <p key={candidate.userId}><b>{candidate.confidence}% match</b><span>{candidate.userId} · {candidate.reason}</span></p>
              ))}
              <p><b>Adminhandling</b><span>Slå sammen profiler etter kontroll av e-post, navn, bosted og samme eiendeler.</span></p>
            </div>
          ) : <p>Ingen flettingsforslag for denne profilen.</p>}
        </div>

        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Supportverktøy</h2>
          <div className={styles.customerListGrid}>
            <p><b>Siste feilside</b><span>{user.mostUsedPages[0]?.page || "Ikke registrert"}</span></p>
            <p><b>Feiltype</b><span>{user.supportFlag}</span></p>
            <p><b>Anbefalt hjelp</b><span>Bruk aktivitetslogg og mest brukte sider for å finne problemområde.</span></p>
            <p><b>Kontakt</b><span>Send melding / opprett supportsak</span></p>
          </div>
        </div>

        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Aktivitetslogg</h2>
          <ul className={styles.activityLog}>
            {user.activityLog.map((entry, index) => (
              <li key={`${entry}-${index}`}><b>{index === 0 ? "Siste" : `#${index + 1}`}</b><span>{entry}</span></li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
