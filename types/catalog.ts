/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * types/catalog
 *
 * Definering / formål:
 * Felles TypeScript-typer for katalogfilter, katalogobjekter og objektpresentasjon.
 * Midlertidig build-sikker typekontrakt før komplett MariaDB/API-modell låses.
 *
 * Berørte sider / routes:
 * - /katalog
 * - /objekt/[sourceKey]/[objectGroup]/[objectId]
 * - /api/catalog/*
 *
 * Berørte DB-brytere / feature_keys:
 * - catalog.search
 * - catalog.filters
 * - catalog.object.open
 *
 * Dataretning:
 * MariaDB/API -> Next.js -> React -> UI
 */

export type CatalogFilterValue = {
  filter_field?: string;
  filterField?: string;
  field?: string;

  filter_value?: string;
  filterValue?: string;
  value?: string;

  label?: string;
  filter_label?: string;
  object_count?: number;
  count?: number;
  total?: number;

  source_key?: string;
  sourceKey?: string;
  object_group?: string;
  objectGroup?: string;

  country?: string;
  group?: string;
  sort_order?: number;

  [key: string]: unknown;
};

export type CatalogObject = {
  object_id?: string | number;
  objectId?: string | number;

  object_group?: string;
  objectGroup?: string;

  source_key?: string;
  sourceKey?: string;

  source_catalog_number?: string;
  sourceCatalogNumber?: string;

  title?: string;
  object_title_no?: string;
  collectium_title?: string;

  country?: string;
  country_raw_no?: string;

  source_name?: string;
  sourceName?: string;

  object_type?: string;
  objectType?: string;

  producer?: string;
  producer_raw_no?: string;

  denomination?: string;
  denomination_raw_no?: string;

  year?: string | number;
  object_year_label?: string;
  publication_year_label?: string;

  litra?: string;
  litra_raw_no?: string;

  denomination_issue?: string;
  denomination_issue_raw_no?: string;

  variant?: string;
  variant_type_raw_no?: string;

  signature?: string;
  signature_raw_no?: string;

  ruler?: string;
  ruler_name_raw_no?: string;
  historical_ruler_raw_no?: string;

  material?: string;
  material_raw_no?: string;

  grade?: string;
  grade_raw_no?: string;

  rarity?: string;
  rarity_raw_no?: string;

  market_value?: number | null;
  marketValue?: number | null;

  trend?: number | string | null;
  trend_percent?: number | null;

  image_url?: string;
  imageUrl?: string;
  obverse_image_path?: string;
  reverse_image_path?: string;

  auction_status?: string;
  shop_status?: string;
  collection_status?: string;
  user_state?: string;

  relations_count?: number;

  [key: string]: unknown;
};

