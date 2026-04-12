# Spacing and Layout

This page is the canonical public layout contract for the FDIC Design System. It documents the stable spacing and layout tokens published in the runtime stylesheet, plus the documented layout patterns that rely on them.

These tokens should be documented as usability constraints, not just visual measurements.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Spacing foundations</span>
  <p>Spacing values matter because they shape readability, grouping, and task completion. The documentation should show those relationships directly.</p>
</div>

## Stable v1 tokens

The public runtime contract includes these spacing and layout foundations:

- spacing: `--ds-spacing-3xs` through `--ds-spacing-5xl` plus `--ds-spacing-none`
- radius: `--ds-corner-radius-sm` through `--ds-corner-radius-full`
- layout widths and gutters: `--ds-layout-max-width`, `--ds-layout-shell-max-width`, `--ds-layout-gutter`, `--ds-layout-gutter-tablet`, `--ds-layout-gutter-mobile`, `--ds-layout-content-max-width`, and `--ds-layout-paragraph-max-width`
- section and flow spacing: `--ds-layout-section-block-padding`, `--ds-layout-section-block-padding-compact`, `--ds-layout-content-gap`, `--ds-layout-split-gap`, and `--ds-layout-stack-gap`
- common split rail: `--ds-layout-sidebar-width`
- shared collection layouts: `--ds-layout-col-2-*`, `--ds-layout-col-3-*`, and `--ds-layout-col-4-*` for documented min, max, and gap values, plus the `*-narrow` variants used on narrow screens

The broader public naming convention is intentionally narrow:

- public system tokens use `--ds-*`
- public typography tokens currently use the shipped `--fdic-font-*`, `--fdic-line-height-*`, `--fdic-letter-spacing-*`, and `--fdic-heading-padding-*` families
- public component override hooks use `--fd-*` only when a component page documents them explicitly
- public docs do not treat `--fdic-*` names as supported consumer API

This v1 contract stays intentionally small. If a layout need can be taught clearly as a pattern, it stays a pattern instead of becoming a public token.

## Shared page shell

Use `--ds-layout-shell-max-width` for the common inner width that aligns the global header, page header, page feedback, footer, and page-content wrappers.

This token is intended for aligned page chrome and full-page sections. Section backgrounds, separators, and border treatments can still span full bleed while the section's inner wrapper stays pinned to the shared shell width.

## Section wrapper pattern

This is a documented pattern built from stable tokens, not a separate utility API.

- Let the section surface run full bleed when the background, border, or divider needs to span the viewport.
- Constrain the section's inner wrapper to `--ds-layout-shell-max-width`.
- Use `--ds-layout-section-block-padding` for major page sections such as page headers and footers.
- Use `--ds-layout-section-block-padding-compact` for supporting sections such as inline feedback or small follow-on content bands.
- Keep horizontal padding on the shared gutter tokens so aligned sections continue to line up at zoom and across breakpoints.

Example:

```css
.section {
  padding-block: var(--ds-layout-section-block-padding);
  padding-inline: var(--ds-layout-gutter);
}

.section__inner {
  max-inline-size: var(--ds-layout-shell-max-width);
  margin-inline: auto;
}
```

## Readable text width

Use `--ds-layout-paragraph-max-width` for long-form reading rails, prose blocks, and support copy that should stay within a readable line length.

This token is stable. The exact layout around that readable rail is still a documented pattern:

- Keep headings, metadata, and actions free to use the shared shell width when they need to.
- Constrain sustained paragraph content, survey copy, and form explanation text to `--ds-layout-paragraph-max-width`.
- Do not force all page content to the readable rail width. Use it where reading comfort matters most.

## Sidebar and content split

The split layout is a stable documented pattern with one stable rail token.

- `--ds-layout-sidebar-width` defines the preferred sidebar rail width.
- `--ds-layout-split-gap` defines the space between the sidebar and the main content rail.
- The responsive collapse behavior stays a pattern, not a frozen utility or separate mobile token set.

Recommended v1 pattern:

```css
.split {
  display: grid;
  grid-template-columns: minmax(0, var(--ds-layout-sidebar-width)) minmax(0, 1fr);
  gap: var(--ds-layout-split-gap);
}

@container (max-width: 60rem) {
  .split {
    grid-template-columns: minmax(0, 1fr);
  }
}
```

Use this when the sidebar contains local navigation, metadata, filters, or supporting context. Avoid it for dense forms or long legal copy that need a single uninterrupted reading column.

## Shared content and stack rhythm

Use the shared layout gaps for general page composition outside the specialized collection-grid recipes:

- `--ds-layout-content-gap` for peer regions in a section, such as prompt/action groupings or two-column content bands
- `--ds-layout-stack-gap` for vertical stacks of related elements inside one region
- `--ds-layout-split-gap` for sidebar/main arrangements specifically

These tokens do not replace the collection `--ds-layout-col-*` gap recipes. Collection layouts remain their own stable contract because they encode approved FDIC track widths and gaps together.

## Shared collection columns

The design system now publishes the documented 2-column, 3-column, and 4-column layout recipes as shared layout tokens instead of keeping those values duplicated inside each collection component.

- desktop recipes: `--ds-layout-col-2-min`, `--ds-layout-col-2-max`, `--ds-layout-col-2-gap`, and the equivalent `col-3` and `col-4` tokens
- narrow-screen recipes: `--ds-layout-col-2-min-narrow`, `--ds-layout-col-2-gap-narrow`, and the equivalent `col-3` and `col-4` narrow tokens

`fd-card-group`, `fd-tile-list`, and `fd-event-list` default to these shared tokens. Override the component-level `--fd-*` variables only when a specific collection needs to diverge from the system recipe.

Collection components are container-aware. They adapt to the inline space available to the component instead of only reacting to the viewport.

The exact collapse thresholds are intentionally private implementation details. Consumers should rely on the documented collection recipes and component-level override hooks, not on a published breakpoint or threshold contract.

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
    <p>Document `--ds-layout-content-max-width` and `--ds-layout-paragraph-max-width` as controls on comprehension, not just container dimensions.</p>
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
- sidebar and main-content spacing
- visual sizing for icons and supporting graphics
- touch and target sizing constraints where relevant

Spacing and layout choices should support:

- readable line lengths
- clear grouping and separation
- predictable responsive behavior
- accessible target sizes
- consistent shell alignment across page-level components
- reusable multi-column recipes across collection and page layouts
- clear distinction between stable tokens and pattern-only guidance

## Accessibility expectations

Spacing and layout tokens affect accessibility directly.

Documentation should preserve expectations for:

- enough spacing to avoid crowded forms and controls
- touch targets that are large enough to use reliably
- zoom and reflow without hidden or overlapping content
- layout constraints that keep long-form content readable
- sidebars that stack cleanly before content overlap or horizontal scrolling begins
- full-bleed sections whose inner readable content still stays constrained and easy to follow
- focus indicators that remain visible even when content is constrained inside shells or rails

## Deferred from v1

Do not assume:

- utility classes will be part of the token package
- separate public mobile spacing or layout bundles exist
- undocumented component sizing variables are stable
- every future page layout pattern will become a standalone token set
- every sidebar recipe or multi-column page template will become a tokenized API
- page-specific hero, marketing, or campaign layouts are covered by this contract

The source of truth still contains broader metrics and mode data. The public runtime surface intentionally narrows that to one stable baseline scale plus documented component responsiveness.
