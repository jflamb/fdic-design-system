# Header Search

`fd-header-search` is the top-level search component used by the global-header family. It supports the approved FDICnet desktop suggestion panel and the mobile suggestion drawer while keeping the search data model application-owned.

## When to use

- Use it when the search field needs to stand on its own as a reusable header-family primitive.
- Use it when search suggestions should be derived from local IA or application-provided menu/search data.
- Use it when desktop and mobile surfaces need the same query and result model with different presentation.

## When not to use

- Don’t use it as a full search-results page or async autocomplete client by itself.
- Don’t use it for generic app search modals that are not part of the global-header family.
- Don’t make it fetch YAML, CMS content, or remote suggestions at runtime.

## Examples

<StoryEmbed
  storyId="supporting-primitives-header-search--desktop-suggestions"
  linkStoryId="supporting-primitives-header-search--mobile-suggestions"
  height="420"
  caption="Desktop and mobile reference-aligned search stories using the exact FDICnet main-menu fixture data."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `surface` | `"desktop" \| "mobile"` | `desktop` | Presentation surface. Use `desktop` for the attached suggestion panel and `mobile` for the drawer-backed suggestion surface. |
| `action` | `string` | `/search` | Fallback results URL used when submit is not canceled and no direct result is selected. |
| `label` | `string` | `Search` | Accessible label announced for the search control. |
| `placeholder` | `string` | `Search` | Placeholder text shown inside the native search input. |
| `submit-label` | `string` | `"Open first matching result"` | Accessible label for the submit control. |
| `search-all-label` | `string` | `"Search all"` | Reserved label for broader search affordances supplied by the application contract. |
| `param-name` | `string` | `"q"` | Query-string parameter name used when constructing the fallback search URL. |
| `items` | `FdHeaderSearchItem[]` | `[]` | Consumer-provided suggestion corpus. Set this as a JavaScript property; it is not reflected to an HTML attribute. |
| `value` | `string` | `` | Current query value. Assign a new string to coordinate desktop and mobile instances through a parent. |
| `open` | `boolean` | `false` | Whether the search suggestion surface is open. Primarily used for the mobile drawer-backed presentation. |

- `fd-header-search` owns suggestion filtering and active-result state.
- Parents may coordinate `value` and `open` across multiple search surfaces.

## Events

| Name | Detail | Description |
|---|---|---|
| `fd-header-search-input` | `{ value: string, surface: "desktop" \| "mobile" }` | Fired whenever the query value changes. |
| `fd-header-search-open-change` | `{ open: boolean, surface: "desktop" \| "mobile" }` | Fired when the component opens or closes its search surface. |
| `fd-header-search-submit` | `{ query: string, href: string, firstMatchHref?: string, surface: "desktop" \| "mobile" }` | Cancelable event fired on submit before default navigation occurs. |
| `fd-header-search-activate` | `{ item: FdHeaderSearchItem, query: string, surface: "desktop" \| "mobile" }` | Cancelable event fired before a suggestion link is activated. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-header-search-font-family` | `var(--fdic-font-family-sans-serif, "Source Sans 3", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)` | Font family used for the search control and suggestion content. |

## Shadow parts

| Name | Description |
|---|---|
| `form` | Input row containing the label, query field, clear affordance, and submit control. |
| `results` | Desktop suggestion panel surface. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- The input stays a native search field with an attached suggestion list of real links.
- Desktop suggestions stay attached to the input; mobile suggestions reuse `fd-drawer` for modal presentation, focus trapping, and focus restoration while the mobile surface is open.
- The component emits cancelable submit and activate events before navigation so applications can route without losing semantics.
- Non-essential motion should be reducible by the consuming surface; in the global-header family, reduced-motion handling is applied at the header level.
- Multiple instances are safe because all generated control IDs are instance-scoped.

## Known limitations

- The default implementation filters a supplied static data set; async providers remain application-owned.
- The fallback submission target is a URL contract, not a built-in search-results renderer.

## Related components

- [Global Header](/components/global-header)
- [Drawer](/components/drawer)
