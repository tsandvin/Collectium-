# Collectium sidebar/topbar for Vercel

Dette er en kontrollert layoutpakke for Next.js/Vercel.

## Innhold

```txt
components/layout/CollectiumAppShell.tsx
components/layout/CollectiumAppShell.module.css
components/support/CollectiumSupportStatus.tsx
components/support/CollectiumSupportStatus.module.css
app/support/page.tsx
app/layout.with-collectium-shell.tsx
```

## Viktig

`app/layout.with-collectium-shell.tsx` er en trygg eksempel-layout. Den er ikke navngitt `layout.tsx` for å unngå å overskrive eksisterende global layout uten godkjenning.

For å aktivere shellen som global layout kan filen sammenlignes med eksisterende `app/layout.tsx` og deretter brukes som grunnlag.

## Bilder/assets

Sidemenyen prøver å bruke masken:

```txt
/public/collectium-logo-mask.png
/public/images/brand/collectium-logo-mask.png
```

Hvis asseten heter annerledes, juster `mask-image` i `CollectiumAppShell.module.css`.

## Funksjoner

- Sidemeny med gammel Anno 2022-stempelstil.
- Stempel bruker seddel/frimerke-mønster og `collectium-logo-mask`.
- Store ikoner til venstre for menytekst.
- Fast Support-lenke nederst.
- Lys/mørk sidemenybryter nederst.
- Gradientfarge som følger signature-light skin.
- Toppmeny med søkefelt: "Søk i Collectium Katalogen".
- Søketypebrytere: AI-søk, Katalogsøk, Sidesøk.
- Megameny for Design, Logg inn / Min side og Registrer deg gratis.
- Megameny åpnes som øverste lag og bruker ca. 90% skjermbredde.
- Supportside med nettsidestatus, brukerstatus, typiske problemer og adminmelding.
