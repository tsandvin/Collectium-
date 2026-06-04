# Collectium

Collectium er satt opp som en renset minimal kjerne for ny oppbygging.

## Status

Prosjektet er ryddet ned til en enkel Next.js / React-startflate slik at videre utvikling kan bygges kontrollert på nytt.

Repoet skal brukes som ny frontend/app-kjerne for Collectium, ikke som videreføring av gamle lose sidefiler og lokale designvalg.

## Ny hovedretning

Collectium bygges videre som:

- Next.js + React frontend
- Backend/API-lag for auth, session, katalog, medlem, admin og systemfunksjoner
- MariaDB som sannhet for data
- DB 8.4 som kontrollmodell for sider, brytere/features, tilgang, routes og logging
- Global layout med felles topbar, sidemeny og sideframe
- Ingen hardkoding av katalogdata, priser, medlemskap, filterverdier eller tilgang i frontend

## Renset startkjerne

Forelopig kjerne inneholder:

- `/` startside
- `/login`
- `/logout`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/session`

Dette er et bevisst minimumsniva. Nye sider skal legges til kontrollert, versjonert og dokumentert.

## Videre bygging

Neste steg skal bygges i denne rekkefolgen:

1. Innlogging, logout og session
2. Min side
3. Global sidemeny/topbar
4. Medlemskap og tilgang
5. Admin kontroll
6. Katalog
7. Samling
8. Auksjon
9. Forhandler
10. Index / markedsanalyse

## Regler for videre utvikling

- MariaDB/API er sannhet.
- Frontend viser bare data og handlinger som API/backend tillater.
- Hver systemhandling skal ha feature_key, access rule, API/action-route og logging.
- Nye filer skal ha tydelig navn, versjon og formal.
- Storre endringer skal dokumenteres i `docs/`.

## Gjeldende retning

```txt
STATUS: Clean rebuild baseline
CHANGE: Cleaned old structure and restarted with minimal Next.js / React core
DIRECTION: Build Collectium again from a controlled app foundation
```
