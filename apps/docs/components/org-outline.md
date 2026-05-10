# Org Outline

Org Outline renders an organization hierarchy as semantic nested lists with native disclosure controls.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-org-outline</code> as the canonical v1 view for dynamic org charts. It is designed for source-aware hierarchy review, search, filtering, print, and mobile reflow without requiring a visual chart renderer.</p>
</div>

## When to use

- Use it when people need to browse reporting structure, offices, positions, people, and vacancies.
- Use it when source status matters, including draft/proposed, historical/effective-dated, and editorial override records.
- Use it as the accessible source of truth for the composed Dynamic Org Chart pattern.

## When not to use

- Do not use it as an ARIA tree widget. V1 intentionally avoids <code>role="tree"</code>, roving tabindex, and arrow-key tree navigation.
- Do not use it for a visual chart layout. The chart adapter is post-v1.
- Do not use it with live fetching in v1. Normalize source data before passing a tree to the component.

## Examples

<StoryEmbed
  storyId="components-org-outline--docs-overview"
  linkStoryId="components-org-outline--playground"
  caption="Org Outline shows the FDIC-shaped fixture with acting and source-status badges."
/>

### Basic usage

```html
<fd-org-outline label="Organization outline"></fd-org-outline>

<script type="module">
  import "@jflamb/fdic-ds-components/register/fd-org-outline";
  import { normalizeOrgTree } from "@jflamb/fdic-ds-components/fd-org-outline";

  const outline = document.querySelector("fd-org-outline");
  const { tree, diagnostics } = normalizeOrgTree(sourceNodes);

  outline.tree = tree;
  outline.addEventListener("fd-org-select", (event) => {
    console.log(event.detail.nodeId);
  });

  if (diagnostics.length) {
    console.warn("Org chart diagnostics", diagnostics);
  }
</script>
```

### Status display

Status uses text plus iconography and never depends on color alone. Source status and node type are separate fields, so combinations such as <code>person</code> plus <code>override</code> plus <code>actingMeta</code> remain representable.

### Optional avatars

Org Outline can show a decorative avatar for person nodes when <code>person.photoRef</code> is present and <code>photoResolver</code> returns an image URL. The avatar uses <code>fd-visual type="avatar"</code>, keeps empty image alt text, and never replaces the visible person label.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `label` | string | `Organization outline` | Accessible label for the outline navigation landmark. |
| `emptyLabel` | string | `No organization records are available.` | Message shown when the tree has no organization records. |
| `noResultsLabel` | string | `No organization records match the current filters.` | Message shown when search or filters hide every organization record. |
| `tree` | FdOrgTree | `undefined` | Normalized organization tree returned by `normalizeOrgTree(input)`. |
| `currentNodeId` | string | `undefined` | Selected node id. Matching ancestors open automatically. |
| `searchQuery` | string | `` | Search text used to highlight matching nodes and keep ancestors visible. |
| `filters` | FdOrgFilterState | `{}` | Approved v1 filters for node type, source/status, and acting assignment. |
| `photoResolver` | FdOrgPhotoResolver | `undefined` | Optional resolver that maps person nodes with `person.photoRef` to decorative avatar image URLs. |

## Events

| Name | Detail | Description |
|---|---|---|
| `fd-org-select` | { nodeId: string; node: FdOrgNode } | Fired when a user selects an org node from a summary or leaf button. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-org-outline-indent` | var(--fdic-spacing-lg, 24px) | Indentation step for nested organization branches. |
| `--fd-org-outline-transition-duration` | 160ms | Disclosure indicator transition duration. Suppressed when `prefers-reduced-motion: reduce` is active. |

## Shadow parts

| Name | Description |
|---|---|
| `outline` | Root outline navigation container. |
| `list` | Root and nested unordered lists. |
| `item` | List item wrapper for each organization node. |
| `disclosure` | Native details disclosure wrapper for nodes with children. |
| `summary` | Native summary row for expandable nodes. |
| `node-button` | Native button row for leaf-node selection. |
| `avatar` | Decorative `fd-visual` avatar for person nodes when photo media is available. |
| `label` | Node label text. |
| `meta` | Secondary title or metadata line. |
| `indicator` | Ambient "has issues" dot. Hidden when the node has no open issues. |
| `sr-only` | Visually hidden text linked from the indicator via aria-describedby. |
| `empty` | Empty-state message shown when the tree is empty or filters hide every record. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont">
  <div>
    <h3>Do</h3>
    <ul>
      <li>Pass normalized data from <code>normalizeOrgTree(input)</code>.</li>
      <li>Surface diagnostics in editor review workflows.</li>
      <li>Keep labels short enough to scan at 200% zoom.</li>
      <li>Use avatars only as decorative reinforcement for person records.</li>
    </ul>
  </div>
  <div>
    <h3>Don’t</h3>
    <ul>
      <li>Silently drop org-meaningful records.</li>
      <li>Add effective-date or skip-level filters to v1.</li>
      <li>Use color-only status indicators.</li>
      <li>Use profile photos to communicate status, seniority, or source confidence.</li>
    </ul>
  </div>
</div>

## Content guidelines

- Use the office, position, or person label people would expect from the source system.
- Use “Editorial override,” “Draft,” and “Historical” exactly when those states apply.
- When CHRIS source data and editorial override disagree, surface the disagreement through `conflictMeta` so the details panel can show both values side by side.

## Accessibility

- The component renders native <code>ul</code>, <code>li</code>, <code>details</code>, <code>summary</code>, and <code>button</code> elements.
- Keyboard traversal follows native tab order. <kbd>Enter</kbd> and <kbd>Space</kbd> activate the focused native control.
- Disclosure state is announced by the browser through native <code>summary</code> behavior.
- Focus indicators remain visible on summary rows and leaf buttons.
- Avatars are decorative; the adjacent visible text remains the accessible name.
- Reduced motion suppresses disclosure indicator animation.
- At 200% zoom, the outline wraps without requiring horizontal page scroll.

## Known limitations

- V1 is outline-first on every viewport.
- The visual chart adapter, chart pan/zoom, and desktop chart default are post-v1.
- There is no user-facing historical date picker, live fetch, CHRIS/API dependency, or visual chart renderer in v1.

## Related components

- [Org Details](/components/org-details)
- [Badge](/components/badge)
