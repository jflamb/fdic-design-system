# Global Footer

The global footer provides the shared FDICnet footer shell for agency identity, secondary resource links, social media destinations, and visible page-update metadata.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-global-footer</code> once at the bottom of the overall page shell when the experience needs the approved FDICnet footer treatment and a consistent place for agency information, supporting links, and visible page-update metadata.</p>
</div>

## When to use

- **The page needs one durable site footer contract** — the component keeps the shell consistent across routes instead of repeating one-off footer markup.
- **The application already knows the footer destinations** — the host provides utility links, social links, and the visible updated text as structured data.
- **The page needs a simple, static footer shell** — the component stays focused on footer content rather than owning adjacent page-level interactions.

## When not to use

- **Don't use it for article metadata or in-page section endings** — this is the site footer, not a content footer.
- **Don't use it when another shell already owns the footer landmark** — avoid nesting competing footer contracts.
- **Don't use it to mount page feedback or report forms** — place adjacent components such as <code>fd-page-feedback</code> in the page shell, outside the footer component.
- **Don't use it as a CMS adapter or analytics abstraction** — normalize data and attach instrumentation in the host application.

## Examples

<StoryEmbed
  storyId="components-global-footer--docs-overview"
  linkStoryId="components-global-footer--playground"
  height="980"
  caption="Global Footer overview — the desktop footer shell. Open Storybook for the interactive playground plus dedicated desktop and mobile stories."
/>

`fd-global-footer` consumes the shared page-shell alignment token and the shared major-section block padding token. Its layout hooks stay intentionally narrow so the footer continues to line up with the rest of the page shell by default.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `agency-name` | string | `undefined` | Visible agency name rendered in the footer brand block. |
| `agency-href` | string | `undefined` | Optional destination for the agency name. When omitted, the agency name renders as static text. |
| `utilityLinks` | FdGlobalFooterLink[] | `[]` | Secondary footer links rendered as a text-link list. Each item accepts `label`, `href`, and optional native `target` / `rel` values. |
| `socialLinks` | FdGlobalFooterSocialLink[] | `[]` | Icon-only social destinations rendered as accessible links. Each item accepts `label`, `href`, `icon`, and optional native `target` / `rel` values. |
| `updated-text` | string | `undefined` | Visible footer metadata such as the page's last-updated label. The component renders the provided text verbatim in v1. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-global-footer-background` | `#003256` | Footer background color. |
| `--fd-global-footer-text-color` | `var(--ds-color-text-inverted, #ffffff)` | Inverted text color used inside the footer shell. |
| `--fd-global-footer-stripe` | `linear-gradient(90deg, #d4a62a 0%, #f0cf74 30%, #c59316 60%, #e9c45d 100%)` | Decorative top stripe fill. |
| `--fd-global-footer-padding-inline` | `64px` | Desktop inline padding. |
| `--fd-global-footer-max-width` | `var(--ds-layout-shell-max-width, var(--ds-layout-content-max-width, 1312px))` | Maximum inline size of the footer content row. Defaults to the shared page-shell width contract. |
| `--fd-global-footer-padding-block` | `var(--ds-layout-section-block-padding, 48px)` | Desktop block padding. Defaults to the shared major-section spacing token. |
| `--fd-global-footer-padding-inline-mobile` | `16px` | Mobile inline padding at `640px` and below. |
| `--fd-global-footer-padding-block-mobile` | `16px` | Mobile block padding at `640px` and below. |
| `--fd-global-footer-seal-size` | `80px` | Decorative seal badge size. |
| `--fd-global-footer-social-size` | `36px` | Desktop social-link target size. |
| `--fd-global-footer-social-size-mobile` | `32px` | Mobile social-link target size. |

`fd-global-footer` keeps its styling hooks focused on layout and shell treatment in v1. Link content and social-link labels remain application-authored.

## Shadow parts

