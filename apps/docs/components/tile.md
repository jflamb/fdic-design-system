# Tile

The Tile component presents one primary destination with a decorative circular icon, optional supporting description, and an optional stack of related links.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-tile</code> when people need to scan a short summary and move to the right destination quickly. The tile keeps its shell static and lets the actual links stay native, so keyboarding and navigation remain predictable.</p>
</div>

## When to use

- **One primary destination with lightweight supporting context** — a tile works well when the main title is the first link people should notice.
- **Small groups of related follow-up links** — use the optional supporting links when the tile needs a few tightly related destinations, not a full navigation menu.
- **Decorative icon grouping** — the internal visual helps scanning, but it stays decorative and does not replace the visible text.

## When not to use

- **Do not use Tile as a giant clickable card** — the component is intentionally not a single action surface in v1.
- **Do not use it for selection, toggling, or dismissal** — Tile owns layout only, not interactive state.
- **Do not use more than four supporting links** — if the content needs deeper navigation, move to a broader list or page-level navigation pattern.

## Examples

<StoryEmbed
  storyId="components-tile--docs-overview"
  linkStoryId="components-tile--playground"
  caption="Tile keeps the shell static while its responsive sizing grows from compact to larger layouts. Open Storybook to inspect the property-driven link stack and tone options."
/>

### Basic usage

```html
<fd-tile
  id="benefits-tile"
  tone="cool"
  icon-name="download"
  title="Benefits"
  href="/benefits"
  description="Review insurance, leave, and retirement resources in one place."
></fd-tile>

<script type="module">
  const tile = document.getElementById("benefits-tile");

  tile.links = [
    { label: "Plan overview", href: "/benefits/overview" },
    { label: "Enrollment deadlines", href: "/benefits/deadlines" },
  ];
</script>
```

### Implementation guide

- **Keep the tile shell non-interactive.** The component renders a static article wrapper. Navigation belongs to the rendered native links, not the surrounding shell.
- **Treat the visual as decorative.** `icon-name` selects the decorative icon inside the internal `fd-visual`. The icon is excluded from assistive technology, so the title and description must carry the meaning.
- **Set `links` as a JavaScript property.** Supporting links are structured data, not an HTML string or JSON attribute. This keeps the rendered link list predictable and avoids fragile parsing contracts.
- **Limit supporting links to closely related destinations.** The component renders at most the first four valid link objects. If the content needs more destinations, use a broader content list or page navigation instead of overloading one tile.
- **Let the component size itself responsively.** `fd-tile` uses container queries internally, so the same API can render the small, medium, and large Figma family without a public size variant.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "cool" \| "warm"` | `neutral` | Decorative visual tone passed to the internal `fd-visual`. |
| `icon-name` | `string \| undefined` | `undefined` | Optional Phosphor registry icon name rendered inside the decorative visual. When omitted, `fd-visual` falls back to its built-in archive glyph. |
| `title` | `string` | `` | Visible primary text for the tile. |
| `href` | `string \| undefined` | `undefined` | Optional destination for the primary title. When omitted, the title renders as plain text. |
| `target` | `string \| undefined` | `undefined` | Native link target applied to the primary title link. |
| `rel` | `string \| undefined` | `undefined` | Native relationship tokens applied to the primary title link. `target="_blank"` always adds `noopener noreferrer`. |
| `description` | `string \| undefined` | `undefined` | Optional supporting copy rendered under the primary title. |
| `links` | `FdTileLinkItem[]` | `[]` | Optional supporting links rendered below the description. Set this as a JavaScript property; the component renders at most the first four valid entries. |

- `fd-tile` is static in v1. It owns decorative framing and layout only; the application owns link destinations, text content, analytics, and any dynamic item lifecycle.
- The host shell is intentionally non-interactive. Keyboard focus lands only on the rendered native links.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-tile-gap` | `12px` | Gap between the decorative visual and the text column before larger responsive breakpoints. |
| `--fd-tile-link-color` | `var(--ds-color-text-link, #1278b0)` | Primary and supporting link color. |
| `--fd-tile-description-color` | `var(--ds-color-text-secondary, #595961)` | Supporting description color. |
| `--fd-tile-links-gap` | `4px` | Gap between supporting links in the optional link stack. |

- The component also forwards the internal `fd-visual` sizing hooks by setting `--fd-visual-size`, `--fd-visual-padding`, and `--fd-visual-content-size` responsively. Prefer the documented tile-level hooks before overriding the nested visual directly.

## Shadow parts

| Name | Description |
|---|---|
| `base` | Root article wrapper. |
| `visual` | Decorative visual track that contains the internal `fd-visual`. |
| `content` | Text and supporting-links column. |
| `title` | Primary title wrapper. |
| `description` | Supporting description paragraph. |
| `links` | Optional supporting-links list. |
| `link-item` | Individual supporting-link list item. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-best-practices">

**Do**

- Use clear, destination-oriented title text such as “Benefits” or “Vision insurance.”
- Keep the description brief enough to scan in one or two lines when possible.
- Reserve supporting links for a few closely related tasks, not a secondary navigation tree.

**Don't**

- Don’t rely on the icon alone to explain what the tile means.
- Don’t hide the only destination behind supporting links while leaving the title non-clickable without a good reason.
- Don’t turn the shell into a custom focus target or add click handlers around the whole tile.

</div>

## Accessibility

- `fd-tile` is **not hidden from assistive technology**. It renders a semantic article wrapper labelled by the visible title when a title is present.
- The tile shell is **not focusable**. Keyboard users move directly to the native links in the plain tab order.
- The decorative icon stays **`aria-hidden`** through the internal `fd-visual`.
- When the primary title has no `href`, it renders as plain text instead of a fake link.
- Supporting links render as a semantic list when provided through the `links` property.

## Known limitations

- Supporting links are provided through a **JavaScript property**, not authored as arbitrary slotted markup.
- The component intentionally caps its rendered supporting links at **four**.
- Tile does not provide a clickable-card, selectable, or dismissible variant in v1.

## Related components

- [Tile List](/components/tile-list) — use `fd-tile-list` to arrange related tiles in a responsive set.
- [Visual](/components/visual) — Tile composes `fd-visual` internally for the decorative circular cue.
- [Link](/components/link) — review broader link guidance when choosing destination labels and hierarchy.
