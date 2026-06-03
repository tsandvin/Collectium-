# Collectium Template + Frontend + JSON Test v1

## Formaal
Legger til en trygg testside og et JSON-endepunkt for a kontrollere at nye sider automatisk arver Collectium front foundation.

## Filer

```txt
app/template-test/page.tsx
app/template-test/template-test.module.css
app/api/template-test/route.ts
docs/README-template-frontend-json-test-v1.md
```

## Test

Etter installasjon:

```powershell
npm.cmd run build
git add -A
git commit -m "Add Collectium template frontend JSON test"
git push origin main
```

Sjekk i nettleser:

```txt
/template-test
/api/template-test
```

## Forventet
- `/template-test` viser nytt Collectium-design.
- `/api/template-test` returnerer JSON.
- Nye sider skal arve globalt design via layout/foundation, ikke lage eget skin.
