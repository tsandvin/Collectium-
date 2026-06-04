# CHANGE-2026-06-04-admin-users-v24.1

## Overskrift
Ny admin brukerside v24.1

## Definering / formål
Bygger ny adminside for brukeroversikt, medlemskap, rolle, status, samlerdata, auksjonsaktivitet, KYC og ekspandert brukerprofil.

## Berørte filer

```txt
components/admin/AdminUsersClient.tsx
app/admin/brukere/page.tsx
```

## Berørte routes

```txt
/admin/brukere
/api/admin/users
```

## Berørte feature_keys

```txt
admin.users.view
admin.users.search
admin.users.detail.view
admin.users.edit
admin.users.disable
admin.users.roles.manage
admin.users.sessions.view
admin.users.activity.view
admin.users.collection.view
admin.users.payments.view
```

## Berørte tabeller / views

```txt
ct_users
ct_user_profiles
ct_memberships
ct_user_roles
ct_user_sessions
ct_collection_items
ct_user_object_states
ct_collection_transactions
ct_v_feature_access_resolved
```

## Designregel
Denne endringen skal ikke legge design i siden. Visuell styling skal komme fra globale `.ct-*` komponenter og globale tokens.

## Build
Kjør:

```powershell
npm.cmd run build
```


## v24.1 fix
- Endret UI-komponentimporter fra named imports til default imports, fordi eksisterende globale Collectium UI-komponenter eksporteres som default.
- Ingen design-, DB- eller route-endringer.
