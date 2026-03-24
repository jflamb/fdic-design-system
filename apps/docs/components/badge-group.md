# Badge Group

A wrapping layout container for related badges.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-badge-group</code> when several static badges belong to one visible set and need consistent wrapping. The group manages layout and optional shared naming, not interactivity.</p>
</div>

## When to use

- **Related tag sets** — when several badges describe one record, application, or page state.
- **Dense metadata summaries** — when compact labels need a consistent, responsive wrapper.
- **Optional shared semantics** — when the set benefits from a label such as “Account tags”. 

## When not to use

- **One badge** — a single badge does not need a grouping wrapper.
- **Dismissible sets** — use [Chip Group](/components/chip-group) when each item has a remove action.
- **Action clusters** — `fd-badge-group` is not a toolbar or menu substitute.

## Examples

<StoryEmbed
  storyId="components-badge-group--docs-overview"
  linkStoryId="components-badge-group--playground"
  height="320"
  caption="Badge groups wrap related static badges and can expose an optional shared label."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `label` | `string \| undefined` | `undefined` | Adds `role="group"` and `aria-label` when the badge set benefits from a shared accessible name. |

## Slots

| Name | Description |
|---|---|
| (default) | One or more `fd-badge` elements. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-badge-group-gap` | `var(--fdic-spacing-2xs, 4px)` | Gap between badges in the wrapping layout. |

## Shadow parts

| Name | Description |
|---|---|
| `container` | Internal wrapping flex container. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Group related labels together</h4>
    <p>Badges are easier to scan when they all describe the same entity or section.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use badge groups for actions</h4>
    <p>If users need to act on the items, move to chips, buttons, or another interactive pattern.</p>
  </div>
</div>

## Content guidelines

- **Keep the label set coherent.** Avoid mixing unrelated statuses and tags in the same visual group.
- **Use a shared group label only when it adds meaning.** “Account tags” is useful; repeating what the badges already say is not.

## Accessibility

- `fd-badge-group` is **presentational by default**.
- When `label` is provided, the internal wrapper gets **`role="group"` and `aria-label`**.
- The component preserves DOM order as badges wrap, so reading order and scan order stay stable.
- The group does not imply interactivity for its children.

## Known limitations

- `fd-badge-group` does not enforce that every child is an `fd-badge`.
- The component is a layout wrapper only; list semantics and richer set management stay out of scope for v1.

## Related components

- [Badge](/components/badge) — static pill used inside the group
- [Chip Group](/components/chip-group) — layout wrapper for dismissible chips

## Related components

- TODO
