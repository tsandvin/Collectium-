Collectium theme v3.1 SHELL FIXED

Denne pakken fikser hovedfeilen: app/layout.tsx wrapper nå alle sider i <AppShell>.
Uten dette lastes globals.css, men siden bruker fortsatt gammelt sideskall/design.

Kopier innholdet i denne mappen inn i prosjektroten.

Riktig struktur:
app/layout.tsx
app/globals.css
app/collectium-brand-tokens.css
app/components/AppShell.tsx
app/components/TemplateSwitcher.tsx
app/lib/theme.ts
public/collectium-logo-mask.png

Etter kopiering:
npm.cmd run build
git add -A
git commit -m "Fix Collectium theme shell and skin switcher"
git push origin main

Etter Vercel deploy:
Åpne siden og test knappene i topbaren: Collectium, Enkel, Museum, Finans.
Hvis gammel skin ligger i nettleseren, kjør i browser console:
localStorage.removeItem("ct-template"); location.reload();
