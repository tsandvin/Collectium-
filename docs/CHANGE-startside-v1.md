# CHANGE-2026-06-04-0001 — Startside V1

## Side

Startside V1

## Filer

```txt
app/page.tsx
app/startside-v1/page.tsx
components/startside/CollectiumStartsideV1.tsx
components/startside/CollectiumStartsideV1.module.css
docs/CHANGE-startside-v1.md
```

## Formål

Lage første startside med:

```txt
login
logout
Min side
sidemeny
lenker til hovedmoduler
```

## Regler fulgt

- Startside er versjonert som V1.
- Auth, medlemskap og tilgang eies ikke av React.
- Login/logout peker mot routes/API.
- Min side, katalog, index, samling, auksjon, forhandler og admin ligger i sidemeny.
- Siden dokumenterer berørte feature_keys og routes.

## Viktig bruk

Hvis eksisterende `/` ikke skal overskrives ennå, bruk bare:

```txt
app/startside-v1/page.tsx
components/startside/CollectiumStartsideV1.tsx
components/startside/CollectiumStartsideV1.module.css
```

Hvis Startside V1 skal være faktisk hovedside, bruk også:

```txt
app/page.tsx
```
