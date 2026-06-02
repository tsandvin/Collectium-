import type { CatalogFilterValue, CatalogObject } from "@/types/catalog";

export async function getCatalogFilters(
  sourceKey: string,
  objectGroup: string
): Promise<CatalogFilterValue[]> {
  return [];
}

export async function searchCatalogObjects(
  sourceKey: string,
  objectGroup: string,
  q: string = ""
): Promise<CatalogObject[]> {
  return [];
}

export async function getCatalogObject(
  sourceKey: string,
  objectGroup: string,
  objectId: string
): Promise<CatalogObject | null> {
  return null;
}
