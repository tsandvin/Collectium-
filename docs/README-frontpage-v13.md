# Collectium frontpage v13

V12 er låst som designretning. V13 bygger videre uten å endre prinsippet om offentlig forside uten lokal sidemeny.

## Endringer i v13

- Offentlig toppmeny har egen `Design`-knapp.
- Login-side lagt til: `app/login/page.tsx`.
- Registreringsside lagt til: `app/registrering/page.tsx`.
- Felles offentlig toppmeny: `components/layout/PublicTopMenu.tsx`.
- Felles auth-komponent: `components/auth/AuthPageClient.tsx`.
- Riktige feature keys ligger på knapper/lenker som `data-feature-key` uten å vise teknisk DB-info på forsiden.
- Silver viser både år og måned:
  - 3 000 kr/år tilbud
  - 250 kr/mnd tilbud
  - ordinært 6 000 kr/år eller 500 kr/mnd

## Offentlig / innlogget regel

Forsiden, login og registrering skal ligge uten lokal sidemeny.
Etter innlogging skal global `AppShell` overta og vise sidemeny.

## Viktige feature keys

- `auth.login`
- `auth.register`
- `auth.session.create`
- `auth.email.verify`
- `auth.membership.create`
- `catalog.view`
- `catalog.search`
- `catalog.filters`
- `catalog.object.open`
- `landing.view`
- `landing.membership`

## Filer

```txt
app/page.tsx
app/login/page.tsx
app/registrering/page.tsx
components/landing/CollectiumFrontpageClient.tsx
components/landing/collectium-frontpage.module.css
components/layout/PublicTopMenu.tsx
components/auth/AuthPageClient.tsx
public/brand/*
```
