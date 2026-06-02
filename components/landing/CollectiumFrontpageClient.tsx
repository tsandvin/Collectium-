"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CollectiumFrontpageClient v14
 *
 * Definering / formål:
 * Interaktiv klientkomponent for offentlig Collectium-forside. Forsiden har ikke lokal
 * sidemeny. Sidemeny skal komme fra global innlogget AppShell etter login. Komponentens
 * lokale state brukes til medlemskapsvisning, objektsegment, objektfamilie og offentlig feature-visning.
 * Template, typografi og skjermmodus styres globalt fra PublicTopMenu og lagres i localStorage.
 *
 * Bruksområde:
 * Importeres av app/page.tsx.
 *
 * Berørte sider / routes:
 * - /
 * - /login
 * - /registrering
 * - /katalog
 *
 * Berørte DB-brytere / feature_keys:
 * - landing.view
 * - landing.membership
 * - landing.featured_objects
 * - auth.login
 * - auth.register
 * - catalog.view
 * - catalog.search
 * - catalog.filters
 * - catalog.object.open
 *
 * Berørte API-ruter:
 * - GET /api/landing/summary              (senere)
 * - GET /api/membership/plans             (senere)
 * - GET /api/catalog/search               (senere)
 * - GET /api/catalog/filters              (senere)
 * - POST /api/auth/login                  (senere)
 * - POST /api/auth/register               (senere)
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: landing
 * log_action: view
 */

import { useEffect, useMemo, useState } from "react";
import PublicTopMenu, { type PublicSkin } from "../layout/PublicTopMenu";
import styles from "./collectium-frontpage.module.css";

type Skin = PublicSkin;
type BillingMode = "month" | "year";
type ObjectSegment = "samler" | "historie" | "finans";
type ObjectFamily = "banknote" | "coin";

const featureGroups = [
  {
    title: "Samler",
    icon: "◎",
    text: "Start, organiser og bygg samlingen din med egne lister, hjerte, stjerne og private notater.",
  },
  {
    title: "Organisering av samling",
    icon: "▣",
    text: "Hold oversikt over objekter, kataloger, dokumentasjon, kjøp, salg og samlingsstatus.",
  },
  {
    title: "Verdisettelse & innhold",
    icon: "↗",
    text: "Få markedsverdi, trend, likviditet og objektinnhold knyttet til historikk og katalogdata.",
  },
  {
    title: "Forhandler kontakt",
    icon: "◇",
    text: "Finn godkjente forhandlere, be om vurdering og send objekter videre til salg eller auksjon.",
  },
  {
    title: "Auksjoner",
    icon: "⚒",
    text: "Følg auksjoner, bud, avslutninger og prisobservasjoner som senere styrker markedsdata.",
  },
  {
    title: "Index marked",
    icon: "▰",
    text: "Se utvikling i objekter, valører, materialer, perioder, konger og samlermarkedet over tid.",
  },
  {
    title: "Objekt sammenligning",
    icon: "⇄",
    text: "Sammenlign objekter, kvaliteter, prisobservasjoner og historiske relasjoner på tvers.",
  },
  {
    title: "Historisk-museum modul",
    icon: "▥",
    text: "Utforsk objekter gjennom historiske hendelser, regenter, signaturer, motiv og relasjoner.",
  },
];

const reasons = [
  "Relasjonsbasert katalog med historisk dybde",
  "Samler, Historie og Finans i samme objektvisning",
  "Markedsdata, auksjon og index koblet til samme objektgrunnlag",
  "Forhandlerflyt for vurdering, salg, auksjon og oppgjør",
  "Museum- og historielag for personer, perioder, regenter og motiver",
  "Offentlig landing uten tekniske databasefelt eller intern systemtekst",
];

