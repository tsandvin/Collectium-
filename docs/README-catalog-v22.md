# Collectium katalog v22

## Formål

Denne pakken legger inn en innlogget katalogside med:

- global sidemeny fra `CollectiumAppShell`
- global toppmeny med design/varsler/logout
- katalogens egen arbeidsflate på `/katalog`
- desktop sidefilter
- mobil filter-lag/overlay
- segmenter: Samler, Historie, Finans
- visninger: Horisontal, Stående, Liste
- demoobjekter for sedler og mynter

## Viktige filer

```txt
app/katalog/page.tsx
components/catalog/CatalogWorkspaceClient.tsx
components/app/CollectiumAppShell.tsx
components/landing/collectium-frontpage.module.css
```

## Låst katalogmodell

Katalogen skal senere hente fra API/MariaDB, men frontendstrukturen følger denne modellen:

```txt
Land / område
→ Kilde
→ Objekttype
→ Produsent
→ Utgave / serie
→ År / periode
→ Valør
→ Litra / detaljer
→ Variant / type
→ Signatur / personer
→ Regent / konge
→ Marked
→ Auksjon
→ Nettbutikk
→ Samling
```

Objekter skal fortsatt teknisk slås opp med:

```txt
object_id + object_group + source_key
```

Filter skal senere sendes til API som:

```txt
country / area + source_key + object_group + filter_field + filter_value
```

## Mobil

På mobil vises ikke venstre filter fast. Brukeren får en sticky filterknapp som åpner et fullskjerm/sideark filter-lag.

## Neste steg

- koble `catalogObjects` og `filterGroups` til `/api/catalog/search` og `/api/catalog/filter`
- koble hjerte/stjerne/min samling mot `ct_user_object_states`
- koble auksjon til `market_channel = auction`
- koble nettbutikk til shop/listing-status
