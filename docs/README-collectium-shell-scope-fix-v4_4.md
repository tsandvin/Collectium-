# Collectium shell scope fix v4.4

Denne pakken erstatter `app/collectium-shell-visibility-fix.css` med en tryggere variant.

## Hvorfor

Etter v4.3 ble app-shell synlig, men styling ble blandet mellom:

- gammel `collectium-frontpage.module.css`
- ny `collectium-front-foundation.css`
- visibility-fix
- CSS-module-klasser med hash-navn

v4.4 begrenser synlighetsfiksen til `main[data-page][class*="appShell"]` slik at den kun treffer innlogget Collectium shell, ikke hele nettsiden.

## Berørte filer

- `app/collectium-shell-visibility-fix.css`

## Kjør etter installasjon

```powershell
npm.cmd run build
git add -A
git commit -m "Scope Collectium shell visibility styles"
git push origin main
```
