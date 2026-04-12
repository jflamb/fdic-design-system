# Text Area

A multiline text field for collecting descriptions, notes, comments, and other extended text input.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-textarea</code> with <code>fd-label</code> and <code>fd-message</code> to build accessible multiline form fields with labeling, helper text, validation messages, and optional character counting.</p>
</div>

::: tip Wrap in fd-field
This component should almost always be wrapped in [`fd-field`](/components/field) for proper label and error message association when you are using the supported direct-child text-entry pattern. See the [minimum viable form](/guide/form-workflows#minimum-viable-form) recipe for the correct composition.
:::

## When to use

- **Extended responses** — explanations, notes, comments, or case details that are too long for a single-line field.
- **Responses where line breaks matter** — content that benefits from paragraph or list-style entry.
- **Fields with a meaningful text limit** — prompts where users need to stay within a bounded character count.

## When not to use

- **Short or predictable responses** — use [Input](/components/input) for names, IDs, short summaries, and search terms.
- **Structured choices** — use [Selector](/components/selector), [Radio Group](/components/radio-group), or [Checkbox Group](/components/checkbox-group) instead of freeform text.
- **Rich-text editing** — v1 does not support formatting, markdown, mentions, or auto-grow behaviors.

## Examples

<StoryEmbed
  storyId="components-text-area--docs-overview"
  linkStoryId="components-text-area--playground"
  height="1320"
  caption="Text Area overview — default, helper text, error state, character count, read-only, and fd-field composition. Open Storybook for interactive controls."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `` | Submitted form field name. |
| `value` | `string` | `` | Current textarea value. |
| `placeholder` | `string \| undefined` | `undefined` | Optional placeholder text. Use for examples, not as the visible label. |
| `disabled` | `boolean` | `false` | Prevents editing and submission. |
| `readonly` | `boolean` | `false` | Prevents editing while keeping the value focusable and selectable. |
| `required` | `boolean` | `false` | Marks the field as required for constraint validation. |
| `rows` | `number` | `5` | Initial visible row count for the native textarea. |
| `maxlength` | `number \| undefined` | `undefined` | Maximum character count. Also enables the built-in character counter. |
| `minlength` | `number \| undefined` | `undefined` | Minimum length requirement passed through to the native textarea. |
| `autocomplete` | `string \| undefined` | `undefined` | Native autocomplete hint for longer-text fields. |

## Events

| Name | Detail | Description |
|---|---|---|
| `input` | Native `Event` | Fired on each value change. |
| `change` | Native `Event` | Fired when the native textarea commits a value change. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-textarea-min-height` | `140px` | Minimum textarea height. |
| `--fd-textarea-border-color` | `var(--fdic-color-border-input, #bdbdbf)` | Border color at rest. |
| `--fd-textarea-border-color-hover` | `var(--fdic-color-border-input-active, #424244)` | Border color on hover. |
| `--fd-textarea-border-color-focus` | `var(--fdic-color-border-input-focus, #38b6ff)` | Focus glow color. |
| `--fd-textarea-border-radius` | `var(--fdic-corner-radius-sm, 3px)` | Corner radius. |
| `--fd-textarea-bg` | `var(--fdic-color-bg-base, #ffffff)` | Background color. |
| `--fd-textarea-placeholder-color` | `var(--fdic-color-text-secondary, #595961)` | Placeholder text color. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Visual textarea container (`<div>`) for border, background, radius, focus, and state styling. |
| `native` | The native `<textarea>` element. Exposed for JavaScript access such as `el.shadowRoot.querySelector('[part=native]')`. |
| `wrapper` | Outermost `<div>` containing the textarea container and character count. |
| `char-count` | Visible character count display. |

`fd-textarea` keeps native manual resize enabled in the vertical direction only. Width remains controlled by the component container.

When `maxlength` is present, the visible count is always shown and the screen-reader live region follows the same threshold-announcement contract as `fd-input`.
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Write prompts that explain what detail is useful</h4>
    <p>Use the label and description together so people know what information belongs in the field and how much detail is expected.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use a text area for a short answer</h4>
    <p>A large multiline field suggests a longer response. Use <code>fd-input</code> when the answer should be short.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep error messages specific</h4>
    <p>Tell people exactly what needs to be added or corrected, such as a missing explanation or minimum level of detail.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Rely on placeholder text for instructions</h4>
    <p>Placeholder text disappears while someone types. Put durable instructions in <code>fd-label</code>'s description text instead.</p>
  </div>
</div>

## Content guidelines

- **Be explicit about the goal of the response.** Prompts like “Describe what happened and when it happened” perform better than generic labels like “Comments.”
- **Say why detail matters when the field supports a decision.** For example, explain that a reviewer will use the text to understand a dispute, exception request, or account change.
- **Use character limits only when they support the task.** If you add `maxlength`, keep the limit high enough for a complete response.
- **Preserve line breaks in examples.** A text area invites paragraph-style writing; examples should reflect that reality.

## Accessibility

- `fd-textarea` renders a native `<textarea>` in shadow DOM and participates in form submission via `ElementInternals`.
- Use a native `<button type="submit">` when the textarea participates in a submitted form. `fd-textarea` is form-associated, but `fd-button` is not submit-capable in v1.
- Pair it with `fd-label` using matching `for` / `id` attributes, or use `fd-field` for auto-wiring.
- `fd-textarea` is the single owner of `aria-describedby` on the inner textarea. It assembles description IDs from sibling `fd-label`, sibling `fd-message`, and the built-in character count when present.
- Visible invalid state follows the same contract as `fd-input`: `checkValidity()` updates validity without showing an error, while `reportValidity()`, submit-time invalid events, or blur after interaction can reveal invalid styling.
- The inner textarea gets `aria-invalid="true"` only while visible invalid state is active.
- When `maxlength` is present, the visible counter is always shown and the screen-reader live region announces remaining characters at meaningful thresholds and on blur.
- The control keeps native textarea keyboard behavior. No custom keyboard model is added in v1.
- The textarea remains vertically resizable so people can expand the field when they need more room to review content.

## Known limitations

- **No auto-grow** — the field does not automatically expand as content grows.
- **No rich text** — formatting, markdown, mentions, and inline media are out of scope in v1.
- **No prefix or suffix affordances** — unlike `fd-input`, v1 keeps the multiline surface intentionally minimal.
- **axe-core and FACE** — automated accessibility tools cannot fully follow `<label for>` through a form-associated custom element’s shadow DOM. Manual screen reader testing is still recommended for final verification.

## Related components

- [Input](/components/input) — single-line text entry for shorter responses
- [Field](/components/field) — convenience wrapper for `fd-label` + `fd-input` or `fd-textarea` + `fd-message`
- [Label](/components/label) — visible label and description text for form controls
- [Message](/components/message) — helper, warning, success, and error content for field-level feedback
