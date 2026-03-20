# Color Palette Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the doc site's ad-hoc color values with a canonical `--ds-color-*` token system, update `colors.md` to reflect the approved palette, and align the doc site CSS to consume the real tokens.

**Architecture:** A single CSS file (`tokens.css`) defines all `--ds-color-*` custom properties for light mode in `:root` and dark mode via `@media (prefers-color-scheme: dark)`. The doc site's `custom.css` aliases these via `var()`. The `colors.md` documentation is rewritten to show correct hex values, token names, and the full palette structure from the design doc.

**Tech Stack:** CSS custom properties, VitePress (Markdown + HTML), no build tooling for tokens yet.

**Design doc:** `docs/plans/2026-03-19-color-palette-design.md`

---

### Task 1: Create the token CSS file with primitives (light mode)

**Files:**
- Create: `apps/docs/.vitepress/theme/tokens.css`

**Step 1: Create tokens.css with primitive custom properties**

Create `apps/docs/.vitepress/theme/tokens.css` with all primitive color values under `:root`. These are the raw ramp values that semantic tokens alias into. Include a comment block explaining that primitives are not public API.

```css
/*
 * FDIC Design System — Color Tokens
 *
 * Primitives (--ds-color-[family]-[step]) are internal reference values.
 * Consumers should use semantic tokens (--ds-color-[role]-[variant]).
 *
 * Source: docs/plans/2026-03-19-color-palette-design.md
 */

:root {
  /* ===== Primitives ===== */

  /* Neutral */
  --ds-color-neutral-000: #FFFFFF;
  --ds-color-neutral-050: #FAFAFC;
  --ds-color-neutral-100: #F5F5F7;
  --ds-color-neutral-150: #E8E8ED; /* private — checkbox/radio border */
  --ds-color-neutral-200: #E0E0E2;
  --ds-color-neutral-300: #D6D6D8;
  --ds-color-neutral-400: #BDBDBF;
  --ds-color-neutral-500: #9E9EA0;
  --ds-color-neutral-700: #595961;
  --ds-color-neutral-800: #424244;
  --ds-color-neutral-850: #333335; /* private — checkbox/radio border */
  --ds-color-neutral-900: #212123;
  --ds-color-neutral-1000: #000000;

  /* Primary brand (blue) */
  --ds-color-primary-050: #E6F4FA;
  --ds-color-primary-200: #84DBFF;
  --ds-color-primary-400: #38B6FF;
  --ds-color-primary-500: #0D6191;
  --ds-color-primary-700: #09496D;
  --ds-color-primary-800: #073C5B;
  --ds-color-primary-900: #003256;

  /* Secondary brand (gold) */
  --ds-color-secondary-050: #F8EFDA;
  --ds-color-secondary-300: #EBD49B;
  --ds-color-secondary-400: #E1C16E;
  --ds-color-secondary-500: #D9AF45;
  --ds-color-secondary-600: #BD9327;
  --ds-color-secondary-800: #88691C;
  --ds-color-secondary-900: #60511B;

  /* Success (green) */
  --ds-color-success-050: #E8F5E9;
  --ds-color-success-200: #A5D6A7;
  --ds-color-success-500: #4CAF50;
  --ds-color-success-600: #388E3C;
  --ds-color-success-800: #204520;
  --ds-color-success-900: #1B3A1B;

  /* Warning (amber) */
  --ds-color-warning-050: #FCF7EE;
  --ds-color-warning-200: #FFCC80;
  --ds-color-warning-500: #F49F00;
  --ds-color-warning-600: #E68A00;
  --ds-color-warning-800: #663D00;
  --ds-color-warning-900: #4D2E00;

  /* Error (red) */
  --ds-color-error-050: #FDEDEA;
  --ds-color-error-200: #F5A3A3;
  --ds-color-error-500: #B10B2D;
  --ds-color-error-600: #D80E3A;
  --ds-color-error-800: #442121;
  --ds-color-error-900: #331919;

  /* Info (blue) */
  --ds-color-info-050: #F1F8FE;
  --ds-color-info-200: #90CAF9;
  --ds-color-info-500: #0776CB;
  --ds-color-info-600: #0568B3;
  --ds-color-info-800: #1E3A5F;
  --ds-color-info-900: #162D4A;

  /* Link */
  --ds-color-link-default: #1278B0;
  --ds-color-link-visited: #855AA5;
}
```

Note: The semantic hue 200/600/900 values are reasonable interpolations. These will be refined with OKLCH tooling later but are visually functional now.

