"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CatalogWorkspaceClient v22
 *
 * Definering / formal:
 * Relasjonsbasert katalogarbeidsflate som viser kildebaserte katalogdata fra
 * Collectium API/MariaDB-kjeden. React lager ikke egne katalogobjekter eller
 * filterverdier.
 *
 * Dataretning:
 * MariaDB/API -> /api/catalog/* -> CatalogWorkspaceClient -> UI.
 */

import { useEffect, useMemo, useState } from "react";
import styles from "../landing/collectium-frontpage.module.css";

type Segment = "samler" | "historie" | "finans";
type ViewMode = "horizontal" | "standing" | "list";

type CatalogObject = {
  object_id: string | number;
  source_key: string;
  object_group: string;
  collectium_title?: string | null;
  collectium_catalog_meta?: string | null;
  frontend_title?: string | null;
  source_catalog_number?: string | null;
  image_path?: string | null;
  country?: string | null;
  producer?: string | null;
  issuer?: string | null;
  denomination?: string | null;
  variant?: string | null;
  litra?: string | null;
  ruler?: string | null;
  historical_period?: string | null;
  material?: string | null;
  year_label?: string | null;
  market_value_low?: string | number | null;
  market_value_high?: string | number | null;
  value_label?: string | null;
  currency?: string | null;
};

type CatalogFilterValue = {
  source_key: string;
  object_group: string;
  filter_field: string;
  filter_value: string;
  filter_label?: string | null;
  object_count?: number | string | null;
};

type SelectedFilter = {
  field: string;
  value: string;
} | null;

type ApiEnvelope<T> = {
  ok?: boolean;
  data?: T;
  message?: string;
};

const defaultSourceKey = "norske_sedler";
const defaultObjectGroup = "banknote";

const filterTitles: Record<string, string> = {
  country: "Land / omrade",
  ruler: "Regent / konge",
  denomination: "Valor",
  year_label: "Ar / periode",
  litra: "Litra / detalj",
  denomination_issue: "Utgave / serie",
  variant: "Variant / type",
  signature: "Signatur / personer",
  producer: "Produsent / utsteder",
  issuer: "Utsteder",
  historical_period: "Historisk periode",
  material: "Materiale",
  value: "Marked/verdi",
};

