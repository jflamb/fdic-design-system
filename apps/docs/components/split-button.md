# Split Button

A split button combines a primary action button with a secondary trigger that opens a menu of related alternate actions.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-split-button</code> when you have a single primary action with a small set of clearly related alternates. The component renders a primary action segment alongside a trigger that opens an <code>fd-menu</code> containing <code>fd-menu-item</code> elements. Split buttons are a high-complexity pattern and should be used sparingly.</p>
</div>

## When to use

- **A single primary action has clearly related alternates** — For example, "Save" with "Save as Draft" and "Save & Close," or "Download" with "Download as PDF" and "Download as CSV."
- **The primary action is obvious** — The most common action should be immediately available without opening the menu. The alternates are less frequent variations of the same intent.
- **You need to conserve space** — When separate buttons for each action would create visual clutter, but the actions are related enough to group.

## When not to use

- **Don't use when the actions are not clearly related** — If the menu items are conceptually different from the primary action, use separate buttons instead. A split button implies the menu contains variations of the primary action.
- **Don't use when there are many options** — If you have more than four or five alternates, consider a standalone menu or select pattern instead. Split buttons work best with a small set of choices.
- **Don't use when the primary action is not obvious** — If no single action is clearly more common than the others, use a button group or separate buttons so each action has equal visual weight.
- **Don't use for navigation** — Split buttons are for actions, not for navigating to different pages.
- **When in doubt, prefer separate buttons** — Split buttons introduce keyboard and focus complexity. Use them only when the grouping genuinely helps the user.

## Examples

<StoryEmbed
  storyId="components-split-button--docs-overview"
  linkStoryId="components-split-button--playground"
  caption="Split button variants and states. Open Storybook for interactive controls, disabled states, and placement options."
/>

## Usage

```html
<fd-split-button variant="primary" trigger-label="More save options">
  Save
  <fd-menu-item slot="menu">Save as Draft</fd-menu-item>
  <fd-menu-item slot="menu">Save & Submit for Review</fd-menu-item>
</fd-split-button>
```

With a leading icon:

```html
<fd-split-button variant="primary" trigger-label="More save options">
  <fd-icon slot="icon-start" name="floppy-disk"></fd-icon>
  Save
  <fd-menu-item slot="menu">Save as Draft</fd-menu-item>
  <fd-menu-item slot="menu">Save & Submit for Review</fd-menu-item>
</fd-split-button>
```

## Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary"` \| `"neutral"` \| `"subtle"` \| `"outline"` \| `"destructive"` | `"primary"` | Visual variant applied to both segments |
| `disabled` | `boolean` | `false` | Disables both segments. The menu cannot open while disabled. |
| `trigger-disabled` | `boolean` | `false` | Disables only the trigger segment. The primary action remains active. |
| `trigger-label` | `string` | `"More options"` | Accessible name for the trigger segment. Reflected public attribute. Should describe the menu contents contextually. |
| `menu-placement` | `Placement` | `"bottom-start"` | Preferred placement of the menu relative to the trigger. Reflected public attribute. |
| `open` | `boolean` | `false` | Read-only reflected state indicating whether the menu is open. Derived from internal `fd-menu` events. Do not set directly. |

## Slots

| Name | Description |
|------|-------------|
| (default) | Label content for the primary action segment |
| `icon-start` | Leading icon for the primary segment (use `fd-icon`) |
| `menu` | `fd-menu-item` elements only. Items are adopted into the internal `fd-menu` on connection. |

## Events

| Name | Detail | Description |
|------|--------|-------------|
| `fd-split-button-action` | `{}` | Fired when the primary segment is activated |
| `fd-split-button-open-change` | `{ open: boolean }` | Fired when the menu opens or closes |

Compatibility note:

- `fd-split-button` still fires deprecated `fd-split-action` and `fd-split-open` during the compatibility window.
- New consumer code should listen to `fd-split-button-action` and `fd-split-button-open-change`.