**Step 2: Verify the file is valid CSS**

Run: `npx css-validator apps/docs/.vitepress/theme/tokens.css 2>/dev/null || echo "Manual check: open file and verify no syntax errors"`

If no CSS validator is available, visually inspect for missing semicolons or malformed values.

**Step 3: Commit**

```bash
git add apps/docs/.vitepress/theme/tokens.css
git commit -m "feat: add primitive color token definitions"
```

---

### Task 2: Add semantic tokens (light mode) to tokens.css

**Files:**
- Modify: `apps/docs/.vitepress/theme/tokens.css`

**Step 1: Append semantic token definitions after the primitives block**

Add all semantic tokens inside the same `:root` block, using `var()` references to primitives. Group by role (background, text, icon, border, semantic status, overlay, effect).

```css
  /* ===== Semantic tokens ===== */

  /* Background */
  --ds-color-bg-base: var(--ds-color-neutral-000);
  --ds-color-bg-surface: var(--ds-color-neutral-000);
  --ds-color-bg-container: var(--ds-color-neutral-100);
  --ds-color-bg-overlay: var(--ds-color-neutral-000);
  --ds-color-bg-modal: var(--ds-color-neutral-100);
  --ds-color-bg-input: var(--ds-color-neutral-000);
  --ds-color-bg-interactive: var(--ds-color-neutral-100);
  --ds-color-bg-inverted: var(--ds-color-neutral-900);
  --ds-color-bg-brand: var(--ds-color-primary-900);
  --ds-color-bg-highlight: var(--ds-color-primary-400);
  --ds-color-bg-selected: var(--ds-color-primary-050);
  --ds-color-bg-active: var(--ds-color-primary-500);
  --ds-color-bg-hovered: rgba(0, 0, 0, 0.04);
  --ds-color-bg-pressed: rgba(0, 0, 0, 0.08);
  --ds-color-bg-destructive: var(--ds-color-error-600);
  --ds-color-bg-readonly: var(--ds-color-neutral-100);

  /* Text */
  --ds-color-text-primary: var(--ds-color-neutral-900);
  --ds-color-text-secondary: var(--ds-color-neutral-700);
  --ds-color-text-placeholder: var(--ds-color-neutral-500);
  --ds-color-text-disabled: var(--ds-color-neutral-500);
  --ds-color-text-inverted: var(--ds-color-neutral-000);
  --ds-color-text-brand: var(--ds-color-primary-500);
  --ds-color-text-warm: var(--ds-color-secondary-900);
  --ds-color-text-link: var(--ds-color-link-default);
  --ds-color-text-link-visited: var(--ds-color-link-visited);
  --ds-color-text-error: var(--ds-color-error-600);
  --ds-color-text-wordmark: var(--ds-color-primary-900);

  /* Icon */
  --ds-color-icon-primary: var(--ds-color-neutral-800);
  --ds-color-icon-secondary: var(--ds-color-neutral-700);
  --ds-color-icon-placeholder: var(--ds-color-neutral-700);
  --ds-color-icon-disabled: var(--ds-color-neutral-400);
  --ds-color-icon-inverted: var(--ds-color-neutral-000);
  --ds-color-icon-warm: var(--ds-color-secondary-900);
  --ds-color-icon-active: var(--ds-color-link-default);
  --ds-color-icon-link: var(--ds-color-link-default);

  /* Border */
  --ds-color-border-divider: var(--ds-color-neutral-400);
  --ds-color-border-image: var(--ds-color-neutral-000);
  --ds-color-border-input: var(--ds-color-neutral-400);
  --ds-color-border-input-hover: var(--ds-color-neutral-500);
  --ds-color-border-input-focus: var(--ds-color-primary-400);
  --ds-color-border-input-active: var(--ds-color-neutral-800);
  --ds-color-border-input-readonly: var(--ds-color-neutral-200);
  --ds-color-border-input-interactive: var(--ds-color-neutral-150);
  --ds-color-border-input-disabled: var(--ds-color-neutral-300);

  /* Semantic status */
  --ds-color-semantic-bg-success: var(--ds-color-success-050);
  --ds-color-semantic-bg-warning: var(--ds-color-warning-050);
  --ds-color-semantic-bg-error: var(--ds-color-error-050);
  --ds-color-semantic-bg-info: var(--ds-color-info-050);
  --ds-color-semantic-fg-success: var(--ds-color-success-500);
  --ds-color-semantic-fg-warning: var(--ds-color-warning-500);
  --ds-color-semantic-fg-error: var(--ds-color-error-500);
  --ds-color-semantic-fg-info: var(--ds-color-info-500);
  --ds-color-semantic-border-success: var(--ds-color-success-500);
  --ds-color-semantic-border-warning: var(--ds-color-warning-500);
  --ds-color-semantic-border-error: var(--ds-color-error-500);
  --ds-color-semantic-border-info: var(--ds-color-info-500);

  /* Overlay */
  --ds-color-overlay-hover: rgba(0, 0, 0, 0.04);
  --ds-color-overlay-pressed: rgba(0, 0, 0, 0.08);
  --ds-color-overlay-scrim: rgba(0, 0, 0, 0.48);

  /* Effect */
  --ds-color-effect-shadow: rgba(0, 0, 0, 0.08);
```

