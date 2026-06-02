-- Collectium frontend source schema draft v0.9
CREATE TABLE IF NOT EXISTS ct_catalog_objects_resolved (
  source_key VARCHAR(80) NOT NULL,
  object_group VARCHAR(80) NOT NULL,
  object_id VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  denomination_raw_no VARCHAR(160),
  object_year_label VARCHAR(80),
  litra_raw_no VARCHAR(120),
  denomination_issue_raw_no VARCHAR(180),
  variant_type_raw_no VARCHAR(180),
  signature_raw_no VARCHAR(180),
  ruler_name_raw_no VARCHAR(180),
  historical_ruler_raw_no VARCHAR(180),
  dynasty_house_raw_no VARCHAR(180),
  market_value DECIMAL(14,2),
  currency VARCHAR(12),
  relations_json JSON,
  PRIMARY KEY (source_key, object_group, object_id)
);
