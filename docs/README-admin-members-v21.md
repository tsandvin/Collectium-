# Collectium admin members v21

Bygger på v20/v19 og legger til:

- Retter TypeScript-feil i `collectiumDemoUsers.ts` (`customerType` typet som `CustomerType`).
- 20 demo-brukere med brukernavn synlig i admin og kundepresentasjon.
- Sorterbare kolonner i admin brukerlisten: Bruker, Kundenummer, Kilde, Status, KYC, Samling, Auksjon og Handling.
- Arkivfaner med antall og ny/gårsdagens indikator: Alle, Free, Bronze, Silver, Gold, Platinum, Forhandlere + Admin/Påloggede/Avloggede.
- Resultatbokser som oppdateres etter valgt filter/fane: antall brukere, antall samleobjekter, estimert verdi, online tid/support og auksjonsaktivitet.
- Demo-opprettelse av ny bruker i admin (`admin.users.create`) med brukernavn, e-post, land, medlemskap, kundetype og kundekilde.
- Design-knappen settes nå globalt på `body` og `html`, lagres i `localStorage`, og endrer app-shell, sidepanel, bakgrunn og paneler.

Dette er fortsatt frontend/demo-lag. Ekte brukeropprettelse, sletting, fletting og kundekilde skal senere gå via MariaDB/API og DB 8.4 action-routes.
