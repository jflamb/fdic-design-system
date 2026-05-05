# Sidebar Menu

Sidebar Menu renders local section navigation with native links and separate caret buttons for expanding or collapsing child branches.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-sidebar-menu</code> when a content-heavy page needs the same local navigation treatment as Sidebar Nav, but users also need to open and close child branches in place.</p>
</div>

## When to use

- **Expandable section navigation** — use Sidebar Menu beside long-form news, policy, guidance, or resource pages when sibling branches should be available on demand.
- **Tree-like local context** — use it when a section has meaningful child pages, but showing every branch all the time would make the sidebar too long.
- **CMS-backed navigation trees** — use it when a route, content model, or navigation service can pass a structured tree.

## When not to use

- **Do not use it for global navigation** — use [Global Header](/components/global-header) for primary site navigation.
- **Do not use it for in-page headings** — use the Prose table-of-contents pattern for links within one page.
- **Do not use it as an application command menu** — Sidebar Menu is still page navigation, not a toolbar, menu bar, or command list.
- **Do not use it to hide weak IA** — if the tree is too deep or hard to name clearly, fix the information architecture first.

## Examples

<StoryEmbed
  storyId="components-sidebar-menu--docs-overview"
  linkStoryId="components-sidebar-menu--playground"
  caption="Sidebar Menu renders a web-area root, native links, and separate caret buttons for expandable branches."
/>

### Basic usage

```html
<fd-sidebar-menu
  label="News section"
  current-href="/news-events/news/press-releases"
></fd-sidebar-menu>

<script type="module">
  const menu = document.querySelector("fd-sidebar-menu");

  menu.root = {
    label: "News & Events",
    href: "/news-events",
  };

  menu.items = [
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

### Expansion behavior

- Top-level items always render.
- Items with children render a separate caret button at the right edge.
- Current-path branches and item-level `expanded: true` branches open by default.
- Users can expand or collapse a branch with the caret button.
- Branch content stays in the DOM while collapsed, but it is hidden from keyboard and screen reader navigation with the native `hidden` attribute.

### Current state

- Pass `currentHref` or `currentId` at the component level.
- Prefer `currentId` when URLs can vary by environment, locale, or query string.
- Only the matched current page link receives `aria-current="page"`.
- Ancestor links in the current path remain normal links. They may receive internal path styling, but they do not receive `aria-current`.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `label` | string | `` | Accessible label for the internal navigation landmark when `labelledby` is not provided. |
| `labelledby` | string \| undefined | `undefined` | ID of an external visible heading that labels the navigation landmark. |
| `root` | FdSidebarMenuRoot \| undefined | `undefined` | Optional level-0 web-area link rendered before the item tree. |
| `items` | FdSidebarMenuItem[] | `[]` | Structured navigation tree. Invalid items without labels or hrefs are omitted. |
| `currentHref` | string \| undefined | `undefined` | Current-page href matcher. Used when `currentId` is not provided. |
| `currentId` | string \| undefined | `undefined` | Current-page item id matcher. Takes precedence over `currentHref`. |
| `maxDepth` | 1 \| 2 \| 3 \| 4 | `4` | Maximum rendered item depth, capped to the Sidebar Nav four-level indentation model. |

```ts
type FdSidebarMenuRoot = {
  label: string;
  href: string;
};

type FdSidebarMenuItem = {
  id?: string;
  label: string;
  href: string;
  items?: FdSidebarMenuItem[];
  expanded?: boolean;
};
```

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-sidebar-menu-width` | var(--fd-sidebar-nav-width, var(--fdic-layout-sidebar-width, 20rem)) | Inline size of the sidebar menu. |
| `--fd-sidebar-menu-item-min-height` | var(--fd-sidebar-nav-item-min-height, 40px) | Minimum block size for each link and toggle row. |
| `--fd-sidebar-menu-indent-step` | var(--fd-sidebar-nav-indent-step, var(--fdic-spacing-md, 16px)) | Indentation step applied per item level. |
| `--fd-sidebar-menu-toggle-size` | var(--fd-sidebar-nav-item-min-height, 40px) | Inline and minimum block size for each caret button. |
| `--fd-sidebar-menu-caret-size` | 1em | Rendered size of the caret icon. |
| `--fd-sidebar-menu-transition-duration` | 160ms | Duration for branch reveal/collapse and caret rotation. |
| `--fd-sidebar-menu-current-indicator-width` | var(--fd-sidebar-nav-current-indicator-width, 4px) | Width of the current-page indicator stripe. |
| `--fd-sidebar-menu-divider-color` | var(--fd-sidebar-nav-divider-color, var(--fdic-color-border-divider)) | Divider color between the root link and item tree. |

## Shadow parts

| Name | Description |
|---|---|
| `nav` | Internal navigation landmark. |
| `list` | Root and nested unordered lists. |
| `sublist` | Nested unordered lists. |
| `item` | List item wrapper for each link row. |
| `row` | Grid row that holds the link and optional caret button. |
| `link` | Native anchor element for a navigation destination. |
| `root-link` | Optional level-0 web-area anchor. |
| `toggle` | Caret button used to expand or collapse a child branch. |
| `divider` | Divider rendered after the root link when child items are present. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont">
  <div>
    <h3>Do</h3>
    <ul>
      <li>Keep labels short and close to the destination page titles.</li>
      <li>Use the caret only for showing or hiding child links.</li>
      <li>Default-open the branch that contains the current page.</li>
    </ul>
  </div>
  <div>
    <h3>Don’t</h3>
    <ul>
      <li>Use the caret button as the page link.</li>
      <li>Use duplicate labels for different destinations in the same tree.</li>
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
- It renders real `<ul>`, `<li>`, and `<a>` elements for navigation destinations.
- Carets are separate native `<button type="button">` controls with `aria-expanded`, `aria-controls`, and action labels such as “Expand News.”
- Links preserve right-click, copy-link, open-in-new-tab, browser status text, and normal keyboard behavior.
- Toggle buttons use normal button keyboard behavior: `Enter` or `Space` toggles the branch.
- V1 does not use `role="tree"`, `treeitem`, `role="menu"`, `menuitem`, roving tabindex, or arrow-key navigation.
- Collapsed branch content uses `hidden`, so keyboard and screen reader users do not encounter collapsed navigation destinations.
- Branch reveal/collapse and caret rotation are suppressed when the user requests reduced motion.
- Focus remains visible in forced-colors mode.

## Known limitations

- Items are property-driven in v1. Slotted custom trees are deferred.
- The component does not observe the router automatically. Applications must pass `currentHref` or `currentId`.
- V1 does not provide mobile drawer behavior.
- V1 supports up to four item levels to match the existing Sidebar Nav indentation model.
- Expanded/collapsed state is internal after render. Applications can set initial branches with item-level `expanded: true`.

## Related components

- [Sidebar Nav](/components/sidebar-nav) — use when local navigation should render deterministic branches without user-controlled expansion.
- [Global Header](/components/global-header) — use for global site navigation.
- [Pagination](/components/pagination) — use for bounded result-page navigation.
- [Content Page Recipes](/guide/content-page-recipes) — page-level layouts that can host Sidebar Menu.
