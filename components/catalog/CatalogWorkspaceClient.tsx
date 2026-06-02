"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CatalogWorkspaceClient v22
 *
 * Definering / formål:
 * Relasjonsbasert katalogarbeidsflate med app-sidepanel, toppmeny gjennom CollectiumAppShell,
 * segmentene Samler/Historie/Finans, view-switch, desktop sidefilter og mobil filter-lag/overlay.
 * Dette er demo-/frontendlag som senere skal kobles til DB 8.4, MariaDB og ekte katalog-API.
 *
 * Bruksområde:
 * Brukes av /katalog inne i innlogget Collectium-appshell.
 *
 * Berørte sider / routes:
 * - /katalog
 * - /objekt/[sourceKey]/[objectGroup]/[objectId]
 * - /relasjon/[relationType]/[relationValue]
 *
 * Berørte DB-brytere / feature_keys:
 * - catalog.view
 * - catalog.search
 * - catalog.filters
 * - catalog.object.open
 * - catalog.segment.collector
 * - catalog.segment.history
 * - catalog.segment.finance
 * - collection.wishlist.toggle
 * - collection.favorite.toggle
 * - collection.item.add
 * - auction.view
 * - shop.view
 *
 * Dataretning:
 * MariaDB/API senere -> CatalogWorkspaceClient -> UI.
 */

import { useMemo, useState } from "react";
import styles from "../landing/collectium-frontpage.module.css";

type Segment = "samler" | "historie" | "finans";
type ViewMode = "horizontal" | "standing" | "list";
type FilterKey =
  | "country"
  | "source"
  | "objectGroup"
  | "producer"
  | "issue"
  | "year"
  | "denomination"
  | "litra"
  | "variant"
  | "signature"
  | "ruler"
  | "market"
  | "auction"
  | "shop"
  | "collection";

type CatalogObject = {
  id: string;
  sourceKey: string;
  objectGroup: "banknote" | "coin";
  country: string;
  countryCode: string;
  sourceName: string;
  producer: string;
  title: string;
  catalogNumber: string;
  denomination: string;
  year: string;
  issue: string;
  litra: string;
  variant: string;
  signature: string;
  ruler: string;
  rarity: string;
  grade: string;
  value: number | null;
  trend: number | null;
  trendPeriod: string;
  imageLabel: string;
  relationCount: number;
  auctionStatus: "Aktiv" | "Ingen" | "Kommende";
  shopStatus: "Aktiv" | "Ingen";
  collectionStatus: "I min samling" | "Ønskeliste" | "Ikke lagret";
  historyText: string;
  collectorText: string;
  financeText: string;
};

const filterGroups: Array<{ key: FilterKey; label: string; values: string[] }> = [
  { key: "country", label: "Land / område", values: ["Norge", "Sverige", "Danmark", "USA"] },
  { key: "source", label: "Kilde", values: ["Norske sedler", "Norske mynter", "Museum/import", "Privat samling"] },
  { key: "objectGroup", label: "Objekttype", values: ["Seddel", "Mynt", "Medalje", "Dokument"] },
  { key: "producer", label: "Produsent", values: ["Norges Bank", "Den Kongelige Mynt", "Privat utsteder"] },
  { key: "issue", label: "Utgave / serie", values: ["1. utgave", "1917-serien", "Skillemyntseddel", "Haakon VII"] },
  { key: "year", label: "År / periode", values: ["1877", "1905", "1917", "1941", "1950"] },
  { key: "denomination", label: "Valør", values: ["1 krone", "2 kroner", "100 kroner", "10 øre"] },
  { key: "litra", label: "Litra / detalj", values: ["A", "B", "Blank", "Type 1"] },
  { key: "variant", label: "Variant / type", values: ["Standard", "Prøvetrykk", "Sikkerhetspapir", "Sølv"] },
  { key: "signature", label: "Signatur / personer", values: ["S. Cederholm", "Getz Wold", "Wingård", "Haakon VII"] },
  { key: "ruler", label: "Regent / konge", values: ["Haakon VII", "Oscar II", "Christian X"] },
  { key: "market", label: "Marked", values: ["Med verdi", "Mangler verdi", "Stigende", "Fallende"] },
  { key: "auction", label: "Auksjon", values: ["Aktiv auksjon", "Kommende", "Tidligere solgt"] },
  { key: "shop", label: "Nettbutikk", values: ["Aktiv", "Kontakt forhandler", "Ikke i butikk"] },
  { key: "collection", label: "Samling", values: ["I min samling", "Ønskeliste", "Favoritt", "Ikke lagret"] },
];

