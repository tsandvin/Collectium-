# Collectium admin members v19

Endring:
- Fjernet egen `Prosesser`-knapp fra topbar.
- Prosesshendelser beholdes i varselmenyen sammen med meldinger og aktiviteter.
- App-shell merket v19.

Berørte filer:
- components/app/CollectiumAppShell.tsx

Berørte feature_keys:
- admin.notifications.view
- admin.design.control
- auth.logout

Ruteeffekt:
- /admin
- /admin/brukere
- /admin/kunde/[userId]
- /admin/forhandlere
- /admin/innstillinger
