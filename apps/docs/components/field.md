# Field

A convenience wrapper that auto-wires `fd-label`, `fd-input`, and `fd-message` with matching `for`/`id` attributes.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-field</code> to reduce boilerplate when composing form fields. It auto-generates a unique ID and sets matching <code>for</code>/<code>id</code> attributes on its direct children.</p>
</div>

## When to use

- **Any form field using the label + input + message pattern** — `fd-field` eliminates manual `for`/`id` wiring.
- **Forms with many fields** — the auto-wiring saves significant boilerplate and prevents mismatched IDs.

## When not to use

- **Non-input form controls** — `fd-field` currently discovers `fd-input` children only. For `fd-selector`, `fd-checkbox`, or `fd-radio-group`, use manual `for`/`id` wiring.
- **Custom layouts** — if you need non-standard spacing or ordering between label/input/message, compose them manually.

## Examples

<StoryEmbed
  storyId="components-input--field-composition"
  linkStoryId="components-input--field-with-prefix-suffix"
  height="200"
  caption="fd-field auto-wires fd-label, fd-input, and fd-message. Open Storybook for more examples."
/>

## Usage

### Basic composition

```html
<fd-field>
  <fd-label label="Email address" required
    description="We'll never share your email"></fd-label>
  <fd-input name="email" type="email" required
    placeholder="you@example.com"></fd-input>
  <fd-message state="error"
    message="Enter a valid email address"></fd-message>
</fd-field>
```

`fd-field` auto-generates an ID on `fd-input` and sets matching `for` attributes on `fd-label` and `fd-message`. You do not need to set `id` or `for` manually.

### With explicit IDs

If you need a specific ID (e.g., for test selectors or deep linking), set it on `fd-input` directly. `fd-field` will use the existing ID instead of generating one:

```html
<fd-field>
  <fd-label label="Account number"></fd-label>
  <fd-input id="account-num" name="account"></fd-input>
</fd-field>
```

### Without fd-field (still works)

The three components work standalone without `fd-field`. Use manual `for`/`id` wiring:

```html
<fd-label for="email" label="Email address" required></fd-label>
<fd-input id="email" name="email" type="email" required></fd-input>
<fd-message for="email" state="error" message="Enter a valid email"></fd-message>
```

## Behavior

- **Auto-wires direct children only.** `fd-field` does not query descendants inside wrapper `<div>` elements or nested components.
- **Respects pre-set attributes.** If `fd-input` already has an `id`, or `fd-label`/`fd-message` already have `for`, those values are preserved. **Caution:** If you pre-set `for` on `fd-label` to a value different from the `fd-input`'s `id`, the label and input will point at different targets. Either let `fd-field` auto-wire everything, or set all `for`/`id` attributes explicitly.
- **Warns on duplicates.** Multiple `fd-input`, `fd-label`, or `fd-message` direct children produce a console warning. Only the first of each is auto-wired.
- **Nested `fd-field` is not supported** and produces a console warning.
- **Spacing.** `fd-field` provides a vertical flex layout with 6px gap and neutralizes the built-in margins on `fd-label` and `fd-message` to avoid double-spacing.

## Accessibility

- `fd-field` does not add any ARIA attributes. It only wires `for`/`id` on its children.
- The labeling and description contracts remain owned by `fd-label`, `fd-input`, and `fd-message`.
- `fd-field` renders in light DOM to avoid shadow DOM boundary issues with `<label for>`.

## Known limitations

- **Only discovers `fd-input`** — does not auto-wire `fd-selector`, `fd-checkbox`, or other form controls.
- **Direct children only** — children nested inside wrapper elements are not discovered.
- **No prop proxying** — all attributes (`label`, `message`, `state`, `required`, etc.) go on the child components directly.

## Related components

- [Input](/components/input) — the text input component that `fd-field` wraps
- [Label](/components/label) — provides accessible name and description
