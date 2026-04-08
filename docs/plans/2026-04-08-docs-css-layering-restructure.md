# Docs CSS Layering Restructure

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure the docs-theme CSS into explicit cascade layers with a shared accessibility contract, replacing the current bag-of-one-off-classes pattern in `custom.css` with composable surface primitives.

**Architecture:** Introduce `@layer tokens, a11y, prose, docs-components, docs-utilities` ordering. Create a new `accessibility.css` that owns shared `:focus-visible`, `forced-colors`, `print`, and `reduced-motion` contracts scoped to `.vp-doc`. Consolidate the ~6 interactive surface patterns in `custom.css` into 2-4 reusable primitives (`.fdic-surface`, `.fdic-interactive-surface`, `.fdic-embed-frame`, `.fdic-status-surface`), then rebuild existing classes as compositions of those primitives.

**Tech Stack:** Vanilla CSS (PostCSS pipeline), VitePress theme, no preprocessors, no JS changes

**Scope:** Docs theme only (`apps/docs/.vitepress/theme/`). This does NOT restructure `packages/tokens/`, `packages/components/`, or `prose-standalone.css`.

---

## Current State Analysis

### Import chain (index.ts)
```
@fdic-ds/components  (Web Components, shadow DOM)
tokens.css           (wraps packages/tokens/semantic.css + legacy + dark overrides)
prose.css            (1846 lines, full a11y: focus-visible, print, forced-colors)
docs-utilities.css   (41 lines, 2 overview classes)
custom.css           (1126 lines, only a11y: reduced-motion at L1096)
```

### The problem
`custom.css` defines ~30 doc-specific component classes with hover, active, shadows, gradients, and transitions, but its only accessibility guardrail is `@media (prefers-reduced-motion: reduce)` at line 1096. No `:focus-visible`, no `@media (forced-colors: active)`, no `@media print`.

By contrast, `prose.css` already treats focus, print, and forced-colors as part of the styling contract with dedicated blocks at lines 1628 and 1793.

### Target state
```
@layer tokens, a11y, prose, docs-components, docs-utilities;

tokens.css           → @layer tokens
accessibility.css    → @layer a11y        (NEW — shared contracts)
prose.css            → @layer prose
custom.css           → @layer docs-components (renamed behavior)
docs-utilities.css   → @layer docs-utilities
```

### Surface patterns identified in custom.css

**Interactive surfaces** (hover + shadow + transform):
| Class | Hover behavior |
|-------|---------------|
| `.fdic-card` | border-color, box-shadow, translateY(-2px), active: translateY(0) |
| `.fdic-swatch-card` | border-color, box-shadow, translateY(-1px) |
| `.fdic-example-card` | border-color, box-shadow, translateY(-1px) |
| `.fdic-anatomy-panel` | border-color, box-shadow (no transform) |
| `.fdic-do-card` / `.fdic-dont-card` | box-shadow, translateY(-1px) |

**Static surfaces** (border + radius + bg, no interaction):
| Class | Pattern |
|-------|---------|
| `.fdic-palette-group` | 1px border, 14px radius, surface bg |
| `.fdic-role-card` | 1px border, 14px radius, gradient bg |
| `.fdic-type-specimen` | 1px border, 14px radius, surface bg |
| `.fdic-mode-card` | 1px border, 14px radius, surface bg |
| `.fdic-roles-table` | 1px border, 14px radius, overflow hidden |

**Embed frames**:
| Class | Pattern |
|-------|---------|
| `.fdic-story-embed-frame` | 1px border, 12px radius |
| `.fdic-figma-embed-frame` | 1px border, 12px radius |
| `.fdic-story-embed-placeholder` | 2px dashed border, 12px radius, surface bg |
| `.fdic-figma-embed-placeholder` | 2px dashed border, 12px radius, surface bg |

---

## Task 1: Add `@layer` declarations and wrap existing files

**Files:**
- Create: `apps/docs/.vitepress/theme/accessibility.css` (empty scaffold)
- Modify: `apps/docs/.vitepress/theme/index.ts:4-7`
- Modify: `apps/docs/.vitepress/theme/tokens.css` (wrap in `@layer tokens`)
- Modify: `apps/docs/.vitepress/theme/prose.css` (wrap in `@layer prose`)
- Modify: `apps/docs/.vitepress/theme/docs-utilities.css` (wrap in `@layer docs-utilities`)
- Modify: `apps/docs/.vitepress/theme/custom.css` (wrap in `@layer docs-components`)

