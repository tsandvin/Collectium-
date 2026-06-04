import Link from "next/link";
import styles from "./startside-v3.module.css";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Startside V3 premium kommersiell landing
 *
 * Definering / formal:
 * Offentlig kommersiell startside basert paa vedlagt designretning.
 * Siden forklarer Collectium-konsept, medlemskap, auksjon, forhandler og sanndata.
 *
 * Bruksomraade:
 * Brukes som offentlig inngang paa / i ren Next.js / React-kjerne.
 *
 * Berorte sider / routes:
 * - /
 * - /login
 * - /min-side
 *
 * Berorte DB-brytere / feature_keys:
 * - landing.view
 * - auth.login
 * - profile.view
 * - membership.view
 * - auction.view
 * - dealer.view
 *
 * Dataretning:
 * MariaDB/API senere -> Next.js -> React -> UI
 *
 * Viktig regel:
 * Ingen fiktive tall, priser, objekter, trender eller markedsdata hardkodes.
 */

const features = [
  "Organisering av samling",
  "Verdsettelse & innhold",
  "Forhandler kontakt",
  "Auksjoner",
  "Index marked",
  "Objekt sammenligning",
  "Historisk-museum modul",
];

const whyItems = [
  "Relasjonsbasert katalog med historisk dybde",
  "Samler, Historie og Finans i samme objektvisning",
  "Markedsdata, auksjon og index koblet til samme objektgrunnlag",
  "Forhandlerflyt for vurdering, salg, auksjon og oppgjor",
  "Museum- og historielag for personer, perioder, regenter og motiver",
  "Offentlig landing uten tekniske databasefelt eller intern systemtekst",
];

