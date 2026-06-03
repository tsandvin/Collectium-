# Collectium Front Foundation v4.1

Denne pakken låser nytt Collectium-grunnuttrykk globalt slik at alle nye sider arver designet automatisk fra `app/layout.tsx`.

## Hovedpoeng

- `app/layout.tsx` importerer global CSS i riktig rekkefølge:
  1. `globals.css`
  2. `collectium-brand-tokens.css`
  3. `collectium-front-foundation.css`
- `CollectiumFrontController` setter og vokter:
  - `data-template="collectium"`
  - `data-skin="signature-light"`
  - `data-collectium-front="v4.1"`
  - `data-vp="pc"`
- Gamle localStorage-designverdier ryddes slik at siden ikke hopper tilbake til V22/gammelt skin etter første paint.
- Eksisterende `CollectiumAppShell` beholdes, men kobles til nye skin-navn.
- Nye sider trenger ikke eget design. De skal bare bruke eksisterende layout/app shell og globale klasser.

## Skins

- `signature-light` = standard, varm Collectium/arkiv/gull
- `signature-dark` = mørk museum/premium
- `minimal-light` = ren lys blå/hvit
- `minimal-dark` = mørk finans/analyse

Gamle navn mappes videre:

- `collectium` -> `signature-light`
- `museum` -> `signature-dark`
- `enkel` -> `minimal-light`
- `finans` -> `minimal-dark`

## Installasjon

Pakk zip-filen ut i prosjektroten og erstatt filer når Windows spør.

Kjør:

```powershell
npm.cmd run build
git add -A
git commit -m "Install Collectium front foundation v4.1"
git push origin main
```

## Etter deploy

Åpne siden i privat vindu eller kjør i browser console én gang:

```js
localStorage.clear();
location.reload();
```

Dette er bare for å fjerne gamle V22-designvalg i nettleseren.
