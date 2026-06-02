/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * Katalogside med kortvisning
 *
 * Definering / formål:
 * Viser Collectium-katalogen med filter, treffliste og flere visninger.
 * Kortvisning bruker ekte katalogdata hentet via API-bridge.
 *
 * Bruksområde:
 * Brukes på /katalog for Norske sedler og senere andre source_key/object_group.
 *
 * Berørte sider / routes:
 * - /katalog
 *
 * Berørte DB-brytere / feature_keys:
 * - catalog.view
 * - catalog.search
 * - catalog.filters
 * - catalog.object.open
 *
 * Berørte API-ruter:
 * - /app/api/bridge/catalog-search.php via src/db/queries/catalog.ts
 *
 * Berørte tabeller / views:
 * - ct_v_catalog_objects_resolved
 * - ct_v_catalog_filter_counts / filtergrunnlag via API
 *
 * Dataretning:
 * MariaDB -> PHP/API bridge -> Next.js -> React -> UI
 *
 * Endringsregel:
 * Denne siden viser data fra API/DB. Frontend skal ikke være sannhet for filterverdier.
 */

import Link from "next/link";
import CatalogFilterPanelClient from "./components/CatalogFilterPanelClient";
import type { CatalogFilterValue, CatalogObject } from "@/types/catalog";
import {
  getCatalogFilters,
  searchCatalogObjects,
  type CatalogSelectedFilter,
} from "@/db/queries/catalog";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  source_key?: string;
  object_group?: string;
  q?: string;
  filter_field?: string;
  filter_value?: string;
  view?: string;
  segment?: string;
}>;

type CatalogPageProps = {
  searchParams: SearchParams;
};

type CatalogSegment = "collector" | "history" | "finance";

function normalizeSegment(value: string | undefined): CatalogSegment {
  if (value === "history" || value === "finance" || value === "collector") {
    return value;
  }

  return "collector";
}

type FilterGroup = {
  title: string;
  field: string;
  values: CatalogFilterValue[];
};

const filterTitleMap: Record<string, string> = {
  country: "Land",
  ruler: "Konge / regent / dynasti",
  denomination: "Type objekt / objektbetegnelse",
  year_label: "Årstall",
  litra: "Litra / nummer / detalj",
  denomination_issue: "Valørutgave / serie",
  variant: "Variant / type",
  signature: "Signatur / personer",
  producer: "Produsent",
  issuer: "Utsteder",
  historical_period: "Historisk periode",
  material: "Materiale",
  value: "Verdi",
  value_label: "Verdi",
};

const filterOrder = [
  "country",
  "ruler",
  "denomination",
  "year_label",
  "litra",
  "denomination_issue",
  "variant",
  "signature",
  "producer",
  "issuer",
  "historical_period",
  "material",
  "value",
  "value_label",
];

function getText(value: unknown, fallback = "Ikke registrert") {
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }

  return fallback;
}

const catalogFieldAliases: Record<string, string[]> = {
  country: ["country", "country_raw_no"],
  producer: ["producer", "producer_raw_no", "issuer", "issuer_raw_no"],
  issuer: ["issuer", "issuer_raw_no", "producer", "producer_raw_no"],
  denomination: ["denomination", "denomination_raw_no"],
  denomination_issue: ["denomination_issue", "denomination_issue_raw_no", "issue", "issue_raw_no"],
  year_label: ["year_label", "object_year_label", "publication_year_label"],
  object_year: ["object_year_label", "year_label", "publication_year_label"],
  publication_year: ["publication_year_label", "year_label", "object_year_label"],
  litra: ["litra", "litra_raw_no"],
  variant: ["variant", "variant_type_raw_no"],
  signature: ["signature", "signature_raw_no"],
  ruler: ["ruler", "ruler_name_raw_no", "historical_ruler_raw_no"],
  historical_period: ["historical_period", "historical_period_label_no"],
  material: ["material", "material_raw_no", "paper_type_raw_no"],
  rarity: ["rarity", "rarity_label", "rarity_catalog_assessment_raw_no", "rarity_estimated_by_quantity_raw_no"],
  grade: ["grade", "quality", "quality_label"],
  value_label: ["value_label", "market_value_label", "estimated_value_label"],
  source_catalog_number: ["source_catalog_number", "local_catalog_number", "pick_catalog_number"],
};

