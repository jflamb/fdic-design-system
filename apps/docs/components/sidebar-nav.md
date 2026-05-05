# Sidebar Nav

Sidebar Nav renders local section navigation as a labeled native navigation landmark with real nested lists and links.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-sidebar-nav</code> when a content-heavy page belongs to a broader web area and people need a consistent way to move between sibling and child pages.</p>
</div>

## When to use

- **Section navigation** — use Sidebar Nav beside long-form news, policy, guidance, or resource pages.
- **Persistent local context** — use it when the current page, sibling pages, and selected branch should stay consistent across a section.
- **CMS-backed navigation trees** — use it when a structured tree can be passed from a route, content model, or navigation service.

## When not to use

- **Do not use it for global navigation** — use [Global Header](/components/global-header) for primary site navigation.
- **Do not use it for in-page headings** — use the Prose table-of-contents pattern for links within one page.
- **Do not use it as a menu or tree control** — Sidebar Nav is site navigation, not an application command menu.
- **Do not use it to hide weak IA** — if the tree is too deep or long to scan, fix the information architecture first.

## Choose Nav or Menu

Use Sidebar Nav when the current page should determine which branch is visible. It renders a predictable route-driven view of the section and omits unrelated descendants from the DOM.

Use [Sidebar Menu](/components/sidebar-menu) when people need to explore sibling branches without leaving the page. Sidebar Menu keeps the same local navigation treatment, but adds separate caret buttons for expanding and collapsing child branches.

## Examples

<StoryEmbed
  storyId="components-sidebar-nav--docs-overview"
  linkStoryId="components-sidebar-nav--playground"
  caption="Sidebar Nav renders a web-area root, a divider, top-level links, and the deterministic current branch as native links."
/>

### Basic usage

```html
<fd-sidebar-nav
  label="News section"
  current-href="/news-events/news/press-releases"
></fd-sidebar-nav>

<script type="module">
  const nav = document.querySelector("fd-sidebar-nav");

  nav.root = {
    label: "News & Events",
    href: "/news-events",
  };

  nav.items = [
    { id: "overview", label: "Overview", href: "/news-events" },
    {
      id: "news",
      label: "News",
      href: "/news-events/news",
      items: [
        {
          id: "global-messages",
          label: "Global Messages",
          href: "/news-events/news/global-messages",
        },
        {
          id: "press-releases",
          label: "Press Releases",
          href: "/news-events/news/press-releases",
        },
      ],
    },
  ];
</script>
```

### Current state

- Pass `currentHref` or `currentId` at the component level.
- Prefer `currentId` when URLs can vary by environment, locale, or query string.
- Only the matched current page link receives `aria-current="page"`.
- Ancestor links in the current path remain normal links. They may receive internal path styling, but they do not receive `aria-current`.

### Visibility rule

Sidebar Nav keeps the rendered DOM small and predictable:

- The `root` web-area link always renders when provided.
- Top-level items always render.
- Each path ancestor renders its immediate children.
- The current item renders its immediate children when it has children.
- A leaf-current item still shows its sibling set because those links are the selected parent’s immediate children.
- Unrelated descendant branches are omitted from the DOM, not hidden with CSS.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `label` | string | `` | Accessible label for the internal navigation landmark when `labelledby` is not provided. |
| `labelledby` | string \| undefined | `undefined` | ID of an external visible heading that labels the navigation landmark. |
| `root` | FdSidebarNavRoot \| undefined | `undefined` | Optional level-0 web-area link rendered before the item tree. |
| `items` | FdSidebarNavItem[] | `[]` | Structured navigation tree. Invalid items without labels or hrefs are omitted. |
| `currentHref` | string \| undefined | `undefined` | Current-page href matcher. Used when `currentId` is not provided. |
| `currentId` | string \| undefined | `undefined` | Current-page item id matcher. Takes precedence over `currentHref`. |
| `maxDepth` | 1 \| 2 \| 3 \| 4 | `4` | Maximum rendered item depth, capped to the Figma-supported four levels. |
| `allowExplicitExpanded` | boolean | `false` | Allows item-level `expanded` branches as an opt-in CMS escape hatch. |

