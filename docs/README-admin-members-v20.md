# Collectium Admin Members v20

## Formål

v20 utvider v19 med demo-/UI-data for 20 brukere og låser første versjon av brukerregel for:

- kundekilde/opprinnelse
- kundenummer med landskode
- forhandlernummer
- realistisk aktivitetsdata
- aktivitetsgraf og mest brukte sider
- slettevalg/personvern
- bevaring av objektets eierhistorikk/proveniens
- profilfletting når ny e-post kan høre til gammel kunde/eierhistorikk

## Nye / endrede filer

```text
components/admin/collectiumDemoUsers.ts
components/admin/AdminUsersClient.tsx
components/admin/CustomerPresentationClient.tsx
components/landing/collectium-frontpage.module.css
docs/README-admin-members-v20.md
```

## Låst kundenummerregel

```text
Kundenummer = CT-[LANDSKODE]-[ÅR]-[LØPENUMMER]
Eksempel: CT-NO-2026-000001

Forhandlernummer = CTD-[LANDSKODE]-[ÅR]-[LØPENUMMER]
Eksempel: CTD-NO-2026-000001
```

`user_id` er intern teknisk DB-ID. Kundenummeret vises på medlem, faktura, support, avtaler, forhandlerflyt og admin.

## Låst slette-/bevaringsregel

Når bruker slutter, skal Collectium som standard ta vare på historikk som trengs for support, proveniens og markedsdata. Hvis kunden ber om sletting, skal persondata slettes eller anonymiseres etter valgt personvernmodus.

Objektets eierhistorikk/proveniens skal ikke slettes automatisk, fordi det kan ødelegge eierrekke, markedsdata og historisk dokumentasjon. Eierhistorikk kan peke til historisk kundeidentitet, tidligere e-post/navn i lukket adminlogg, eller anonymisert eierkode.

Hvis kunden senere angrer, eller oppretter ny konto med ny e-post, kan admin koble/flette profilene etter kontroll av e-post, navn, bosted og samme eiendeler.

## Feature keys for senere DB 8.4/API

```text
admin.users.view
admin.users.edit
admin.users.delete.request
admin.users.delete.personal_data
admin.users.ownership_history.preserve
admin.users.merge_profiles
admin.customer.presentation.view
admin.customer.origin.view
admin.users.activity.view
admin.users.collection.view
admin.users.support.view
```

## Viktig

Demo-dataene i `collectiumDemoUsers.ts` er frontend-demo og skal senere erstattes av MariaDB/API. Frontend skal ikke være sannhet for sletting, profilfletting eller eierhistorikk.
