# Tile List

The Tile List component arranges related tiles in a responsive wrapping layout, uses the shared public collection recipes for two-, three-, and four-column collections, adapts those recipes to the container's available inline space, and enforces one shared visual tone across every tile in the set.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-tile-list</code> when a page needs a compact set of related destinations that should wrap naturally from one column to multiple columns. The component owns only layout and grouping semantics; each tile still owns its own content and links.</p>
</div>

## When to use

- **Groups of related tiles** — use Tile List when the set itself needs a consistent responsive layout.
- **Sets that should share one visual type** — choose a single `tone` on the list so every grouped tile uses the same cool, neutral, or warm treatment.
- **Content collections that should reflow across screen sizes** — the component uses a responsive grid that collapses naturally without additional author CSS.
- **Layouts that need a specific collection density** — choose `columns="2"`, `columns="3"`, or `columns="4"` to align with the documented design-system collection recipes.
- **Sets that already have visible context nearby** — provide `label` only when the surrounding content does not already name the set clearly.

## When not to use

- **Do not use Tile List for selection or active-item management** — it is a static grouping container, not a carousel, menu, or roving-focus list.
- **Do not mix tile tones within one list** — if content groups need different visual types, split them into separate lists.
- **Do not use it when the content should be a prose list or table instead** — Tile List is for short, visually grouped summaries.
- **Do not use it to force equal-height cards with dense content** — the pattern is tuned for lightweight summaries, not long bodies of text.

## Examples

<StoryEmbed
  storyId="components-tile-list--docs-overview"
  linkStoryId="components-tile-list--playground"
  caption="Tile List provides responsive wrapping, list semantics, and one shared tone for direct `fd-tile` children. Open Storybook to inspect spacing variants and tone examples."
/>

### Basic usage

```html
<fd-tile-list label="Benefits links" tone="cool">
  <fd-tile
    id="health-tile"
    icon-name="download"
    title="Dental insurance"
    href="/benefits/dental"
    description="Review plan summaries, enrollment steps, and provider details."
  ></fd-tile>

  <fd-tile
    icon-name="eye"
    title="Vision insurance"
    href="/benefits/vision"
    description="Compare coverage, network options, and annual deadlines."
  ></fd-tile>
</fd-tile-list>

<script type="module">
  document.getElementById("health-tile").links = [
    { label: "Plan overview", href: "/benefits/dental/overview" },
    { label: "Enrollment deadlines", href: "/benefits/dental/deadlines" },
  ];
</script>
```

### Implementation guide

- **Author direct `fd-tile` children.** `fd-tile-list` assigns list-item semantics to direct tile children so assistive technology announces the set as a list.
- **Set the tone on the list, not on individual grouped tiles.** `fd-tile-list` applies one shared `tone` to every direct `fd-tile` child, so a single list cannot mix cool, neutral, and warm visuals.
- **Use `label` only when needed.** If nearby visible copy already names the set, leave `label` unset to avoid redundant announcements.
- **Choose `columns` for the preferred desktop density.** `2`, `3`, and `4` map to the public `--ds-layout-col-2-*`, `--ds-layout-col-3-*`, and `--ds-layout-col-4-*` recipe families.
- **Treat the list as a collection contract, not a page-layout utility.** The shared `--ds-layout-col-*` tokens are stable for collection wrappers; general section and split spacing belong to the foundations layout contract.
- **Let the layout wrap naturally.** The component shifts from the intended desktop density to the narrow-screen recipe based on the container's available inline space instead of relying on viewport breakpoints.
- **Treat collapse thresholds as internal.** The component is intentionally container-aware, but the exact threshold where it changes track behavior is not a published API guarantee.
- **Keep grouping honest.** Tile List does not add composite keyboarding or item state. If the interaction starts behaving like a menu, selector, or card-action grid, use a different pattern instead.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `columns` | `"2"` \| `"3"` \| `"4"` | `3` | Preferred collection recipe. `2`, `3`, and `4` map to the design-system `col-2`, `col-3`, and `col-4` min/max/gap metrics. |
| `label` | `string \| undefined` | `undefined` | Optional accessible label applied to the internal list wrapper when nearby visible copy does not already name the set. |
| `tone` | `"neutral" \| "cool" \| "warm"` | `neutral` | Shared decorative visual tone applied to each direct `fd-tile` child in the list. |

- `fd-tile-list` is a static grouping container. It does not own selection, active-item, or keyboard navigation state.

## Slots

| Name | Description |
|---|---|
| (default) | Author one or more `fd-tile` children. Each direct child inherits the list's shared tone. |

- `fd-tile-list` assigns `role="listitem"` to direct `fd-tile` children so the group is announced as a list without making the tiles themselves interactive.
- `fd-tile-list` also applies a single shared `tone` to each direct `fd-tile` child so one list cannot mix cool, neutral, and warm tile visuals.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-tile-list-col-2-min` | `var(--ds-layout-col-2-min, 384px)` | Desktop minimum tile-track width for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-2-max` | `var(--ds-layout-col-2-max, 688px)` | Desktop maximum tile-track width for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-2-gap` | `var(--ds-layout-col-2-gap, 48px)` | Desktop row and column gap for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-3-min` | `var(--ds-layout-col-3-min, 360px)` | Desktop minimum tile-track width for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-3-max` | `var(--ds-layout-col-3-max, 440px)` | Desktop maximum tile-track width for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-3-gap` | `var(--ds-layout-col-3-gap, 48px)` | Desktop row and column gap for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-4-min` | `var(--ds-layout-col-4-min, 256px)` | Desktop minimum tile-track width for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-4-max` | `var(--ds-layout-col-4-max, 320px)` | Desktop maximum tile-track width for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-4-gap` | `var(--ds-layout-col-4-gap, 48px)` | Desktop row and column gap for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-2-min-mobile` | `var(--ds-layout-col-2-min-narrow, 320px)` | Narrow-screen minimum tile-track width for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-2-gap-mobile` | `var(--ds-layout-col-2-gap-narrow, 16px)` | Narrow-screen row and column gap for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-3-min-mobile` | `var(--ds-layout-col-3-min-narrow, 200px)` | Narrow-screen minimum tile-track width for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-3-gap-mobile` | `var(--ds-layout-col-3-gap-narrow, 16px)` | Narrow-screen row and column gap for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-4-min-mobile` | `var(--ds-layout-col-4-min-narrow, 160px)` | Narrow-screen minimum tile-track width for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-4-max-mobile` | `var(--ds-layout-col-4-max-narrow, 180px)` | Narrow-screen maximum tile-track width for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-tile-list-col-4-gap-mobile` | `var(--ds-layout-col-4-gap-narrow, 16px)` | Narrow-screen row and column gap for the four-column constraint set. Defaults to the shared layout column token. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Responsive list/grid wrapper. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- `fd-tile-list` renders an internal container with **`role="list"`**.
- Direct `fd-tile` children receive **`role="listitem"`** automatically.
- Direct `fd-tile` children also receive the list's shared **`tone`** automatically.
- The component adds **no custom keyboard model**. Keyboard focus remains on the links inside each tile in normal source order.
- `label` becomes the accessible name of the list only when authors provide it.

## Known limitations

- The component expects **direct `fd-tile` children** for its list-item semantics.
- The component expects **one shared visual tone per list**. Use separate lists when sections need different tones.
- Tile List does not manage focus, selection, expansion, or removal.
- Layout tuning is intentionally narrow: column size and gaps only.
- Exact collapse thresholds are internal implementation details and may change.

## Related components

- [Tile](/components/tile) — the content shell this layout is designed to group.
- [Link](/components/link) — use plain-language destination labels inside each tile.
