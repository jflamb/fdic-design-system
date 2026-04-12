# Reverse Token Prefix: `--fdic-*` → `--fdic-*` Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `--fdic-*` the canonical system token prefix, reverse the alias direction so `--fdic-*` becomes the deprecated compatibility layer, and align the entire repo before 0.2.0.

**Architecture:** The token generator (`scripts/tokens/generate-dtcg.mjs`) reads source data from `scripts/tokens/source.mjs` and produces `packages/tokens/styles.css`, `interaction.css`, `semantic.css`, and `fdic.tokens.json`. The generator controls all CSS custom property names. Changing the generator output, then mechanically replacing `--fdic-` with `--fdic-` across component source, docs CSS, tests, metadata, Storybook, and documentation completes the migration. `--fdic-*` aliases are emitted by the generator for backward compatibility. Component-scoped `--fd-*` overrides and docs-local `--fdic-docs-*` variables are NOT touched.

**Tech Stack:** Vanilla CSS custom properties, Lit/TypeScript web components, VitePress docs, Storybook, npm workspaces monorepo.

**Scope numbers:**
- Token generator: ~34 `--fdic-` refs in `generate-dtcg.mjs`, ~30 in `source.mjs`
- Token CSS: `styles.css` (generated), `interaction.css` (generated), 4 `@property` registrations
- Component source: ~863 `var(--fdic-` refs across ~45 `.ts` files
- Component tests: ~70 `--fdic-` refs in `.test.ts` files
- `runtime.ts`: 2 refs
- Docs CSS: ~272 `var(--fdic-` refs across theme CSS files (excluding `--fdic-docs-*`)
- Docs theme `tokens.css`: 12 refs
- Docs markdown: ~322 `--fdic-` refs
- Root docs/architecture markdown: ~454 `--fdic-` refs
- `api-metadata.json`: ~120 `--fdic-` refs
- Storybook: ~87 `--fdic-` refs
- AGENT_GUIDE: 1 ref

**What does NOT change:**
- `--fd-*` component override properties (593 refs) — these stay component-scoped
- `--fdic-docs-*` variables (248 refs) — these are docs-theme-local, already correct
- `--fdic-docs-callout-*` variables — already correctly namespaced

---

### Task 1: Reverse the token generator

The generator is the source of truth. All generated CSS flows from here.

**Files:**
- Modify: `scripts/tokens/generate-dtcg.mjs`
- Modify: `scripts/tokens/source.mjs` (CSS variable refs in layout values)

**Step 1: Update `generate-dtcg.mjs` output prefixes**

The generator currently emits `--fdic-color-*`, `--fdic-spacing-*`, `--fdic-corner-radius-*`, `--fdic-layout-*`, `--fdic-shadow-*`, `--fdic-gradient-*`, `--fdic-font-*`, `--fdic-line-height-*`, `--fdic-letter-spacing-*`, `--fdic-font-weight-*`, `--fdic-heading-padding-*` as canonical, with `--fdic-*` aliases for typography.

Reverse this:
- All system token CSS custom property names become `--fdic-*` (e.g., `--fdic-color-text-primary`, `--fdic-spacing-md`, `--fdic-font-size-body`).
- The deprecated alias block becomes `--fdic-*` → `var(--fdic-*)`.
- The alias comment block reverses: "Deprecated aliases (--fdic-* → --fdic-*)"
- The header comment references `--fdic-*` as canonical.

Key function changes:
- `coreCssVariableName()`: return `--fdic-color-*` instead of `--fdic-color-*`
- `semanticVariableName()` callers: prefix with `--fdic-color-` instead of `--fdic-color-`
- Effect/shadow output: `--fdic-shadow-*`, `--fdic-gradient-*`
- Spacing: `--fdic-spacing-*`
- Corner radius: `--fdic-corner-radius-*`
- Layout: `--fdic-layout-*`
- `@property` registrations: `--fdic-color-bg-hovered`, etc.
- Interaction CSS: `--fdic-focus-*`, `--fdic-motion-*`

