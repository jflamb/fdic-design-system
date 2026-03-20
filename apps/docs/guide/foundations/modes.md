# Modes and Responsiveness

This page documents the current mode structure observed in the FDIC Figma exports.

The current exports already indicate that the system will need to support both theme variation and responsive variation, even though runtime delivery is not defined yet.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Modes</span>
  <p>The documentation should make the current mode splits visible at a glance: color has appearance modes, and metrics and typography have responsive modes.</p>
</div>

## What exists today

The current token sets expose these modes:

- `_primitives`: `Default`
- `colors`: `Default`, `Dark`
- `metrics`: `Desktop`, `Mobile`
- `typography`: `Desktop`, `Mobile`

This means the current foundations already vary in at least two ways:

- theme or appearance mode for color
- responsive mode for layout and typography

## Visual anatomy

<div class="fdic-mode-grid">
  <div class="fdic-mode-card">
    <div class="fdic-mode-frame" data-mode="light">
      <div class="fdic-mode-header">Default color mode</div>
      <div class="fdic-mode-panel">
        <strong>Background.Base</strong>
        <p style="margin:0.5rem 0 0;">Used for document-like clarity and high legibility.</p>
      </div>
    </div>
    <div class="fdic-mode-meta">`colors`: `Default`</div>
  </div>
  <div class="fdic-mode-card">
    <div class="fdic-mode-frame" data-mode="dark">
      <div class="fdic-mode-header">Dark color mode</div>
      <div class="fdic-mode-panel">
        <strong>Dark semantic colors</strong>
        <p style="margin:0.5rem 0 0;">Must preserve contrast and focus visibility, not just invert values.</p>
      </div>
    </div>
    <div class="fdic-mode-meta">`colors`: `Dark`</div>
  </div>
  <div class="fdic-mode-card">
    <div class="fdic-mode-frame" data-mode="mobile">
      <div class="fdic-mode-header">Responsive metric mode</div>
      <div class="fdic-mode-panel">
        <strong>Desktop / Mobile</strong>
        <p style="margin:0.5rem 0 0;">Spacing, padding, and typography already vary by context in the exports.</p>
      </div>
    </div>
    <div class="fdic-mode-meta">`metrics` and `typography`: `Desktop`, `Mobile`</div>
  </div>
</div>

## Print styles

When the page is printed (`@media print`), the prose component strips visual chrome and optimizes for paper output.

<div class="fdic-mode-grid">
  <div class="fdic-mode-card">
    <div class="fdic-mode-frame" data-mode="light">
      <div class="fdic-mode-header">Layout adjustments</div>
      <div class="fdic-mode-panel">
        <strong>Content reflows for paper</strong>
        <p style="margin:0.5rem 0 0;">Max-width removed so content fills the page. Font forced to 12pt black for consistent ink output.</p>
      </div>
    </div>
    <div class="fdic-mode-meta">`@media print`</div>
  </div>
  <div class="fdic-mode-card">
    <div class="fdic-mode-frame" data-mode="light">
      <div class="fdic-mode-header">Link disclosure</div>
      <div class="fdic-mode-panel">
        <strong>URLs shown inline</strong>
        <p style="margin:0.5rem 0 0;">External links append their URL via <code>::after { content: " (" attr(href) ")" }</code>. Footnote back-link URLs are not appended because they are internal anchors.</p>
      </div>
    </div>
    <div class="fdic-mode-meta">`::after` on `a[href]`</div>
  </div>
</div>

**Hidden in print:**

- Table of contents (`prose-toc`)
- Back-to-top links (`prose-back-to-top`)
- Copy buttons on code blocks (`prose-copy-btn`)
- Callout icons (`prose-callout-icon`)
- Summary chevrons (details/accordion `::after`)

**Simplified in print:**

- Callout backgrounds removed; borders kept at `#999`
- Table decorative backgrounds (striped rows, hover highlight) removed; header keeps its black background
- Details elements force-expanded; summary pill backgrounds removed
- Aside linearized to full width (no float)

**Page-break control:**

- Images, figures, and embedded media use `break-inside: avoid`
- Headings use `break-after: avoid` to stay with their content

## Forced-colors mode

Windows High Contrast and other forced-colors environments are supported via `@media (forced-colors: active)`. This mode replaces author-defined colors with system colors to ensure visibility for users who rely on high-contrast themes.

