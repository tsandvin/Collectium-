# Collectium minside shell visible v4.3

Denne pakken retter runtime/layout-feilen der `/minside` viser Design-overlay, men selve siden/sidemenyen/topbar er blank.

## Filer

- `app/layout.tsx`
- `app/collectium-shell-visibility-fix.css`

## Hva den gjør

- Laster visibility-fix etter `collectium-front-foundation.css`.
- Tvinger eksisterende CSS-module-klasser som `appShell`, `appSidebar`, `appMain`, `appTopbar`, `appHeader`, `appGrid` og `appCard` til å være synlige.
- Endrer ikke DB/API/MariaDB.
- Endrer ikke innholdskomponentene i `components/app/CollectiumAppShell.tsx`.

## Installer

```powershell
npm.cmd run build
git add -A
git commit -m "Fix visible Collectium app shell"
git push origin main
```

Etter deploy: test `/minside`, `/admin`, `/katalog` og `/template-test`.
