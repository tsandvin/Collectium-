# Collectium frontpage v26

## Innhold

Denne pakken inneholder en komplett offentlig forside for Collectium:

- `app/page.tsx`
- `components/frontpage/CollectiumFrontpageV26.tsx`
- `components/frontpage/CollectiumFrontpageV26.module.css`

## Hva forsiden dekker

- hero med seriøs Collectium-presentasjon
- relasjonsbasert katalog
- oppdatert marked
- sikker samling
- auksjon
- relasjonsdata
- finansdata
- estimering
- egen oversikt
- deling med andre
- anonym deling eller profilvisning
- levende objektpresentasjon
- Samler / Historie / Finans / Auksjon inne i objektkortet
- Sedler / Mynter
- Hjerte og Stjerne uten sirkel/tall
- Oscar II og Karl Johan som grafiske portrettfelt
- forhandlerfelt
- medlemskap og registreringstilbud

## Installasjon

Kopier filene inn i prosjektet:

```text
app/page.tsx
components/frontpage/CollectiumFrontpageV26.tsx
components/frontpage/CollectiumFrontpageV26.module.css
```

Kjør deretter:

```bash
npm run build
```

Hvis build er OK:

```bash
git add app/page.tsx components/frontpage docs/README-frontpage-v26.md
git commit -m "Add Collectium frontpage v26"
git push origin main
```

Vercel deployer automatisk dersom prosjektet er koblet til GitHub.
