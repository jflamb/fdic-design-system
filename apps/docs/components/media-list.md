# Media List

The Media List component groups Media Items in a responsive, left-to-right and top-to-bottom layout.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-media-list</code> when several <code>fd-media-item</code> elements need the same responsive collection behavior as social media item lists, event lists, and tile lists. The list owns layout and list semantics only; applications own the media catalog and any browse workflow state.</p>
</div>

## When to use

- **Related media resources** — use it for a small set of videos, recordings, tutorials, or training resources.
- **Responsive collection layout** — use it when items should wrap naturally from left to right and top to bottom.
- **Consistent item anatomy** — use it when each child is a direct `fd-media-item`.

## When not to use

- **Do not use it for searchable archives** — filtering, sorting, pagination, and result counts belong to a larger search or browse pattern.
- **Do not use it as a carousel** — all items should remain available without forcing in-component scrolling.
- **Do not place unrelated children directly inside it** — direct children should be `fd-media-item` elements so list semantics stay predictable.

## Examples

<StoryEmbed
  storyId="components-media-list--docs-overview"
  linkStoryId="components-media-list--playground"
  caption="Media List groups direct Media Item children using the shared responsive collection layout."
/>

### Basic usage

```html
<fd-media-list label="Training videos">
  <fd-media-item
    heading="Safeguarding Customer Credit Card Data: PCI Compliance"
    href="/resources/bankers/information-technology/"
    metadata="1h 3m  ·  Beginner  ·  2 months ago"
    image-src="/images/media/pci-compliance.png"
    image-alt="Illustration of a protected credit card transaction."
  ></fd-media-item>
  <fd-media-item
    heading="FDIC failed bank exercise"
    href="/resources/resolutions/bank-failures/"
    metadata="1m 23s  ·  Updated Oct 2023"
    image-src="/images/media/failed-bank-exercise.png"
    image-alt=""
  ></fd-media-item>
</fd-media-list>
```

### Implementation guide

- **Use `label` when the surrounding heading is not enough.** The label becomes the list's accessible name.
- **Choose columns deliberately.** The default is `3`; use `2` or `4` only when the surrounding layout needs it.
- **Keep children direct.** The component applies `role="listitem"` to direct element children so the internal ARIA list stays valid. Use direct `fd-media-item` children for supported layout and item anatomy.
- **Limit the set.** For large archives, use a dedicated browse page with filtering and pagination.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `columns` | `"2"` \| `"3"` \| `"4"` | `3` | Preferred desktop column count. Narrow containers automatically wrap to fewer columns. |
| `label` | `string \| undefined` | `undefined` | Optional accessible label for the internal list. |
| `labelledby` | `string \| undefined` | `undefined` | ID reference for visible copy that labels the internal list. The component resolves the referenced light-DOM text into a shadow-local `aria-labelledby` proxy. Takes precedence over `label` when found. |

`fd-media-list` is a static grouping container. It does not own active-item, selection, removal, sorting, playback, or keyboard navigation state.

## Slots

| Name | Description |
|---|---|
| (default) | Author direct `fd-media-item` children. Each direct child receives list-item semantics. |

`fd-media-list` assigns `role="listitem"` to direct `fd-media-item` children. Other direct element children are not managed.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-media-list-col-2-min` | `var(--fdic-layout-col-2-min)` | Minimum track size for two-column layout. |
| `--fd-media-list-col-2-max` | `var(--fdic-layout-col-2-max)` | Maximum track size for two-column layout. |
| `--fd-media-list-col-2-gap` | `var(--fdic-layout-col-2-gap)` | Column gap for two-column layout. |
| `--fd-media-list-col-3-min` | `var(--fdic-layout-col-3-min, 320px)` | Minimum track size for three-column layout. |
| `--fd-media-list-col-3-gap` | `var(--fdic-layout-col-3-gap)` | Column gap for three-column layout. |
| `--fd-media-list-col-3-row-gap` | `var(--fdic-layout-section-block-padding-compact, 24px)` | Row gap for three-column layout. |
| `--fd-media-list-col-4-min` | `var(--fdic-layout-col-4-min)` | Minimum track size for four-column layout. |
| `--fd-media-list-col-4-max` | `var(--fdic-layout-col-4-max)` | Maximum track size for four-column layout. |
| `--fd-media-list-col-4-gap` | `var(--fdic-layout-col-4-gap)` | Column gap for four-column layout. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Internal responsive list wrapper. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- The list renders an internal `role="list"` wrapper and applies `role="listitem"` to direct element children.
- The list does not create a composite widget. There is no roving tabindex, arrow-key navigation, or selection model.
- Focus remains on each item's native media link in source order.
- The component does not manage focus recovery because it is not dismissible and does not remove items.
- Use clear, unique item headings so assistive technology users can distinguish links when reviewing a page's link list.

## Known limitations

- The list does not own loading, empty, error, filtering, sorting, pagination, selection, playback, or removal state.
- Non-`fd-media-item` direct children receive list-item semantics, but they are not a supported content pattern for layout or item anatomy.

## Related components

- [Media Item](/components/media-item) — required direct child item for this list.
- [Social Media List](/components/social-media-list) — use for responsive groups of social post summaries.
- [Event List](/components/event-list) and [Tile List](/components/tile-list) — related collection layouts with different item anatomy.
