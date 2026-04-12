# Card Group

The Card Group component arranges related `fd-card` items into a responsive collection using the shared public two-, three-, and four-column layout recipes, then adapts those recipes based on the container's available inline space.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-card-group</code> when a page needs several peer cards to scan as one set. The component owns responsive wrapping, width constraints, and list semantics so consuming pages do not have to recreate that layout logic.</p>
</div>

## When to use

- **Editorial or resource collections** — use `fd-card-group` when multiple cards represent one peer set of updates, reports, or links.
- **Responsive card grids that must stay inside the documented collection recipes** — the component applies the shared `col-2`, `col-3`, and `col-4` layout ranges directly.
- **Accessible card sets** — `fd-card-group` adds list semantics to the collection and direct `fd-card` children.

## When not to use

- **Do not use it for unrelated promotional blocks** — if the items are not one coherent set, separate them with headings or distinct regions instead.
- **Do not use it when cards need carousel, paging, or masonry behavior** — `fd-card-group` is intentionally a straightforward left-to-right, top-to-bottom flow container.
- **Do not use it to force custom card widths** — the component is designed around the documented collection recipes and should not become an arbitrary grid utility.

## Examples

<StoryEmbed
  storyId="components-card-group--docs-overview"
  linkStoryId="components-card-group--playground"
  caption="Card Group supports the shared two-, three-, and four-column collection recipes while preserving responsive reflow."
/>

### Basic usage

```html
<fd-card-group columns="3" label="Latest updates">
  <fd-card
    size="large"
    category="Press release"
    title="Quarterly banking profile"
    href="/news/quarterly-banking-profile"
    metadata="April 3, 2026"
    image-src="/images/quarterly-banking-profile.jpg"
  ></fd-card>
  <fd-card
    size="large"
    category="Statement"
    title="Annual consumer compliance outlook"
    href="/news/annual-consumer-compliance-outlook"
    metadata="March 18, 2026"
    image-src="/images/annual-consumer-compliance-outlook.jpg"
  ></fd-card>
</fd-card-group>
```

### Implementation guide

- **Choose `columns` for the preferred desktop density.** `2`, `3`, and `4` map to the public `--ds-layout-col-2-*`, `--ds-layout-col-3-*`, and `--ds-layout-col-4-*` recipe families.
- **Treat the list as a collection contract, not a general page grid.** The shared `--ds-layout-col-*` tokens are stable for collection wrappers; broader page-layout gaps and shells live in the foundations layout contract instead.
- **Let the component own reflow.** `fd-card-group` adapts from the intended desktop density to the narrow-screen recipe based on the container's available inline space instead of relying on viewport breakpoints.
- **Treat collapse thresholds as internal.** The component is intentionally container-aware, but the exact threshold where it changes track behavior is not a published API guarantee.
- **Use a nearby heading first, then `label` only when needed.** If visible copy already names the set, the accessible label may be omitted.
- **Slot direct `fd-card` children.** The component assigns `role="listitem"` only to direct `fd-card` children so the announced structure matches the visible collection.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `columns` | `"2"` \| `"3"` \| `"4"` | `3` | Preferred FDIC Figma column constraint set. `2`, `3`, and `4` map to the design-system `col-2`, `col-3`, and `col-4` min/max/gap metrics. |
| `label` | `string \| undefined` | `undefined` | Optional accessible label applied to the internal list wrapper when nearby visible copy does not already name the set. |

- `fd-card-group` is a static grouping container. It does not own selection, active-item, or carousel behavior.

## Slots

| Name | Description |
|---|---|
| (default) | One or more direct `fd-card` children. Direct `fd-card` children receive `role="listitem"` automatically. |

- `fd-card-group` keeps the collection semantics on the wrapper and leaves each card's internal interactive behavior unchanged.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-card-group-col-2-min` | `var(--ds-layout-col-2-min, 384px)` | Desktop minimum card-track width for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-2-max` | `var(--ds-layout-col-2-max, 688px)` | Desktop maximum card-track width for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-2-gap` | `var(--ds-layout-col-2-gap, 48px)` | Desktop row and column gap for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-3-min` | `var(--ds-layout-col-3-min, 360px)` | Desktop minimum card-track width for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-3-max` | `var(--ds-layout-col-3-max, 440px)` | Desktop maximum card-track width for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-3-gap` | `var(--ds-layout-col-3-gap, 48px)` | Desktop row and column gap for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-4-min` | `var(--ds-layout-col-4-min, 256px)` | Desktop minimum card-track width for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-4-max` | `var(--ds-layout-col-4-max, 320px)` | Desktop maximum card-track width for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-4-gap` | `var(--ds-layout-col-4-gap, 48px)` | Desktop row and column gap for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-2-min-mobile` | `var(--ds-layout-col-2-min-narrow, 320px)` | Narrow-screen minimum card-track width for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-2-gap-mobile` | `var(--ds-layout-col-2-gap-narrow, 16px)` | Narrow-screen row and column gap for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-3-min-mobile` | `var(--ds-layout-col-3-min-narrow, 200px)` | Narrow-screen minimum card-track width for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-3-gap-mobile` | `var(--ds-layout-col-3-gap-narrow, 16px)` | Narrow-screen row and column gap for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-4-min-mobile` | `var(--ds-layout-col-4-min-narrow, 160px)` | Narrow-screen minimum card-track width for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-4-max-mobile` | `var(--ds-layout-col-4-max-narrow, 180px)` | Narrow-screen maximum card-track width for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-card-group-col-4-gap-mobile` | `var(--ds-layout-col-4-gap-narrow, 16px)` | Narrow-screen row and column gap for the four-column constraint set. Defaults to the shared layout column token. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Responsive list/grid wrapper. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- `fd-card-group` renders a semantic list container and applies `role="listitem"` to each direct `fd-card` child.
- The component does not add custom keyboard interaction. Keyboard focus remains on the interactive elements inside each card, such as the native title link in `fd-card`.
- The responsive grid preserves zoom and reflow because cards wrap as inline space tightens and the layout switches recipes based on container width rather than page-level breakpoints.

## Known limitations

- `fd-card-group` only assigns listitem semantics to direct `fd-card` children. Nested wrappers will interrupt that behavior.
- The component is intentionally layout-only. It does not normalize card heights, equalize copy length, or provide carousel controls.
- Exact collapse thresholds are internal implementation details and may change.

## Related components

- [Card](/components/card) — use `fd-card` for the individual editorial preview item placed inside the group.
- [Tile List](/components/tile-list) — use `fd-tile-list` for destination-oriented tile collections that do not need card media framing.
