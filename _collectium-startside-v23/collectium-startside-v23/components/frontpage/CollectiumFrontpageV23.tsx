"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CollectiumFrontpageV23
 *
 * Definering / formaal:
 * Levende frontpage-komponent med objektrotasjon, segmentbytte for Samler/Historie/Finans,
 * objektgruppevalg for Sedler/Mynter, historiske kongefelt, forhandlerfelt og medlem CTA.
 *
 * Bruksomraade:
 * Importeres av app/page.tsx. Komponenten definerer ikke global layout, topbar, sidebar,
 * shell, skin eller global bakgrunn. Den leverer kun sideinnhold.
 *
 * Berorte sider / routes:
 * - /
 * - /katalog
 * - /registrering
 * - /login
 * - /min-side
 * - /forhandler
 *
 * Berorte DB-brytere / feature_keys:
 * - landing.view
 * - landing.register
 * - landing.login
 * - landing.featured_objects
 * - catalog.view
 * - catalog.object.open
 * - collection.wishlist.toggle
 * - collection.favorite.toggle
 * - collection.item.add
 *
 * Berorte API-ruter:
 * - Fremtidig: GET /api/frontpage/featured-objects
 * - Fremtidig: GET /api/catalog/object
 * - Fremtidig: POST /api/collection/wishlist/toggle
 * - Fremtidig: POST /api/collection/favorite/toggle
 * - Fremtidig: POST /api/collection/item/add
 *
 * Berorte tabeller / views:
 * - Fremtidig: ct_v_catalog_objects_resolved
 * - Fremtidig: ct_v_catalog_object_titles
 * - Fremtidig: ct_v_catalog_relations
 * - Fremtidig: ct_v_catalog_market_summary
 * - Fremtidig: ct_v_catalog_user_state
 *
 * Dataretning:
 * Kataloggrunnlag -> API/backend -> Next.js -> React -> UI
 *
 * Logging:
 * log_category: landing
 * log_action: featured_object_preview
 *
 * Versjon:
 * CT-COMP-0023 / CHANGE-2026-06-04-0001
 *
 * Endringsregel:
 * Denne komponenten kan byttes/versjoneres uten a endre global app-shell eller globale
 * designfiler. Handlingsknapper er lenker/visuelle CTA-er inntil feature/action-routes er koblet.
 */

import { useEffect, useMemo, useState } from "react";
import styles from "./CollectiumFrontpageV23.module.css";

type SegmentKey = "samler" | "historie" | "finans";
type ObjectGroupKey = "sedler" | "mynter";

type FeaturedObject = {
  objectKey: string;
  group: ObjectGroupKey;
  eyebrow: string;
  title: string;
  subtitle: string;
  catalogNumber: string;
  relationLine: string;
  imageLabel: string;
  imageTone: "blue" | "gold" | "green" | "graphite";
  samlerText: string;
  historieText: string;
  finansText: string;
  specs: Array<{ label: string; value: string }>;
};

