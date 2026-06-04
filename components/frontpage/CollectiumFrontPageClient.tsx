"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CollectiumFrontPageClient
 *
 * Definering / formål:
 * Interaktiv frontsidekomponent for Vercel/Next.js med segmentbrytere,
 * visningsvalg, sortering, filter og medlemskapspris-toggle.
 *
 * Bruksområde:
 * Importeres av app/page.tsx.
 *
 * Berørte sider / routes:
 * - /
 *
 * Berørte DB-brytere / feature_keys:
 * - landing.view
 * - catalog.view
 * - catalog.object.open
 * - membership.view
 *
 * Berørte API-ruter:
 * - Ingen direkte API-kall i første versjon.
 *
 * Berørte tabeller / views:
 * - Senere: ct_v_catalog_objects_resolved
 * - Senere: ct_v_catalog_market_summary
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: landing
 * log_action: view
 */

import { useMemo, useState } from "react";
import styles from "./CollectiumFrontPage.module.css";

type Segment = "samler" | "historie" | "finans";
type ViewMode = "standing" | "list";
type BillingMode = "month" | "year";
type SortMode = "catalog" | "yearAsc" | "yearDesc" | "valueDesc" | "trendDesc";

type CatalogItem = {
  title: string;
  source: string;
  objectType: string;
  country: string;
  issuer: string;
  year: number;
  ruler: string;
  valueText: string;
  valueNumber: number;
  trend: number;
  trendText: string;
  imageTone: "note" | "coin" | "green" | "grey";
  core: {
    denominationIssue: string;
    variant: string;
    rarity: string;
    quality: string;
  };
  segment: Record<Segment, {
    label: string;
    text: string;
    metaA: string;
    metaB: string;
    metaC: string;
    action: string;
  }>;
  actions: {
    hearts: number;
    stars: number;
    estimate: string;
    status: string;
    auction: number;
    shop: number;
    collection: number;
  };
};

const segmentCopy: Record<Segment, { title: string; lead: string; boxes: { title: string; body: string }[] }> = {
  samler: {
    title: "Samler",
    lead:
      "Visningskortene viser brukerens relasjon til objektet: ønskeliste, favoritt, samling, kvalitet, dokumentasjon og handlinger.",
    boxes: [
      { title: "Brukerstatus", body: "Hjerte, stjerne, Min samling og fulgte objekter." },
      { title: "Eierdata", body: "Kjøpspris, kvalitet, dokumentasjon, notater og deling." },
      { title: "Handling", body: "Legg til samling, følg objekt, del eller åpne detaljer." },
    ],
  },
  historie: {
    title: "Historie",
    lead:
      "Visningskortene viser historiske relasjoner og katalogisk kontekst uten å gjenta standardfeltene i kortet.",
    boxes: [
      { title: "Relasjoner", body: "Regent, periode, signatur, utsteder og relaterte objekter." },
      { title: "Kontekst", body: "Historiske hendelser, materiale, opprinnelse og proveniens." },
      { title: "Museum", body: "Åpne objektet videre i historisk presentasjon eller museumsvisning." },
    ],
  },
  finans: {
    title: "Finans",
    lead:
      "Visningskortene viser marked, verdi, trend, likviditet og observasjoner. 0 kr betyr manglende verdi, ikke reell markedspris.",
    boxes: [
      { title: "Markedsverdi", body: "Siste vurdering, verdi per kvalitet og prisobservasjoner." },
      { title: "Trend", body: "6, 12, 18 og 24 måneders utvikling." },
      { title: "Markedskanal", body: "Auksjon, nettbutikk, prisobservasjon og index." },
    ],
  },
};

