export const objectFilterOrder = [
  { label: "Valør / objektbetegnelse", field: "denomination_raw_no" },
  { label: "Årstall", field: "object_year_label" },
  { label: "Litra / nummer / detalj", field: "litra_raw_no" },
  { label: "Valørutgave / serie", field: "denomination_issue_raw_no" },
  { label: "Variant / type", field: "variant_type_raw_no" },
  { label: "Signatur / personer", field: "signature_raw_no" },
  { label: "Konge / regent", field: "ruler_name_raw_no" },
  { label: "Historisk regent", field: "historical_ruler_raw_no" },
  { label: "Dynasti / kongehus", field: "dynasty_house_raw_no" }
];

export const collectiumSourceRules = [
  "source_key + object_group + object_id er primærnøkkel for frontend-objekt.",
  "React skal lese resolved API-data, ikke hardkode katalogtruth.",
  "Filterverdier skal scopes per source_key + object_group + filter_field + filter_value.",
  "denomination_issue_raw_no skal vises som Valørutgave / serie."
];
