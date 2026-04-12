# Button

Buttons trigger actions or navigate to new pages. They tell the user what will happen next and visually communicate the importance and risk of that action.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-button</code> to let users take actions — confirming decisions, navigating to new pages, or triggering client-side operations. Six variants communicate the weight and risk of each action, including an inverted subtle treatment for dark surfaces. The component renders a native <code>&lt;button type="button"&gt;</code> by default, or an <code>&lt;a&gt;</code> when an <code>href</code> is provided.</p>
</div>

## When to use

- **The user needs to take an action** — Confirming a decision, starting a process, opening a dialog, or navigating to a destination that feels like an action ("Apply now," "Download report").
- **You need to communicate the importance of an action** — Primary for the main action, neutral or subtle for secondary actions, destructive for irreversible operations.
- **You need a link that looks and feels like a button** — Set the `href` attribute and `fd-button` renders an `<a>` element, preserving link semantics (right-click, cmd-click, screen reader link lists) while providing button styling.

## When not to use

- **Don't use buttons for inline navigation** — If the text sits inside a paragraph and navigates to another page, use a regular link. Buttons are for actions that feel like decisions, not for inline references.
- **Don't use buttons for toggling state** — Checkboxes, radio buttons, switches, and toggle buttons are better for on/off or selection patterns.
- **Don't use a destructive button without a confirmation step** — In a government/regulatory context, irreversible actions must give the user a chance to reconsider. Pair destructive buttons with confirmation dialogs or two-step flows.

## Examples

<StoryEmbed
  storyId="components-button--all-variants"
  linkStoryId="components-button--playground"
  caption="Variant comparison — primary, neutral, subtle, subtle inverted, outline, and destructive. Open Storybook to switch variants and states with controls."
/>

<StoryEmbed
  storyId="components-button--docs-overview"
  linkStoryId="components-button--playground"
  height="220"
  caption="Common patterns — icons, icon-only actions, link mode, and loading state in one compact preview. Open Storybook for the full set of dedicated examples."
/>

<StoryEmbed
  storyId="components-button--form-action-row"
  linkStoryId="components-button--playground"
  height="140"
  caption="Form action rows keep submit semantics on a native HTML button. Use `fd-button` for cancel, save draft, and other non-submitting actions."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `variant` | `"primary"` \| `"neutral"` \| `"subtle"` \| `"subtle-inverted"` \| `"outline"` \| `"destructive"` | `primary` | Visual treatment for the action. Use `subtle-inverted` on dark surfaces and `destructive` only for high-risk actions. |
| `disabled` | `boolean` | `false` | Makes the control inert. In link mode, `fd-button` uses `aria-disabled="true"` and suppresses navigation. |
| `href` | `string \| undefined` | `undefined` | When set, `fd-button` renders a native `<a>` instead of an internal `<button>`. |
| `target` | `string \| undefined` | `undefined` | Native link target. Applies only when `href` is set. |
| `rel` | `string \| undefined` | `undefined` | Native link relationship tokens. When `target="_blank"`, `fd-button` always adds `noopener noreferrer`. |
| `loading` | `boolean` | `false` | Shows a spinner and makes the control inert while work is in progress. |
| `loading-label` | `string \| undefined` | `undefined` | Optional replacement label to show and announce while `loading` is true. |

`fd-button` currently exposes a reactive `type` property in source, but v1 always renders `<button type="button">` in button mode. Submit/reset behavior is not part of the supported public contract.

## Slots

