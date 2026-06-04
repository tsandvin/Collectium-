"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CollectiumFrontpageV27
 *
 * Definering / formål:
 * Professional public frontpage for Collectium. Designed to merge the approved serious
 * membership / relation-platform direction with a full-width family collector image section.
 *
 * Bruksområde:
 * Imported by app/page.tsx. Uses only public-facing language. Does not expose internal
 * database/API wording on the landing page.
 *
 * Berørte sider / routes:
 * - /
 * - /katalog
 * - /medlemskap
 * - /forhandler
 * - /auksjon
 * - /registrering
 * - /login
 *
 * Berørte DB-brytere / feature_keys:
 * - landing.view
 * - landing.register
 * - landing.login
 * - landing.membership
 * - catalog.view
 * - auction.view
 * - dealer.view
 *
 * Berørte API-ruter:
 * - Future: GET /api/frontpage/summary
 * - Future: GET /api/frontpage/market-preview
 *
 * Berørte tabeller / views:
 * - Future: ct_v_catalog_objects_resolved
 * - Future: ct_v_catalog_market_summary
 * - Future: ct_v_catalog_relations
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: landing
 * log_action: view
 *
 * Versjon:
 * CT-COMP-0027 / CHANGE-2026-06-04-0003
 *
 * Endringsregel:
 * New component. Uses central/global app shell when present. No database truth is hardcoded.
 */

import styles from "./CollectiumFrontpageV27.module.css";

type FeatureKey =
  | "samler"
  | "relasjon"
  | "finans"
  | "auksjon"
  | "deling"
  | "forhandler";

const features: Array<{
  key: FeatureKey;
  title: string;
  text: string;
}> = [
  {
    key: "samler",
    title: "Egen samling",
    text:
      "Bygg en ryddig oversikt over egne objekter, lister, kjøpspris, kvalitet, notater, dokumentasjon og historikk.",
  },
  {
    key: "relasjon",
    title: "Relasjonsdata",
    text:
      "Se objekter i sammenheng med valør, år, utgave, signaturer, regenter, perioder, materiale, motiver og relaterte objekter.",
  },
  {
    key: "finans",
    title: "Finansdata og estimering",
    text:
      "Følg verdiutvikling, trend, prisobservasjoner, likviditet, kjøpspris og estimering når grunnlaget er godt nok.",
  },
  {
    key: "auksjon",
    title: "Auksjon",
    text:
      "Koble objekt, kataloggrunnlag, utrop, bud, resultat og markedsobservasjon i én mer seriøs auksjonsflyt.",
  },
  {
    key: "deling",
    title: "Del med kontroll",
    text:
      "Del enkeltobjekter eller deler av samlingen privat, anonymt, tidsstyrt eller gjennom en offentlig Collectium-profil.",
  },
  {
    key: "forhandler",
    title: "Forhandlerposisjon",
    text:
      "Gi forhandlere bedre presentasjon av objekter med historikk, relasjoner, kvalitet, marked og dokumentasjon samlet.",
  },
];

const membershipPlans = [
  {
    name: "Free",
    lead: "Begrenset tilgang for å komme i gang.",
    price: "0 kr",
    sub: "Gratis",
    items: ["Offentlig katalogutdrag", "Begrenset søk", "Medlemskapstilbud"],
    action: "Start gratis",
  },
  {
    name: "Bronze",
    lead: "Løpende månedsmedlemskap etter første år.",
    price: "149 kr første år",
    sub: "199 kr/mnd etterpå",
    items: ["Flere katalogfilter", "Grunnleggende samling", "Hjerte og stjerne", "Enkel markedsverdi"],
    action: "Velg Bronze",
  },
  {
    name: "Silver",
    lead: "Avansert samler- og analysemedlemskap.",
    price: "3 000 kr/år tilbud",
    sub: "6 000 kr/år eller 500 kr/mnd",
    items: ["Avansert katalog", "Flere filter", "Mer historikk", "Samlingsanalyse"],
    action: "Velg Silver",
    highlighted: true,
  },
  {
    name: "Gold",
    lead: "For samlere og aktører som trenger avansert tilgang.",
    price: "10 000 kr første år",
    sub: "20 000 kr/år etterpå",
    items: ["Avansert katalog", "Marked og index", "Forhandler kan søke separat", "Kun årsavtale"],
    action: "Søk Gold",
  },
  {
    name: "Platinum",
    lead: "50 % rabatt i ett år. Medlemskapet varer i to år.",
    price: "50 000 kr / 2 år",
    sub: "100 000 kr/år",
    items: ["Ingen månedlig pris", "Alle land og kilder", "Full historikk", "Profesjonell analyse"],
    action: "Kontakt oss",
  },
];

const marketCards = [
  ["Mest omsatte objekt", "38 750 kr", "10 kroner 1937 Litra A · NSNR 20a", "+12 %"],
  ["Mest sette konge", "Haakon VII", "Sett 24 580 ganger", "+8 %"],
  ["Mest populære motiv", "Riksvåpen", "Sett 18 920 ganger", "+6 %"],
  ["Markedstrend", "Index 1 247", "Siste 30 dager", "+3,6 %"],
];

function Signature() {
  return <span className={styles.signature} aria-hidden="true">________________ Collectium</span>;
}

