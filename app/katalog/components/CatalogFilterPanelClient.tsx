"use client";

/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * CatalogFilterPanelClient
 *
 * Definering / formål:
 * Interaktivt katalogfilter med dropdown, valgte filterchips, multi-select,
 * nullstill, lukk filter og mobil-overlay.
 *
 * Bruksområde:
 * Brukes på /katalog som klientkomponent for filterinteraksjon.
 *
 * Berørte sider / routes:
 * - /katalog
 *
 * Berørte DB-brytere / feature_keys:
 * - catalog.filters
 * - catalog.search
 *
 * Berørte API-ruter:
 * - catalog-search.php via src/db/queries/catalog.ts
 *
 * Dataretning:
 * MariaDB -> PHP/API bridge -> Next.js page.tsx -> CatalogFilterPanelClient -> UI
 *
 * Endringsregel:
 * Komponenten eier kun UI-state. MariaDB/API er sannhet for filterverdier.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogFilterValue } from "@/types/catalog";

export type CatalogSelectedFilter = {
  filterField?: string;
  filterValue?: string;
};

export type CatalogFilterGroup = {
  title: string;
  field: string;
  values: CatalogFilterValue[];
};

type CatalogFilterPanelClientProps = {
  groups: CatalogFilterGroup[];
  sourceKey: string;
  objectGroup: string;
  q: string;
  activeFilter: CatalogSelectedFilter;
  view: string;
  segment: string;
  objectCount: number;
};

function buildHref(params: {
  sourceKey: string;
  objectGroup: string;
  q: string;
  view: string;
  segment: string;
  filterField?: string;
  filterValue?: string;
}) {
  const search = new URLSearchParams();

  search.set("source_key", params.sourceKey);
  search.set("object_group", params.objectGroup);
  search.set("view", params.view);
  search.set("segment", params.segment);

  if (params.q.trim() !== "") {
    search.set("q", params.q.trim());
  }

  if (params.filterField && params.filterValue) {
    search.set("filter_field", params.filterField);
    search.set("filter_value", params.filterValue);
  }

  return `/katalog?${search.toString()}`;
}

function getFilterLabel(groups: CatalogFilterGroup[], activeFilter: CatalogSelectedFilter) {
  if (!activeFilter.filterField || !activeFilter.filterValue) {
    return null;
  }

  const group = groups.find((item) => item.field === activeFilter.filterField);
  const value = group?.values.find(
    (item) => String(item.filter_value) === String(activeFilter.filterValue)
  );

  return {
    title: group?.title ?? activeFilter.filterField,
    value: String(value?.filter_label ?? activeFilter.filterValue),
  };
}

