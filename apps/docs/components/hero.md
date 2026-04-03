# Hero

The Hero component creates a visually prominent introduction or spotlight section with decorative background media, a constrained text panel, and one optional call to action.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-hero</code> when a page needs one clear message with strong visual framing. The component keeps background media decorative, lets the application supply the correct heading level, and keeps the CTA surface intentionally narrow in v1.</p>
</div>

## When to use

- **Introduce a page or major section with one primary message** — Hero works best when the page needs a strong opening statement and one clear next step.
- **Use decorative background imagery without making the image itself semantic content** — The component owns the atmospheric image treatment so teams do not have to rebuild overlays and contrast handling.
- **Keep the content focused** — The shipped layout is for one heading, one lede, supporting body copy, and at most one CTA link.

## When not to use

- **Don't replace `fd-page-header` when the page needs breadcrumbs or structured wayfinding** — Hero is for emphasis, not hierarchy.
- **Don't use Hero for multi-action marketing panels** — v1 intentionally supports one CTA only.
- **Don't use it when the image itself needs alt text, captions, or legal meaning** — Background media in `fd-hero` is decorative by design.
- **Don't turn it into a carousel or timed promotion** — motion, rotation, and campaign-style behavior are out of scope.

## Examples

<StoryEmbed
  storyId="components-hero--docs-overview"
  linkStoryId="components-hero--playground"
  caption="Hero supports cool, warm, and neutral tones while keeping the same semantic shell. Open Storybook to inspect the public properties and tone-specific image treatments."
/>

### Basic usage

```html
<fd-hero
  tone="cool"
  image-src="/images/benefits-hero.jpg"
  action-label="Explore benefits"
  action-href="/benefits"
>
  <h2 slot="heading">Benefits</h2>
  <p slot="lede">
    Your compensation at FDIC includes competitive pay, clear policies, and
    structured performance management.
  </p>
  <p slot="body">
    Access the Federal Employee Health Benefits Program (FEHB), dental and
    vision insurance through FEDVIP, life insurance with FEGLI, long-term care
    options, and more.
  </p>
</fd-hero>
```

### Implementation guide

- **Provide a real heading element in the `heading` slot**. The component uses that heading to label the internal `<section>`. Keep the page title as the only `<h1>` and use `<h2>` or lower in Hero unless the Hero itself is the page title.
- **Treat `image-src` as decorative only**. If the media needs alt text, visible attribution, or legal context, place that content outside `fd-hero` instead of trying to overload the background image API.
- **Keep the CTA singular and destination-focused**. `fd-hero` renders one native link. If a layout needs multiple actions, use surrounding composition rather than stretching the component API.
- **Pair Hero and Page Header intentionally**. Use Hero for emphasis and `fd-page-header` for hierarchy. Some pages may need both, but they should not duplicate the same heading or CTA message.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `tone` | `"cool"` \| `"warm"` \| `"neutral"` | `cool` | Tonal treatment for the Hero overlay, panel, and stripe. |
| `image-src` | `string \| undefined` | `undefined` | Decorative background image URL. The image remains excluded from assistive technology. |
| `action-label` | `string \| undefined` | `undefined` | Visible label for the optional CTA link. |
| `action-href` | `string \| undefined` | `undefined` | Destination URL for the optional CTA link. |
| `action-target` | `string \| undefined` | `undefined` | Native link target for the optional CTA. |
| `action-rel` | `string \| undefined` | `undefined` | Native link relationship tokens for the optional CTA. `target="_blank"` always adds `noopener noreferrer`. |

- `fd-hero` labels its internal `<section>` from the first element assigned to the `heading` slot.
- `fd-hero` stays static in v1. It does not expose custom events or component-managed interaction state.

## Slots

| Name | Description |
|---|---|
| `heading` | Required semantic heading element authored by the consumer. |
| `lede` | Optional prominent introductory copy under the heading. |
| `body` | Optional supporting body copy. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-hero-max-width` | `1440px` | Maximum inline size of the inner Hero layout. |
| `--fd-hero-padding-block` | `64px` | Desktop block padding. |
| `--fd-hero-padding-inline` | `64px` | Desktop inline padding. |
| `--fd-hero-padding-inline-mobile` | `16px` | Inline padding below 640px. |
| `--fd-hero-panel-max-width` | `480px` | Maximum inline size of the text panel. |
| `--fd-hero-panel-halo` | `24px` | Desktop tonal halo size around the panel. |
| `--fd-hero-image-position` | `center` | Background image positioning. |
| `--fd-hero-stripe-width` | `80px` | Decorative stripe width. |
| `--fd-hero-stripe-height` | `4px` | Decorative stripe height. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Root `<section>` element. |
| `content` | Max-width content wrapper. |
| `panel` | Tonal text panel. |
| `heading` | Heading slot wrapper. |
| `lede` | Lede slot wrapper. |
| `stripe` | Decorative stripe element. |
| `body` | Body slot wrapper. |
| `action` | Internal CTA link. |
| `action-icon` | Decorative CTA icon wrapper. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-best-practices">

**Do**

- Use short, plain-language headings that identify the page or opportunity quickly.
- Keep the background image atmospheric rather than instructional.
- Use the lede for the most important explanatory sentence and the body for optional elaboration.
- Check the final crop of `image-src` on narrow screens so important subjects are not hidden by the panel.

**Don't**

- Don't put paragraphs directly in the default slot. Use the named `heading`, `lede`, and `body` slots so the component can space them correctly.
- Don't use Hero as the only wayfinding structure on a page that also needs breadcrumbs or page metadata.
- Don't rely on the background image alone to communicate urgency, trust, or required action.
- Don't add more than one CTA path without a reviewed follow-up pattern.

</div>

## Content guidelines

- **Heading**: Use a concrete, destination-oriented title. Avoid campaign phrasing or slogans.
- **Lede**: Summarize the value or purpose in one sentence.
- **Body**: Add only the extra context needed to help someone decide whether to follow the CTA.
- **CTA**: Use destination-aware link text such as “Explore benefits” or “Review the filing guide.” Avoid generic labels like “Learn more.”

## Accessibility

- `fd-hero` renders a semantic `<section>` and applies `aria-labelledby` to the first element assigned to the `heading` slot. That keeps the landmark name aligned with the visible heading.
- The component does **not** create its own heading level. The application must choose the right heading element for the page outline.
- `image-src` is decorative in v1. The background image is not announced to assistive technology and is removed in forced-colors mode.
- Keyboard behavior stays native. The optional CTA is a regular link in the plain tab order and activates with `Enter`.
- Forced-colors mode removes decorative imagery, keeps the panel boundary visible, and uses `LinkText` for the CTA.
- Motion is static in v1, so there is no special reduced-motion contract beyond preserving the non-animated result.

## Known limitations

- **Decorative media only** — `fd-hero` does not support semantic image content or captions.
- **One CTA only** — richer action layouts need a follow-up pattern instead of an ad hoc API expansion.
- **One layout composition** — the shipped Hero mirrors the supplied left-panel Figma family only.
- **Consumer-owned heading semantics** — if no heading element is supplied, the section remains unlabeled.

## Related components

- [`fd-page-header`](/components/page-header) — Use page header when the page needs breadcrumbs, a structural heading region, or page-level actions rather than a Hero introduction.
- [`fd-link`](/components/link) — The Hero CTA is intentionally link-like. Review the broader link guidance when choosing CTA wording and destination behavior.
- [`fd-stripe`](/components/stripe) — Hero reuses the stripe accent language for lightweight grouping inside the text panel.
