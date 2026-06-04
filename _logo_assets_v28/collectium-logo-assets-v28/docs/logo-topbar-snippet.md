// Replace the topbar logo block in CollectiumFrontpageV27/V28 with this:

<a className={styles.logoImageLink} href="/" aria-label="Collectium forside">
  <img
    className={styles.logoImage}
    src="/images/brand/collectium-logo-dark-wide.png"
    alt="Collectium"
  />
</a>

// Suggested CSS:

.logoImageLink {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-width: 150px;
}

.logoImage {
  display: block;
  width: clamp(132px, 12vw, 190px);
  height: auto;
  object-fit: contain;
}

@media (prefers-color-scheme: dark) {
  .logoImage {
    content: url("/images/brand/collectium-logo-white.png");
  }
}
