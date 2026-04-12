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
Public typography naming currently uses the shipped `--fdic-font-*`, `--fdic-line-height-*`, `--fdic-letter-spacing-*`, and `--fdic-heading-padding-*` families.

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

### 1.5 Layout
**Shared Page Shell**
- `--ds-layout-shell-max-width`: Common inner width for page-level chrome and content wrappers that should align horizontally.
- `--ds-layout-content-max-width`: Content width baseline when a shell-specific width is not required.
- `--ds-layout-gutter`, `--ds-layout-gutter-tablet`, `--ds-layout-gutter-mobile`: Standard horizontal gutters across breakpoints.
- `--ds-layout-section-block-padding`, `--ds-layout-section-block-padding-compact`: Approved section block padding defaults for major and compact full-width sections.
- `--ds-layout-content-gap`, `--ds-layout-stack-gap`, `--ds-layout-split-gap`: Shared page-composition gaps for peer regions, vertical stacks, and sidebar/main splits.
- `--ds-layout-sidebar-width`: Preferred sidebar rail width for documented split layouts.
- `--ds-layout-paragraph-max-width`: Readable long-form content width.

**Shared Collection Columns**
- `--ds-layout-col-2-*`, `--ds-layout-col-3-*`, `--ds-layout-col-4-*`: Approved desktop min, max, and gap recipes for 2-column, 3-column, and 4-column collection layouts.
- `--ds-layout-col-2-*-narrow`, `--ds-layout-col-3-*-narrow`, `--ds-layout-col-4-*-narrow`: Narrow-screen variants of the same recipes.

---

## 2. Component Specifications

### 2.0 Collection Layouts (`fd-card-group`, `fd-tile-list`, `fd-event-list`)
- Collection wrappers use CSS Grid to flow items left-to-right, then top-to-bottom.
- Use the approved layout recipes only: `2`, `3`, and `4` columns.
- Width constraints and gaps must come from the shared `--ds-layout-col-*` tokens, which encode the approved Figma `col-#-min`, `col-#-max`, and `col-#-gap` recipes.
- Collection layout behavior is container-aware. Components should react to their available inline size rather than only to the viewport.
- Exact collection collapse thresholds are intentionally private implementation details. Do not document or depend on a published threshold contract.
- When Figma uses very large mobile max values to indicate effectively unbounded tracks, treat that as a fill behavior in code rather than exposing a literal `9999px` contract.
- Collection wrappers own the responsive grid rules. Child cards, tiles, and event items should stretch to fill the assigned track instead of defining competing layout widths.
- Preserve the component-level `--fd-*` layout variables as explicit override hooks, but default them to the shared `--ds-layout-col-*` tokens instead of duplicating recipe values inside each component.
- Preserve list semantics for content collections: the wrapper should expose `role="list"` and direct collection items should expose `role="listitem"` when native semantics do not already provide the correct structure.

### 2.0.1 Page Shell Alignment
- Use `--ds-layout-shell-max-width` to align the global header, page header, page feedback, footer, and page-content wrappers.
- Section backgrounds, dividers, and border treatments may span full bleed, but the section's inner content wrapper should stay pinned to the shared shell width unless a documented pattern intentionally diverges.
- Prefer shared shell and gutter tokens over page-specific max-width values. Introduce a component-level override only when a page-level pattern has a clear, documented reason to diverge.

### 2.0.2 Section wrappers, readable rails, and split layouts

Stable tokens:

- Use `--ds-layout-section-block-padding` for major shell sections and `--ds-layout-section-block-padding-compact` for smaller supporting sections.
- Use `--ds-layout-paragraph-max-width` for sustained long-form reading content.
- Use `--ds-layout-content-gap`, `--ds-layout-stack-gap`, and `--ds-layout-split-gap` for shared page-composition rhythm.
- Use `--ds-layout-sidebar-width` as the preferred sidebar rail width when a sidebar/main split is needed.

Documented patterns, not separate token APIs:

- Full-bleed sections with constrained inner wrappers.
- Sidebar/content split collapse behavior on narrow containers.
- Exact page templates, hero compositions, and campaign-specific layout recipes.
- Section-specific inner wrappers that intentionally diverge from the common shell.

Accessibility expectations:

- Layouts must reflow cleanly at zoom without overlap or horizontal scrolling for primary content.
- Readable rails should keep long-form copy within comfortable line lengths.
- Full-bleed sections must still preserve a constrained inner reading area.
- Focus indicators and touch targets must remain visible and usable within constrained shells and split layouts.

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