const featuredObjects: FeaturedObject[] = [
  {
    objectKey: "norske_sedler-banknote-500-1975",
    group: "sedler",
    eyebrow: "SEDLER",
    title: "500 kroner · 1975",
    subtitle: "Seddelpresentasjon",
    catalogNumber: "Katalognummer vises her",
    relationLine: "Konge · periode · signatur · relasjoner",
    imageLabel: "500 kr",
    imageTone: "blue",
    samlerText:
      "500 kroner 1975 kan legges i Min samling, markeres med hjerte eller stjerne, og brukes som del av brukerens private samleroversikt. Samleren kan registrere kjøpspris, kvalitet, notater og dokumentasjon.",
    historieText:
      "Objektet vises med katalogisk og historisk sammenheng: utgave, periode, produsent, signaturer, materiale og relasjoner til andre objekter i samme kilde eller periode.",
    finansText:
      "Finansdelen viser verdi, trend, utvikling og prisobservasjoner nar datagrunnlaget finnes. Dersom verdi mangler, vises objektet som ikke vurdert, ikke som 0 kr.",
    specs: [
      { label: "Kilde", value: "Norske sedler" },
      { label: "Objekttype", value: "Seddel" },
      { label: "Periode", value: "Moderne norsk pengehistorie" },
      { label: "Status", value: "Katalogobjekt" },
    ],
  },
  {
    objectKey: "norske_sedler-banknote-100-1877",
    group: "sedler",
    eyebrow: "SEDLER",
    title: "100 kroner · 1877",
    subtitle: "Historisk objektpresentasjon",
    catalogNumber: "Katalognummer vises her",
    relationLine: "Utgave · signatur · materiale · relasjoner",
    imageLabel: "100 kr",
    imageTone: "gold",
    samlerText:
      "Et eldre objekt kan brukes til a bygge oversikt over sjeldenhet, kvalitet, egne notater og samlerstatus. Hjerte og stjerne gir rask prioritering uten a endre selve katalogobjektet.",
    historieText:
      "Her kan brukeren se hvordan objektet henger sammen med utgave, produsent, periode, personer, signaturer og andre objekter fra samme historiske lag.",
    finansText:
      "Finansvisningen kan senere vise estimert verdi, trend og prisobservasjoner nar objektet har nok markedsgrunnlag. Manglende verdi skal vises tydelig som ikke vurdert.",
    specs: [
      { label: "Kilde", value: "Norske sedler" },
      { label: "Objekttype", value: "Seddel" },
      { label: "Relasjon", value: "Historisk utgave" },
      { label: "Visning", value: "Samler · Historie · Finans" },
    ],
  },
  {
    objectKey: "norske_sedler-banknote-1-1917-a",
    group: "sedler",
    eyebrow: "SEDLER",
    title: "1 krone · 1917 · Litra A",
    subtitle: "Variant og litra",
    catalogNumber: "Katalognummer vises her",
    relationLine: "Valør · årstall · litra · serie · signatur",
    imageLabel: "1 kr",
    imageTone: "green",
    samlerText:
      "Denne typen objekt viser hvorfor samleren trenger struktur: valør, årstall, litra, serie og variant ma ligge i riktig rekkefolge for a gi god oversikt.",
    historieText:
      "Historiefeltet kan forklare serien, perioden, signaturene og relasjonene til andre varianter. Brukeren skal kunne ga videre til samme serie, samme litra eller samme signatur.",
    finansText:
      "Finansfeltet kan sammenligne verdi mellom varianter og kvaliteter nar registrerte observasjoner finnes. Kjøpspris hører til brukerens egen samling, ikke katalogsannheten.",
    specs: [
      { label: "Valør", value: "1 krone" },
      { label: "Årstall", value: "1917" },
      { label: "Litra", value: "A" },
      { label: "Serie", value: "Valørutgave / serie" },
    ],
  },
  {
    objectKey: "norske_mynter-coin-oscar-ii",
    group: "mynter",
    eyebrow: "MYNTER",
    title: "Mynt · Oscar II-perioden",
    subtitle: "Myntpresentasjon",
    catalogNumber: "Katalognummer vises her",
    relationLine: "Regent · metall · år · relasjoner",
    imageLabel: "Oscar II",
    imageTone: "graphite",
    samlerText:
      "Myntobjekter kan organiseres pa samme mate som sedler: hjerte, stjerne, Min samling, kjøpspris, kvalitet og egne notater.",
    historieText:
      "Oscar II-perioden kan brukes som relasjonspunkt mellom mynter, sedler, regent, periode, materiale og historisk kontekst.",
    finansText:
      "Finansdelen kan senere koble objektet mot metall, kvalitet, trend, prisobservasjoner og sammenligning over tid.",
    specs: [
      { label: "Objekttype", value: "Mynt" },
      { label: "Regent", value: "Oscar II" },
      { label: "Relasjon", value: "Periode og materiale" },
      { label: "Segment", value: "Historie" },
    ],
  },
  {
    objectKey: "norske_mynter-coin-karl-johan",
    group: "mynter",
    eyebrow: "MYNTER",
    title: "Mynt · Karl Johan-perioden",
    subtitle: "Historisk relasjon",
    catalogNumber: "Katalognummer vises her",
    relationLine: "Konge · periode · objektgruppe · relasjoner",
    imageLabel: "Karl Johan",
    imageTone: "gold",
    samlerText:
      "For samlere kan en historisk mynt kobles til egne lister, favoritter, kjøpspris og dokumentasjon, samtidig som objektet beholder sin katalogiske identitet.",
    historieText:
      "Karl Johan kan presenteres som historisk relasjon med tilknyttede objekter, periode, kontekst og videre koblinger i katalogen.",
    finansText:
      "Finansfeltet kan vise utvikling for objektet eller objektgruppen nar reelle observasjoner finnes. Uten grunnlag vises ikke vurdert.",
    specs: [
      { label: "Objekttype", value: "Mynt" },
      { label: "Regent", value: "Karl Johan" },
      { label: "Relasjon", value: "Historisk periode" },
      { label: "Status", value: "Katalogobjekt" },
    ],
  },
];

const segmentLabels: Record<SegmentKey, string> = {
  samler: "Samler",
  historie: "Historie",
  finans: "Finans",
};

