# Spacing and Layout

This page documents the stable spacing and layout tokens published in the FDIC runtime stylesheet.

These tokens should be documented as usability constraints, not just visual measurements.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Spacing foundations</span>
  <p>Spacing values matter because they shape readability, grouping, and task completion. The documentation should show those relationships directly.</p>
</div>

## Stable v1 tokens

The public runtime contract includes these spacing and layout foundations:

- spacing: <code>--ds-spacing-3xs</code> through <code>--ds-spacing-5xl</code> plus <code>--ds-spacing-none</code>
- radius: <code>--ds-corner-radius-sm</code> through <code>--ds-corner-radius-full</code>
- layout widths and gutters: <code>--ds-layout-max-width</code>, <code>--ds-layout-gutter</code>, <code>--ds-layout-gutter-tablet</code>, <code>--ds-layout-gutter-mobile</code>, <code>--ds-layout-content-max-width</code>, and <code>--ds-layout-paragraph-max-width</code>

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
    <span class="fdic-token-meta">20</span>
  </div>
  <div class="fdic-scale-row">
    <span class="fdic-token-label">Spacing.xl</span>
    <div class="fdic-scale-bar" data-size="xl"></div>
    <span class="fdic-token-meta">24</span>
  </div>
  <div class="fdic-scale-row">
    <span class="fdic-token-label">Spacing.2xl</span>
    <div class="fdic-scale-bar" data-size="2xl"></div>
    <span class="fdic-token-meta">32</span>
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

## Deferred from v1

Do not assume:

- utility classes will be part of the token package
- separate public mobile spacing or layout bundles exist
- undocumented component sizing variables are stable

The source of truth still contains broader metrics and mode data. The public runtime surface intentionally narrows that to one stable baseline scale plus documented component responsiveness.