| Name | Description |
|---|---|
| (default) | Visible button label |
| `icon-start` | Leading icon content, typically `fd-icon` |
| `icon-end` | Trailing icon content, typically `fd-icon` |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-button-gap` | `var(--fdic-spacing-2xs, 4px)` | Gap between label and visual content |
| `--fd-button-height` | `44px` | Minimum button height |
| `--fd-button-min-width` | `44px` | Minimum button width |
| `--fd-button-radius` | `var(--fdic-corner-radius-sm, 3px)` | Corner radius |
| `--fd-button-font-size` | `var(--fdic-font-size-body, 18px)` | Button font size |
| `--fd-button-icon-only-size` | `var(--fd-button-height, 44px)` | Square size for icon-only buttons |
| `--fd-button-icon-edge-padding` | `11px` | Extra inline padding when a leading or trailing icon is present |
| `--fd-button-focus-gap` | `var(--fdic-color-bg-input, #ffffff)` | Inner gap color in the focus ring |
| `--fd-button-focus-ring` | `var(--fdic-color-border-input-focus, #38b6ff)` | Outer focus-ring color |
| `--fd-button-bg-primary` | `var(--fdic-color-bg-active, #0d6191)` | Primary background color |
| `--fd-button-text-primary` | `var(--fdic-color-text-inverted, #ffffff)` | Primary text color |
| `--fd-button-bg-destructive` | `var(--fdic-color-bg-destructive, #d80e3a)` | Destructive background color |
| `--fd-button-text-destructive` | `var(--fdic-color-text-inverted, #ffffff)` | Destructive text color |
| `--fd-button-bg-neutral` | `var(--fdic-color-bg-interactive, #f5f5f7)` | Neutral background color |
| `--fd-button-text-neutral` | `var(--fdic-color-text-primary, #212123)` | Neutral text color |
| `--fd-button-text-subtle` | `var(--fdic-color-text-primary, #212123)` | Subtle text color |
| `--fd-button-text-subtle-inverted` | `var(--fdic-color-text-inverted, #ffffff)` | Subtle inverted text and icon color |
| `--fd-button-text-outline` | `var(--fdic-color-text-link, #1278b0)` | Outline text color |
| `--fd-button-border-outline` | `var(--fdic-color-bg-active, #0d6191)` | Outline border color |
| `--fd-button-overlay-hover` | `var(--fdic-color-overlay-hover, rgba(0, 0, 0, 0.04))` | Hover overlay color |
| `--fd-button-overlay-active` | `var(--fdic-color-overlay-pressed, rgba(0, 0, 0, 0.08))` | Active overlay color |
| `--fd-button-overlay-hover-inverted` | `rgba(255, 255, 255, 0.12)` | Hover overlay color for `subtle-inverted` |
| `--fd-button-overlay-active-inverted` | `rgba(255, 255, 255, 0.18)` | Active overlay color for `subtle-inverted` |
| `--fd-button-bg-disabled` | `var(--fdic-color-bg-container, #f5f5f7)` | Disabled background color |
| `--fd-button-text-disabled` | `var(--fdic-color-text-disabled, #9e9ea0)` | Disabled text color |
| `--fd-button-border-outline-disabled` | `var(--fdic-color-border-input-disabled, #d6d6d8)` | Disabled outline border color |
| `--fd-button-spinner-size` | `1em` | Spinner size in loading state |
| `--fd-button-spinner-speed` | `0.8s` | Spinner rotation duration |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Internal native `<button>` or `<a>` element |
| `label` | Visible label wrapper |
| `spinner` | Loading spinner wrapper |

- **Primary** carries the main action on the page or section. Limit it to one primary button per section.
- **Subtle inverted** is for low-emphasis actions on dark surfaces such as mastheads, overlays, and other inverted shells.
- **Destructive** is for irreversible actions like deleting records or revoking access. Pair it with a confirmation step.
- **Icon-only** buttons require an accessible name on `fd-button`, such as `aria-label`.
- **Icon-only** buttons render as square controls with the icon centered horizontally and vertically.
- **Link mode** uses `href` and renders a native `<a>`, preserving link semantics.
- **Loading** prevents duplicate activation while the action is in progress. Use `loading-label` when the wait may be noticeable.
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use one primary button per section</h4>
    <p>A single primary button creates a clear visual hierarchy and tells the user where the main action is.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use multiple primary buttons in the same section</h4>
    <p>Competing primary buttons force the user to evaluate equal-weight options without guidance. Use neutral or outline for secondary actions.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use specific verb labels</h4>
    <p>"Submit filing," "Download report," "Revoke access" — the user knows exactly what will happen.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use vague labels like "Click here" or "Submit"</h4>
    <p>Generic labels leave the user guessing. In a regulatory context, clarity about the action builds trust and reduces errors.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Pair destructive buttons with a confirmation step</h4>
    <p>A dialog or two-step flow gives the user a chance to reconsider before an irreversible action.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Let a single click trigger an irreversible action</h4>
    <p>In government systems, accidental deletions or revocations can have legal and financial consequences. Always confirm.</p>
  </div>
</div>

## Content guidelines

<div class="fdic-content-rule">
  <strong>Start labels with a verb.</strong>
  <p>Buttons are actions. Lead with what happens when the user clicks.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Submit filing</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Filing submission</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Keep labels short — 1 to 3 words.</strong>
  <p>Buttons should be scannable at a glance. Move additional context to surrounding text.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Export data</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Export all quarterly data to CSV format</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Use sentence case.</strong>
  <p>Sentence case is easier to read and feels less formal than title case, which is important for approachability in public-facing government tools.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Download report</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Download Report</p>
    </div>
  </div>
</div>

## Loading state

Use the `loading` attribute when an action is in progress and you need to prevent duplicate submissions — for example, after the user clicks "Submit filing" and the request is still processing.

- **Loading is not disabled.** Loading means "your action is in progress, please wait." Disabled means "this action is not available right now." Use the right one.
- **The label stays visible by default.** The spinner appears alongside the text so the user can still read what action is pending.
- **Use `loading-label` for long-running actions.** If the wait may be noticeable, changing the label can improve clarity: `loading-label="Submitting…"` while the original label is "Submit filing."
- **Icon-only buttons** show the spinner in place of the icon. The accessible name (`aria-label`) is preserved.
- **Link-mode buttons** (`href`) suppress navigation while loading using the same inert pattern as disabled links.
- **Reduced motion:** The spinner animation is suppressed under `prefers-reduced-motion: reduce`. The static spinner icon and `aria-busy` state still communicate progress.

## Accessibility

- `fd-button` renders a **native `<button>` element** inside its shadow DOM. Native buttons are focusable, keyboard-operable (Enter and Space), and announced correctly by screen readers without extra ARIA.
- When `href` is set, the component renders a **native `<a>` element** instead. This preserves link semantics — screen reader link lists, right-click context menus, and cmd/ctrl-click for new tabs all work as expected.
- **Icon-only buttons require a name on `fd-button`** — Set `aria-label` or `aria-labelledby` on the `fd-button` element itself, not on the `fd-icon` inside it. The component forwards that accessible name to the internal native control, and the icon should remain decorative (`aria-hidden="true"`). Icon-only buttons render as square controls so the icon remains centered and the hit target stays predictable.
- **Disabled state**: On `<button>`, the native `disabled` attribute is used. On `<a>` (link mode), `aria-disabled="true"` is set instead, since anchor elements don't support native `disabled`.
- **External link safety**: When link-mode buttons use `target="_blank"`, `fd-button` adds `rel="noopener noreferrer"` automatically and preserves any extra `rel` tokens you supply.
- All interactive states use the standard focus ring: `outline: 2px solid` with `outline-offset: 2px` on `:focus-visible`.
- **Loading state**: When `loading` is set, the native control becomes inert (`disabled` on `<button>`, `aria-disabled="true"` on `<a>`) and receives `aria-busy="true"` as a supplemental signal. The spinner icon is decorative (`aria-hidden="true"`). If `loading-label` is provided, the accessible name updates to match the visible loading label, and any `aria-labelledby` on the host is suppressed so the loading label takes precedence. When `loading-label` is not set, `aria-labelledby` is forwarded normally.

## Known limitations

- **Form submission is out of scope in v1** — `fd-button` always renders an internal `<button type="button">` when it is not in link mode. Because the component is not form-associated, use a native `<button type="submit">` or `<button type="reset">` inside light-DOM forms until a future version explicitly adds form association.
- **`aria-busy` AT coverage varies** — `aria-busy` on `<button>` is not consistently announced across all screen reader / browser combinations. The primary inert signal is the native `disabled` attribute (or `aria-disabled` for links), with `aria-busy` as supplemental. Verify with your target AT combinations.

## Related components

<ul class="fdic-related-list">
  <li><a href="./button-group">Button Group</a> — Use <code>fd-button-group</code> when several independent actions need consistent spacing, ordering, and wrapping behavior in narrow containers.</li>
  <li><a href="./icon">Icon</a> — Use <code>fd-icon</code> in the <code>icon-start</code> and <code>icon-end</code> slots to add icons to buttons.</li>
  <li><a href="./callouts">Callouts</a> — For communicating information that doesn't require user action. If you're tempted to put a button inside a callout, consider whether the callout should be a standalone action section instead.</li>
</ul>
