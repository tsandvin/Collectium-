/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * db/queries/catalog
 *
 * Definering / formål:
 * Midlertidige katalogspørringer for Next.js build.
 * Skal senere erstattes av ekte MariaDB queries/views.
 *
 * Berørte sider / routes:
 * - /katalog
 * - /objekt/[sourceKey]/[objectGroup]/[objectId]
 * - /api/catalog/search
 * - /api/catalog/filter
 *
 * Berørte DB-brytere / feature_keys:
 * - catalog.search
 * - catalog.filters
 * - catalog.object.open
 *
 * Dataretning:
 * MariaDB fallback -> API/backend -> Next.js -> React
 */

import type { CatalogFilterValue, CatalogObject } from "@/types/catalog";

export type CatalogSelectedFilter = {
  field: string;
  value: string;
};

const fallbackObjects: CatalogObject[] = [
  {
    object_id: "23",
    object_group: "banknote",
    source_key: "norske_sedler",
    title: "1 krone · 1917 · Litra A",
    country: "Norge",
    source_name: "Norske sedler",
    object_type: "Seddel",
    producer: "Norges Bank",
    denomination: "1 krone",
    year: "1917",
    variant: "Litra A",
    rarity: "Ikke vurdert",
    market_value: null,
    trend: null,
    image_url: "",
  } as unknown as CatalogObject,
];

const fallbackFilters: CatalogFilterValue[] = [
  {
    filter_field: "country",
    filter_value: "Norge",
    label: "Norge",
    count: 1,
  } as unknown as CatalogFilterValue,
  {
    filter_field: "source_key",
    filter_value: "norske_sedler",
    label: "Norske sedler",
    count: 1,
  } as unknown as CatalogFilterValue,
  {
    filter_field: "object_group",
    filter_value: "banknote",
    label: "Seddel",
    count: 1,
  } as unknown as CatalogFilterValue,
];

export async function getCatalogFilters(_sourceKeyOrFilters?: string | CatalogSelectedFilter[], _objectGroup?: string): Promise<CatalogFilterValue[]> {
  return fallbackFilters;
}

export async function searchCatalogObjects(_sourceKeyOrFilters?: string | CatalogSelectedFilter[], _objectGroup?: string, _query?: string): Promise<CatalogObject[]> {
  return fallbackObjects;
}

export async function getCatalogObject(
  sourceKeyOrParams?: string | {
    sourceKey?: string;
    source_key?: string;
    objectGroup?: string;
    object_group?: string;
    objectId?: string;
    object_id?: string;
  },
  objectGroupArg?: string,
  objectIdArg?: string
): Promise<CatalogObject | null> {
  const sourceKey =
    typeof sourceKeyOrParams === "string"
      ? sourceKeyOrParams
      : sourceKeyOrParams?.sourceKey ?? sourceKeyOrParams?.source_key;

  const objectGroup =
    typeof sourceKeyOrParams === "string"
      ? objectGroupArg
      : sourceKeyOrParams?.objectGroup ?? sourceKeyOrParams?.object_group;

  const objectId =
    typeof sourceKeyOrParams === "string"
      ? objectIdArg
      : sourceKeyOrParams?.objectId ?? sourceKeyOrParams?.object_id;

  return (
    fallbackObjects.find(
      (object) =>
        String((object as any).source_key) === String(sourceKey) &&
        String((object as any).object_group) === String(objectGroup) &&
        String((object as any).object_id) === String(objectId)
    ) ?? fallbackObjects[0] ?? null
  );
}




