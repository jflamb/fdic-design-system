# Button & Icon Component Design

> **Date:** 2026-03-22
> **Status:** Approved
> **Figma source:** [Button frame (335:560)](https://www.figma.com/design/wChlOTxm7XKQSE8VVrwpox/FDIC-Design-System?node-id=335-560)

## Summary

Two new Web Components for the FDIC Design System:

- **`<fd-icon>`** — renders a named icon from a registry as inline SVG
- **`<fd-button>`** — a styled action button with icon slots, variant styling, and link rendering support

These are the first interactive components in the system. They are designed to compose together (`<fd-icon>` as default slot content in `<fd-button>`) while remaining independently useful.

## Problem / User Need

FDIC digital products need a consistent, accessible button component that:

- Communicates action hierarchy (primary through destructive)
- Meets Section 508 and WCAG 2.2 AA requirements
- Works in government/financial contexts where trust, clarity, and error prevention matter
- Supports both action buttons and link-styled-as-button navigation
- Provides a consistent icon rendering pattern across the design system

## Decision: Web Component vs. Native HTML

**Decision: Web Component.**

Buttons benefit from encapsulated styling (variants, states, focus ring), icon slot composition, and link/button rendering logic. A CSS-only pattern would require consumers to replicate variant classes, ARIA patterns, and icon layout manually. The Web Component encapsulates these decisions while rendering native `<button>` or `<a>` elements internally.

---

## `<fd-icon>` Component

### Purpose

Render a named icon from a global registry as inline SVG. Decorative by default; opt-in accessible labeling for semantic icons.

### API

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | `''` | Registry key for the icon |
| `label` | `string` | `''` | When set, renders `role="img" aria-label="..."`. When empty, renders `aria-hidden="true"`. |

### Size

Size is CSS-first via custom property:

```css
:host {
  inline-size: var(--fd-icon-size, 18px);
  block-size: var(--fd-icon-size, 18px);
}
```

Default matches the Figma glyph size (18px). Override with `--fd-icon-size` on the host or an ancestor.

### Shadow Parts

| Part | Element | Purpose |
|------|---------|---------|
| `svg` | The `<svg>` element | Direct styling access when needed |

### Rendering

- Shadow DOM with inline SVG
- SVG uses `currentColor` for `fill` — inherits text color from parent
- Host: `display: inline-flex; align-items: center; justify-content: center`

### Icon Registry

**Static methods:**

- `FdIcon.register(name: string, svg: string)` — register a single icon
- `FdIcon.register(icons: Record<string, string>)` — batch register

**Trust model:** `register()` accepts raw SVG strings. This is a **trusted-input API**. Only register SVG content you control. The component applies basic sanitization (strip `<script>`, event handler attributes) as defense-in-depth, but this is not a full untrusted-content pipeline. Document this clearly.

**Registry module:** The registry lives in `icons/registry.ts` as a separate module. Both `fd-icon.ts` and the built-in icon set depend on it. This keeps the component file smaller and makes registration independently testable.

### Missing Icon Behavior

When `name` doesn't match a registered icon:

- Render nothing (empty host)
- Log a `console.warn` in development: `[fd-icon] Unknown icon name: "${name}"`

### Built-in Icons

A curated Phosphor Regular (weight 400) subset ships pre-registered:

`star`, `caret-down`, `caret-up`, `caret-right`, `caret-left`, `plus`, `minus`, `x`, `check`, `info`, `warning`, `warning-octagon`, `arrow-square-out`, `download`, `upload`, `trash`, `pencil`, `eye`, `eye-slash`, `magnifying-glass`

These cover the Figma button frame icons and common FDIC UI patterns. Apps can register additional icons via `FdIcon.register()`.

### Example

```html
<!-- Decorative (default) -->
<fd-icon name="star"></fd-icon>

<!-- Semantic -->
<fd-icon name="warning" label="Warning"></fd-icon>

<!-- Custom registration -->
<script type="module">
  import { FdIcon } from '@fdic-ds/components';
  FdIcon.register('custom-logo', '<svg viewBox="0 0 256 256">...</svg>');
</script>
<fd-icon name="custom-logo" label="Agency logo"></fd-icon>
```

---

## `<fd-button>` Component

### Purpose

A styled button for actions. Wraps a native `<button>` or `<a>` in Shadow DOM with icon slots and variant/state styling.

### Variants (from Figma)

| Variant | Background | Text Color | Font Weight | Use Case |
|---------|-----------|------------|-------------|----------|
| `primary` | brand blue (#0d6191) | white | 600 | Main page action — Save, Submit, Download |
| `neutral` | interactive bg (#f5f5f7) | primary (#212123) | 400 | Secondary actions — Save draft, Learn more |
| `subtle` | transparent | primary (#212123) | 400 | Minimal visual weight — toggles, minor tasks |
| `outline` | white + 2px brand border | link blue (#1278b0) | 400 | Secondary alternative to primary |
| `destructive` | red (#d80e3a) | white | 600 | Irreversible actions — Delete, Remove |

### States (all variants, CSS-only)

| State | Treatment |
|-------|-----------|
| Default | Base variant styling |
| Hover | Inset box-shadow overlay at 4% black |
| Active | Inset box-shadow overlay at 8% black |
| Focus-visible | 2px white gap + 2px #38b6ff ring |
| Disabled | Container bg, disabled text, interaction blocked |

### API

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `'primary' \| 'neutral' \| 'subtle' \| 'outline' \| 'destructive'` | `'primary'` | Visual treatment |
| `disabled` | `boolean` | `false` | Disables the control |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type. Ignored when `href` is set. |
| `href` | `string` | `undefined` | When set, renders as `<a>` instead of `<button>` |
| `target` | `string` | `undefined` | Link target (only when `href` is set) |
| `rel` | `string` | `undefined` | Link rel (only when `href` is set) |

### Slots

| Slot | Purpose |
|------|---------|
| (default) | Button label text |
| `icon-start` | Leading icon. Recommended: `<fd-icon>` |
| `icon-end` | Trailing icon. Recommended: `<fd-icon>` |

### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--fd-button-height` | `44px` | Button height |
| `--fd-button-min-width` | `44px` | Minimum width |
| `--fd-button-radius` | `var(--fdic-corner-radius-sm, 3px)` | Corner radius |
| `--fd-button-font-size` | `var(--fdic-font-size-body, 18px)` | Label font size |
| `--fd-button-gap` | `var(--fdic-spacing-2xs, 4px)` | Gap between icon and label slots |

### Shadow Parts

| Part | Element | Purpose |
|------|---------|---------|
| `base` | The `<button>` or `<a>` | Full control over the interactive element |
| `label` | `<span>` wrapping default slot | Label-specific styling |

### Button vs. Link Rendering

- **No `href`** → renders `<button type="${this.type}">`
- **Has `href`** → renders `<a href="...">`. No `role="button"`. Link semantics preserved for screen readers, keyboard behavior, and user expectations. Styling it like a button is visual only.
- **`type` is ignored** when `href` is present.

### Disabled Behavior

**Button (`<button>`):**
- Native `disabled` attribute on the internal `<button>`
- Removed from tab order automatically
- Announced as disabled by screen readers

**Link (`<a>`):**
- `href` removed from the `<a>` element
- `aria-disabled="true"` added
- `tabindex="-1"` added
- Click suppressed in JS event handler (programmatic safety)
- The real disabled behavior comes from removing `href` and `aria-disabled`; click suppression is defense-in-depth

### Icon-Only Pattern

When a button has no visible label (only a slotted icon):

- The accessible name comes from `aria-label` on `<fd-button>`, not the icon
- The slotted icon should use `aria-hidden="true"` (the `<fd-icon>` default)
- Padding adjusts for visual centering (CSS handles this internally based on slot presence)

```html
<fd-button variant="subtle" aria-label="Close">
  <fd-icon slot="icon-start" name="x"></fd-icon>
</fd-button>
```

### Form Submission Limitation (v1)

The native `<button>` inside Shadow DOM does not submit forms across shadow boundaries. This is a known platform limitation. Form association via `ElementInternals` is a planned follow-up. Document this explicitly in `button.md`.

### Example Usage

```html
<!-- Primary with icons -->
<fd-button variant="primary">
  <fd-icon slot="icon-start" name="download"></fd-icon>
  Download report
  <fd-icon slot="icon-end" name="caret-down"></fd-icon>
</fd-button>

<!-- Destructive -->
<fd-button variant="destructive">Delete account</fd-button>

<!-- Link styled as button -->
<fd-button variant="outline" href="/learn-more">Learn more</fd-button>

<!-- Disabled link -->
<fd-button variant="outline" href="/unavailable" disabled>Not available</fd-button>

<!-- Icon-only -->
<fd-button variant="subtle" aria-label="Close">
  <fd-icon slot="icon-start" name="x"></fd-icon>
</fd-button>

<!-- External link (manual icon, not auto-inserted) -->
<fd-button variant="outline" href="https://example.gov" target="_blank" rel="noopener">
  Visit site
  <fd-icon slot="icon-end" name="arrow-square-out"></fd-icon>
</fd-button>
```

---

## Component Token Mapping

Component tokens are scoped to Shadow DOM stylesheets. They map to semantic tokens first; hardcoded values are fallback examples only.

| Component Token | Semantic Token | Fallback |
|-----------------|---------------|----------|
| `--fd-button-bg-primary` | `--ds-color-bg-brand-primary` | `#0d6191` |
| `--fd-button-bg-destructive` | `--ds-color-bg-error` | `#d80e3a` |
| `--fd-button-bg-neutral` | `--ds-color-bg-interactive` | `#f5f5f7` |
| `--fd-button-bg-disabled` | `--ds-color-bg-container` | `#f5f5f7` |
| `--fd-button-text-primary` | `--ds-color-text-inverted` | `#ffffff` |
| `--fd-button-text-destructive` | `--ds-color-text-inverted` | `#ffffff` |
| `--fd-button-text-neutral` | `--ds-color-text-primary` | `#212123` |
| `--fd-button-text-outline` | `--ds-color-text-link` | `#1278b0` |
| `--fd-button-text-subtle` | `--ds-color-text-primary` | `#212123` |
| `--fd-button-text-disabled` | `--ds-color-text-disabled` | `#9e9ea0` |
| `--fd-button-border-outline` | `--ds-color-border-brand` | `#0d6191` |
| `--fd-button-border-outline-disabled` | `--ds-color-border-disabled` | `#d6d6d8` |
| `--fd-button-focus-ring` | `--ds-color-border-focus` | `#38b6ff` |
| `--fd-button-focus-gap` | `--ds-color-bg-input` | `#ffffff` |
| `--fd-button-overlay-hover` | `--ds-color-overlay-hover` | `rgba(0,0,0,0.04)` |
| `--fd-button-overlay-active` | `--ds-color-overlay-active` | `rgba(0,0,0,0.08)` |

If semantic tokens don't exist yet in `tokens.css`, the component uses hardcoded fallbacks. As the token system matures, swap fallbacks for real token references.

---

## Accessibility

| Concern | Approach |
|---------|----------|
| **Keyboard** | `<button>`: native Enter/Space. `<a>`: native Enter. No custom key handlers. |
| **Focus** | `:focus-visible` on `part(base)` — 2px white gap + 2px #38b6ff ring. Matches prose focus pattern. |
| **Disabled button** | Native `disabled` → removed from tab order, announced as disabled |
| **Disabled link** | `href` removed, `aria-disabled="true"`, `tabindex="-1"`, click suppressed |
| **Icon-only** | `aria-label` on `<fd-button>`, icon stays `aria-hidden="true"` |
| **Color contrast** | Primary: 5.2:1. Destructive: 4.8:1. Outline: 4.5:1. Neutral: 13.8:1. Disabled: 2.8:1 (exempt). |
| **Touch target** | 44px min height and width (WCAG 2.5.8 Level AAA) |
| **Forced colors** | Use native forced-color adaptation by default. Apply `forced-color-adjust: none` narrowly only where background color carries semantic meaning (e.g., destructive variant fill). Outline variant border uses `ButtonText`. Focus ring uses `Highlight`. |
| **Reduced motion** | No animations in v1. State transitions use box-shadow changes, not CSS animations. Safe by default. |

---

## Test Plan

| Area | Cases |
|------|-------|
| **fd-icon: registration** | Register single icon, batch register, register overwrite |
| **fd-icon: missing icon** | Unknown name renders nothing, logs console.warn |
| **fd-icon: accessibility** | No label → `aria-hidden="true"`. Label set → `role="img"` + `aria-label`. |
| **fd-icon: rendering** | SVG uses `currentColor`, respects `--fd-icon-size` |
| **fd-button: rendering** | Renders `<button>` by default, `<a>` when `href` set |
| **fd-button: link semantics** | `<a>` has no `role="button"`, preserves link behavior |
| **fd-button: type** | `type` reflected on `<button>`, ignored when `href` set |
| **fd-button: disabled button** | Native `disabled` on `<button>`, removed from tab order |
| **fd-button: disabled link** | No `href`, `aria-disabled="true"`, `tabindex="-1"`, click suppressed |
| **fd-button: icon-only** | `aria-label` on host provides accessible name |
| **fd-button: focus-visible** | Focus ring visible on keyboard focus, not on click |
| **fd-button: variants** | All 5 variants render with correct classes/styles |
| **fd-button: slots** | `icon-start`, `icon-end`, default slot all render correctly |
| **fd-button: edge cases** | Long label text, narrow container, empty label, zoom/reflow |

---

## Non-Goals (v1)

- No `loading` / spinner state
- No size variants (single 44px height matches Figma)
- No button-group or split-button compound component
- No form association (`ElementInternals`)
- No toggle / `aria-pressed` state
- No auto-inserted external link icon
- No dark mode variant (tokens can support it later)

---

## File Plan

```
packages/components/src/
  components/
    fd-icon.ts                 # <fd-icon> Web Component
    fd-button.ts               # <fd-button> Web Component
  icons/
    registry.ts                # Icon registry (shared module)
    phosphor-regular.ts        # Built-in Phosphor icon SVG strings
  utils/
    sanitize-svg.ts            # SVG sanitization (trusted-input defense-in-depth)
  index.ts                     # Re-export both components

apps/storybook/src/
  fd-icon.stories.ts           # Icon stories
  fd-button.stories.ts         # Button stories

apps/docs/components/
  icon.md                      # Icon usage docs
  button.md                    # Button usage docs (must document form-submission limitation)

docs/plans/
  2026-03-22-button-icon-design.md   # This document
```

---

## Open Questions

1. **Semantic token names:** The `--ds-color-*` token names in the mapping table are provisional. They should align with whatever naming emerges from the token system work. The component is designed to be updated when that stabilizes.
2. **Icon packaging:** Should the built-in Phosphor set be tree-shakeable (individual icon imports) or always bundled? Starting bundled for simplicity; can split later if bundle size becomes a concern.
3. **Button in forms:** `ElementInternals` form association is the planned path. Timeline depends on browser support requirements and whether FDIC apps need cross-shadow-boundary form submission before v2.