const plans = [
  {
    name: "Free",
    intro: "0 kr",
    ordinary: "0 kr",
    month: "0 kr",
    year: "0 kr",
    mode: "Gratis",
    text: "Begrenset tilgang for å komme i gang.",
    cta: "Start gratis",
    items: ["Offentlig katalogutdrag", "Begrenset søk", "Medlemskapstilbud"],
  },
  {
    name: "Bronze",
    intro: "149 kr første år",
    ordinary: "199 kr/mnd etterpå",
    month: "149 kr første år",
    year: "149 kr første år",
    mode: "Månedlig etter introår",
    text: "Løpende månedsmedlemskap etter første år.",
    cta: "Velg Bronze",
    items: [
      "Flere katalogfilter",
      "Grunnleggende samling",
      "Hjerte og stjerne",
      "Enkel markedsverdi",
    ],
  },
  {
    name: "Silver",
    intro: "3 000 kr/år tilbud",
    ordinary: "6 000 kr/år eller 500 kr/mnd",
    month: "250 kr/mnd tilbud",
    year: "3 000 kr/år tilbud",
    mode: "Årlig eller månedlig",
    text: "Avansert samler- og analysemedlemskap. Kan vises både som år og måned.",
    cta: "Velg Silver",
    popular: true,
    items: [
      "Avansert katalog",
      "Flere filter",
      "Mer historikk",
      "Samlingsanalyse",
    ],
  },
  {
    name: "Gold",
    intro: "10 000 kr første år",
    ordinary: "20 000 kr/år etterpå",
    month: null,
    year: "10 000 kr første år",
    mode: "Årlig",
    text: "For samlere og aktører som trenger avansert tilgang. Forhandlerregistrering gjøres i eget løp.",
    cta: "Søk Gold",
    items: [
      "Avansert katalog",
      "Marked og index",
      "Forhandler kan søke separat",
      "Kun årsavtale",
    ],
  },
  {
    name: "Platinum",
    intro: "50 000 kr rabattperiode",
    ordinary: "100 000 kr/år",
    month: null,
    year: "50 000 kr / 2 år",
    mode: "Kun årlig",
    text: "50 % rabatt i ett år. Medlemskapet varer i to år.",
    cta: "Kontakt oss",
    items: [
      "Ingen månedlig pris",
      "Alle land og kilder",
      "Full historikk",
      "Profesjonell analyse",
    ],
  },
];

const objectSegments: Record<
  ObjectSegment,
  {
    label: string;
    meta: string;
    chips: string[];
    detailTitle: string;
    detailText: string;
    value: string;
    trend: string;
  }
> = {
  samler: {
    label: "Samler",
    meta: "Min samling · ønskeliste · favoritt",
    chips: ["Hjerte", "Stjerne", "Min samling", "Kjøpspris"],
    detailTitle: "Detaljert objektvisningskort",
    detailText:
      "Det detaljerte objektvisningskortet åpner full objektpresentasjon med bilder, kvalitet, egne notater, samlingsstatus, kjøp, salg, dokumentasjon og deling.",
    value: "15 000 kr",
    trend: "samling",
  },
  historie: {
    label: "Historie",
    meta: "Norges Bank · Haakon VII · etterkrigstid",
    chips: ["Regent", "Utgave", "Signatur", "Motiv"],
    detailTitle: "Detaljert historiekort",
    detailText:
      "Historiekortet viser produsent, utgave, periode, regent, signaturer, personer, materiale, proveniens, funn og relasjoner til andre objekter.",
    value: "Haakon VII",
    trend: "periode",
  },
  finans: {
    label: "Finans",
    meta: "Markedsverdi · trend · prisobservasjoner",
    chips: ["Verdi", "Trend", "Likviditet", "Auksjon"],
    detailTitle: "Detaljert finanskort",
    detailText:
      "Finanskortet viser markedsverdi, trendprosent, likviditet, ferske salg, auksjonsresultater, nettbutikkpriser, kjøpspris, fortjeneste og sammenligning.",
    value: "15 000 kr",
    trend: "↑ +12 %",
  },
};

const objectFamilyMeta: Record<
  ObjectFamily,
  {
    label: string;
    title: string;
    subtitle: string;
    catalog: string;
    imageAlt: string;
  }
> = {
  banknote: {
    label: "Sedler",
    title: "10 kroner 1949 A",
    subtitle: "Norges Bank · Haakon VII · Norske sedler",
    catalog: "NSNR 23a",
    imageAlt: "Animert seddelvisning",
  },
  coin: {
    label: "Mynter",
    title: "2 kroner 1914",
    subtitle: "Sølv · Jubileumsutgave · Norge",
    catalog: "KM 370",
    imageAlt: "Animert myntvisning",
  },
};

const activity = [
  {
    title: "Mest omsatte objekt",
    value: "38 750 kr",
    meta: "10 kroner 1937 Litra A · NSNR 20a",
    trend: "+12 %",
  },
  {
    title: "Mest sette konge",
    value: "Haakon VII",
    meta: "Sett 24 580 ganger",
    trend: "+8 %",
  },
  {
    title: "Mest populære motiv",
    value: "Riksvåpen",
    meta: "Sett 18 920 ganger",
    trend: "+6 %",
  },
  {
    title: "Markedstrend",
    value: "Index 1 247",
    meta: "Siste 30 dager",
    trend: "+3,6 %",
  },
];

function formatPrice(plan: (typeof plans)[number], billingMode: BillingMode) {
  const value = billingMode === "year" ? plan.year : plan.month;
  if (value === null) return "Kun årlig";
  return value;
}

