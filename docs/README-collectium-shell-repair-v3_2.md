# Collectium shell repair v3.2

Denne pakken reparerer eksisterende innlogget `CollectiumAppShell`, uten å legge ny AppShell rundt prosjektet.

## Filer

- `components/app/CollectiumAppShell.tsx`
- `components/landing/collectium-frontpage.module.css`

## Endringer

- Fjerner gammel `Beta v22`-visning og erstatter den med `DB 8.4`.
- Bruker fire låste skins:
  - `signature-light`
  - `signature-dark`
  - `minimal-light`
  - `minimal-dark`
- Mapper gamle template-navn til nye skin-navn, slik at gamle localStorage-verdier ikke låser feil skin.
- Setter både `data-skin` og `data-template` på `html` og `body`.
- Beholder eksisterende sidebar/topbar, Design, Varsler og Logg ut.
- Legger CSS-overstyring nederst i eksisterende CSS-modul, slik at gammel V22-styling ikke styrer Min side.

## PowerShell etter utpakking i prosjektrot

```powershell
npm.cmd run build
git add -A
git commit -m "Repair Collectium existing shell skin system"
git push origin main
```

## Etter deploy

Hvis nettleseren fortsatt viser gammel skin, slett lagrede valg i Console:

```js
localStorage.removeItem("collectium-template");
localStorage.removeItem("collectium-skin");
location.reload();
```
