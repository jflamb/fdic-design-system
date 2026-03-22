# Button Group

Button groups present a small set of related actions with consistent spacing, predictable ordering, and responsive stacking.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-button-group</code> to arrange multiple independent <code>fd-button</code> actions as a single visual set. The component is a layout wrapper: it does not change button semantics, it does not intercept keyboard input, and it only adds <code>role="group"</code> when you provide a meaningful <code>label</code>.</p>
</div>

## When to use

- **A task needs several closely related actions** — For example, "Save," "Save and continue," and "Cancel" at the end of a form or workflow step.
- **You need consistent spacing and alignment** — The group keeps teams from rebuilding one-off flex wrappers with inconsistent gaps and ordering.
- **Actions must remain visible on narrow screens** — The component stacks actions instead of hiding them in an overflow menu.

## When not to use

- **Don't use it for a single action** — A lone button does not need a grouping wrapper.
- **Don't use it when one action owns related alternates** — If there is a clear primary action with a small menu of variants, use <code>fd-split-button</code> instead.
- **Don't add `label` just because the buttons are adjacent** — Visual proximity alone is not enough reason to create a semantic group.

## Examples

<StoryEmbed
  storyId="components-button-group--docs-overview"
  linkStoryId="components-button-group--playground"
  height="420"
  caption="Common button group patterns: default horizontal layout, spread alignment, labeled action sets, and responsive stacking. Open Storybook for the full set of alignment and direction examples."
/>

## Usage

```html
<fd-button-group>
  <fd-button variant="primary">Save</fd-button>
  <fd-button variant="outline">Save and continue</fd-button>
  <fd-button variant="subtle">Cancel</fd-button>
</fd-button-group>
```

With semantic grouping:

```html
<fd-button-group label="Document actions" align="end">
  <fd-button variant="outline">Download PDF</fd-button>
  <fd-button variant="outline">Download CSV</fd-button>
  <fd-button variant="subtle">Share</fd-button>
</fd-button-group>
```

## Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"start"` \| `"end"` \| `"spread"` | `"start"` | Controls inline alignment for horizontal groups. `spread` keeps the first action at inline start and pushes the remaining actions to inline end. |
| `direction` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Horizontal groups wrap and can stack responsively. Vertical groups always stack. |
| `label` | `string` | — | Adds `role="group"` and `aria-label` when the action set needs a semantic label. Omit for purely visual grouping. |

## Slots

| Name | Description |
|------|-------------|
| (default) | One or more `fd-button` elements. Other interactive controls are technically allowed, but the documented pattern is `fd-button`. |

## CSS custom properties

| Name | Default | Description |
|------|---------|-------------|
| `--fd-button-group-gap` | `var(--fdic-spacing-sm, 0.75rem)` | Gap between actions in the group |
| `--fd-button-group-stack-at` | `480px` | Width threshold below which horizontal groups stack vertically |

## Shadow parts

| Name | Description |
|------|-------------|
| `container` | Internal flex container used for layout |

## Accessibility

- `fd-button-group` is **presentational by default**. It does not add `role="group"` or `role="toolbar"` unless you explicitly provide a `label`.
- When `label` is provided, the internal container gets **`role="group"` plus `aria-label`**. Use this only when the set benefits from a shared name, such as "Document actions" or "Approval actions."
- **Native button semantics stay intact.** Each `fd-button` keeps its own tab stop, focus ring, and activation behavior.
- **No arrow-key interception.** This is not a toolbar pattern. Users move through actions with normal Tab order.
- **Responsive stacking preserves DOM order.** Keyboard navigation and screen reader reading order remain stable when the layout changes.

## Content guidelines

- **Keep the main action first in DOM order.** The first button should be the action you most want the user to take.
- **Use `align="spread"` to separate the escape action from the main path.** This works well for patterns like "Submit filing" on the left and "Save draft" plus "Cancel" on the right.
- **Limit the number of actions.** Three actions is a common maximum before decision-making slows down. If you need many actions, reconsider the workflow.
- **Use explicit action labels.** Government workflows benefit from direct verbs like "Save draft," "Escalate case," and "Cancel review."

## Known limitations

- **Toolbar behavior is out of scope in v1** — `fd-button-group` does not implement roving tabindex or arrow-key navigation.
- **Hierarchy is documented, not enforced** — The component does not prevent multiple primary buttons. Teams must apply the documented hierarchy intentionally.
- **`align` only affects horizontal, non-stacked groups** — Vertical groups and auto-stacked groups always align actions in a single column.
- **Responsive stacking is width-based** — The component stacks when its own rendered width is at or below `--fd-button-group-stack-at`. It does not hide actions or move them into a menu.

## Related components

<ul class="fdic-related-list">
  <li><a href="./button">Button</a> — Use <code>fd-button</code> for each action inside the group. Button groups coordinate layout; buttons retain semantics and state.</li>
  <li><a href="./split-button">Split Button</a> — Use <code>fd-split-button</code> when one primary action owns a small set of alternate actions instead of showing several independent buttons side by side.</li>
</ul>
