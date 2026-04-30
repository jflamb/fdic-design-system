# Link Category

The Link Category component groups a short category description with a small set of related links.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-link-category</code> when people need to scan a category, understand why it matters, and choose one of several related destinations. The shell is static; only the individual links are interactive.</p>
</div>

## When to use

- **Related resource groups** — use Link Category for a short list of destinations that belong under one topic.
- **Category-level navigation blocks** — use it when the category name and overview help people decide whether the links are relevant.
- **Mixed hierarchy layouts** — use `medium` for standard content areas and `large` when the category needs stronger visual emphasis.

## When not to use

- **Do not use it for one primary action** — use [Button](/components/button), [Link](/components/link), or [Tile](/components/tile) instead.
- **Do not use it as a clickable card** — the host is intentionally static, and each destination remains its own native link.
- **Do not use it for long link indexes** — keep the list focused. V1 renders up to six valid links.
- **Do not use it for selectable or dismissible categories** — those behaviors need a different state model.

## Examples

<StoryEmbed
  storyId="components-link-category--docs-overview"
  linkStoryId="components-link-category--playground"
  caption="Link Category supports medium and large sizing, three decorative tones, optional visual and stripe treatments, and up to six native links."
/>

### Basic usage

```html
<fd-link-category
  size="medium"
  tone="cool"
  icon-name="download"
  category="Consumer resources"
  overview="Find common banking resources and support options in one place."
></fd-link-category>

<script type="module">
  const category = document.querySelector("fd-link-category");
  category.links = [
    { label: "Deposit insurance", href: "/resources/deposit-insurance" },
    { label: "Consumer assistance", href: "/resources/consumer-assistance" },
    { label: "Bank information", href: "/resources/bank-information" },
  ];
</script>
```

### Implementation guide

- **Keep link text unique and visible.** Avoid repeated labels like “Learn more” inside one category.
- **Use the tone as decoration.** Cool, neutral, and warm treatments should support visual grouping, not communicate status by color alone.
- **Use page-level navigation deliberately.** `fd-link-category` does not render a `nav` landmark by default. Wrap related categories in a labelled `nav` only when the group is major page or site navigation.
- **Choose property data for v1.** Supply links through the `.links` property so the component can filter incomplete items and cap the list at six.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `size` | `"medium" \| "large"` | `medium` | Visual size treatment. Use `large` for stronger hierarchy and `medium` for standard category groups. |
| `tone` | `"neutral" \| "cool" \| "warm"` | `neutral` | Decorative tone shared by the visual and stripe. |
| `icon-name` | `string \| undefined` | `undefined` | Optional Phosphor registry icon name rendered inside the decorative visual. When omitted, `fd-visual` uses its archive fallback glyph. |
| `category` | string | `` | Visible category name. When present, it labels the internal article. |
| `overview` | `string \| undefined` | `undefined` | Short overview text shown before the supporting links. |
| `show-visual` | boolean | `true` | Controls whether the decorative circular visual renders. The `show-visual="false"` attribute hides it in HTML. |
| `show-stripe` | boolean | `true` | Controls whether the decorative stripe renders. The `show-stripe="false"` attribute hides it in HTML. |
| `links` | FdLinkCategoryLinkItem[] | `[]` | Property-only supporting link data. Invalid items are filtered and the rendered list is capped at six links. |

- `fd-link-category` is static in v1. It owns visual grouping and native link rendering only; the application owns destinations, analytics, layout across multiple categories, and lifecycle.
- The host shell is intentionally non-interactive. Keyboard focus lands only on rendered native links in DOM order.
- Link text should be unique and visible. Avoid repeated generic labels inside one category.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-link-category-max-width` | 344px | Maximum inline size of the component host. |
| `--fd-link-category-focus-gap` | var(--fdic-focus-gap-color) | Inner focus-ring gap color for rendered links. |
| `--fd-link-category-focus-ring` | var(--fdic-focus-ring-color) | Outer focus-ring color for rendered links. |
| `--fd-link-category-category-color` | var(--fdic-color-text-primary) | Category text color. |
| `--fd-link-category-overview-color` | var(--fdic-color-text-secondary) | Overview text color. |
| `--fd-link-category-link-color` | var(--fdic-color-text-link) | Supporting link text color. |
| `--fd-link-category-link-underline-thickness` | 1px | Default underline thickness for supporting links. |
| `--fd-link-category-link-underline-thickness-emphasis` | 2px | Hover and focus-visible underline thickness for supporting links. |
| `--fd-link-category-stripe-width` | 80px | Decorative stripe width. |
| `--fd-link-category-stripe-height` | 4px | Decorative stripe thickness. |
| `--fd-link-category-visual-bg-neutral` | var(--fdic-color-bg-interactive) | Neutral visual background. |
| `--fd-link-category-visual-bg-cool` | var(--fdic-color-primary-400) | Cool visual background. |
| `--fd-link-category-visual-bg-warm` | var(--fdic-color-secondary-300) | Warm visual background. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Root article wrapper. |
| `visual` | Decorative visual wrapper containing the internal `fd-visual`. |
| `content` | Content column containing text, stripe, and links. |
| `text` | Text wrapper containing category and overview. |
| `category` | Visible category title. |
| `overview` | Overview paragraph. |
| `stripe` | Decorative stripe wrapper containing the internal `fd-stripe`. |
| `links` | Supporting links list. |
| `link-item` | Individual supporting link list item. |
| `link` | Native supporting anchor. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont">
  <div>
    <h3>Do</h3>
    <ul>
      <li>Use a clear category name that describes the links that follow.</li>
      <li>Keep the overview short enough to scan before the links.</li>
      <li>Order links by the user’s likely task, not by internal org structure.</li>
    </ul>
  </div>
  <div>
    <h3>Don’t</h3>
    <ul>
      <li>Repeat the same visible link label for different destinations.</li>
      <li>Use the decorative icon or stripe as the only cue for meaning.</li>
      <li>Put unrelated destinations together just because they fit visually.</li>
    </ul>
  </div>
</div>

## Content guidelines

- Use category names that match user language, such as “Banking help” or “Consumer resources.”
- Keep overviews to one plain-language sentence.
- Prefer specific link labels that make sense in a screen reader links list.
- Keep the group to six links or fewer. If people need a full index, use a dedicated page or list pattern.

## Accessibility

- `fd-link-category` renders a labelled `article` when `category` is present.
- The host is not focusable. Keyboard users move through the native anchors in plain DOM order.
- The component does not add custom keyboard shortcuts, roving tabindex, arrow-key navigation, or focus management.
- `fd-visual` and `fd-stripe` are decorative and hidden from assistive technology.
- If an application removes a Link Category from the page, the application owns focus recovery.
- Use a labelled `nav` around one or more Link Category components only when the group is major navigation. Too many landmarks can make pages harder to navigate.

## Known limitations

- Links are property-driven in v1. Slotted custom link markup is deferred.
- The component does not provide a clickable host, selectable state, dismiss button, or loading state.
- The decorative visual cannot carry semantic meaning in v1.
- Link Category does not manage layout across multiple category blocks. Use page layout, grid utilities, or a future wrapper pattern for collections of categories.

## Related components

- [Link](/components/link) — use for standalone inline or standalone navigation links.
- [Tile](/components/tile) — use when one primary destination should be emphasized with optional supporting links.
- [Visual](/components/visual) — decorative circular visual primitive used inside Link Category.
- [Stripe](/components/stripe) — decorative accent stripe used inside Link Category.
