# Social Media Item

The Social Media Item component presents one static social post summary with a representative image, timestamp, post text, and platform attribution.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-social-media-item</code> when a page needs to show a social post as content, not as an embedded feed or clickable card. The component owns the visual structure and platform attribution; authors own the post copy, links, image alternative text, and lifecycle.</p>
</div>

## When to use

- **Recent or relevant social posts** — use it when the post itself helps people scan FDIC updates, research, events, or public information.
- **Static curated content** — use it when content editors choose which posts appear on the page.
- **Posts with meaningful body links** — author links directly in the default slot so they keep native link behavior.

## When not to use

- **Do not use it as a live social feed** — loading, authentication, moderation, rate limits, and error states are application concerns.
- **Do not make the whole item clickable** — the shell is static so slotted post links remain clear and native.
- **Do not use platform icons as links in v1** — they are attribution only. Add regular text links elsewhere if people need to visit a platform.
- **Do not omit meaningful image alt text** — social images often contain text or context that must be available to non-visual users.

## Examples

<StoryEmbed
  storyId="components-social-media-item--docs-overview"
  linkStoryId="components-social-media-item--playground"
  caption="Social Media Item shows a static post summary with authored text, native links, image alt text, and platform attribution."
/>

### Basic usage

```html
<fd-social-media-item
  timestamp="Aug. 26, 2024 · 9:25 AM"
  image-src="/images/social/unbanked-households.png"
  image-alt="Graphic stating that 75 percent of unbanked Hispanic households rely on cash."
  platforms="facebook youtube instagram x reddit linkedin threads"
>
  <span>
    Did you know that unbanked Hispanic households were more likely to rely on
    cash to meet their financial needs?
  </span>
  <a href="/analysis/household-survey">Read the research</a><span>.</span>
</fd-social-media-item>
```

### Implementation guide

- **Keep post text authored.** The default slot accepts text, spans, and native links; the component does not parse URLs or hashtags.
- **Write specific alt text.** If the image repeats visible text, summarize the important information. If the image is truly decorative, reconsider whether this component is the right pattern.
- **Use supported platform tokens.** Supported tokens are `facebook`, `youtube`, `instagram`, `x`, `reddit`, `linkedin`, and `threads`.
- **Keep timestamps readable.** `timestamp` is visible text in v1. Use the format your content workflow can maintain consistently.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `timestamp` | `string` | `` | Visible timestamp text for the post. |
| `image-src` | `string \| undefined` | `undefined` | Representative image URL for the social post. |
| `image-alt` | `string` | `` | Alternative text for the representative image. Required when the image conveys post content. |
| `platforms` | `"facebook"` \| `"youtube"` \| `"instagram"` \| `"x"` \| `"reddit"` \| `"linkedin"` \| `"threads"` array or space-separated attribute | `[]` | Published platform tokens shown as attribution. Unsupported tokens are ignored and duplicates are removed. |

`fd-social-media-item` is static in v1. The host shell is not focusable, and the component does not emit events.

## Slots

| Name | Description |
|---|---|
| (default) | Authored post body content. Use native text and links; the component does not parse URLs or hashtags. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-social-media-item-gap` | `var(--fdic-spacing-xs, 8px)` | Gap between media, content, and platform attribution. |
| `--fd-social-media-item-media-height` | `auto` | Optional fixed representative image container height. Leave unset to preserve the default aspect ratio. |
| `--fd-social-media-item-media-aspect-ratio` | `368 / 341` | Representative image aspect ratio. |
| `--fd-social-media-item-media-radius` | `var(--fdic-corner-radius-xl, 9px)` | Representative image corner radius. |
| `--fd-social-media-item-body-color` | `var(--fdic-color-text-primary, #212123)` | Post body text color. |
| `--fd-social-media-item-supporting-color` | `var(--fdic-color-text-secondary, #595961)` | Timestamp and platform-label text color. |
| `--fd-social-media-item-platform-gap` | `var(--fdic-spacing-2xs, 4px)` | Gap between platform attribution icons. |
| `--fd-social-media-item-platform-icon-size` | `22px` | Inline and block size for platform icons. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Root article wrapper. |
| `media` | Representative image wrapper. |
| `image` | Native representative image. |
| `content` | Timestamp and post body wrapper. |
| `timestamp` | Visible timestamp text. |
| `body` | Slotted post body wrapper. |
| `platforms` | Platform attribution wrapper. |
| `platform-label` | Visible platform attribution label. |
| `platform-list` | Platform attribution list. |
| `platform-item` | Individual platform attribution item. |
| `platform-icon` | Decorative platform icon wrapper. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- The component renders a semantic `article` and does not make the host focusable.
- Keyboard focus remains on native links authored in the default slot. There is no roving tabindex or custom keyboard model.
- Platform icons are decorative. Each platform has an accessible text label in the platform list.
- `image-alt` is author-owned and should describe meaningful information in the representative image.
- The component does not manage focus recovery because it is not dismissible and does not remove itself.

## Known limitations

- Platform icons are attribution only and do not accept destinations in v1.
- The component does not provide structured machine-readable datetime metadata.
- The component does not own loading, moderation, sorting, filtering, analytics, or social API integration.

## Related components

- [Social Media List](/components/social-media-list) — use for responsive groups of social media items.
- [Card](/components/card) — use for editorial previews with one title destination and decorative media.
- [Link](/components/link) — use for standalone text links outside the post body.
