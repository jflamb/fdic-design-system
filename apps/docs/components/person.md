# Person

The Person component renders governed people displays for attribution, contact listings, featured spotlights, and profile-card grids.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-person</code> when a Drupal Person node needs one of the approved display projections. The variant controls which fields render, how the person links, and whether a headshot is omitted, compact, standard, or featured.</p>
</div>

## When to use

- **Person view modes** — use it as the implementation target for Byline, Contact, Contact Details, Contact with Image, Name and Title, Spotlight, and Profile Card displays.
- **People paragraph items** — use it when editors choose a purpose-named Person variant rather than assembling fields manually.
- **Featured people** — use `spotlight` for one highlighted person and `profile-card` for grids of comparable people.

## When not to use

- **Do not use it for arbitrary staff biographies** — long biographies, tabs, related content, and profile-page layout belong to a full Person detail page.
- **Do not create image-size variants** — use semantic variants such as `spotlight` and `profile-card`; do not create a `large-image-person` treatment.
- **Do not use it as an editor-controlled field builder** — each variant owns its field projection. Extra populated fields are ignored when a variant does not render them.

## Examples

<StoryEmbed
  storyId="components-person--docs-overview"
  linkStoryId="components-person--playground"
  caption="Person variants map Drupal Person displays to controlled field projections."
/>

### Basic usage

```html
<fd-person
  variant="contact"
  name="Jordan Pierce"
  title="Program Analyst"
  organization="Division of Administration"
  email="jordan.pierce@example.gov"
></fd-person>
```

### Featured spotlight

```html
<fd-person
  variant="spotlight"
  name="Morgan Lee"
  title="Employee Spotlight"
  organization="Office of Communications"
  summary="Morgan improved the intranet publishing workflow."
  profile-url="/people/morgan-lee"
  profile-label="Read Morgan's profile"
  image-src="/images/people/morgan-lee-560.jpg"
  image-srcset="/images/people/morgan-lee-280.jpg 1x, /images/people/morgan-lee-560.jpg 2x"
></fd-person>
```

### Profile-card grid item

```html
<fd-person
  variant="profile-card"
  name="Lin Wei"
  title="Honors Attorney"
  organization="Legal Division"
  profile-url="/people/lin-wei"
  image-src="/images/people/lin-wei-560.jpg"
  image-srcset="/images/people/lin-wei-280.jpg 1x, /images/people/lin-wei-560.jpg 2x"
></fd-person>
```

## Variant guide

| Variant              | Drupal mapping             | Fields rendered                                                 | Link behavior                                       | Image treatment           |
| -------------------- | -------------------------- | --------------------------------------------------------------- | --------------------------------------------------- | ------------------------- |
| `byline`             | Byline                     | Name, organization                                              | Name links to email when `email` is present         | Omitted                   |
| `contact`            | Contact                    | Name, title, organization, email                                | Email link only                                     | Omitted                   |
| `contact-with-image` | Contact with Image         | Image, name, title, organization                                | Name links to email when `email` is present         | Small 1:1 avatar          |
| `contact-details`    | Contact Details            | Image, name, email, summary                                     | Email link only                                     | Standard 1:1 avatar       |
| `name-title`         | Name and Title             | Name, title, organization                                       | No link                                             | Omitted                   |
| `spotlight`          | Spotlight                  | Image, name, title, organization, summary, optional profile CTA | Separate profile link when `profile-url` is present | Featured 4:5 or 1:1 image |
| `profile-card`       | New Profile Card view mode | Image or placeholder, name, title, organization                 | Name links to profile when `profile-url` is present | Featured 1:1 image        |

## Implementation guide

- **Keep variants semantic.** `spotlight` means one featured person. `profile-card` means one item in a grid of comparable people.
- **Let the variant own the projection.** For example, `byline` ignores `title`, `phone`, `location`, `profile-url`, and `summary` even when those fields exist on the source node.
- **Use responsive image output for featured variants.** `spotlight` and `profile-card` should receive high-resolution sources, typically a 2x image at least 560px on the long edge, through `image-srcset`.
- **Avoid whole-card links in v1.** `profile-card` links the visible name only. This keeps one clear native link without wrapping the image, title, and organization in a broad interactive region.
- **Use placeholders only for profile-card grids.** Grid layouts keep a stable image slot with initials when `image-src` is missing. Other variants omit the image and reflow.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `variant` | `"byline"` \| `"contact"` \| `"contact-with-image"` \| `"contact-details"` \| `"name-title"` \| `"spotlight"` \| `"profile-card"` | `contact` | Purpose-named display projection. Unsupported values fall back to `contact`. |
| `name` | `string` | `` | Visible person name. Used as the article label when present. |
| `title` | `string` | `` | Visible job title or role label for variants that render role metadata. |
| `organization` | `string` | `` | Visible division, office, or organization text. |
| `email` | `string \| undefined` | `undefined` | Email address used to generate `mailto:` links in variants that render contact behavior. |
| `phone` | `string \| undefined` | `undefined` | Reserved source field. No current Person variant renders phone. |
| `location` | `string \| undefined` | `undefined` | Reserved source field. No current Person variant renders location. |
| `profile-url` | `string \| undefined` | `undefined` | Profile destination for `spotlight` CTA links and `profile-card` name links. |
| `profile-label` | `string` | `"Read more"` | Visible CTA label used by `spotlight` when `profile-url` is present. |
| `target` | `string \| undefined` | `undefined` | Native target for profile links. Email links ignore this value. |
| `rel` | `string \| undefined` | `undefined` | Native relationship tokens for profile links. Blank-target links always include `noopener noreferrer`. |
| `image-src` | `string \| undefined` | `undefined` | Headshot image URL for variants that render images. |
| `image-srcset` | `string \| undefined` | `undefined` | Responsive image candidates for high-density and featured Person images. |
| `image-alt` | `string` | `` | Fallback alternative text used only when no visible person name is present. Headshots are decorative when the name is visible. |
| `image-position` | `"left"` \| `"top"` | `"left"` | Image placement for row-capable variants (`contact-with-image`, `contact-details`). `top` stacks the image above the text; featured variants are always stacked. |
| `summary` | `string` | `` | Short details or body-summary text rendered by `contact-details` and `spotlight`. |

