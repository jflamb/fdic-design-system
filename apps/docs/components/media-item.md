# Media Item

The Media Item component presents one multimedia resource with a linked thumbnail, linked heading, and short metadata.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-media-item</code> when a page needs a compact, scannable summary for a video, recording, training resource, or similar media item. The component owns the visual structure; authors own the heading, link destination, metadata text, and image alternative text.</p>
</div>

## When to use

- **Media resource summaries** — use it for videos, recordings, tutorials, and other multimedia resources that link to a detail page or playback page.
- **Compact browsing surfaces** — use it when people need to compare several media resources by heading and metadata.
- **Consistent thumbnails** — use it when each item can use a similar thumbnail shape and size.

## When not to use

- **Do not use it as an embedded player** — playback controls, transcripts, captions, and player state are application concerns.
- **Do not use it for a whole-card link** — v1 keeps the thumbnail and heading in one native link so keyboard behavior stays native and predictable.
- **Do not use it for complex archives** — filtering, sorting, loading, and empty states belong to a larger media gallery or search pattern.

## Examples

<StoryEmbed
  storyId="components-media-item--docs-overview"
  linkStoryId="components-media-item--playground"
  caption="Media Item shows a thumbnail and heading in one native link, with concise supporting metadata."
/>

### Basic usage

```html
<fd-media-item
  heading="Safeguarding Customer Credit Card Data: PCI Compliance"
  href="/resources/bankers/information-technology/"
  metadata="1h 3m  ·  Beginner  ·  2 months ago"
  image-src="/images/media/pci-compliance.png"
  image-alt="Illustration of a protected credit card transaction."
></fd-media-item>
```

### Structured metadata

Use structured metadata when the source system owns the facts and pages need durable dates, duration, transcript, or media-type semantics. Leave `metadata` empty so the component can generate the visible metadata list.

```html
<fd-media-item
  heading="Safeguarding Customer Credit Card Data: PCI Compliance"
  href="/resources/bankers/information-technology/"
  media-type="Video"
  duration="PT1H3M"
  duration-label="1h 3m"
  level="Beginner"
  updated-date="2023-10-01"
  updated-label="Updated Oct 2023"
  captions-label="Captions available"
  transcript-href="/resources/bankers/information-technology/transcript/"
  transcript-label="Transcript"
  image-src="/images/media/pci-compliance.png"
  image-alt="Illustration of a protected credit card transaction."
></fd-media-item>
```

### Implementation guide

- **Use a descriptive heading.** The heading is the link name when `href` is present, so it should make sense out of context.
- **Choose one metadata path.** Use `metadata` for authored display text. Use structured fields for CMS-owned facts such as media type, duration, level, dates, caption availability, and transcript links. If `metadata` is non-empty, it renders verbatim and structured metadata fields are ignored for visible output.
- **Keep metadata concise.** Use short display text such as duration, level, date, or update status. Do not pack long descriptions into either authored or generated metadata.
- **Use real machine-readable values.** Use ISO 8601 duration values such as `PT1H3M` for `duration` and date values such as `2023-10-01` for date attributes. The visible labels stay author-controlled.
- **Keep transcript links explicit.** Use a short transcript label such as `Transcript`. The component renders it as a secondary metadata link outside the primary media title link.
- **Write useful image alt text.** If the thumbnail adds information and no `href` is present, describe that information. When `href` and `heading` are present, the linked thumbnail is treated as decorative so the link name stays focused on the heading. Image-only linked items need meaningful `image-alt`.
- **Use one destination.** Do not add a second duplicate link around the thumbnail or heading. The component uses one native link for both.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `heading` | `string` | `` | Visible media heading. When `href` is present, this text becomes the native link name. |
| `href` | `string \| undefined` | `undefined` | Destination URL for the combined thumbnail and heading link. If omitted or blank, the heading renders as static text. |
| `target` | `string \| undefined` | `undefined` | Native media-link target. Applies only when `href` is set. |
| `rel` | `string \| undefined` | `undefined` | Native media-link relationship tokens. When `target="_blank"`, `fd-media-item` always adds `noopener noreferrer`. |
| `metadata` | `string` | `` | Authored visible supporting metadata. When this string is non-empty, structured metadata fields are ignored for visible rendering. |
| `media-type` | `string` | `` | Structured visible media type text such as `Video`, `Webinar`, or `Recording`. Used only when `metadata` is empty. |
| `duration` | `string \| undefined` | `undefined` | Machine-readable media duration, preferably an ISO 8601 duration such as `PT1H3M`. Used only when `metadata` is empty. |
| `duration-label` | `string` | `` | Visible duration text such as `1h 3m`. Used only when `metadata` is empty. |
| `level` | `string` | `` | Visible audience or difficulty level text. Used only when `metadata` is empty. |
| `published-date` | `string \| undefined` | `undefined` | Machine-readable publication date for a generated metadata `<time>` element. Use `YYYY-MM-DD` when possible. Used only when `metadata` is empty. |
| `published-label` | `string` | `` | Visible publication date label. Used only when `metadata` is empty. |
| `updated-date` | `string \| undefined` | `undefined` | Machine-readable updated date for a generated metadata `<time>` element. Use `YYYY-MM-DD` when possible. Used only when `metadata` is empty. |
| `updated-label` | `string` | `` | Visible updated date label. Used only when `metadata` is empty. |
| `captions-label` | `string` | `` | Visible caption availability text such as `Captions available`. Used only when `metadata` is empty. |
| `transcript-href` | `string \| undefined` | `undefined` | Optional transcript URL rendered as a secondary metadata link outside the primary media title link. Used only when `metadata` is empty. |
| `transcript-label` | `string` | `` | Visible transcript link text. Defaults to `Transcript` when `transcript-href` is set and this value is empty. |
| `image-src` | `string \| undefined` | `undefined` | Thumbnail image URL. |
| `image-alt` | `string` | `` | Alternative text for the thumbnail when it is not already named by the linked heading. Linked thumbnails use empty alt text when a heading is present. Image-only links require non-empty `image-alt`. |

