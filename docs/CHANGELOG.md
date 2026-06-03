# CHANGELOG

## v9

- Beholder offentlig forside uten lokal sidemeny.
- Dokumenterer at global sidemeny først vises etter innlogging via AppShell.
- Flytter Samler / Historie / Finans-knappene over objektkortet.
- Fjerner tre prikker i objektvisningsrammen.
- Legger til animert veksling mellom Sedler og Mynter i objektkortet.
- Beholder detaljert objektvisningskort under kortet.

## v8

- Tok utgangspunkt i v4-forsiden.
- La til Samler / Historie / Finans i objektfeltet.
- La til definisjon av detaljert objektvisningskort.

## v11

- Corrected membership prices.
- Removed Premium as plan/wording.
- Removed object-title prefix conflict.
- Added feature switches for auth.register, auth.login, catalog.view, catalog.search, catalog.filters and catalog.object.open.
- Added standalone base64 preview for local file opening.
- Corrected skin names and visual rules.


## v11 correction
- Removed technical DB key text from public frontpage.
- Removed dealer setup/fee details from public membership section; this belongs in dealer account onboarding.
- Gold remains an annual plan with separate dealer registration flow.


## v12

- Delt funksjonsfelt i venstre brytere og høyre innhold.
- Rettet template/skin-knapp i statisk preview.
- Beholder offentlig forside uten sidemeny og uten tekniske DB-felter.

## v13

- V12 beholdt som låst designretning.
- Lagt til offentlig toppmeny med Design-knapp.
- Lagt til login-side.
- Lagt til registreringsside.
- Lagt til felles PublicTopMenu-komponent.
- Lagt til felles AuthPageClient-komponent.
- Silver rettet til både års- og månedsvisning.
- Feature keys for login, registrering og katalog ligger som `data-feature-key`, men teknisk DB-info vises ikke offentlig.


## v14

- Utvidet Design-panel med sliders for skrift, overskrift, headline og luft.
- Lagrer template og designvalg på tvers av public-sider.
- Ny signaturmodell som indre ramme med fade og høyre hjørneføring.
- Fjernet aktiv-template-feltet fra landingssiden.
- Rettet Forhandlere-lenke og lagt inn aliasroute.
- Lagt inn public root layout uten global sidemeny.

## v15 - Auth, Min side, Admin og låst signatur

- La inn opplastet Collectium locked signature CSS/JS i public/assets.
- Root layout laster global signatur CSS/JS.
- Login og registrering sender nå til API-ruter.
- La inn midlertidig server-only session-cookie for innlogging.
- La inn /minside med innlogget app-shell.
- La inn /admin med superadmin-kontroll.
- Designpanelet åpnes som overlay og skal ikke presse login-layout.
- Auth/login støtter superadmin fra Vercel environment variables.

## v18 - Admin kundekilde og kundenummer

- Lagt til låst kundenummerregel: CT-[LANDSKODE]-[ÅR]-[LØPENUMMER].
- Lagt til forhandlernummerregel: CTD-[LANDSKODE]-[ÅR]-[LØPENUMMER].
- Lagt til kundekilde/opprinnelse i adminlisten.
- Lagt til filter for kundekilde.
- Endret brukerlisten til fullbredde.
- Flyttet arkivfaner slik at medlemskap/forhandlere ligger til venstre og Admin/Påloggede/Avloggede til høyre.
- Utvidet ekspanderte brukerrader med kontakt, kundenummer, kundekilde, første aktivitet, samlergrupper, status og support.
- Utvidet kundepresentasjonen med kundekilde, nummerregel og supportverktøy.


## v19
- Fjernet egen Prosesser-knapp fra innlogget topbar. Prosesser vises under Varsler-menyen.


## v21
- Admin brukerlisten har nå sorterbare kolonner, resultatvolum, brukernavn, opprett ny bruker-panel og fungerende global designknapp.
- Fikser TypeScript-typing for demoUsers customerType.

## Final v22 patch

- Samlet v20, v21 og v22 i én endelig v22-pakke.
- Lagt til bryter for å stoppe demo-brukere fra testtilgang.
- Lagt til dokumentasjon for `COLLECTIUM_API_BASE_URL` og katalog/API-bridge.
- Beholder kundekilde, kundenummer, demoaktivitet, sletteregel, profilfletting og katalogarbeidsflate.

## CHANGE-2026-06-03-design-overlay-admin-colors

- Flyttet innlogget Design-panel til global React portal fra `CollectiumAppShell`, slik at det rendres over admininnhold i stedet for inne i topbar/layoutflyt.
- La inn transparent klikkflate, Escape-lukking og fixed overlay med toppnivå z-index.
- Oppdaterte Collectium admin-skin til solide mørke panel-/kort-/felt-tokens, mens lys skin beholdes i Enkel.
- Berørte filer: `components/app/CollectiumAppShell.tsx`, `components/landing/collectium-frontpage.module.css`, `app/globals.css`.
