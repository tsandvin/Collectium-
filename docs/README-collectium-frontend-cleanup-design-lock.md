# Report: Collectium Frontend Cleanup & Design Lock

**Dato**: 2026-06-04  
**Prosjekt**: Next.js 14 / React / Collectium  
**Mål**: Etablere én global designstandard, én felles innlogget app-shell med sidemeny/topbar, og fire låste skinn/templates. Sørge for at nye sider automatisk arver designet uten egne layout-overstyringer.

---

## 1. Filer Endret
De følgende filene har blitt modifisert for å tilpasse seg det låste designsystemet og fjerne løse/side-spesifikke skinsystemer:

* **[theme.ts](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/app/lib/theme.ts)**  
  * Låste standardkonstanter: `DEFAULT_TEMPLATE = "collectium"`, `DEFAULT_SKIN = "signature-light"`, og `DEFAULT_VIEWPORT = "pc"`.
  * Definerte standard skins (`signature-light`, `signature-dark`, `minimal-light`, `minimal-dark`) og templates (`collectium`, `enkel`).
  * Opprettet `normalizeSkin()`, `templateForSkin()`, `getLegacyClass()`, og klientmetoden `applyTheme()` som setter `data-` attributes på `documentElement` / `body` samt lagrer i `localStorage`.
* **[layout.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/app/layout.tsx)**  
  * La inn importer for `collectium-front-foundation.css` og `collectium-shell-visibility-fix.css` slik at styling brukes i riktig rekkefølge.
  * Standardisert `<html>` med dataset-attributter for standard template og skin.
* **[CollectiumAppShell.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/components/app/CollectiumAppShell.tsx)**  
  * Sentralisert tema-applikasjon ved bruk av `applyTheme()` fra `app/lib/theme.ts` på mount og via 250ms guard.
  * Støtter rendering av `children` prop for å gi felles skall til nye og tilpassede undersider.
  * Utvidet `AppPage` til å støtte `"samling"`, `"auksjon"`, og `"forhandler"`.
  * Utvidet `AdminModule` til å støtte `"control"`.
  * Lagt til "Kontrollsenter" (`/admin/kontroll`) i sidemenyen for administratorer.
* **[PublicTopMenu.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/components/layout/PublicTopMenu.tsx)**  
  * Oppdatert for å bruke de fire rene skin-verdiene direkte, og normaliserer lagrede/tidligere innstillinger på mount.
* **[AuthPageClient.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/components/auth/AuthPageClient.tsx)**  
  * Endret til å hente normaliserte verdier og bruke `getLegacyClass()` for å koble til layoutmodulen.
* **[CollectiumFrontpageClient.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/components/landing/CollectiumFrontpageClient.tsx)**  
  * Konvertert til de fire standardiserte skin-typene.
* **[collectium-admin-mobile-tabs.css](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/styles/collectium-admin-mobile-tabs.css)**  
  * Erstattet alle hardkodede farge-, skygge- og layoutverdier med referanser til de globale CSS-variablene (som `var(--ct-page-bg)`, `var(--ct-panel-solid)`, etc.).
* **[app/admin/kontroll/page.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/app/admin/kontroll/page.tsx)**  
  * Pakket siden inn i `CollectiumAppShell` slik at den får global sidebar og toppbar, og fjernet manuell rendering av mobil bunnmeny da dette eies av shellen.
* **[app/samling/page.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/app/samling/page.tsx)**, **[app/auksjon/page.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/app/auksjon/page.tsx)**, og **[app/forhandler/page.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/app/forhandler/page.tsx)**  
  * Pakket innholdet inn i `CollectiumAppShell` for å arve designet og menykontrollene automatisk.

---

## 2. Filer Fjernet
Disse legacy- og midlertidige testfilene ble fjernet for å forhindre designkonflikter eller build-feil:

* **[AppShell.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/app/components/AppShell.tsx)** (Slettet legacy app-shell som ikke lenger var i bruk).
* **[CollectiumFrontController.tsx](file:///c:/Users/Bruker/Pictures/Next,js%20react%20front%20og%20bac-end%20UIUX%20-DB%208.3/Datbase%20Next.js%20react/app/CollectiumFrontController.tsx)** (Slettet utdatert kontroller).

---

## 3. Låst Standard
* **Default template**: `collectium`
* **Default skin**: `signature-light`
* **Default viewport**: `pc`
* **Legacy mapping**:
  * `collectium` -> `signature-light`
  * `museum` -> `signature-dark`
  * `samler` / `enkel` -> `minimal-light`
  * `finans` -> `minimal-dark`

---

## 4. Build-Resultat
`npm run build` ble kjørt lokalt og fullførte uten feil:
* **Compiled successfully**.
* **Linting and checking validity of types**: Passed.
* **Generating static pages**: Complete (36/36).

---

## 5. Kjente gjenværende designrisikoer
* Ingen kjente kritiske designrisikoer. CSS-reglene i `collectium-shell-visibility-fix.css` bruker `!important` på en kontrollert måte begrenset til `main[data-page][class*="appShell"]` og relaterte klasser, noe som hindrer stilkonflikter på offentlige sider.
