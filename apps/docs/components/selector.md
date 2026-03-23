# Selector

A dropdown that lets users choose one or more options from a predefined list. Available in three variants: simple, single (with radio indicators), and multiple (with checkbox indicators).

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-selector</code> when users need to pick from a set of predefined options and the list is too long for inline radio buttons or checkboxes (roughly 6+ options), or when screen space is constrained. The component provides a trigger button that opens a listbox popup with full keyboard and screen reader support.</p>
</div>

## When to use

- **The option list is too long for visible radio buttons or checkboxes** — Selectors save space by hiding options behind a trigger.
- **Users need to select from a predefined, stable set of options** — Account types, report categories, filing classifications.
- **Screen space is constrained** — Selectors use a single row plus a popup, compared to one row per option for radios or checkboxes.

## When not to use

- **5 or fewer options, single select** — Use `fd-radio-group` instead so all options are visible without interaction.
- **5 or fewer options, multi-select** — Use `fd-checkbox-group` instead.
- **Users need to type to search or filter** — This component has no text input. Use a combobox pattern for search-as-you-type.
- **Navigation menus or action lists** — Use `fd-menu` / `fd-menu-item`. Selectors are for form values; menus are for commands.
- **Multi-select in high-stakes government workflows** — Multi-select dropdowns hide selected state behind a trigger, creating comprehension risk. Prefer `fd-checkbox-group` for consequential multi-selection scenarios (filing types, regulatory classifications) even when the option count exceeds 5.
- **Highly consequential single-choice selections** — If a selection triggers an irreversible action, prefer radio buttons with a separate submit button for explicit confirmation.

## Examples

<StoryEmbed
  storyId="components-selector--docs-overview"
  linkStoryId="components-selector--playground"
  height="460"
  caption="Selector overview — simple, single, and multiple variants. Open Storybook for interactive controls and form examples."
/>

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use clear, descriptive option labels</h4>
    <p>Each option should be unambiguous. Lead with human-readable text when options include codes: "Checking (001)" not "001 — Checking".</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use jargon or abbreviations without explanation</h4>
    <p>Option labels with unexplained abbreviations slow users down and increase error rates, especially in public-service forms.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Pair selectors with explicit submit buttons</h4>
    <p>Never auto-submit a form when a selector value changes. Users need a chance to review their choice.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Default to multi-select for government forms</h4>
    <p>Multi-select dropdowns are harder to scan than visible checkbox groups. Reserve them for low-stakes contexts like filters or preferences.</p>
  </div>
</div>

## Content guidelines

- **Placeholder text**: Use "Select…" for simple/single, or "Select one or more…" for multiple. Never leave the trigger blank.
- **Option descriptions**: Use the `description` attribute on `fd-option` when options benefit from additional context. Keep descriptions concise (one line).
- **Option ordering**: Order options logically (most common first), alphabetically, or by category. Avoid arbitrary ordering.
- **Required fields**: The required marker (red asterisk) appears in the label. Validation messages are clear and specific: "Please select an option." or "Please select at least one option."

## Accessibility

`fd-selector` uses the **button + listbox** ARIA pattern — the most conservative, widely-supported model for custom select components.