function getObjectField(object: CatalogObject, key: string, fallback = "Ikke registrert") {
  const row = object as unknown as Record<string, unknown>;
  const keys = catalogFieldAliases[key] ?? [key];

  for (const candidateKey of keys) {
    const value = getText(row[candidateKey], "");

    if (value !== "") {
      return value;
    }
  }

  return fallback;
}

function getObjectTitle(object: CatalogObject) {
  return (
    getObjectField(object, "collectium_title", "") ||
    getObjectField(object, "frontend_title", "") ||
    getObjectField(object, "object_title_no", "") ||
    [
      getObjectField(object, "denomination", ""),
      getObjectField(object, "year_label", ""),
      getObjectField(object, "litra", ""),
    ]
      .filter(Boolean)
      .join(" • ") ||
    "Uten tittel"
  );
}

function getObjectDebugMeta(object: CatalogObject) {
  return `object_id=${String(object.object_id)} · source_catalog_number=${getObjectField(object, "source_catalog_number", "—")}`;
}

function getObjectMeta(object: CatalogObject) {
  return (
    getObjectField(object, "collectium_catalog_meta", "") ||
    getObjectField(object, "source_catalog_number", "") ||
    getObjectField(object, "local_catalog_number", "") ||
    getObjectField(object, "pick_catalog_number", "") ||
    `ID ${String(object.object_id)}`
  );
}

function getValueLabel(object: CatalogObject) {
  const valueLabel = getObjectField(object, "value_label", "");

  if (valueLabel && valueLabel !== "0 kr") {
    return valueLabel;
  }

  const low = getObjectField(object, "market_value_low", "");
  const high = getObjectField(object, "market_value_high", "");

  if (low && high && low !== "0" && high !== "0") {
    return `${low}–${high}`;
  }

  return "Ikke vurdert";
}

function objectHref(object: CatalogObject) {
  const search = new URLSearchParams();

  search.set("source_key", String(object.source_key));
  search.set("object_group", String(object.object_group));
  search.set("object_id", String(object.object_id));

  return `https://collectium.no/app1/collectium-katalog-objekt-view.html?${search.toString()}`;
}

function relationHref(params: {
  relationType: string;
  relationValue: string;
  sourceKey: string;
  objectGroup: string;
}) {
  const search = new URLSearchParams();

  search.set("relation_type", params.relationType);
  search.set("relation_value", params.relationValue);
  search.set("source_key", params.sourceKey);
  search.set("object_group", params.objectGroup);

  return `https://collectium.no/app1/collectium-katalog-relasjon-view.html?${search.toString()}`;
}

function buildHref(params: {
  sourceKey: string;
  objectGroup: string;
  q: string;
  filterField?: string;
  filterValue?: string;
  view: string;
  segment?: CatalogSegment;
}) {
  const search = new URLSearchParams();

  search.set("source_key", params.sourceKey);
  search.set("object_group", params.objectGroup);
  search.set("view", params.view);

  if (params.segment) {
    search.set("segment", params.segment);
  }

  if (params.q.trim() !== "") {
    search.set("q", params.q.trim());
  }

  if (params.filterField && params.filterValue) {
    search.set("filter_field", params.filterField);
    search.set("filter_value", params.filterValue);
  }

  return `/katalog?${search.toString()}`;
}

function groupFilters(filters: CatalogFilterValue[]): FilterGroup[] {
  const map = new Map<string, CatalogFilterValue[]>();

  for (const filter of filters) {
    const field = String(filter.filter_field ?? "");

    if (!field) {
      continue;
    }

    if (!map.has(field)) {
      map.set(field, []);
    }

    map.get(field)?.push(filter);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => {
      const indexA = filterOrder.indexOf(a);
      const indexB = filterOrder.indexOf(b);

      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b);
      }

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    })
    .map(([field, values]) => ({
      field,
      title: filterTitleMap[field] ?? field,
      values: values
        .slice()
        .sort(
          (a, b) =>
            Number(b.object_count ?? 0) - Number(a.object_count ?? 0) ||
            String(a.filter_label ?? "").localeCompare(String(b.filter_label ?? ""))
        )
        .slice(0, 12),
    }));
}

