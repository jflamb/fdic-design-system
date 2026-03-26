# Message

A helper and validation-feedback primitive for form fields and adjacent instructional text.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Supporting primitive</span>
  <p>Use <code>fd-message</code> to provide helper text, validation feedback, warning text, or success confirmation near a form control. It is a public supporting primitive: consumers author it directly, but it is most meaningful when paired with <code>fd-input</code> or <code>fd-field</code>.</p>
</div>

## When to use

- **You need authored helper or validation text near a control** — `fd-message` keeps the visible feedback copy in authored markup instead of hiding it inside control internals.
- **The message state matters visually** — Error, warning, and success states add iconography and semantic color for quick scanning.
- **A control needs stable described-by wiring** — `fd-message` renders in light DOM so sibling components can discover its ID and reference it from `aria-describedby`.

## When not to use

- **Don't use it as a general page alert** — `fd-message` is for field-adjacent support content, not for banner-level messaging.
- **Don't rely on it alone to control validity** — `fd-message` can reflect authored error copy, but the form control still owns its validity lifecycle and invalid presentation rules.
- **Don't use multiple competing messages for one input unless you can manage the relationship intentionally** — paired controls such as `fd-input` only discover the first matching `fd-message` in tree order.

## Examples

<StoryEmbed
  storyId="supporting-primitives-message--docs-overview"
  linkStoryId="supporting-primitives-message--playground"
  height="340"
  caption="fd-message overview — helper, error, warning, success, and live-region behavior."
/>

## Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `for` | `string \| undefined` | `undefined` | Optional target control ID for sibling discovery and authored association patterns |
| `state` | `"default"` \| `"error"` \| `"warning"` \| `"success"` | `"default"` | Visual and semantic state of the message |
| `message` | `string` | `""` | Authored message text. Empty text renders nothing. |
| `live` | `"polite"` \| `"off"` \| `undefined` | `undefined` | Overrides the default announcement behavior. Errors default to `role="alert"`; non-errors default to `aria-live="polite"`. |

## Shadow parts

| Name | Description |
|------|-------------|
| `message` | Outer inline-flex wrapper for icon and text |
| `message-text` | Text node wrapper for the authored message string |

## Usage

### Helper text

```html
<fd-label for="phone" label="Phone number"></fd-label>
<fd-input id="phone" name="phone" type="tel"></fd-input>
<fd-message
  for="phone"
  message="We may call this number if we need to verify your filing."
></fd-message>
```

### Error feedback

```html
<fd-label for="routing" label="Routing number" required></fd-label>
<fd-input id="routing" name="routing" required></fd-input>
<fd-message
  for="routing"
  state="error"
  message="Enter a valid 9-digit routing number."
></fd-message>
```

### With `fd-field`

```html
<fd-field>
  <fd-label label="Account number" required></fd-label>
  <fd-input name="account" required></fd-input>
  <fd-message
    state="error"
    message="Enter the account number exactly as it appears on your statement."
  ></fd-message>
</fd-field>
```

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `for` | `string \| undefined` | `undefined` | Optional target control ID for sibling discovery and authored association patterns |
| `state` | `"default"` \| `"error"` \| `"warning"` \| `"success"` | `default` | Visual and semantic state of the message |
| `message` | `string` | `` | Authored message text. Empty text renders nothing. |
| `live` | `"polite"` \| `"off"` \| `undefined` | `undefined` | Overrides the default announcement behavior. Errors default to `role="alert"`; non-errors default to `aria-live="polite"`. |

## Shadow parts

| Name | Description |
|---|---|
| `message` | Outer inline-flex wrapper for icon and text |
| `message-text` | Text node wrapper for the authored message string |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- `fd-message` renders in light DOM, not shadow DOM, so sibling controls can reference its stable `messageId`.
- Error messages default to `role="alert"` so newly revealed blocking errors announce assertively.
- Non-error messages default to `aria-live="polite"` so helper, warning, and success text can be announced without interrupting the user harshly.
- Set `live="polite"` on an error message if the content updates frequently and you want to avoid assertive interruptions.
- Set `live="off"` when the message should stay visible but should not act as a live region.
- `fd-message` does not own `aria-describedby`, `aria-invalid`, or validation timing. Those remain the form control's responsibility.

## Authoring constraints

- Keep the copy short and specific. In this system, `fd-message` is the primary user-facing error/help surface, not fallback browser validation text.
- Pair `for` with a real control ID when the message should be discoverable by sibling controls outside `fd-field`.
- Avoid stacking multiple `fd-message` elements for the same control unless you intentionally control tree order and semantics.
- If a control can block submission, authored error copy is expected. Visual invalid styling without specific message text is incomplete usage.
- For page-level timing, submit-scoped error summaries, and focus behavior after blocked submit, see [Form Workflows](/guide/form-workflows).

## Known limitations

- `fd-message` accepts authored text through the `message` attribute only. It does not support rich text slots in v1.
- Consumers must manage control relationships explicitly outside `fd-field`; `fd-message` does not auto-discover its target.
- `fd-input` only discovers the first matching `fd-message` for a given `for`/`id` pair.

## Related components

<ul class="fdic-related-list">
  <li><a href="./field">Field</a> — Use <code>fd-field</code> when you want automatic <code>for</code>/<code>id</code> wiring for label, input, and message composition.</li>
  <li><a href="./input">Input</a> — <code>fd-input</code> reads authored <code>fd-message</code> state for described-by and visual state wiring.</li>
  <li><a href="./label">Label</a> — Use <code>fd-label</code> alongside <code>fd-message</code> for visible field labels and descriptions.</li>
  <li><a href="/guide/form-workflows">Form Workflows</a> — Use the workflow guidance for page-level validation timing, blocked-submit summaries, and high-stakes review and confirmation rules.</li>
</ul>