export default function CollectiumFrontpageClient() {
  const [skin, setSkin] = useState<Skin>("collectium");
  const [billingMode, setBillingMode] = useState<BillingMode>("year");
  const [objectSegment, setObjectSegment] = useState<ObjectSegment>("samler");
  const [objectFamily, setObjectFamily] = useState<ObjectFamily>("banknote");
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setObjectFamily((current) =>
        current === "banknote" ? "coin" : "banknote",
      );
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);

  const selectedObjectSegment = objectSegments[objectSegment];
  const selectedFamily = objectFamilyMeta[objectFamily];
  const selectedFeature = featureGroups[activeFeatureIndex];

  const logoSrc = useMemo(() => {
    if (skin === "museum" || skin === "finans")
      return "/brand/collectium-logo-white.png";
    if (skin === "enkel") return "/brand/collectium-logo-wide.png";
    return "/brand/collectium-logo-dark.png";
  }, [skin]);

  return (
    <main className={`${styles.page} ${styles[skin]}`} data-skin={skin} data-template={skin}>
      <PublicTopMenu skin={skin} logoSrc={logoSrc} onSkinChange={setSkin} />

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>
            For samlere · For historien · For markedet
          </p>
          <h1>
            For samlere. Av samlere. <span>Alt på ett sted.</span>
          </h1>
          <p className={styles.lead}>
            Collectium samler katalog, egen samling, verdisettelse, auksjon,
            forhandlerkontakt, index og historiske relasjoner i én strukturert
            plattform.
          </p>
          <div className={styles.heroActions}>
            <a
              className={styles.primaryButton}
              href="/registrering"
              data-feature-key="auth.register"
            >
              Start gratis
            </a>
            <a
              className={styles.ghostButton}
              href="/katalog"
              data-feature-key="catalog.view"
            >
              Se katalog
            </a>
          </div>
          <div className={styles.publicNote}>
            Offentlig forside uten sidemeny. Etter innlogging overtar global
            AppShell og viser sidemenyen.
          </div>
          <div className={styles.heroProofs}>
            <span>Relasjonsbasert katalog</span>
            <span>Oppdatert marked</span>
            <span>Sikker samling</span>
          </div>
        </div>

        <div
          className={styles.heroVisual}
          aria-label="Collectium objektvisning"
        >
          <div className={`${styles.deviceLaptop} ct-signature-frame`}>
            <div className={styles.objectControls}>
              <div
                className={styles.segmentMiniSwitch}
                aria-label="Velg objektkortsegment"
              >
                {(Object.keys(objectSegments) as ObjectSegment[]).map(
                  (segmentKey) => (
                    <button
                      key={segmentKey}
                      type="button"
                      onClick={() => setObjectSegment(segmentKey)}
                      className={
                        objectSegment === segmentKey
                          ? styles.segmentMiniActive
                          : ""
                      }
                    >
                      {objectSegments[segmentKey].label}
                    </button>
                  ),
                )}
              </div>
              <div className={styles.familyTicker} aria-live="polite">
                <span
                  className={
                    objectFamily === "banknote" ? styles.familyTickerActive : ""
                  }
                >
                  Sedler
                </span>
                <span
                  className={
                    objectFamily === "coin" ? styles.familyTickerActive : ""
                  }
                >
                  Mynter
                </span>
              </div>
            </div>

            <div
              className={styles.objectMock}
              data-object-segment={objectSegment}
              data-object-family={objectFamily}
            >
              <div
                className={styles.objectVisualMark}
                aria-label={selectedFamily.imageAlt}
              >
                <img src="/brand/collectium-c-gold.png" alt="Collectium C" />
                <strong>{selectedFamily.label}</strong>
              </div>
              <div className={styles.objectInfo}>
                <strong>{selectedFamily.title}</strong>
                <p>{selectedFamily.subtitle}</p>
                <small>{selectedObjectSegment.meta}</small>
                <div className={styles.mockTags}>
                  <span>{selectedFamily.catalog}</span>
                  {selectedObjectSegment.chips.map((chip) => (
                    <span key={chip}>{chip}</span>
                  ))}
                </div>
                <b>
                  {selectedObjectSegment.value}{" "}
                  <em>{selectedObjectSegment.trend}</em>
                </b>
              </div>
            </div>

            <article className={`${styles.objectDetailCard} ct-signature-frame`}>
              <strong>{selectedObjectSegment.detailTitle}</strong>
              <p>{selectedObjectSegment.detailText}</p>
              <span>
                Detaljert visning åpnes fra katalogkortet når brukeren går
                videre til objektpresentasjon.
              </span>
            </article>
          </div>

          <div className={styles.devicePhone}>
            <img src="/brand/collectium-c-gold.png" alt="Collectium C" />
            <strong>Min samling</strong>
            <span>128 450 kr</span>
            <small>247 objekter</small>
          </div>
        </div>
      </section>

      <section className={styles.featureBand}>
        <div className={styles.sectionHeader}>
          <p>Funksjoner</p>
          <h2>Alt du trenger for å starte, organisere, forstå og selge</h2>
        </div>
        <div className={styles.featureSplit}>
          <div className={styles.featureSwitchList} aria-label="Velg funksjon">
            {featureGroups.map((feature, index) => (
              <button
                key={feature.title}
                type="button"
                onClick={() => setActiveFeatureIndex(index)}
                className={
                  activeFeatureIndex === index ? styles.featureSwitchActive : ""
                }
              >
                <span>{feature.icon}</span>
                <strong>{feature.title}</strong>
              </button>
            ))}
          </div>
          <article className={`${styles.featureContentCard} ct-signature-frame`}>
            <span className={styles.featureContentIcon}>
              {selectedFeature.icon}
            </span>
            <p>Mulighet i Collectium</p>
            <h3>{selectedFeature.title}</h3>
            <p>{selectedFeature.text}</p>
            <small>
              Dette er offentlig introduksjonstekst. Etter innlogging vises
              funksjonen med riktig tilgang, data og global sidemeny.
            </small>
          </article>
        </div>
      </section>

      <section className={styles.splitSection}>
        <div className={styles.sectionHeader}>
          <p>Hvorfor Collectium?</p>
          <h2>En relasjonsplattform, ikke bare en katalog</h2>
        </div>
        <ul className={styles.reasonList}>
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      <section id="medlemskap" className={styles.membershipSection}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <p>Medlemskap</p>
            <h2>Riktige priser og tilgangsnivå</h2>
            <span className={styles.membershipNote}>
              Premium brukes ikke. Platinum finnes ikke som månedlig medlemskap.
            </span>
          </div>
          <div className={styles.billingToggle}>
            <button
              onClick={() => setBillingMode("month")}
              className={billingMode === "month" ? styles.toggleActive : ""}
            >
              Månedlig
            </button>
            <button
              onClick={() => setBillingMode("year")}
              className={billingMode === "year" ? styles.toggleActive : ""}
            >
              Årlig
            </button>
          </div>
        </div>
        <div className={styles.planGrid}>
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`${styles.planCard} ct-signature-frame ${plan.popular ? styles.popularPlan : ""}`}
            >
              {plan.popular && (
                <span className={styles.badge}>Aktiv samler</span>
              )}
              <h3>{plan.name}</h3>
              <p>{plan.text}</p>
              <strong>{formatPrice(plan, billingMode)}</strong>
              <span className={styles.planOrdinary}>{plan.ordinary}</span>
              <small>{plan.mode}</small>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href="/medlemskap">{plan.cta}</a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.activitySection}>
        <div className={styles.sectionHeader}>
          <p>Aktivitet her på Collectium</p>
          <h2>Hva samlersiden følger akkurat nå</h2>
        </div>
        <div className={styles.activityGrid}>
          {activity.map((item) => (
            <article key={item.title} className="ct-signature-frame">
              <span>{item.title}</span>
              <strong>{item.value}</strong>
              <p>{item.meta}</p>
              <em>{item.trend}</em>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.offerSection} ct-signature-frame`}>
        <div>
          <p>Registreringstilbud</p>
          <h2>Nye medlemmer får introduksjonsfordel</h2>
          <span>
            Start gratis, bygg samling og få oversikt over tilbud før du velger
            medlemskap.
          </span>
        </div>
        <form className={styles.signupForm}>
          <input
            type="email"
            placeholder="Din e-postadresse"
            aria-label="E-postadresse"
          />
          <button
            type="button"
            className={styles.primaryButton}
            data-feature-key="auth.register"
          >
            Meld meg på
          </button>
        </form>
        <div className={styles.offerCards}>
          <span>Bronze: 149 kr første år, deretter 199 kr/mnd</span>
          <span>
            Silver: 3 000 kr/år tilbud eller 250 kr/mnd, deretter 6 000 kr/år
            eller 500 kr/mnd
          </span>
          <span>
            Platinum: betal 50 000 kr i rabattperioden og få Platinum i to år
          </span>
        </div>
      </section>

      <footer className={styles.footer}>
        <img src={logoSrc} alt="Collectium" />
        <p>© Collectium 2026 · Katalog · Relasjoner · Verdi</p>
      </footer>
    </main>
  );
}
