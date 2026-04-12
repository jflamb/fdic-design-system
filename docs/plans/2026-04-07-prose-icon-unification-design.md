# Prose Icon Unification — Design

> **Date:** 2026-04-07
> **Scope:** Replace inline SVG data URIs in prose.css with build-time generated mask-image variables sourced from the Phosphor icon registry
> **Approach:** Approach A — build-time generated CSS custom properties

## Background

The prose component uses 16 inline SVG data URIs in `prose.css` — 8 unique Phosphor icons, each duplicated with different `fill` colors for light and dark mode. This creates a maintenance burden: each color variant is a full copy of the SVG, and adding dark mode required duplicating the entire block.

The component layer already has a Phosphor icon registry (`packages/components/src/icons/phosphor-regular.ts`) that stores SVG path data centrally with `fill="currentColor"`. But prose CSS cannot access the JS registry at runtime.

## Decision

Use `mask-image` with build-time generated CSS custom properties. The icon registry is the canonical source of truth for shape geometry. Prose CSS consumes derived mask assets and controls color via `background-color` driven by design system tokens.

This eliminates per-color SVG duplication and makes dark mode automatic — `background-color` follows the `light-dark()` tokens already in place.

## Architecture

```
packages/components/src/icons/phosphor-data.mjs  (shared icon source — plain JS)
        ↓                           ↓
phosphor-regular.ts              scripts/icons/generate-icon-masks.mjs
(runtime registry)               (build-time generator)
                                    ↓
                    apps/docs/.vitepress/theme/generated/icon-masks.css
                                    ↓ (@import in theme)
                    prose.css (mask-image + background-color)
```

### Shared icon source module

A new file `packages/components/src/icons/phosphor-data.mjs` exports the raw icon SVG map as plain JavaScript. No TypeScript, no side effects, no registry coupling.

```js
// packages/components/src/icons/phosphor-data.mjs
export const phosphorRegularIcons = {
  "caret-down": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,101.66l-80,80a8..."/></svg>',
  "info": '<svg .../>',
  // ... all icons
};
```

Both consumers import from this module:
- `phosphor-regular.ts` imports the map and calls `iconRegistry.register(phosphorRegularIcons)`
- `generate-icon-masks.mjs` imports the map directly — no build step required, no stale-artifact risk

### Why not import from `dist/`

If `phosphor-regular.ts` changes and `build:components` has not run, a `dist/`-based generator would silently emit outdated masks. The shared `.mjs` source module eliminates this edge entirely — both the runtime registry and the generator always read the same source.

## Icons to add to the registry

Two Phosphor Regular icons used by prose are missing from the registry:

| Icon | Phosphor name | Used by |
|------|--------------|---------|
| Lightbulb | `lightbulb` | Default callout icon |
| CheckCircle | `check-circle` | Success callout icon |

These get added to `phosphor-data.mjs` and are then available to both the registry and the generator.

## Generated output

`scripts/icons/generate-icon-masks.mjs` produces `apps/docs/.vitepress/theme/generated/icon-masks.css`:

```css
/*
 * Auto-generated icon masks — do not edit manually.
 * Source: packages/components/src/icons/phosphor-data.mjs
 * Run: npm run generate:icon-masks
 */
:root {
  --fd-icon-mask-caret-down: url("data:image/svg+xml,...");
  --fd-icon-mask-lightbulb: url("data:image/svg+xml,...");
  --fd-icon-mask-info: url("data:image/svg+xml,...");
  --fd-icon-mask-warning: url("data:image/svg+xml,...");
  --fd-icon-mask-check-circle: url("data:image/svg+xml,...");
  --fd-icon-mask-warning-octagon: url("data:image/svg+xml,...");
  --fd-icon-mask-arrow-square-out: url("data:image/svg+xml,...");
}
```

The generator:
1. Imports the icon map from `phosphor-data.mjs`
2. For each icon prose needs, reads the SVG string
3. Strips `fill="currentColor"` (mask-safe — shape only)
4. URL-encodes to a data URI
5. Writes the CSS file with a generation header

The generated file is committed to git (not `.gitignore`d) so the docs theme works during development without running a build step.

## Prose CSS changes

### Callout icons

Replace `background-image` data URIs with `mask-image` + `background-color`:

```css
/* Shared mask properties on the base icon class */
.prose-callout-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px;
  -webkit-mask-size: 20px 20px;
  mask-size: 20px 20px;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-image: var(--fd-icon-mask-lightbulb);
  mask-image: var(--fd-icon-mask-lightbulb);
  background-color: var(--fdic-color-text-secondary, #595961);
}

/* Each variant sets only mask + color */
.prose-callout-info .prose-callout-icon {
  -webkit-mask-image: var(--fd-icon-mask-info);
  mask-image: var(--fd-icon-mask-info);
  background-color: var(--fdic-color-semantic-fg-info, #1278b0);
}

.prose-callout-warning .prose-callout-icon {
  -webkit-mask-image: var(--fd-icon-mask-warning);
  mask-image: var(--fd-icon-mask-warning);
  background-color: var(--fdic-color-semantic-fg-warning, #b48c14);
}

.prose-callout-success .prose-callout-icon {
  -webkit-mask-image: var(--fd-icon-mask-check-circle);
  mask-image: var(--fd-icon-mask-check-circle);
  background-color: var(--fdic-color-semantic-fg-success, #1e8232);
}

.prose-callout-danger .prose-callout-icon {
  -webkit-mask-image: var(--fd-icon-mask-warning-octagon);
  mask-image: var(--fd-icon-mask-warning-octagon);
  background-color: var(--fdic-color-semantic-fg-error, #be2828);
}
```

### Details chevron

```css
.prose summary::after {
  /* ... existing sizing/transition ... */
  -webkit-mask-image: var(--fd-icon-mask-caret-down);
  mask-image: var(--fd-icon-mask-caret-down);
  -webkit-mask-size: 18px 18px;
  mask-size: 18px 18px;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  background-color: var(--fdic-color-text-primary, #212123);
  background-image: none;
}
```

### External link icon

```css
.prose a[href^="http"]:not([href*="fdic.gov"]) {
  --_ext-size: 0.9em;
  --_ext-top: 0.3em;
  padding-right: calc(var(--_ext-size) + 0.2em);
  -webkit-mask-image: var(--fd-icon-mask-arrow-square-out);
  mask-image: var(--fd-icon-mask-arrow-square-out);
  -webkit-mask-position: right 0 top var(--_ext-top);
  mask-position: right 0 top var(--_ext-top);
  -webkit-mask-size: var(--_ext-size) var(--_ext-size);
  mask-size: var(--_ext-size) var(--_ext-size);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  background-color: var(--fdic-color-text-link, #1278b0);
  background-image: none;
}

.prose a[href^="http"]:not([href*="fdic.gov"]):visited {
  background-color: var(--fdic-color-text-link-visited, #855AA5);
}
```

### Token mapping summary

| Element | Mask variable | background-color token |
|---------|--------------|----------------------|
| `summary::after` | `--fd-icon-mask-caret-down` | `--fdic-color-text-primary` |
| `.prose-callout-icon` (default) | `--fd-icon-mask-lightbulb` | `--fdic-color-text-secondary` |
| `.prose-callout-info` icon | `--fd-icon-mask-info` | `--fdic-color-semantic-fg-info` |
| `.prose-callout-warning` icon | `--fd-icon-mask-warning` | `--fdic-color-semantic-fg-warning` |
| `.prose-callout-success` icon | `--fd-icon-mask-check-circle` | `--fdic-color-semantic-fg-success` |
| `.prose-callout-danger` icon | `--fd-icon-mask-warning-octagon` | `--fdic-color-semantic-fg-error` |
| External link | `--fd-icon-mask-arrow-square-out` | `--fdic-color-text-link` |
| External link (visited) | `--fd-icon-mask-arrow-square-out` | `--fdic-color-text-link-visited` |

## What gets deleted from prose.css

- All 16 inline SVG `background-image` data URIs
- The entire `.dark` SVG icon override block (lines ~1651-1687)
- The `--_ext-icon` and `--_ext-icon-visited` custom properties

**Net: ~80 lines of duplicated SVGs removed, replaced by ~30 lines of mask-image rules + 1 generated file.**

## Build integration

- Add `"generate:icon-masks": "node scripts/icons/generate-icon-masks.mjs"` to root `package.json`
- Add `"validate:icon-masks"` script that regenerates to a temp file and diffs against the committed version — fails if they diverge (same pattern as `validate:components`)
- Wire `generate:icon-masks` after `build:components` in the `build` script chain
- The generated file is committed to git so docs development works without a build step

## Forced-colors verification (required)

The design assumes `mask-image` + `background-color` works correctly under `forced-colors: active`. This must be verified, not assumed.

**Verification items:**
1. Callout icons: Does `forced-color-adjust: none` on `.prose-callout-icon` preserve the authored `background-color` through the mask, or does forced-colors override it?
2. Summary chevron: Does `forced-color-adjust: none` on `summary::after` work the same with `mask-image` as it did with `background-image`?
3. External link icon: Does the mask approach work on the inline `<a>` element with `mask-position` offset?

**If forced-colors overrides `background-color` despite `forced-color-adjust: none`:**
- Fallback: add explicit system color overrides in the `@media (forced-colors: active)` block, e.g., `background-color: LinkText` for link-colored icons, `background-color: ButtonText` for neutral icons.

This is a verification task during implementation, not an assumption locked into the design.

## Browser support

`mask-image` with `-webkit-` prefix covers all browsers this design system targets. Safari added unprefixed support in 15.4 (March 2022). The `-webkit-` prefix provides coverage back to Safari 4.