const catalogObjects: CatalogObject[] = [
  {
    id: "ns-001",
    sourceKey: "norske_sedler",
    objectGroup: "banknote",
    country: "Norge",
    countryCode: "NO",
    sourceName: "Norske sedler",
    producer: "Norges Bank",
    title: "1 krone · 1917-serien · Litra A",
    catalogNumber: "NSNR 23a",
    denomination: "1 krone",
    year: "1917",
    issue: "Skillemyntseddel - Type 1",
    litra: "A",
    variant: "Seddel Type 1",
    signature: "S. Cederholm",
    ruler: "Haakon VII",
    rarity: "Sjelden",
    grade: "VF",
    value: 8400,
    trend: 8.4,
    trendPeriod: "12 mnd",
    imageLabel: "Seddel",
    relationCount: 18,
    auctionStatus: "Aktiv",
    shopStatus: "Ingen",
    collectionStatus: "Ønskeliste",
    collectorText: "Ønskeliste, følger auksjon, 3 lignende objekter i private samlinger.",
    historyText: "Relasjon til 1917-serien, Norges Bank, Haakon VII-perioden og norsk krigs-/pengehistorie.",
    financeText: "Ferske observasjoner gir stigende trend. 0 kr vises aldri som verdi; manglende verdi vises som ikke vurdert.",
  },
  {
    id: "ns-100",
    sourceKey: "norske_sedler",
    objectGroup: "banknote",
    country: "Norge",
    countryCode: "NO",
    sourceName: "Norske sedler",
    producer: "Norges Bank",
    title: "100 kroner · 1. utgave · 1877",
    catalogNumber: "NSNR 1",
    denomination: "100 kroner",
    year: "1877",
    issue: "1. utgave",
    litra: "Blank",
    variant: "Standardutgave",
    signature: "Getz Wold",
    ruler: "Oscar II",
    rarity: "Meget sjelden",
    grade: "F",
    value: 186000,
    trend: 14.2,
    trendPeriod: "24 mnd",
    imageLabel: "Banknote",
    relationCount: 32,
    auctionStatus: "Kommende",
    shopStatus: "Ingen",
    collectionStatus: "Ikke lagret",
    collectorText: "Ikke lagret. Kan følges, sammenlignes og legges i ønskeliste.",
    historyText: "Knyttet til 1. utgave, Norges Bank og unionstidens økonomiske kontekst.",
    financeText: "Høy verdi, lav likviditet og få prisobservasjoner. Egnet for finans-/indexsammenligning.",
  },
  {
    id: "coin-1914",
    sourceKey: "norske_mynter",
    objectGroup: "coin",
    country: "Norge",
    countryCode: "NO",
    sourceName: "Norske mynter",
    producer: "Den Kongelige Mynt",
    title: "2 kroner · Jubileumsutgave · 1914",
    catalogNumber: "NM 1914-2KR",
    denomination: "2 kroner",
    year: "1914",
    issue: "Jubileumsutgave",
    litra: "-",
    variant: "Sølv",
    signature: "Gravør",
    ruler: "Haakon VII",
    rarity: "Normal+",
    grade: "XF",
    value: 2200,
    trend: 5.1,
    trendPeriod: "12 mnd",
    imageLabel: "Mynt",
    relationCount: 11,
    auctionStatus: "Ingen",
    shopStatus: "Aktiv",
    collectionStatus: "I min samling",
    collectorText: "I min samling med registrert kjøpspris og kvalitet. Kan vises i samlingsanalyse.",
    historyText: "Relasjon til jubileum, materiale sølv, Haakon VII og norsk numismatikk.",
    financeText: "Moderat trend, høyere likviditet enn sjeldne sedler, kan sammenlignes med sølvpris.",
  },
];

function formatCurrency(value: number | null) {
  if (value === null) return "Ikke vurdert";
  return new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 }).format(value);
}

function segmentCopy(object: CatalogObject, segment: Segment) {
  if (segment === "samler") return object.collectorText;
  if (segment === "historie") return object.historyText;
  return object.financeText;
}

