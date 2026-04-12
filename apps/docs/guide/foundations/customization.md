# Customization

This page defines the supported customization contract for the FDIC design system.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Customization contract</span>
  <p>Use foundation tokens first. Reach for component-level CSS custom properties only when a component page documents them explicitly. Anything broader is intentionally deferred from v1.</p>
</div>

## Start with foundation tokens

These token families are the supported customization surface for v1:

- `--ds-color-*` for semantic color roles and palette references
- `--ds-spacing-*` for spacing rhythm
- `--ds-corner-radius-*` for corner treatments
- `--ds-layout-*` for width and gutter constraints
- `--fdic-font-*`, `--fdic-line-height-*`, `--fdic-letter-spacing-*`, and `--fdic-heading-padding-*` for typography
- `--ds-shadow-*` and `--ds-gradient-*` for elevation and surface effects

`--ds-*` is the canonical namespace for new system-token adoption. The `--fdic-*` families listed above remain intentionally public for typography, but other legacy-era `--fdic-*` tokens should be treated as compatibility surface rather than the preferred starting point for new themes.

Use those tokens when you are styling page chrome, authored content, or wrapper layout around FDIC components.

## When component tokens are allowed

Use a component-level CSS custom property only when all three conditions are true:

1. The component documentation lists the property in its public API table.
2. The property changes presentation, not semantics or keyboard behavior.
3. The override does not weaken contrast, focus visibility, target size, or required spacing.

If a component page does not document a CSS custom property, treat it as internal.

## What not to customize in v1

- Do not override internal shadow DOM selectors or undocumented <code>--fd-*</code> variables.
- Do not create an app-local alias layer that remaps the design system back to removed legacy token names.
- Do not replace semantic status colors with brand colors for success, warning, error, or info states.
- Do not override focus-ring tokens or border/fill combinations in ways that reduce visibility.
- Do not assume a separate public mobile token bundle exists.

## Theme safety rules

- Keep semantic foreground/background pairings intact. They are authored to preserve contrast across light and dark color schemes.
- If you scope a different <code>color-scheme</code> on part of the page, scope the FDIC runtime stylesheet and any overrides inside the same boundary.
- Treat dark mode as an appearance mode, not a second palette you compose manually. Prefer semantic tokens over primitive palette values.

## Responsive strategy

The public token runtime ships one stable foundation scale. Responsive behavior in v1 is delivered through component internals and consumer layout CSS, not through separate public mobile token bundles.

That means:

- use the stable spacing, layout, and type tokens as your baseline
- let FDIC components handle their own responsive internals
- add app-level media queries only for your page layout, not to swap undocumented token collections

## Accessibility guardrails

Customization is supported only when it preserves:

- text and non-text contrast
- visible focus indicators
- semantic meaning that does not rely on color alone
- minimum target sizing and readable spacing
- predictable zoom and reflow behavior

If an override weakens any of those guarantees, it is outside the supported contract.