<div class="fdic-mode-grid">
  <div class="fdic-mode-card">
    <div class="fdic-mode-frame" data-mode="dark">
      <div class="fdic-mode-header">System color mapping</div>
      <div class="fdic-mode-panel">
        <strong>Borders and outlines</strong>
        <p style="margin:0.5rem 0 0;">Borders use system colors such as <code>LinkText</code> and <code>ButtonText</code> so they remain visible regardless of the user's chosen theme.</p>
      </div>
    </div>
    <div class="fdic-mode-meta">`@media (forced-colors: active)`</div>
  </div>
  <div class="fdic-mode-card">
    <div class="fdic-mode-frame" data-mode="dark">
      <div class="fdic-mode-header">Color-dependent elements</div>
      <div class="fdic-mode-panel">
        <strong>Opt out of forced adjustment</strong>
        <p style="margin:0.5rem 0 0;">Elements that convey meaning via color or background (callout variants, icons, <code>&lt;ins&gt;</code>, <code>&lt;mark&gt;</code>) use <code>forced-color-adjust: none</code> so their semantics are preserved.</p>
      </div>
    </div>
    <div class="fdic-mode-meta">`forced-color-adjust: none`</div>
  </div>
</div>

**Key overrides:**

- `<ins>` falls back to underline instead of its green background, so inserted text remains distinguishable without color
- Phosphor icons embedded in callouts use `forced-color-adjust: none` to remain visible against forced backgrounds
- Focus rings continue to use the standard `outline` pattern, which forced-colors mode preserves natively

## Responsive behavior

At the `640px` breakpoint (`@media (max-width: 640px)`), heading sizes and certain layout elements scale down for narrower viewports.

<div class="fdic-mode-grid">
  <div class="fdic-mode-card">
    <div class="fdic-mode-frame" data-mode="mobile">
      <div class="fdic-mode-header">Type scale reduction</div>
      <div class="fdic-mode-panel">
        <strong>Headings and lead text</strong>
        <p style="margin:0.5rem 0 0;">Font sizes step down to maintain readability and prevent overflow on small screens.</p>
      </div>
    </div>
    <div class="fdic-mode-meta">`@media (max-width: 640px)`</div>
  </div>
</div>

| Element | Desktop | Mobile (640px) |
|---------|---------|----------------|
| `h1` | 2.5313rem | 2rem |
| `h2` | 1.6875rem | 1.5rem |
| `h3` | 1.4063rem | 1.25rem |
| `h4` | 1.125rem | 1.0625rem |
| Lead paragraph | 1.25rem | 1.125rem |

**Layout changes at 640px:**

- `<aside>` elements linearize from a right-floated 40% width block to full width with no float

## `prefers-reduced-motion`

When the user has requested reduced motion (`@media (prefers-reduced-motion: reduce)`), all transitions and animations are suppressed.

- CSS `transition-duration` and `animation` properties are overridden to `0s` or `none`
- The footnote flash animation (`@keyframes footnote-flash`) falls back to a static yellow background highlight instead of an animated fade
- Smooth scrolling (`scroll-behavior: smooth`) is disabled, reverting to `auto`
- Details/accordion reveal animations are removed; content appears immediately

This ensures the prose component respects user preferences for motion sensitivity without losing any information or functionality.

## Intended use

Document modes as part of the source of truth without prematurely deciding implementation details.

At this stage, the docs should explain:

- which token sets have multiple modes
- what each mode appears to represent
- where mode handling is still undecided

## Accessibility expectations

Mode changes must preserve usability.

Documentation should account for:

- contrast in every supported color mode
- readable typography in desktop and mobile contexts
- stable focus treatment across modes
- layouts that reflow without loss of information

## Open implementation questions

These decisions still need to be made before publishing a formal token package:

- whether color modes map to theme classes, media queries, or separate bundles
- whether desktop and mobile modes map to media queries or explicit token collections
- whether scope metadata should be preserved in generated artifacts
- how aliases should be resolved across token sets

## What not to rely on yet

Do not assume:

- final mode names in public APIs
- final runtime switching behavior
- final SSR or hydration strategy for any theming behavior

## Internal reference

For the current source inventory and mode notes, see `docs/architecture/token-inventory.md` in the repository.
