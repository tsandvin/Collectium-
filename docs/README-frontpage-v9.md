# Collectium Frontpage v9

## Endring fra v8

Denne versjonen beholder den rene offentlige forsiden uten lokal sidemeny.

Regel:

```txt
Offentlig forside = ingen sidemeny.
Innlogget app = global AppShell viser sidemeny.
```

Sidemenyen skal derfor ikke bygges inne i landingssiden. Når bruker logger inn, skal global layout/AppShell håndtere menyen for Katalog, Samling, Auksjoner, Index marked, Forhandlere og Historie/Museum.

## Objektfelt på forsiden

Objektfeltet har nå:

- Samler / Historie / Finans-knapper over objektkortet
- ikke tre prikker over kortet
- animert veksling mellom Sedler og Mynter
- definisjon av detaljert objektvisningskort under kortet

## Teknisk regel

Forsiden viser bare eksempeldata. Senere skal ekte objektdata hentes fra API/MariaDB. Frontend skal ikke være sannhet for katalogdata, medlemskap, tilgang, verdi eller brukerstatus.
