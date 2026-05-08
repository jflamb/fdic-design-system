# Org Details

Org Details renders the selected organization record, its reporting context, source information, and review metadata.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-org-details</code> beside or below Org Outline to explain what is selected without opening a dialog or changing the page context.</p>
</div>

## When to use

- Use it when a selected organization node needs source, reporting, acting, override, or conflict details.
- Use it in editor review flows where source-of-truth and override values must be compared.
- Use the <code>actions</code> slot for downstream workflow actions, such as opening a source record.

## When not to use

- Do not use it as a modal dialog.
- Do not use it to resolve conflicts in v1. It displays conflict evidence; workflow actions belong to the consuming application.
- Do not rely on color or strikethrough alone to explain conflicts.

## Examples

<StoryEmbed
  storyId="components-org-details--override-with-conflict"
  linkStoryId="components-org-details--playground"
  caption="Org Details shows an editorial override with side-by-side source-of-truth and override values."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `tree` | FdOrgTree | `undefined` | Normalized organization tree returned by `normalizeOrgTree(input)`. |
| `nodeId` | string | `undefined` | Selected node id to display in the details panel. |
| `emptyLabel` | string | `Select an organization record to review details.` | Message shown when no node is selected. |

## Slots

| Name | Description |
|---|---|
| `actions` | Optional downstream actions for the selected node. |

## Shadow parts

| Name | Description |
|---|---|
| `panel` | Details panel wrapper. |
| `live` | Visually hidden polite live region announcing the selected record. |
| `eyebrow` | Node type and source-status summary. |
| `heading` | Selected node heading. |
| `status` | Status badge row. |
| `badge` | Individual text-plus-icon status badge. |
| `section` | Grouped details section. |
| `conflict` | Conflict comparison block. |
| `actions` | Optional actions slot wrapper. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont">
  <div>
    <h3>Do</h3>
    <ul>
      <li>Pair details with a visible outline selection.</li>
      <li>Show source labels, freshness, and effective dates when available.</li>
      <li>Keep conflict labels explicit: “Source of truth” and “Override.”</li>
    </ul>
  </div>
  <div>
    <h3>Don’t</h3>
    <ul>
      <li>Hide diagnostics from editors.</li>
      <li>Ask people to infer status from color.</li>
      <li>Use the panel for destructive review actions without app-level confirmation.</li>
    </ul>
  </div>
</div>

## Content guidelines

- Use plain labels for source status: Official, Draft, Historical, and Editorial override.
- For acting assignments, include start date, end date if known, and the source label.
- When source and override values disagree, show both values rather than replacing one silently.

## Accessibility

- The panel is a regular section, not a dialog.
- Selection changes are announced through <code>aria-live="polite"</code>.
- Keyboard order should move from toolbar to outline to details in the composed pattern.
- Text wraps at 200% zoom and details stack on narrow screens.
- Status remains identifiable in greyscale because every state uses text plus an icon marker.

## Known limitations

- V1 details are display-first. They do not fetch live records or submit conflict resolution.
- Contact and photo fields are represented by the data contract but should remain consumer-supplied until the policy is settled.

## Related components

- [Org Outline](/components/org-outline)
- [Badge](/components/badge)
