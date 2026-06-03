import "server-only";

import type { CatalogFilterValue, CatalogObject } from "@/types/catalog";

export type CatalogSelectedFilter = {
  filterField?: string;
  filterValue?: string;
};

type BridgeResponse = {
  ok?: boolean;
  data?: unknown;
  objects?: unknown[];
  error?: {
    code?: string;
    message?: string;
  };
  errors?: Array<{
    code?: string;
    message?: string;
  }>;
};

const filterFields = [
  { field: "country", title: "Land" },

  // Hovedinnganger etter land
  { field: "ruler", title: "Konge / regent / dynasti" },
  { field: "denomination", title: "Type objekt / objektbetegnelse" },
  { field: "year_label", title: "Årstall" },

  // Underfilter hentes videre fra DB/API
  { field: "litra", title: "Litra / nummer / detalj" },
  { field: "denomination_issue", title: "Valørutgave / serie" },
  { field: "variant", title: "Variant / type" },
  { field: "signature", title: "Signatur / personer" },
  { field: "producer", title: "Produsent" },
  { field: "issuer", title: "Utsteder" },
  { field: "historical_period", title: "Historisk periode" },
  { field: "material", title: "Materiale" },
  { field: "value_label", title: "Verdi" },
] as const;
function getBridgeBaseUrl() {
  const baseUrl = process.env.COLLECTIUM_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing COLLECTIUM_API_BASE_URL in .env.local");
  }

  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

function normalizeCatalogObject(raw: unknown): CatalogObject {
  const row = raw as Record<string, unknown>;

  return {
    object_id: (row.object_id as string | number | undefined) ?? "",
    source_key: (row.source_key as string | undefined) ?? "",
    object_group: (row.object_group as string | undefined) ?? "",

    collectium_title:
      (row.collectium_title as string | null | undefined) ??
      (row.title_no as string | null | undefined) ??
      (row.frontend_title as string | null | undefined) ??
      undefined,

    collectium_catalog_meta:
      (row.collectium_catalog_meta as string | null | undefined) ??
      (row.source_catalog_number as string | null | undefined) ??
      null,

    frontend_title: (row.frontend_title as string | null | undefined) ?? undefined,
    source_catalog_number: (row.source_catalog_number as string | null | undefined) ?? undefined,
    image_path: (row.image_path as string | null | undefined) ?? undefined,

    country: (row.country as string | null | undefined) ?? undefined,
    producer: (row.producer as string | null | undefined) ?? undefined,
    issuer: (row.issuer as string | null | undefined) ?? undefined,
    denomination: (row.denomination as string | null | undefined) ?? undefined,
    variant: (row.variant as string | null | undefined) ?? undefined,
    litra: (row.litra as string | null | undefined) ?? undefined,
    ruler: (row.ruler as string | null | undefined) ?? undefined,
    historical_period: (row.historical_period as string | null | undefined) ?? undefined,
    material: (row.material as string | null | undefined) ?? undefined,
    year_label: (row.year_label as string | null | undefined) ?? undefined,

    market_value_low: (row.market_value_low as string | number | null | undefined) ?? undefined,
    market_value_high: (row.market_value_high as string | number | null | undefined) ?? undefined,
    value_label: (row.value_label as string | null | undefined) ?? undefined,
    currency: (row.currency as string | null | undefined) ?? "NOK",
  };
}

function extractObjects(json: BridgeResponse): CatalogObject[] {
  if (Array.isArray(json.objects)) {
    return json.objects.map(normalizeCatalogObject).filter((object) => object.object_id !== "");
  }

  if (Array.isArray(json.data)) {
    return json.data.map(normalizeCatalogObject).filter((object) => object.object_id !== "");
  }

  const data = json.data as
    | {
        objects?: unknown[];
        rows?: unknown[];
        data?: unknown[];
      }
    | undefined;

  const objects = data?.objects ?? data?.rows ?? data?.data ?? [];

  return objects.map(normalizeCatalogObject).filter((object) => object.object_id !== "");
}

function buildFiltersFromObjects(
  sourceKey: string,
  objectGroup: string,
  objects: CatalogObject[]
): CatalogFilterValue[] {
  const filters: CatalogFilterValue[] = [];

  for (const config of filterFields) {
    const counts = new Map<string, number>();

    for (const object of objects) {
      const row = object as unknown as Record<string, unknown>;
      const rawValue = row[config.field];
      const value = typeof rawValue === "string" ? rawValue.trim() : "";

      if (value !== "") {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }

    for (const [value, count] of counts.entries()) {
      filters.push({
        source_key: sourceKey,
        object_group: objectGroup,
        filter_field: config.field === "value_label" ? "value" : config.field,
        filter_value: value,
        filter_label: value,
        object_count: count,
      });
    }
  }

  return filters.sort((a, b) => {
    const countA = Number(a.object_count ?? 0);
    const countB = Number(b.object_count ?? 0);

    return countB - countA || String(a.filter_label ?? "").localeCompare(String(b.filter_label ?? ""));
  });
}

export async function searchCatalogObjects(
  sourceKey: string,
  objectGroup: string,
  q: string = "",
  selectedFilter: CatalogSelectedFilter = {}
): Promise<CatalogObject[]> {
  const url = new URL("catalog-search.php", getBridgeBaseUrl());

  url.searchParams.set("source_key", sourceKey);
  url.searchParams.set("object_group", objectGroup);
  url.searchParams.set("limit", "50");

  if (q.trim() !== "") {
    url.searchParams.set("q", q.trim());
  }

  if (selectedFilter.filterField && selectedFilter.filterValue) {
    url.searchParams.set("filter_field", selectedFilter.filterField);
    url.searchParams.set("filter_value", selectedFilter.filterValue);
  }

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "X-Collectium-Api-Key": process.env.COLLECTIUM_API_KEY ?? "",
    },
  });

  const text = await response.text();

  let json: BridgeResponse;

  try {
    json = JSON.parse(text) as BridgeResponse;
  } catch {
    throw new Error(`Collectium bridge returned non-JSON response: ${text.slice(0, 200)}`);
  }

  if (!response.ok || json.ok === false) {
    const message =
      json.error?.message ||
      json.errors?.[0]?.message ||
      `Collectium bridge failed with HTTP ${response.status}`;

    throw new Error(message);
  }

  return extractObjects(json);
}

export async function getCatalogFilters(
  sourceKey: string,
  objectGroup: string,
  q: string = "",
  selectedFilter: CatalogSelectedFilter = {}
): Promise<CatalogFilterValue[]> {
  const objects = await searchCatalogObjects(sourceKey, objectGroup, q, selectedFilter);
  return buildFiltersFromObjects(sourceKey, objectGroup, objects);
}

export async function getCatalogObject(
  sourceKey: string,
  objectGroup: string,
  objectId: string | number
): Promise<CatalogObject | null> {
  const objects = await searchCatalogObjects(sourceKey, objectGroup, "", {
    filterField: "object_id",
    filterValue: String(objectId),
  });

  return objects.find((object) => String(object.object_id) === String(objectId)) ?? null;
}