export default function CollectiumFrontpageV27() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <a className={styles.logo} href="/">
          <span className={styles.logoMark}>©</span>
          <span>Collectium</span>
        </a>

        <nav className={styles.nav} aria-label="Hovedmeny">
          <a href="/katalog">Katalog</a>
          <a href="/medlemskap">Medlemskap</a>
          <a href="/forhandler">Forhandlere</a>
          <a href="/auksjon">Auksjon</a>
        </nav>

        <div className={styles.topActions}>
          <a className={styles.secondaryButton} href="/login">Logg inn</a>
          <a className={styles.primaryButton} href="/registrering">Kom i gang gratis</a>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>For samlere · for historien · for markedet</p>
          <h1>
            For samlere. Av samlere.
            <span>Alt på ett sted.</span>
          </h1>
          <p className={styles.heroLead}>
            Collectium samler katalog, egen samling, relasjonsdata, verdivurdering, auksjon,
            forhandlerkontakt, deling og markedsutvikling i én strukturert plattform.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="/registrering">Start gratis</a>
            <a className={styles.secondaryButton} href="/katalog">Se katalog</a>
          </div>
          <div className={styles.chips} aria-label="Collectium kjernefunksjoner">
            <span>Relasjonsbasert katalog</span>
            <span>Oppdatert marked</span>
            <span>Sikker samling</span>
          </div>
        </div>

        <aside className={styles.heroObjectCard} aria-label="Eksempel på Collectium objektkort">
          <Signature />
          <div className={styles.segmentPills}>
            <span>Samler</span>
            <span>Historie</span>
            <span>Finans</span>
          </div>
          <div className={styles.objectPanel}>
            <div className={styles.objectMark}>C</div>
            <div>
              <h2>10 kroner 1949 A</h2>
              <p>Norges Bank · Haakon VII · Norske sedler</p>
              <div className={styles.objectLinks}>
                <span>NSNR 23a</span>
                <span>Hjerte</span>
                <span>Stjerne</span>
                <span>Min samling</span>
                <span>Kjøpspris</span>
              </div>
              <strong>15 000 kr <em>samling</em></strong>
            </div>
          </div>
          <div className={styles.notePanel}>
            <h3>Objektvisningskort</h3>
            <p>
              Ett objekt kan vises som samlerobjekt, historisk relasjon og verdiobjekt –
              uten at objektets identitet forsvinner.
            </p>
          </div>
        </aside>
      </section>

      <section className={styles.featureSection}>
        <p className={styles.kicker}>Funksjoner</p>
        <h2>Alt du trenger for å starte, organisere, forstå og selge</h2>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article className={styles.featureCard} key={feature.key}>
              <Signature />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.familyHero} aria-label="Familie og samling">
        <img src="/images/collectium-family-collector-hero.png" alt="Familie som organiserer en samling med samleobjekter" />
        <div className={styles.familyOverlay}>
          <p className={styles.kicker}>Samling og familie</p>
          <h2>Har du en samling, men mangler oversikt?</h2>
          <p>
            Mange samlere har objekter i album, esker, permer og skuffer. Collectium skal gjøre det
            enklere å dokumentere, forstå, dele og bevare verdien i samlingen.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="/registrering">Bli medlem</a>
            <a className={styles.lightButton} href="/medlemskap">Se medlemskap</a>
          </div>
        </div>
      </section>

      <section className={styles.whySection}>
        <div>
          <p className={styles.kicker}>Hvorfor Collectium?</p>
          <h2>En relasjonsplattform, ikke bare en katalog</h2>
        </div>
        <div className={styles.whyList}>
          <span>Relasjonsbasert katalog med historisk dybde</span>
          <span>Samler, Historie og Finans i samme objektvisning</span>
          <span>Marked, auksjon og index koblet til samme objektgrunnlag</span>
          <span>Forhandlerflyt for vurdering, salg, auksjon og oppgjør</span>
          <span>Museum- og historielag for personer, perioder, regenter og motiver</span>
          <span>Deling anonymt, privat eller via Collectium-profil</span>
        </div>
      </section>

      <section className={styles.membershipSection}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.kicker}>Medlemskap</p>
            <h2>Riktige priser og tilgangsnivå</h2>
            <p>Premium brukes ikke. Platinum finnes ikke som månedlig medlemskap.</p>
          </div>
          <div className={styles.toggle} aria-label="Prisvisning">
            <span>Månedlig</span>
            <span>Årlig</span>
          </div>
        </div>

        <div className={styles.planGrid}>
          {membershipPlans.map((plan) => (
            <article className={`${styles.planCard} ${plan.highlighted ? styles.planCardActive : ""}`} key={plan.name}>
              <Signature />
              <h3>{plan.name}</h3>
              <p>{plan.lead}</p>
              <strong>{plan.price}</strong>
              <small>{plan.sub}</small>
              <ul>
                {plan.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <a className={styles.planButton} href="/medlemskap">{plan.action}</a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.marketSection}>
        <p className={styles.kicker}>Aktivitet her på Collectium</p>
        <h2>Hva samlersiden følger akkurat nå</h2>
        <div className={styles.marketGrid}>
          {marketCards.map(([label, value, meta, trend]) => (
            <article className={styles.marketCard} key={label}>
              <Signature />
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{meta}</p>
              <em>{trend}</em>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.registerSection}>
        <Signature />
        <div>
          <p className={styles.kicker}>Registreringstilbud</p>
          <h2>Nye medlemmer får introduksjonsfordel</h2>
          <p>Start gratis, bygg samling og få oversikt over tilbud før du velger medlemskap.</p>
        </div>
        <form className={styles.signupForm}>
          <input type="email" placeholder="Din e-postadresse" aria-label="Din e-postadresse" />
          <button type="button">Meld meg på</button>
        </form>
      </section>

      <footer className={styles.footer}>
        <span>© Collectium</span>
        <span>© Collectium 2026 · Katalog · Relasjoner · Verdi · Auksjon · Samling</span>
      </footer>
    </main>
  );
}
