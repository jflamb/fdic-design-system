# Tile List

The Tile List component arranges related tiles in a responsive wrapping layout and enforces one shared visual tone across every tile in the set.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-tile-list</code> when a page needs a compact set of related destinations that should wrap naturally from one column to multiple columns. The component owns only layout and grouping semantics; each tile still owns its own content and links.</p>
</div>

## When to use

- **Groups of related tiles** — use Tile List when the set itself needs a consistent responsive layout.
- **Sets that should share one visual type** — choose a single `tone` on the list so every grouped tile uses the same cool, neutral, or warm treatment.
- **Content collections that should reflow across screen sizes** — the component uses a responsive grid that collapses naturally without additional author CSS.
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
- **Let the layout wrap naturally.** The component defaults to a `344px` minimum preferred column size. Override the documented CSS custom properties only when a page layout truly needs denser or looser wrapping.
- **Keep grouping honest.** Tile List does not add composite keyboarding or item state. If the interaction starts behaving like a menu, selector, or card-action grid, use a different pattern instead.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
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
| `--fd-tile-list-min-column-size` | `344px` | Minimum preferred inline size for each responsive tile column. |
| `--fd-tile-list-row-gap` | `20px` | Gap between tile rows. |
| `--fd-tile-list-column-gap` | `24px` | Gap between tile columns. |

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

## Related components

- [Tile](/components/tile) — the content shell this layout is designed to group.
- [Link](/components/link) — use plain-language destination labels inside each tile.
