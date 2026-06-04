# Collectium Admin brukere v24.1

Denne pakken inneholder en ny kontrollert admin-brukerside som følger Collectium-reglene:

- ingen side-eid visuell styling
- ingen CSS module
- ingen lokal bakgrunn, farge, shadow, radius eller paneldesign
- bruker globale Collectium-komponenter
- bruker API/backend som datakilde
- DB 8.4 feature/action-route er dokumentert i filheader

## Filer

```txt
components/admin/AdminUsersClient.tsx
app/admin/brukere/page.tsx
docs/CHANGE-2026-06-04-admin-users-v24.1.md
```

## Installer

Kopier filene inn i prosjektet med samme stier.

## Kjør

```powershell
npm.cmd run build
```

Ikke bruk `npm run build` i PowerShell hvis execution policy blokkerer npm.ps1. Bruk `npm.cmd run build`.


## v24.1 fix
- Endret UI-komponentimporter fra named imports til default imports, fordi eksisterende globale Collectium UI-komponenter eksporteres som default.
- Ingen design-, DB- eller route-endringer.
