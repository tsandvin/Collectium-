# Upload Placement Summary

## Zip packages

`collectium-frontpage-vercel-v1.zip` maps to:

```txt
app/page.tsx
components/frontpage/
docs/README-frontpage-vercel.md
```

`collectium-sidebar-topbar-vercel-v1.zip` maps to:

```txt
components/layout/
components/support/
app/support/page.tsx
docs/README-sidebar-topbar-vercel.md
```

`collectium-minside-vercel.zip` contains a standalone HTML preview. It should not be deployed directly into `app/` as production Next.js code. Convert it into `components/min-side/` before connecting it to `app/min-side/page.tsx`.

## Temp files

Some temp files had misleading names and were sorted by content:

```txt
layout.tsx = global CSS content, already present in app/globals.css
Sidebar.tsx = PNG logo mask, already present in public/collectium-logo-mask.png
theme.ts = object presentation API-route draft
FinansPanel.tsx = object presentation API-route draft
README.md = SamlerPanel draft for older object structure
objekt-presentation-polert.html = HistoriePanel draft for older object structure
globals.css = Topbar component draft
page.tsx = Sidebar component draft
not-found.tsx = DesignMegaMenu component draft
README (1).md = placeholder page draft
```

Only files compatible with the current structure should be promoted into source. Older object-panel drafts must be adapted to `components/object/` before use.