```ts
type FdSidebarNavRoot = {
  label: string;
  href: string;
};

type FdSidebarNavItem = {
  id?: string;
  label: string;
  href: string;
  items?: FdSidebarNavItem[];
  expanded?: boolean;
};
```

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-sidebar-nav-width` | var(--fdic-layout-sidebar-width, 20rem) | Inline size of the sidebar navigation. |
| `--fd-sidebar-nav-item-min-height` | 40px | Minimum block size for each full-row link target. |
| `--fd-sidebar-nav-indent-step` | var(--fdic-spacing-md, 16px) | Indentation step applied per item level. |
| `--fd-sidebar-nav-current-indicator-width` | 4px | Width of the current-page indicator stripe. |
| `--fd-sidebar-nav-divider-color` | var(--fdic-color-border-divider) | Divider color between the root link and item tree. |

## Shadow parts

| Name | Description |
|---|---|
| `nav` | Internal navigation landmark. |
| `list` | Root and nested unordered lists. |
| `sublist` | Nested unordered lists. |
| `item` | List item wrapper for each link. |
| `link` | Native full-row anchor element. |
| `root-link` | Optional level-0 web-area anchor. |
| `divider` | Divider rendered after the root link when child items are present. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont">
  <div>
    <h3>Do</h3>
    <ul>
      <li>Keep labels short and close to the destination page titles.</li>
      <li>Keep ordering stable across pages in the same section.</li>
      <li>Pass current state from the route or CMS, not from item-level flags.</li>
    </ul>
  </div>
  <div>
    <h3>Don’t</h3>
    <ul>
      <li>Use duplicate labels for different destinations in the same tree.</li>
      <li>Use Sidebar Nav as a disclosure tree or accordion.</li>
      <li>Show four levels unless the section really needs that depth.</li>
    </ul>
  </div>
</div>

## Content guidelines

- Use nouns people recognize, such as “Press Releases” or “Board Meetings.”
- Avoid vague labels like “Learn more,” “Resources,” or “Other” unless that is the actual page title and surrounding context makes it clear.
- Keep the root label to the web area or section name.
- Review long sidebars for trust and comprehension. Users should not need to guess where a financial-service page belongs.

## Accessibility

- The component renders a native `<nav>` with either `aria-label` or `aria-labelledby`.
- It renders real `<ul>`, `<li>`, and `<a>` elements. Links preserve right-click, copy-link, open-in-new-tab, browser status text, and normal keyboard behavior.
- The full row is the link target.
- Only the actual current page link receives `aria-current="page"`.
- V1 does not render `aria-expanded` because there is no disclosure control.
- V1 does not use `role="menu"`, `menuitem`, roving tabindex, or arrow-key navigation.
- Omitted branches are absent from the DOM, so keyboard and screen reader users do not encounter hidden navigation destinations.
- Focus remains visible in forced-colors mode.

## Known limitations

- Items are property-driven in v1. Slotted custom trees are deferred.
- The component does not observe the router automatically. Applications must pass `currentHref` or `currentId`.
- V1 does not provide mobile drawer behavior.
- V1 supports up to four item levels to match the Figma indentation model.
- `allowExplicitExpanded` is an escape hatch for authored CMS exceptions, not the default navigation model.

## Related components

- [Sidebar Menu](/components/sidebar-menu) — use when local navigation needs user-controlled expandable branches.
- [Global Header](/components/global-header) — use for global site navigation.
- [Pagination](/components/pagination) — use for bounded result-page navigation.
- [Link](/components/link) — use for standalone inline or standalone navigation links.
- [Content Page Recipes](/guide/content-page-recipes) — page-level layouts that can host Sidebar Nav.
