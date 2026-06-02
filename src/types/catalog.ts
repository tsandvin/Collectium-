export type CatalogSourceKey = string;
export type CatalogObjectGroup = "banknote" | "coin" | string;

export type CatalogObject = {
  object_id: string | number;
  source_key: CatalogSourceKey;
  object_group: CatalogObjectGroup;

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

export type CatalogFilterValue = {
  source_key: string;
  object_group: string;
  filter_field: string;
  filter_value: string;
  filter_label?: string | null;
  object_count?: number | string | null;
};