function readInitialParams() {
  if (typeof window === "undefined") {
    return {
      sourceKey: defaultSourceKey,
      objectGroup: defaultObjectGroup,
      segment: "samler" as Segment,
      view: "horizontal" as ViewMode,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const segment = params.get("segment");
  const view = params.get("view");

  return {
    sourceKey: params.get("source_key") || defaultSourceKey,
    objectGroup: params.get("object_group") || defaultObjectGroup,
    segment: segment === "historie" || segment === "finans" ? segment : ("samler" as Segment),
    view: view === "standing" || view === "list" ? view : ("horizontal" as ViewMode),
  };
}

function formatCurrency(value: string | number | null | undefined, currency = "NOK") {
  if (value === null || value === undefined || value === "") return "Ikke vurdert";
  const number = typeof value === "number" ? value : Number(String(value).replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(number) || number <= 0) return "Ikke vurdert";
  return new Intl.NumberFormat("nb-NO", { style: "currency", currency, maximumFractionDigits: 0 }).format(number);
}

function objectTitle(object: CatalogObject) {
  return object.collectium_title || object.frontend_title || object.collectium_catalog_meta || object.source_catalog_number || `Objekt ${object.object_id}`;
}

function objectGroupLabel(objectGroup: string) {
  if (objectGroup === "banknote") return "Seddel";
  if (objectGroup === "coin") return "Mynt";
  return objectGroup;
}

function sourceLabel(sourceKey: string) {
  return sourceKey
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getDisplayValue(object: CatalogObject) {
  return object.market_value_high ?? object.market_value_low ?? object.value_label ?? null;
}

function segmentCopy(object: CatalogObject, segment: Segment) {
  const base = [
    object.source_key ? `Kilde: ${sourceLabel(object.source_key)}` : null,
    object.object_group ? `Objekttype: ${objectGroupLabel(object.object_group)}` : null,
    object.source_catalog_number ? `Katalognummer: ${object.source_catalog_number}` : null,
  ].filter(Boolean);

  if (segment === "samler") {
    return [...base, "Samlerfelt viser samling, onske/favoritt og brukerstatus nar API returnerer dette."].join(". ");
  }

  if (segment === "historie") {
    return [
      ...base,
      object.historical_period ? `Historisk periode: ${object.historical_period}` : null,
      object.ruler ? `Regent: ${object.ruler}` : null,
    ].filter(Boolean).join(". ");
  }

  return [
    ...base,
    object.value_label ? `Marked: ${object.value_label}` : null,
    `Verdi: ${formatCurrency(getDisplayValue(object), object.currency ?? "NOK")}`,
  ].filter(Boolean).join(". ");
}

function relationHref(object: CatalogObject, field: string, value: string) {
  const params = new URLSearchParams({
    source_key: object.source_key,
    object_group: object.object_group,
  });
  return `/relasjon/${encodeURIComponent(field)}/${encodeURIComponent(value)}?${params.toString()}`;
}

function relationItems(object: CatalogObject) {
  return [
    ["source_key", sourceLabel(object.source_key)],
    ["country", object.country],
    ["producer", object.producer || object.issuer],
    ["denomination", object.denomination],
    ["year_label", object.year_label],
    ["litra", object.litra],
    ["ruler", object.ruler],
    ["historical_period", object.historical_period],
    ["material", object.material],
  ]
    .filter(([, value]) => typeof value === "string" && value.trim() !== "")
    .map(([field, value]) => ({ field: String(field), value: String(value) }));
}

async function readJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  const json = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || json.ok === false) {
    throw new Error(json.message || "Kunne ikke hente katalogdata.");
  }

  return (json.data ?? ([] as T)) as T;
}

export default function CatalogWorkspaceClient() {
  const initial = useMemo(readInitialParams, []);
  const [sourceKey] = useState(initial.sourceKey);
  const [objectGroup] = useState(initial.objectGroup);
  const [segment, setSegment] = useState<Segment>(initial.segment);
  const [view, setView] = useState<ViewMode>(initial.view);
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState<string | null>("country");
  const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>(null);
  const [objects, setObjects] = useState<CatalogObject[]>([]);
  const [filters, setFilters] = useState<CatalogFilterValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      source_key: sourceKey,
      object_group: objectGroup,
      q: query,
    });

    if (selectedFilter) {
      params.set("filter_field", selectedFilter.field);
      params.set("filter_value", selectedFilter.value);
    }

    setLoading(true);
    setError(null);

    fetch(`/api/catalog/search?${params.toString()}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const json = (await response.json()) as ApiEnvelope<CatalogObject[]>;
        if (!response.ok || json.ok === false) throw new Error(json.message || "Kunne ikke hente katalogobjekter.");
        setObjects(Array.isArray(json.data) ? json.data : []);
      })
      .catch((fetchError: unknown) => {
        if ((fetchError as Error).name !== "AbortError") {
          setObjects([]);
          setError(fetchError instanceof Error ? fetchError.message : "Kunne ikke hente katalogobjekter.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [sourceKey, objectGroup, query, selectedFilter]);

  useEffect(() => {
    const params = new URLSearchParams({ source_key: sourceKey, object_group: objectGroup });
    readJson<CatalogFilterValue[]>(`/api/catalog/filter?${params.toString()}`)
      .then((values) => setFilters(values.filter((filter) => filter.source_key === sourceKey && filter.object_group === objectGroup)))
      .catch(() => setFilters([]));
  }, [sourceKey, objectGroup]);

  const groupedFilters = useMemo(() => {
    const groups = new Map<string, CatalogFilterValue[]>();
    for (const filter of filters) {
      if (!groups.has(filter.filter_field)) groups.set(filter.filter_field, []);
      groups.get(filter.filter_field)?.push(filter);
    }
    return Array.from(groups.entries()).map(([field, values]) => ({ field, values }));
  }, [filters]);

  const totals = useMemo(() => {
    const value = objects.reduce((sum, object) => {
      const raw = getDisplayValue(object);
      const number = typeof raw === "number" ? raw : Number(String(raw ?? 0).replace(/\s/g, "").replace(",", "."));
      return Number.isFinite(number) ? sum + number : sum;
    }, 0);
    return { value, count: objects.length };
  }, [objects]);

  function toggleFilter(field: string, value: string) {
    setSelectedFilter((current) => (current?.field === field && current.value === value ? null : { field, value }));
  }

  const filterPanel = (
    <CatalogFilterPanel
      expandedFilter={expandedFilter}
      setExpandedFilter={setExpandedFilter}
      selectedFilter={selectedFilter}
      filters={groupedFilters}
      toggleFilter={toggleFilter}
      clearFilters={() => setSelectedFilter(null)}
    />
  );

  return (
    <section className={styles.catalogWorkspace} data-view={view} data-segment={segment}>
      <div className={`${styles.catalogHero} ct-panel`}>
        <div>
          <p className={styles.kicker}>Katalog</p>
          <h1>Relasjonsbasert katalog</h1>
          <p>
            Katalogen viser reelle data fra MariaDB/API. Teknisk nokkel er alltid object_id + object_group + source_key.
          </p>
        </div>
        <div className={styles.catalogStatusGrid}>
          <span><b>{totals.count}</b> treff</span>
          <span><b>{formatCurrency(totals.value)}</b> estimert verdi</span>
          <span><b>{sourceLabel(sourceKey)}</b> kilde</span>
          <span><b>{objectGroupLabel(objectGroup)}</b> objekttype</span>
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
              <span>Sok</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Sok objekt, valor, regent, signatur eller katalognummer"
                data-feature-key="catalog.search"
              />
            </label>
          </div>

          {error ? <div className={`${styles.catalogNotice} ct-card`}>{error}</div> : null}
          {loading ? <div className={`${styles.catalogNotice} ct-card`}>Henter reelle katalogdata...</div> : null}
          {!loading && !error && objects.length === 0 ? (
            <div className={`${styles.catalogNotice} ct-card`}>Ingen reelle katalogdata ble returnert for valgt kilde og filter.</div>
          ) : null}

          <div className={styles.catalogResultGrid}>
            {objects.map((object) => (
              <CatalogCard key={`${object.source_key}:${object.object_group}:${object.object_id}`} object={object} segment={segment} view={view} />
            ))}
          </div>
        </main>
      </div>

      {filterOpen ? (
        <div className={styles.catalogFilterOverlay} role="dialog" aria-modal="true" onClick={() => setFilterOpen(false)}>
          <div className={`${styles.catalogFilterSheet} ct-card`} onClick={(event) => event.stopPropagation()}>
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
        ["standing", "Staende"],
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
  selectedFilter,
  filters,
  toggleFilter,
  clearFilters,
}: {
  expandedFilter: string | null;
  setExpandedFilter: (key: string | null) => void;
  selectedFilter: SelectedFilter;
  filters: Array<{ field: string; values: CatalogFilterValue[] }>;
  toggleFilter: (field: string, value: string) => void;
  clearFilters: () => void;
}) {
  return (
    <div className={styles.catalogFilterPanel}>
      <div className={styles.catalogFilterHeader}>
        <div>
          <strong>Katalogfilter</strong>
          <small>Kilde-scopet fra API: source_key + object_group + filter_field + filter_value</small>
        </div>
        <button type="button" onClick={clearFilters}>Nullstill</button>
      </div>

      <div className={styles.catalogFilterChips}>
        {selectedFilter ? (
          <button type="button" onClick={clearFilters}>{selectedFilter.value} x</button>
        ) : (
          <span>Ingen valgte filter</span>
        )}
      </div>

      <div className={styles.catalogFilterGroups}>
        {filters.map((group) => {
          const open = expandedFilter === group.field;
          return (
            <section key={group.field} className={styles.catalogFilterGroup}>
              <button type="button" onClick={() => setExpandedFilter(open ? null : group.field)}>
                <span>{filterTitles[group.field] || group.field}</span>
                <b>{group.values.length}</b>
              </button>
              {open ? (
                <div>
                  {group.values.map((filter) => {
                    const checked = selectedFilter?.field === filter.filter_field && selectedFilter.value === filter.filter_value;
                    return (
                      <label key={`${filter.source_key}:${filter.object_group}:${filter.filter_field}:${filter.filter_value}`}>
                        <input type="checkbox" checked={checked} onChange={() => toggleFilter(filter.filter_field, filter.filter_value)} />
                        <span>{filter.filter_label || filter.filter_value}</span>
                        <small>{filter.object_count ?? ""}</small>
                      </label>
                    );
                  })}
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
  const objectHref = `/objekt/${encodeURIComponent(object.source_key)}/${encodeURIComponent(object.object_group)}/${encodeURIComponent(String(object.object_id))}`;
  const relations = relationItems(object);

  return (
    <article className={`${styles.catalogObjectCard} ${styles[`catalogView_${view}`]} ct-card`}>
      <a className={styles.catalogObjectImage} href={objectHref} data-feature-key="catalog.object.open">
        {object.image_path ? <img src={object.image_path} alt="" /> : <span>{objectGroupLabel(object.object_group)}</span>}
        <small>{object.source_catalog_number || object.collectium_catalog_meta || object.object_id}</small>
      </a>

      <div className={styles.catalogObjectMain}>
        <div className={styles.catalogObjectTitleRow}>
          <div>
            <h2>{objectTitle(object)}</h2>
            <p>
              Kilde: {sourceLabel(object.source_key)} - Objekttype: {objectGroupLabel(object.object_group)} - ID: {String(object.object_id)}
            </p>
          </div>
          <div className={styles.catalogObjectActions}>
            <a href={objectHref} data-feature-key="catalog.object.open">Objektpresentasjon</a>
          </div>
        </div>

        <div className={styles.catalogObjectMetaGrid}>
          <span><b>Land</b>{object.country || "Ikke oppgitt"}</span>
          <span><b>Produsent</b>{object.producer || object.issuer || "Ikke oppgitt"}</span>
          <span><b>Ar</b>{object.year_label || "Ikke oppgitt"}</span>
          <span><b>Valor</b>{object.denomination || "Ikke oppgitt"}</span>
          <span><b>Litra</b>{object.litra || "Ikke oppgitt"}</span>
          <span><b>Regent</b>{object.ruler || "Ikke oppgitt"}</span>
        </div>

        <div className={styles.catalogSegmentInfo}>
          <strong>{segment === "samler" ? "Samler" : segment === "historie" ? "Historie" : "Finans"}</strong>
          <p>{segmentCopy(object, segment)}</p>
        </div>

        <div className={styles.catalogRelationLinks}>
          {relations.map((relation) => (
            <a key={`${relation.field}:${relation.value}`} href={relationHref(object, relation.field, relation.value)}>
              {relation.value}
            </a>
          ))}
        </div>
      </div>

      <aside className={styles.catalogObjectMarket}>
        <span>{formatCurrency(getDisplayValue(object), object.currency ?? "NOK")}</span>
        <strong>{object.value_label || "Marked fra API"}</strong>
        <small>{object.source_catalog_number || object.collectium_catalog_meta || "Kildekatalognummer mangler"}</small>
        <em>{object.source_key}:{object.object_group}:{String(object.object_id)}</em>
      </aside>
    </article>
  );
}
