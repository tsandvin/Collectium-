COLLECTIUM THEME V3 - OPPLASTINGSPAKKE

Denne mappen er laget med riktig Next.js-plassering.
Last opp/kopier innholdet i denne mappen til prosjektroten.

Riktig plassering:
- app/globals.css
- app/collectium-brand-tokens.css
- app/layout.tsx
- app/page.tsx
- app/error.tsx
- app/not-found.tsx
- app/components/AppShell.tsx
- app/lib/theme.ts
- public/collectium-logo-mask.png
- docs/README-collectium-theme.md
- docs/README-collectium-logo-identitet-kilder.md

Viktig:
- Ikke legg disse filene flatt i app-mappen.
- AppShell.tsx skal ligge i app/components/.
- theme.ts skal ligge i app/lib/.
- collectium-logo-mask.png skal ligge i public/.
- layout.tsx er allerede satt med:
  import "./globals.css";
  import "./collectium-brand-tokens.css";
  data-template="collectium"
  data-skin="signature-light"

Etter at filene er kopiert inn i prosjektet, kjør i PowerShell:

npm.cmd run build
git add -A
git commit -m "Install Collectium theme v3 upload package"
git push origin main
