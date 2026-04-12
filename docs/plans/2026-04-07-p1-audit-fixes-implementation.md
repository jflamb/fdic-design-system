# P1 Audit Fixes — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix three P1 issues from the technical audit: details animation layout thrashing, prose dark-mode token gaps, and menu-item touch targets.

**Architecture:** Three independent surgical CSS/TS edits. No refactoring, no token consolidation. Each task is independently revertible.

**Tech Stack:** Vanilla CSS (prose.css), Lit web components (fd-menu-item.ts), Vitest for tests.

**Design doc:** `docs/plans/2026-04-07-p1-audit-fixes-design.md`

---

### Task 1: Details animation — swap `max-height` to `height`

**Files:**
- Modify: `apps/docs/.vitepress/theme/prose.css:646-656` (base animation rule)
- Modify: `apps/docs/.vitepress/theme/prose.css:1868-1872` (print forced-expand rule)

**Step 1: Update the base animation rule**

In `apps/docs/.vitepress/theme/prose.css`, find the closed-state rule at line 646:

```css
/* Before */
.prose details > *:not(summary) {
  overflow: hidden;
  opacity: 0;
  max-height: 0;
  transition: max-height 0.25s ease, opacity 0.2s ease;
}
```

Replace with:

```css
/* After */
.prose details > *:not(summary) {
  overflow: hidden;
  opacity: 0;
  height: 0;
  transition: height 0.25s ease, opacity 0.2s ease;
}
```

**Step 2: Update the open-state rule**

At line 653:

```css
/* Before */
.prose details[open] > *:not(summary) {
  opacity: 1;
  max-height: none;
}
```

Replace with:

```css
/* After */
.prose details[open] > *:not(summary) {
  opacity: 1;
  height: auto;
}
```

**Step 3: Update the print forced-expand rule**

At line 1868 inside `@media print`:

```css
/* Before */
.prose details > *:not(summary) {
  display: block;
  opacity: 1;
  max-height: none;
}
```

Replace with:

```css
/* After */
.prose details > *:not(summary) {
  display: block;
  opacity: 1;
  height: auto;
}
```

**Step 4: Verify reduced-motion override still works**

Check line 1233-1244. The `prefers-reduced-motion` block sets `transition: none` on `.prose details > *:not(summary)`, which suppresses both `height` and `opacity` transitions. No change needed — confirm it's still there.

**Step 5: Commit**

```bash
git add apps/docs/.vitepress/theme/prose.css
git commit -m "perf: replace max-height animation with height for details reveal

interpolate-size: allow-keywords (already declared) enables height: 0
to height: auto interpolation without layout thrashing. Browsers
without support get an instant reveal (graceful degradation).

Also updates the print forced-expand rule for consistency."
```

---

### Task 2: Prose dark mode — wire `--fdic-*` tokens to `--fdic-color-*`

**Files:**
- Modify: `apps/docs/.vitepress/theme/prose.css:65-99` (`:root` color tokens block)

**Reference:** `apps/docs/.vitepress/theme/tokens.css` defines all `--fdic-color-*` semantic tokens with `light-dark()`.

**Step 1: Repoint text color tokens**

In `apps/docs/.vitepress/theme/prose.css`, find the `:root` block starting at line 24. Replace lines 65-71:

```css
/* Before */
/* Colors — text */
--fdic-text-primary: #212123;
--fdic-text-secondary: #595961;
--fdic-text-inverted: #ffffff;
--fdic-text-link: #1278b0;
--fdic-text-link-visited: #855aa5;
--fdic-text-link-visited-hover: #79579f;
```

With:

```css
/* After */
/* Colors — text */
--fdic-text-primary: var(--fdic-color-text-primary, #212123);
--fdic-text-secondary: var(--fdic-color-text-secondary, #595961);
--fdic-text-inverted: var(--fdic-color-text-inverted, #ffffff);
--fdic-text-link: var(--fdic-color-text-link, #1278b0);
--fdic-text-link-visited: var(--fdic-color-text-link-visited, #855aa5);
--fdic-text-link-visited-hover: #79579f;
```

Note: `--fdic-text-link-visited-hover` has no `--fdic-color-*` equivalent — stays hardcoded.

**Step 2: Repoint brand color tokens**

Replace lines 73-75:

```css
/* Before */
/* Colors — brand */
--fdic-brand-core-default: #0d6191;
--fdic-color-brand-primary-500: #0d6191;
```

With:

```css
/* After */
/* Colors — brand */
--fdic-brand-core-default: var(--fdic-color-primary-500, #0d6191);
--fdic-color-brand-primary-500: var(--fdic-color-primary-500, #0d6191);
```

**Step 3: Repoint background tokens**

Replace lines 77-79:

```css
/* Before */
/* Colors — backgrounds */
--fdic-background-base: #ffffff;
--fdic-background-container: #f5f5f7;
```

With:

```css
/* After */
/* Colors — backgrounds */
--fdic-background-base: var(--fdic-color-bg-base, #ffffff);
--fdic-background-container: var(--fdic-color-bg-container, #f5f5f7);
```

**Step 4: Repoint border token**

Replace line 82:

```css
/* Before */
--fdic-border-divider: #bdbdbf;
```

With:

```css
/* After */
--fdic-border-divider: var(--fdic-color-border-divider, #bdbdbf);
```

**Step 5: Repoint interactive state tokens**

Replace lines 88-92:

```css
/* Before */
/* Interactive states */
--fdic-overlay-emphasize-100: rgba(0, 0, 0, 0.04);
--fdic-overlay-emphasize-200: rgba(0, 0, 0, 0.08);
--fdic-border-input-active: #424244;
--fdic-border-input-focus: #38b6ff;
```

With:

```css
/* After */
/* Interactive states */
--fdic-overlay-emphasize-100: var(--fdic-color-overlay-hover, rgba(0, 0, 0, 0.04));
--fdic-overlay-emphasize-200: var(--fdic-color-overlay-pressed, rgba(0, 0, 0, 0.08));
--fdic-border-input-active: var(--fdic-color-border-input-active, #424244);
--fdic-border-input-focus: var(--fdic-color-border-input-focus, #38b6ff);
```

**Step 6: Repoint link state and body text tokens**

Replace lines 94-99:

```css
/* Before */
/* Link state colors */
--fdic-body-text: #1b1b1b;
--link-unvisited: #1278B0;
--link-unvisited-hover: #0D6191;
--link-visited: #855AA5;
--link-visited-hover: #79579F;
```

With:

```css
/* After */
/* Link state colors */
--fdic-body-text: var(--fdic-color-text-primary, #1b1b1b);
--link-unvisited: var(--fdic-color-text-link, #1278B0);
--link-unvisited-hover: var(--fdic-color-primary-500, #0D6191);
--link-visited: var(--fdic-color-text-link-visited, #855AA5);
--link-visited-hover: #79579F;
```

Note: `--link-visited-hover` has no `--fdic-color-*` equivalent — stays hardcoded.

**Step 7: Commit**

```bash
git add apps/docs/.vitepress/theme/prose.css
git commit -m "fix: wire prose color tokens to design system semantic tokens

Repoints --fdic-* color tokens to --fdic-color-* equivalents so prose
content responds to dark mode via the existing light-dark() system
in tokens.css. Hardcoded hex values retained as fallbacks."
```

---

### Task 3: Menu item touch target — add `min-height: 44px`

**Files:**
- Modify: `packages/components/src/components/fd-menu-item.ts:20-46` (`.base` styles)
- Test: `packages/components/src/components/fd-menu-item.test.ts`

**Step 1: Write the failing test**

Add to `packages/components/src/components/fd-menu-item.test.ts`, inside the existing `describe("fd-menu-item")` block:

```typescript
it("has a minimum height of 44px for touch target accessibility", async () => {
  const el = await createMenuItem();
  const inner = getInternal(el);
  const minHeight = getComputedStyle(inner).minHeight;
  expect(minHeight).toBe("44px");
});
```

**Step 2: Run test to verify it fails**

Run: `cd packages/components && npx vitest run src/components/fd-menu-item.test.ts`

Expected: FAIL — `minHeight` will be `""` or `"0px"` (no min-height set).

**Step 3: Add `min-height` to `.base` styles**

In `packages/components/src/components/fd-menu-item.ts`, find the `.base` rule at line 20. Add `min-height` after the `padding` declaration (line 25):

```css
.base {
  display: flex;
  align-items: center;
  gap: var(--fd-menu-item-gap, var(--fdic-spacing-xs, 8px));
  width: 100%;
  padding: var(--fdic-spacing-xs, 8px) var(--fdic-spacing-sm, 12px);
  min-height: var(--fd-menu-item-min-height, 44px);
  border: none;
  /* ... rest unchanged ... */
```

**Step 4: Run test to verify it passes**

Run: `cd packages/components && npx vitest run src/components/fd-menu-item.test.ts`

Expected: All tests PASS, including the new touch target test.

**Step 5: Run existing axe a11y test to confirm no regressions**

The existing test file imports `expectNoAxeViolations`. Confirm the axe test still passes:

Run: `cd packages/components && npx vitest run src/components/fd-menu-item.test.ts`

Expected: All tests PASS (same command — axe tests are in the same file).

**Step 6: Commit**

```bash
git add packages/components/src/components/fd-menu-item.ts packages/components/src/components/fd-menu-item.test.ts
git commit -m "a11y: add 44px min-height to fd-menu-item for touch targets

Ensures menu items meet WCAG 2.5.8 Target Size (Minimum).
Uses --fd-menu-item-min-height custom property for consumer override,
following the same pattern as fd-input's --fd-input-height."
```

---

### Task 4: Final verification

**Step 1: Run full component test suite**

Run: `cd packages/components && npx vitest run`

Expected: All tests PASS.

**Step 2: Build docs site and spot-check**

Run: `cd apps/docs && npx vitepress build`

Expected: Build succeeds with no errors.

**Step 3: Commit design and plan docs**

```bash
git add docs/plans/2026-04-07-p1-audit-fixes-design.md docs/plans/2026-04-07-p1-audit-fixes-implementation.md
git commit -m "docs: add P1 audit fixes design and implementation plan"
```
