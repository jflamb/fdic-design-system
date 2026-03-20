# Color Palette Design

Date: 2026-03-19

## Summary

This document defines the color palette architecture for the FDIC design system. It covers primitive ramps, semantic token naming, mode support (light/dark), and the convention for bridging Figma variables to CSS custom properties.

The design prioritizes clarity and trust for government financial workflows, WCAG 2.2 AA compliance, and a token structure that scales from documentation through component delivery.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Accent/Persimmon brand palette | Dropped | Too close to semantic error red; not used in current designs |
| Neutral ramp size | ~10 public steps + 2 private (150, 850) | Curated from Figma's 15; enough for surface hierarchy, text levels, borders, and dark mode |
| Brand ramp size | ~7 steps each (primary blue, secondary gold) | Covers backgrounds, interactions, and dark mode without excess |
| Semantic hue ramps | ~5-7 steps per hue (success, warning, error, info) | Full ramps so component work isn't blocked later |
| Overlay tokens | Minimal (hover 4%, pressed 8%, scrim 48%) | Only the tokens actively referenced by role tokens |
| Doc site CSS | Aliases real design system tokens | Docs eat their own cooking; manual stand-in until packages/tokens exists |
| CSS prefix | `--ds-` | Short, memorable; collision risk is low since the system owns the page |
| Naming approach | `--ds-color-[role]-[variant]-[state]` | Namespaced category prefix; maps mechanically from Figma paths |

## Naming convention

### Cross-platform mapping

| Context | Delimiter | Example |
|---------|-----------|---------|
| Figma groups | `/` | `color/text/primary` |
| DTCG JSON paths | `.` | `color.text.primary` |
| CSS custom properties | `-` | `--ds-color-text-primary` |

### Token layers

| Layer | Pattern | Consumed by |
|-------|---------|-------------|
| Primitive | `--ds-color-[family]-[step]` | Semantic tokens only (not public API) |
| Semantic | `--ds-color-[role]-[variant]-[state]` | Components and consumers |
| Component | `--ds-[component]-[property]-[variant]` | Deferred until component APIs are defined |

### Interaction state suffixes

States are appended to the base token name:

- `-hovered`
- `-pressed`
- `-focused`
- `-disabled`
- `-readonly`

Example: `--ds-color-bg-brand-hovered`

## Palette primitives

Primitives are reference values. They are not consumed directly by components or page layouts. The semantic layer aliases into these.

### Neutral

| Step | Hex | Visibility | Role hint |
|------|-----|------------|-----------|
| 000 | `#FFFFFF` | public | White / base surface |
| 050 | `#FAFAFC` | public | Subtle surface |
| 100 | `#F5F5F7` | public | Container / input bg |
| 150 | `#E8E8ED` | private | Checkbox/radio border rest |
| 200 | `#E0E0E2` | public | Read-only border |
| 300 | `#D6D6D8` | public | Disabled border |
| 400 | `#BDBDBF` | public | Divider / disabled icon |
| 500 | `#9E9EA0` | public | Placeholder text |
| 700 | `#595961` | public | Secondary text |
| 800 | `#424244` | public | Primary icon |
| 850 | `#333335` | private | Checkbox/radio border interactive |
| 900 | `#212123` | public | Primary text |
| 1000 | `#000000` | public | Pure black (dark mode base) |

### Primary brand (blue)

| Step | Hex | Figma source |
|------|-----|-------------|
| 050 | `#E6F4FA` | --primary-050 |
| 200 | `#84DBFF` | --primary-200 |
| 400 | `#38B6FF` | --primary-400 |
| 500 | `#0D6191` | --primary-500 (core) |
| 700 | `#09496D` | --primary-700 |
| 800 | `#073C5B` | --primary-800 |
| 900 | `#003256` | --primary-900 |

### Secondary brand (gold)

| Step | Hex | Figma source |
|------|-----|-------------|
| 050 | `#F8EFDA` | --secondary-050 |
| 300 | `#EBD49B` | --secondary-300 |
| 400 | `#E1C16E` | --secondary-400 |
| 500 | `#D9AF45` | --secondary-500 (core) |
| 600 | `#BD9327` | --secondary-600 |
| 800 | `#88691C` | --secondary-800 |
| 900 | `#60511B` | --secondary-900 |

### Semantic hue ramps

Each semantic hue has 5-7 primitive steps. Steps marked *tbd* will be generated using OKLCH interpolation during implementation.