**Step 2: Commit**

```bash
git add apps/docs/.vitepress/theme/tokens.css
git commit -m "feat: add semantic color token definitions (light mode)"
```

---

### Task 3: Add dark mode overrides to tokens.css

**Files:**
- Modify: `apps/docs/.vitepress/theme/tokens.css`

**Step 1: Add a `@media (prefers-color-scheme: dark)` block after the `:root` block**

Override only the semantic tokens that change in dark mode. Primitives stay the same — the semantic layer remaps which primitive each role points to.

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Background */
    --ds-color-bg-base: var(--ds-color-neutral-1000);
    --ds-color-bg-surface: var(--ds-color-neutral-900);
    --ds-color-bg-container: var(--ds-color-neutral-900);
    --ds-color-bg-overlay: var(--ds-color-neutral-900);
    --ds-color-bg-modal: var(--ds-color-neutral-800);
    --ds-color-bg-input: var(--ds-color-neutral-900);
    --ds-color-bg-interactive: var(--ds-color-neutral-900);
    --ds-color-bg-inverted: var(--ds-color-neutral-100);
    --ds-color-bg-brand: var(--ds-color-primary-050);
    --ds-color-bg-selected: var(--ds-color-primary-900);
    --ds-color-bg-active: var(--ds-color-primary-200);
    --ds-color-bg-hovered: rgba(255, 255, 255, 0.04);
    --ds-color-bg-pressed: rgba(255, 255, 255, 0.08);
    --ds-color-bg-readonly: var(--ds-color-neutral-800);

    /* Text */
    --ds-color-text-primary: var(--ds-color-neutral-000);
    --ds-color-text-secondary: var(--ds-color-neutral-200);
    --ds-color-text-inverted: var(--ds-color-neutral-1000);
    --ds-color-text-brand: var(--ds-color-primary-200);
    --ds-color-text-warm: var(--ds-color-secondary-050);
    --ds-color-text-link: #ADD8E6;
    --ds-color-text-link-visited: #B19CD9;
    --ds-color-text-error: #FFCCCC;
    --ds-color-text-wordmark: var(--ds-color-neutral-000);

    /* Icon */
    --ds-color-icon-primary: var(--ds-color-neutral-200);
    --ds-color-icon-secondary: var(--ds-color-neutral-400);
    --ds-color-icon-placeholder: var(--ds-color-neutral-500);
    --ds-color-icon-disabled: var(--ds-color-neutral-700);
    --ds-color-icon-inverted: var(--ds-color-neutral-1000);
    --ds-color-icon-warm: var(--ds-color-secondary-050);
    --ds-color-icon-active: #ADD8E6;
    --ds-color-icon-link: #ADD8E6;

    /* Border */
    --ds-color-border-divider: var(--ds-color-neutral-700);
    --ds-color-border-input: var(--ds-color-neutral-700);
    --ds-color-border-input-hover: var(--ds-color-neutral-500);
    --ds-color-border-input-focus: var(--ds-color-primary-500);
    --ds-color-border-input-active: var(--ds-color-neutral-200);
    --ds-color-border-input-readonly: var(--ds-color-neutral-400);
    --ds-color-border-input-interactive: var(--ds-color-neutral-850);
    --ds-color-border-input-disabled: var(--ds-color-neutral-500);

    /* Semantic status */
    --ds-color-semantic-bg-success: var(--ds-color-success-800);
    --ds-color-semantic-bg-warning: var(--ds-color-warning-800);
    --ds-color-semantic-bg-error: var(--ds-color-error-800);
    --ds-color-semantic-bg-info: var(--ds-color-info-800);
    --ds-color-semantic-fg-success: #61D673;
    --ds-color-semantic-fg-warning: #FFBF47;
    --ds-color-semantic-fg-error: #F66F8B;
    --ds-color-semantic-fg-info: #4EAFF9;
    --ds-color-semantic-border-success: #61D673;
    --ds-color-semantic-border-warning: #FFBF47;
    --ds-color-semantic-border-error: #F66F8B;
    --ds-color-semantic-border-info: #4EAFF9;

    /* Overlay */
    --ds-color-overlay-hover: rgba(255, 255, 255, 0.04);
    --ds-color-overlay-pressed: rgba(255, 255, 255, 0.08);

    /* Effect */
    --ds-color-effect-shadow: rgba(0, 0, 0, 0);
  }
}
```

**Step 2: Commit**

```bash
git add apps/docs/.vitepress/theme/tokens.css
git commit -m "feat: add dark mode semantic token overrides"
```

---

### Task 4: Wire tokens.css into VitePress theme and update custom.css

**Files:**
- Modify: `apps/docs/.vitepress/theme/index.ts`
- Modify: `apps/docs/.vitepress/theme/custom.css`

**Step 1: Import tokens.css in the theme entry point**

In `apps/docs/.vitepress/theme/index.ts`, add the import for `tokens.css` **before** the `custom.css` import so that custom.css can reference the token variables.

```ts
import "./tokens.css";
import "./custom.css";
```

**Step 2: Update the `:root` block in custom.css**

Replace the hardcoded hex values with `var()` references to the new `--ds-*` tokens. Also add `--fdic-docs-surface-strong` mapping.

```css
:root {
  --fdic-docs-ink: var(--ds-color-text-primary);
  --fdic-docs-muted: var(--ds-color-text-secondary);
  --fdic-docs-border: var(--ds-color-border-divider);
  --fdic-docs-surface: var(--ds-color-bg-container);
  --fdic-docs-surface-strong: var(--ds-color-bg-surface);
  --fdic-docs-brand: var(--ds-color-text-brand);
  --fdic-docs-accent: var(--ds-color-text-warm);
  --fdic-docs-success: var(--ds-color-semantic-fg-success);
  --fdic-docs-warning: var(--ds-color-semantic-fg-warning);
  --fdic-docs-danger: var(--ds-color-semantic-fg-error);
}
```

**Step 3: Start dev server and visually verify**

Run: `npm run dev:docs`

Open the site in browser. Verify the foundations pages still render with correct colors. The visual appearance will shift slightly since the hex values are changing from the ad-hoc Codex values to the Figma-aligned values.

**Step 4: Commit**

```bash
git add apps/docs/.vitepress/theme/index.ts apps/docs/.vitepress/theme/custom.css
git commit -m "refactor: wire doc site CSS to --ds-color-* tokens"
```

---

### Task 5: Rewrite colors.md — anatomy and palette sections

**Files:**
- Modify: `apps/docs/guide/foundations/colors.md`

**Step 1: Rewrite the page intro, anatomy section, and swatch grid**

Replace the current intro and anatomy section. Key changes:
- Remove mention of "optional accent brand"
- Update the swatch grid hex values and text colors to use the real primitive values
- Update the anatomy list to match the design doc structure

The swatch grid should show four cards: Neutral (use neutral-900 `#212123`), Primary brand (use primary-500 `#0D6191`), Secondary brand (use secondary-500 `#D9AF45`), and Semantic (use error-050 `#FDEDEA` with error-500 `#B10B2D` text).

