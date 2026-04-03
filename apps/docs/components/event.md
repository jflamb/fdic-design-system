# Event

The Event component presents a dated event summary with a visible month and day block, an optional native title link, and lightweight metadata.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-event</code> when people need to scan upcoming, current, or past events quickly without turning the entire row into a custom interactive surface. The component keeps its shell static and lets the title remain a native link when navigation is needed.</p>
</div>

## When to use

- **Short event summaries with a clear primary destination** — use Event when the title is the main thing people should notice and optionally open.
- **Time-based lists that benefit from lightweight tone guidance** — the visible date block helps people scan repeated event rows quickly.
- **Metadata that can stay brief and inline** — use the metadata row for a few short descriptors such as audience, format, or event type.

## When not to use

- **Do not use Event as a clickable card** — the shell is intentionally static in v1.
- **Do not use it for rich schedules or agenda content** — if the content needs times, speakers, descriptions, or actions, use a broader content pattern.
- **Do not rely on tone alone to communicate timing or status** — the visible text still needs to explain the event.

## Examples

<StoryEmbed
  storyId="components-event--docs-overview"
  linkStoryId="components-event--playground"
  caption="Event keeps the shell non-interactive while the title can remain a native link. Open Storybook to inspect linked, unlinked, and tone variations."
/>

### Basic usage

```html
<fd-event
  id="ffiec-event"
  tone="cool"
  month="SEP"
  day="18"
  title="FFIEC International Banking Conference"
  href="/events/ffiec-international-banking-conference"
></fd-event>

<script type="module">
  const event = document.getElementById("ffiec-event");

  event.metadata = ["FDIC-wide", "Conference"];
</script>
```

### Implementation guide

- **Keep the shell static.** `fd-event` does not own click handling on the host. Navigation belongs to the native title link when one is present.
- **Pass metadata as a JavaScript property.** Use `metadata` for short supporting details so the component can keep punctuation and wrapping consistent.
- **Use visible month and day text.** The date block is part of the event content. Treat it as user-facing information, not as purely decorative ornament.
- **Use tone as supporting context only.** Follow the Figma guidance: `warm` for official public-facing events, `neutral` for past events, and `cool` for future events. Do not rely on tone alone to convey timing.
- **Keep the title short enough to scan.** The component clamps the title to two lines, so use concise event names and move extra detail elsewhere.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "cool" \| "warm"` | `neutral` | Decorative tone applied to the visible month and day block. |
| `month` | `string` | `` | Visible month text shown in the date block. Author uppercase abbreviations when that presentation matters. |
| `day` | `string` | `` | Visible day text shown in the date block. |
| `title` | `string` | `` | Visible event title. When `href` is supplied, the title renders as the primary native link. |
| `href` | `string \| undefined` | `undefined` | Optional destination for the event title. When omitted, the title renders as plain text. |
| `target` | `string \| undefined` | `undefined` | Native link target applied to the title link. |
| `rel` | `string \| undefined` | `undefined` | Native relationship tokens applied to the title link. `target="_blank"` always adds `noopener noreferrer`. |
| `metadata` | `string[]` | `[]` | Lightweight metadata items rendered in a single wrapped list below the title. Set this as a JavaScript property. |

- `fd-event` is static in v1. It owns presentation only; the application owns event routing, sorting, filtering, analytics, and lifecycle.
- The host shell is intentionally non-interactive. Keyboard focus lands only on the rendered native title link when present.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-event-gap` | `12px` | Gap between the date block and the text column. |
| `--fd-event-link-color` | `var(--ds-color-text-link, #1278b0)` | Linked title color. |
| `--fd-event-metadata-color` | `var(--ds-color-text-secondary, #595961)` | Metadata text color. |
| `--fd-event-date-size` | `48px` | Visible month/day block size. |

- The component exposes tone-specific date-block hooks such as `--fd-event-date-bg-warm` and `--fd-event-date-bg-cool` when a product needs to align the event family to a different token mapping without changing the public API.

## Shadow parts

| Name | Description |
|---|---|
| `base` | Root article wrapper. |
| `date` | Visible month and day block. |
| `month` | Month text inside the date block. |
| `day` | Day text inside the date block. |
| `content` | Text column containing the title and metadata. |
| `title` | Title wrapper. |
| `metadata` | Wrapped metadata list. |
| `metadata-item` | Individual metadata list item. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- `fd-event` is **not hidden from assistive technology**. The visible month/day text remains part of the exposed event content.
- The shell is **not focusable**. Keyboard users move only to the native title link when `href` is provided.
- The host does **not** add custom keyboard shortcuts, roving focus, or composite navigation behavior.
- Metadata renders as a semantic list so assistive technology does not depend on visual separator characters alone.
- When the title has no `href`, it renders as plain text instead of a fake link.

## Known limitations

- Metadata is provided through the **`metadata` JavaScript property**, not through arbitrary slotted markup.
- The component intentionally accepts **visible month and day strings**, not parsed dates or timezone-aware date objects, in v1.
- Event does not provide action buttons, dismissal, selection, or expanded details in v1.

## Related components

- [Event List](/components/event-list) — use `fd-event-list` to arrange multiple events in a responsive set.
- [Tile](/components/tile) — review Tile when the content is more destination-oriented than date-oriented.
- [Link](/components/link) — use clear event titles and destination text when the title is clickable.