### Step 1: Create empty `accessibility.css` scaffold

```css
/*
 * Shared accessibility contracts for the docs theme.
 *
 * Owns: focus-visible geometry, forced-colors adaptations,
 * print rules, and reduced-motion defaults for doc surfaces.
 * Scoped to .vp-doc to avoid leaking into VitePress chrome.
 */

@layer a11y {
  /* Populated in Task 2 */
}
```

### Step 2: Add layer order declaration and import to `index.ts`

Update `index.ts` imports (lines 4-7) to:

```ts
import "./layers.css";
import "./tokens.css";
import "./accessibility.css";
import "./prose.css";
import "./docs-utilities.css";
import "./custom.css";
```

Create `apps/docs/.vitepress/theme/layers.css`:

```css
/*
 * Cascade layer ordering for the docs theme.
 * This file MUST be imported first — it establishes priority.
 * Later layers win over earlier layers in specificity ties.
 */

@layer tokens, a11y, prose, docs-components, docs-utilities;
```

### Step 3: Wrap `tokens.css` in `@layer tokens`

Wrap the entire contents of `tokens.css` (after the `@import` statements) in `@layer tokens { ... }`. Note: `@import` statements must remain outside the layer block (CSS spec requirement). Instead, use `@import` with layer syntax:

```css
@import "../../../../packages/tokens/semantic.css" layer(tokens);
@import "../../../../packages/tokens/legacy-fdic-colors.css" layer(tokens);

@layer tokens {
  @property --fdic-spacing-md {
    syntax: "<length>";
    inherits: true;
    initial-value: 1rem;
  }

  @property --fdic-spacing-xl {
    syntax: "<length>";
    inherits: true;
    initial-value: 1.25rem;
  }

  .dark {
    color-scheme: dark;
    --fd-visual-bg-warm: var(--ds-color-secondary-800, #88691c);
    --fd-global-header-mega-col-1: rgba(33, 33, 35, 0.84);
    --fd-global-header-mega-col-2: rgba(28, 38, 48, 0.5);
    --fd-global-header-mega-col-3: rgba(20, 32, 44, 0.24);
    --fd-global-header-mega-col-2-muted: rgba(28, 38, 48, 0.4);
    --fd-global-header-mega-col-3-muted: rgba(20, 32, 44, 0.14);
  }

  @media (prefers-color-scheme: dark) {
    :root:not(.light) {
      color-scheme: dark;
      --fd-visual-bg-warm: var(--ds-color-secondary-800, #88691c);
      --fd-global-header-mega-col-1: rgba(33, 33, 35, 0.84);
      --fd-global-header-mega-col-2: rgba(28, 38, 48, 0.5);
      --fd-global-header-mega-col-3: rgba(20, 32, 44, 0.24);
      --fd-global-header-mega-col-2-muted: rgba(28, 38, 48, 0.4);
      --fd-global-header-mega-col-3-muted: rgba(20, 32, 44, 0.14);
    }
  }
}
```