#### Success (green)

| Step | Hex | Source |
|------|-----|--------|
| 050 | `#E8F5E9` | _background/--success-light |
| 200 | *tbd* | |
| 500 | `#4CAF50` | _semantic/--success-light |
| 600 | *tbd* | |
| 800 | `#204520` | _background/--success-dark |
| 900 | *tbd* | |

#### Warning (amber)

| Step | Hex | Source |
|------|-----|--------|
| 050 | `#FCF7EE` | _background/--warning-light |
| 200 | *tbd* | |
| 500 | `#F49F00` | _semantic/--warning-light |
| 600 | *tbd* | |
| 800 | `#663D00` | _background/--warning-dark |
| 900 | *tbd* | |

#### Error (red)

| Step | Hex | Source |
|------|-----|--------|
| 050 | `#FDEDEA` | _background/--error-light |
| 200 | *tbd* | |
| 500 | `#B10B2D` | _semantic/--error-light |
| 600 | `#D80E3A` | _semantic/--error-text-light |
| 800 | `#442121` | _background/--error-dark |
| 900 | *tbd* | |

#### Info (blue)

| Step | Hex | Source |
|------|-----|--------|
| 050 | `#F1F8FE` | _background/--info-light |
| 200 | *tbd* | |
| 500 | `#0776CB` | _semantic/--info-light |
| 600 | *tbd* | |
| 800 | `#1E3A5F` | _background/--info-dark |
| 900 | *tbd* | |

## Semantic tokens

### Background

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--ds-color-bg-base` | neutral-000 | neutral-1000 | Page canvas |
| `--ds-color-bg-surface` | neutral-000 | neutral-900 | Cards, panels |
| `--ds-color-bg-container` | neutral-100 | neutral-900 | Grouped content areas |
| `--ds-color-bg-overlay` | neutral-000 | neutral-900 | Popovers, dropdowns |
| `--ds-color-bg-modal` | neutral-100 | neutral-800 | Modal dialogs |
| `--ds-color-bg-input` | neutral-000 | neutral-900 | Form field backgrounds |
| `--ds-color-bg-interactive` | neutral-100 | neutral-900 | Clickable surface rest |
| `--ds-color-bg-inverted` | neutral-900 | neutral-100 | Inverted sections |
| `--ds-color-bg-brand` | primary-900 | primary-050 | Brand-colored surfaces |
| `--ds-color-bg-highlight` | primary-400 | primary-400 | Selection highlight |
| `--ds-color-bg-selected` | primary-050 | primary-900 | Selected row/item |
| `--ds-color-bg-active` | primary-500 | primary-200 | Active/current nav |
| `--ds-color-bg-hovered` | overlay-darken-4 | overlay-lighten-4 | Generic hover |
| `--ds-color-bg-pressed` | overlay-darken-8 | overlay-lighten-8 | Generic pressed |
| `--ds-color-bg-destructive` | error-600 | error-600 | Destructive button |
| `--ds-color-bg-readonly` | neutral-100 | neutral-800 | Read-only fields |

### Text

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--ds-color-text-primary` | neutral-900 | neutral-000 | Body copy, headings |
| `--ds-color-text-secondary` | neutral-700 | neutral-200 | Supporting text |
| `--ds-color-text-placeholder` | neutral-500 | neutral-500 | Input placeholders |
| `--ds-color-text-disabled` | neutral-500 | neutral-500 | Disabled labels |
| `--ds-color-text-inverted` | neutral-000 | neutral-1000 | Text on inverted bg |
| `--ds-color-text-brand` | primary-500 | primary-200 | Brand-linked text |
| `--ds-color-text-warm` | secondary-900 | secondary-050 | Gold-tinted text |
| `--ds-color-text-link` | link-normal | link-normal-dark | Hyperlinks |
| `--ds-color-text-link-visited` | link-visited | link-visited-dark | Visited links |
| `--ds-color-text-error` | error-600 | error-dark-text | Inline validation |
| `--ds-color-text-wordmark` | primary-900 | neutral-000 | FDIC wordmark |

