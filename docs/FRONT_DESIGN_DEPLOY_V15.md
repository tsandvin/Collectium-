# Frontdesign og deploy v1.5

## Frontdesign
Knappen **Se frontdesign** viser alle registrerte manifest-sider og alle lokale frontfiler fra valgt mappe.

Lokale frontfiler inkluderer:
- pages
- components
- styles

## Deployflyt
Deploy er todelt:

### 1. Første bekreftelse: AI-sjekk / preflight
Preflight sjekker filen for:
- tom/manglende fil
- merge conflicts
- farlig SQL
- låste Collectium-kjernefiler
- mulig usikker API/DB-skriving
- mangelfull katalogscope

### 2. Andre bekreftelse: Deploy mock/staging
I v1.5 skrives ingen live filer. Dette lager kun en mock deploy receipt.

## Hvorfor ikke live deploy ennå?
Live deploy må kobles til:
- godkjent server-side deploy route
- rollebasert tilgang
- audit-logg
- route whitelist
- rollback
- eksplisitt dobbelbekreftelse
