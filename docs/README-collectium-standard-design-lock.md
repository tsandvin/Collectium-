# Collectium Standard Design Lock

Dette dokumentet beskriver fjerning av designvelger, skin-switching og template-switching, samt låsing av Collectium til én fast frontend-standard.

## Mål og Resultater
Plattformen er nå låst til følgende faste globale design:
- **Template**: `collectium`
- **Skin**: `signature-light`
- **Viewport**: `pc`

Alle runtime switching-kontroller, localStorage-overstyringer og designvelgere er fjernet.

---

## 1. Filer Endret
- **[app/lib/theme.ts](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/app/lib/theme.ts)**:
  - Faste standardkonstanter: `DEFAULT_TEMPLATE = "collectium"`, `DEFAULT_SKIN = "signature-light"`, `DEFAULT_VIEWPORT = "pc"`.
  - `normalizeSkin()` returnerer alltid `"signature-light"`.
  - `applyTheme()` setter kun faste datasets på `documentElement` og `body` (`data-template="collectium"`, `data-skin="signature-light"`, `data-vp="pc"`), og sletter systematisk alle tema/design-nøkler i `localStorage`.
- **[app/layout.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/app/layout.tsx)**:
  - Låst standard datasets direkte på `<html>`: `data-template="collectium"`, `data-skin="signature-light"`, `data-vp="pc"`.
- **[components/app/CollectiumAppShell.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/components/app/CollectiumAppShell.tsx)**:
  - Fjernet "Design"-knappen fra topbar og dens tilknyttede state `designOpen`.
  - Fjernet components `DesignOverlay` og `DesignMenuPortal`.
  - Forenklet mount `useEffect` til å kun kalle parameterløs `applyTheme()`.
- **[components/layout/PublicTopMenu.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/components/layout/PublicTopMenu.tsx)**:
  - Fjernet "Design"-popover og alle tilknyttede skin-knapper/skriftstørrelse-slidere.
  - Fjernet mobile "Design"-knapper i skuffen/mobilmenyen.
  - Sørger for at `applyTheme()` kalles på mount.
- **[components/auth/AuthPageClient.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/components/auth/AuthPageClient.tsx)**:
  - Fjernet dynamisk skin state.
  - Låst logo til `"/brand/collectium-logo-dark.png"` og datasets til `"collectium"`/`"signature-light"`.
  - Kaller `applyTheme()` på mount.
- **[components/landing/CollectiumFrontpageClient.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/components/landing/CollectiumFrontpageClient.tsx)**:
  - Fjernet dynamisk skin state og ubrukt `Skin`/`CollectiumSkin` referanse.
  - Låst logo til `/brand/collectium-logo-dark.png` og datasets til `"collectium"`/`"signature-light"`.
  - Kaller `applyTheme()` på mount.

---

## 2. Filer Fjernet
- Ingen funksjonelle sider eller kildekoder ble slettet. Kun utdatert designvelger/popover logikk er slettet fra eksisterende filer.

---

## 3. Designknapp og switching fjernet
- **Topbar**: "Design"-knappen er fjernet i både `CollectiumAppShell` (innlogget topplinje) og `PublicTopMenu` (offentlig topplinje).
- **Overlays/Portaler**: `DesignOverlay` og `DesignMenuPortal` er slettet.
- **Switching**: Det er ingen måte å endre skin til `signature-dark` eller `minimal` via frontend, da alle `localStorage`-nøkler slettes automatisk ved oppstart via `applyTheme()`.

---

## 4. Build-resultat
- Produksjonsbygg med Next.js (`npm run build`) fullført og kompilert suksessfullt.

---

## 5. Sider Verifisert/Testet
- `/minside`: Verifisert at innhold er synlig og det kun tegnes én sidemeny og én topbar.
- `/admin/kontroll`: Kontrollert at den arver og bruker samme standard AppShell.
- `/katalog`, `/samling`, `/auksjon`, `/forhandler`: Alle bruker felles AppShell med låst signature-light design.
- `/api/template-test`: Returnerer korrekt låste verdier (`default_template: "collectium"`, `default_skin: "signature-light"`, `viewport_default: "pc"`).

---

## 6. Rester og Risikoer
- CSS-regler for de gamle skinsene (`signature-dark`, `minimal-light`, `minimal-dark`) finnes fortsatt i globale CSS-filer (f.eks. `collectium-front-foundation.css`). Disse ble beholdt for å hindre uforutsette CSS-avhengigheter, men de vil aldri bli aktivert ettersom body/html-datasets er hardkodet og runtime switching er fjernet.
