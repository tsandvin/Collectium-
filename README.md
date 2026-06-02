# Collectium API bridge patch

Denne pakken flytter MariaDB-tilkoblingen bort fra lokal Next.js og over til PHP/API på Domeneshop.

## 1. Last opp PHP-filer

Last opp innholdet i:

```text
app/api/bridge/
```

til serveren:

```text
www/app/api/bridge/
```

## 2. Lag config.php på server

Kopier:

```text
config.example.php
```

til:

```text
config.php
```

Fyll inn ekte DB-passord og en lang API-nøkkel.

## 3. Oppdater lokal .env.local i Next.js

Legg til:

```env
COLLECTIUM_API_BASE_URL=https://www.collectium.no/app/api/bridge/
COLLECTIUM_API_KEY=samme_api_nokkel_som_i_config_php
```

Du kan la DB_* stå, men Next.js skal ikke lenger bruke dem for katalog/admin-kontroll når filene i denne pakken er lagt inn.

## 4. Kopier Next-filer

Kopier filene fra `next/` inn i prosjektroten din. De erstatter tilsvarende filer.

## 5. Test

Start lokalt:

```powershell
npm.cmd run dev
```

Åpne:

```text
http://localhost:3000/admin/kontroll
```

Forventet: siden viser databasenavn og antall i `ct_app_pages`.
