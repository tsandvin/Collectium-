# Collectium build fix v4.2

## Formaal
Fjerner siste buildfeil etter at `TemplateSwitcher.tsx` ble slettet.

## Problem
`app/components/AppShell.tsx` importerte fortsatt `./TemplateSwitcher`, mens filen `app/components/TemplateSwitcher.tsx` er fjernet.

## Endring
Denne pakken erstatter `app/components/AppShell.tsx` med en ren shell-komponent uten `TemplateSwitcher`.

## Etter kopiering
Kjor:

```powershell
npm.cmd run build
git add -A
git commit -m "Fix AppShell after removing template switcher"
git push origin main
```

## Rydding anbefalt
Hvis mappen `collectium-shell-repair-upload` ligger i repoet, kan den slettes. Den var bare en opplastingsmappe og skal ikke ligge i produksjonsrepoet.
