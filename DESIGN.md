# FDIC Design System

## Design System Rules
This document summarizes the current runtime design contract implemented in this repository. Use it together with the shipped token files in `packages/tokens/` and the public docs in `apps/docs/` when generating or modifying UI.

- Prefer the canonical `--fdic-*` runtime tokens. The legacy `--ds-*` names still exist only as deprecated compatibility aliases.
- Use documented component override hooks (`--fd-*`) only where a component page explicitly exposes them.
- Components are Web Components (`fd-*`) and should stay aligned to the published package and token contract.
- Treat layout helpers such as the page shell, section wrappers, and split layouts as documented patterns built from stable tokens, not as a separate utility-class API.
- Dark mode is token-driven. Semantic color tokens use `light-dark()` and should be consumed by role rather than by hard-coded palette values.

---

## 1. Runtime Tokens

### 1.1 Color tokens
Use semantic `--fdic-color-*` role tokens first. Primitive ramps exist, but consumer-facing work should normally stay on semantic tokens.

**Backgrounds**
- `--fdic-color-bg-base`
- `--fdic-color-bg-surface`
- `--fdic-color-bg-container`
- `--fdic-color-bg-overlay`
- `--fdic-color-bg-modal`
- `--fdic-color-bg-input`
- `--fdic-color-bg-interactive`
- `--fdic-color-bg-inverted`
- `--fdic-color-bg-brand`
- `--fdic-color-bg-highlight`
- `--fdic-color-bg-selected`
- `--fdic-color-bg-active`
- `--fdic-color-bg-hovered`
- `--fdic-color-bg-pressed`
- `--fdic-color-bg-destructive`
- `--fdic-color-bg-readonly`

**Text and icon roles**
- `--fdic-color-text-primary`
- `--fdic-color-text-secondary`
- `--fdic-color-text-placeholder`
- `--fdic-color-text-disabled`
- `--fdic-color-text-inverted`
- `--fdic-color-text-brand`
- `--fdic-color-text-warm`
- `--fdic-color-text-link`
- `--fdic-color-text-link-visited`
- `--fdic-color-text-error`
- `--fdic-color-text-wordmark`
- `--fdic-color-icon-primary`
- `--fdic-color-icon-secondary`
- `--fdic-color-icon-placeholder`
- `--fdic-color-icon-disabled`
- `--fdic-color-icon-inverted`
- `--fdic-color-icon-warm`
- `--fdic-color-icon-active`
- `--fdic-color-icon-link`

**Borders, semantic states, overlays, and effects**
- `--fdic-color-border-divider`
- `--fdic-color-border-subtle`
- `--fdic-color-border-input`
- `--fdic-color-border-input-hover`
- `--fdic-color-border-input-focus`
- `--fdic-color-border-input-active`
- `--fdic-color-border-input-readonly`
- `--fdic-color-border-input-interactive`
- `--fdic-color-border-input-disabled`
- `--fdic-color-border-glass`
- `--fdic-color-border-glass-soft`
- `--fdic-color-border-focus-inner`
- `--fdic-color-semantic-bg-success`, `--fdic-color-semantic-bg-warning`, `--fdic-color-semantic-bg-error`, `--fdic-color-semantic-bg-info`, `--fdic-color-semantic-bg-warm`
- `--fdic-color-semantic-fg-success`, `--fdic-color-semantic-fg-warning`, `--fdic-color-semantic-fg-error`, `--fdic-color-semantic-fg-info`
- `--fdic-color-semantic-border-success`, `--fdic-color-semantic-border-warning`, `--fdic-color-semantic-border-error`, `--fdic-color-semantic-border-info`
- `--fdic-color-overlay-hover`
- `--fdic-color-overlay-pressed`
- `--fdic-color-overlay-scrim`
- `--fdic-color-overlay-brand-hover`
- `--fdic-color-overlay-brand-selected`
- `--fdic-color-overlay-brand-pressed`
- `--fdic-color-overlay-scrim-soft`
- `--fdic-color-overlay-scrim-strong`
- `--fdic-color-effect-shadow`
- `--fdic-color-effect-shadow-panel`