**Important caveat:** `@property` rules may need to remain outside `@layer` blocks depending on browser support — they are not affected by cascade layers per spec, but some implementations may reject them inside `@layer`. Test in Chrome/Firefox/Safari. If they fail inside the layer, move them above the `@layer tokens` block (they don't participate in cascade ordering anyway).

### Step 4: Wrap `prose.css` in `@layer prose`

The `@import "./generated/icon-masks.css"` at the top must use layer import syntax:

```css
@import "./generated/icon-masks.css" layer(prose);

@layer prose {
  /* ... entire existing :root and .prose rules ... */
}
```

### Step 5: Wrap `custom.css` in `@layer docs-components`

```css
@layer docs-components {
  /* ... entire existing custom.css content ... */
}
```

### Step 6: Wrap `docs-utilities.css` in `@layer docs-utilities`

```css
@layer docs-utilities {
  /* ... entire existing content ... */
}
```

### Step 7: Verify the dev server starts and pages render correctly

Run: `cd apps/docs && npx vitepress dev`

Open the browser and verify:
- Token colors page renders with swatches
- A component doc page renders with prose + cards
- Dark mode toggle works
- No console errors about layer ordering

Expected: Visually identical to before. Layers should not change appearance because the import order already matched the intended priority.

### Step 8: Commit

```bash
git add apps/docs/.vitepress/theme/layers.css \
        apps/docs/.vitepress/theme/accessibility.css \
        apps/docs/.vitepress/theme/index.ts \
        apps/docs/.vitepress/theme/tokens.css \
        apps/docs/.vitepress/theme/prose.css \
        apps/docs/.vitepress/theme/custom.css \
        apps/docs/.vitepress/theme/docs-utilities.css
git commit -m "refactor(docs): add @layer ordering to docs theme CSS

Introduce explicit cascade layers (tokens, a11y, prose,
docs-components, docs-utilities) to establish deterministic
priority. No visual changes — layers match existing import order."
```

---

## Task 2: Populate `accessibility.css` with shared contracts

**Files:**
- Modify: `apps/docs/.vitepress/theme/accessibility.css`

This file owns four contracts scoped to `.vp-doc` (VitePress's content container):

### Step 1: Add shared focus-visible geometry

```css
@layer a11y {
  /* ------------------------------------------------------------------ */
  /* Focus-visible — shared geometry for all interactive doc surfaces    */
  /* ------------------------------------------------------------------ */

  .vp-doc :is(
    .fdic-card,
    .fdic-swatch-card,
    .fdic-anatomy-panel,
    .fdic-example-card,
    .fdic-do-card,
    .fdic-dont-card,
    .fdic-related-list a,
    .fdic-story-embed-frame,
    .fdic-figma-embed-frame,
    details > summary
  ):focus-visible {
    outline: 2px solid var(--fdic-border-input-focus, #38b6ff);
    outline-offset: 2px;
    border-radius: 2px;
  }

  /* Cards that are links need the focus ring on the anchor, not the card */
  .vp-doc a:has(> .fdic-card):focus-visible {
    outline: 2px solid var(--fdic-border-input-focus, #38b6ff);
    outline-offset: 2px;
    border-radius: 14px;
  }

  .vp-doc a:has(> .fdic-card):focus-visible > .fdic-card {
    outline: none;
  }
```

### Step 2: Add forced-colors adaptations

```css
  /* ------------------------------------------------------------------ */
  /* Forced-colors — ensure doc surfaces remain visible in HC mode       */
  /* ------------------------------------------------------------------ */

  @media (forced-colors: active) {
    .vp-doc :is(
      .fdic-card,
      .fdic-swatch-card,
      .fdic-anatomy-panel,
      .fdic-example-card,
      .fdic-palette-group,
      .fdic-role-card,
      .fdic-type-specimen,
      .fdic-mode-card,
      .fdic-roles-table
    ) {
      border: 2px solid ButtonText;
      background: Canvas;
      forced-color-adjust: none;
    }

    .vp-doc :is(.fdic-do-card, .fdic-dont-card) {
      border: 2px solid ButtonText;
      border-top-width: 3px;
      forced-color-adjust: none;
    }

    .vp-doc .fdic-do-card {
      border-top-color: LinkText;
    }

    .vp-doc .fdic-dont-card {
      border-top-color: ButtonText;
    }

    /* Swatch color wells need to keep their explicit bg */
    .vp-doc .fdic-swatch-sample,
    .vp-doc .fdic-swatch-color {
      forced-color-adjust: none;
    }

    /* Chip tones lose their bg meaning — add underline as fallback */
    .vp-doc .fdic-chip[data-tone] {
      border: 1px solid ButtonText;
      background: Canvas;
      text-decoration: underline;
    }

    /* Embed frames */
    .vp-doc :is(.fdic-story-embed-frame, .fdic-figma-embed-frame) {
      border: 2px solid ButtonText;
    }

    .vp-doc :is(.fdic-story-embed-placeholder, .fdic-figma-embed-placeholder) {
      border: 2px dashed ButtonText;
    }

    /* Scale bars convey data via width — keep their color */
    .vp-doc .fdic-scale-bar {
      forced-color-adjust: none;
    }

    /* Role dots convey meaning via color */
    .vp-doc .fdic-role-dot {
      forced-color-adjust: none;
    }

    /* Decision flow numbered circles */
    .vp-doc .fdic-decision-flow li::before {
      forced-color-adjust: none;
    }
  }
```

### Step 3: Add print rules for doc surfaces

```css
  /* ------------------------------------------------------------------ */
  /* Print — strip decorative surfaces, keep structure                   */
  /* ------------------------------------------------------------------ */

  @media print {
    .vp-doc :is(
      .fdic-card,
      .fdic-swatch-card,
      .fdic-anatomy-panel,
      .fdic-example-card,
      .fdic-palette-group,
      .fdic-role-card,
      .fdic-type-specimen,
      .fdic-mode-card
    ) {
      background: none;
      box-shadow: none;
      border-color: #999;
      break-inside: avoid;
    }

    /* Suppress hover transforms in print (shouldn't matter, but belt & suspenders) */
    .vp-doc :is(
      .fdic-card,
      .fdic-swatch-card,
      .fdic-example-card,
      .fdic-do-card,
      .fdic-dont-card
    ) {
      transform: none !important;
    }

    /* Grids: linearize to single column */
    .vp-doc :is(
      .fdic-card-grid,
      .fdic-swatch-grid,
      .fdic-example-grid,
      .fdic-do-dont-grid,
      .fdic-role-map,
      .fdic-surface-demo,
      .fdic-mode-grid,
      .fdic-anatomy
    ) {
      grid-template-columns: 1fr;
    }

    /* Foundation intro: strip gradient */
    .vp-doc .fdic-foundation-intro {
      background: none;
      border-color: #999;
    }

    /* Embed placeholders: hide (iframes won't print) */
    .vp-doc :is(.fdic-story-embed, .fdic-figma-embed) {
      display: none;
    }

    /* Swatch color wells: force print the background */
    .vp-doc .fdic-swatch-sample,
    .vp-doc .fdic-swatch-color {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Animations have no meaning in print */
    .vp-doc :is(
      .fdic-card-grid > .fdic-card,
      .fdic-swatch-grid > .fdic-swatch-card,
      .fdic-foundation-intro
    ) {
      animation: none;
    }
  }
```

### Step 4: Add reduced-motion defaults

```css
  /* ------------------------------------------------------------------ */
  /* Reduced-motion — suppress all doc surface transitions & animations  */
  /* ------------------------------------------------------------------ */

  @media (prefers-reduced-motion: reduce) {
    .vp-doc :is(
      .fdic-card,
      .fdic-swatch-card,
      .fdic-anatomy-panel,
      .fdic-example-card,
      .fdic-do-card,
      .fdic-dont-card
    ) {
      transition: none;
    }

    .vp-doc :is(
      .fdic-card,
      .fdic-swatch-card,
      .fdic-example-card,
      .fdic-do-card,
      .fdic-dont-card
    ):hover {
      transform: none;
    }

    .vp-doc :is(
      .fdic-card-grid > .fdic-card,
      .fdic-swatch-grid > .fdic-swatch-card,
      .fdic-foundation-intro
    ) {
      animation: none;
    }
  }

} /* end @layer a11y */
```

### Step 5: Verify accessibility contracts render correctly

Run: `cd apps/docs && npx vitepress dev`

Check in browser:
1. **Focus**: Tab through a card-grid page — cards should show blue focus rings
2. **Forced-colors**: In Chrome DevTools → Rendering → Emulate `forced-colors: active` — cards should have visible 2px borders, swatch wells should keep their color
3. **Print**: Ctrl+P preview on a token page — grids linearized, no gradients, embeds hidden, swatch colors preserved
4. **Reduced-motion**: In DevTools → Rendering → Emulate `prefers-reduced-motion: reduce` — no card hover transforms or entrance animations

### Step 6: Commit

```bash
git add apps/docs/.vitepress/theme/accessibility.css
git commit -m "feat(docs): add shared accessibility contracts for doc surfaces

New accessibility.css owns focus-visible, forced-colors, print,
and reduced-motion rules for all doc component surfaces. Scoped
to .vp-doc to avoid leaking into VitePress navigation chrome."
```

---

## Task 3: Remove redundant reduced-motion from `custom.css`

**Files:**
- Modify: `apps/docs/.vitepress/theme/custom.css:1095-1119`

### Step 1: Delete the `@media (prefers-reduced-motion: reduce)` block from custom.css

Remove lines 1096-1119 (the entire reduced-motion block). This is now owned by `accessibility.css`.

### Step 2: Verify reduced-motion still works

Run: `cd apps/docs && npx vitepress dev`

In DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`:
- Card hover: no transform
- Card entrance: no animation
- Foundation intro: no animation

Expected: identical behavior to before — the a11y layer provides the same rules.

### Step 3: Commit

```bash
git add apps/docs/.vitepress/theme/custom.css
git commit -m "refactor(docs): remove reduced-motion from custom.css

These rules are now owned by the shared a11y layer in
accessibility.css. No behavioral change."
```

---

## Task 4: Extract surface primitives into `custom.css`

**Files:**
- Modify: `apps/docs/.vitepress/theme/custom.css` (top of file, inside `@layer docs-components`)

This task adds 3 primitive classes at the top of custom.css. It does NOT yet refactor existing classes to use them — that's Task 5.

### Step 1: Add `.fdic-surface` primitive

Insert after the `:root` block (after line 12):

```css
/* ================================================================== */
/* Surface primitives                                                  */
/* Compose these into doc-specific classes. Do not use directly in     */
/* markup — they exist as @extend-like building blocks.                */
/* ================================================================== */

/*
 * .fdic-surface — static doc surface
 * Border, radius, background. No interaction.
 */
.fdic-surface {
  border: 1px solid var(--fdic-docs-border);
  border-radius: 14px;
  background: var(--ds-color-bg-surface, #FFFFFF);
  color: var(--fdic-docs-ink);
}
```

### Step 2: Add `.fdic-interactive-surface` primitive

```css
/*
 * .fdic-interactive-surface — hoverable/focusable doc surface
 * Extends .fdic-surface with transition and hover state.
 * Apply alongside .fdic-surface in markup or compose in CSS.
 */
.fdic-interactive-surface {
  transition:
    border-color 200ms cubic-bezier(0.2, 0.7, 0.2, 1),
    box-shadow 200ms cubic-bezier(0.2, 0.7, 0.2, 1),
    transform 200ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.fdic-interactive-surface:hover {
  border-color: rgba(13, 97, 145, 0.25);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 6px 16px rgba(13, 97, 145, 0.06);
  transform: translateY(-1px);
}

.fdic-interactive-surface:active {
  transform: translateY(0);
  transition-duration: 80ms;
}

.dark .fdic-interactive-surface:hover {
  border-color: rgba(132, 219, 255, 0.25);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.12),
    0 6px 16px rgba(132, 219, 255, 0.06);
}
```

### Step 3: Add `.fdic-status-surface` primitive

```css
/*
 * .fdic-status-surface — semantic surface with top accent border
 * Used for do/don't, success/error cards.
 * Set --_status-color via modifier class.
 */
.fdic-status-surface {
  padding: 1rem;
  border-radius: 12px;
  background: var(--ds-color-bg-surface, #FFFFFF);
  color: var(--fdic-docs-ink);
  border: 1px solid color-mix(in srgb, var(--_status-color, gray) 25%, transparent);
  border-top: 3px solid var(--_status-color, gray);
  transition:
    box-shadow 200ms cubic-bezier(0.2, 0.7, 0.2, 1),
    transform 200ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.fdic-status-surface:hover {
  box-shadow: 0 4px 16px color-mix(in srgb, var(--_status-color, gray) 10%, transparent);
  transform: translateY(-1px);
}
```

Note: `color-mix()` is supported in all evergreen browsers. If the project needs to support older browsers, fall back to the current hardcoded rgba approach and skip this primitive. Check `browserslist` in `package.json` before implementing.

### Step 4: Verify primitives don't affect existing rendering

The primitives are unused in markup at this point. Run the dev server and confirm no visual changes.

### Step 5: Commit

```bash
git add apps/docs/.vitepress/theme/custom.css
git commit -m "feat(docs): add surface primitive classes to docs-components layer

Three composable primitives: .fdic-surface (static),
.fdic-interactive-surface (hoverable), .fdic-status-surface
(semantic accent). Not yet applied to existing classes."
```

---

## Task 5: Rebuild existing classes on surface primitives

**Files:**
- Modify: `apps/docs/.vitepress/theme/custom.css`

This is the largest task. For each group of classes, we refactor to compose the primitives while keeping the existing class names stable (no markup changes needed).

### Step 1: Refactor `.fdic-card` to compose primitives

Replace the existing `.fdic-card` block (lines ~35-58) with:

```css
.fdic-card {
  padding: 1rem;
  border: 1px solid var(--fdic-docs-border);
  border-radius: 12px;
  background: var(--ds-color-bg-surface, #FFFFFF);
  color: var(--fdic-docs-ink);
  transition:
    border-color 200ms cubic-bezier(0.2, 0.7, 0.2, 1),
    box-shadow 200ms cubic-bezier(0.2, 0.7, 0.2, 1),
    transform 200ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.fdic-card:hover {
  border-color: rgba(13, 97, 145, 0.3);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(13, 97, 145, 0.08);
  transform: translateY(-2px);
}

.fdic-card:active {
  transform: translateY(0);
  transition-duration: 80ms;
}
```

Note: `.fdic-card` uses 12px radius (not 14px) and a stronger hover shadow than the primitive's default. It retains its own values. The primitive gives us the a11y contract via the selector lists in `accessibility.css` — the card doesn't need to literally extend the primitive class.

**This is the key insight**: The primitives exist primarily as:
1. Documentation of the shared pattern
2. Available for new classes to compose directly
3. The _accessibility contracts_ in `accessibility.css` reference the concrete class names

Existing classes keep their current property values to avoid visual regression. The win is that accessibility coverage is now centralized, not per-class.

### Step 2: Refactor `.fdic-swatch-card`, `.fdic-example-card`, `.fdic-anatomy-panel`

These already follow the interactive-surface pattern. Confirm each has its hover transition and that `accessibility.css` Task 2 covers them in its selector lists. No CSS changes needed if selectors are already listed.

### Step 3: Refactor `.fdic-do-card` / `.fdic-dont-card` to use `--_status-color`

Replace the current do/don't styling (lines ~824-853) with:

```css
.fdic-do-card,
.fdic-dont-card {
  padding: 1rem;
  border-radius: 12px;
  background: var(--ds-color-bg-surface, #FFFFFF);
  color: var(--fdic-docs-ink);
  border: 1px solid color-mix(in srgb, var(--_status-color) 30%, transparent);
  border-top: 3px solid var(--_status-color);
  transition:
    box-shadow 200ms cubic-bezier(0.2, 0.7, 0.2, 1),
    transform 200ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.fdic-do-card {
  --_status-color: var(--fdic-docs-success);
}

.fdic-dont-card {
  --_status-color: var(--fdic-docs-danger);
}

.fdic-do-card:hover,
.fdic-dont-card:hover {
  box-shadow: 0 4px 16px color-mix(in srgb, var(--_status-color) 10%, transparent);
  transform: translateY(-1px);
}
```

Also update the dark overrides (lines ~639-655) to use `--_status-color`:

```css
.dark .fdic-do-card {
  --_status-color: var(--fdic-docs-success);
  border-color: color-mix(in srgb, var(--_status-color) 30%, transparent);
}

.dark .fdic-dont-card {
  --_status-color: var(--fdic-docs-danger);
  border-color: color-mix(in srgb, var(--_status-color) 25%, transparent);
}
```

**Browser check**: Before implementing `color-mix()`, verify it's supported by the project's browserslist. Run `npx browserslist` in the repo root. If the target includes browsers without `color-mix()` support, keep the current hardcoded rgba values instead.

### Step 4: Consolidate embed frame styles

Replace the duplicated `.fdic-story-embed-*` / `.fdic-figma-embed-*` selectors (lines ~750-811) with combined selectors. The existing code already uses comma-separated selectors for some of these — verify they're all combined:

```css
:is(.fdic-story-embed, .fdic-figma-embed) {
  margin: 1.25rem 0 2rem;
}

:is(.fdic-story-embed-frame, .fdic-figma-embed-frame) {
  border: 1px solid var(--fdic-docs-border);
  border-radius: 12px;
  overflow: hidden;
}

/* ... etc for all paired selectors ... */
```

### Step 5: Remove duplicated dark-mode hover overrides

Lines 1063-1093 define dark hover shadows for each card type individually. With the `accessibility.css` layer handling the a11y contracts, these dark-mode hover overrides should remain (they're cosmetic, not a11y). But review whether any are now redundant with the primitives.

If `.fdic-interactive-surface` dark hover is sufficient, individual dark overrides for `.fdic-swatch-card:hover`, `.fdic-anatomy-panel:hover`, `.fdic-example-card:hover` can be removed (they all use the same `rgba(132, 219, 255, ...)` pattern). Keep `.fdic-card:hover` dark override if its stronger shadow (`0 8px 24px`) differs from the primitive.

### Step 6: Visual regression check

Run: `cd apps/docs && npx vitepress dev`

Check these pages manually:
1. **Color tokens page** — swatch grid, palette ramps, role cards
2. **Typography page** — type specimen, scale grid
3. **Any component doc page** — cards, do/don't pairs, embeds
4. **Toggle dark mode** — verify all hover states adapt
5. **Print preview** (Ctrl+P) — linearized grids, no gradients
6. **DevTools forced-colors emulation** — visible borders, preserved swatches

### Step 7: Commit

```bash
git add apps/docs/.vitepress/theme/custom.css
git commit -m "refactor(docs): consolidate doc surfaces onto shared primitives

Rebuild do/dont cards with --_status-color pattern. Combine
duplicated embed frame selectors. Surface primitives available
for future doc components to compose."
```

---

## Task 6: Cleanup and final verification

**Files:**
- Review: all modified files for stale comments or dead code

### Step 1: Audit custom.css for orphaned selectors

Search for any class defined in `custom.css` that is not used in any `.md` or `.vue` file under `apps/docs/`:

```bash
# From repo root
grep -oP '\.fdic-[\w-]+' apps/docs/.vitepress/theme/custom.css | sort -u > /tmp/css-classes.txt
for cls in $(cat /tmp/css-classes.txt); do
  count=$(grep -r "${cls}" apps/docs/src apps/docs/.vitepress/theme/components --include='*.md' --include='*.vue' -l 2>/dev/null | wc -l)
  if [ "$count" -eq 0 ]; then
    echo "UNUSED: $cls"
  fi
done
```

Remove any truly unused classes. Don't remove classes that are only referenced in the CSS itself (e.g., child selectors like `.fdic-card h3`).

### Step 2: Verify `@layer` specificity is correct

Open DevTools on any page with both prose and doc-component styles. Inspect a `.fdic-card` inside `.vp-doc .prose` and confirm:
- The `@layer docs-components` rules appear
- The `@layer a11y` rules for `:focus-visible` and `forced-colors` appear
- The `@layer prose` rules apply to prose content inside cards
- No unexpected layer ordering issues

### Step 3: Run the full build

```bash
cd apps/docs && npx vitepress build
```

Expected: clean build with no CSS errors.

### Step 4: Commit any cleanup

```bash
git add -A
git commit -m "chore(docs): remove unused CSS classes after layer restructure"
```

---

## QA Checklist (manual, post-implementation)

These are not automated tests — they're manual verification steps to run after all tasks are complete. They should be performed in Chrome, Firefox, and Safari.

| Check | How | Expected |
|-------|-----|----------|
| Keyboard focus | Tab through card-grid page | Blue 2px outline on every interactive surface |
| Focus ring shape | Tab to a card-link | 14px radius ring follows card shape |
| Forced-colors | DevTools → Rendering → Emulate forced-colors | Cards have 2px ButtonText borders, swatch wells keep color, chips get underline |
| Print | Ctrl+P on token page | Single-column grids, no gradients, embeds hidden, swatch colors printed |
| Reduced-motion | DevTools → Rendering → Emulate prefers-reduced-motion | No hover transforms, no entrance animations |
| Dark mode | Toggle VitePress dark mode | Hover shadows adapt, do/dont border colors adapt |
| Layer ordering | DevTools → Styles panel | Layers shown in correct order: tokens < a11y < prose < docs-components < docs-utilities |
| Build | `npx vitepress build` | Clean, no warnings |

---

## What This Plan Does NOT Cover

- **Prose CSS restructuring**: `prose.css` already has good a11y coverage. Its internal organization (sections 0-6) is fine.
- **Token package changes**: `packages/tokens/` is not touched.
- **Component library CSS**: `@fdic-ds/components` uses shadow DOM — not affected.
- **`prefers-contrast` support**: Mentioned in the original brief as optional. Can be added to `accessibility.css` later as a follow-up.
- **Automated visual regression tests**: Would be valuable but is a separate initiative (Playwright screenshot comparison or similar).
