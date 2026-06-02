# Collectium frontpage v14

Bygger på låst v12/v13-forside, men retter designsystemet og signaturen.

## Endringer

- Fjerner feltet `Aktiv template: Collectium` fra landingssiden.
- PublicTopMenu har utvidet Design-panel:
  - template: Collectium, Enkel, Museum, Finans
  - hovedskrift 9-17px
  - overskrift 16-25px
  - headline 18-42px
  - luft i bokser/felt
  - skjermstørrelse/visningsmodus
- Designvalg lagres i `localStorage` og settes som CSS-variabler på dokumentet.
- Forhandlere-lenken peker til `/forhandler`.
- Alias `/forhandlere` videresender til `/forhandler`.
- Root layout er public layout uten global sidemeny.
- Signaturen er ny indre rammedetalj:
  - fade starter ca. 30% fra venstre
  - svak grå Collectium-tekst
  - 2px åpning før og etter teksten
  - linjen fortsetter rundt høyre hjørne og opp langs høyre side
  - radius følger ytre ramme

## Filer

- `app/layout.tsx`
- `app/forhandlere/page.tsx`
- `components/layout/PublicTopMenu.tsx`
- `components/landing/CollectiumFrontpageClient.tsx`
- `components/landing/collectium-frontpage.module.css`
- `components/auth/AuthPageClient.tsx`
