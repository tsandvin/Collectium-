# Collectium frontpage/auth/app shell v15

## Formål

Denne pakken oppdaterer v14 med:

- låst signaturmodell fra opplastede `collectium-signature.css` og `collectium-signature.js`
- designpanel som overlay, slik at login/registrering ikke klemmes
- fungerende midlertidig login/register-flow via Next.js API route handlers
- session-cookie for Min side og Admin
- `/minside` med innlogget app-shell og sidemeny
- `/admin` med enkel superadmin-kontroll

## Viktig sikkerhetsregel

Superadmin-passord skal ikke legges i GitHub, React-komponenter eller frontendkode.

Sett dette i Vercel → Project → Settings → Environment Variables:

```txt
COLLECTIUM_SUPERADMIN_EMAIL=<din admin e-post>
COLLECTIUM_SUPERADMIN_PASSWORD=<midlertidig passord>
SESSION_SECRET=<lang tilfeldig hemmelig verdi>
```

Bytt passord etter første test. Dette er en midlertidig server-only auth-bro til MariaDB-auth er koblet.

## Ruter

```txt
/login
/registrering
/minside
/admin
/api/auth/login
/api/auth/register
/api/auth/session
/api/auth/logout
```

## Signatur

Signaturfiler ligger i:

```txt
public/assets/collectium-signature.css
public/assets/collectium-signature.js
```

`app/layout.tsx` laster filene globalt. JS legger automatisk signatur på:

```txt
.ct-panel
.ct-card
.ct-field-box
.ct-large-switch
.ct-signature-frame
```

## Etter utpakking

Kjør:

```powershell
npm.cmd run build
git add .
git commit -m "Add Collectium auth app shell and locked signature v15"
git push origin main
```

## Neste arbeid

- bytte midlertidig auth med MariaDB/DB 8.4 auth
- lage riktig admin-kontroll med databasekjedestatus
- lagre designvalg på brukerprofil etter login
