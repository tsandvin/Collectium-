# Collectium Codex Instructions

Bygg en clean Next.js / React kodebase for app.collectium.no.

## Mål
Produksjonsklar Collectium-app. Ingen demo/mock på produksjonssider.

## Arkitektur
- Next.js App Router.
- React + TypeScript.
- Server Components som standard.
- Client Components kun ved interaktiv UI.
- Ingen direkte MariaDB-kall fra client components.
- MariaDB er sannhet.
- API/server data layer er eneste kobling mot MariaDB.

## DB 8.4-kjede
ct_app_pages -> ct_app_page_features -> ct_app_features -> ct_feature_access_rules -> ct_v_feature_access_resolved -> ct_feature_action_routes -> API/backend -> tabell/view -> logg.

## Katalognøkler
Objekt: object_id + object_group + source_key.
Filter: source_key + object_group + filter_field + filter_value.

## Forbud
- Ikke hardkod filterverdier, priser, tilgang, medlemskap eller katalogdata.
- Ikke legg credentials i kode.
- Ikke lag side-spesifikt skall/design.
- Ikke bland kilder uten source_key.
