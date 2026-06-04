# Collectium logo assets v28

## Innhold

PNG-logoer kopiert til:

```text
public/images/brand/collectium-logo-dark-wide.png
public/images/brand/collectium-logo-dark-compact.png
public/images/brand/collectium-c-gold.png
public/images/brand/collectium-logo-white.png
```

SVG-logoer lagt i:

```text
public/brand/collectium-logo-dark-wide-embedded.svg
public/brand/collectium-logo-dark-compact-embedded.svg
public/brand/collectium-c-gold-embedded.svg
public/brand/collectium-logo-white-embedded.svg
public/brand/collectium-c-gold-vector.svg
public/brand/collectium-logo-white-vector.svg
public/brand/collectium-logo-dark-vector.svg
```

## Viktig

`*-embedded.svg` er eksakt visuell SVG-wrapper rundt original PNG. De er trygge å bruke i `<img src="">`, men er ikke ekte vektortracing.

`*-vector.svg` er rene vektorvarianter laget som praktiske logoressurser for web, meny, footer og mørk/lys bakgrunn.

## Anbefalt bruk på forsiden

Lys bakgrunn:

```tsx
<img src="/images/brand/collectium-logo-dark-wide.png" alt="Collectium" />
```

Mørk bakgrunn:

```tsx
<img src="/images/brand/collectium-logo-white.png" alt="Collectium" />
```

Kun C-symbol:

```tsx
<img src="/brand/collectium-c-gold-vector.svg" alt="Collectium C" />
```

## Originaldimensjoner

{'collectium-logo-dark-wide.png': (2048, 641), 'collectium-logo-dark-compact.png': (2048, 1151), 'collectium-c-gold.png': (775, 775), 'collectium-logo-white.png': (2048, 846)}