**Step 2: Rewrite the palette token section**

Replace the three palette ramp groups with corrected values from the design doc. Each swatch should show:
- The step number
- The hex value
- The token name

**Neutral ramp** — show all 10 public steps (000 through 1000) with correct hex values from the design doc. Use `--ds-color-neutral-[step]` labels. Reverse the display order so it goes light-to-dark (000 first, 1000 last).

**Primary brand ramp** — show all 7 steps (050, 200, 400, 500, 700, 800, 900) with correct hex values. Use `--ds-color-primary-[step]` labels.

**Secondary brand ramp** — show all 7 steps (050, 300, 400, 500, 600, 800, 900) with correct hex values. Use `--ds-color-secondary-[step]` labels.

Remove the line about "If an accent palette is introduced later."

**Step 3: Update the naming model examples**

Replace the old draft naming examples:
```
- palette: --ds-color-neutral-300
- role: --ds-color-text-primary
- semantic: --ds-color-semantic-bg-error
```

**Step 4: Commit**

```bash
git add apps/docs/guide/foundations/colors.md
git commit -m "docs: update palette section with correct token values and names"
```

---

### Task 6: Rewrite colors.md — role tokens section

**Files:**
- Modify: `apps/docs/guide/foundations/colors.md`

**Step 1: Update the role token cards**

