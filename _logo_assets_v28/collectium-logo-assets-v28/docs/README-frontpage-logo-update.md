# Frontpage logo update

For v27-forsiden bør tekstlogoen i topbar erstattes med logo-bilde.

Kopier `public/images/brand` og `public/brand` inn i prosjektet.

Bruk:

```tsx
<a className={styles.logoImageLink} href="/" aria-label="Collectium forside">
  <img className={styles.logoImage} src="/images/brand/collectium-logo-dark-wide.png" alt="Collectium" />
</a>
```

Legg CSS fra `docs/logo-topbar-snippet.md` inn i frontpage CSS-modulen.
