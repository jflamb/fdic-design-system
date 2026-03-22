# Menu

An action menu surfaces a list of actions triggered by a button or other control. Use it when a set of related actions does not need to be visible at all times.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-menu</code> and <code>fd-menu-item</code> together to create an action menu that follows the <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/">WAI-ARIA menu-button pattern</a>. The menu renders a <code>role="menu"</code> container inside a native <code>popover="auto"</code> surface. Each item renders a native <code>&lt;button role="menuitem"&gt;</code>.</p>
</div>

## When to use

- **A group of related actions shares one trigger** — "Save as draft," "Save & submit," and "Discard" are logically grouped and do not all need to be visible at the same time.
- **Screen space is constrained** — A toolbar or table row has room for one action button but needs to offer secondary actions on demand.
- **The actions are infrequent** — Users do not need to see every option at a glance. Hiding low-frequency actions behind a trigger reduces visual noise.

## When not to use

- **Don't use a menu for navigation links** — `fd-menu` uses `role="menu"` and `role="menuitem"`, which signal actions to assistive technology. For navigation, use a `<nav>` with regular links.
- **Don't use a menu for form controls** — Selection from a list of options is a listbox or select pattern, not a menu. Menus are for actions that happen when activated, not for choosing a value.
- **Don't use a menu for a single action** — If there is only one action, use a button directly. Menus add interaction cost.
- **Don't nest menus (submenus)** — Submenus are not supported in v1 and add significant accessibility and usability complexity. Flatten the action list or use a different pattern.

## Examples

<StoryEmbed
  storyId="components-menu--docs-overview"
  linkStoryId="components-menu--default"
  height="520"
  caption="Menu overview — compare default actions, icon usage, destructive ordering, and disabled items in one compact preview. Open each menu in Storybook for interaction details."
/>

<StoryEmbed
  storyId="components-menu--long-menu"
  linkStoryId="components-menu--long-menu"
  height="400"
  caption="Long list behavior — when actions exceed the max-height, the menu scrolls internally instead of expanding indefinitely."
/>

The second embed is intentional. The long-menu state demonstrates internal scrolling behavior that the overview story cannot communicate clearly in a single compact preview.

- Label the trigger with what the menu contains so the action list is predictable before opening.
- Keep destructive actions last and visually distinct.
- Leave disabled actions visible when discoverability matters, but avoid filling a menu with mostly unavailable items.
## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Label the trigger with what the menu contains</h4>
    <p>"Filing actions" or "Export options" tells the user what to expect before opening the menu.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use vague triggers like "More" or "..."</h4>
    <p>Generic triggers force the user to open the menu to understand what it contains. In regulatory contexts, predictability builds trust.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Put destructive actions last</h4>
    <p>Placing destructive actions at the end of the menu reduces accidental activation and follows user expectations.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Mix destructive and non-destructive actions randomly</h4>
    <p>Interleaving high-risk and low-risk actions increases the chance of mistakes in time-pressured workflows.</p>
  </div>
</div>

## Content guidelines

<div class="fdic-content-rule">
  <strong>Start item labels with a verb.</strong>
  <p>Menu items are actions. Lead with what happens when the user activates the item.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Export as PDF</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>PDF export</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Keep item labels short — 1 to 4 words.</strong>
  <p>Menu items should be scannable. Move additional context to surrounding UI.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Discard filing</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Discard this filing and all associated data permanently</p>
    </div>
  </div>
</div>

## Accessibility

- **`fd-menu` renders `role="menu"`** inside a native `popover="auto"` surface. The menu container requires an accessible name — set `label` (for `aria-label`) or `labelledby` (for `aria-labelledby`) on `fd-menu`.
- **`fd-menu-item` renders a native `<button role="menuitem">`** inside shadow DOM. The button text provides the accessible name.
- **Keyboard model** follows the [WAI-ARIA menu-button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/):

  | Key | Behavior |
  |-----|----------|
  | ArrowDown | Move to next item (wraps to first) |
  | ArrowUp | Move to previous item (wraps to last) |
  | Home | Move to first item |
  | End | Move to last item |
  | Enter / Space | Activate item, close menu, return focus to trigger |
  | Escape | Close menu, return focus to trigger |
  | Tab | Close menu, allow natural focus movement |

- **Roving tabindex**: Only one item has `tabindex="0"` at a time; the rest have `tabindex="-1"`. Arrow keys move focus between items.
- **Disabled items** remain in the arrow-key rotation so users can discover them, but Enter/Space on a disabled item is a no-op. Disabled items use `aria-disabled="true"`.
- **`aria-expanded`**: When `anchor` is set on `fd-menu`, the component manages `aria-expanded` on the anchor element automatically. The consumer must set `aria-haspopup="menu"` on the trigger.
- **Focus return**: On close via Escape or item activation, focus returns to the trigger. On close via outside click, focus goes to the click target. On close via Tab, focus moves naturally.
- **Forced colors**: Menu surface and items use system colors (`ButtonBorder`, `ButtonText`, `Highlight`, `HighlightText`, `GrayText`) so the menu remains distinguishable in Windows High Contrast mode.
- **Reduced motion**: A media query guard suppresses any future animations under `prefers-reduced-motion: reduce`.

### Trigger requirements

The trigger element (the button that opens the menu) must have:

- `aria-haspopup="menu"` — set by the consumer
- `aria-expanded` — managed automatically by `fd-menu` when `anchor` is set
- Keyboard handling to open the menu (Enter/Space/ArrowDown for first item, ArrowUp for last item) — consumer's responsibility for standalone usage; composed components like `fd-split-button` handle this internally

## Known limitations

- **Standalone usage is advanced** — `fd-menu` does not render or manage its trigger. Standalone consumers must wire `aria-haspopup`, trigger keyboard behavior, and `show()`/`hide()` calls manually. The recommended path is composed components like `fd-split-button`, which handle all wiring internally.
- **No type-ahead** — Character search to jump to matching items is deferred from v1.
- **No submenus** — Nested/cascading menus are out of scope.
- **No separators or groups** — Menu item separators and named groups are deferred.
- **No checkbox or radio items** — `menuitemcheckbox` and `menuitemradio` roles are out of scope.
- **No link items** — `fd-menu-item` renders an action button, not a navigation link. Navigation-link menus are a separate future primitive.
- **No animation** — Open/close transitions are not implemented in v1.

## Related components

<ul class="fdic-related-list">
  <li><a href="./button">Button</a> — Use <code>fd-button</code> as the trigger for the menu. Set <code>aria-haspopup="menu"</code> on the trigger and wire it to <code>fd-menu</code>'s <code>show()</code> / <code>toggle()</code> methods.</li>
  <li><a href="./icon">Icon</a> — Use <code>fd-icon</code> in the <code>icon-start</code> slot of <code>fd-menu-item</code> to add leading icons to menu actions.</li>
</ul>