### 1.2 Typography, spacing, and radius
Public type and spacing tokens ship on the `--fdic-*` families below.

**Typography**
- Font families: `--fdic-font-family-sans-serif`, `--fdic-font-family-mono`
- Font sizes: `--fdic-font-size-h1` through `--fdic-font-size-h6`, `--fdic-font-size-body`, `--fdic-font-size-body-big`, `--fdic-font-size-body-small`, `--fdic-font-size-body-smaller`, `--fdic-font-size-lg`
- Font weights: `--fdic-font-weight-regular`, `--fdic-font-weight-medium`, `--fdic-font-weight-semibold`, `--fdic-font-weight-bold`
- Line heights: `--fdic-line-height-h1` through `--fdic-line-height-h6`, `--fdic-line-height-body`, `--fdic-line-height-tight`
- Letter spacing: `--fdic-letter-spacing-h1`, `--fdic-letter-spacing-h2`, `--fdic-letter-spacing-h6`, `--fdic-letter-spacing-none`
- Heading padding: `--fdic-heading-padding-h1-*` through `--fdic-heading-padding-h6-*`

**Spacing and radius**
- Spacing: `--fdic-spacing-3xs` through `--fdic-spacing-5xl`, plus `--fdic-spacing-none`
- Radius: `--fdic-corner-radius-sm`, `--fdic-corner-radius-md`, `--fdic-corner-radius-lg`, `--fdic-corner-radius-xl`, `--fdic-corner-radius-full`

### 1.3 Interaction, shadows, and gradients
Use the shared interaction and effect tokens instead of inventing component-local values.

**Focus and motion**
- `--fdic-focus-gap-color`
- `--fdic-focus-ring-color`
- `--fdic-focus-gap-width`
- `--fdic-focus-ring-width`
- `--fdic-motion-duration-fast`
- `--fdic-motion-duration-normal`
- `--fdic-motion-duration-slow`
- `--fdic-motion-easing-default`

**Shadows**
- `--fdic-shadow-raised`
- `--fdic-shadow-raised-hover`
- `--fdic-shadow-dropdown`
- `--fdic-shadow-menu`
- `--fdic-shadow-panel`

**Gradients**
- `--fdic-gradient-brand-core`
- `--fdic-gradient-hero-overlay-cool`
- `--fdic-gradient-hero-overlay-warm`
- `--fdic-gradient-hero-overlay-neutral`
- `--fdic-gradient-glass-button`
- `--fdic-gradient-glass-sheen`

### 1.4 Layout tokens
These are the stable layout foundations currently shipped in `@jflamb/fdic-ds-tokens/styles.css`.

**Page shell and readable widths**
- `--fdic-layout-max-width`
- `--fdic-layout-shell-max-width`
- `--fdic-layout-content-max-width`
- `--fdic-layout-paragraph-max-width`

**Gutters and section rhythm**
- `--fdic-layout-gutter`
- `--fdic-layout-gutter-tablet`
- `--fdic-layout-gutter-mobile`
- `--fdic-layout-section-block-padding`
- `--fdic-layout-section-block-padding-compact`
- `--fdic-layout-content-gap`
- `--fdic-layout-split-gap`
- `--fdic-layout-stack-gap`
- `--fdic-layout-sidebar-width`

**Shared collection recipes**
- `--fdic-layout-col-2-min`, `--fdic-layout-col-2-max`, `--fdic-layout-col-2-gap`
- `--fdic-layout-col-3-min`, `--fdic-layout-col-3-max`, `--fdic-layout-col-3-gap`
- `--fdic-layout-col-4-min`, `--fdic-layout-col-4-max`, `--fdic-layout-col-4-gap`
- `--fdic-layout-col-2-min-narrow`, `--fdic-layout-col-2-gap-narrow`
- `--fdic-layout-col-3-min-narrow`, `--fdic-layout-col-3-gap-narrow`
- `--fdic-layout-col-4-min-narrow`, `--fdic-layout-col-4-max-narrow`, `--fdic-layout-col-4-gap-narrow`

---

## 2. Layout Guidance