const items: CatalogItem[] = [
  {
    title: "100 kroner 1945",
    source: "Norske sedler",
    objectType: "Seddel",
    country: "Norge",
    issuer: "Norges Bank",
    year: 1945,
    ruler: "Haakon VII",
    valueText: "48 500 kr",
    valueNumber: 48500,
    trend: 12.1,
    trendText: "↗ +12,1 %",
    imageTone: "note",
    core: {
      denominationIssue: "London-utgave",
      variant: "Standardutgave",
      rarity: "Sjelden",
      quality: "XF / samleravhengig",
    },
    segment: {
      samler: {
        label: "I min samling",
        text: "Kjøpsverdi registrert. Dokumentasjon mangler og bør kompletteres.",
        metaA: "Status: Lagret",
        metaB: "Dokumentasjon: Mangler",
        metaC: "Eiernotat: Aktiv",
        action: "★ Følg",
      },
      historie: {
        label: "Historisk kontekst",
        text: "Knyttet til krigs-/London-perioden og norsk pengesirkulasjon etter frigjøringen.",
        metaA: "Regent: Haakon VII",
        metaB: "Utsteder: Norges Bank",
        metaC: "Periode: 1940-1945",
        action: "Se historie",
      },
      finans: {
        label: "Siste salg",
        text: "14 prisobservasjoner, høy etterspørsel og auksjonssterk kanal.",
        metaA: "Kanal: Auksjon",
        metaB: "Likviditet: Høy",
        metaC: "Observasjoner: 14 siste år",
        action: "Se graf",
      },
    },
    actions: { hearts: 0, stars: 0, estimate: "48 500 kr", status: "Vurdert", auction: 3, shop: 1, collection: 7 },
  },
  {
    title: "2 kroner 1907",
    source: "Norske mynter",
    objectType: "Mynt",
    country: "Norge",
    issuer: "Den Kongelige Mynt",
    year: 1907,
    ruler: "Haakon VII",
    valueText: "8 400 kr",
    valueNumber: 8400,
    trend: 0.4,
    trendText: "— flat",
    imageTone: "coin",
    core: {
      denominationIssue: "Haakon VII-serie",
      variant: "Sølvmynt",
      rarity: "Normal/sjelden etter kvalitet",
      quality: "Middels / samleravhengig",
    },
    segment: {
      samler: {
        label: "Ønskeliste",
        text: "Mangler i samlingen. Auksjonsvarsel kan aktiveres.",
        metaA: "Status: Ønske",
        metaB: "Dokumentasjon: Ikke registrert",
        metaC: "Samling: Ikke eid",
        action: "♡ Ønske",
      },
      historie: {
        label: "Konge og materiale",
        text: "Tidlig Haakon VII-mynt med sølvrelasjon og tydelig regentkobling.",
        metaA: "Regent: Haakon VII",
        metaB: "Materiale: Sølv",
        metaC: "Periode: 1905-1957",
        action: "Åpne relasjon",
      },
      finans: {
        label: "Estimat",
        text: "Sølv og samlermarked med middels likviditet og flat trend.",
        metaA: "Materiale: Sølv",
        metaB: "Likviditet: Middels",
        metaC: "Trend: Flat/varierer",
        action: "Sammenlign",
      },
    },
    actions: { hearts: 0, stars: 0, estimate: "8 400 kr", status: "Vurdert", auction: 1, shop: 0, collection: 2 },
  },
  {
    title: "1 krone 1917 A",
    source: "Norske sedler",
    objectType: "Seddel",
    country: "Norge",
    issuer: "Norges Bank",
    year: 1917,
    ruler: "Haakon VII",
    valueText: "3 200 kr",
    valueNumber: 3200,
    trend: 4.8,
    trendText: "↗ +4,8 %",
    imageTone: "grey",
    core: {
      denominationIssue: "1917-serien",
      variant: "Litra A",
      rarity: "Vanlig til sjelden etter kvalitet",
      quality: "Brukeravhengig / ikke låst",
    },
    segment: {
      samler: {
        label: "Favoritt",
        text: "Egen notatlinje registrert. Kjøpt i 2024.",
        metaA: "Status: Favoritt",
        metaB: "Notat: Aktivt",
        metaC: "Kjøp: Registrert",
        action: "♥ Lagret",
      },
      historie: {
        label: "Skillemyntseddel",
        text: "Knyttet til 1917-serien, litra og krigs-/mangelperiode.",
        metaA: "Serie: 1917",
        metaB: "Litra: A",
        metaC: "Regent: Haakon VII",
        action: "Se serie",
      },
      finans: {
        label: "Siste bud",
        text: "Lav til middels likviditet, men med relevante observasjoner.",
        metaA: "Kanal: Bud",
        metaB: "Likviditet: Lav/middels",
        metaC: "Observasjoner: 8",
        action: "Åpne bud",
      },
    },
    actions: { hearts: 0, stars: 0, estimate: "3 200 kr", status: "Vurdert", auction: 0, shop: 1, collection: 4 },
  },
  {
    title: "50 øre 1899",
    source: "Norske mynter",
    objectType: "Mynt",
    country: "Norge",
    issuer: "Den Kongelige Mynt",
    year: 1899,
    ruler: "Oscar II",
    valueText: "5 600 kr",
    valueNumber: 5600,
    trend: 6.2,
    trendText: "↗ +6,2 %",
    imageTone: "green",
    core: {
      denominationIssue: "Oscar II-serie",
      variant: "Sølvmynt",
      rarity: "Avhenger av kvalitet",
      quality: "Ikke brukerregistrert",
    },
    segment: {
      samler: {
        label: "Ikke i samling",
        text: "Foreslått relatert objekt basert på valør, materiale og regent.",
        metaA: "Status: Ikke eid",
        metaB: "Forslag: Relatert",
        metaC: "Varsel: Av",
        action: "+ Legg til",
      },
      historie: {
        label: "Oscar II",
        text: "Knyttet til unionsperioden, sølvstandard og norsk myntserie før 1905.",
        metaA: "Regent: Oscar II",
        metaB: "Materiale: Sølv",
        metaC: "Periode: Unionstid",
        action: "Se regent",
      },
      finans: {
        label: "Utrop",
        text: "Fem observasjoner, god dybde i sølv- og Oscar II-markedet.",
        metaA: "Kanal: Auksjon",
        metaB: "Materiale: Sølv",
        metaC: "Observasjoner: 5",
        action: "Se marked",
      },
    },
    actions: { hearts: 0, stars: 0, estimate: "5 600 kr", status: "Vurdert", auction: 2, shop: 0, collection: 0 },
  },
];

