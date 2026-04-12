# Event List

The Event List component arranges direct event children in a responsive wrapping layout, uses the shared public collection recipes for two-, three-, and four-column collections, adapts those recipes to the container's available inline space, and enforces one shared tone across the set.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-event-list</code> when a page needs a lightweight group of related events that should wrap from left to right and top to bottom without introducing composite interaction behavior.</p>
</div>

## When to use

- **Responsive groups of related events** — use Event List when one event row is not enough and the set should wrap naturally across wider layouts.
- **Collections that should share one time-intent tone** — choose a single `tone` for the list so every grouped event uses the same warm, neutral, or cool treatment.
- **Layouts that need a specific collection density** — choose `columns="2"`, `columns="3"`, or `columns="4"` to align with the documented design-system collection recipes.
- **Pages that already provide visible section context** — use `label` only when nearby visible copy does not already name the set clearly.

## When not to use

- **Do not use Event List for selection or active-item management** — it is a static grouping container, not a menu, listbox, or carousel.
- **Do not mix tones inside one list** — split the content into multiple lists if official, future, and past events need to be presented separately.
- **Do not use it for long-form chronology content** — prose timelines, agendas, and schedules need a different pattern.

## Examples

<StoryEmbed
  storyId="components-event-list--docs-overview"
  linkStoryId="components-event-list--playground"
  caption="Event List provides responsive wrapping, list semantics, and one shared tone for direct <code>fd-event</code> children. Open Storybook to inspect density and tone variations."
/>

### Basic usage

```html
<fd-event-list label="Upcoming events" tone="cool">
  <fd-event
    id="banking-conference"
    month="SEP"
    day="18"
    title="FFIEC International Banking Conference"
    href="/events/ffiec-international-banking-conference"
  ></fd-event>

  <fd-event
    id="board-meeting"
    month="SEP"
    day="18"
    title="Board Meeting"
  ></fd-event>
</fd-event-list>

<script type="module">
  document.getElementById("banking-conference").metadata = [
    "FDIC-wide",
    "Conference",
  ];
  document.getElementById("board-meeting").metadata = [
    "FDIC-wide",
    "Conference",
  ];
</script>
```

### Implementation guide

- **Author direct `fd-event` children.** `fd-event-list` assigns list-item semantics and shared tone to direct children only.
- **Set tone on the list, not on individual grouped events.** The list enforces one shared tone so a set reads as one coherent group.
- **Use `label` only when needed.** If visible heading text already names the set, leave `label` unset to avoid redundant announcements.
- **Choose `columns` for the preferred desktop density.** `2`, `3`, and `4` map to the public `--fdic-layout-col-2-*`, `--fdic-layout-col-3-*`, and `--fdic-layout-col-4-*` recipe families.
- **Treat the list as a collection contract, not a page-layout utility.** The shared `--fdic-layout-col-*` tokens are stable for collection wrappers; section shells and split layouts use the separate foundations layout contract.
- **Let the layout wrap naturally.** The component shifts from the intended desktop density to the narrow-screen recipe based on the container's available inline space instead of relying on viewport breakpoints.
- **Treat collapse thresholds as internal.** The component is intentionally container-aware, but the exact threshold where it changes track behavior is not a published API guarantee.
- **Keep grouping honest.** Event List does not add active state, filtering, sorting, or focus management. Those remain application concerns.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `columns` | `"2"` \| `"3"` \| `"4"` | `3` | Preferred FDIC Figma column constraint set. `2`, `3`, and `4` map to the design-system `col-2`, `col-3`, and `col-4` min/max/gap metrics. |
| `label` | `string \| undefined` | `undefined` | Optional accessible label applied to the internal list wrapper when nearby visible copy does not already name the set. |
| `tone` | `"neutral" \| "cool" \| "warm"` | `neutral` | Shared decorative tone applied to each direct `fd-event` child in the list. |

- `fd-event-list` is a static grouping container. It does not own active-item, selection, or keyboard navigation state.

## Slots

| Name | Description |
|---|---|
| (default) | Author one or more direct `fd-event` children. Each direct child inherits the list's shared tone. |

- `fd-event-list` assigns `role="listitem"` to direct `fd-event` children so the group is announced as a list without making the events themselves interactive.
- `fd-event-list` also applies a single shared `tone` to each direct child event.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-event-list-col-2-min` | `var(--fdic-layout-col-2-min, 384px)` | Desktop minimum event-track width for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-2-max` | `var(--fdic-layout-col-2-max, 688px)` | Desktop maximum event-track width for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-2-gap` | `var(--fdic-layout-col-2-gap, 48px)` | Desktop row and column gap for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-3-min` | `var(--fdic-layout-col-3-min, 360px)` | Desktop minimum event-track width for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-3-max` | `var(--fdic-layout-col-3-max, 440px)` | Desktop maximum event-track width for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-3-gap` | `var(--fdic-layout-col-3-gap, 48px)` | Desktop row and column gap for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-4-min` | `var(--fdic-layout-col-4-min, 256px)` | Desktop minimum event-track width for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-4-max` | `var(--fdic-layout-col-4-max, 320px)` | Desktop maximum event-track width for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-4-gap` | `var(--fdic-layout-col-4-gap, 48px)` | Desktop row and column gap for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-2-min-mobile` | `var(--fdic-layout-col-2-min-narrow, 320px)` | Narrow-screen minimum event-track width for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-2-gap-mobile` | `var(--fdic-layout-col-2-gap-narrow, 16px)` | Narrow-screen row and column gap for the two-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-3-min-mobile` | `var(--fdic-layout-col-3-min-narrow, 200px)` | Narrow-screen minimum event-track width for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-3-gap-mobile` | `var(--fdic-layout-col-3-gap-narrow, 16px)` | Narrow-screen row and column gap for the three-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-4-min-mobile` | `var(--fdic-layout-col-4-min-narrow, 160px)` | Narrow-screen minimum event-track width for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-4-max-mobile` | `var(--fdic-layout-col-4-max-narrow, 180px)` | Narrow-screen maximum event-track width for the four-column constraint set. Defaults to the shared layout column token. |
| `--fd-event-list-col-4-gap-mobile` | `var(--fdic-layout-col-4-gap-narrow, 16px)` | Narrow-screen row and column gap for the four-column constraint set. Defaults to the shared layout column token. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Responsive list/grid wrapper. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- `fd-event-list` renders an internal container with **`role="list"`**.
- Direct `fd-event` children receive **`role="listitem"`** automatically.
- Direct children also receive the list's shared **`tone`** automatically.
- The component adds **no custom keyboard model**. Keyboard focus remains on links inside each event in normal source order.
- `label` becomes the accessible name of the list only when authors provide it.

## Known limitations

- The component expects **direct `fd-event` children** for its list-item semantics and shared-tone behavior.
- The component expects **one shared tone per list**. Use separate lists when content groups need different time-intent treatments.
- Event List does not manage focus, sorting, filtering, selection, or removal.
- Exact collapse thresholds are internal implementation details and may change.

## Related components

- [Event](/components/event) — the dated content shell this layout is designed to group.
- [Tile List](/components/tile-list) — review Tile List when the grouped content is destination-oriented rather than date-oriented.
