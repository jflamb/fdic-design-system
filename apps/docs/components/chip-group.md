# Chip Group

A wrapping layout container for related chips.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-chip-group</code> when several dismissible chips belong to one visible set, such as active filters or selected tokens. The group manages layout and optional group labeling; it does not add keyboard roving or collection state.</p>
</div>

## When to use

- **Active-filter sets** — when users may remove one filter at a time from a visible row.
- **Selected-token summaries** — when multiple chosen items need consistent spacing and wrapping.
- **Responsive pill layouts** — when you want a source-of-truth wrapper instead of ad hoc flex markup.

## When not to use

- **Single chips** — one chip does not need a grouping wrapper.
- **Toolbar-style action bars** — `fd-chip-group` does not provide composite-widget keyboard behavior.
- **Mixed unrelated content** — keep the group focused on chips that belong to the same conceptual set.

## Examples

<StoryEmbed
  storyId="components-chip-group--docs-overview"
  linkStoryId="components-chip-group--playground"
  height="320"
  caption="Chip groups wrap related removable chips and can expose an optional shared label."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `label` | `string \| undefined` | `undefined` | Adds `role="group"` and `aria-label` when the chip set benefits from a shared accessible name. |

## Slots

| Name | Description |
|---|---|
| (default) | One or more `fd-chip` elements. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-chip-group-gap` | `var(--fdic-spacing-2xs, 4px)` | Gap between chips in the wrapping layout. |

## Shadow parts

| Name | Description |
|---|---|
| `container` | Internal wrapping flex container. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use a group label when the set needs a shared name</h4>
    <p>Labels like “Active filters” help screen reader users understand the purpose of the chip set.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Assume the group changes chip behavior</h4>
    <p>The group only manages layout and optional semantics. Each chip still owns its own remove button.</p>
  </div>
</div>

## Content guidelines

- **Keep the set concept clear.** If the chips do not describe one coherent list, separate them into smaller groups.
- **Use short group labels.** Shared labels such as “Active filters” or “Selected tags” work better than long sentences.

## Accessibility

- `fd-chip-group` is **presentational by default**.
- When `label` is provided, the internal wrapper gets **`role="group"` and `aria-label`**.
- The component does **not** add arrow-key navigation, roving tabindex, or listitem roles in v1.
- Wrapping preserves DOM order, so keyboard and reading order remain stable as the layout reflows.

## Known limitations

- `fd-chip-group` does not enforce that every child is an `fd-chip`.
- The component does not manage chip removal or focus recovery after a chip is removed.
- v1 is a layout wrapper only; selection and toolbar behavior are out of scope.

## Related components

- [Chip](/components/chip) — dismissible pill used inside the group
- [Badge Group](/components/badge-group) — equivalent layout wrapper for static badges
- [Alert](/components/alert) — use alerts instead when the information is time-sensitive or requires attention
