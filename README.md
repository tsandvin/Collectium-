# Collectium Developer Builder v1.5

## Nytt i v1.5
- Ny knapp: **Se frontdesign**
- Frontdesign-visning som viser:
  - alle manifest-sider
  - lokale `page`, `component` og `style` filer fra valgt mappe
- Valgt lokal frontfil blir aktiv fil for preflight/deploy.
- Ny knapp: **Deploy**
- Deploy med dobbelbekreftelse:
  1. **AI-sjekk / preflight**
  2. **Deploy mock/staging**
- Preflight sjekker blant annet:
  - tom fil
  - merge conflicts
  - farlig SQL
  - låste Collectium-kjernefiler
  - mulig usikker API/DB-skriving
  - manglende `object_group` ved `source_key`
- Deploy er **mock/staging** i denne versjonen. Den skriver ikke live filer.
- Live deploy må senere kobles til godkjent serverroute, audit-logg, tilgang og route whitelist.

## Viktig
Browseren kan ikke lese en Windows-mappe automatisk. Trykk **Last inn lokal mappe** og velg prosjektmappen manuelt:

```text
C:\Users\Bruker\Pictures\Next,js react front og bac-end UIUX -DB 8.3\Datbase Next.js react
```

## Start

```powershell
.\Start-Collectium-Canvas.cmd
```

## Manuell start

```powershell
npm.cmd install
npm.cmd run dev
```

Åpne:

```text
http://localhost:3000
```

## API-er

```text
/api/control/manifest
/api/control/search?q=catalog
/api/deploy/preflight
/api/deploy/mock
```
