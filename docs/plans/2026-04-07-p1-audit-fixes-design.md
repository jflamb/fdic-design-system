# P1 Audit Fixes — Design

> **Date:** 2026-04-07
> **Scope:** Three P1 issues from technical audit — details animation, prose dark mode, menu-item touch targets
> **Approach:** Surgical fixes, minimal blast radius (Approach A)

## Background

A technical audit of the FDIC Design System identified three P1 (major, fix before release) issues:

1. **Details animation causes layout thrashing** — `max-height` transition triggers reflow on every frame
2. **Prose tokens lack dark-mode adaptation** — `--fdic-*` color tokens are hardcoded light-mode hex values
3. **Menu item touch targets below 44px** — `fd-menu-item` has no `min-height` constraint

## Decision: Approach A (surgical fixes)

Fix each P1 independently with the smallest possible change. No token consolidation, no architectural refactoring. Each fix is independently revertible.

Token consolidation (merging `--fdic-*` into `--ds-color-*`) is a valid P2 follow-up but out of scope here.

---

## P1-1: Details animation — swap `max-height` to `height`

**Files:** `apps/docs/.vitepress/theme/prose.css`

### Problem

Lines 646-656 animate `max-height: 0` → `max-height: none` on `<details>` open. Animating `max-height` triggers layout recalculation (reflow) on every frame, causing jank on pages with multiple accordions.

### Fix

`interpolate-size: allow-keywords` is already declared at line 643, enabling `height: 0` → `height: auto` interpolation. Switch from `max-height` to `height`:

**Base rule (lines 646-656):**
```css
/* Before */
.prose details > *:not(summary) {
  overflow: hidden;
  opacity: 0;
  max-height: 0;
  transition: max-height 0.25s ease, opacity 0.2s ease;
}
.prose details[open] > *:not(summary) {
  opacity: 1;
  max-height: none;
}

/* After */
.prose details > *:not(summary) {
  overflow: hidden;
  opacity: 0;
  height: 0;
  transition: height 0.25s ease, opacity 0.2s ease;
}
.prose details[open] > *:not(summary) {
  opacity: 1;
  height: auto;
}
```

**Print/forced-expand rule (line 1867-1871):** update to stay consistent:
```css
/* Before */
.prose details > *:not(summary) {
  display: block;
  opacity: 1;
  max-height: none;
}

/* After */
.prose details > *:not(summary) {
  display: block;
  opacity: 1;
  height: auto;
}
```

### Graceful degradation

Browsers without `interpolate-size` support get an instant reveal (opacity only, no height animation). No jank, just no animation — acceptable.

### What's NOT changing

The existing `prefers-reduced-motion` override (line 1233 area) already suppresses transitions globally and does not reference `max-height` or `height` specifically, so it continues to work.

The progress bar `transition: width 0.3s ease` on `::-webkit-progress-value` (line 1101) stays as-is. The browser controls that pseudo-element's width internally — a CSS `transform: scaleX()` replacement would not animate anything without reimplementing the progress bar outside of native `<progress>`.

---

## P1-2: Prose dark mode — wire `--fdic-*` to `--ds-color-*`

**Files:** `apps/docs/.vitepress/theme/prose.css`

### Problem

The `--fdic-*` color tokens in the `:root` block (lines 65-98) are hardcoded light-mode hex values. The `--ds-color-*` semantic tokens in `tokens.css` already use `light-dark()` for dark-mode support, but the prose tokens don't reference them. In dark mode, prose content renders dark-on-dark.

### Decision

Prose does not need to be standalone. Wire each `--fdic-*` color token to its `--ds-color-*` equivalent, keeping the hex as fallback for safety.

### Token mapping

| `--fdic-*` token | New value |
|---|---|
| `--fdic-text-primary` | `var(--ds-color-text-primary, #212123)` |
| `--fdic-text-secondary` | `var(--ds-color-text-secondary, #595961)` |
| `--fdic-text-inverted` | `var(--ds-color-text-inverted, #ffffff)` |
| `--fdic-text-link` | `var(--ds-color-text-link, #1278b0)` |
| `--fdic-text-link-visited` | `var(--ds-color-text-link-visited, #855aa5)` |
| `--fdic-brand-core-default` | `var(--ds-color-primary-500, #0d6191)` |
| `--fdic-color-brand-primary-500` | `var(--ds-color-primary-500, #0d6191)` |
| `--fdic-background-base` | `var(--ds-color-bg-base, #ffffff)` |
| `--fdic-background-container` | `var(--ds-color-bg-container, #f5f5f7)` |
| `--fdic-border-divider` | `var(--ds-color-border-divider, #bdbdbf)` |
| `--fdic-overlay-emphasize-100` | `var(--ds-color-overlay-hover, rgba(0,0,0,0.04))` |
| `--fdic-overlay-emphasize-200` | `var(--ds-color-overlay-pressed, rgba(0,0,0,0.08))` |
| `--fdic-border-input-active` | `var(--ds-color-border-input-active, #424244)` |
| `--fdic-border-input-focus` | `var(--ds-color-border-input-focus, #38b6ff)` |
| `--fdic-body-text` | `var(--ds-color-text-primary, #1b1b1b)` |
| `--link-unvisited` | `var(--ds-color-text-link, #1278B0)` |
| `--link-unvisited-hover` | `var(--ds-color-primary-500, #0D6191)` |
| `--link-visited` | `var(--ds-color-text-link-visited, #855AA5)` |

### What's NOT changing

- `--fdic-text-link-visited-hover` / `--link-visited-hover` — no `--ds-color-*` equivalent exists; stays as hardcoded hex
- Font tokens, spacing tokens, corner radii — not color, no dark-mode concern
- Callout color tokens — these use `rgba()` transparency and already have an `@supports (color: oklch(...))` progressive enhancement block (line 116) that references `--ds-color-*`

---

## P1-3: Menu item touch target

**Files:** `packages/components/src/components/fd-menu-item.ts`

### Problem

The `.base` button in `fd-menu-item` has `padding: 8px 12px` but no explicit `min-height`. With a single line of text at default font size, the rendered height may fall below the 44px WCAG 2.5.8 Target Size minimum on mobile.

### Fix

Add one property to the `.base` button styles:

```css
min-height: var(--fd-menu-item-min-height, 44px);
```

This follows the established pattern from `fd-input.ts` which uses `min-height: var(--fd-input-height, 44px)`. The custom property allows consumers to override if needed.

### What's NOT changing

`fd-input` already has `min-height: 44px` — the audit's original P1 flagging `fd-input` was a false positive.

---

## Verification plan

1. Toggle VitePress dark mode — prose content should be legible (light text on dark background)
2. Open/close `<details>` elements — animation should be smooth with no jank in DevTools Performance panel
3. Inspect `fd-menu-item` in DevTools — computed height should be >= 44px
4. Check `@media print` preview — details should be force-expanded
5. Run existing component tests (`fd-menu-item.test.ts`)
