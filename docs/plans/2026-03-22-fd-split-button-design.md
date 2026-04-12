# fd-split-button Design

> **Date:** 2026-03-22
> **Issue:** [#18 — fd-split-button: split button with menu trigger](https://github.com/jflamb/fdic-design-system/issues/18)
> **Status:** Approved design, pending implementation

## Overview

`fd-split-button` is a composed web component that renders a primary action button alongside a secondary trigger that opens a menu of alternate actions. It composes `fd-menu` internally and supports `fd-menu-item` as its menu content.

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Separate component, not fd-button variant | Split buttons introduce popup behavior, focus management, and keyboard patterns fundamentally different from a single-action button |
| Compose fd-menu internally | fd-menu already owns popover/fallback, placement, roving tabindex, focus return, dismissal, and aria-expanded management. Rebuilding this would duplicate logic. |
| DOM adoption for item projection | fd-menu discovers items via `querySelectorAll("fd-menu-item")` in its light DOM. Slotted items in fd-split-button's light DOM would not be found. Adoption moves items into fd-menu's child tree, preserving fd-menu's internal contract unchanged. |
| fd-menu-item only in v1 | Constrains the API surface. No arbitrary popup content. |
| Own variant CSS, shared tokens | fd-button has link rendering, loading spinners, icon-only detection that don't apply here. The split button defines its own styles on native buttons using the same design tokens. |

## Consumer API

### Usage

```html
<fd-split-button variant="primary" trigger-label="More save options">
  Save
  <fd-menu-item slot="menu">Save as Draft</fd-menu-item>
  <fd-menu-item slot="menu">Save & Submit for Review</fd-menu-item>
</fd-split-button>
```

### Properties / Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ButtonVariant` | `"primary"` | Visual variant applied to both segments |
| `disabled` | `boolean` | `false` | Disables both segments. Menu cannot open. |
| `trigger-disabled` | `boolean` | `false` | Disables only the trigger segment. Primary remains active. |
| `trigger-label` | `string` | `"More options"` | Accessible name for the trigger segment |
| `menu-placement` | `Placement` | `"bottom-start"` | Preferred menu placement relative to the trigger |
| `open` | `boolean` | `false` | Read-only reflected state. Derived from fd-menu events. Consumers should not set this directly. |

### Slots

| Name | Description |
|------|-------------|
| (default) | Label content for the primary action segment |
| `icon-start` | Leading icon for the primary segment |
| `menu` | `fd-menu-item` elements only. Adopted into internal fd-menu on slotchange. |

### Events

| Name | Detail | Description |
|------|--------|-------------|
| `fd-split-action` | `{}` | Fired when the primary segment is activated |
| `fd-split-open` | `{ open: boolean }` | Fired when the menu opens or closes |

### CSS Custom Properties

| Name | Default | Description |
|------|---------|-------------|
| `--fd-split-button-divider-color` | Variant-dependent | Divider color between segments |
| `--fd-split-button-divider-width` | `1px` | Divider thickness |
| `--fd-split-button-trigger-width` | `44px` | Trigger segment width (minimum touch target) |

### Shadow Parts

| Name | Description |
|------|-------------|
| `container` | Outer wrapper for both segments |
| `primary` | The primary action button |
| `trigger` | The menu trigger button |
| `divider` | The visual divider between segments |

## Internal Structure

### Shadow DOM Template

```html
<div part="container" class="container {variant}">
  <button part="primary" class="primary-segment {variant}">
    <slot name="icon-start"></slot>
    <span class="label"><slot></slot></span>
  </button>
  <span part="divider" class="divider"></span>
  <button part="trigger" class="trigger-segment {variant}"
          id="trigger"
          aria-haspopup="menu"
          aria-expanded="false"
          aria-label="{triggerLabel}">
    <fd-icon name="caret-down" aria-hidden="true"></fd-icon>
  </button>
</div>
<fd-menu anchor="trigger" placement="{menuPlacement}" label="{triggerLabel}"></fd-menu>
<slot name="menu" hidden></slot>
```

### DOM Adoption Flow

1. Consumer provides `<fd-menu-item slot="menu">` children in fd-split-button's light DOM
2. Hidden `<slot name="menu">` captures them and fires `slotchange`
3. On `slotchange`, fd-split-button:
   - Gets assigned elements via `slot.assignedElements({ flatten: true })`
   - Clears all children from the internal `<fd-menu>`
   - For each assigned element, validates via `el.tagName.toLowerCase() === "fd-menu-item"` (tag-name check, not instanceof, for cross-bundle safety)
   - Strips `slot` attribute from valid items so they become plain fd-menu children
   - Appends to internal fd-menu via `appendChild`
   - Logs `console.warn` for any non-fd-menu-item nodes
4. If menu is currently open after re-adoption, re-runs positioning
5. If menu is open and now has zero items, closes it

### Anchor Resolution

The trigger button has a stable ID (`id="trigger"`) set once in the constructor, never regenerated. Both the trigger and fd-menu live in the same shadow root, so `fd-menu._resolveAnchor()` using `getRootNode().getElementById()` resolves correctly.

### Lifecycle

fd-split-button drives fd-menu exclusively through its public API: `show()`, `hide()`, `toggle()`. It never sets fd-menu's `open` attribute directly.

**Adopted items are owned by the component after connection.** They leave the consumer's light DOM and become children of the internal fd-menu. This is the documented contract.

## Styling

### Variant Mapping

Both segments use the same design tokens as fd-button:

| Token | Primary | Neutral | Subtle | Outline | Destructive |
|-------|---------|---------|--------|---------|-------------|
| Background | `--fdic-color-bg-active` | `--fdic-color-bg-interactive` | `transparent` | `--fdic-color-bg-input` | `--fdic-color-bg-destructive` |
| Text | `--fdic-color-text-inverted` | `--fdic-color-text-primary` | `--fdic-color-text-primary` | `--fdic-color-text-link` | `--fdic-color-text-inverted` |
| Font weight | 600 | 400 | 400 | 400 | 600 |

Hover/active use the same inset `box-shadow` overlay pattern (4% / 8% black).

### Container & Border Radius

The container owns the outer shape. Individual segments have square inner edges where they meet the divider. For the outline variant, the container owns the 2px border and the divider replaces the interior seam.

### Divider Color

- Filled variants (primary, destructive): semi-transparent white (`rgba(255,255,255,0.3)`)
- Light variants (neutral, subtle, outline): `--fdic-border-divider`

### Focus

Each segment has independent `:focus-visible` styling using the standard fd-button focus ring: `box-shadow: 0 0 0 2px {gap-color}, 0 0 0 4px {ring-color}`.

### Forced Colors

- Container: `border: 1px solid ButtonText`
- Divider: `background: ButtonBorder`
- Focus: `outline: 2px solid Highlight; outline-offset: 2px; box-shadow: none`
- Disabled: `border-color: GrayText; color: GrayText`
- Caret icon inherits `color` from trigger button, which uses system colors in forced-colors mode

### Reduced Motion

No animations in v1. If transitions are added later, they get `prefers-reduced-motion: reduce` guards.

## Keyboard Behavior

### Primary Segment

| Key | Behavior |
|-----|----------|
| `Enter` / `Space` | Fires `fd-split-action` |
| `Tab` | Moves focus to trigger segment (natural) |

### Trigger Segment

| Key | Context | Behavior |
|-----|---------|----------|
| `Enter` / `Space` | Menu closed | `preventDefault()`, opens menu via `fd-menu.show()` |
| `Enter` / `Space` | Menu open | `preventDefault()`, closes menu via `fd-menu.hide()` |
| `ArrowDown` | Menu closed | `preventDefault()`, opens menu + focuses first item via `fd-menu.show()` |
| `ArrowUp` | Menu closed | `preventDefault()`, opens menu + focuses last item via `fd-menu.showLast()` |

### Menu Open

All handled by fd-menu: ArrowDown/Up navigation, Home/End, Escape (close + focus return to trigger), Tab (close + natural focus movement), item selection (close + focus return to trigger).

### Responsibility Split

| Concern | Owner |
|---------|-------|
| Primary click/Enter/Space -> action event | fd-split-button |
| Trigger click -> toggle menu | fd-split-button |
| Trigger ArrowDown/ArrowUp -> open menu | fd-split-button |
| Menu keyboard navigation | fd-menu |
| Escape -> close + focus return | fd-menu |
| Tab -> close + natural focus | fd-menu |
| Item selection -> close + focus return | fd-menu |
| Outside click dismissal | fd-menu (popover auto / fallback) |

## State Management

### Open State

`open` is derived from fd-menu's `fd-open` event. fd-split-button listens for `fd-open` on the internal fd-menu and:
1. Updates its own `open` property to `event.detail.open`
2. Re-fires as `fd-split-open` with `{ open: boolean }`

### Disabled Transitions

In `updated()`, detect transitions (not static state):
- `disabled` false -> true while open: call `fd-menu.hide()`
- `trigger-disabled` false -> true while open: call `fd-menu.hide()`
- Guard `disconnectedCallback()` against event churn during teardown

### Outside Click / Re-click

Handled entirely by fd-menu. Its fallback click handler excludes clicks on `_anchorEl`, so re-clicking the trigger while open correctly toggles closed.

## Scope Boundaries (v1)

**Included:**
- All five variants (primary, neutral, subtle, outline, destructive)
- Disabled and trigger-disabled states
- Full keyboard behavior per spec
- DOM adoption of fd-menu-item children
- Forced-colors and reduced-motion support
- Storybook stories
- Unit tests
- Component documentation

**Not included:**
- `loading` / `loading-label` (gated on loading state maturity)
- Arbitrary menu content (fd-menu-item only)
- Grouped menu items / separators
- Form submission integration

## Implementation Notes

- Trigger ID (`"trigger"`) is set once, never regenerated during updates
- Tag-name validation (`el.tagName.toLowerCase() === "fd-menu-item"`) not instanceof, for cross-bundle safety
- Strip `slot="menu"` attribute from adopted items during adoption
- `--fd-split-button-trigger-width: 44px` is a minimum, not a shrinkable value
- Primary segment spacing/line-height should visually match fd-button for family consistency
- Sharing `trigger-label` with internal menu `label` is an accessibility compromise for smaller API surface in v1; document this
