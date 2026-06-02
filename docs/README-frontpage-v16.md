# Collectium v16 - Admin brukere og innstillinger

## Formaal

Denne pakken bygger videre paa v15 og legger til en mer komplett innlogget adminflate for:

- Brukere og medlemskap
- KYC/status
- Auksjon og samlingsstatus
- Profilark med faner
- Innstillinger og systemorganisering
- Toppmeny i innlogget app-shell

## Nye sider

```txt
/app/admin/brukere/page.tsx
/app/admin/innstillinger/page.tsx
```

## Nye komponenter

```txt
/components/admin/AdminUsersClient.tsx
/components/admin/AdminSettingsClient.tsx
```

## Oppdaterte komponenter

```txt
/components/app/CollectiumAppShell.tsx
/components/landing/collectium-frontpage.module.css
```

## Feature keys / brytere

```txt
admin.users.view
admin.users.edit
admin.membership.view
admin.membership.edit
admin.users.activity.view
admin.users.security.view
admin.users.kyc.view
admin.settings.view
admin.settings.design
admin.access.rules
admin.routes.view
```

## Ruter

```txt
/admin
/admin/brukere
/admin/innstillinger
/minside
```

## Viktig

Modulene bruker foreloepig mockdata i frontend. Neste steg er aa koble dem til MariaDB/API:

```txt
GET /api/admin/users/summary
GET /api/admin/users/search
GET /api/admin/users/[id]
PATCH /api/admin/users/[id]
GET /api/admin/settings
PATCH /api/admin/settings
```

Ingen adminhandling skal bli endelig uten feature_key, action_route, tilgangsregel og logging.