const plans = [
  {
    tier: "Free",
    label: "Start",
    priceMonth: "0 kr",
    priceYear: "0 kr",
    normalMonth: "0 kr",
    normalYear: "0 kr",
    bullets: ["Innlogging og enkel profil", "Begrenset katalogutdrag", "Enkel ønskeliste"],
  },
  {
    tier: "Bronze",
    label: "Samler",
    priceMonth: "149-199 kr",
    priceYear: "1 790-2 390 kr",
    normalMonth: "ca. 224-299 kr/mnd",
    normalYear: "ca. 2 685-3 585 kr/år",
    bullets: ["Hjerte og stjerne", "Grunnleggende Min samling", "Enkel markedsverdi"],
  },
  {
    tier: "Silver",
    label: "Aktiv samler",
    priceMonth: "250 kr",
    priceYear: "3 000-6 000 kr",
    normalMonth: "ca. 375-750 kr/mnd",
    normalYear: "ca. 4 500-9 000 kr/år",
    bullets: ["Flere katalogfilter", "Mer historikk", "Mer markedsdata"],
  },
  {
    tier: "Gold",
    label: "Avansert",
    priceMonth: "833-1 667 kr",
    priceYear: "10 000-20 000 kr",
    normalMonth: "ca. 1 250-2 500 kr/mnd",
    normalYear: "ca. 15 000-30 000 kr/år",
    bullets: ["Nesten full tilgang", "Auksjon og nettbutikk", "Forhandlerrettet rolle"],
  },
  {
    tier: "Platinum",
    label: "Full tilgang",
    priceMonth: "4 167-8 333 kr",
    priceYear: "50 000-100 000 kr",
    normalMonth: "ca. 6 250-12 500 kr/mnd",
    normalYear: "ca. 75 000-150 000 kr/år",
    bullets: ["Alle land og kilder", "Full historikk og finans", "Full index og eksport"],
    dark: true,
  },
];