const prices = [
  {
    name: "Free",
    role: "Begrenset tilgang for aa komme i gang.",
    main: "0 kr",
    sub: "0 kr",
    note: "Gratis",
    button: "Start gratis",
    items: ["Offentlig katalogutdrag", "Begrenset sok", "Medlemskapstilbud"],
  },
  {
    name: "Bronze",
    role: "Lopende maanedsmedlemskap etter forste aar.",
    main: "149 kr forste aar",
    sub: "199 kr/mnd etterpaa",
    note: "Maanedlig etter introaar",
    button: "Velg Bronze",
    items: ["Flere katalogfilter", "Grunnleggende samling", "Hjerte og stjerne", "Enkel markedsverdi"],
  },
  {
    name: "Silver",
    role: "Avansert samler- og analysemedlemskap. Kan vises baade som aar og maaned.",
    main: "3 000 kr/aar tilbud",
    sub: "6 000 kr/aar eller 500 kr/mnd",
    note: "Aarlig eller maanedlig",
    button: "Velg Silver",
    items: ["Avansert katalog", "Flere filter", "Mer historikk", "Samlingsanalyse"],
    featured: true,
  },
  {
    name: "Gold",
    role: "For samlere og aktorer som trenger avansert tilgang. Forhandlerregistrering gjores i eget lop.",
    main: "10 000 kr forste aar",
    sub: "20 000 kr/aar etterpaa",
    note: "Aarlig",
    button: "Sok Gold",
    items: ["Avansert katalog", "Marked og index", "Forhandler kan soke separat", "Kun aarsavtale"],
  },
  {
    name: "Platinum",
    role: "50 % rabatt i ett aar. Medlemskapet varer i to aar.",
    main: "50 000 kr / 2 aar",
    sub: "100 000 kr/aar",
    note: "Kun aarlig",
    button: "Kontakt oss",
    items: ["Ingen maanedlig pris", "Alle land og kilder", "Full historikk", "Profesjonell analyse"],
  },
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>C</span>
          <span>Collectium</span>
        </Link>
        <nav className={styles.nav} aria-label="Hovedmeny">
          <Link href="#konsept">Katalog</Link>
          <Link href="#medlemskap">Medlemskap</Link>
          <Link href="#forhandler">Forhandlere</Link>
          <Link href="#auksjon">Auksjon</Link>
        </nav>
        <div className={styles.actions}>
          <Link href="/login" className={styles.secondaryButton}>Logg inn</Link>
          <Link href="#medlemskap" className={styles.ghostButton}>Kom i gang gratis</Link>
        </div>
      </header>

      <section id="konsept" className={`${styles.section} ${styles.hero}`}>
        <div>
          <p className={styles.kicker}>For samlere · for historien · for markedet</p>
          <h1 className={styles.heroTitle}>
            For samlere. Av samlere. <span className={styles.blueText}>Alt paa ett sted.</span>
          </h1>
          <p className={styles.heroLead}>
            Collectium samler katalog, egen samling, verdsettelse, auksjon, forhandlerkontakt, index og historiske relasjoner i en strukturert plattform.
          </p>
          <div className={styles.heroCtas}>
            <Link href="#medlemskap" className={styles.primaryButton}>Start gratis</Link>
            <Link href="#konsept" className={styles.secondaryButton}>Se katalog</Link>
          </div>
          <p className={styles.publicNote}>
            Offentlig forside uten sidemeny. Etter innlogging overtar global AppShell og viser sidemenyen.
          </p>
          <div className={styles.chips}>
            <span className={styles.chip}>Relasjonsbasert katalog</span>
            <span className={styles.chip}>Oppdatert marked</span>
            <span className={styles.chip}>Sikker samling</span>
          </div>
        </div>

        <div className={styles.deviceWrap}>
          <div className={styles.device}>
            <div className={styles.deviceTop}>
              <div className={styles.segmentSwitch}>
                <span>Samler</span><span>Historie</span><span>Finans</span>
              </div>
              <div className={styles.sourceSwitch}>
                <span>Sedler</span><span>Mynter</span>
              </div>
            </div>

            <div className={styles.objectCard}>
              <div>
                <div className={styles.objectImage}>C</div>
                <span className={styles.objectType}>SEDLER</span>
              </div>
              <div>
                <h2 className={styles.objectTitle}>Objektpresentasjon</h2>
                <p className={styles.objectMeta}>Kilde · objektgruppe · object_id</p>
                <p className={styles.objectStatus}>Min samling · onskeliste · favoritt</p>
                <div className={styles.pillRow}>
                  <span className={styles.pill}>Katalognummer</span>
                  <span className={styles.pill}>Hjerte</span>
                  <span className={styles.pill}>Stjerne</span>
                  <span className={styles.pill}>Min samling</span>
                  <span className={styles.pill}>Kjopspris</span>
                </div>
                <div className={styles.objectPrice}>
                  <span>Verdi hentes fra API</span>
                  <span className={styles.realData}>sanndata</span>
                </div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>Objektvisningskort</h3>
              <p>
                Objektvisningskortet aapner full objektpresentasjon med bilder, kvalitet, egne notater, samlingsstatus, kjop, salg, auksjon og relasjoner naar sanndata er koblet.
              </p>
            </div>
          </div>

          <div className={styles.floatCard}>
            <div className={styles.floatMark}>C</div>
            <p className={styles.floatTitle}>Min samling</p>
            <p className={styles.floatValue}>API-data</p>
            <p className={styles.floatText}>Objekter og verdi hentes reelt</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.kicker}>Funksjoner</p>
        <h2 className={styles.sectionTitle}>Alt du trenger for aa starte, organisere, forstaa og selge</h2>
        <div className={styles.twoCol} style={{ marginTop: 28 }}>
          <div className={styles.featureList}>
            <div className={styles.featureItem}>Samler</div>
            {features.map((feature, index) => (
              <div key={feature} className={styles.featureItem}>
                <span className={styles.featureIcon}>{index + 1}</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <article className={styles.panel}>
            <div className={styles.panelIcon}>◎</div>
            <p className={styles.kicker}>Mulighet i Collectium</p>
            <h3>Samler</h3>
            <p>
              Start, organiser og bygg samlingen din med egne lister, hjerte, stjerne og private notater.
            </p>
            <p className={styles.panelNote}>
              Dette er offentlig introduksjonstekst. Etter innlogging vises funksjoner med riktig tilgang, data og global sidemeny.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.whyGrid}>
          <div>
            <p className={styles.kicker}>Hvorfor Collectium?</p>
            <h2 className={styles.sectionTitle}>En relasjonsplattform, ikke bare en katalog</h2>
          </div>
          <div className={styles.whyList}>
            {whyItems.map((item) => (
              <div key={item} className={styles.whyItem}>
                <span className={styles.dot} />{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="medlemskap" className={styles.section}>
        <div className={styles.priceHeader}>
          <div>
            <p className={styles.kicker}>Medlemskap</p>
            <h2 className={styles.sectionTitle}>Riktige priser og tilgangsnivaa</h2>
            <p className={styles.priceIntro}>Premium brukes ikke. Platinum finnes ikke som maanedlig medlemskap.</p>
          </div>
          <div className={styles.toggle}><span>Maanedlig</span><span>Aarlig</span></div>
        </div>

        <div className={styles.priceGrid}>
          {prices.map((price) => (
            <article key={price.name} className={`${styles.priceCard} ${price.featured ? styles.priceCardFeatured : ""}`}>
              <h3>{price.name}</h3>
              <p className={styles.priceRole}>{price.role}</p>
              <p className={styles.priceMain}>{price.main}</p>
              <p className={styles.priceSub}>{price.sub}</p>
              <p className={styles.priceNote}>{price.note}</p>
              <ul className={styles.priceList}>
                {price.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <Link href="/login" className={styles.cardButton}>{price.button}</Link>
            </article>
          ))}
        </div>
      </section>

      <section id="auksjon" className={styles.section}>
        <p className={styles.kicker}>Aktivitet her paa Collectium</p>
        <h2 className={styles.sectionTitle}>Hva samlersiden folger akkurat naa</h2>
        <div className={styles.activityGrid} style={{ marginTop: 22 }}>
          <article className={styles.activityCard}>
            <p>Mest omsatte objekt</p>
            <strong>Kobles til API</strong>
            <span>Sanndata kreves</span>
          </article>
          <article className={styles.activityCard}>
            <p>Mest sette konge</p>
            <strong>Kobles til API</strong>
            <span>Sanndata kreves</span>
          </article>
          <article className={styles.activityCard}>
            <p>Mest populaere motiv</p>
            <strong>Kobles til API</strong>
            <span>Sanndata kreves</span>
          </article>
          <article className={styles.activityCard}>
            <p>Markedstrend</p>
            <strong>Kobles til API</strong>
            <span>Sanndata kreves</span>
          </article>
        </div>
      </section>

      <section id="forhandler" className={`${styles.section} ${styles.offer}`}>
        <div className={styles.offerBox}>
          <div className={styles.offerTop}>
            <div>
              <p className={styles.kicker}>Registreringstilbud</p>
              <h2 className={styles.sectionTitle}>Nye medlemmer faar introduksjonsfordel</h2>
              <p className={styles.priceIntro}>Start gratis, bygg samling og faa oversikt over tilbud for du velger medlemskap.</p>
            </div>
            <div className={styles.emailRow}>
              <div className={styles.emailField}>Din e-postadresse</div>
              <Link href="/login" className={styles.ghostButton}>Meld meg paa</Link>
            </div>
          </div>
          <div className={styles.offerTiles}>
            <div className={styles.offerTile}>Bronze: 149 kr forste aar, deretter 199 kr/mnd</div>
            <div className={styles.offerTile}>Silver: 3 000 kr/aar tilbud eller 250 kr/mnd, deretter 6 000 kr/aar eller 500 kr/mnd</div>
            <div className={styles.offerTile}>Platinum: betal 50 000 kr i rabattperioden og faa Platinum i to aar</div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>©Collectium</span>
        <span>© Collectium 2026 · Katalog · Relasjoner · Verdi</span>
      </footer>
    </main>
  );
}
