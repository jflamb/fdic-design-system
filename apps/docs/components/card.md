# Card

The Card component presents a compact editorial preview with decorative media, a visible category, a title, and footer metadata.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-card</code> when people need a concise preview of a story or update without turning the whole shell into a custom interactive region. The title remains the native link when navigation is needed, and the image stays decorative in v1.</p>
</div>

## When to use

- **Editorial or news previews with one primary destination** — Card works well when the title is the main thing someone should open.
- **Image-forward summaries that still need semantic restraint** — the image supports scanning, but the visible text remains the meaningful content.
- **Mixed layouts with a shared anatomy** — the shipped `medium` and `large` sizes keep the same content contract while changing only the visual arrangement.

## When not to use

- **Do not use Card as a fully clickable surface** — the shell is intentionally static in v1.
- **Do not use it for galleries where the image itself needs its own meaning** — `fd-card` treats the image as decorative framing.
- **Do not use it for multi-action or rich teaser layouts** — badges, buttons, secondary links, and long body copy are out of scope.

## Examples

<StoryEmbed
  storyId="components-card--docs-overview"
  linkStoryId="components-card--playground"
  caption="Card supports two Figma-backed layout treatments while keeping the same narrow API. Open Storybook to inspect linked, unlinked, medium, and large examples."
/>

### Basic usage

```html
<fd-card
  size="medium"
  category="Press release"
  title="Quarterly banking profile"
  href="/news/quarterly-banking-profile"
  metadata="April 3, 2026"
  image-src="/images/quarterly-banking-profile.jpg"
></fd-card>
```

### Implementation guide

- **Keep the shell non-interactive.** `fd-card` does not own click handling on the host. Navigation belongs to the native title link when `href` is present.
- **Treat `image-src` as decorative.** The internal image renders with `alt=""` in v1. If the image itself needs semantic meaning, captions, or legal context, use a richer pattern outside `fd-card`.
- **Choose `size` for layout, not meaning.** `medium` places text beside the image, while `large` places the image first. Both sizes represent the same content pattern.
- **Keep category and metadata brief.** The component is for scanning. Longer taxonomy or byline content should stay outside the card or move to a richer preview pattern.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `size` | `"medium"` \| `"large"` | `medium` | Visual layout treatment. `medium` places text beside the image; `large` stacks the image above the text. |
| `category` | `string` | `` | Visible supporting category text rendered above the title. |
| `title` | `string` | `` | Visible card title. When `href` is supplied, the title renders as the primary native link. |
| `href` | `string \| undefined` | `undefined` | Optional destination for the title. When omitted, the title renders as plain text. |
| `target` | `string \| undefined` | `undefined` | Native link target applied to the title link. |
| `rel` | `string \| undefined` | `undefined` | Native relationship tokens applied to the title link. `target="_blank"` always adds `noopener noreferrer`. |
| `metadata` | `string` | `` | Visible footer metadata text. |
| `image-src` | `string \| undefined` | `undefined` | Decorative image URL shown inside the card. The image is excluded from assistive technology in v1. |

- `fd-card` is static in v1. It owns layout, visual framing, and title-link presentation only; the application owns content, destinations, analytics, and lifecycle.
- The host shell is intentionally non-interactive. Keyboard focus lands only on the rendered native title link when present.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-card-radius` | `7px` | Card corner radius. |
| `--fd-card-shadow` | `layered drop shadow` | Default card elevation. |
| `--fd-card-shadow-hover` | `layered drop shadow` | Elevated hover and focus-visible shadow applied when the title link is hovered or focused. |
| `--fd-card-border-hover` | `#bdbdbf` | Border color used during linked hover and focus-visible state. |
| `--fd-card-medium-media-size` | `160px` | Square media size in the `medium` layout. |
| `--fd-card-large-media-aspect-ratio` | `67 / 44` | Image aspect ratio in the `large` layout. |
| `--fd-card-focus-ring` | `var(--fdic-color-border-input-focus, #38b6ff)` | Outer focus-ring color for the title link. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Root article wrapper. |
| `body` | Main content region above the footer. |
| `media` | Decorative image wrapper. |
| `content` | Text column containing the category and title. |
| `category` | Supporting category text. |
| `title` | Title wrapper. |
| `footer` | Footer row containing metadata. |
| `metadata` | Footer metadata text. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- `fd-card` is **not hidden from assistive technology**. It renders a semantic article-style content item labelled by the visible title when one is present.
- The shell is **not focusable**. Keyboard users move only to the native title link in the plain tab order.
- `image-src` is **decorative in v1**. The internal image renders with `alt=""` so it does not duplicate the visible title or metadata.
- The component does **not** add custom keyboard shortcuts, roving focus, or composite navigation behavior.
- When the title has no `href`, it renders as plain text instead of a fake link.

## Known limitations

- The image is **decorative-only** in v1 and does not support semantic alt text or captions.
- Card does **not** provide a clickable-host, selectable, dismissible, or multi-action variant.
- The component intentionally accepts a single metadata string, not a structured list of byline tokens or secondary actions.

## Related components

- [Tile](/components/tile) — use `fd-tile` when the preview is more destination-oriented and does not need rectangular media.
- [Event](/components/event) — use `fd-event` when date prominence matters more than imagery.
- [Hero](/components/hero) — review `fd-hero` when the image should remain decorative but the layout needs page-level emphasis instead of list-style previews.
