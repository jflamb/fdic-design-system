# Social Media List

The Social Media List component arranges direct Social Media Item children in a responsive, left-to-right and top-to-bottom collection.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-social-media-list</code> when several curated social posts belong together and should wrap naturally across the available space without becoming a carousel, menu, or selectable grid.</p>
</div>

## When to use

- **Groups of related social posts** — use the list when a section shows multiple recent or relevant posts.
- **Responsive page sections** — use `columns` to choose the preferred desktop density while letting the component reflow at narrow widths.
- **Collections that need honest list semantics** — the component announces the group as a list and each direct item as a list item.

## When not to use

- **Do not use it for selection or active-item management** — it is not a listbox, menu, tab list, or feed widget.
- **Do not use it as a general grid utility** — it expects direct `fd-social-media-item` children.
- **Do not use it for live loading behavior** — empty, loading, error, pagination, and API refresh states belong to the application.

## Examples

<StoryEmbed
  storyId="components-social-media-list--docs-overview"
  linkStoryId="components-social-media-list--playground"
  caption="Social Media List wraps related social media items with list semantics and a shared responsive collection layout."
/>

### Basic usage

```html
<fd-social-media-list label="Recent FDIC social posts">
  <fd-social-media-item
    timestamp="Aug. 26, 2024 · 9:25 AM"
    image-src="/images/social/unbanked-households.png"
    image-alt="Graphic stating that 75 percent of unbanked Hispanic households rely on cash."
    platforms="facebook youtube instagram x reddit linkedin threads"
  >
    <span>Did you know that unbanked households can face higher risks?</span>
    <a href="/analysis/household-survey">Read the research</a><span>.</span>
  </fd-social-media-item>

  <fd-social-media-item
    timestamp="Aug. 23, 2024 · 1:25 PM"
    image-src="/images/social/office-hours.png"
    image-alt="Blue virtual event graphic for an Office Hours Session on diversity self-assessment."
    platforms="instagram x linkedin"
  >
    <span>Join an FDIC office hours session for FDIC-supervised banks.</span>
    <a href="/events">Learn more</a><span>.</span>
  </fd-social-media-item>
</fd-social-media-list>
```

### Implementation guide

- **Author direct item children.** The list applies list-item semantics only to direct `fd-social-media-item` children.
- **Use `label` only when needed.** If a visible heading already names the section, leave `label` unset to avoid redundant announcements.
- **Choose `columns` for intended density.** `2`, `3`, and `4` map to the shared collection layout recipes.
- **Let the application own state.** Filtering, sorting, removal, analytics, and feed refresh behavior stay outside this component.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `columns` | `"2"` \| `"3"` \| `"4"` | `3` | Preferred FDIC collection column constraint set. |
| `label` | `string \| undefined` | `undefined` | Optional accessible label applied to the internal list wrapper when nearby visible copy does not already name the set. |

`fd-social-media-list` is a static grouping container. It does not own active-item, selection, removal, sorting, or keyboard navigation state.

## Slots

| Name | Description |
|---|---|
| (default) | Author direct `fd-social-media-item` children. Each direct child receives list-item semantics. |

`fd-social-media-list` assigns `role="listitem"` to direct `fd-social-media-item` children.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-social-media-list-col-2-min` | `var(--fdic-layout-col-2-min, 384px)` | Desktop minimum track width for the two-column constraint set. |
| `--fd-social-media-list-col-2-max` | `var(--fdic-layout-col-2-max, 688px)` | Desktop maximum track width for the two-column constraint set. |
| `--fd-social-media-list-col-2-gap` | `var(--fdic-layout-col-2-gap, 48px)` | Desktop row and column gap for the two-column constraint set. |
| `--fd-social-media-list-col-3-min` | `344px` | Desktop minimum track width for the three-column constraint set. |
| `--fd-social-media-list-col-3-gap` | `var(--fdic-layout-col-3-gap, 48px)` | Desktop column gap for the three-column constraint set. |
| `--fd-social-media-list-col-3-row-gap` | `var(--fdic-layout-col-3-gap, 48px)` | Desktop row gap for the three-column constraint set. |
| `--fd-social-media-list-col-4-min` | `var(--fdic-layout-col-4-min, 256px)` | Desktop minimum track width for the four-column constraint set. |
| `--fd-social-media-list-col-4-max` | `var(--fdic-layout-col-4-max, 320px)` | Desktop maximum track width for the four-column constraint set. |
| `--fd-social-media-list-col-4-gap` | `var(--fdic-layout-col-4-gap, 48px)` | Desktop row and column gap for the four-column constraint set. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Responsive list/grid wrapper. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- The component renders an internal container with `role="list"`.
- Direct `fd-social-media-item` children receive `role="listitem"` automatically.
- The component adds no custom keyboard behavior. Focus follows the native links inside each item in source order.
- The component does not manage focus recovery because it does not remove items.
- The responsive layout must preserve readable text reflow at narrow widths and browser zoom.

## Known limitations

- Only direct `fd-social-media-item` children receive managed list-item semantics.
- The component does not enforce item count, sorting, filtering, or platform consistency.
- Exact collapse thresholds are internal implementation details and may change.

## Related components

- [Social Media Item](/components/social-media-item) — the direct child component for individual posts.
- [Card Group](/components/card-group) — use for responsive groups of editorial cards.
- [Event List](/components/event-list) — use when date prominence matters more than social post media.
