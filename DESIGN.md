# FDIC Design System

## Design System Rules
This document defines the core design system implemented in this repository. Always refer to this file and the underlying CSS token files when generating or modifying any UI component.
- Use ONLY the CSS variables defined in the system (e.g., `var(--ds-color-text-primary)`). Do not invent new hex codes, `oklch` values, or use default framework styles.
- Components are built as Web Components (custom elements prefixed with `fd-`).
- Support both light and dark modes inherently by using semantic `var(--ds-color-*)` tokens, which leverage `light-dark()` under the hood.
- Maintain a clean, accessible aesthetic that aligns with federal guidelines.

---

## 1. Design Tokens

### 1.1 Colors
The system uses an `oklch`-based palette. Always use the semantic tokens rather than primitive scales when building components.

**Semantic Backgrounds**
- `--ds-color-bg-base`: Main page background (Neutral 000 / Neutral 1000)
- `--ds-color-bg-surface`: Card and surface backgrounds
- `--ds-color-bg-container`: Secondary container backgrounds
- `--ds-color-bg-brand`: Primary brand background
- `--ds-color-bg-interactive`: Interactive element backgrounds
- `--ds-color-semantic-bg-success`: Success/confirmation states
- `--ds-color-semantic-bg-warning`: Alert/warning states
- `--ds-color-semantic-bg-error`: Destructive/error states
- `--ds-color-semantic-bg-info`: Informational states

**Semantic Text & Icons**
- `--ds-color-text-primary` / `--ds-color-icon-primary`: Main text and icons
- `--ds-color-text-secondary` / `--ds-color-icon-secondary`: Supporting text and descriptions
- `--ds-color-text-brand`: Brand-colored text
- `--ds-color-text-error`: Error messages
- `--ds-color-text-link`: Hyperlinks (`--ds-color-link-default` / `--ds-color-link-300`)

**Borders**
- `--ds-color-border-divider`: Standard dividers and rules
- `--ds-color-border-subtle`: Subtle framing and outlines
- `--ds-color-border-input`: Form input borders
- `--ds-color-border-input-focus`: Input focus state borders
- `--ds-color-semantic-border-error`: Error state borders

### 1.2 Typography
**Font Families**
- **Sans-Serif:** `'Source Sans 3', Arial, sans-serif`
- **Serif:** `'Lora', Georgia, serif`

### 1.3 Focus & Interaction
**Focus Rings**
All interactive elements must use the standard focus ring approach:
- **Gap:** `var(--ds-focus-gap-width, 2px)` using `var(--ds-color-bg-input)` or base background.
- **Ring:** `var(--ds-focus-ring-width, 4px)` using `var(--ds-focus-ring-color, var(--ds-color-border-input-focus))`.

**Motion & Easing**
- `var(--ds-motion-duration-fast)`: 120ms
- `var(--ds-motion-duration-normal)`: 150ms
- `var(--ds-motion-duration-slow)`: 240ms
- `var(--ds-motion-easing-default)`: `cubic-bezier(0.25, 0.1, 0.25, 1)`

### 1.4 Elevations (Shadows)
- `--ds-shadow-raised`: Subtle depth for standard raised elements.
- `--ds-shadow-dropdown`: Elevation for dropdowns and popovers.
- `--ds-shadow-menu`: Elevation for menus.
- `--ds-shadow-panel`: Deepest elevation for dialogs and modals.

---

## 2. Component Specifications

### 2.0 Collection Layouts (`fd-card-group`, `fd-tile-list`, `fd-event-list`)
- Collection wrappers use CSS Grid to flow items left-to-right, then top-to-bottom.
- Use the approved layout recipes only: `2`, `3`, and `4` columns.
- Width constraints and gaps must come from the corresponding Figma `col-#-min`, `col-#-max`, and `col-#-gap` variables.
- Collection layout behavior is container-aware. Components should react to their available inline size rather than only to the viewport.
- When Figma uses very large mobile max values to indicate effectively unbounded tracks, treat that as a fill behavior in code rather than exposing a literal `9999px` contract.
- Collection wrappers own the responsive grid rules. Child cards, tiles, and event items should stretch to fill the assigned track instead of defining competing layout widths.
- Preserve list semantics for content collections: the wrapper should expose `role="list"` and direct collection items should expose `role="listitem"` when native semantics do not already provide the correct structure.

### 2.1 Buttons (`fd-button`)
- **Focus State:** Employs the standard 2px gap and 4px focus ring.
- **Hover/Active:** Utilizes `--ds-color-overlay-hover` and `--ds-color-bg-active` over the base background to indicate interactivity.
- **Disabled:** Uses `--ds-color-text-disabled` and appropriate disabled background/border tokens.

### 2.2 Inputs & Forms (`fd-input`, `fd-selector`, `fd-checkbox-group`, `fd-radio-group`)
- **Default Border:** `var(--ds-color-border-input)`
- **Hover Border:** `var(--ds-color-border-input-hover)`
- **Focus State:** Border changes to `var(--ds-color-border-input-focus)` with the standard focus ring applied.
- **Error State:** Border changes to `var(--ds-color-semantic-border-error)` and text to `var(--ds-color-semantic-fg-error)`.

### 2.3 Status Indicators (`fd-badge`, `fd-chip`, `fd-message`)
- Ensure backgrounds map to their respective semantic variables:
  - Info: `var(--ds-color-semantic-bg-info)`
  - Success: `var(--ds-color-semantic-bg-success)`
  - Warning: `var(--ds-color-semantic-bg-warning)`
  - Error: `var(--ds-color-semantic-bg-error)`
- Interactive chips utilize `var(--ds-color-overlay-hover)` and `var(--ds-color-overlay-pressed)` for interaction feedback.