`fd-person` uses controlled variant projections. Populated fields are ignored when the active variant does not render them, which keeps Drupal Person view modes governed instead of editor-assembled.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-person-compact-gap` | `var(--fdic-spacing-xs, 8px)` | Gap between image and text for compact variants. |
| `--fd-person-standard-gap` | `var(--fdic-spacing-md, 16px)` | Gap between image and text for `contact-details`. |
| `--fd-person-featured-gap` | `var(--fdic-spacing-md, 16px)` | Gap between image and content for featured variants. |
| `--fd-person-name-font-size` | `var(--fdic-font-size-body, 18px)` | Name text size for compact and standard variants. |
| `--fd-person-featured-name-font-size` | `var(--fdic-font-size-heading-4, 24px)` | Name text size for `spotlight` and `profile-card`. |
| `--fd-person-meta-color` | `var(--fdic-color-text-secondary, #595961)` | Title, organization, and supporting metadata color. |
| `--fd-person-small-image-size` | `56px` | Rendered avatar size for `contact-with-image`. |
| `--fd-person-standard-image-size` | `112px` | Rendered avatar size for `contact-details`. |
| `--fd-person-spotlight-image-size` | `240px` | Maximum rendered featured image width for `spotlight`. |
| `--fd-person-spotlight-image-aspect-ratio` | `4 / 5` | Featured image ratio for `spotlight`. |
| `--fd-person-profile-card-image-size` | `192px` | Preferred profile-card image size before container constraints. |
| `--fd-person-profile-card-image-aspect-ratio` | `1 / 1` | Featured image ratio for `profile-card` grid items. |
| `--fd-person-focus-gap` | `var(--fdic-focus-gap-color, #ffffff)` | Inner gap color for focused links. |
| `--fd-person-focus-ring` | `var(--fdic-focus-ring-color, #38b6ff)` | Outer ring color for focused links. |

Use image-size hooks for integration alignment only. Do not create new visual-size variants; choose the purpose-named variant that matches the content use case.

## Shadow parts

| Name | Description |
|---|---|
| `base` | Root article wrapper. Also includes the active variant name as a part token. |
| `content` | Text and link content wrapper. |
| `identity` | Tight grouping of name, metadata, and inline contact text within `content`. |
| `name` | Visible person name wrapper. |
| `email-link` | Native mailto link rendered by contact variants. |
| `profile-link` | Native profile link rendered by featured variants. |
| `profile-cta` | CTA profile link rendered by `spotlight`. |
| `meta` | Title and organization metadata text. |
| `summary` | Short details or body-summary text. |
| `contact-list` | List wrapper for rendered contact links. |
| `contact-item` | Individual contact list item. |
| `image-frame` | Headshot or placeholder frame. |
| `image` | Native headshot image. Renders with empty alt text when the visible name is present. |
| `placeholder` | Decorative person-silhouette fallback shown by image-bearing variants when no headshot is supplied. |

Variant-specific part tokens include `byline`, `contact`, `contact-with-image`, `contact-details`, `name-title`, `spotlight`, and `profile-card` on the root `base` part.
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- The component renders a semantic `article` labelled by the visible person name when a name is present.
- Headshots are decorative when the visible name is rendered nearby. The component sets image `alt=""` in that case so screen readers do not hear the person's name twice.
- If a future implementation uses an image as the only link content, that image must receive useful alternative text that names the person or destination.
- Name, title, organization, email, and summary render as real text. Contact and profile destinations render as native links.
- The component has no custom keyboard model. Keyboard focus lands only on native links.
- Featured variants stack at narrow widths and must remain readable at 320px and 400% zoom.

## Known limitations

- `phone` and `location` are accepted for source compatibility but no current variant renders them.
- `profile-card` uses a name-only profile link in v1. Whole-card links remain a separate design and accessibility decision.
- The component does not create Drupal image styles. Drupal should provide small, standard, and featured responsive image outputs that match the selected variant.

## Related components

- [Card](/components/card) — use for general editorial previews not tied to Person node projections.
- [Media Item](/components/media-item) — use for video, webinar, or training-resource summaries.
- [Visual](/components/visual) — use for decorative standalone icon or avatar visuals.