- **Trigger**: A native `<button>` with `aria-haspopup="listbox"` and `aria-expanded`.
- **Listbox**: `role="listbox"` with `aria-activedescendant` for focus tracking. `aria-multiselectable="true"` only for the multiple variant.
- **Options**: `role="option"` with `aria-selected`. All options have an explicit `aria-selected` value in multi-select mode.
- **Keyboard**: Enter/Space opens; Arrow keys navigate; Enter/Space selects (single) or toggles (multi); Escape closes; Tab closes and advances; Home/End jump to first/last; type-ahead (500ms) matches option text.
- **Focus**: DOM focus moves to the listbox when open. Focus returns to the trigger on close. Focus is not trapped.
- **Validation contract**: `checkValidity()` updates and returns validity without revealing invalid state. `reportValidity()` reveals invalid state only when the selector is invalid; if the selector is valid, it has no visible effect.
- **Visibility boundaries**: invalid state becomes visible on form submit attempts, explicit `reportValidity()`, and popup close or focus-out after user interaction.
- **Invalid ownership**: the host carries `data-user-invalid`; the trigger button carries `aria-invalid="true"` only while that visible invalid state is active.
- **Error content**: provide authored error text in the `error` slot whenever the selector can block submission. Missing error copy is incomplete usage even though invalid styling still appears.
- **Selection indicators**: Radio dots (single) and checkboxes (multiple) provide a shape-based indicator alongside background color, so selection is never conveyed by color alone.
- **Live region**: In multi-select mode, an `aria-live="polite"` region announces the selection count.
- **Forced colors**: High Contrast mode overrides use system colors for borders and selection.
- **Reduced motion**: Chevron rotation and dropdown animation are suppressed under `prefers-reduced-motion`.

## Event contract

`fd-selector` uses component-specific public event names.

| Event | Detail | Notes |
|-------|--------|-------|
| `fd-selector-change` | single-select: `{ value: string, values: string[] }` | `values` contains the current single selection when present |
| `fd-selector-change` | multi-select: `{ value: string, values: string[] }` | `value` mirrors the first selected value in DOM order |
| `fd-selector-open-change` | `{ open: boolean }` | Fired whenever the popup opens or closes |

Compatibility note:

- `fd-selector` still fires deprecated `fd-selector-open` and `fd-selector-close` during the compatibility window.
- New consumer code should listen to `fd-selector-open-change`.

### fd-option contract

`fd-option` is a supporting embedded primitive. It stays documented here because its meaning depends on the `fd-selector` parent.

**Purpose and relationship to parent**

- Use `fd-option` only as a child of `fd-selector`.
- It provides the authored option label, optional description, and disabled state that `fd-selector` turns into listbox options.

**Supported authored surface**

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `value` | `string` | `""` | Submitted value for the option |
| `description` | `string` | `""` | Optional secondary line for added context |
| `disabled` | `boolean` | `false` | Keeps the option visible but unavailable |
| default slot | text | — | Primary visible option label |

**Authoring constraints**

- `fd-option` must be authored inside `fd-selector`; standalone use is unsupported.
- Provide a stable `value` for every option. Do not rely on label text as the submitted value.
- Keep descriptions concise and supplemental. They should clarify, not replace, the primary label.
- Avoid mixing long descriptive copy with high-stakes multi-select workflows where visible checkbox groups would be clearer.

**Accessibility contract**

- `fd-option` itself is not the focus owner. `fd-selector` manages listbox semantics, active descendant, selection state, and keyboard interaction.
- The parent projects `fd-option` content into `role="option"` semantics and exposes `aria-selected` state.
- Disabled options remain visible for discoverability but cannot be selected.

**Usage example**

```html
<fd-selector label="Account type" variant="single">
  <fd-option value="checking">Checking</fd-option>
  <fd-option value="savings" description="Daily-use savings account">
    Savings
  </fd-option>
  <fd-option value="cd" disabled>Certificate of Deposit</fd-option>
</fd-selector>
```

## Known limitations

- **No search or filtering** — This is a static-list selector, not a combobox. A separate `fd-combobox` should be built for type-ahead use cases.
- **No option groups** — Grouped options (like `<optgroup>`) are not supported in v1.
- **No chip/tag display** — Multi-select shows comma-separated text with ellipsis truncation. Chip/tag display is deferred.
- **No async option loading** — All options must be present in the DOM at render time.

## Related components

<ul class="fdic-related-list">
  <li><a href="./radio">Radio</a> — For single-choice questions with 5 or fewer visible options.</li>
  <li><a href="./radio-group">Radio Group</a> — Groups radio buttons with shared validation and labeling.</li>
  <li><a href="./checkbox">Checkbox</a> — For independent yes/no choices.</li>
  <li><a href="./checkbox-group">Checkbox Group</a> — For multi-select with all options visible.</li>
</ul>