function imageClass(tone: CatalogItem["imageTone"]) {
  return `${styles.cardImage} ${styles[`image_${tone}`]}`;
}

export default function CollectiumFrontPageClient() {
  const [segment, setSegment] = useState<Segment>("samler");
  const [viewMode, setViewMode] = useState<ViewMode>("standing");
  const [billing, setBilling] = useState<BillingMode>("month");
  const [source, setSource] = useState("all");
  const [objectType, setObjectType] = useState("all");
  const [ruler, setRuler] = useState("all");
  const [year, setYear] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("catalog");

  const filtered = useMemo(() => {
    let rows = [...items].filter((item) => {
      if (source !== "all" && item.source !== source) return false;
      if (objectType !== "all" && item.objectType !== objectType) return false;
      if (ruler !== "all" && item.ruler !== ruler) return false;
      if (year !== "all" && String(item.year) !== year) return false;
      return true;
    });

    rows.sort((a, b) => {
      if (sortMode === "yearAsc") return a.year - b.year;
      if (sortMode === "yearDesc") return b.year - a.year;
      if (sortMode === "valueDesc") return b.valueNumber - a.valueNumber;
      if (sortMode === "trendDesc") return b.trend - a.trend;
      return items.indexOf(a) - items.indexOf(b);
    });

    return rows;
  }, [source, objectType, ruler, year, sortMode]);

  const activeCopy = segmentCopy[segment];

  return (
    <main className={styles.page} data-template="collectium" data-skin="signature-light" data-vp="pc">
      <header className={styles.topbar}>
        <a className={styles.brand} href="#top" aria-label="Collectium forside">
          <img src="/images/brand/Collectium.C Image.0053254.png" alt="" className={styles.brandMark} />
          <span>Collectium</span>
        </a>
        <nav className={styles.nav} aria-label="Hovedmeny">
          <a href="#explore">Utforsk</a>
          <a href="#catalog">Katalog</a>
          <a href="#history">Historie</a>
          <a href="#membership">Medlemskap</a>
        </nav>
        <div className={styles.topActions}>
          <a className={styles.ghostLink} href="/login">Logg inn</a>
          <a className={styles.goldButton} href="/registrering">Bli medlem</a>
        </div>
      </header>

      <section className={styles.hero} id="top">
        <div className={styles.heroText}>
          <p className={styles.kicker}>Anno 1816 - 2026</p>
          <h1>Collectium</h1>
          <p className={styles.heroSub}>Samlerplattformen for norske sedler, mynter, historie og markedsutvikling.</p>
          <p className={styles.heroLead}>Utforsk katalogobjekter, historiske relasjoner, samlingsverdi, auksjoner og forhandlerobjekter samlet i én plattform.</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#catalog">Utforsk katalogen</a>
            <a className={styles.goldButton} href="/registrering">Bli medlem</a>
            <a className={styles.secondaryButton} href="/login">Logg inn</a>
          </div>
        </div>
        <div className={styles.heroImage} aria-label="Bildeområde for Collectium">
          <span>Norske sedler · mynter · arkiv</span>
        </div>
      </section>

      <section className={styles.explore} id="explore">
        <div className={styles.sectionHeader}>
          <p className={styles.roman}>I. Hva vil du utforske</p>
          <h2>Samme katalog, <em>tre perspektiver</em></h2>
          <p>Katalogen kan leses som samlerverktøy, historisk relasjonsplattform eller markedsoversikt.</p>
        </div>
        <div className={styles.exploreGrid}>
          {(["samler", "historie", "finans"] as Segment[]).map((key) => (
            <article key={key} className={styles.infoPanel}>
              <p className={styles.panelKicker}>{segmentCopy[key].title}</p>
              <h3>{segmentCopy[key].boxes[0].title}</h3>
              <p>{segmentCopy[key].lead}</p>
              <div className={styles.signature}>Collectium</div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.catalog} id="catalog">
        <div className={styles.sectionHeader}>
          <p className={styles.roman}>II. Katalog</p>
          <h2>Norske sedler og mynter, <em>én relasjonskatalog</em></h2>
          <p>Visningskortene følger fast struktur: overskrift, valørutgave, variant, sjeldenhet, kvalitet og ett dynamisk felt.</p>
        </div>

        <div className={styles.catalogShell}>
          <aside className={styles.filterPanel}>
            <p className={styles.panelKicker}>Filtrér</p>
            <label>
              Kilde
              <select value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="all">Alle kilder</option>
                <option value="Norske sedler">Norske sedler</option>
                <option value="Norske mynter">Norske mynter</option>
              </select>
            </label>
            <label>
              Objekttype
              <select value={objectType} onChange={(e) => setObjectType(e.target.value)}>
                <option value="all">Alle objektgrupper</option>
                <option value="Seddel">Seddel</option>
                <option value="Mynt">Mynt</option>
              </select>
            </label>
            <label>
              Konge / regent
              <select value={ruler} onChange={(e) => setRuler(e.target.value)}>
                <option value="all">Alle regenter</option>
                <option value="Haakon VII">Haakon VII</option>
                <option value="Oscar II">Oscar II</option>
              </select>
            </label>
            <label>
              Årstall
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="all">Alle år</option>
                {[...new Set(items.map((item) => item.year))].sort().map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
            <div className={styles.filterCount}>
              <span>Treff i preview</span>
              <strong>{filtered.length}</strong>
            </div>
            <div className={styles.activeNote}>
              <p className={styles.panelKicker}>Aktiv visning · {activeCopy.title}</p>
              <p>{activeCopy.lead}</p>
            </div>
          </aside>

          <div className={styles.resultsPanel}>
            <div className={styles.resultToolbar}>
              <div className={styles.segmentSwitch} aria-label="Segment">
                {(["samler", "historie", "finans"] as Segment[]).map((key) => (
                  <button key={key} type="button" className={segment === key ? styles.active : ""} onClick={() => setSegment(key)}>
                    {segmentCopy[key].title}
                  </button>
                ))}
              </div>
              <div className={styles.viewSwitch} aria-label="Visning">
                <button type="button" className={viewMode === "standing" ? styles.active : ""} onClick={() => setViewMode("standing")}>Stående kort</button>
                <button type="button" className={viewMode === "list" ? styles.active : ""} onClick={() => setViewMode("list")}>Liste</button>
              </div>
              <label className={styles.sortLabel}>
                Sorter
                <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)}>
                  <option value="catalog">Katalogrekkefølge</option>
                  <option value="yearAsc">År eldste først</option>
                  <option value="yearDesc">År nyeste først</option>
                  <option value="valueDesc">Høyest verdi</option>
                  <option value="trendDesc">Sterkest trend</option>
                </select>
              </label>
            </div>

            <div className={styles.segmentBoxes}>
              {activeCopy.boxes.map((box) => (
                <div key={box.title}>
                  <p className={styles.panelKicker}>{box.title}</p>
                  <p>{box.body}</p>
                </div>
              ))}
            </div>

            <div className={viewMode === "standing" ? styles.cardGrid : styles.listGrid}>
              {filtered.map((item) => (
                <article key={`${item.title}-${item.year}`} className={viewMode === "standing" ? styles.objectCard : styles.objectListCard}>
                  <div className={imageClass(item.imageTone)}>
                    <span>{item.objectType} · {item.source}</span>
                  </div>
                  <div className={styles.objectBody}>
                    <h3>{item.title}</h3>
                    <dl className={styles.coreMeta}>
                      <div><dt>Valørutgave</dt><dd>{item.core.denominationIssue}</dd></div>
                      <div><dt>Variant</dt><dd>{item.core.variant}</dd></div>
                      <div><dt>Sjeldenhet</dt><dd>{item.core.rarity}</dd></div>
                      <div><dt>Kvalitet</dt><dd>{item.core.quality}</dd></div>
                    </dl>
                    <div className={styles.dynamicField}>
                      <p className={styles.panelKicker}>{item.segment[segment].label}</p>
                      <p>{item.segment[segment].text}</p>
                      <ul>
                        <li>{item.segment[segment].metaA}</li>
                        <li>{item.segment[segment].metaB}</li>
                        <li>{item.segment[segment].metaC}</li>
                      </ul>
                    </div>
                    <ActionPanel item={item} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.membership} id="membership">
        <div className={styles.sectionHeader}>
          <p className={styles.roman}>III. Medlemskap</p>
          <h2>Medlemskap er <em>tilgangsmotoren</em></h2>
          <p>Medlemsnivået bestemmer hvor mye brukeren kan se, analysere og gjøre i katalog, samling, historikk, finans, index, auksjon og deling.</p>
        </div>

        <div className={styles.billingSwitch}>
          <button type="button" className={billing === "month" ? styles.active : ""} onClick={() => setBilling("month")}>Mnd</button>
          <button type="button" className={billing === "year" ? styles.active : ""} onClick={() => setBilling("year")}>År</button>
        </div>

        <div className={styles.planGrid}>
          {plans.map((plan) => (
            <article key={plan.tier} className={`${styles.planCard} ${plan.dark ? styles.planDark : ""}`}>
              <p className={styles.panelKicker}>{plan.label}</p>
              <h3>{plan.tier}</h3>
              <div className={styles.offerPrice}>
                <strong>{billing === "month" ? plan.priceMonth : plan.priceYear}</strong>
                <span>{plan.tier === "Free" ? "" : billing === "month" ? " mnd intro" : " år intro"}</span>
              </div>
              <p className={styles.normalPrice}>Ordinær pris: {billing === "month" ? plan.normalMonth : plan.normalYear}</p>
              <ul>
                {plan.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
              <div className={styles.signature}>Collectium</div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.registerSection}>
        <img src="/images/famile-collectium.webp" alt="Familie som organiserer samling" />
        <div className={styles.registerOverlay}>
          <p className={styles.roman}>IV. Start samlingen</p>
          <h2>Registrer deg i dag</h2>
          <p>Få oversikt over samling, historikk, dokumentasjon og markedsutvikling i ett samlet Collectium-miljø.</p>
          <div className={styles.heroActions}>
            <a className={styles.goldButton} href="/registrering">Registrer deg</a>
            <a className={styles.secondaryDarkButton} href="/medlemskap">Se medlemskap</a>
          </div>
        </div>
      </section>
    </main>
  );
}

function ActionPanel({ item }: { item: CatalogItem }) {
  return (
    <div className={styles.actionPanel}>
      <div className={styles.actionLeft}>
        <div className={styles.reactions}><span>♡ {item.actions.hearts}</span><span>☆ {item.actions.stars}</span></div>
        <div className={styles.estimateBox}>
          <span>Estimert pris</span>
          <strong>{item.actions.estimate}</strong>
          <span>Status</span>
          <strong>{item.actions.status}</strong>
        </div>
      </div>
      <div className={styles.actionRight}>
        <span>⚒ Auksjon <strong>{item.actions.auction}</strong></span>
        <span>▣ Nettbutikk <strong>{item.actions.shop}</strong></span>
        <span>▤ Samling <strong>{item.actions.collection}</strong></span>
      </div>
    </div>
  );
}