function YearAdvancedLayer({
  group,
  onClose,
}: {
  group: CatalogFilterGroup;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"open" | "ruler" | "period">("open");

  return (
    <div className="ct-filter-layer" role="dialog" aria-label="Årstall avansert filter">
      <div className="ct-filter-layer-head">
        <div>
          <h3>Årstall</h3>
          <p>Vis årstall åpent, gruppert etter kongeperiode eller historisk periode.</p>
        </div>

        <button type="button" onClick={onClose} aria-label="Lukk årstall-lag">
          ×
        </button>
      </div>

      <div className="ct-filter-layer-tabs">
        <button type="button" className={mode === "open" ? "is-active" : ""} onClick={() => setMode("open")}>
          Åpent
        </button>
        <button type="button" className={mode === "ruler" ? "is-active" : ""} onClick={() => setMode("ruler")}>
          Kongeperiode
        </button>
        <button type="button" className={mode === "period" ? "is-active" : ""} onClick={() => setMode("period")}>
          Historisk periode
        </button>
      </div>

      <div className="ct-filter-layer-body">
        {mode === "open" ? (
          <div className="ct-filter-layer-grid">
            {group.values.map((value) => (
              <span key={`${group.field}-${value.filter_value}`}>
                {value.filter_label ?? value.filter_value}
                <strong>{Number(value.object_count ?? 0)}</strong>
              </span>
            ))}
          </div>
        ) : (
          <div className="ct-filter-layer-placeholder">
            Gruppering etter {mode === "ruler" ? "kongeperiode" : "historisk periode"} må hentes fra DB/API i neste steg.
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogFilterPanelClient({
  groups,
  sourceKey,
  objectGroup,
  q,
  activeFilter,
  view,
  segment,
  objectCount,
}: CatalogFilterPanelClientProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    country: true,
    ruler: true,
    denomination: true,
    year_label: true,
  });
  const [advancedYearOpen, setAdvancedYearOpen] = useState(false);

  const activeChip = useMemo(
    () => getFilterLabel(groups, activeFilter),
    [groups, activeFilter]
  );

  const resetHref = buildHref({
    sourceKey,
    objectGroup,
    q,
    view,
    segment,
  });

  function toggleGroup(field: string) {
    setOpenGroups((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  const panelContent = (
    <>
      <div className="ct-filter-mobile-head">
        <div>
          <h2>Filter</h2>
          <p>
            {sourceKey} · {objectGroup} · {objectCount} treff
          </p>
        </div>

        <button type="button" onClick={() => setIsMobileOpen(false)} aria-label="Lukk filter">
          ×
        </button>
      </div>

      <div className="ct-selected-filters">
        <div className="ct-selected-title">Valgte filter</div>

        {activeChip ? (
          <Link className="ct-filter-chip" href={resetHref}>
            <span>{activeChip.title}: {activeChip.value}</span>
            <strong>×</strong>
          </Link>
        ) : (
          <span className="ct-no-filter-chip">Ingen aktive filter</span>
        )}

        <Link className="ct-reset-filter" href={resetHref}>
          Nullstill filter
        </Link>
      </div>

      <div className="ct-filter-dropdown-list">
        {groups.map((group) => {
          const isOpen = Boolean(openGroups[group.field]);

          return (
            <section className="ct-filter-dropdown" key={group.field}>
              <button
                type="button"
                className="ct-filter-dropdown-trigger"
                onClick={() => toggleGroup(group.field)}
                onDoubleClick={() => {
                  if (group.field === "year_label") {
                    setAdvancedYearOpen(true);
                  }
                }}
              >
                <span>{group.title}</span>
                <strong>{group.values.length}</strong>
                <em>{isOpen ? "▲" : "▼"}</em>
              </button>

              {isOpen ? (
                <div className="ct-filter-dropdown-values">
                  {group.field === "year_label" ? (
                    <button
                      type="button"
                      className="ct-open-layer-button"
                      onClick={() => setAdvancedYearOpen(true)}
                    >
                      Vis årstall-lag
                    </button>
                  ) : null}

                  {group.values.map((filter) => {
                    const isActive =
                      activeFilter.filterField === String(filter.filter_field) &&
                      activeFilter.filterValue === String(filter.filter_value);

                    return (
                      <Link
                        className={`ct-filter-option${isActive ? " is-active" : ""}`}
                        key={`${filter.filter_field}-${filter.filter_value}`}
                        href={buildHref({
                          sourceKey,
                          objectGroup,
                          q,
                          view,
                          segment,
                          filterField: String(filter.filter_field),
                          filterValue: String(filter.filter_value),
                        })}
                      >
                        <span>{filter.filter_label ?? filter.filter_value}</span>
                        <strong>{Number(filter.object_count ?? 0)}</strong>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      {advancedYearOpen ? (
        <YearAdvancedLayer
          group={groups.find((group) => group.field === "year_label") ?? { title: "Årstall", field: "year_label", values: [] }}
          onClose={() => setAdvancedYearOpen(false)}
        />
      ) : null}
    </>
  );

  return (
    <>
      <button type="button" className="ct-mobile-filter-button" onClick={() => setIsMobileOpen(true)}>
        Filter
      </button>

      <aside className="ct-filter-panel ct-filter-panel-desktop">
        {panelContent}
      </aside>

      {isMobileOpen ? (
        <div className="ct-filter-mobile-overlay">
          <div className="ct-filter-mobile-sheet">
            {panelContent}
          </div>
        </div>
      ) : null}
    </>
  );
}
