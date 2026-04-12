# Color Palette Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the doc site's ad-hoc color values with a canonical `--fdic-color-*` token system, update `colors.md` to reflect the approved palette, and align the doc site CSS to consume the real tokens.

**Architecture:** A single CSS file (`tokens.css`) defines all `--fdic-color-*` custom properties for light mode in `:root` and dark mode via `@media (prefers-color-scheme: dark)`. The doc site's `custom.css` aliases these via `var()`. The `colors.md` documentation is rewritten to show correct hex values, token names, and the full palette structure from the design doc.

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
 * Primitives (--fdic-color-[family]-[step]) are internal reference values.
 * Consumers should use semantic tokens (--fdic-color-[role]-[variant]).
 *
 * Source: docs/plans/2026-03-19-color-palette-design.md
 */

:root {
  /* ===== Primitives ===== */

  /* Neutral */
  --fdic-color-neutral-000: #FFFFFF;
  --fdic-color-neutral-050: #FAFAFC;
  --fdic-color-neutral-100: #F5F5F7;
  --fdic-color-neutral-150: #E8E8ED; /* private — checkbox/radio border */
  --fdic-color-neutral-200: #E0E0E2;
  --fdic-color-neutral-300: #D6D6D8;
  --fdic-color-neutral-400: #BDBDBF;
  --fdic-color-neutral-500: #9E9EA0;
  --fdic-color-neutral-700: #595961;
  --fdic-color-neutral-800: #424244;
  --fdic-color-neutral-850: #333335; /* private — checkbox/radio border */
  --fdic-color-neutral-900: #212123;
  --fdic-color-neutral-1000: #000000;

  /* Primary brand (blue) */
  --fdic-color-primary-050: #E6F4FA;
  --fdic-color-primary-200: #84DBFF;
  --fdic-color-primary-400: #38B6FF;
  --fdic-color-primary-500: #0D6191;
  --fdic-color-primary-700: #09496D;
  --fdic-color-primary-800: #073C5B;
  --fdic-color-primary-900: #003256;

  /* Secondary brand (gold) */
  --fdic-color-secondary-050: #F8EFDA;
  --fdic-color-secondary-300: #EBD49B;
  --fdic-color-secondary-400: #E1C16E;
  --fdic-color-secondary-500: #D9AF45;
  --fdic-color-secondary-600: #BD9327;
  --fdic-color-secondary-800: #88691C;
  --fdic-color-secondary-900: #60511B;

  /* Success (green) */
  --fdic-color-success-050: #E8F5E9;
  --fdic-color-success-200: #A5D6A7;
  --fdic-color-success-500: #4CAF50;
  --fdic-color-success-600: #388E3C;
  --fdic-color-success-800: #204520;
  --fdic-color-success-900: #1B3A1B;

  /* Warning (amber) */
  --fdic-color-warning-050: #FCF7EE;
  --fdic-color-warning-200: #FFCC80;
  --fdic-color-warning-500: #F49F00;
  --fdic-color-warning-600: #E68A00;
  --fdic-color-warning-800: #663D00;
  --fdic-color-warning-900: #4D2E00;

  /* Error (red) */
  --fdic-color-error-050: #FDEDEA;
  --fdic-color-error-200: #F5A3A3;
  --fdic-color-error-500: #B10B2D;
  --fdic-color-error-600: #D80E3A;
  --fdic-color-error-800: #442121;
  --fdic-color-error-900: #331919;

  /* Info (blue) */
  --fdic-color-info-050: #F1F8FE;
  --fdic-color-info-200: #90CAF9;
  --fdic-color-info-500: #0776CB;
  --fdic-color-info-600: #0568B3;
  --fdic-color-info-800: #1E3A5F;
  --fdic-color-info-900: #162D4A;

  /* Link */
  --fdic-color-link-default: #1278B0;
  --fdic-color-link-visited: #855AA5;
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
  --fdic-color-bg-base: var(--fdic-color-neutral-000);
  --fdic-color-bg-surface: var(--fdic-color-neutral-000);
  --fdic-color-bg-container: var(--fdic-color-neutral-100);
  --fdic-color-bg-overlay: var(--fdic-color-neutral-000);
  --fdic-color-bg-modal: var(--fdic-color-neutral-100);
  --fdic-color-bg-input: var(--fdic-color-neutral-000);
  --fdic-color-bg-interactive: var(--fdic-color-neutral-100);
  --fdic-color-bg-inverted: var(--fdic-color-neutral-900);
  --fdic-color-bg-brand: var(--fdic-color-primary-900);
  --fdic-color-bg-highlight: var(--fdic-color-primary-400);
  --fdic-color-bg-selected: var(--fdic-color-primary-050);
  --fdic-color-bg-active: var(--fdic-color-primary-500);
  --fdic-color-bg-hovered: rgba(0, 0, 0, 0.04);
  --fdic-color-bg-pressed: rgba(0, 0, 0, 0.08);
  --fdic-color-bg-destructive: var(--fdic-color-error-600);
  --fdic-color-bg-readonly: var(--fdic-color-neutral-100);

  /* Text */
  --fdic-color-text-primary: var(--fdic-color-neutral-900);
  --fdic-color-text-secondary: var(--fdic-color-neutral-700);
  --fdic-color-text-placeholder: var(--fdic-color-neutral-500);
  --fdic-color-text-disabled: var(--fdic-color-neutral-500);
  --fdic-color-text-inverted: var(--fdic-color-neutral-000);
  --fdic-color-text-brand: var(--fdic-color-primary-500);
  --fdic-color-text-warm: var(--fdic-color-secondary-900);
  --fdic-color-text-link: var(--fdic-color-link-default);
  --fdic-color-text-link-visited: var(--fdic-color-link-visited);
  --fdic-color-text-error: var(--fdic-color-error-600);
  --fdic-color-text-wordmark: var(--fdic-color-primary-900);

  /* Icon */
  --fdic-color-icon-primary: var(--fdic-color-neutral-800);
  --fdic-color-icon-secondary: var(--fdic-color-neutral-700);
  --fdic-color-icon-placeholder: var(--fdic-color-neutral-700);
  --fdic-color-icon-disabled: var(--fdic-color-neutral-400);
  --fdic-color-icon-inverted: var(--fdic-color-neutral-000);
  --fdic-color-icon-warm: var(--fdic-color-secondary-900);
  --fdic-color-icon-active: var(--fdic-color-link-default);
  --fdic-color-icon-link: var(--fdic-color-link-default);

  /* Border */
  --fdic-color-border-divider: var(--fdic-color-neutral-400);
  --fdic-color-border-image: var(--fdic-color-neutral-000);
  --fdic-color-border-input: var(--fdic-color-neutral-400);
  --fdic-color-border-input-hover: var(--fdic-color-neutral-500);
  --fdic-color-border-input-focus: var(--fdic-color-primary-400);
  --fdic-color-border-input-active: var(--fdic-color-neutral-800);
  --fdic-color-border-input-readonly: var(--fdic-color-neutral-200);
  --fdic-color-border-input-interactive: var(--fdic-color-neutral-150);
  --fdic-color-border-input-disabled: var(--fdic-color-neutral-300);

  /* Semantic status */
  --fdic-color-semantic-bg-success: var(--fdic-color-success-050);
  --fdic-color-semantic-bg-warning: var(--fdic-color-warning-050);
  --fdic-color-semantic-bg-error: var(--fdic-color-error-050);
  --fdic-color-semantic-bg-info: var(--fdic-color-info-050);
  --fdic-color-semantic-fg-success: var(--fdic-color-success-500);
  --fdic-color-semantic-fg-warning: var(--fdic-color-warning-500);
  --fdic-color-semantic-fg-error: var(--fdic-color-error-500);
  --fdic-color-semantic-fg-info: var(--fdic-color-info-500);
  --fdic-color-semantic-border-success: var(--fdic-color-success-500);
  --fdic-color-semantic-border-warning: var(--fdic-color-warning-500);
  --fdic-color-semantic-border-error: var(--fdic-color-error-500);
  --fdic-color-semantic-border-info: var(--fdic-color-info-500);

  /* Overlay */
  --fdic-color-overlay-hover: rgba(0, 0, 0, 0.04);
  --fdic-color-overlay-pressed: rgba(0, 0, 0, 0.08);
  --fdic-color-overlay-scrim: rgba(0, 0, 0, 0.48);

  /* Effect */
  --fdic-color-effect-shadow: rgba(0, 0, 0, 0.08);
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
    --fdic-color-bg-base: var(--fdic-color-neutral-1000);
    --fdic-color-bg-surface: var(--fdic-color-neutral-900);
    --fdic-color-bg-container: var(--fdic-color-neutral-900);
    --fdic-color-bg-overlay: var(--fdic-color-neutral-900);
    --fdic-color-bg-modal: var(--fdic-color-neutral-800);
    --fdic-color-bg-input: var(--fdic-color-neutral-900);
    --fdic-color-bg-interactive: var(--fdic-color-neutral-900);
    --fdic-color-bg-inverted: var(--fdic-color-neutral-100);
    --fdic-color-bg-brand: var(--fdic-color-primary-050);
    --fdic-color-bg-selected: var(--fdic-color-primary-900);
    --fdic-color-bg-active: var(--fdic-color-primary-200);
    --fdic-color-bg-hovered: rgba(255, 255, 255, 0.04);
    --fdic-color-bg-pressed: rgba(255, 255, 255, 0.08);
    --fdic-color-bg-readonly: var(--fdic-color-neutral-800);

    /* Text */
    --fdic-color-text-primary: var(--fdic-color-neutral-000);
    --fdic-color-text-secondary: var(--fdic-color-neutral-200);
    --fdic-color-text-inverted: var(--fdic-color-neutral-1000);
    --fdic-color-text-brand: var(--fdic-color-primary-200);
    --fdic-color-text-warm: var(--fdic-color-secondary-050);
    --fdic-color-text-link: #ADD8E6;
    --fdic-color-text-link-visited: #B19CD9;
    --fdic-color-text-error: #FFCCCC;
    --fdic-color-text-wordmark: var(--fdic-color-neutral-000);

    /* Icon */
    --fdic-color-icon-primary: var(--fdic-color-neutral-200);
    --fdic-color-icon-secondary: var(--fdic-color-neutral-400);
    --fdic-color-icon-placeholder: var(--fdic-color-neutral-500);
    --fdic-color-icon-disabled: var(--fdic-color-neutral-700);
    --fdic-color-icon-inverted: var(--fdic-color-neutral-1000);
    --fdic-color-icon-warm: var(--fdic-color-secondary-050);
    --fdic-color-icon-active: #ADD8E6;
    --fdic-color-icon-link: #ADD8E6;

    /* Border */
    --fdic-color-border-divider: var(--fdic-color-neutral-700);
    --fdic-color-border-input: var(--fdic-color-neutral-700);
    --fdic-color-border-input-hover: var(--fdic-color-neutral-500);
    --fdic-color-border-input-focus: var(--fdic-color-primary-500);
    --fdic-color-border-input-active: var(--fdic-color-neutral-200);
    --fdic-color-border-input-readonly: var(--fdic-color-neutral-400);
    --fdic-color-border-input-interactive: var(--fdic-color-neutral-850);
    --fdic-color-border-input-disabled: var(--fdic-color-neutral-500);

    /* Semantic status */
    --fdic-color-semantic-bg-success: var(--fdic-color-success-800);
    --fdic-color-semantic-bg-warning: var(--fdic-color-warning-800);
    --fdic-color-semantic-bg-error: var(--fdic-color-error-800);
    --fdic-color-semantic-bg-info: var(--fdic-color-info-800);
    --fdic-color-semantic-fg-success: #61D673;
    --fdic-color-semantic-fg-warning: #FFBF47;
    --fdic-color-semantic-fg-error: #F66F8B;
    --fdic-color-semantic-fg-info: #4EAFF9;
    --fdic-color-semantic-border-success: #61D673;
    --fdic-color-semantic-border-warning: #FFBF47;
    --fdic-color-semantic-border-error: #F66F8B;
    --fdic-color-semantic-border-info: #4EAFF9;

    /* Overlay */
    --fdic-color-overlay-hover: rgba(255, 255, 255, 0.04);
    --fdic-color-overlay-pressed: rgba(255, 255, 255, 0.08);

    /* Effect */
    --fdic-color-effect-shadow: rgba(0, 0, 0, 0);
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

Replace the hardcoded hex values with `var()` references to the new `--fdic-*` tokens. Also add `--fdic-docs-surface-strong` mapping.

```css
:root {
  --fdic-docs-ink: var(--fdic-color-text-primary);
  --fdic-docs-muted: var(--fdic-color-text-secondary);
  --fdic-docs-border: var(--fdic-color-border-divider);
  --fdic-docs-surface: var(--fdic-color-bg-container);
  --fdic-docs-surface-strong: var(--fdic-color-bg-surface);
  --fdic-docs-brand: var(--fdic-color-text-brand);
  --fdic-docs-accent: var(--fdic-color-text-warm);
  --fdic-docs-success: var(--fdic-color-semantic-fg-success);
  --fdic-docs-warning: var(--fdic-color-semantic-fg-warning);
  --fdic-docs-danger: var(--fdic-color-semantic-fg-error);
}
```

**Step 3: Start dev server and visually verify**

Run: `npm run dev:docs`

Open the site in browser. Verify the foundations pages still render with correct colors. The visual appearance will shift slightly since the hex values are changing from the ad-hoc Codex values to the Figma-aligned values.

**Step 4: Commit**

```bash
git add apps/docs/.vitepress/theme/index.ts apps/docs/.vitepress/theme/custom.css
git commit -m "refactor: wire doc site CSS to --fdic-color-* tokens"
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

**Neutral ramp** — show all 10 public steps (000 through 1000) with correct hex values from the design doc. Use `--fdic-color-neutral-[step]` labels. Reverse the display order so it goes light-to-dark (000 first, 1000 last).

**Primary brand ramp** — show all 7 steps (050, 200, 400, 500, 700, 800, 900) with correct hex values. Use `--fdic-color-primary-[step]` labels.

**Secondary brand ramp** — show all 7 steps (050, 300, 400, 500, 600, 800, 900) with correct hex values. Use `--fdic-color-secondary-[step]` labels.

Remove the line about "If an accent palette is introduced later."

**Step 3: Update the naming model examples**

Replace the old draft naming examples:
```
- palette: --fdic-color-neutral-300
- role: --fdic-color-text-primary
- semantic: --fdic-color-semantic-bg-error
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

Update the four role cards (Background, Text, Border, Icon) to use the new `--fdic-color-*` token names:
- Background examples: `--fdic-color-bg-base`, `--fdic-color-bg-container`, `--fdic-color-bg-brand`
- Text demo: use correct hex values — Primary `#212123`, Secondary `#595961`, Brand `#0D6191`
- Border chips: `default` → `divider`, keep `input`
- Icon chips: `primary`, `secondary`, keep `brand` chip with updated tone

**Step 2: Update the role token family list**

Replace the old `color.background.*` notation with `--fdic-color-bg-*`, `--fdic-color-text-*`, etc.

**Step 3: Commit**

```bash
git add apps/docs/guide/foundations/colors.md
git commit -m "docs: update role token section with --fdic-color-* naming"
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

Replace old `color.semantic.background.success` notation with `--fdic-color-semantic-bg-success`, `--fdic-color-semantic-fg-success`, and add the border variants `--fdic-color-semantic-border-success`.

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

Update `<code>` labels from `colors.default` / `colors.dark` to the `--fdic-color-*` convention.

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

Remove "final CSS variable names" since we now have the `--fdic-color-*` convention. Keep the remaining caveats about dark-mode activation strategy and component tokens.

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
