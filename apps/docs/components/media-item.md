# Media Item

The Media Item component presents one multimedia resource with a linked thumbnail, linked title, and short metadata.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-media-item</code> when a page needs a compact, scannable summary for a video, recording, training resource, or similar media item. The component owns the visual structure; authors own the title, link destination, metadata text, and image alternative text.</p>
</div>

## When to use

- **Media resource summaries** — use it for videos, recordings, tutorials, and other multimedia resources that link to a detail page or playback page.
- **Compact browsing surfaces** — use it when people need to compare several media resources by title and metadata.
- **Consistent thumbnails** — use it when each item can use a similar thumbnail shape and size.

## When not to use

- **Do not use it as an embedded player** — playback controls, transcripts, captions, and player state are application concerns.
- **Do not use it for a whole-card link** — v1 keeps the thumbnail and title in one native link so keyboard behavior stays native and predictable.
- **Do not use it for complex archives** — filtering, sorting, loading, and empty states belong to a larger media gallery or search pattern.

## Examples

<StoryEmbed
  storyId="components-media-item--docs-overview"
  linkStoryId="components-media-item--playground"
  caption="Media Item shows a thumbnail and title in one native link, with concise supporting metadata."
/>

### Basic usage

```html
<fd-media-item
  title="Safeguarding Customer Credit Card Data: PCI Compliance"
  href="/resources/bankers/information-technology/"
  metadata="1h 3m  ·  Beginner  ·  2 months ago"
  image-src="/images/media/pci-compliance.png"
  image-alt="Illustration of a protected credit card transaction."
></fd-media-item>
```

### Implementation guide

- **Use a descriptive title.** The title is the link name when `href` is present, so it should make sense out of context.
- **Keep metadata concise.** Use short display text such as duration, level, date, or update status. Do not pack long descriptions into metadata.
- **Write useful image alt text.** If the thumbnail adds information and no `href` is present, describe that information. When `href` is present, the linked thumbnail is treated as decorative so the link name stays focused on the title.
- **Use one destination.** Do not add a second duplicate link around the thumbnail or title. The component uses one native link for both.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `` | Visible media title. When `href` is present, this text becomes the native link name. |
| `href` | `string \| undefined` | `undefined` | Destination URL for the combined thumbnail and title link. If omitted or blank, the title renders as static text. |
| `target` | `string \| undefined` | `undefined` | Native media-link target. Applies only when `href` is set. |
| `rel` | `string \| undefined` | `undefined` | Native media-link relationship tokens. When `target="_blank"`, `fd-media-item` always adds `noopener noreferrer`. |
| `metadata` | `string` | `` | Visible supporting metadata such as duration, level, date, or update status. |
| `image-src` | `string \| undefined` | `undefined` | Thumbnail image URL. |
| `image-alt` | `string` | `` | Alternative text for the thumbnail when it is not already named by the linked title. Linked thumbnails use empty alt text when a title is present. |

`fd-media-item` keeps the host shell static. When `href` is set, the thumbnail and title share one native link and one tab stop; metadata remains outside the link.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-media-item-gap` | `var(--fdic-spacing-sm, 12px)` | Gap between the thumbnail and content. |
| `--fd-media-item-media-height` | `auto` | Optional fixed thumbnail container height. Leave unset to preserve the default aspect ratio. |
| `--fd-media-item-media-aspect-ratio` | `366 / 201` | Thumbnail aspect ratio. |
| `--fd-media-item-media-radius` | `var(--fdic-corner-radius-lg, 7px)` | Thumbnail corner radius. |
| `--fd-media-item-title-color` | `var(--fdic-color-text-link, #1278b0)` | Linked title text color. |
| `--fd-media-item-title-font-size` | `var(--fdic-font-size-body-big, 20px)` | Title font size. |
| `--fd-media-item-title-font-weight` | `450` | Title font weight. |
| `--fd-media-item-metadata-color` | `var(--fdic-color-text-secondary, #595961)` | Metadata text color. |
| `--fd-media-item-metadata-font-size` | `var(--fdic-font-size-body, 18px)` | Metadata font size. |
| `--fd-media-item-focus-gap` | `var(--fdic-focus-gap-color)` | Inner gap color for media-link focus. |
| `--fd-media-item-focus-ring` | `var(--fdic-focus-ring-color)` | Outer ring color for media-link focus. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Root article wrapper. |
| `media` | Thumbnail image wrapper. |
| `image` | Native thumbnail image. |
| `content` | Static title and metadata wrapper used when `href` is omitted. |
| `title` | Shared title styling hook for linked and static titles. |
| `title-link` | Native link wrapping the thumbnail and title when `href` is present. |
| `title-link-text` | Linked title text inside the native media link. |
| `title-text` | Static title text when `href` is omitted. |
| `metadata` | Visible supporting metadata. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- The component renders a semantic `article`.
- The host shell is not focusable or clickable.
- When `href` is present, the thumbnail and title render inside one native link and use the normal tab order. There is no roving tabindex or custom keyboard model.
- Keyboard focus appears on the combined thumbnail and title link. Hover and focus thicken the title underline to match the Figma interaction state.
- The component does not manage focus recovery because it is not dismissible and does not remove itself.
- `image-alt` is author-owned for static media items. Linked thumbnails render with empty alt text when a title is present so the link name is not duplicated.

## Known limitations

- The component does not include embedded playback, transcript links, caption status, duration parsing, media-type badges, sorting, filtering, loading, or empty states.
- Metadata is a single display string in v1. Structured duration, level, and date fields are deferred.

## Related components

- [Media List](/components/media-list) — use for responsive groups of media items.
- [Social Media Item](/components/social-media-item) — use for static social post summaries.
- [Card](/components/card) — use for broader editorial previews or richer card content.
