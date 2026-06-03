# Collectium · Theme System · v3.0

Locked theme system for the Collectium Next.js frontend.
**Default: `collectium`.** Switchable to `enkel`, `museum`, `finans` at runtime.

---

## File layout

```
app/
  layout.tsx                 ← root layout (sets locked default)
  page.tsx                   ← sample page (shows watermark placement)
  globals.css                ← LOCKED theme system (all 4 templates)
  components/
    AppShell.tsx             ← shell with sidebar + topbar + watermark slots
  lib/
    theme.ts                 ← types, registry, switch helpers
public/
  collectium-logo-mask.png   ← LOCKED logo asset (240×240 white mask)
```

---

## What's locked

| Lock | File | Notes |
| --- | --- | --- |
| Default template | `app/layout.tsx` → `COLLECTIUM_LOCKED_DEFAULT` | Constant exported for tests/SSR |
| Default template | `app/lib/theme.ts` → `LOCKED_DEFAULT` | Source of truth for runtime |
| Default template | `globals.css` → `:root` tokens | Collectium variables on `:root` so design works even without `data-template` |
| Watermark positions | `globals.css` → `.ct-sidebar-watermark`, `.ct-page-watermark` | Sidebar bottom + content top center |
| Logo asset | `public/collectium-logo-mask.png` | White-mask PNG tinted via CSS `background-color` |
| Folder tab shape | `globals.css` → `.ct-tabs / .ct-tab` | Same on main pages and admin |
| Signature corner | `globals.css` → `.ct-sig*` | 4-part structure: fading line · italic word · vertical rise · corner bracket |

---

## Watermark placement (locked)

Two placements, locked in CSS:

1. **Sidebar bottom** — `.ct-sidebar-watermark`
   - 140 × 140 px, centred, 24 px from bottom of sidebar
   - Opacity: `--ct-watermark-opacity-sidebar` (default `.18`)
   - Tinted with `--ct-watermark` per template
   - Hidden on mobile viewport

2. **Content top center** — `.ct-page-watermark`
   - 240 × 240 px (340 on TV, 160 on mobile), centred, 24 px from top of content
   - Opacity: `--ct-watermark-opacity-page` (default `.07`)
   - Sits behind content (z-index 0)

Both render the actual `collectium-logo-mask.png` via CSS `mask-image`, so the colour follows the active template.

To position them in markup, use the slots already in `AppShell.tsx`:

```tsx
<aside className="ct-sidebar">
  …nav…
  <div className="ct-sidebar-watermark" aria-hidden />
</aside>

<section className="ct-content">
  <div className="ct-page-watermark" aria-hidden />
  <div className="ct-container">{children}</div>
</section>
```

---

## Switching template at runtime

```tsx
import { setTemplate } from "@/lib/theme";

// In a settings menu or button handler:
setTemplate("museum");
```

Persisted in `localStorage` under `ct-template`. Read it on mount with `getStoredTemplate()` if you want to honour user preference; the SSR default stays Collectium.

---

## Viewport modes

Set `data-vp` on `<body>` to test different screen sizes:

| Mode | Width target | Scale | Use case |
| --- | --- | --- | --- |
| `mobile` | 430 px | 1.00 | Phones, shows bottom nav |
| `tablet` | 780 px | 1.00 | Tablets |
| `pc` | 1280 px | 1.00 | Default desktop |
| `wide` | 1840 px | 1.00 | Ultrawide monitors |
| `tv` | 2200 px | 1.18 | 40"+ TVs — bolder fonts |

Toggle programmatically:

```tsx
import { setViewport } from "@/lib/theme";
setViewport("tv");
```

CSS media queries are also defined as fallback when no `data-vp` is set.

---

## Drop-in install

1. Copy `globals.css` into `app/globals.css` (replace existing)
2. Copy `layout.tsx` into `app/layout.tsx`
3. Copy `AppShell.tsx` into `app/components/AppShell.tsx`
4. Copy `theme.ts` into `app/lib/theme.ts`
5. Copy `collectium-logo-mask.png` into `public/collectium-logo-mask.png`
6. Run `next dev` — Collectium template is active by default

---

## Pushing to GitHub

I can't push to GitHub from this session because I don't have repository access. Two ways to give me access if you want me to push directly:

1. **GitHub MCP connector** — in Claude settings, connect the GitHub connector and give it write access to the `collectium` repo. Once connected I can open a PR with these files.
2. **Manual push** — download the files (links in the chat), put them in the right paths, then:

   ```bash
   git checkout -b theme/v3-locked-default
   git add app/globals.css app/layout.tsx app/page.tsx app/components/AppShell.tsx app/lib/theme.ts public/collectium-logo-mask.png
   git commit -m "feat(theme): v3 locked default (collectium) + watermark slots + admin"
   git push origin theme/v3-locked-default
   ```

Open a PR from `theme/v3-locked-default` → `main` so the change is reviewable.

---

## Verification checklist

- [ ] `next dev` boots without console errors
- [ ] `<html data-template>` reads `collectium` on initial paint
- [ ] Sidebar bottom shows logo watermark (gold/rust tint on Collectium)
- [ ] Content top-center shows logo watermark behind the header
- [ ] Switching to `enkel`/`museum`/`finans` retints both watermarks
- [ ] Hover on `.ct-card`, `.ct-btn`, `.ct-tab` lifts the element with soft shadow
- [ ] Signature corner (`Collectium` in italic gold) visible at bottom-right of every `.ct-card`
- [ ] At ≤ 680 px sidebar collapses and mobile bottom nav appears
- [ ] At `data-vp="tv"` all display headings get noticeably heavier
