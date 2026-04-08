# Checkbox

Checkboxes let users make one or more explicit selections. Use them when each option is independent and users may choose zero, one, or many.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-checkbox</code> for standalone consent patterns, select-all controls, and individual options inside a <code>fd-checkbox-group</code>. The component keeps a real native checkbox input in Shadow DOM so keyboard behavior, label association, and screen reader announcements remain native.</p>
</div>

::: tip Wrap in fd-field
Standalone checkboxes (such as consent or acknowledgement patterns) should be wrapped in [`fd-field`](/components/field) for proper label and error message association. Checkboxes inside `fd-checkbox-group` do not need individual `fd-field` wrappers.
:::

## When to use

- **Users may select multiple options** — Communication preferences, account types, disclosure acknowledgements, and similar independent choices.
- **A single acknowledgement needs explicit consent** — Terms acceptance, privacy notices, or confirmation of a statement before continuing.
- **You need a parent “select all” control** — Use the indeterminate state only for aggregate patterns where some child options are checked.

## When not to use

- **Don’t use a checkbox for a single forced choice between alternatives** — Use radios when only one option may be selected.
- **Don’t use a checkbox as a switch** — If the UI is representing an immediate on/off system state, use a switch pattern when the design system has one.
- **Don’t use indeterminate as a third business-state value** — Mixed state is for aggregate selection, not for “maybe” or “pending.”

## Examples

<StoryEmbed
  storyId="components-checkbox--docs-overview"
  linkStoryId="components-checkbox--playground"
  height="420"
  caption="Checkbox overview — default, checked, indeterminate, description, and disabled states. Open Storybook for interactive controls and form examples."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | `false` | Current checked state |
| `indeterminate` | `boolean` | `false` | Mixed visual state for aggregate patterns such as "select all" |
| `disabled` | `boolean` | `false` | Prevents interaction and submission |
| `required` | `boolean` | `false` | Marks the checkbox as required for constraint validation |
| `name` | `string` | `` | Submitted form field name |
| `value` | `string` | `on` | Submitted value when the checkbox is checked |

## Slots

| Name | Description |
|---|---|
| (default) | Visible checkbox label |
| `description` | Optional supporting text announced through `aria-describedby` when present |

## Events

| Name | Detail | Description |
|---|---|---|
| `input` | Native `Event` | Fired when the checkbox value changes |
| `change` | Native `Event` | Fired after the user commits a checkbox state change |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-checkbox-gap` | `var(--fdic-spacing-xs, 8px)` | Gap between the control and the label text |
| `--fd-checkbox-size` | `1.5em` | Size of the checkbox control, scaled to the component's label text by default |
| `--fd-checkbox-border-color` | `var(--fdic-text-primary, #212123)` | Resting control color |
| `--fd-checkbox-radius` | `var(--fdic-corner-radius-sm, 3px)` | Checkbox corner radius |
| `--fd-checkbox-icon-size` | `24px` | Size of the internal state icon |
| `--fd-checkbox-focus-color` | `var(--fdic-border-input-focus, #38b6ff)` | Focus ring color |
| `--fd-checkbox-overlay-hover` | `var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04))` | Hover overlay color |
| `--fd-checkbox-overlay-active` | `var(--ds-color-overlay-pressed, rgba(0, 0, 0, 0.08))` | Active overlay color |
| `--fd-checkbox-invalid-color` | `rgb(190, 40, 40)` | Control color while visible invalid state is active |

## Shadow parts

| Name | Description |
|---|---|
| `control` | Wrapper for the native checkbox input and visual glyph |
| `label` | Wrapper for label and description text |
| `description` | Optional description text wrapper |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep labels explicit and scannable</h4>
    <p>Users should know what will happen when the box is checked without reading surrounding paragraphs.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Hide the meaning in surrounding copy</h4>
    <p>If the label is vague, users may miss legal or financial consequences of the selection.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use indeterminate only for aggregate controls</h4>
    <p>“Select all accounts” is a good fit because the state reflects child selections.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Treat indeterminate as a third data value</h4>
    <p>Users do not reliably understand a mixed checkbox as a stable business state.</p>
  </div>
</div>

## Content guidelines

- **Use sentence case.**
- **Lead with the action or commitment.** Example: “I agree to the terms and conditions.”
- **Use the description slot only when the option needs clarification.** Most checkbox labels should stand on their own.

## Accessibility

- `fd-checkbox` contains a real native `<input type="checkbox">` as its semantic and interaction foundation.
- Clicking anywhere on the label row toggles the checkbox because the row uses a real `<label>` wrapper.
- The visual icon is decorative only. Screen readers rely on the native checkbox input and slotted label text.
- The description is linked with `aria-describedby` only when the `description` slot has actual content.
- Required standalone checkboxes participate in native constraint validation through `ElementInternals`, with the validation anchor on the internal input.
- `checkValidity()` updates and returns validity without revealing invalid state.
- `reportValidity()` and blur after user interaction are visibility boundaries. When the checkbox is invalid at that boundary, the host gets `data-user-invalid` and the internal checkbox gets `aria-invalid="true"`.
- A submit attempt is also a visibility boundary. `aria-invalid` is present iff `data-user-invalid` is present, and both clear in the same update cycle once the checkbox becomes valid or resets.
- `data-user-invalid` and `aria-invalid` clear when the checkbox becomes valid or the form reset path runs.
- If a required standalone checkbox can block submission, pair it with authored adjacent error copy in the surrounding field pattern. Relying on invalid styling without user-facing text is incomplete usage.

## Known limitations

- **No size variants in v1** — The component ships with one accessible default size.
- **Manual AT validation is still required** — Automated checks do not replace VoiceOver and NVDA verification for description and validation announcement behavior.

## Related components

<ul class="fdic-related-list">
  <li><a href="./checkbox-group">Checkbox Group</a> — Use <code>fd-checkbox-group</code> when related options need a shared legend, description, or group-level validation.</li>
</ul>
