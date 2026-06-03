Collectium theme v3 - no double shell

Denne pakken fikser feilen der siden fikk dobbel sidemeny og testknappene Collectium / Enkel / Museum / Finans.

Innhold:
- app/layout.tsx laster CSS, men wrapper IKKE med AppShell.
- app/globals.css og app/collectium-brand-tokens.css ligger globalt.
- public/collectium-logo-mask.png ligger riktig for CSS-url /collectium-logo-mask.png.
- app/lib/theme.ts ligger igjen for fremtidig styrt skin-switch.

Viktig:
- Ikke bruk app/components/TemplateSwitcher.tsx i produksjon.
- Ikke pakk eksisterende sider inn i test-AppShell hvis prosjektet allerede har egen sidebar/topbar.
- Hvis gamle AppShell/TemplateSwitcher-filer ligger igjen, kan de stå ubrukt, men de skal ikke importeres i app/layout.tsx.

Etter kopiering til prosjektroten, kjør:

npm.cmd run build
git add -A
git commit -m "Fix Collectium theme without duplicate shell"
git push origin main
