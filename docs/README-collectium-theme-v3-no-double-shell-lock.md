# Collectium theme v3 no-double-shell lock

Dato: 2026-06-04

Denne endringen bruker `collectium-theme-v3-no-double-shell.zip` som hovedpakke.
Originalpakken `collectium-theme-v3-upload.zip` er brukt som referanse for a finne hva som skapte dobbel sidemeny.

Endret:
- `app/layout.tsx` laster bare `globals.css` og `collectium-brand-tokens.css`.
- `app/layout.tsx` wrapper ikke lenger alle sider med ekstra AppShell eller front-controller.
- `app/page.tsx` bruker ekte offentlig `CollectiumFrontpageClient` igjen.
- `app/lib/theme.ts` er tilbake til v3 template-register med locked default `collectium`.
- `/api/template-test` forventer no-double-shell-oppsettet.

Beholdt:
- Adminsidene bruker fortsatt `components/app/CollectiumAppShell.tsx`.
- Admin har dermed egen innlogget arbeidsflate og eget shell, separat fra offentlig forside.

Ikke brukt globalt:
- `app/CollectiumFrontController.tsx`
- `app/collectium-front-foundation.css`
- `app/collectium-shell-visibility-fix.css`

Disse kan ryddes senere hvis de ikke lenger trengs som historikk.
