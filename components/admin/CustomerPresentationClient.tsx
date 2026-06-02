"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CustomerPresentationClient v18
 *
 * Definering / formål:
 * Kundepresentasjon for support/admin med kundenummer, kundekilde/opprinnelse,
 * aktivitet, påloggingstid, mest brukte sider, samlergrupper, auksjon, nettbutikkstatus
 * og aktivitetslogg. Dette er egen dypere side for valgt kunde.
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
  const isDealer = userId.toLowerCase().includes("dealer");
  const customerNumber = isDealer ? "CTD-NO-2026-000001" : "CT-NO-2026-000001";

  return (
    <div className={styles.customerPage}>
      <section className={`${styles.customerHero} ct-panel`}>
        <div>
          <p className={styles.kicker}>Admin / kundepresentasjon</p>
          <h1>{isDealer ? "Demo Forhandler" : "Ola Berg"}</h1>
          <p>{customerNumber} · {isDealer ? "demo.forhandler@collectium.no" : "ola@example.no"} · {isDealer ? "Forhandlerkonto" : "Gold-medlem"} · KYC venter</p>
        </div>
        <div className={styles.customerHeroActions}>
          <a href="/admin/brukere" className={styles.secondaryButton}>Til brukerliste</a>
          <button type="button" className={styles.goldButton}>Opprett supportsak</button>
        </div>
      </section>

      <section className={styles.customerMetricGrid}>
        <article className="ct-card"><span>Kundenummer</span><strong>{customerNumber}</strong><small>Landkode NO · år 2026</small></article>
        <article className="ct-card"><span>Total samlerverdi</span><strong>{isDealer ? "0 kr" : "128 450 kr"}</strong><small>{isDealer ? "forhandlerkonto" : "247 objekter"}</small></article>
        <article className="ct-card"><span>Online i dag</span><strong>{isDealer ? "31 min" : "2 t 14 min"}</strong><small>{isDealer ? "18 t siste måned" : "38 t siste måned"}</small></article>
        <article className="ct-card"><span>Supportstatus</span><strong>Trenger oppfølging</strong><small>Katalogfilter / avtale / auksjon</small></article>
      </section>

      <section className={styles.customerWorkspace}>
        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Kundeopprinnelse</h2>
          <div className={styles.customerListGrid}>
            <p><b>Kildetype</b><span>{isDealer ? "Forhandlerregistrering" : "Invitert av forhandler"}</span></p>
            <p><b>Første side</b><span>{isDealer ? "/forhandler" : "/registrering"}</span></p>
            <p><b>Kampanje</b><span>{isDealer ? "Forhandlerpilot 2026" : "Vårkampanje 2026"}</span></p>
            <p><b>Første objektgruppe</b><span>{isDealer ? "Sedler og mynter" : "Sedler"}</span></p>
            <p><b>Registrert kanal</b><span>app.collectium.no</span></p>
            <p><b>Regel</b><span>CT-[LAND]-[ÅR]-[LØPENR]</span></p>
          </div>
        </div>

        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Aktivitet siste periode</h2>
          <div className={styles.activityGraph} aria-label="Påloggingsgraf">
            {loginGraph.map((value, index) => (
              <span key={index} style={{ height: `${value}%` }} title={`${value}%`} />
            ))}
          </div>
          <p>Grafen viser online-aktivitet og skal senere hentes fra aktivitetslogg i MariaDB.</p>
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
            <p><b>Sedler</b><span>{isDealer ? "0 objekter · kategori aktiv" : "128 objekter · 88 200 kr"}</span></p>
            <p><b>Mynter</b><span>{isDealer ? "0 objekter · kategori aktiv" : "96 objekter · 31 800 kr"}</span></p>
            <p><b>Dokumenter</b><span>{isDealer ? "ikke aktiv" : "23 objekter · 8 450 kr"}</span></p>
            <p><b>Auksjon</b><span>{isDealer ? "Auksjonskonto aktiv" : "3 aktive bud"}</span></p>
            <p><b>Nettbutikk</b><span>{isDealer ? "Nettbutikk aktiv" : "2 objekter til salgs"}</span></p>
            <p><b>Risiko</b><span>1 åpen supportindikasjon</span></p>
          </div>
        </div>

        <div className={`${styles.customerPanel} ct-panel`}>
          <h2>Supportverktøy</h2>
          <div className={styles.customerListGrid}>
            <p><b>Siste feilside</b><span>/katalog/filter</span></p>
            <p><b>Feiltype</b><span>Filter ga 0 treff</span></p>
            <p><b>Anbefalt hjelp</b><span>Vis riktig filterrekkefølge og nullstill filter</span></p>
            <p><b>Kontakt</b><span>Send melding / opprett supportsak</span></p>
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