### Icon

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--ds-color-icon-primary` | neutral-800 | neutral-200 | Default icons |
| `--ds-color-icon-secondary` | neutral-600 | neutral-400 | De-emphasized |
| `--ds-color-icon-placeholder` | neutral-600 | neutral-500 | Empty-state icons |
| `--ds-color-icon-disabled` | neutral-400 | neutral-600 | Disabled icons |
| `--ds-color-icon-inverted` | neutral-000 | neutral-1000 | Icons on inverted bg |
| `--ds-color-icon-warm` | secondary-900 | secondary-050 | Gold-tinted icons |
| `--ds-color-icon-active` | link-normal | link-normal-dark | Active icons |
| `--ds-color-icon-link` | link-normal | link-normal-dark | Linked icons |

### Border

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--ds-color-border-divider` | neutral-400 | neutral-600 | Section separators |
| `--ds-color-border-image` | neutral-000 | neutral-000 | Image borders |
| `--ds-color-border-input` | neutral-400 | neutral-600 | Input rest |
| `--ds-color-border-input-hover` | neutral-500 | neutral-500 | Input hover |
| `--ds-color-border-input-focus` | primary-400 | primary-500 | Input focus ring |
| `--ds-color-border-input-active` | neutral-800 | neutral-200 | Input active |
| `--ds-color-border-input-readonly` | neutral-200 | neutral-400 | Input read-only |
| `--ds-color-border-input-interactive` | neutral-150 | neutral-850 | Checkbox/radio rest |
| `--ds-color-border-input-disabled` | neutral-300 | neutral-500 | Input disabled |

### Semantic status

| Token | Light | Dark |
|-------|-------|------|
| `--ds-color-semantic-bg-success` | success-050 | success-800 |
| `--ds-color-semantic-bg-warning` | warning-050 | warning-800 |
| `--ds-color-semantic-bg-error` | error-050 | error-800 |
| `--ds-color-semantic-bg-info` | info-050 | info-800 |
| `--ds-color-semantic-fg-success` | success-500 | success-dark |
| `--ds-color-semantic-fg-warning` | warning-500 | warning-dark |
| `--ds-color-semantic-fg-error` | error-500 | error-dark |
| `--ds-color-semantic-fg-info` | info-500 | info-dark |
| `--ds-color-semantic-border-success` | success-500 | success-dark |
| `--ds-color-semantic-border-warning` | warning-500 | warning-dark |
| `--ds-color-semantic-border-error` | error-500 | error-dark |
| `--ds-color-semantic-border-info` | info-500 | info-dark |

### Overlay

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--ds-color-overlay-hover` | black 4% | white 4% | Hover state |
| `--ds-color-overlay-pressed` | black 8% | white 8% | Pressed state |
| `--ds-color-overlay-scrim` | black 48% | black 48% | Modal backdrop |

### Link

| Token | Light | Dark |
|-------|-------|------|
| `--ds-color-link-default` | `#1278B0` | `#ADD8E6` |
| `--ds-color-link-visited` | `#855AA5` | `#B19CD9` |

### Effect

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--ds-color-effect-shadow` | black 8% | black 0% | Drop shadow color |

## Doc site CSS alignment

The doc site aliases design system tokens rather than defining its own palette:

```css
:root {
  --fdic-docs-ink:       var(--ds-color-text-primary);
  --fdic-docs-muted:     var(--ds-color-text-secondary);
  --fdic-docs-border:    var(--ds-color-border-divider);
  --fdic-docs-surface:   var(--ds-color-bg-container);
  --fdic-docs-brand:     var(--ds-color-text-brand);
  --fdic-docs-accent:    var(--ds-color-text-warm);
  --fdic-docs-success:   var(--ds-color-semantic-fg-success);
  --fdic-docs-warning:   var(--ds-color-semantic-fg-warning);
  --fdic-docs-danger:    var(--ds-color-semantic-fg-error);
}
```

Until `packages/tokens` generates real CSS, the `--ds-color-*` values are defined manually in `:root`. Once the token pipeline exists, the doc site imports the generated stylesheet instead.

## Exclusions

| Category | Reason |
|----------|--------|
| Accent/Persimmon brand ramp | Too close to semantic error red; not in current designs |
| Component tokens | Deferred until component APIs are defined |
| Figma codeSyntax field mapping | Implementation detail for the token build pipeline |

## Open questions for implementation

- OKLCH interpolation tooling for filling semantic hue ramp gaps
- Whether `packages/tokens` should output CSS custom properties, JSON, or both
- Dark mode activation strategy (CSS media query, class toggle, or both)
- Whether Figma code syntax fields should be configured to match `--ds-*` names