export default function CatalogWorkspaceClient() {
  const [segment, setSegment] = useState<Segment>("samler");
  const [view, setView] = useState<ViewMode>("horizontal");
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState<FilterKey | null>("country");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    country: ["Norge"],
    source: ["Norske sedler"],
  });

  const filteredObjects = useMemo(() => {
    return catalogObjects.filter((object) => {
      const country = selectedFilters.country || [];
      const source = selectedFilters.source || [];
      const group = selectedFilters.objectGroup || [];
      if (country.length && !country.includes(object.country)) return false;
      if (source.length && !source.includes(object.sourceName)) return false;
      if (group.length) {
        const label = object.objectGroup === "banknote" ? "Seddel" : "Mynt";
        if (!group.includes(label)) return false;
      }
      return true;
    });
  }, [selectedFilters]);

  const totals = useMemo(() => {
    const value = filteredObjects.reduce((sum, object) => sum + (object.value || 0), 0);
    const relations = filteredObjects.reduce((sum, object) => sum + object.relationCount, 0);
    const auction = filteredObjects.filter((object) => object.auctionStatus !== "Ingen").length;
    return { value, relations, auction, count: filteredObjects.length };
  }, [filteredObjects]);

  function toggleFilter(key: FilterKey, value: string) {
    setSelectedFilters((current) => {
      const existing = current[key] || [];
      const next = existing.includes(value) ? existing.filter((item) => item !== value) : [...existing, value];
      return { ...current, [key]: next };
    });
  }

  function removeChip(key: string, value: string) {
    setSelectedFilters((current) => ({ ...current, [key]: (current[key] || []).filter((item) => item !== value) }));
  }

  const filterPanel = (
    <CatalogFilterPanel
      expandedFilter={expandedFilter}
      setExpandedFilter={setExpandedFilter}
      selectedFilters={selectedFilters}
      toggleFilter={toggleFilter}
      removeChip={removeChip}
      clearFilters={() => setSelectedFilters({})}
    />
  );

  return (
    <section className={styles.catalogWorkspace} data-view={view} data-segment={segment}>
      <div className={`${styles.catalogHero} ct-panel`}>
        <div>
          <p className={styles.kicker}>Katalog</p>
          <h1>Relasjonsbasert katalog</h1>
          <p>
            Start med land, kilde og objekttype. Katalogen kobler Samler, Historie, Finans, Auksjon og Nettbutikk i samme arbeidsflate.
          </p>
        </div>
        <div className={styles.catalogStatusGrid}>
          <span><b>{totals.count}</b> treff</span>
          <span><b>{formatCurrency(totals.value)}</b> estimert verdi</span>
          <span><b>{totals.relations}</b> relasjoner</span>
          <span><b>{totals.auction}</b> auksjon</span>
        </div>
      </div>

      <div className={styles.catalogMobileTopbar}>
        <button type="button" onClick={() => setFilterOpen(true)} data-feature-key="catalog.filters">Filter</button>
        <SegmentSwitch segment={segment} setSegment={setSegment} />
      </div>

      <div className={styles.catalogBody}>
        <aside className={`${styles.catalogDesktopFilter} ct-card`}>{filterPanel}</aside>

        <main className={styles.catalogResultsArea}>
          <div className={`${styles.catalogToolbar} ct-card`}>
            <div>
              <SegmentSwitch segment={segment} setSegment={setSegment} />
              <ViewSwitch view={view} setView={setView} />
            </div>
            <label className={styles.catalogSearchField}>
              <span>Søk</span>
              <input placeholder="Søk objekt, valør, regent, signatur eller katalognummer" data-feature-key="catalog.search" />
            </label>
          </div>

          <div className={styles.catalogResultGrid}>
            {filteredObjects.map((object) => (
              <CatalogCard key={object.id} object={object} segment={segment} view={view} />
            ))}
          </div>
        </main>
      </div>

      {filterOpen ? (
        <div className={styles.catalogFilterOverlay} role="dialog" aria-modal="true">
          <div className={`${styles.catalogFilterSheet} ct-card`}>
            <div className={styles.catalogFilterSheetTop}>
              <strong>Filter</strong>
              <button type="button" onClick={() => setFilterOpen(false)}>Lukk</button>
            </div>
            {filterPanel}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function SegmentSwitch({ segment, setSegment }: { segment: Segment; setSegment: (segment: Segment) => void }) {
  return (
    <div className={styles.catalogSegmentSwitch}>
      {[
        ["samler", "Samler"],
        ["historie", "Historie"],
        ["finans", "Finans"],
      ].map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setSegment(key as Segment)}
          className={segment === key ? styles.catalogSwitchActive : ""}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ViewSwitch({ view, setView }: { view: ViewMode; setView: (view: ViewMode) => void }) {
  return (
    <div className={styles.catalogViewSwitch}>
      {[
        ["horizontal", "Horisontal"],
        ["standing", "Stående"],
        ["list", "Liste"],
      ].map(([key, label]) => (
        <button key={key} type="button" onClick={() => setView(key as ViewMode)} className={view === key ? styles.catalogSwitchActive : ""}>
          {label}
        </button>
      ))}
    </div>
  );
}

function CatalogFilterPanel({
  expandedFilter,
  setExpandedFilter,
  selectedFilters,
  toggleFilter,
  removeChip,
  clearFilters,
}: {
  expandedFilter: FilterKey | null;
  setExpandedFilter: (key: FilterKey | null) => void;
  selectedFilters: Record<string, string[]>;
  toggleFilter: (key: FilterKey, value: string) => void;
  removeChip: (key: string, value: string) => void;
  clearFilters: () => void;
}) {
  const chips = Object.entries(selectedFilters).flatMap(([key, values]) => values.map((value) => ({ key, value })));

  return (
    <div className={styles.catalogFilterPanel}>
      <div className={styles.catalogFilterHeader}>
        <div>
          <strong>Katalogfilter</strong>
          <small>Land først, deretter kilde og objekttype</small>
        </div>
        <button type="button" onClick={clearFilters}>Nullstill</button>
      </div>

      <div className={styles.catalogFilterChips}>
        {chips.length ? chips.map((chip) => (
          <button key={`${chip.key}-${chip.value}`} type="button" onClick={() => removeChip(chip.key, chip.value)}>
            {chip.value} ×
          </button>
        )) : <span>Ingen valgte filter</span>}
      </div>

      <div className={styles.catalogFilterGroups}>
        {filterGroups.map((group) => {
          const selected = selectedFilters[group.key] || [];
          const open = expandedFilter === group.key;
          return (
            <section key={group.key} className={styles.catalogFilterGroup}>
              <button type="button" onClick={() => setExpandedFilter(open ? null : group.key)}>
                <span>{group.label}</span>
                <b>{selected.length ? selected.length : group.values.length}</b>
              </button>
              {open ? (
                <div>
                  {group.values.map((value) => (
                    <label key={value}>
                      <input type="checkbox" checked={selected.includes(value)} onChange={() => toggleFilter(group.key, value)} />
                      <span>{value}</span>
                      <small>{Math.max(1, value.length * 3)}</small>
                    </label>
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function CatalogCard({ object, segment, view }: { object: CatalogObject; segment: Segment; view: ViewMode }) {
  return (
    <article className={`${styles.catalogObjectCard} ${styles[`catalogView_${view}`]} ct-card`}>
      <a className={styles.catalogObjectImage} href={`/objekt/${object.sourceKey}/${object.objectGroup}/${object.id}`} data-feature-key="catalog.object.open">
        <span>{object.imageLabel}</span>
        <small>{object.catalogNumber}</small>
      </a>

      <div className={styles.catalogObjectMain}>
        <div className={styles.catalogObjectTitleRow}>
          <div>
            <h2>{object.title}</h2>
            <p>{object.country} · {object.sourceName} · {object.producer}</p>
          </div>
          <div className={styles.catalogObjectActions}>
            <button type="button" data-feature-key="collection.wishlist.toggle">♡</button>
            <button type="button" data-feature-key="collection.favorite.toggle">★</button>
          </div>
        </div>

        <div className={styles.catalogObjectMetaGrid}>
          <span><b>År</b>{object.year}</span>
          <span><b>Valør</b>{object.denomination}</span>
          <span><b>Litra</b>{object.litra}</span>
          <span><b>Variant</b>{object.variant}</span>
          <span><b>Regent</b>{object.ruler}</span>
          <span><b>Sjeldenhet</b>{object.rarity}</span>
        </div>

        <div className={styles.catalogSegmentInfo}>
          <strong>{segment === "samler" ? "Samler" : segment === "historie" ? "Historie" : "Finans"}</strong>
          <p>{segmentCopy(object, segment)}</p>
        </div>
      </div>

      <aside className={styles.catalogObjectMarket}>
        <span>{formatCurrency(object.value)}</span>
        <strong>{object.trend === null ? "Trend mangler" : `${object.trend > 0 ? "▲" : "▼"} ${Math.abs(object.trend)}%`}</strong>
        <small>{object.trendPeriod}</small>
        <em>{object.auctionStatus !== "Ingen" ? object.auctionStatus : object.shopStatus !== "Ingen" ? "Nettbutikk" : object.collectionStatus}</em>
      </aside>
    </article>
  );
}
