# Collectium admin members v17

Denne pakken bygger videre på v15/v16 og legger inn et mer komplett admin-/medlemskapskonsept.

## Nye sider

- `/admin`
- `/admin/brukere`
- `/admin/kunde/[userId]`
- `/admin/forhandlere`
- `/admin/innstillinger`

## Nye / endrede komponenter

- `components/app/CollectiumAppShell.tsx`
- `components/admin/AdminUsersClient.tsx`
- `components/admin/CustomerPresentationClient.tsx`
- `components/admin/AdminDealersClient.tsx`

## Funksjoner

- Toppmeny i innlogget admin/app-shell.
- Designknapp som åpner overlay, ikke presser layout.
- Varselknapp med bjelle og varselmeny for meldinger, prosesser og aktiviteter.
- Admin-dashboard med hovedkort for systemstatus, brukere, medlemskap, forhandlere, innleveringer, auksjon, nettbutikk, katalog, objektgodkjenning, datakvalitet, betaling/gebyrer og DB 8.4/API.
- Brukeradministrasjon med arkivfaner: Admin, Påloggede, Avloggede.
- Brukerrader kan ekspanderes for kontaktopplysninger, objektgrupper, total samlerverdi, mest brukte sider, online-tid og supportstatus.
- Egen kundepresentasjonsside med grafisk aktivitet, onlinegraf, mest brukte sider og aktivitetslogg.
- Forhandleradmin med status, avtale, kategoriadgang, Collectium-fee, auksjon og nettbutikk.

## DB 8.4 / feature_keys

Modulene er fortsatt preview/frontend og skal senere kobles mot DB/API:

- `admin.users.view`
- `admin.users.edit`
- `admin.users.activity.view`
- `admin.users.collection.view`
- `admin.customer.presentation.view`
- `admin.dealers.view`
- `admin.dealers.fee.manage`
- `admin.dealers.agreement.manage`
- `admin.notifications.view`
- `admin.design.control`

## Installering

Pakk zipen ut i prosjektroten, der `package.json`, `app/`, `components/` og `public/` ligger.

```powershell
npm.cmd run build
git add .
git commit -m "Add Collectium admin customer and dealer workspace v17"
git push origin main
```
