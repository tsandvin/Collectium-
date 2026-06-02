# Collectium final v22 patch

Dette er samlet v22-pakke med filene fra admin v20, admin v21 og katalog v22.

## Innhold

- 20 demo-brukere med realistisk aktivitetsdata.
- Kundekilde/opprinnelse og kundenummerregel.
- Brukernavn på alle brukere.
- Admin-opprettelse av demo-bruker i UI.
- Sorterbare kolonner i brukerlisten.
- Resultatbokser for volum, antall samleobjekter, estimert verdi og online/support/auksjon.
- Katalogside med sidemeny/topmeny, segmenter og mobil filter-lag.
- Ny demo-tilgangsbryter.

## Demo-tilgangsbryter

Admin kan stoppe demo-brukere via:

- `/admin/brukere`
- `/admin/innstillinger`

Bryteren bruker feature key:

```txt
admin.demo_users.access.toggle
```

Når demo-tilgang er stoppet:

- demo-brukere markeres som suspendert/avlogget i UI
- admin/superadmin beholdes
- aktivitetsdata, kundekilde, kundenummer og eierhistorikk beholdes
- data slettes ikke, fordi dette bare er frontend-preview

Produksjonsversjon skal lagres i MariaDB/API, ikke bare localStorage.

## Database/API-feil i katalog

Feilmeldingen:

```txt
Database ikke tilgjengelig akkurat nå.
Missing COLLECTIUM_API_BASE_URL in .env.local
```

betyr at katalogen forsøker å bruke API-bridge uten at miljøvariabelen er satt.

For lokal utvikling:

```env
COLLECTIUM_API_BASE_URL=https://collectium.no/app/api/bridge
```

For Vercel legges variabelen inn i:

```txt
Vercel -> Project -> Settings -> Environment Variables
```

Bruk riktig production URL til API-bridge når PHP/MariaDB-bridge er klar.

## Viktig regel

Frontend skal ikke eie katalogdata, brukertilganger, demo-tilgang, sletting, profilfletting eller eierhistorikk som sannhet. Dette skal senere kobles til MariaDB/API og DB 8.4-kjeden.
