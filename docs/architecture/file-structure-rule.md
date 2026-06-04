# Collectium File Structure Rule

## Fast regel

Alle sider skal ha egen route-fil i `app/`, inkludert startsiden. Startsiden er alltid `app/page.tsx`, ikke `app/index/page.tsx`.

`app/` skal eie ruter, metadata og tynne sidefiler. Vanlige sider skal velge layout/skinn og sende data videre, men ikke bygge eget globalt skall, egen sidemeny, egen topbar eller egen DB-logikk inne i JSX.

## Ansvar

```txt
app/ = routes, page.tsx, route.ts, layout.tsx
components/layout/ = globalt skall, meny, topbar, sidebar, sidepanel
components/skins/ = visuelt uttrykk, skin-boundaries og skin-varianter
components/templates/ = sideoppsett, panelstruktur og Collectium-template
components/* = modulkomponenter for katalog, objekt, relasjoner, min side osv.
lib/ = server-only logikk, typer, mapper, DB/service/API-hjelpere
public/ = bilder, logoer og ikoner
docs/ = regler, arkitektur, endringer og rapporter
```

## Sidefiler

En sidefil skal være tynn:

```tsx
export default async function ObjectPage() {
  const data = await getObjectPageData();
  return <ObjectPresentation data={data} />;
}
```

Sidefiler skal ikke inneholde store CSS-blokker, egen global layout, egen sidebar/topbar, direkte MariaDB-kobling eller hardkodede datamodeller som hører hjemme i `lib/`.

## Layout og skinn

Noen sider kan ha eget layout eller skinn. Det er lov, men det skal ligge utenfor vanlig sideinnhold:

```txt
components/layout/PublicLayout.tsx
components/layout/AdminLayout.tsx
components/layout/ObjectLayout.tsx
components/skins/CollectiumDefaultSkin.tsx
components/skins/CollectiumMuseumSkin.tsx
components/skins/CollectiumAdminSkin.tsx
```

Regelen er:

```txt
layout = struktur, navigasjon og plassering
skin = farger, bakgrunn, rammer, spacing og visuell tone
page = rute, datahenting og valg av riktig komponent
```

## Dataflyt

React Client Components skal aldri koble direkte til MariaDB eller lese hemmelige miljøvariabler.

Riktig flyt:

```txt
MariaDB -> server-only DB/service layer -> Next.js Server Components/API routes -> React UI
```