| Name | Description |
|---|---|
| `base` | Footer landmark element. |
| `content` | Constrained footer layout container. |
| `seal` | Decorative seal badge. |
| `brand` | Agency and utility-link stack. |
| `agency` | Agency-name text or link. |
| `utility-links` | Utility-link list. |
| `social-links` | Social destination list. |
| `updated` | Footer metadata text. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep the footer focused on footer content</h4>
    <p>Use the component for agency identity, supporting links, social destinations, and updated text only.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't turn the footer into an application router</h4>
    <p>Normalize CMS data, analytics, and route interception in the host app instead of stretching the component API to cover source-specific behavior.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep social links accessible and explicit</h4>
    <p>Provide a full label for each icon-only social link so assistive technologies announce the destination clearly.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't overload the updated text</h4>
    <p>The footer's metadata line works best as a short visible status label such as “Updated August 7, 2024,” not as a paragraph of policy text.</p>
  </div>
</div>

## Content guidelines

- **Agency name**: Use the formal organization name unless the product has an approved shorter form.
- **Utility links**: Keep the set small and high-value. The Figma reference shows a single Accessibility link, but the component allows a short list when the shell needs more than one item.
- **Social labels**: Use task-oriented labels such as “Follow the FDIC on Facebook” rather than platform names alone.
- **Updated text**: Treat the property as already-formatted visible copy. If the product needs locale-specific formatting, do that before assigning the string.

## Implementation guide

`fd-global-footer` is a rendering shell. The host application owns the data it passes in and any composition around it.

```html
<fd-global-footer
  agency-name="Federal Deposit Insurance Corporation"
  agency-href="/"
  updated-text="Updated August 7, 2024"
></fd-global-footer>

<script type="module">
  const footer = document.querySelector("fd-global-footer");

  footer.utilityLinks = [
    { label: "Accessibility", href: "/accessibility" },
  ];

  footer.socialLinks = [
    {
      icon: "facebook",
      label: "Follow the FDIC on Facebook",
      href: "https://www.facebook.com/FDICgov/",
      target: "_blank",
    },
  ];
</script>
```

Integration rules:

- **Pass a fully formatted update string.** The footer does not format or parse dates in v1.
- **Use structured data, not hand-authored child links, for the footer shell.** This keeps the component's rendering predictable across desktop and mobile layouts.
- **Prefer the shared shell defaults unless the full page shell changes.** Override the footer width or padding only when adjacent shell sections are intentionally using the same alternate contract.
- **Prefer native navigation behavior.** The component renders standard anchors. If your framework uses client-side routing, intercept clicks in the host layer rather than changing the component contract.
- **Compose adjacent page feedback in the page shell, not inside the footer.** If the page also needs <code>fd-page-feedback</code>, render it as a separate sibling before the footer component.

## Accessibility

- The component renders a single internal `<footer>` landmark for the footer shell itself.
- Utility links and social destinations remain native anchors in plain tab order. No custom keyboarding or focus management is added in v1.
- Icon-only social links require full accessible labels in the `socialLinks` data so screen readers announce the destination rather than an unlabeled glyph.
- The decorative seal badge and stripe are marked as decorative only and are hidden from assistive technology.
- Mobile layout changes do not change DOM order, so reading order remains consistent across screen sizes.
- In forced-colors mode the footer swaps to system colors and keeps links discoverable with `LinkText`.

## Known limitations

- **No built-in date formatting** — `updated-text` is visible copy, not a date object or formatter API.
- **No back-to-top or subscription affordances** — those broader footer features are out of scope for the initial shell component.
- **No CMS adapters yet** — normalize source data in the host application before assigning the component's properties.

## Related components

- [Global Header](/components/global-header) — the matching site-shell header component for navigation and search.
- [Page Feedback](/components/page-feedback) — a separate adjacent component when the page also needs a feedback surface.
- [Link](/components/link) — use this as the text-link reference when deciding which destinations belong in utility links rather than social icons.
