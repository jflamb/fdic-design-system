# Spacing and Layout

This page documents the current spacing and layout foundations exported from the FDIC Figma file.

These tokens should be documented as usability constraints, not just visual measurements.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Spacing foundations</span>
  <p>Spacing values matter because they shape readability, grouping, and task completion. The documentation should show those relationships directly.</p>
</div>

## What exists today

The `metrics` export currently includes layout and measurement groups such as:

- `Spacing`
- `Corner-radius`
- `Width`
- `Padding`
- `Height`
- `Visual`
- `Target`

Examples observed in the exports include:

- `Spacing.md = 16`
- `Spacing.2xl = 32`
- `Width.content-max = 1440`
- `Width.paragraph-max = 720`
- `Padding.section-horizontal = 64`
- `Height`
- `Visual.lg = 48`

## Visual anatomy

<div class="fdic-scale-grid">
  <div class="fdic-scale-row">
    <span class="fdic-token-label">Spacing.sm</span>
    <div class="fdic-scale-bar" data-size="sm"></div>
    <span class="fdic-token-meta">8</span>
  </div>
  <div class="fdic-scale-row">
    <span class="fdic-token-label">Spacing.md</span>
    <div class="fdic-scale-bar" data-size="md"></div>
    <span class="fdic-token-meta">16</span>
  </div>
  <div class="fdic-scale-row">
    <span class="fdic-token-label">Spacing.lg</span>
    <div class="fdic-scale-bar" data-size="lg"></div>
    <span class="fdic-token-meta">24</span>
  </div>
  <div class="fdic-scale-row">
    <span class="fdic-token-label">Spacing.xl</span>
    <div class="fdic-scale-bar" data-size="xl"></div>
    <span class="fdic-token-meta">32</span>
  </div>
  <div class="fdic-scale-row">
    <span class="fdic-token-label">Spacing.2xl</span>
    <div class="fdic-scale-bar" data-size="2xl"></div>
    <span class="fdic-token-meta">40+</span>
  </div>
</div>

<div class="fdic-anatomy">
  <div class="fdic-anatomy-panel fdic-doc-card-copy">
    <span class="fdic-eyebrow">Readable width</span>
    <p>Document `Width.content-max` and `Width.paragraph-max` as controls on comprehension, not just container dimensions.</p>
    <div class="fdic-anatomy-demo">
      <div style="height:0.75rem; width:100%; background:#0D6191; border-radius:999px;"></div>
      <div style="height:0.75rem; width:58%; margin-top:0.75rem; background:#D9AF45; border-radius:999px;"></div>
    </div>
  </div>
  <div class="fdic-anatomy-panel fdic-doc-card-copy">
    <span class="fdic-eyebrow">Target size</span>
    <p>Use visual and target sizing tokens to support touch-friendly controls and predictable icon treatment.</p>
    <div class="fdic-anatomy-demo">
      <div class="fdic-chip-row">
        <span class="fdic-chip">Glyph</span>
        <span class="fdic-chip">Button target</span>
        <span class="fdic-chip">Input height</span>
      </div>
    </div>
  </div>
</div>

## Intended use

Use these tokens to document:

- spacing rhythm between elements and sections
- readable content widths
- container padding
- visual sizing for icons and supporting graphics
- touch and target sizing constraints where relevant

Spacing and layout choices should support:

- readable line lengths
- clear grouping and separation
- predictable responsive behavior
- accessible target sizes

## Accessibility expectations

Spacing and layout tokens affect accessibility directly.

Documentation should preserve expectations for:

- enough spacing to avoid crowded forms and controls
- touch targets that are large enough to use reliably
- zoom and reflow without hidden or overlapping content
- layout constraints that keep long-form content readable

## What not to rely on yet

Do not assume:

- final breakpoint model
- final CSS spacing scale names
- final utility classes
- final mapping of desktop and mobile metrics into runtime bundles

## Known gaps

- The current `metrics` set mixes several concerns that may need to be separated later.
- Responsive delivery for desktop and mobile modes is not finalized.
- Component-specific layout tokens should wait until component APIs and anatomy are clearer.
