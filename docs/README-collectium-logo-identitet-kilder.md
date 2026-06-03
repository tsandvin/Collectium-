# Collectium logo- og identitetskilder v1.0

## Formaal
Dette er kildemappe for Collectium-identitet, logo og merke. Filene skal brukes som referanse for template-/skin-systemet i Collectium.

## Laast identitet
Collectium skal ha fire template-retninger:

1. Collectium Signature Light
2. Collectium Signature Dark
3. Collectium Minimal Light
4. Collectium Minimal Dark

Logo/merke skal kunne brukes i alle fire retninger. Signature kan bruke gull/arkiv/museum-uttrykk. Minimal kan bruke enklere, renere blaa/hvit eller moerk variant.

## Kildebilder

### 1. collectium-c-emblem-gold.png
Bruk: C-emblem / monogram / merkeikon.

Anbefalt bruk:
- favicon / app-icon etter egen eksport
- liten signatur i hjørner
- toppbar-logo
- stempel/arkivdetalj i Signature skin
- vannmerke i admin/template dersom svært svakt

### 2. collectium-logo-dark-composition.png
Bruk: mørk/black logo-komposisjon med Collectium-identitet.

Anbefalt bruk:
- designreferanse
- mørk template-kilde
- logoanalyse / brand-sammenligning

### 3. collectium-logo-wide-dark-composition.png
Bruk: bred logo-komposisjon / hero-logo / header-logo.

Anbefalt bruk:
- bred toppbar
- presentasjon / cover
- landing
- dokumentasjon

### 4. collectium-logo-white.png
Bruk: hvit logo for mørke bakgrunner.

Anbefalt bruk:
- Signature Dark
- Minimal Dark
- mørk landing
- mørk topbar

## Plasseringsregel i prosjekt
Anbefalt mappe i Next.js:

```txt
public/brand/collectium/
  collectium-c-emblem-gold.png
  collectium-logo-dark-composition.png
  collectium-logo-wide-dark-composition.png
  collectium-logo-white.png
```

For komponenter:

```txt
components/brand/CollectiumLogo.tsx
components/brand/CollectiumMark.tsx
components/layout/CollectiumSignature.tsx
```

## Designregel
Logo og merke skal ikke hardkodes i enkeltsider. De skal ligge i global template/layout/brand-komponenter slik at skin-systemet kan velge riktig variant.

Eksempel:

```txt
skin = signature-light -> gold emblem + dark green text
skin = signature-dark  -> gold emblem + light/gold text
skin = minimal-light   -> blue emblem/text
skin = minimal-dark    -> white/blue logo
```

## Bruksregel
Logo-kildene er identitetskilder. Ikke endre proporsjoner, ikke strekk logoen, og ikke bruk tilfeldig fargevariant uten at den er definert som skin-token.

## Status
Kilde lagret: 2026-06-02
Versjon: CT-BRAND-SOURCE-0001
