# Collectium · v5 · Clean Setup

Et rent Next.js App Router-oppsett med Collectium-designet og en
**Design-knapp nederst i sidemenyen** som åpner en megameny med
fire templates, fem skjermstørrelser og en tekststørrelse-slider.

---

## Filer i denne leveringen

```
app/
  layout.tsx              # Root layout + bootstrap-script (les fra localStorage før paint)
  page.tsx                # Forside (plassholder — fyll inn senere)
  not-found.tsx           # 404
  globals.css             # Hele designsystemet (4 templates + shell + megameny)
  lib/
    theme.ts              # Templates, viewports, font-base, lese/skrive helpers
  components/
    AppShell.tsx          # Eneste shell — sidebar + topbar + innhold + vannmerker
    Sidebar.tsx           # Brand + nav + sidebar-vannmerke + Design-knapp i bunn
    Topbar.tsx            # Søk + handlingspill
    DesignMegaMenu.tsx    # Megameny: Tema + Skjerm + Tekst
public/
  collectium-logo-mask.png   # Logo-maske (240x240, hvit) — tintes per template
```

Slipp filene inn på samme stier i et nytt Next.js-prosjekt (15+, App
Router). Ingen ekstra avhengigheter — kun `next`, `react`, `react-dom`.

---

## Designvalg fra megamenyen

Megamenyen åpner via Design-knappen helt nederst i sidemenyen.

### Tema (template)
Fire varianter med fargeforhåndsvisning:

| ID            | Navn       | Tone | Aksent  |
|---------------|------------|------|---------|
| `collectium`  | Collectium | Lys  | Grønn / gull (standard) |
| `enkel`       | Enkel      | Lys  | Blå |
| `museum`      | Museum     | Mørk | Gull på koks |
| `finans`      | Finans     | Mørk | Smaragd på teal |

### Skjermstørrelse (viewport)
Fem moduser som setter `max-width` på innholdscontaineren:

| ID         | Bredde     |
|------------|------------|
| `mobile`   | 430 px |
| `tablet`   | 780 px |
| `pc`       | 1280 px (standard) |
| `wide`     | 1840 px |
| `tv`       | 2200 px + skala ×1.18, fetere skrift |

### Tekststørrelse
Slider 12 → 18 px (standard 14 px). Justerer `--ct-font-base` på
`<html>`. Alle størrelser i CSS er i `em`, så hele grensesnittet
skalerer proporsjonalt.

---

## Persistens

Tre `localStorage`-nøkler. Ingenting annet.

| Nøkkel          | Verdi |
|-----------------|--------|
| `ct:template`   | `collectium` / `enkel` / `museum` / `finans` |
| `ct:vp`         | `mobile` / `tablet` / `pc` / `wide` / `tv` |
| `ct:font-base`  | `12` … `18` (heltall) |

`layout.tsx` har et inline-script som leser disse **før hydration**, så
brukeren aldri ser en flash av feil design.

«Tilbakestill»-knappen i toppen av megamenyen setter alle tre tilbake
til standarden.

---

## Hva er låst, hva er valgbart

* **Låst**: shell-struktur (én sidebar, én topbar), vannmerkenes
  posisjon (nederst i sidebar + øverst-midt i innholdet), signatur-
  hjørnet på hvert kort, tab-formen.
* **Valgbart (via megamenyen)**: template, viewport, tekststørrelse.

Brukeren kan **ikke** legge inn vilkårlige CSS-verdier, og koden skriver
ingen nøkler til `localStorage` utenom de tre over. Alle de tidligere
problemkildene (`collectium-design-*`, `ct-design-*`, inline font-sliders
osv.) eksisterer ikke i denne kodebasen.

---

## Verifisering

```bash
npm run dev
```

I nettleseren:

```js
// 1. Forventet startstatus
document.documentElement.dataset
// → {template:"collectium", vp:"pc"}

getComputedStyle(document.documentElement).getPropertyValue("--ct-font-base").trim()
// → "14px"

// 2. Ingen gamle nøkler i localStorage
Object.keys(localStorage).filter(k => k.startsWith("collectium-") || k.startsWith("ct-"))
// → []  (kun ct:template, ct:vp, ct:font-base etter at megamenyen er brukt)

// 3. Bare én sidebar i DOM
document.querySelectorAll("aside.ct-sidebar").length
// → 1
```

Manuell sjekk:
- Trykk Design-knappen → megameny åpner med Collectium markert
- Trykk Museum → sidebar, topbar og innhold bytter til mørkt umiddelbart
- Trykk Mobil → innholdet komprimeres til 430 px-bredde
- Dra slideren → all tekst skalerer i takt
- Trykk Tilbakestill → alt tilbake til Collectium / PC / 14px

---

## Push til GitHub

Ikke push-tilgang fra denne økten. Når repoet er klart, kan du enten
koble GitHub-MCP-en i Claude (så åpner jeg PR), eller pushe selv:

```bash
git init  # hvis nytt repo
git checkout -b main
# kopier filene inn på riktige stier
git add app/ public/
git commit -m "feat(setup): v5 clean Collectium scaffold with locked Design mega menu"
git remote add origin https://github.com/<bruker>/<repo>.git
git push -u origin main
```
