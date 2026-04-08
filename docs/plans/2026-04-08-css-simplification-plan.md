# CSS Token Simplification Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove verbose fallback chains from component CSS now that the semantic token layer (`--ds-*`) is stable, and centralize repeated interaction/motion patterns.

**Architecture:** Four phases, each independently shippable: (1) strip innermost `light-dark()` from components where `--ds-*` already provides the value, (2) unify overlay/focus token names, (3) migrate docs theme hard-coded rgba to shared glass tokens, (4) normalize shadow recipes into named effect tokens. Each phase is a single commit touching only CSS template literals in `.ts` files or token definition files.

**Tech Stack:** Lit CSS-in-JS (`css` tagged template literals in TypeScript), vanilla CSS custom properties, vitest for tests.

---

## Phase 1: Remove innermost `light-dark()` from component fallback chains

### Context

Components currently use a three-tier chain:
```css
var(--fd-button-bg-primary, var(--ds-color-bg-active, light-dark(#0d6191, #84dbff)))
```

The innermost `light-dark(...)` is redundant because `--ds-color-bg-active` is already defined in `semantic.css` with its own `light-dark()`. The simplified form becomes:
```css
var(--fd-button-bg-primary, var(--ds-color-bg-active))
```

The `--fd-*` component-level override token stays (it's the public API). Only the raw-color safety net is removed.

**Rule:** If the `--ds-*` token referenced in the middle tier is defined in `packages/tokens/semantic.css` (or has an `@property` registration with an `initial-value`), the innermost `light-dark()` is safe to remove.

**Do NOT remove** the fallback when:
- The middle-tier token is `--fdic-*` (legacy, may not be in semantic.css)
- The value is not a simple token reference (e.g., `rgba()` overlays for inverted variants)
- The component defines its own `--fd-*` fallback that doesn't go through `--ds-*`

### Task 1: fd-button.ts — strip light-dark fallbacks

**Files:**
- Modify: `packages/components/src/components/fd-button.ts`
- Test: `packages/components/src/components/fd-button.test.ts`

**Step 1: Read the file and inventory all `light-dark()` occurrences**

Open `fd-button.ts`. There are ~13 `light-dark()` usages. For each, confirm the `--ds-*` token exists in `semantic.css`.

**Step 2: Replace each three-tier chain with two-tier**

Before:
```css
var(--fd-button-bg-primary, var(--ds-color-bg-active, light-dark(#0d6191, #84dbff)))
```

After:
```css
var(--fd-button-bg-primary, var(--ds-color-bg-active))
```

Apply to all 13 occurrences. Leave the overlay `rgba()` fallbacks on `--ds-color-overlay-hover` and `--ds-color-overlay-pressed` because those have `@property` registrations with `initial-value` already providing the fallback, so they can also be simplified:

Before:
```css
var(--fd-button-overlay-hover, var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04)))
```

After:
```css
var(--fd-button-overlay-hover, var(--ds-color-overlay-hover))
```

**Exception:** The `.subtle-inverted` variant's `rgba(255, 255, 255, ...)` overrides are NOT covered by `--ds-*` tokens — leave those as-is.

**Step 3: Run tests**

Run: `cd packages/components && npx vitest run src/components/fd-button.test.ts`
Expected: All existing tests pass (no behavioral change).

**Step 4: Visual spot-check**

Run: `cd apps/docs && npx vitepress dev` and check the Button story in light and dark mode.

**Step 5: Commit**

```bash
git add packages/components/src/components/fd-button.ts
git commit -m "refactor(fd-button): collapse light-dark fallbacks to semantic tokens"
```

### Task 2: fd-checkbox.ts — strip light-dark fallbacks

**Files:**
- Modify: `packages/components/src/components/fd-checkbox.ts`

**Step 1: Replace all `light-dark()` chains**

There are ~5 occurrences. All reference tokens that exist in `semantic.css`:
- `--ds-color-text-primary` → `:host` color
- `--ds-color-border-input-focus` → focus outline
- `--ds-color-overlay-hover` → hover overlay (has `@property`)
- `--ds-color-overlay-pressed` → active overlay (has `@property`)
- `--ds-color-semantic-fg-error` → invalid state
- `--ds-color-text-secondary` → description

**Step 2: Run tests**

Run: `cd packages/components && npx vitest run src/components/fd-checkbox.test.ts`

**Step 3: Commit**

```bash
git add packages/components/src/components/fd-checkbox.ts
git commit -m "refactor(fd-checkbox): collapse light-dark fallbacks to semantic tokens"
```

### Task 3: fd-radio.ts — strip light-dark fallbacks

Same pattern as fd-checkbox. ~7 occurrences. All reference established `--ds-*` tokens.

**Step 1:** Replace all `light-dark()` chains.
**Step 2:** Run: `cd packages/components && npx vitest run src/components/fd-radio.test.ts`
**Step 3:** Commit.

### Task 4: fd-input.ts and fd-textarea.ts — strip light-dark fallbacks

**Files:**
- Modify: `packages/components/src/components/fd-input.ts` (~11 occurrences)
- Modify: `packages/components/src/components/fd-textarea.ts` (~11 occurrences)

Same mechanical transform. Both share nearly identical token references for input fields.

**Step 1:** Replace all chains in both files.
**Step 2:** Run: `cd packages/components && npx vitest run src/components/fd-input.test.ts src/components/fd-textarea.test.ts`
**Step 3:** Commit both together (same logical change).

### Task 5: fd-card.ts — strip light-dark fallbacks

**Files:**
- Modify: `packages/components/src/components/fd-card.ts` (~19 occurrences)

This is one of the largest files. Many references are to `--ds-color-effect-shadow` which is defined in `semantic.css` with `light-dark()`. The shadow fallbacks can be collapsed.

**Step 1:** Replace all chains. Pay attention to the multi-layer shadow declarations — each `var(--ds-color-effect-shadow, light-dark(...))` within the stacked shadow becomes just `var(--ds-color-effect-shadow)`.
**Step 2:** Run: `cd packages/components && npx vitest run src/components/fd-card.test.ts`
**Step 3:** Commit.

### Task 6: fd-alert.ts — strip light-dark fallbacks

**Files:**
- Modify: `packages/components/src/components/fd-alert.ts` (~23 occurrences)

Largest occurrence count after fd-slider. Many semantic status tokens (`--ds-color-semantic-bg-*`, `--ds-color-semantic-fg-*`, `--ds-color-semantic-border-*`).

**Step 1:** Replace all chains.
**Step 2:** Run: `cd packages/components && npx vitest run src/components/fd-alert.test.ts`
**Step 3:** Commit.

### Task 7: fd-selector.ts, fd-option.ts — strip light-dark fallbacks

**Files:**
- Modify: `packages/components/src/components/fd-selector.ts` (~15 occurrences)
- Modify: `packages/components/src/components/fd-option.ts` (~13 occurrences)

These work together. fd-option has overlay chains that reference `--ds-color-overlay-hover` with `light-dark()` — safe to simplify since the `@property` registration provides the fallback.

**Step 1:** Replace all chains in both files.
**Step 2:** Run: `cd packages/components && npx vitest run src/components/fd-selector.test.ts`
**Step 3:** Commit together.

### Task 8: fd-slider.ts — strip light-dark fallbacks

**Files:**
- Modify: `packages/components/src/components/fd-slider.ts` (~31 occurrences — largest file)

This is the most complex component. Go line by line. Many unique tokens for thumb, track, range, tick marks.

**Step 1:** Replace all chains.
**Step 2:** Run: `cd packages/components && npx vitest run src/components/fd-slider.test.ts`
**Step 3:** Commit.

### Task 9: fd-global-header.ts — strip light-dark fallbacks

**Files:**
- Modify: `packages/components/src/components/fd-global-header.ts` (~14 occurrences)

The global header has custom shadow tokens (`--fd-global-header-shadow-floating`, `--fd-global-header-shadow-panel`) that reference `--ds-color-effect-shadow` / `--ds-color-effect-shadow-panel`. Those inner `light-dark()` calls can be removed.

**Caution:** The header also uses `oklch(from var(...) l c h / alpha)` color manipulation — leave those alone, they're not simple fallback chains.

**Step 1:** Replace standard chains. Skip oklch relative-color expressions.
**Step 2:** Run: `cd packages/components && npx vitest run src/components/fd-global-header.test.ts`
**Step 3:** Commit.

### Task 10: Remaining components — batch cleanup

**Files (each with <10 occurrences):**
- `fd-pagination.ts` (13)
- `fd-split-button.ts` (12)
- `fd-link.ts` (8)
- `fd-visual.ts` (7)
- `fd-tile.ts` (6)
- `fd-menu-item.ts` (6)
- `fd-event.ts` (17)
- `fd-page-header-button.ts` (5)
- `fd-hero.ts` (5)
- `fd-drawer.ts` (4)
- `fd-stripe.ts` (3)
- `fd-page-header.ts` (2)
- `fd-page-feedback.ts` (2)

**Step 1:** Apply the same transform to each file. For each occurrence, verify the `--ds-*` token exists in `semantic.css` before removing the `light-dark()`.
**Step 2:** Run full test suite: `cd packages/components && npx vitest run`
**Step 3:** Commit all remaining files together:
```bash
git commit -m "refactor(components): collapse remaining light-dark fallbacks to semantic tokens"
```

---

## Phase 2: Unify overlay and focus interaction roles

### Context

Every interactive component independently spells out hover/pressed overlays and focus ring geometry. The token names already exist (`--ds-color-overlay-hover`, `--ds-color-overlay-pressed`, `--ds-color-border-input-focus`, `--ds-color-bg-input`), but each component defines its own `--fd-*-overlay-hover`, `--fd-*-overlay-active`, `--fd-*-focus-ring`, `--fd-*-focus-gap` with identical default values.

The goal is **not** to remove component-level override tokens (those are the public API), but to introduce a small set of shared CSS snippets that components can reference, reducing the repeated fallback chains.

### Task 11: Define shared interaction custom properties in a new file

**Files:**
- Create: `packages/tokens/interaction.css`

```css
/*
 * Shared interaction tokens — focus geometry, overlay intensities.
 * Components reference these via var() with their own --fd-* override layer.
 */

:root {
  /* Focus ring: 2px inner gap (bg-input color) + 4px outer ring (input-focus color) */
  --ds-focus-gap-color: var(--ds-color-bg-input);
  --ds-focus-ring-color: var(--ds-color-border-input-focus);
  --ds-focus-gap-width: 2px;
  --ds-focus-ring-width: 4px;

  /* Standard interaction overlays */
  --ds-overlay-hover: var(--ds-color-overlay-hover);
  --ds-overlay-pressed: var(--ds-color-overlay-pressed);

  /* Motion durations */
  --ds-motion-duration-fast: 120ms;
  --ds-motion-duration-normal: 150ms;
  --ds-motion-duration-slow: 240ms;
  --ds-motion-easing-default: ease;
}
```

**Step 1:** Create the file with the tokens above.
**Step 2:** Import it in `packages/tokens/semantic.css` (add `@import` at top) or in the docs theme `tokens.css`.
**Step 3:** Commit:
```bash
git add packages/tokens/interaction.css
git commit -m "feat(tokens): add shared interaction and motion tokens"
```

### Task 12: Migrate fd-button focus ring to shared tokens

**Files:**
- Modify: `packages/components/src/components/fd-button.ts`

Before:
```css
.base:focus-visible {
  outline-color: transparent;
  box-shadow: 0 0 0 2px
      var(--fd-button-focus-gap, var(--ds-color-bg-input)),
    0 0 0 4px
      var(--fd-button-focus-ring, var(--ds-color-border-input-focus));
}
```

After:
```css
.base:focus-visible {
  outline-color: transparent;
  box-shadow:
    0 0 0 var(--ds-focus-gap-width, 2px)
      var(--fd-button-focus-gap, var(--ds-focus-gap-color)),
    0 0 0 var(--ds-focus-ring-width, 4px)
      var(--fd-button-focus-ring, var(--ds-focus-ring-color));
}
```

**Step 1:** Update focus-visible rule.
**Step 2:** Update hover/active overlay rules to reference `--ds-overlay-hover` / `--ds-overlay-pressed`.
**Step 3:** Run: `cd packages/components && npx vitest run src/components/fd-button.test.ts`
**Step 4:** Commit.

### Task 13: Migrate remaining components to shared interaction tokens

Apply the same pattern from Task 12 to all components with focus rings (25 files) and overlay patterns (26 files). Work in batches of 4-5 related components:

**Batch A — form controls:** fd-checkbox, fd-radio, fd-input, fd-textarea, fd-slider
**Batch B — navigation:** fd-link, fd-pagination, fd-menu-item, fd-option, fd-selector
**Batch C — containers:** fd-card, fd-tile, fd-event, fd-alert, fd-drawer
**Batch D — header/page:** fd-global-header, fd-page-header, fd-page-header-button, fd-hero, fd-split-button
**Batch E — remaining:** fd-chip, fd-label, fd-file-input, fd-header-search, fd-menu, fd-stripe

For each batch:
1. Update focus + overlay references
2. Run batch tests
3. Commit

### Task 14: Migrate motion declarations to shared duration tokens

**Files:** All 16 files with `transition` + `prefers-reduced-motion`

Replace raw durations:
- `120ms` → `var(--ds-motion-duration-fast, 120ms)`
- `0.15s` / `150ms` → `var(--ds-motion-duration-normal, 150ms)`
- `240ms` → `var(--ds-motion-duration-slow, 240ms)`

This is a find-and-replace within CSS template literals. Each component keeps its `@media (prefers-reduced-motion: reduce)` block.

**Step 1:** Apply replacements across all 16 files.
**Step 2:** Run: `cd packages/components && npx vitest run`
**Step 3:** Commit:
```bash
git commit -m "refactor(components): use shared motion duration tokens"
```

---

## Phase 3: Migrate docs theme glass overrides to shared tokens

### Context

`apps/docs/.vitepress/theme/tokens.css` contains hard-coded `rgba()` overrides for dark-mode mega-menu glass surfaces:
```css
--fd-global-header-mega-col-1: rgba(33, 33, 35, 0.84);
--fd-global-header-mega-col-2: rgba(28, 38, 48, 0.5);
...
```

Meanwhile, `semantic.css` already defines `--ds-color-surface-glass-*` tokens with oklch equivalents. The docs overrides should reference those instead of carrying raw color math.

### Task 15: Map docs rgba overrides to semantic glass tokens

**Files:**
- Modify: `apps/docs/.vitepress/theme/tokens.css`

Before (in `.dark` and `@media (prefers-color-scheme: dark)` blocks):
```css
--fd-global-header-mega-col-1: rgba(33, 33, 35, 0.84);
--fd-global-header-mega-col-2: rgba(28, 38, 48, 0.5);
--fd-global-header-mega-col-3: rgba(20, 32, 44, 0.24);
--fd-global-header-mega-col-2-muted: rgba(28, 38, 48, 0.4);
--fd-global-header-mega-col-3-muted: rgba(20, 32, 44, 0.14);
```

After:
```css
--fd-global-header-mega-col-1: var(--ds-color-surface-glass-1);
--fd-global-header-mega-col-2: var(--ds-color-surface-glass-2);
--fd-global-header-mega-col-3: var(--ds-color-surface-glass-3);
--fd-global-header-mega-col-2-muted: var(--ds-color-surface-glass-2-muted);
--fd-global-header-mega-col-3-muted: var(--ds-color-surface-glass-3-muted-1);
```

**Important:** Verify that the oklch values in `semantic.css` produce equivalent colors to the rgba values. The mapping is:
- `rgba(33, 33, 35, 0.84)` ≈ `oklch(from neutral-000 l c h / 0.84)` — close but verify visually
- `rgba(28, 38, 48, 0.5)` ≈ `oklch(from primary-050 l c h / 0.5)` — verify

**Step 1:** Update both the `.dark` and `@media` blocks.
**Step 2:** Visual verification — run docs dev server, toggle dark mode, inspect mega-menu glass surfaces.
**Step 3:** Commit:
```bash
git add apps/docs/.vitepress/theme/tokens.css
git commit -m "refactor(docs): replace hard-coded rgba glass overrides with semantic tokens"
```

---

## Phase 4: Standardize shadow recipes into named effect tokens

### Context

Components use shadows in two ways:
1. **Token-backed:** `var(--ds-color-effect-shadow)` as the shadow color — already good
2. **Raw recipes:** Multi-layer shadow stacks with literal spread/offset values that repeat across components

The shadow *geometries* (offset, blur, spread) are not tokenized. Components like fd-card, fd-selector, fd-header-search, and fd-menu each define their own multi-layer shadow stacks.

### Task 16: Define named shadow recipe tokens

**Files:**
- Modify: `packages/tokens/semantic.css` (or create `packages/tokens/effects.css`)

Add shadow recipe tokens that combine geometry + color:

```css
:root {
  /* Elevation: card / raised surface */
  --ds-shadow-raised: 
    0 1px 1px var(--ds-color-effect-shadow),
    0 2px 2px var(--ds-color-effect-shadow),
    0 4px 4px var(--ds-color-effect-shadow),
    0 6px 8px var(--ds-color-effect-shadow);

  /* Elevation: card hover / emphasized */
  --ds-shadow-raised-hover:
    0 2px 4px var(--ds-color-effect-shadow),
    0 4px 8px var(--ds-color-effect-shadow),
    0 8px 16px var(--ds-color-effect-shadow),
    0 12px 24px var(--ds-color-effect-shadow);

  /* Elevation: dropdown / popover */
  --ds-shadow-dropdown:
    0 1px 2px var(--ds-color-effect-shadow),
    0 2px 12px var(--ds-color-effect-shadow);

  /* Elevation: menu / small popover */
  --ds-shadow-menu: 0 4px 12px var(--ds-color-effect-shadow);

  /* Elevation: modal / panel */
  --ds-shadow-panel: 0 18px 48px var(--ds-color-effect-shadow-panel);
}
```

**Step 1:** Add the token definitions.
**Step 2:** Commit:
```bash
git commit -m "feat(tokens): add named shadow recipe tokens"
```

### Task 17: Migrate fd-card to shadow recipe tokens

**Files:**
- Modify: `packages/components/src/components/fd-card.ts`

Before:
```css
box-shadow: var(--fd-card-shadow,
  0 1px 1px var(--ds-color-effect-shadow),
  0 2px 2px var(--ds-color-effect-shadow),
  0 4px 4px var(--ds-color-effect-shadow),
  0 6px 8px var(--ds-color-effect-shadow));
```

After:
```css
box-shadow: var(--fd-card-shadow, var(--ds-shadow-raised));
```

Similarly for hover:
```css
box-shadow: var(--fd-card-shadow-hover, var(--ds-shadow-raised-hover));
```

**Step 1:** Replace shadow declarations.
**Step 2:** Run: `cd packages/components && npx vitest run src/components/fd-card.test.ts`
**Step 3:** Commit.

### Task 18: Migrate fd-selector, fd-menu, fd-header-search, fd-drawer to shadow tokens

**Files:**
- `fd-selector.ts` → `--ds-shadow-dropdown`
- `fd-menu.ts` → `--ds-shadow-menu`
- `fd-header-search.ts` → `--ds-shadow-panel` (large search overlay)
- `fd-drawer.ts` → `--ds-shadow-panel`

**Step 1:** Replace shadow declarations in each file.
**Step 2:** Run: `cd packages/components && npx vitest run`
**Step 3:** Commit:
```bash
git commit -m "refactor(components): use named shadow recipe tokens"
```

### Task 19: Audit fd-label.ts and fd-slider.ts for remaining raw shadows

These two files were flagged as having stacked literal shadow lists. Determine:
- Are the shadows intentional visual recipes? → Create new named tokens if they don't match existing recipes.
- Are they duplicates of existing recipes? → Replace with the matching token.

**Step 1:** Read both files and compare shadow values to the token definitions from Task 16.
**Step 2:** Either create new tokens or map to existing ones.
**Step 3:** Run tests, commit.

---

## Phase 5: Final validation

### Task 20: Full test suite + visual regression

**Step 1:** Run full test suite:
```bash
cd packages/components && npx vitest run
```

**Step 2:** Run docs dev server and manually check all component stories in:
- Light mode
- Dark mode
- Forced-colors mode (Windows High Contrast simulator)

**Step 3:** Run a build to verify no CSS parse errors:
```bash
cd packages/components && npm run build
```

**Step 4:** Final commit if any fixups needed.

---

## Summary: Expected impact

| Metric | Before | After (est.) |
|--------|--------|-------------|
| `light-dark()` in component CSS | 258 | ~5 (only where no `--ds-*` exists) |
| Unique overlay fallback patterns | 26 files × 2 | 1 shared + component overrides |
| Unique focus ring patterns | 25 files | 1 shared + component overrides |
| Raw transition durations | 16 files × ~3 each | 3 named tokens |
| Hard-coded rgba in docs theme | 10 declarations | 0 |
| Raw shadow recipes | ~8 unique patterns | 5 named tokens |

## Priority order

1. **Phase 1** (highest ROI) — removes 250+ redundant `light-dark()` calls
2. **Phase 2** — unifies overlay/focus/motion
3. **Phase 3** — quick win, small scope
4. **Phase 4** — shadow normalization
