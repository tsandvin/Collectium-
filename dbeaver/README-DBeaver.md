# DBeaver for Collectium

DBeaver skal brukes som databaseverktøy mot MariaDB. Det er ikke frontend og ikke backend.

## Bruk
1. Installer DBeaver Community.
2. Opprett ny tilkobling: MariaDB.
3. Legg inn Domeneshop-verdier:
   - host
   - port 3306
   - database collectiumno01
   - user
   - password
4. Test connection.
5. Kjør SQL-filene i `dbeaver/sql/` ved behov.

## Viktige kontroller
```sql
SELECT * FROM ct_app_pages LIMIT 50;
SELECT * FROM ct_app_features LIMIT 50;
SELECT * FROM ct_app_page_features LIMIT 50;
SELECT * FROM ct_feature_action_routes LIMIT 50;
SELECT * FROM ct_v_catalog_objects_resolved LIMIT 50;
SELECT * FROM ct_v_catalog_filter_values LIMIT 50;
```

## Regel
React/Next.js skal aldri koble direkte til MariaDB fra client components. DBeaver brukes bare av utvikler/admin for kontroll.
