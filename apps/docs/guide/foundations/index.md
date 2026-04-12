# Foundations

The foundations section documents the v1 design-system building blocks that are published for consumers today.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Foundation overview</span>
  <p>These pages translate the repository token source into the supported runtime contract: stable token names, the supported stylesheet entrypoint, accessibility guarantees, and the boundaries between stable and deferred surfaces.</p>
</div>

## Current scope

The current public foundations guidance covers:

- colors
- typography
- spacing and layout
- corners, effects, and overlays
- desktop, mobile, and theme modes

## Stable runtime contract

- Stable stylesheet: `@jflamb/fdic-ds-tokens/styles.css`
- Stable token prefixes: `--fdic-color-*`, `--fdic-spacing-*`, `--fdic-corner-radius-*`, `--fdic-layout-*`, `--fdic-shadow-*`, `--fdic-gradient-*`, `--fdic-font-*`, `--fdic-line-height-*`, `--fdic-letter-spacing-*`, and `--fdic-heading-padding-*`
- Stable component override prefix: `--fd-*` only when a component page documents the token explicitly
- Stable data export: `@jflamb/fdic-ds-tokens/fdic.tokens.json`
- Supported component stylesheet: `@jflamb/fdic-ds-components/styles.css`

These pages explain how to use that contract safely and where the public API intentionally stops.

The [Spacing and Layout](./spacing-layout.md) page is the canonical public layout contract. Other public docs should defer to that page rather than restating layout tokens or implementation details independently.

## Deferred from v1

- Responsive token bundles for separate desktop and mobile modes are not part of the public runtime contract yet.
- Broad component token surfaces are not part of the public contract yet. Only component-level CSS custom properties explicitly documented on component pages are supported.
- React wrappers are not part of the public release surface yet.
- Any backward-compatible alias entrypoints are compatibility affordances, not the preferred path for new consumers.

## Foundation pages

<div class="fdic-card-grid">
  <div class="fdic-card">
    <span class="fdic-eyebrow">Color</span>
    <h3>Semantics before hex values</h3>
    <p>Document brand, text, background, border, and status use in a way that supports trust and accessibility.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Type</span>
    <h3>Readable hierarchy</h3>
    <p>Capture type families, scale, and rhythm with enough context to support plain-language government content.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Layout</span>
    <h3>Constraints that aid comprehension</h3>
    <p>Explain spacing, widths, and responsive differences as usability rules, not just measurements.</p>
  </div>
</div>

- [Colors](./colors.md)
- [Customization](./customization.md)
- [Typography](./typography.md)
- [Spacing and Layout](./spacing-layout.md)
- [Surfaces and Effects](./surfaces-effects.md)
- [Modes and Responsiveness](./modes.md)

## Internal reference

For the fuller source inventory and implementation notes, including historical Figma export labels that are not part of the public API, see `docs/architecture/token-inventory.md` in the repository.