function ViewButton({
  label,
  value,
  activeView,
  href,
}: {
  label: string;
  value: string;
  activeView: string;
  href: string;
}) {
  const isActive = value === activeView;

  return (
    <Link className={`ct-view-button${isActive ? " is-active" : ""}`} href={href}>
      {label}
    </Link>
  );
}


function SegmentButton({
  label,
  value,
  activeSegment,
  href,
}: {
  label: string;
  value: CatalogSegment;
  activeSegment: CatalogSegment;
  href: string;
}) {
  const isActive = value === activeSegment;

  return (
    <Link className={`ct-segment-button${isActive ? " is-active" : ""}`} href={href}>
      {label}
    </Link>
  );
}

function getSegmentFields(object: CatalogObject, segment: CatalogSegment) {
  if (segment === "history") {
    return [
      ["Konge/regent", getObjectField(object, "ruler")],
      ["Historisk periode", getObjectField(object, "historical_period")],
      ["Produsent", getObjectField(object, "producer")],
      ["Materiale", getObjectField(object, "material")],
      ["Årstall", getObjectField(object, "year_label")],
      ["Variant/type", getObjectField(object, "variant")],
    ];
  }

  if (segment === "finance") {
    return [
      ["Estimert verdi", getValueLabel(object)],
      ["Trend", getObjectField(object, "trend_label", "Ikke vurdert")],
      ["Valør", getObjectField(object, "denomination")],
      ["Årstall", getObjectField(object, "year_label")],
      ["Sjeldenhet", getObjectField(object, "rarity", "Ikke registrert")],
      ["Marked", getObjectField(object, "market_channel", "Ikke registrert")],
    ];
  }

  return [
    ["Land", getObjectField(object, "country")],
    ["Konge/regent", getObjectField(object, "ruler")],
    ["Årstall", getObjectField(object, "year_label")],
    ["Litra", getObjectField(object, "litra")],
    ["Valør", getObjectField(object, "denomination")],
    ["Variant/type", getObjectField(object, "variant")],
  ];
}

function getSegmentLabel(segment: CatalogSegment) {
  if (segment === "history") return "Historie";
  if (segment === "finance") return "Finans";
  return "Samler";
}