Update the four role cards (Background, Text, Border, Icon) to use the new `--ds-color-*` token names:
- Background examples: `--ds-color-bg-base`, `--ds-color-bg-container`, `--ds-color-bg-brand`
- Text demo: use correct hex values — Primary `#212123`, Secondary `#595961`, Brand `#0D6191`
- Border chips: `default` → `divider`, keep `input`
- Icon chips: `primary`, `secondary`, keep `brand` chip with updated tone

**Step 2: Update the role token family list**

Replace the old `color.background.*` notation with `--ds-color-bg-*`, `--ds-color-text-*`, etc.

**Step 3: Commit**

```bash
git add apps/docs/guide/foundations/colors.md
git commit -m "docs: update role token section with --ds-color-* naming"
```

---

### Task 7: Rewrite colors.md — semantic status section

**Files:**
- Modify: `apps/docs/guide/foundations/colors.md`

**Step 1: Update the semantic example cards**

Fix all hardcoded hex values in the four status example cards to use the real Figma-aligned values:
- Success: bg `#E8F5E9`, fg `#4CAF50`
- Warning: bg `#FCF7EE`, fg `#F49F00`
- Error: bg `#FDEDEA`, fg `#B10B2D`
- Info: bg `#F1F8FE`, fg `#0776CB`

**Step 2: Update the semantic token family list**

Replace old `color.semantic.background.success` notation with `--ds-color-semantic-bg-success`, `--ds-color-semantic-fg-success`, and add the border variants `--ds-color-semantic-border-success`.

**Step 3: Commit**

```bash
git add apps/docs/guide/foundations/colors.md
git commit -m "docs: update semantic section with correct token values"
```

---

### Task 8: Rewrite colors.md — modes section

**Files:**
- Modify: `apps/docs/guide/foundations/colors.md`

**Step 1: Update the mode cards**

Update the dark mode frame colors to use values from the Figma Dark.tokens.json:
- Dark mode panel background: `#212123` (neutral-900)
- Dark mode gradient: from `#000000` to `#212123`

Update `<code>` labels from `colors.default` / `colors.dark` to the `--ds-color-*` convention.

**Step 2: Commit**

```bash
git add apps/docs/guide/foundations/colors.md
git commit -m "docs: update modes section with dark mode token values"
```

---

### Task 9: Clean up known gaps and exclusions

**Files:**
- Modify: `apps/docs/guide/foundations/colors.md`

**Step 1: Update the "What not to rely on yet" section**

Remove "final CSS variable names" since we now have the `--ds-color-*` convention. Keep the remaining caveats about dark-mode activation strategy and component tokens.

Remove "final accent palette, if any" since the accent palette has been explicitly dropped.

**Step 2: Update the "Known gaps" section**

Update to reflect current status:
- Semantic hue ramp intermediate steps (200/600/900) are placeholder values pending OKLCH refinement
- Component-level color tokens are deferred
- Dark mode activation strategy (media query vs. class toggle) not finalized
- Contrast validation at the component/pattern level not yet documented

**Step 3: Commit**

```bash
git add apps/docs/guide/foundations/colors.md
git commit -m "docs: update known gaps to reflect current token status"
```

---

### Task 10: Visual verification and final commit

**Files:**
- No new files — verification only

**Step 1: Build the docs site**

Run: `npm run build:docs`

Expected: Build succeeds with no errors.

**Step 2: Start dev server and verify all colors.md sections**

Run: `npm run dev:docs`

Verify in browser:
- [ ] Swatch grid shows correct colors (neutral dark, primary blue, secondary gold, semantic)
- [ ] Palette ramps show correct hex values and step numbers
- [ ] Role token cards display correctly
- [ ] Semantic status cards show correct background/foreground colors
- [ ] Mode cards render light and dark frames
- [ ] Page text is readable (ink/muted colors working via token aliases)
- [ ] No broken styles from the CSS variable migration

**Step 3: If the build succeeded and everything looks correct, create a final verification commit**

```bash
git add -A
git commit -m "chore: verify color token implementation renders correctly"
```

Only commit if there are any remaining unstaged changes from minor fixups during verification.
