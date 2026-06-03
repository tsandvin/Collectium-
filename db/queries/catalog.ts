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
  { field: "ruler", title: "Konge / regent / dynasti" },
  { field: "denomination", title: "Type objekt / objektbetegnelse" },
  { field: "year_label", title: "Arstall" },
  { field: "litra", title: "Litra / nummer / detalj" },
  { field: "denomination_issue", title: "Valorutgave / serie" },
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
    image_path:
      (row.image_path as string | null | undefined) ??
      (row.image_url as string | null | undefined) ??
      undefined,
    country: (row.country as string | null | undefined) ?? (row.country_raw_no as string | null | undefined) ?? undefined,
    producer: (row.producer as string | null | undefined) ?? (row.producer_raw_no as string | null | undefined) ?? undefined,
    issuer: (row.issuer as string | null | undefined) ?? (row.issuer_raw_no as string | null | undefined) ?? undefined,
    denomination:
      (row.denomination as string | null | undefined) ??
      (row.denomination_raw_no as string | null | undefined) ??
      undefined,
    variant:
      (row.variant as string | null | undefined) ??
      (row.variant_type_raw_no as string | null | undefined) ??
      undefined,
    litra: (row.litra as string | null | undefined) ?? (row.litra_raw_no as string | null | undefined) ?? undefined,
    ruler:
      (row.ruler as string | null | undefined) ??
      (row.ruler_name_raw_no as string | null | undefined) ??
      (row.historical_ruler_raw_no as string | null | undefined) ??
      undefined,
    historical_period:
      (row.historical_period as string | null | undefined) ??
      (row.historical_period_label_no as string | null | undefined) ??
      undefined,
    material:
      (row.material as string | null | undefined) ??
      (row.material_raw_no as string | null | undefined) ??
      (row.paper_type_raw_no as string | null | undefined) ??
      undefined,
    year_label:
      (row.year_label as string | null | undefined) ??
      (row.object_year_label as string | null | undefined) ??
      undefined,
    market_value_low: (row.market_value_low as string | number | null | undefined) ?? undefined,
    market_value_high:
      (row.market_value_high as string | number | null | undefined) ??
      (row.market_value as string | number | null | undefined) ??
      undefined,
    value_label:
      (row.value_label as string | null | undefined) ??
      (row.market_value_label as string | null | undefined) ??
      undefined,
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

  const data = json.data as { objects?: unknown[]; rows?: unknown[]; data?: unknown[] } | undefined;
  const objects = data?.objects ?? data?.rows ?? data?.data ?? [];

  return objects.map(normalizeCatalogObject).filter((object) => object.object_id !== "");
}

function extractFilters(json: BridgeResponse): CatalogFilterValue[] {
  const data = json.data as unknown[] | { filters?: unknown[]; rows?: unknown[]; data?: unknown[] } | undefined;
  const rows = Array.isArray(data) ? data : data?.filters ?? data?.rows ?? data?.data ?? [];

  return rows
    .map((raw) => {
      const row = raw as Record<string, unknown>;
      const rawCount = row.object_count ?? row.count;
      const objectCount = typeof rawCount === "number" ? rawCount : Number(rawCount ?? 0);
      return {
        source_key: String(row.source_key ?? ""),
        object_group: String(row.object_group ?? ""),
        filter_field: String(row.filter_field ?? ""),
        filter_value: String(row.filter_value ?? ""),
        filter_label: (row.filter_label as string | null | undefined) ?? (row.label as string | null | undefined) ?? undefined,
        object_count: Number.isFinite(objectCount) ? objectCount : undefined,
      };
    })
    .filter((filter) => filter.source_key !== "" && filter.object_group !== "" && filter.filter_field !== "" && filter.filter_value !== "");
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
    const message = json.error?.message || json.errors?.[0]?.message || `Collectium bridge failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  return extractObjects(json);
}

export async function getCatalogFilters(
  sourceKey: string,
  objectGroup: string,
  _q: string = "",
  _selectedFilter: CatalogSelectedFilter = {}
): Promise<CatalogFilterValue[]> {
  const url = new URL("catalog-filter.php", getBridgeBaseUrl());

  url.searchParams.set("source_key", sourceKey);
  url.searchParams.set("object_group", objectGroup);

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
    throw new Error(`Collectium filter bridge returned non-JSON response: ${text.slice(0, 200)}`);
  }

  if (!response.ok || json.ok === false) {
    const message = json.error?.message || json.errors?.[0]?.message || `Collectium filter bridge failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  return extractFilters(json);
}

export async function getCatalogObject(sourceKey: string, objectGroup: string, objectId: string | number): Promise<CatalogObject | null> {
  const url = new URL("catalog-object.php", getBridgeBaseUrl());

  url.searchParams.set("source_key", sourceKey);
  url.searchParams.set("object_group", objectGroup);
  url.searchParams.set("object_id", String(objectId));

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
    throw new Error(`Collectium object bridge returned non-JSON response: ${text.slice(0, 200)}`);
  }

  if (!response.ok || json.ok === false || !json.data) {
    return null;
  }

  const object = normalizeCatalogObject(json.data);
  return object.object_id === "" ? null : object;
}
