# Collectium admin members v18

## Innhold

Denne pakken oppdaterer admin/brukere med fullbredde kundeliste, kundekilde/opprinnelse og låst kundenummerregel.

## Kundenummerregel

```text
Kundenummer = CT-[LANDSKODE]-[ÅR]-[LØPENUMMER]
Eksempel: CT-NO-2026-000001
```

For forhandler:

```text
Forhandlernummer = CTD-[LANDSKODE]-[ÅR]-[LØPENUMMER]
Eksempel: CTD-NO-2026-000001
```

## Viktig skille

```text
customer_number = vises til medlem, faktura, support, avtaler og admin
user_id = intern teknisk DB-ID
country_code = NO / SE / DK / FI / US
```

## Kundekilde/opprinnelse

Admin skal kunne skille hvor kunden kom fra:

- Organisk registrering
- Google / søk
- Direkte trafikk
- Invitert av samler
- Invitert av forhandler
- Auksjon
- Nettbutikk
- Museum / kommune
- Kampanje / rabattkode
- Support-opprettet
- Admin-opprettet
- Importert kunde

Anbefalte DB-felt:

```text
customer_origin_type
customer_origin_source
customer_origin_referrer
customer_origin_campaign
customer_origin_invited_by_user_id
customer_origin_dealer_id
customer_origin_first_page
customer_origin_first_object_group
customer_origin_country
customer_origin_registered_channel
customer_origin_created_by
customer_origin_created_at
```

## Endringer i UI

- `/admin/brukere` er fullbredde.
- Arkivfaner til venstre: Alle, Free, Bronze, Silver, Gold, Platinum, Forhandlere.
- Arkivfaner til høyre: Admin, Påloggede, Avloggede.
- Rader ekspanderer med kontakt, kundenummer, kundekilde, første aktivitet, samlergrupper, status og support.
- Knapp åpner egen kundepresentasjon: `/admin/kunde/[userId]`.
- Kundepresentasjon viser kundenummer, kundekilde, aktivitet, grafer og supportgrunnlag.

## Fremtidig DB/API

Frontend viser nå previewdata. Endelig sannhet skal komme fra MariaDB/API via DB 8.4-kjeden.