function FilterPanel({
  groups,
  sourceKey,
  objectGroup,
  q,
  activeFilter,
  view,
  segment,
}: {
  groups: FilterGroup[];
  sourceKey: string;
  objectGroup: string;
  q: string;
  activeFilter: CatalogSelectedFilter;
  view: string;
  segment: CatalogSegment;
}) {
  return (
    <aside className="ct-filter-panel">
      <div className="ct-panel-title-row">
        <h2>Filter</h2>
        <span>{groups.length} grupper</span>
      </div>

      <p className="ct-filter-help">Land først. Deretter Konge, Type objekt eller Årstall.</p>

      {activeFilter.filterField && activeFilter.filterValue ? (
        <Link
          className="ct-reset-filter"
          href={buildHref({
            sourceKey,
            objectGroup,
            q,
            view,
            segment,
          })}
        >
          Nullstill filter
        </Link>
      ) : null}

      {groups.length === 0 ? (
        <div className="ct-empty-box">Ingen filterverdier i trefflisten.</div>
      ) : (
        <div className="ct-filter-groups">
          {groups.map((group) => (
            <section className="ct-filter-group" key={group.field}>
              <h3>{group.title}</h3>

              <div className="ct-filter-values">
                {group.values.map((filter) => {
                  const isActive =
                    activeFilter.filterField === String(filter.filter_field) &&
                    activeFilter.filterValue === String(filter.filter_value);

                  return (
                    <Link
                      className={`ct-filter-value${isActive ? " is-active" : ""}`}
                      key={`${filter.filter_field}-${filter.filter_value}`}
                      href={buildHref({
                        sourceKey,
                        objectGroup,
                        q,
                        filterField: String(filter.filter_field),
                        filterValue: String(filter.filter_value),
                        view,
                        segment,
                      })}
                    >
                      <span>{filter.filter_label ?? filter.filter_value}</span>
                      <strong>{Number(filter.object_count ?? 0)}</strong>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </aside>
  );
}

function getHorizontalSections(object: CatalogObject, segment: CatalogSegment) {
  if (segment === "history") {
    return [
      {
        title: "Historie",
        fields: [
          ["Land", getObjectField(object, "country")],
          ["Produsent / utsteder", getObjectField(object, "producer")],
          ["Konge / regent", getObjectField(object, "ruler")],
          ["Historisk periode", getObjectField(object, "historical_period")],
          ["Materiale", getObjectField(object, "material")],
          ["Signatur / person", getObjectField(object, "signature", "Legg inn info")],
        ],
      },
      {
        title: "Objekt",
        fields: [
          ["Valør", getObjectField(object, "denomination")],
          ["Årstall", getObjectField(object, "year_label")],
          ["Litra / nummer", getObjectField(object, "litra")],
          ["Valørutgave / serie", getObjectField(object, "denomination_issue")],
          ["Variant / type", getObjectField(object, "variant")],
          ["Sjeldenhet", getObjectField(object, "rarity", "Ikke registrert")],
        ],
      },
      {
        title: "Relasjoner",
        fields: [
          ["Samme konge", getObjectField(object, "ruler")],
          ["Samme periode", getObjectField(object, "historical_period")],
          ["Samme materiale", getObjectField(object, "material")],
          ["Samme produsent", getObjectField(object, "producer")],
          ["Samme serie", getObjectField(object, "denomination_issue")],
          ["Katalognummer", getObjectMeta(object)],
        ],
      },
    ];
  }

  if (segment === "finance") {
    return [
      {
        title: "Finans",
        fields: [
          ["Estimert verdi", getValueLabel(object)],
          ["Status", getValueLabel(object) === "Ikke vurdert" ? "Ikke vurdert" : "Vurdert"],
          ["Trend", getObjectField(object, "trend_label", "Ikke vurdert")],
          ["Trend %", getObjectField(object, "trend_percent", "0 %")],
          ["Likviditet", getObjectField(object, "liquidity", "Ikke registrert")],
          ["Fortjeneste", getObjectField(object, "profit", "Ikke registrert")],
        ],
      },
      {
        title: "Marked",
        fields: [
          ["Auksjon", getObjectField(object, "auction_count", "0")],
          ["Nettbutikk", getObjectField(object, "shop_count", "0")],
          ["Samling", getObjectField(object, "collection_count", "0")],
          ["Siste salg", getObjectField(object, "latest_sale", "Ikke registrert")],
          ["Pris kjøpt hittil", getObjectField(object, "purchase_price", "0 kr")],
          ["Valuta", getObjectField(object, "currency", "NOK")],
        ],
      },
      {
        title: "Objektgrunnlag",
        fields: [
          ["Valør", getObjectField(object, "denomination")],
          ["Årstall", getObjectField(object, "year_label")],
          ["Valørutgave / serie", getObjectField(object, "denomination_issue")],
          ["Variant / type", getObjectField(object, "variant")],
          ["Sjeldenhet", getObjectField(object, "rarity", "Ikke registrert")],
          ["Kvalitet", getObjectField(object, "grade", "Ikke vurdert")],
        ],
      },
    ];
  }

  return [
    {
      title: "Samlerinformasjon",
      fields: [
        ["Kvalitet", getObjectField(object, "grade", "Ikke vurdert")],
        ["Kjøpt pris", getObjectField(object, "purchase_price", "Legg inn info")],
        ["År kjøpt", getObjectField(object, "purchase_year", "Legg inn info")],
        ["Kjøpt av", getObjectField(object, "purchased_from", "Legg inn info")],
        ["Ønskeliste", getObjectField(object, "wishlist", "0")],
        ["Min samling", getObjectField(object, "collection_count", "0")],
      ],
    },
    {
      title: "Objekt",
      fields: [
        ["Valørutgave / serie", getObjectField(object, "denomination_issue")],
        ["Årstall", getObjectField(object, "year_label")],
        ["Litra / nummer", getObjectField(object, "litra")],
        ["Utgave", getObjectField(object, "country")],
        ["Valør", getObjectField(object, "denomination")],
        ["Variant / type", getObjectField(object, "variant")],
      ],
    },
    {
      title: "Ekstra felt",
      fields: [
        ["Person", getObjectField(object, "person", "Legg inn info")],
        ["Signatur", getObjectField(object, "signature", "Legg inn info")],
        ["Produsent", getObjectField(object, "producer")],
        ["Materiale", getObjectField(object, "material")],
        ["Konge/regent", getObjectField(object, "ruler")],
        ["Tidsperiode", getObjectField(object, "historical_period")],
      ],
    },
  ];
}

function CatalogCard({ object, segment }: { object: CatalogObject; segment: CatalogSegment }) {
  const title = getObjectTitle(object);
  const meta = getObjectMeta(object);
  const value = getValueLabel(object);
  const rarity = getObjectField(object, "rarity", getObjectField(object, "rarity_label", "Ikke registrert"));
  const activeSegmentLabel = getSegmentLabel(segment);
  const sections = getHorizontalSections(object, segment);
  const segmentFields = getSegmentFields(object, segment);

  return (
    <article className="ct-catalog-card">
      <div className="ct-card-image">
        <div className="ct-banknote-preview">
          <span className="ct-banknote-number">1</span>
          <span className="ct-banknote-title">NORGES</span>
          <span className="ct-banknote-year">{getObjectField(object, "year_label", "")}</span>
          <span className="ct-banknote-center">1</span>
          <span className="ct-banknote-line" />
        </div>
      </div>

      <div className="ct-card-body">
        <div className="ct-card-heading">
          <div>
            <h2>{title}</h2>
            <p>{meta}</p>
            <p className="ct-object-debug-meta">{getObjectDebugMeta(object)}</p>
          </div>
          <span className="ct-rarity-pill">{segment === "finance" ? "F" : segment === "history" ? "H" : "S"}</span>
        </div>

        <dl className="ct-card-fields">
          {segmentFields.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="ct-card-footer">
          <div className="ct-card-actions">
            <span>♡ 0</span>
            <span>☆ 0</span>
            <span>Samling</span>
          </div>

          <div className="ct-card-market">
            <strong>{value}</strong>
            <span>Estimert verdi</span>
          </div>

          <a className="ct-detail-link" href={objectHref(object)}>
            Se detaljer
          </a>
        </div>
      </div>
    </article>
  );
}

function CatalogHorizontalCard({ object, segment }: { object: CatalogObject; segment: CatalogSegment }) {
  const title = getObjectTitle(object);
  const meta = getObjectMeta(object);
  const value = getValueLabel(object);
  const rarity = getObjectField(object, "rarity", getObjectField(object, "rarity_label", "Ikke registrert"));
  const activeSegmentLabel = getSegmentLabel(segment);
  const sections = getHorizontalSections(object, segment);
  const segmentFields = getSegmentFields(object, segment);

  return (
    <article className="ct-horizontal-object-card">
      <div className="ct-horizontal-object-image">
        <div className="ct-banknote-preview">
          <span className="ct-banknote-number">1</span>
          <span className="ct-banknote-title">NORGES</span>
          <span className="ct-banknote-year">{getObjectField(object, "year_label", "")}</span>
          <span className="ct-banknote-center">1</span>
          <span className="ct-banknote-line" />
        </div>
      </div>

      <div className="ct-horizontal-object-main">
        <div className="ct-horizontal-object-title">
          <h2>{title}</h2>
          <span className="ct-source-badge">S</span>
          <span className="ct-rarity-text">{activeSegmentLabel} · {rarity}</span>
        </div>

        <div className="ct-horizontal-columns">
          {sections.map((section) => (
            <section className="ct-horizontal-section" key={section.title}>
              <h3>{section.title}</h3>
              <dl>
                {section.fields.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <div className="ct-horizontal-note">
          <span>{meta}</span>
          <span className="ct-object-debug-meta">{getObjectDebugMeta(object)}</span>
        </div>
      </div>

      <aside className="ct-horizontal-object-side">
        <div className="ct-horizontal-action-row" aria-label="Objekthandlinger">
          <button type="button" className="ct-icon-action" aria-label="Legg til ønskeliste">
            <span>♡</span>
            <strong>0</strong>
          </button>

          <button type="button" className="ct-icon-action" aria-label="Legg til favoritt">
            <span>☆</span>
            <strong>0</strong>
          </button>
        </div>

        <div className="ct-horizontal-price-box">
          <div>
            <span>Estimert pris</span>
            <strong>{value}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{value === "Ikke vurdert" ? "Ikke vurdert" : "Vurdert"}</strong>
          </div>
        </div>

        <div className="ct-horizontal-market-links" aria-label="Markedskanaler">
          <button type="button" className="ct-market-button ct-market-auction">
            <span>🔨 Auksjon</span>
            <strong>{getObjectField(object, "auction_count", "0")}</strong>
          </button>

          <button type="button" className="ct-market-button ct-market-shop">
            <span>🛒 Nettbutikk</span>
            <strong>{getObjectField(object, "shop_count", "0")}</strong>
          </button>

          <button type="button" className="ct-market-button ct-market-collection">
            <span>▣ Samling</span>
            <strong>{getObjectField(object, "collection_count", "0")}</strong>
          </button>
        </div>

        <a href={objectHref(object)} className="ct-horizontal-details">
          Vis detaljer
        </a>
      </aside>
    </article>
  );
}

function CatalogListRow({ object, segment }: { object: CatalogObject; segment: CatalogSegment }) {
  return (
    <article className="ct-list-row">
      <strong>{getObjectTitle(object)}</strong>
      <span>{getObjectMeta(object)}</span>
      <span className="ct-object-debug-meta">{getObjectDebugMeta(object)}</span>
      <span>{getSegmentLabel(segment)}</span>
      <span>{getSegmentFields(object, segment)[0]?.[1]}</span>
      <span>{getSegmentFields(object, segment)[1]?.[1]}</span>
      <span>{getSegmentFields(object, segment)[2]?.[1]}</span>
      <a href={objectHref(object)}>Detaljer</a>
    </article>
  );
}

function Results({
  objects,
  view,
  segment,
}: {
  objects: CatalogObject[];
  view: string;
  segment: CatalogSegment;
}) {
  if (objects.length === 0) {
    return (
      <section className="ct-results-empty">
        <h2>Ingen objekter funnet</h2>
        <p>Prøv et annet filter eller søk.</p>
      </section>
    );
  }

  if (view === "list") {
    return (
      <section className="ct-list-results">
        {objects.map((object) => (
          <CatalogListRow
            key={`${object.source_key}-${object.object_group}-${object.object_id}`}
            object={object}
            segment={segment}
          />
        ))}
      </section>
    );
  }

  if (view === "horizontal") {
    return (
      <section className="ct-horizontal-results">
        {objects.map((object) => (
          <CatalogHorizontalCard
            key={`${object.source_key}-${object.object_group}-${object.object_id}`}
            object={object}
            segment={segment}
          />
        ))}
      </section>
    );
  }

  return (
    <section className="ct-card-results">
      {objects.map((object) => (
        <CatalogCard
          key={`${object.source_key}-${object.object_group}-${object.object_id}`}
          object={object}
          segment={segment}
        />
      ))}
    </section>
  );
}

export default async function KatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const sourceKey = params.source_key ?? "norske_sedler";
  const objectGroup = params.object_group ?? "banknote";
  const q = params.q ?? "";
  const view = params.view === "horizontal" || params.view === "list" || params.view === "card" ? params.view : "card";
  const segment = normalizeSegment(params.segment);

  const activeFilter: CatalogSelectedFilter = {
    filterField: params.filter_field,
    filterValue: params.filter_value,
  };

  let objects: CatalogObject[] = [];
  let filters: CatalogFilterValue[] = [];
  let errorMessage: string | null = null;

  try {
    [objects, filters] = await Promise.all([
      searchCatalogObjects(sourceKey, objectGroup, q, activeFilter),
      getCatalogFilters(sourceKey, objectGroup, q, activeFilter),
    ]);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Ukjent databasefeil.";
  }

  const filterGroups = groupFilters(filters);

  return (
    <main className="ct-katalog-page">
      <section className="ct-katalog-hero">
        <div>
          <p className="ct-eyebrow">Collectium katalog</p>
          <h1>Katalog</h1>
          <p>
            source_key = {sourceKey} · object_group = {objectGroup}
          </p>
        </div>

        <div className="ct-hero-stats">
          <div>
            <strong>{objects.length}</strong>
            <span>Objekter</span>
          </div>
          <div>
            <strong>{filterGroups.length}</strong>
            <span>Filtergrupper</span>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <section className="ct-error-panel">
          <h2>Database ikke tilgjengelig akkurat nå.</h2>
          <p>{errorMessage}</p>
          <p>
            Katalogen bruker Collectium API-bridge. Bridge svarer, men MariaDB avviser databasebrukeren eller
            host-tilgangen. Data kan ikke vises før DB-bruker, passord eller tilgang er rettet i databasepanelet.
          </p>
        </section>
      ) : null}

      <section className="ct-katalog-layout">
        <CatalogFilterPanelClient
          groups={filterGroups}
          sourceKey={sourceKey}
          objectGroup={objectGroup}
          q={q}
          activeFilter={activeFilter}
          view={view}
          segment={segment}
          objectCount={objects.length}
        />

        <section className="ct-katalog-content">
          <div className="ct-results-toolbar">
            <div>
              <h2>{objects.length} treff</h2>
              <p>Filter viser kun verdier fra aktiv treffliste.</p>
            </div>

            <div className="ct-toolbar-switches">
              <nav className="ct-segment-switch" aria-label="Velg segment">
                <SegmentButton
                  label="Samler"
                  value="collector"
                  activeSegment={segment}
                  href={buildHref({
                    sourceKey,
                    objectGroup,
                    q,
                    filterField: activeFilter.filterField,
                    filterValue: activeFilter.filterValue,
                    view,
                    segment: "collector",
                  })}
                />
                <SegmentButton
                  label="Historie"
                  value="history"
                  activeSegment={segment}
                  href={buildHref({
                    sourceKey,
                    objectGroup,
                    q,
                    filterField: activeFilter.filterField,
                    filterValue: activeFilter.filterValue,
                    view,
                    segment: "history",
                  })}
                />
                <SegmentButton
                  label="Finans"
                  value="finance"
                  activeSegment={segment}
                  href={buildHref({
                    sourceKey,
                    objectGroup,
                    q,
                    filterField: activeFilter.filterField,
                    filterValue: activeFilter.filterValue,
                    view,
                    segment: "finance",
                  })}
                />
              </nav>

              <nav className="ct-view-switch" aria-label="Velg visning">
                <ViewButton
                  label="▦ Kort"
                  value="card"
                  activeView={view}
                  href={buildHref({
                    sourceKey,
                    objectGroup,
                    q,
                    filterField: activeFilter.filterField,
                    filterValue: activeFilter.filterValue,
                    view: "card",
                    segment,
                  })}
                />
                <ViewButton
                  label="▰ Horisontal"
                  value="horizontal"
                  activeView={view}
                  href={buildHref({
                    sourceKey,
                    objectGroup,
                    q,
                    filterField: activeFilter.filterField,
                    filterValue: activeFilter.filterValue,
                    view: "horizontal",
                    segment,
                  })}
                />
                <ViewButton
                  label="☰ Liste"
                  value="list"
                  activeView={view}
                  href={buildHref({
                    sourceKey,
                    objectGroup,
                    q,
                    filterField: activeFilter.filterField,
                    filterValue: activeFilter.filterValue,
                    view: "list",
                    segment,
                  })}
                />
              </nav>
            </div>
          </div>

          <Results objects={objects} view={view} segment={segment} />
        </section>
      </section>
    </main>
  );
}















