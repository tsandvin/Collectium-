# Collectium v5 Design Files Validation

Source checked:

```txt
C:/Users/Bruker/Downloads/files/
C:/Users/Bruker/Downloads/files/collectium-v5-setup.zip
```

## Result

The design files are valid as a v5 design source, but they must not be uploaded raw into this project. The package uses an older scaffold layout:

```txt
app/components/*
app/lib/theme.ts
page.tsx wraps AppShell directly
not-found.tsx wraps AppShell directly
```

The current Collectium rule is:

```txt
app/ = routes only
components/layout/ = AppShell, Sidebar, Topbar, DesignMegaMenu
lib/theme.ts = design registry and localStorage helpers
app/layout.tsx = single owner of AppShell
public/ = logo assets
```

## File Decisions

```txt
globals.css
```

Approved. Already identical to `app/globals.css`.

```txt
collectium-logo-mask.png
```

Approved. Already identical to `public/collectium-logo-mask.png`.

```txt
theme.ts
```

Approved conceptually, but source path must be `lib/theme.ts`, not `app/lib/theme.ts`. Current project already has the adapted file.

```txt
AppShell.tsx
Sidebar.tsx
Topbar.tsx
DesignMegaMenu.tsx
```

Approved conceptually, but source path must be `components/layout/`. Current project already has adapted versions with corrected imports.

```txt
layout.tsx
```

Do not upload raw. The source layout only renders `{children}` and assumes pages wrap `AppShell`. Current project correctly mounts `AppShell` once in `app/layout.tsx`.

```txt
page.tsx
```

Do not upload raw. It is a placeholder page and wraps `AppShell` directly. Current project keeps the real Collectium frontpage in `app/page.tsx`.

```txt
not-found.tsx
```

Do not upload raw. It wraps `AppShell` directly, which would create double shell because `app/layout.tsx` already owns the shell.

```txt
README-v5.md
```

Useful design documentation, but it references old paths. Use `docs/architecture/file-structure-rule.md` and this validation note as the project-specific source of truth.

## Upload Rule

Before uploading future design files, check:

```txt
1. No `app/components/*`
2. No `app/lib/*`
3. No page-level `AppShell` wrapping
4. One global shell only: `app/layout.tsx -> components/layout/AppShell`
5. Design button writes only `ct:template`, `ct:vp`, `ct:font-base`
6. Logo mask goes to `public/collectium-logo-mask.png`
7. Build must pass before commit/push
```
