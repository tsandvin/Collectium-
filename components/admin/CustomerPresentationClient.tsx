"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CustomerPresentationClient v17
 *
 * Definering / formål:
 * Kundepresentasjon for support/admin med aktivitet, påloggingstid, mest brukte sider,
 * samling, auksjon, nettbutikkstatus og aktivitetslogg. Dette er en egen dypere side
 * for valgt kunde.
 *
 * Bruksområde:
 * Brukes av /admin/kunde/[userId].
 *
 * Berørte DB-brytere / feature_keys:
 * - admin.customer.presentation.view
 * - admin.users.activity.view
 * - admin.users.collection.view
 * - admin.users.support.view
 */

import styles from "../landing/collectium-frontpage.module.css";

type CustomerPresentationClientProps = {
  userId: string;
};

const pageUse = [
  { page: "Katalog", value: 42 },
  { page: "Min samling", value: 28 },
  { page: "Auksjon", value: 18 },
  { page: "Index", value: 12 },
];

const loginGraph = [34, 52, 28, 65, 44, 78, 61, 88, 42, 70, 55, 92];

export default function CustomerPresentationClient({ userId }: CustomerPresentationClientProps) {
  return (
    <div className={styles.customerPage}>
      <section className={`${styles.customerHero} ct-panel`}>
        <div>
          <p className={styles.kicker}>Admin / kunde presentasjon</p>
          <h1>Ola Berg</h1>
          <p>Kunde-ID {userId} · ola@example.no · 92121216 · Gold-medlem · KYC venter</p>
        </div>
        <div className={styles.customerHeroActions}>
          <a href="/admin/brukere" className={styles.secondaryButton}>Til brukerliste</a>
          <button type="button" className={styles.goldButton}>Opprett supportsak</button>
        </div>
      </section>

      <section className={styles.customerMetricGrid}>
        <article className="ct-card"><span>Total samlerverdi</span><strong>128 450 kr</strong><small>247 objekter</small></article>
        <article className="ct-card"><span>Online i dag</span><strong>2 t 14 min</strong><small>38 t siste måned</small></article>
        <article className="ct-card"><span>Mest brukt side</span><strong>Katalog</strong><small>42 % av aktiviteten</small></article>
        <article className="ct-card"><span>Supportstatus</span><strong>Trenger hjelp</strong><small>Katalogfilter / auksjon</small></article>
      </section>

      <section className={styles.customerWorkspace}>
        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Aktivitet siste periode</h2>
          <div className={styles.activityGraph} aria-label="Påloggingsgraf">
            {loginGraph.map((value, index) => (
              <span key={index} style={{ height: `${value}%` }} title={`${value}%`} />
            ))}
          </div>
          <p>Grafen viser online-aktivitet og kan senere hentes fra aktivitetslogg i MariaDB.</p>
        </div>

        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Mest brukte sider</h2>
          {pageUse.map((item) => (
            <div className={styles.pageUseRow} key={item.page}>
              <b>{item.page}</b>
              <span><i style={{ width: `${item.value}%` }} /></span>
              <em>{item.value}%</em>
            </div>
          ))}
        </div>

        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Samling og marked</h2>
          <div className={styles.customerListGrid}>
            <p><b>Sedler</b><span>128 objekter · 88 200 kr</span></p>
            <p><b>Mynter</b><span>96 objekter · 31 800 kr</span></p>
            <p><b>Dokumenter</b><span>23 objekter · 8 450 kr</span></p>
            <p><b>Auksjon</b><span>3 aktive bud</span></p>
            <p><b>Nettbutikk</b><span>2 objekter til salgs</span></p>
            <p><b>Risiko</b><span>1 åpen supportindikasjon</span></p>
          </div>
        </div>

        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Aktivitetslogg</h2>
          <ul className={styles.activityLog}>
            <li><b>14:28</b><span>Åpnet katalog og brukte filter Norske sedler</span></li>
            <li><b>14:12</b><span>Sorterte etter Haakon VII og 1949</span></li>
            <li><b>13:55</b><span>La NSNR 23a i ønskeliste</span></li>
            <li><b>12:02</b><span>Forsøkte å åpne auksjon</span></li>
            <li><b>i går</b><span>Oppdaterte private samlingsnotater</span></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
