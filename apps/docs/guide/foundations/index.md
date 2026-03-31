# Foundations

The foundations section documents the current design-system building blocks pulled from the FDIC Figma exports.

This section is intentionally plain and inventory-oriented. The repository is still in scaffold stage, so these pages explain what exists today, how it should be used, and what is still undecided.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Foundation overview</span>
  <p>These pages translate the current Figma token exports into documentation that is easier to scan than a raw inventory. The emphasis is still on traceability, accessibility, and reversibility.</p>
</div>

## Current scope

The current Figma exports provide foundations for:

- colors
- typography
- spacing and layout
- corners, effects, and overlays
- desktop, mobile, and theme modes

## What this section is for

Use these pages to:

- understand the current token inventory
- document intended usage before final package APIs exist
- preserve accessibility and trust expectations alongside visual decisions
- keep implementation decisions traceable back to the Figma source

## What may change before v1

Token names (CSS custom property names, package boundaries, component token names, and theme delivery strategy) may be renamed or reorganized before the stable release. However, the **values, relationships, and design intent** documented here are the source of truth for design decisions right now.

Use the documented token values and color/spacing/type relationships in your work. If a variable name changes later, the migration will be mechanical — the underlying design decisions will remain stable.

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
- [Typography](./typography.md)
- [Spacing and Layout](./spacing-layout.md)
- [Surfaces and Effects](./surfaces-effects.md)
- [Modes and Responsiveness](./modes.md)

## Internal reference

For the fuller source inventory and implementation notes, see `docs/architecture/token-inventory.md` in the repository.
