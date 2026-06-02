# Collectium frontpage v11

## Endringer

- Offentlig forside uten lokal sidemeny.
- Sidemeny skal vises av global innlogget `AppShell` etter login.
- Objektoverskriften står alene uten tekst foran.
- Samler / Historie / Finans ligger over objektkortet.
- Mynter og Sedler animeres automatisk.
- Bildene i HTML-preview er innebygd som base64 slik at forhåndsvisningen fungerer lokalt fra `file:///`.
- Skin-regler er korrigert:
  - Collectium: 8px hjørne, svak indre ramme, signaturhjørne.
  - Enkel: 12px hjørne, Comfortaa-lignende skrift og enklere signatur.
  - Museum: grå/svart museumsflate.
  - Finans: mørk blå finansflate.
- Medlemspriser er rettet etter låst prisregel.
- Premium er fjernet.
- Platinum har ingen månedlig pris.
- Gold krever forhandlersignering og egne etableringsvalg.
- Brytere/feature_keys for registrering, innlogging og katalog er lagt inn.

## Berørte feature keys

- landing.view
- landing.membership
- landing.featured_objects
- auth.login
- auth.register
- catalog.view
- catalog.search
- catalog.filters
- catalog.object.open

## Prisregel

Bronze:
- 149 kr første år
- deretter 199 kr/mnd

Silver:
- 3 000 kr/år tilbud
- deretter 6 000 kr/år

Gold:
- 10 000 kr første år
- deretter 20 000 kr/år
- krever forhandlersignering
- gruppevalg
- fee % av omsetning
- 5 000 kr etablering per gruppe/auksjon/nettbutikk

Platinum:
- 100 000 kr/år
- ingen månedlig pris
- 50 % rabatt i ett år
- kunden betaler 50 000 kr i rabattperioden og får Platinum i to år


## v11 correction
- Removed technical DB key text from public frontpage.
- Removed dealer setup/fee details from public membership section; this belongs in dealer account onboarding.
- Gold remains an annual plan with separate dealer registration flow.