The typography tokens were already `--fdic-*` originally, then became `--fdic-*` canonical + `--fdic-*` alias. Now they become `--fdic-*` canonical again (no alias needed for typography since the name didn't change).

For all OTHER token families (color, spacing, radius, layout, shadow, gradient, overlay, effect, interaction), emit:
1. Canonical `--fdic-*` declaration
2. Deprecated `--fdic-*` alias: `--fdic-TOKEN: var(--fdic-TOKEN);`

**Step 2: Update `source.mjs` layout values that reference CSS variables**

`source.mjs` contains layout values like `calc(var(--fdic-layout-max-width) - 2 * var(--fdic-layout-gutter))`. These become `var(--fdic-layout-max-width)` etc.

**Step 3: Update `renderInteractionCss()`**

Interaction token names become `--fdic-focus-*` and `--fdic-motion-*`.

**Step 4: Regenerate token artifacts**

Run: `npm run build:tokens`

Expected: All 4 generated files regenerated with `--fdic-*` canonical names.

**Step 5: Verify token validation**

Run: `npm run validate:tokens`

Expected: "Token artifacts are up to date. Package surfaces are internally consistent."

**Step 6: Commit**

```
git add scripts/tokens/ packages/tokens/
git commit -m "refactor(tokens): reverse prefix direction — --fdic-* canonical, --fdic-* aliases"
```

---

### Task 2: Migrate component source (`packages/components/src/`)

~863 `var(--fdic-` refs + ~70 in tests + 2 in `runtime.ts`.

**Files:**
- Modify: All `.ts` files in `packages/components/src/` (except generated files)

**Step 1: Mechanical replacement in component source**

Replace across all `.ts` files in `packages/components/src/components/` and `packages/components/src/`:

```
var(--fdic-color-     →  var(--fdic-color-
var(--fdic-spacing-   →  var(--fdic-spacing-
var(--fdic-corner-    →  var(--fdic-corner-
var(--fdic-layout-    →  var(--fdic-layout-
var(--fdic-shadow-    →  var(--fdic-shadow-
var(--fdic-gradient-  →  var(--fdic-gradient-
var(--fdic-font-      →  var(--fdic-font-
var(--fdic-line-      →  var(--fdic-line-
var(--fdic-letter-    →  var(--fdic-letter-
var(--fdic-heading-   →  var(--fdic-heading-
var(--fdic-font-weight- → var(--fdic-font-weight-
```

**IMPORTANT:** Do NOT touch `--fd-*` component overrides (e.g., `--fd-button-bg`). These are component-scoped and stay as-is. The replacement targets `--fdic-` specifically, which has no overlap with `--fd-` (no trailing hyphen collision).

Also replace bare property references (not inside `var()`):
```
--fdic-color-     →  --fdic-color-
--fdic-spacing-   →  --fdic-spacing-
(etc.)
```

These appear in `@property` references, comments, and runtime token checks.

**Step 2: Update `runtime.ts`**

The `REQUIRED_RUNTIME_TOKENS` array has `"--fdic-color-text-primary"` and `"--fdic-spacing-md"`. These become `"--fdic-color-text-primary"` and `"--fdic-spacing-md"`. The third entry `"--fdic-font-size-body"` is already correct.

**Step 3: Run component tests**

Run: `npm run test:components`

Expected: 48 files, 1048 tests, all passing. The `semantic-tokens.test.ts` file checks for specific token names in the generated CSS — these should now match the new `--fdic-*` canonical output.

**Step 4: Run component build**

Run: `npm run build:components`

Expected: Clean build, 0 warnings.

**Step 5: Commit**

```
git add packages/components/
git commit -m "refactor(components): migrate --fdic-* token refs to canonical --fdic-*"
```

---

### Task 3: Migrate docs CSS and theme

~272 `var(--fdic-` refs in theme CSS + 12 in `tokens.css`.

**Files:**
- Modify: `apps/docs/.vitepress/theme/prose.css`
- Modify: `apps/docs/.vitepress/theme/custom.css`
- Modify: `apps/docs/.vitepress/theme/tokens.css`
- Modify: `apps/docs/.vitepress/theme/docs-utilities.css`
- Modify: `apps/docs/.vitepress/theme/accessibility.css`

**Step 1: Mechanical replacement**

Same `--fdic-` → `--fdic-` pattern as Task 2, across all `.css` files in `apps/docs/.vitepress/theme/`.

**IMPORTANT:** Do NOT touch `--fdic-docs-*` variables. These are docs-local and already correctly namespaced. The replacement targets `--fdic-` which has no overlap.

**Step 2: Verify docs build**

Run: `npm run build:docs`

Expected: Build succeeds.

**Step 3: Commit**

```
git add apps/docs/.vitepress/theme/
git commit -m "refactor(docs): migrate --fdic-* token refs to canonical --fdic-*"
```

---

### Task 4: Migrate `api-metadata.json`

~120 `--fdic-` refs in the API metadata that drives generated docs tables and Storybook arg types.

**Files:**
- Modify: `scripts/components/api-metadata.json`

**Step 1: Mechanical replacement**

Same `--fdic-` → `--fdic-` pattern. This file contains property default descriptions like `var(--fdic-color-text-primary)` which become `var(--fdic-color-text-primary)`.

Also contains ~77 existing `--fdic-` refs that are already correct (these are the `--fdic-font-*` etc. that were never migrated in metadata). After this step, all token refs in metadata should be `--fdic-*`.

**Step 2: Run sync to propagate metadata to generated files**

Run: `npm run sync:components`

This regenerates docs API tables and Storybook arg types from the updated metadata.

**Step 3: Validate**

Run: `npm run validate:components`

Expected: "Component validation passed."

**Step 4: Commit**

```
git add scripts/components/api-metadata.json apps/docs/ apps/storybook/src/generated/ packages/components/src/index.ts
git commit -m "refactor(metadata): migrate --fdic-* token refs to canonical --fdic-*"
```

(Include any generated files that `sync:components` updated.)

---

### Task 5: Migrate Storybook stories

~87 `--fdic-` refs in story files and Storybook config.

**Files:**
- Modify: All `.ts` files in `apps/storybook/src/`
- Modify: `apps/storybook/.storybook/preview.ts` (if it references `--fdic-*`)
- Modify: `apps/storybook/.storybook/main.ts` (if it references `--fdic-*`)

**Step 1: Mechanical replacement**

Same `--fdic-` → `--fdic-` pattern across all Storybook `.ts` files.

**Step 2: Run Storybook tests**

Run: `npm run test:storybook`

Expected: 50 files, 317 tests, all passing.

**Step 3: Commit**

```
git add apps/storybook/
git commit -m "refactor(storybook): migrate --fdic-* token refs to canonical --fdic-*"
```

---

### Task 6: Migrate documentation markdown

~322 refs in `apps/docs/` markdown + ~454 in `docs/` architecture/ADR markdown.

**Files:**
- Modify: All `.md` files in `apps/docs/` (guide pages, component docs, foundations)
- Modify: All `.md` files in `docs/` (ADRs, architecture docs)
- Modify: `.context/AGENT_GUIDE.md` (1 ref)

**Step 1: Mechanical replacement in docs markdown**

Same `--fdic-` → `--fdic-` pattern. These appear in code examples, token reference tables, and guidance prose.

**IMPORTANT:** Some markdown files contain generated content between `<!-- GENERATED_COMPONENT_API:START -->` and `<!-- GENERATED_COMPONENT_API:END -->` markers. These will be overwritten by `sync:components` anyway (which was already run in Task 4). Replacing in these sections is harmless but unnecessary — the sync will produce the correct content.

**Step 2: Update AGENT_GUIDE**

The single `--fdic-*` ref in `.context/AGENT_GUIDE.md` should become `--fdic-*`.

**Step 3: Update `token-prefix-unification.md`**

This doc now needs to reflect the reversed direction. The narrative should state that `--fdic-*` is canonical and `--fdic-*` is the deprecated alias layer. Phases A and B are complete in the new direction. Discussion #184 should be updated in a comment noting the reversal.

**Step 4: Update CHANGELOG**

Add to `[Unreleased]`:
- **Changed**: "Reversed token prefix direction: `--fdic-*` is now the canonical system token namespace. `--fdic-*` tokens are preserved as deprecated aliases for backward compatibility. This aligns with government design system naming conventions and avoids namespace collisions with other `--fdic-*` systems."

**Step 5: Commit**

```
git add apps/docs/ docs/ .context/AGENT_GUIDE.md CHANGELOG.md
git commit -m "docs: align all documentation with --fdic-* canonical token prefix"
```

---

### Task 7: Final validation and Discussion update

**Step 1: Run full validation suite**

```
npm run validate:components
npm run validate:tokens
npm run validate:packages
npm run test:components
npm run test:storybook
npm run build
```

All must pass.

**Step 2: Verify zero `--fdic-` canonical declarations remain**

```bash
# In generated token CSS, --fdic-* should only appear as aliases (var(--fdic-*))
grep "^  --fdic-" packages/tokens/styles.css | grep -v "var(--fdic-" | wc -l
# Expected: 0

# In component source, zero --fdic- refs
grep -r "var(--fdic-" packages/components/src/ --include="*.ts" | wc -l
# Expected: 0

# In docs CSS, zero --fdic- refs
grep -r "\-\-ds-" apps/docs/.vitepress/theme/ --include="*.css" | wc -l
# Expected: 0
```

**Step 3: Update Discussion #184**

Post a comment on [Discussion #184](https://github.com/jflamb/fdic-design-system/discussions/184) noting:
- The prefix direction has been reversed: `--fdic-*` is now canonical, `--fdic-*` is the deprecated alias layer.
- Rationale: alignment with government design system naming conventions, namespace collision avoidance, consistency with the `--fd-*` component prefix.
- `--fdic-*` aliases remain in `packages/tokens/` for backward compatibility and will be removed in a future major version.

Run: `gh api repos/jflamb/fdic-design-system/discussions/184/comments -f body="..."`

**Step 4: Commit any remaining changes**

```
git add -A
git commit -m "chore: final validation after token prefix reversal"
```

**Step 5: Push**

```
git push
```

---

## Verification Checklist

After all tasks, confirm:

- [ ] `packages/tokens/styles.css`: all canonical declarations use `--fdic-*`
- [ ] `packages/tokens/styles.css`: `--fdic-*` appears only as `--fdic-TOKEN: var(--fdic-TOKEN)` aliases
- [ ] `packages/tokens/interaction.css`: all tokens use `--fdic-*`
- [ ] `packages/components/src/`: zero `var(--fdic-` references
- [ ] `apps/docs/.vitepress/theme/`: zero `--fdic-` references
- [ ] `apps/storybook/`: zero `--fdic-` references
- [ ] `scripts/components/api-metadata.json`: zero `--fdic-` references
- [ ] `apps/docs/**/*.md`: zero `--fdic-` references (except in historical context)
- [ ] `docs/**/*.md`: zero `--fdic-` references (except in historical context)
- [ ] `--fd-*` component overrides: unchanged (593 refs)
- [ ] `--fdic-docs-*` variables: unchanged (248 refs)
- [ ] `npm run validate:components`: passes
- [ ] `npm run validate:tokens`: passes
- [ ] `npm run test:components`: 1048 tests passing
- [ ] `npm run test:storybook`: 317 tests passing
- [ ] `npm run build`: succeeds
