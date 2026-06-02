# Collectium Admin Mobile Tabs Manifest

## CHANGE-2026-06-02-0001

### Hva er lagt til
- Rollebasert mobil footer for admin og medlem.
- Admin kontrollside som tab/fane-grensesnitt.
- Store ikoner i mobil footer.
- Adminfaner: Online, Dashbord, DB 8.4, Vercel, Aktivitet, Brukere, Admin logg, Meldinger, Innstillinger.
- Avanserte admininnstillinger som kontrollerbare switches.

### Berørte filer
- app/admin/kontroll/page.tsx
- components/collectium/admin/CollectiumMobileNavigation.tsx
- components/collectium/admin/AdminControlTabs.tsx
- styles/collectium-admin-mobile-tabs.css

### Berørte routes
- /admin/kontroll
- /admin/brukere
- /admin/logger
- /admin/meldinger
- /admin/innstillinger
- /min-side
- /katalog
- /index
- /auksjon
- /butikk

### Berørte feature_keys
- admin.control.view
- admin.system.dashboard.view
- admin.system.db_map.view
- admin.system.vercel_status.view
- admin.activity.view
- admin.users.view
- admin.logs.view
- admin.messages.view
- admin.settings.view
- profile.view
- catalog.view
- index.view
- auction.view
- shop.view

### API-kontrakter som bør kobles senere
- GET /api/auth/session
- GET /api/admin/system/dashboard
- GET /api/admin/system/db-map
- GET /api/admin/system/vercel-status
- GET /api/admin/activity
- GET /api/admin/users/summary
- GET /api/admin/logs/latest
- GET /api/admin/messages
- GET /api/admin/settings

### Ikke rørt
- Ingen eksisterende kjernefiler overskrives.
- Ingen database endres.
- Ingen auth-logikk endres.
- Ingen betalingslogikk endres.

### Svar til ChatGPT
Status: KODEPAKKE KLAR / IKKE TESTET I DIN REPO
Hva er lagt til: Admin mobil footer, medlem mobil footer, admin kontrollfaner og innstillinger.
Mangler: Kobling til ekte session/API-data i eksisterende repo.
Neste anbefalte handling: Kopier filene inn i Next.js-prosjektet, importer CSS i global layout eller siden, og koble role fra /api/auth/session.
Rollback: Slett disse fire nye filene eller fjern import fra /admin/kontroll/page.tsx.