export default function CollectiumFrontpageV23() {
  const [activeGroup, setActiveGroup] = useState<ObjectGroupKey>("sedler");
  const [activeSegment, setActiveSegment] = useState<SegmentKey>("historie");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const visibleObjects = useMemo(
    () => featuredObjects.filter((object) => object.group === activeGroup),
    [activeGroup],
  );

  const activeObject = visibleObjects[activeIndex % visibleObjects.length] ?? featuredObjects[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [activeGroup]);

  useEffect(() => {
    if (isPaused || visibleObjects.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleObjects.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [isPaused, visibleObjects.length]);

  const segmentText =
    activeSegment === "samler"
      ? activeObject.samlerText
      : activeSegment === "finans"
        ? activeObject.finansText
        : activeObject.historieText;

  return (
    <main className={styles.frontpage}>
      <section className={`${styles.section} ${styles.heroSection}`} aria-labelledby="collectium-frontpage-title">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Collectium · norske sedler og mynter</p>
          <h1 id="collectium-frontpage-title">Oppdag objektene bak historien</h1>
          <p className={styles.lead}>
            I Collectium bygger vi en digital katalog for norske sedler og mynter med omtrent 3000 objekter.
            Hvert objekt kobles til spesifikasjoner, historie, samlerdata og verdiutvikling.
          </p>
          <div className={styles.heroActions} aria-label="Hovedhandlinger">
            <a className={styles.primaryButton} href="/katalog">Se katalogen</a>
            <a className={styles.secondaryButton} href="/registrering">Bli medlem</a>
            <a className={styles.ghostButton} href="/login">Logg inn</a>
          </div>
        </div>

        <div className={styles.heroPanel} aria-label="Collectium katalogoversikt">
          <div className={styles.collectiumMark}>Collectium C</div>
          <div className={styles.heroStatsGrid}>
            <div>
              <span>Ca.</span>
              <strong>3000</strong>
              <small>objekter</small>
            </div>
            <div>
              <span>3 spor</span>
              <strong>Samler</strong>
              <small>Historie · Finans</small>
            </div>
            <div>
              <span>Kjerne</span>
              <strong>Relasjoner</strong>
              <small>Objekt · person · periode</small>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.objectExplorer}`} aria-labelledby="object-explorer-title">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Levende objektpresentasjon</p>
          <h2 id="object-explorer-title">Utforsk Collectium-katalogen</h2>
          <p>
            Objektet i presentasjonen bytter automatisk. Når objektet byttes, følger overskrift,
            spesifikasjoner og segmenttekst samme objekt.
          </p>
        </div>

        <div className={styles.objectToolbar}>
          <div className={styles.groupSwitch} aria-label="Velg objektgruppe">
            <button
              className={activeGroup === "sedler" ? styles.activeButton : styles.actionButton}
              type="button"
              onClick={() => setActiveGroup("sedler")}
            >
              Sedler
            </button>
            <button
              className={activeGroup === "mynter" ? styles.activeButton : styles.actionButton}
              type="button"
              onClick={() => setActiveGroup("mynter")}
            >
              Mynter
            </button>
          </div>

          <div className={styles.segmentSwitch} aria-label="Velg segment">
            {Object.entries(segmentLabels).map(([key, label]) => (
              <button
                key={key}
                className={activeSegment === key ? styles.segmentActive : styles.segmentButton}
                type="button"
                onClick={() => setActiveSegment(key as SegmentKey)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={styles.objectStage}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <article className={styles.objectCard} aria-live="polite">
            <div className={`${styles.objectImage} ${styles[activeObject.imageTone]}`}>
              <span>{activeObject.eyebrow}</span>
              <strong>{activeObject.imageLabel}</strong>
              <small>Seddel / mynt</small>
            </div>

            <div className={styles.objectContent}>
              <div className={styles.objectTitleRow}>
                <div>
                  <p className={styles.kicker}>{activeObject.eyebrow}</p>
                  <h3>{activeObject.title}</h3>
                  <p className={styles.objectSubtitle}>{activeObject.subtitle}</p>
                </div>
                <div className={styles.rotationDots} aria-label="Objektrotasjon">
                  {visibleObjects.map((object, index) => (
                    <button
                      key={object.objectKey}
                      className={index === activeIndex ? styles.dotActive : styles.dot}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Vis ${object.title}`}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.metaLine}>
                <span>Kilde · objektgruppe · objekt-ID</span>
                <span>{activeObject.relationLine}</span>
                <span>{activeObject.catalogNumber}</span>
              </div>

              <div className={styles.objectActions} aria-label="Objekthandlinger">
                <a className={styles.iconButton} href="/login" title="Hjerte - marker objektet som favoritt">① ♡ Hjerte</a>
                <a className={styles.iconButton} href="/login" title="Stjerne - marker objektet som spesielt interessant">② ★ Stjerne</a>
                <a className={styles.iconButtonStrong} href="/min-side" title="Min samling - legg objektet til din personlige samling">③ + Min samling</a>
              </div>

              <div className={styles.segmentPanel}>
                <div className={styles.segmentPanelHeader}>
                  <span>{segmentLabels[activeSegment]}</span>
                  <strong>{activeObject.title}</strong>
                </div>
                <p>{segmentText}</p>
              </div>

              <div className={styles.specGrid}>
                {activeObject.specs.map((spec) => (
                  <div key={`${activeObject.objectKey}-${spec.label}`}>
                    <span>{spec.label}</span>
                    <strong>{spec.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <aside className={styles.collectionPreview} aria-label="Min samling preview">
            <p className={styles.kicker}>Collectium</p>
            <h3>Min samling</h3>
            <p>
              Bygg din egen samling, marker objekter med hjerte eller stjerne, registrer kjøpspris,
              og følg utviklingen over tid.
            </p>
            <a className={styles.primaryButtonSmall} href="/registrering">Bli medlem</a>
            <div className={styles.collectionMiniList}>
              <span>♡ Ønskeliste</span>
              <span>★ Favoritter</span>
              <span>+ Egne objekter</span>
              <span>kr Kjøpspris</span>
            </div>
          </aside>
        </div>
      </section>

      <section className={`${styles.section} ${styles.historyGrid}`} aria-labelledby="history-title">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Historiske relasjoner</p>
          <h2 id="history-title">Konger, perioder og objekter</h2>
          <p>
            Collectium skal gjøre det mulig a ga fra objekt til person, fra person til periode,
            og videre til andre objekter i samme historiske sammenheng.
          </p>
        </div>

        <article className={styles.historyCard}>
          <div className={`${styles.portrait} ${styles.oscarPortrait}`}>Oscar II</div>
          <div>
            <p className={styles.kicker}>Kongefelt</p>
            <h3>Oscar II</h3>
            <p>
              Oscar II kan vises som historisk relasjon med objekter, periode, motiv, materiale,
              katalogkoblinger og videre lenker til sedler og mynter fra samme kontekst.
            </p>
            <a className={styles.textButton} href="/katalog">Se relaterte objekter</a>
          </div>
        </article>

        <article className={styles.historyCard}>
          <div className={`${styles.portrait} ${styles.karlPortrait}`}>Karl Johan</div>
          <div>
            <p className={styles.kicker}>Kongefelt</p>
            <h3>Karl Johan</h3>
            <p>
              Karl Johan kan brukes som relasjonspunkt mellom historisk periode, objektgruppe,
              regent, land, utgave og katalogobjekter i samlingen.
            </p>
            <a className={styles.textButton} href="/katalog">Utforsk perioden</a>
          </div>
        </article>
      </section>

      <section className={`${styles.section} ${styles.dealerSection}`} aria-labelledby="dealer-title">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Forhandlerposisjon</p>
          <h2 id="dealer-title">Bedre presentasjon av objekter i markedet</h2>
        </div>

        <div className={styles.dealerGrid}>
          <article className={styles.dealerCard}>
            <h3>Forhandler med sterkere objektgrunnlag</h3>
            <p>
              Forhandlere kan presentere objekter med mer enn en vanlig salgsannonse:
              spesifikasjoner, historikk, kvalitet, relasjoner, marked og dokumentasjon samlet i ett uttrykk.
            </p>
            <a className={styles.secondaryButtonSmall} href="/forhandler">Forhandler</a>
          </article>

          <article className={styles.dealerCard}>
            <h3>Fra objekt til auksjon og nettbutikk</h3>
            <p>
              Et objekt kan vises som katalogobjekt, samlerobjekt, forhandlerobjekt eller salgsobjekt,
              uten at den historiske og katalogiske identiteten forsvinner.
            </p>
            <a className={styles.secondaryButtonSmall} href="/katalog">Se katalog</a>
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.memberCta}`} aria-labelledby="member-title">
        <div className={styles.memberImage} aria-hidden="true">
          <div className={styles.albumStack} />
          <div className={styles.noteCard}>Hva har jeg egentlig?</div>
          <div className={styles.coinTray}>Sedler · mynter · notater</div>
        </div>
        <div className={styles.memberCopy}>
          <p className={styles.kicker}>Bli medlem</p>
          <h2 id="member-title">Har du en samling, men mangler oversikt?</h2>
          <p>
            Mange samlere har objekter i album, esker, permer og skuffer. Collectium skal gjøre det enklere
            a organisere samlingen, forsta historien bak objektene og følge utviklingen over tid.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="/registrering">Bli medlem</a>
            <a className={styles.ghostButton} href="/medlemskap">Se medlemskap</a>
          </div>
        </div>
      </section>
    </main>
  );
}
