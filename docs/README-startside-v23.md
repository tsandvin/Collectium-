# Collectium startside v23

## Innhold

Denne pakken legger inn en levende startside for Collectium med:

- hero med tydelige CTA-knapper
- levende objektpresentasjon som bytter mellom objekter
- segmentknapper: Samler, Historie, Finans
- objektgruppeknapper: Sedler, Mynter
- tydelige knapper for Hjerte, Stjerne og Min samling
- historiske felt for Oscar II og Karl Johan
- forhandlerposisjon med to felt
- stort bunnfelt med Bli medlem

## Filer

```txt
app/page.tsx
components/frontpage/CollectiumFrontpageV23.tsx
components/frontpage/CollectiumFrontpageV23.module.css
docs/README-startside-v23.md
```

## Viktig regel

Brukerrettet tekst omtaler Collectium som katalog, objektgrunnlag, relasjoner, samlerdata, historie og verdiutvikling. Den viser ikke tekniske formuleringer som forklarer database eller API på startsiden.

## Installasjon

Kopier filene inn i prosjektroten i Next.js-prosjektet.

Dersom `app/page.tsx` allerede finnes, lag backup eller sammenlign manuelt før filen erstattes.

## Designregel

Komponenten definerer ikke global shell, topbar, sidebar, skin eller globale designfiler. Den bruker egen CSS-modul og kan derfor legges inn uten å endre låst Collectium-designmotor.

## Fremtidig kobling

Objektlisten i `CollectiumFrontpageV23.tsx` er strukturert slik at den senere kan erstattes av data fra godkjent frontpage-/catalog-endepunkt. Brukerrettet tekst på siden skal fortsatt holdes produktrettet, ikke teknisk.
