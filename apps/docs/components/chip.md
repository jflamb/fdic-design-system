# Chip

A dismissible pill for active filters, selected tokens, or removable lightweight labels.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-chip</code> when users need to remove an item from a visible set without opening a menu or editing a form field. The chip stays text-first, and the remove affordance is always a real button.</p>
</div>

## When to use

- **Active filters** — when users can remove one applied filter at a time.
- **Selected tokens** — when a compact removable summary helps users review current choices.
- **Lightweight removable labels** — when removing an item is a safe, single-step action.

## When not to use

- **Clickable or selectable pills** — `fd-chip` does not support toggle, selection, or navigation behavior in v1.
- **Critical alerts or workflow status** — use a fuller message pattern when the user needs more context or recovery guidance.
- **Complex editing** — if users need to rename, inspect details, or confirm before removing, use a richer pattern.

## Examples

<StoryEmbed
  storyId="components-chip--docs-overview"
  linkStoryId="components-chip--playground"
  height="320"
  caption="Dismissible chips in representative tones. Open Storybook for focus and interaction checks."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `type` | `"neutral"` \| `"cool"` \| `"warm"` \| `"positive"` \| `"alert"` | `neutral` | Visual tone for the chip surface. |
| `removeLabel` | `string \| undefined` | `undefined` | Optional accessible-name override for the internal remove button. |

## Slots

| Name | Description |
|---|---|
| (default) | Visible chip label text. |

## Events

| Name | Detail | Description |
|---|---|---|
| `fd-chip-remove` | `{}` | Fired when the internal remove button is activated. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-chip-height` | `28px` | Minimum chip height. |
| `--fd-chip-padding-inline-start` | `var(--fdic-spacing-sm, 12px)` | Leading inline padding before the label. |
| `--fd-chip-remove-size` | `28px` | Square size for the internal remove button. |
| `--fd-chip-remove-gap` | `var(--fdic-spacing-3xs, 2px)` | Space between the label and the remove affordance. |
| `--fd-chip-radius` | `9999px` | Pill corner radius. |
| `--fd-chip-font-size` | `var(--fdic-font-size-body-small, 1rem)` | Label font size. |
| `--fd-chip-text-color` | `var(--ds-color-text-primary, #212123)` | Shared text color across tones. |
| `--fd-chip-bg-neutral` | `var(--ds-color-bg-interactive, #f5f5f7)` | Neutral chip background. |
| `--fd-chip-bg-cool` | `var(--ds-color-info-050, #f1f8fe)` | Cool chip background. |
| `--fd-chip-bg-warm` | `var(--ds-color-secondary-050, #f8efda)` | Warm chip background. |
| `--fd-chip-bg-positive` | `var(--ds-color-success-050, #e8f5e9)` | Positive chip background. |
| `--fd-chip-bg-alert` | `var(--ds-color-error-050, #fdedea)` | Alert chip background. |
| `--fd-chip-remove-overlay-hover` | `var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04))` | Hover overlay for the internal remove button. |
| `--fd-chip-remove-overlay-active` | `var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))` | Pressed overlay for the internal remove button. |
| `--fd-chip-remove-focus-ring` | `var(--fdic-border-input-focus, #38b6ff)` | Focus-ring color for the internal remove button. |

## Shadow parts

| Name | Description |
|---|---|
| `container` | Outer pill container. |
| `label` | Visible label wrapper. |
| `remove-button` | Internal native remove button. |
| `remove-icon` | Decorative close icon wrapper inside the button. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use a chip for one-step removal</h4>
    <p>Keep the action simple and predictable so the user understands what will disappear when the button is activated.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Make the whole chip a mystery button</h4>
    <p>Only the remove affordance is interactive in v1. If the whole pill needs to act, use a different pattern.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep the label explicit</h4>
    <p>Short text like “Pending review” or “Under $250K” makes the remove action understandable without relying on color.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use chips as the only explanation for high-stakes state</h4>
    <p>Regulatory, error, or eligibility conditions need fuller text or message patterns.</p>
  </div>
</div>

## Content guidelines

- **Keep labels short and plain.** Users should understand the label immediately before they decide whether to remove it.
- **Treat the remove action literally.** The chip button should remove one item, not clear all results or dismiss unrelated content.
- **Use status text that stands on its own.** Color supports scanning, but the visible label must still carry the meaning.

## Accessibility

- `fd-chip` exposes **one real tab stop**: the internal remove button.
- The remove button gets a generated accessible name in the form **“Remove {label}”** unless you provide `remove-label`.
- The decorative close icon stays **`aria-hidden="true"`**.
- The component does **not** remove itself from the DOM. The host application owns collection state, so focus management after removal remains a product decision.
- Forced-colors support preserves the pill boundary, readable text, and a visible focus treatment on the internal button.

## Known limitations

- `fd-chip` is **not** a selectable chip, filter button, or navigation control in v1.
- The component supports **text labels only** in its documented contract. Rich leading icons, avatars, and counters are out of scope.
- The button-focus treatment is intentionally localized to the remove affordance, not the whole pill.

## Related components

- [Badge](/components/badge) — static text-first pill when no remove action is needed
- [Chip Group](/components/chip-group) — wrapping layout for related chips
- [Badge Group](/components/badge-group) — wrapping layout for related badges

## Related components

- TODO
