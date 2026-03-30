# Page Header

The page header provides consistent page-level context and navigation, including breadcrumbs, a title, an optional kicker, and optional action buttons.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-page-header</code> at the top of each page to establish wayfinding context with breadcrumbs, the page's primary heading, and optional page-level actions.</p>
</div>

## When to use

- **Every content page needs a consistent heading region** — The page header provides a shared layout for the `<h1>`, breadcrumbs, and actions so teams don't build this from scratch.
- **The page sits within a multi-level site hierarchy** — Breadcrumbs show the user where they are and how to navigate up.
- **The page has a content type or category** — Use the kicker to surface a short label like "Consumer Resources" or "News" above the title.
- **The page needs page-level actions** — Use the actions slot for buttons like Print, Share, or Export that apply to the whole page.

## When not to use

- **Don't use it for section headings within a page** — Use native `<h2>`–`<h6>` elements for in-page sections.
- **Don't use it as a replacement for the global header** — `fd-page-header` sits below `fd-global-header`, inside `<main>`.
- **Don't use it for hero banners or marketing blocks** — This component is for structured page context, not promotional content.
- **Don't use it for standalone breadcrumbs without a title** — The component requires a `heading` to render.

## Examples

<StoryEmbed
  storyId="components-page-header--full-header"
  linkStoryId="components-page-header--playground"
  caption="Full page header with breadcrumbs, kicker, title, and actions. The Playground story in Storybook provides interactive controls for all properties."
/>

### Basic usage

```html
<fd-page-header heading="Deposit Insurance"></fd-page-header>
```

### With breadcrumbs

```js
const header = document.querySelector('fd-page-header');
header.breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Consumer Resources', href: '/resources' },
  { label: 'Deposit Insurance', href: '/resources/deposit-insurance' },
];
```

The last breadcrumb item renders as a non-interactive `<span>` with `aria-current="page"`. All preceding items render as links.

### With kicker and actions

```html
<fd-page-header
  heading="Quarterly Banking Profile"
  kicker="Analysis"
>
  <fd-button slot="actions" variant="outline" size="small">Print</fd-button>
  <fd-button slot="actions" variant="outline" size="small">Share</fd-button>
</fd-page-header>
```

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `heading` | `string` | `` | Page heading text rendered as an `<h1>` inside the component. |
| `kicker` | `string` | `` | Optional eyebrow label displayed above the title for category or content-type context. |
| `breadcrumbs` | `FdPageHeaderBreadcrumb[]` | `[]` | Ordered breadcrumb trail. Each item has `label` and `href`. The last item renders as the current page with `aria-current="page"`. |
| `breadcrumb-label` | `string` | `"Breadcrumbs"` | Accessible label for the breadcrumb `<nav>` landmark. |

## Slots

| Name | Description |
|---|---|
| `actions` | Optional action buttons or links displayed alongside the page title. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-page-header-max-width` |  | Maximum inline size of the page header content area. |
| `--fd-page-header-padding-block` |  | Block (vertical) padding. |
| `--fd-page-header-padding-inline` |  | Inline (horizontal) padding. |
| `--fd-page-header-bg` |  | Background color. |
| `--fd-page-header-title-color` |  | Title text color. |
| `--fd-page-header-kicker-color` |  | Kicker text color. |
| `--fd-page-header-breadcrumb-color` |  | Breadcrumb link color. |
| `--fd-page-header-separator-color` |  | Breadcrumb separator icon color. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Root container element. |
| `breadcrumbs` | Breadcrumb `<nav>` element. |
| `heading-group` | Container for kicker and title. |
| `kicker` | Kicker/eyebrow text element. |
| `title` | `<h1>` heading element. |
| `actions` | Actions container with the `actions` slot. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-best-practices">

**Do**

- Place `fd-page-header` as the first element inside `<main>`.
- Use `heading` for the page's primary heading — the component renders it as `<h1>`.
- Keep breadcrumb labels short and descriptive. Match them to the actual page titles they link to.
- Mark the last breadcrumb item's `href` to match the current page URL, even though the component renders it as a non-interactive span.
- Use the `kicker` for short content-type labels, not full sentences.

**Don't**

- Don't add a separate `<h1>` elsewhere on the page — the component already renders one.
- Don't use the actions slot for primary navigation — it's for page-level utility actions.
- Don't include more than 5 breadcrumb levels — keep the hierarchy shallow and scannable.
- Don't put long text in the kicker — keep it to 2–3 words.

</div>

## Content guidelines

- **Heading**: Use the full page title. Avoid abbreviations unless the abbreviation is more recognizable than the full name.
- **Kicker**: Use a consistent content-type label across pages in the same category. Examples: "Consumer Resources", "News", "Analysis", "Regulation".
- **Breadcrumbs**: Match labels to the destination page titles. Use "Home" for the root.
- **Actions**: Use short, action-oriented labels. Prefer verbs: "Print", "Share", "Export".

## Accessibility

- The breadcrumb trail renders inside a `<nav>` landmark with `aria-label="Breadcrumbs"` (customizable via the `breadcrumb-label` property).
- Breadcrumbs use a semantic `<ol>` to convey ordered hierarchy to assistive technology.
- The last breadcrumb item has `aria-current="page"` so screen readers announce it as the current location.
- Separator icons between breadcrumbs are `aria-hidden="true"` and excluded from the accessible name.
- The `heading` renders as `<h1>` — do not add another `<h1>` on the same page.
- All interactive elements (breadcrumb links, action buttons) have visible focus indicators using the standard FDIC focus ring pattern.
- The component uses plain tab order — no custom keyboard navigation is needed.
- In forced-colors mode, breadcrumb links use `LinkText`, separators use `CanvasText`, and the kicker uses `GrayText`.
- In print, breadcrumbs and actions are hidden; the title and kicker remain.

## Known limitations

- **No data fetching** — The component does not fetch breadcrumb data. Pass the `breadcrumbs` array from your application.
- **No routing integration** — Breadcrumb links use standard `<a>` elements. For SPA routing, intercept clicks in your framework's router.
- **No mobile back-link** — v1 does not collapse breadcrumbs to a "← Back" link on narrow viewports. This is a candidate for a future enhancement.
- **Heading level is fixed at `<h1>`** — The component always renders an `<h1>`. If you need a different heading level, use native HTML instead.

## Related components

- [`fd-global-header`](/components/global-header) — Site-level header with navigation, search, and branding. Place `fd-page-header` below it, inside `<main>`.
- [`fd-button`](/components/button) — Use in the actions slot for page-level action buttons.

<!-- GENERATED_COMPONENT_API:START fd-page-header -->
<!-- GENERATED_COMPONENT_API:END -->
