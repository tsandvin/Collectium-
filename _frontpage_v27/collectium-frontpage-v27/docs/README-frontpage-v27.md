# Collectium frontpage v27

## Retning

Denne versjonen erstatter den mer lekne/demoaktige v26-retningen med en mer seriøs offentlig forside.

## Innhold

- profesjonell toppmeny
- editorial hero
- seriøst objektkort uten barnslige ikoner
- Hjerte og Stjerne uten sirkel/tall
- funksjonskort for egen samling, relasjonsdata, finansdata, estimering, auksjon, deling og forhandler
- fullbredde midtbilde med familie/samler-motiv
- medlemskap
- marked/aktivitet
- registreringstilbud

## Viktig bilde

Pakken legger ved:

`public/images/collectium-family-collector-hero.png`

Komponenten bruker:

`/images/collectium-family-collector-hero.png`

Hvis prosjektet allerede har ønsket bilde i `public/images`, kan dette bildet erstattes med samme filnavn.

## Filer

- `app/page.tsx`
- `components/frontpage/CollectiumFrontpageV27.tsx`
- `components/frontpage/CollectiumFrontpageV27.module.css`
- `public/images/collectium-family-collector-hero.png`
- `docs/README-frontpage-v27.md`

## Deploy

Kopier filene inn i prosjektet, kjør:

```powershell
npm run build
git add app/page.tsx components/frontpage public/images/collectium-family-collector-hero.png docs/README-frontpage-v27.md
git commit -m "Add Collectium frontpage v27"
git push origin main
```