## CSS custom properties

| Name | Default | Description |
|------|---------|-------------|
| `--fd-split-button-divider-color` | Variant-dependent | Color of the divider between the primary and trigger segments |
| `--fd-split-button-divider-width` | `1px` | Thickness of the divider |
| `--fd-split-button-trigger-width` | `44px` | Width of the trigger segment (minimum touch target) |

## Shadow parts

| Name | Description |
|------|-------------|
| `container` | Outer wrapper containing both segments |
| `primary` | The primary action button element |
| `trigger` | The menu trigger button element |
| `divider` | The visual divider between the two segments |

## Accessibility

### Keyboard behavior

**Primary segment:**

| Key | Behavior |
|-----|----------|
| `Enter` / `Space` | Fires `fd-split-button-action` |
| `Tab` | Moves focus to the trigger segment |

**Trigger segment:**

| Key | Context | Behavior |
|-----|---------|----------|
| `Enter` / `Space` | Menu closed | Opens the menu |
| `Enter` / `Space` | Menu open | Closes the menu |
| `ArrowDown` | Menu closed | Opens the menu and focuses the first item |
| `ArrowUp` | Menu closed | Opens the menu and focuses the last item |
| `Escape` | Menu open | Closes the menu and returns focus to the trigger (handled by `fd-menu`) |
| `Tab` | Menu open | Closes the menu and moves focus naturally (handled by `fd-menu`) |

### Screen reader naming

- The primary segment is named by its slotted text content (e.g., "Save").
- The trigger segment requires `trigger-label` for its accessible name. Use a contextual label that describes the menu contents, such as "More save options" rather than just a caret symbol.

### ARIA attributes

- The trigger button has `aria-haspopup="menu"` to indicate it opens a menu.
- The trigger button has `aria-expanded` reflecting the current open state.
- The trigger button uses `aria-label` set from the `trigger-label` property.
- The caret icon inside the trigger is `aria-hidden="true"`.

### Focus management

- Each segment is independently focusable with its own `:focus-visible` ring.
- When the menu closes (via Escape, item selection, or outside click), focus returns to the trigger segment. This is handled by `fd-menu`.
- When `disabled` or `trigger-disabled` becomes true while the menu is open, the menu closes automatically.

### DOM adoption

Menu items provided in the `menu` slot are adopted into the internal `fd-menu` after connection. They leave the consumer's light DOM and become children of the component's internal menu. This is the documented contract — do not rely on the items remaining in your light DOM after the component connects.

## Content guidelines

- **Primary label should be the most common action.** The visible button text should name the action users will take most often. Less frequent alternates go in the menu.
- **Name the trigger contextually.** Set `trigger-label` to describe what the menu contains — "More save options," "Other export formats," "Additional actions." Avoid generic labels like "More" or leaving it as just a caret.
- **Menu items should be clearly related alternates.** Every item in the menu should be a variation of the primary action's intent. If an item feels unrelated, it belongs elsewhere.
- **Use sentence case for all labels.** Both the primary label and menu items should use sentence case for readability.

## Known limitations

- **`loading` / `loading-label` is not supported in v1** — Loading state is gated on loading state pattern maturity across the system.
- **`fd-menu-item` only in v1** — The menu slot accepts only `fd-menu-item` elements. Arbitrary content, grouped items, and separators are not supported.
- **Form submission is not supported** — `fd-split-button` is not form-associated. Use native form controls for submit/reset behavior.
- **`trigger-label` is shared with the internal menu label** — The trigger's `aria-label` and the internal `fd-menu`'s `label` attribute use the same value. This is an accessibility compromise for a smaller API surface in v1.

## Related components

<ul class="fdic-related-list">
  <li><a href="./button">Button</a> — For single-action buttons without a menu. Split buttons are separate from button groups; if actions are independent, use individual <code>fd-button</code> elements instead.</li>
</ul>
