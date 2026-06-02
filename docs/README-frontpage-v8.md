# Collectium Frontpage v8

## Formål

Dette er en korrigert forside basert på v4-retningen, med samme rene landingstruktur uten lokal sidemeny. Sidemeny er global og skal ikke ligge i forsiden.

## Endring fra v4

I objektfeltet i hero-visningen er det lagt inn segmentbryter:

- Samler
- Historie
- Finans

Når brukeren bytter segment, endres informasjonen i objektkortet og i det detaljerte objektvisningskortet under.

## Detaljert objektvisningskort

Forsiden viser nå at Collectium har et detaljert objektvisningskort. Dette er bare en presentasjonsdemo på forsiden. Senere skal faktisk objektdata komme fra API/MariaDB.

### Samler

Viser hjerte, stjerne, Min samling, egne lister, kvalitet, kjøpspris, kjøpsdato, notater, dokumentasjon og deling.

### Historie

Viser produsent, utgave, periode, regent, signaturer, personer, materiale, proveniens, funn og relasjoner.

### Finans

Viser markedsverdi, trendprosent, likviditet, ferske salg, auksjonsresultater, nettbutikkpriser, kjøpspris og fortjeneste.

## Viktig regel

Forsiden skal ikke eie objektdata eller tilgangslogikk. Dette feltet er en visuell demonstrasjon av katalog-/objektkortfunksjonene. Produksjonsdata skal senere hentes slik:

```text
MariaDB → API/backend → Next.js → React → UI
```

## Filer

```text
app/page.tsx
components/landing/CollectiumFrontpageClient.tsx
components/landing/collectium-frontpage.module.css
public/brand/*
```
