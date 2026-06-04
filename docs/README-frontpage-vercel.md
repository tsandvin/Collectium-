# Collectium frontside til Vercel

Denne pakken inneholder en kontrollert Next.js/App Router frontside basert på siste canvas-retning.

## Filer

```txt
app/page.tsx
components/frontpage/CollectiumFrontPageClient.tsx
components/frontpage/CollectiumFrontPage.module.css
```

## Plassering

Kopier filene inn i prosjektet slik:

```txt
<repo>/app/page.tsx
<repo>/components/frontpage/CollectiumFrontPageClient.tsx
<repo>/components/frontpage/CollectiumFrontPage.module.css
```

Ta backup av eksisterende `app/page.tsx` før du erstatter den.

## Bilder som forventes i public

```txt
public/images/brand/Collectium.C Image.0053254.png
public/images/famile-collectium.webp
```

Hvis familiebildet har et annet filnavn, endre kun `src` i registeringsfeltet.

## Funksjoner i denne versjonen

- Global skin-tankegang via CSS-variabler.
- Hero med Collectium-logo og avstand til bilde.
- Dynamiske Samler / Historie / Finans-brytere.
- Stående kort og listevisning.
- Enkel filterhåndtering.
- Sortering.
- Visningskortstandard: overskrift, valørutgave, variant, sjeldenhet, kvalitet, dynamisk felt.
- Harmonisert handlingsfelt.
- Medlemskapskort med Mnd / År-toggle, stor tilbudspris og svakere ordinærpris.
- Stort registreringsfelt nederst med familiebilde.

## Viktig

Dette er en Vercel/Next.js frontsidepakke, ikke en canvas HTML-preview. Den skal bare brukes når du faktisk vil opprette/oppdatere frontside i prosjektet.