### 2.1 Shared page shell
- Use `--fdic-layout-shell-max-width` to align page-level chrome such as `fd-global-header`, `fd-page-header`, `fd-page-feedback`, and `fd-global-footer`.
- Let backgrounds, separators, and dividers run full bleed when needed, but keep the inner content wrapper aligned to the shared shell unless the pattern explicitly documents a wider composition.
- Use the shared gutter tokens at the documented desktop/tablet/mobile ranges instead of introducing page-local breakpoint math.

### 2.2 Viewport-height shell
- Build outer application shells as a viewport-height flex column when the route includes top chrome and bottom chrome.
- Put the route body in a `main` region that can grow (`flex: 1 0 auto`).
- Group end-of-page chrome such as `fd-page-feedback` and `fd-global-footer` in a bottom wrapper that uses `margin-block-start: auto`.
- Enable `fd-global-header.shy` only when the page actually overflows vertically. On short pages, leave shy mode off.
- When shy mode is active, reserve the fixed-header offset with `padding-top: var(--fd-global-header-shy-height, 0px)` on the outer shell.

### 2.3 Section wrappers and readable rails
- Treat section wrappers as patterns built from the stable shell, gutter, and section-padding tokens.
- Use `--fdic-layout-section-block-padding` for major page sections and `--fdic-layout-section-block-padding-compact` for compact supporting sections.
- Use `--fdic-layout-paragraph-max-width` for sustained reading content, survey copy, and explanatory text. Do not force all page content to that narrow rail.

### 2.4 Split layouts and collection layouts
- Use `--fdic-layout-sidebar-width` and `--fdic-layout-split-gap` for sidebar/content patterns.
- Keep split-collapse behavior as documented pattern guidance, not as a separate public token family.
- `fd-card-group`, `fd-tile-list`, and `fd-event-list` should default to the shared `--fdic-layout-col-*` recipes rather than duplicating their own hard-coded track math.
- Collection layouts are container-aware. Consumers should not depend on private breakpoint thresholds.

---

## 3. Component Guidance

### 3.1 General component rules
- Components should consume semantic role tokens, spacing tokens, and documented layout foundations before introducing component-local styling values.
- Use component-level `--fd-*` hooks only for documented overrides. Do not expose internal implementation details as public styling API.
- Preserve semantic HTML and accessibility behavior before visual flourish.

### 3.2 Buttons and interactive controls
- Use the shared focus geometry: `--fdic-focus-gap-width`, `--fdic-focus-ring-width`, `--fdic-focus-gap-color`, and `--fdic-focus-ring-color`.
- Hover and pressed states should come from overlay tokens such as `--fdic-color-overlay-hover`, `--fdic-color-overlay-pressed`, or the relevant semantic background role.
- Disabled states should use the semantic disabled text and border roles rather than reduced-opacity hacks.

### 3.3 Forms and validation
- Inputs and selectors should use `--fdic-color-border-input`, `--fdic-color-border-input-hover`, and `--fdic-color-border-input-focus`.
- Error states should use `--fdic-color-semantic-border-error`, `--fdic-color-semantic-fg-error`, and the related semantic background roles when a container treatment is needed.
- Read-only and disabled states should use the shipped semantic roles rather than custom gray values.

### 3.4 Status, feedback, and surfaces
- Status components should map to the semantic success, warning, error, info, and warm tokens.
- Raised surfaces should use the shared shadows, especially `--fdic-shadow-raised`, `--fdic-shadow-raised-hover`, `--fdic-shadow-dropdown`, and `--fdic-shadow-panel`.
- Branded and glass treatments should use the shared gradients and glass-border roles instead of component-local gradients.

---

## 4. Source of Truth

- Canonical runtime CSS: `packages/tokens/styles.css` and `packages/tokens/interaction.css`
- Public guidance: `apps/docs/guide/foundations/spacing-layout.md`, `apps/docs/guide/foundations/page-shell.md`, and component docs in `apps/docs/components/`
- Internal inventory and translation context: `docs/architecture/token-inventory.md`

If this file disagrees with the shipped token CSS or the current public docs, treat the shipped token CSS and public docs as the source of truth and update this file.