`fd-media-item` keeps the host shell static. When `href` is set, the thumbnail and heading share one native link and one tab stop; metadata remains outside the link. The global HTML `title` attribute is migrated to `heading` and removed from the host to avoid browser tooltips.
- Use `metadata` for authored display text. Use structured metadata fields when source systems own the facts and pages need durable date, duration, transcript, or media-type semantics. If `metadata` is non-empty, the component renders it verbatim and does not generate structured metadata.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-media-item-gap` | `var(--fdic-spacing-sm, 12px)` | Gap between the thumbnail and content. |
| `--fd-media-item-media-height` | `auto` | Optional fixed thumbnail container height. Leave unset to preserve the default aspect ratio. |
| `--fd-media-item-media-aspect-ratio` | `366 / 201` | Thumbnail aspect ratio. |
| `--fd-media-item-media-radius` | `var(--fdic-corner-radius-lg, 7px)` | Thumbnail corner radius. |
| `--fd-media-item-title-color` | `var(--fdic-color-text-link, #1278b0)` | Linked heading text color. |
| `--fd-media-item-title-font-size` | `var(--fdic-font-size-body-big, 20px)` | Heading font size. |
| `--fd-media-item-title-font-weight` | `450` | Heading font weight. |
| `--fd-media-item-title-radius` | `var(--fdic-corner-radius-2xs, 2px)` | Corner radius for linked heading focus-decoration fragments. |
| `--fd-media-item-metadata-color` | `var(--fdic-color-text-secondary, #595961)` | Metadata text color. |
| `--fd-media-item-metadata-font-size` | `var(--fdic-font-size-body, 18px)` | Metadata font size. |
| `--fd-media-item-metadata-separator-gap` | `6px` | Inline gap around generated structured metadata separators. |
| `--fd-media-item-transcript-link-color` | `var(--fdic-color-text-link, #1278b0)` | Transcript metadata link color. |
| `--fd-media-item-focus-gap` | `var(--fdic-focus-gap-color)` | Inner gap color for media-link focus. |
| `--fd-media-item-focus-ring` | `var(--fdic-focus-ring-color)` | Outer ring color for media-link focus. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Root wrapper. Renders as `article` when `heading` is present and `div` otherwise. |
| `media` | Thumbnail image wrapper. |
| `image` | Native thumbnail image. |
| `content` | Static heading and metadata wrapper used when `href` is omitted. |
| `title` | Shared heading styling hook for linked and static headings. |
| `title-link` | Native link wrapping the thumbnail and heading when `href` is present. |
| `title-link-text` | Linked heading text inside the native media link. |
| `title-text` | Static heading text when `href` is omitted. |
| `metadata` | Visible authored metadata paragraph or generated structured metadata list. |
| `metadata-list` | Generated structured metadata list. Rendered only when `metadata` is empty and structured fields are present. |
| `metadata-item` | Individual generated structured metadata item. |
| `transcript-link` | Optional generated transcript metadata link. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- The component renders a semantic `article`.
- The host shell is not focusable or clickable.
- When `href` is present, the thumbnail and heading render inside one native link and use the normal tab order. There is no roving tabindex or custom keyboard model.
- Keyboard focus appears on the combined thumbnail and heading link. Hover and focus thicken the heading underline to match the Figma interaction state.
- The component does not manage focus recovery because it is not dismissible and does not remove itself.
- `image-alt` is author-owned for static media items. Linked thumbnails render with empty alt text when a heading is present so the link name is not duplicated. A linked image without a heading needs non-empty `image-alt`; otherwise the component leaves the image static instead of creating an unnamed link.

## Known limitations

- The component does not include embedded playback, automatic transcript or caption detection, duration parsing, media-type badges, sorting, filtering, loading, or empty states.
- Structured metadata is intentionally narrow. It supports generated visible metadata and basic machine-readable date and duration attributes, not a full media gallery model.

## Related components

- [Media List](/components/media-list) — use for responsive groups of media items.
- [Social Media Item](/components/social-media-item) — use for static social post summaries.
- [Card](/components/card) — use for broader editorial previews or richer card content.
