"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CatalogWorkspaceClient v23
 *
 * Definering / formål:
 * Relasjonsbasert katalogarbeidsflate som viser kildebaserte katalogdata fra
 * Collectium API/MariaDB-kjeden. React lager ikke egne katalogobjekter eller
 * filterverdier.
 *
 * Dataretning:
 * MariaDB/API -> /api/catalog/* -> CatalogWorkspaceClient -> UI.
 */

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../ui/collectium/PageHeader";
import ContentPanel from "../ui/collectium/ContentPanel";
import InfoCard from "../ui/collectium/InfoCard";
import ArchiveTabs from "../ui/collectium/ArchiveTabs";
import ActionButton from "../ui/collectium/ActionButton";
import EmptyState from "../ui/collectium/EmptyState";

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
  country: "Land / område",
  ruler: "Regent / konge",
  denomination: "Valør",
  year_label: "År / periode",
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
    return [...base, "Samlerfelt viser samling, ønske/favoritt og brukerstatus når API returnerer dette."].join(". ");
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
    <section className="ct-page" data-view={view} data-segment={segment}>
      <style dangerouslySetInnerHTML={{ __html: `
        .ct-catalog-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 20px;
          align-items: start;
        }
        .ct-catalog-card {
          display: grid;
          grid-template-columns: 160px 1fr 200px;
          gap: 16px;
          margin-bottom: 16px;
          align-items: stretch;
        }
        .ct-catalog-card.ct-view-list {
          grid-template-columns: 80px 1fr 150px;
          gap: 12px;
          padding: 8px 12px;
        }
        .ct-catalog-card.ct-view-standing {
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .ct-catalog-card-image {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          aspect-ratio: 4/3;
          background: rgba(0,0,0,0.03);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--ct-border);
        }
        .ct-catalog-card-market {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          border-left: 1px solid var(--ct-border);
          padding-left: 16px;
        }
        .ct-catalog-mobile-topbar {
          display: none;
        }
        @media (max-width: 768px) {
          .ct-catalog-layout {
            grid-template-columns: 1fr;
          }
          .ct-catalog-card, .ct-catalog-card.ct-view-list, .ct-catalog-card.ct-view-standing {
            grid-template-columns: 1fr !important;
            gap: 12px;
          }
          .ct-catalog-card-market {
            border-left: 0 !important;
            border-top: 1px solid var(--ct-border);
            padding-left: 0 !important;
            padding-top: 12px;
          }
          .ct-catalog-mobile-topbar {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 12px;
          }
          .ct-catalog-desktop-filter {
            display: none;
          }
        }
      `}} />

      <PageHeader kicker="Katalog" title="Relasjonsbasert katalog" description="Katalogen viser reelle data fra MariaDB/API. Teknisk nøkkel er alltid object_id + object_group + source_key.">
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "0.88rem", color: "var(--ct-text-soft)" }}>
          <span><b>{totals.count}</b> treff</span>
          <span><b>{formatCurrency(totals.value)}</b> estimert verdi</span>
          <span><b>{sourceLabel(sourceKey)}</b> kilde</span>
          <span><b>{objectGroupLabel(objectGroup)}</b> type</span>
        </div>
      </PageHeader>

      <div className="ct-catalog-mobile-topbar">
        <ActionButton onClick={() => setFilterOpen(true)} data-feature-key="catalog.filters">Filter</ActionButton>
        <ArchiveTabs
          items={[["samler", "Samler"], ["historie", "Historie"], ["finans", "Finans"]].map(([key, label]) => ({ key, label }))}
          activeKey={segment}
          onChange={(key) => setSegment(key as Segment)}
        />
      </div>

      <div className="ct-catalog-layout">
        <aside className="ct-catalog-desktop-filter">
          <ContentPanel>
            {filterPanel}
          </ContentPanel>
        </aside>

        <main style={{ display: "flex", flexDirection: "column" }}>
          <ContentPanel style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <ArchiveTabs
                items={[["samler", "Samler"], ["historie", "Historie"], ["finans", "Finans"]].map(([key, label]) => ({ key, label }))}
                activeKey={segment}
                onChange={(key) => setSegment(key as Segment)}
                style={{ borderBottom: 0, marginBottom: 0 }}
              />
              <ArchiveTabs
                items={[["horizontal", "Horisontal"], ["standing", "Stående"], ["list", "Liste"]].map(([key, label]) => ({ key, label }))}
                activeKey={view}
                onChange={(key) => setView(key as ViewMode)}
                style={{ borderBottom: 0, marginBottom: 0 }}
              />
            </div>
            <label className="ct-field" style={{ margin: 0, minWidth: "240px" }}>
              <span className="ct-label">Søk</span>
              <input
                className="ct-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Søk objekt, valør, regent, signatur..."
                data-feature-key="catalog.search"
              />
            </label>
          </ContentPanel>

          {error ? <EmptyState message="Feil ved henting av data" description={error} /> : null}
          {loading ? <EmptyState message="Henter reelle katalogdata..." /> : null}
          {!loading && !error && objects.length === 0 ? (
            <EmptyState message="Ingen reelle katalogdata ble returnert for valgt kilde og filter." />
          ) : null}

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {objects.map((object) => (
              <CatalogCard key={`${object.source_key}:${object.object_group}:${object.object_id}`} object={object} segment={segment} view={view} />
            ))}
          </div>
        </main>
      </div>

      {filterOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setFilterOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <ContentPanel
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "320px",
              height: "100%",
              overflowY: "auto",
              borderRadius: 0,
              background: "var(--ct-panel-solid)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--ct-border)", paddingBottom: "12px" }}>
              <strong style={{ fontSize: "1.1rem" }}>Filter</strong>
              <ActionButton onClick={() => setFilterOpen(false)}>Lukk</ActionButton>
            </div>
            {filterPanel}
          </ContentPanel>
        </div>
      ) : null}
    </section>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", borderBottom: "1px solid var(--ct-border)", paddingBottom: "12px" }}>
        <div>
          <strong style={{ display: "block", fontSize: "0.95rem" }}>Katalogfilter</strong>
          <small style={{ display: "block", fontSize: "0.75rem", color: "var(--ct-text-muted)", marginTop: "2px" }}>Kilde-scopet fra API</small>
        </div>
        <ActionButton style={{ padding: "4px 8px", fontSize: "0.75rem" }} onClick={clearFilters}>Nullstill</ActionButton>
      </div>

      <div style={{ minHeight: "24px" }}>
        {selectedFilter ? (
          <ActionButton style={{ padding: "2px 6px", fontSize: "0.75rem" }} onClick={clearFilters}>{selectedFilter.value} x</ActionButton>
        ) : (
          <span style={{ fontSize: "0.8rem", color: "var(--ct-text-muted)" }}>Ingen valgte filter</span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {filters.map((group) => {
          const open = expandedFilter === group.field;
          return (
            <section key={group.field} style={{ borderBottom: "1px solid var(--ct-border)", paddingBottom: "8px" }}>
              <button
                type="button"
                className="ct-btn"
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  textAlign: "left",
                  background: "none",
                  border: 0,
                  padding: "8px 0"
                }}
                onClick={() => setExpandedFilter(open ? null : group.field)}
              >
                <span style={{ fontSize: "0.9rem", fontWeight: "700" }}>{filterTitles[group.field] || group.field}</span>
                <span style={{ fontSize: "0.75rem", padding: "2px 6px", background: "rgba(0,0,0,0.05)", borderRadius: "10px" }}>{group.values.length}</span>
              </button>
              {open ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "8px", maxHeight: "200px", overflowY: "auto" }}>
                  {group.values.map((filter) => {
                    const checked = selectedFilter?.field === filter.filter_field && selectedFilter.value === filter.filter_value;
                    return (
                      <label
                        key={`${filter.source_key}:${filter.object_group}:${filter.filter_field}:${filter.filter_value}`}
                        style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}
                      >
                        <input type="checkbox" checked={checked} onChange={() => toggleFilter(filter.filter_field, filter.filter_value)} />
                        <span style={{ flex: 1 }}>{filter.filter_label || filter.filter_value}</span>
                        <small style={{ color: "var(--ct-text-muted)" }}>{filter.object_count ?? ""}</small>
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
    <article className={`ct-card ct-catalog-card ct-view-${view}`}>
      <a className="ct-catalog-card-image" href={objectHref} data-feature-key="catalog.object.open">
        {object.image_path ? (
          <img src={object.image_path} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: "0.8rem", color: "var(--ct-text-muted)" }}>{objectGroupLabel(object.object_group)}</span>
        )}
        <small style={{ position: "absolute", bottom: "4px", background: "rgba(0,0,0,0.6)", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "0.65rem" }}>
          {object.source_catalog_number || object.collectium_catalog_meta || object.object_id}
        </small>
      </a>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <h2 className="ct-title" style={{ fontSize: "1.15rem", fontWeight: "bold" }}>{objectTitle(object)}</h2>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "var(--ct-text-muted)" }}>
              Kilde: {sourceLabel(object.source_key)} · Objekttype: {objectGroupLabel(object.object_group)} · ID: {String(object.object_id)}
            </p>
          </div>
          <div>
            <a href={objectHref} className="ct-btn" style={{ padding: "4px 8px", fontSize: "0.75rem" }} data-feature-key="catalog.object.open">
              Vis objekt
            </a>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px", fontSize: "0.8rem", margin: "4px 0" }}>
          <span><b style={{ color: "var(--ct-text-muted)", marginRight: "4px" }}>Land:</b>{object.country || "Ikke oppgitt"}</span>
          <span><b style={{ color: "var(--ct-text-muted)", marginRight: "4px" }}>Produsent:</b>{object.producer || object.issuer || "Ikke oppgitt"}</span>
          <span><b style={{ color: "var(--ct-text-muted)", marginRight: "4px" }}>År:</b>{object.year_label || "Ikke oppgitt"}</span>
          <span><b style={{ color: "var(--ct-text-muted)", marginRight: "4px" }}>Valør:</b>{object.denomination || "Ikke oppgitt"}</span>
          <span><b style={{ color: "var(--ct-text-muted)", marginRight: "4px" }}>Litra:</b>{object.litra || "Ikke oppgitt"}</span>
          <span><b style={{ color: "var(--ct-text-muted)", marginRight: "4px" }}>Regent:</b>{object.ruler || "Ikke oppgitt"}</span>
        </div>

        <div style={{ padding: "8px", background: "rgba(0,0,0,0.02)", borderRadius: "6px", fontSize: "0.8rem" }}>
          <strong style={{ display: "block", color: "var(--ct-brand-primary)", marginBottom: "4px" }}>
            {segment === "samler" ? "Samler" : segment === "historie" ? "Historie" : "Finans"}
          </strong>
          <p style={{ margin: 0, color: "var(--ct-text-soft)" }}>{segmentCopy(object, segment)}</p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
          {relations.map((relation) => (
            <a
              key={`${relation.field}:${relation.value}`}
              href={relationHref(object, relation.field, relation.value)}
              className="ct-btn"
              style={{ padding: "2px 6px", fontSize: "0.7rem", borderRadius: "4px" }}
            >
              {relation.value}
            </a>
          ))}
        </div>
      </div>

      <aside className="ct-catalog-card-market">
        <span style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--ct-brand-primary)" }}>
          {formatCurrency(getDisplayValue(object), object.currency ?? "NOK")}
        </span>
        <strong style={{ fontSize: "0.85rem", margin: "4px 0" }}>{object.value_label || "Marked fra API"}</strong>
        <small style={{ fontSize: "0.7rem", color: "var(--ct-text-muted)" }}>
          {object.source_catalog_number || object.collectium_catalog_meta || "Kildekatalognummer mangler"}
        </small>
        <em style={{ fontSize: "0.6rem", color: "var(--ct-text-muted)", marginTop: "8px", fontStyle: "normal" }}>
          {object.source_key}:{object.object_group}:{String(object.object_id)}
        </em>
      </aside>
    </article>
  );
}
