# Field

A convenience wrapper that auto-wires `fd-label`, `fd-input`, and `fd-message` with matching `for`/`id` attributes.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Supporting primitive</span>
  <p>Use <code>fd-field</code> to reduce boilerplate when composing form fields. It auto-generates a unique ID and sets matching <code>for</code>/<code>id</code> attributes on its direct children. It is a public supporting primitive rather than a top-level form control.</p>
</div>

## When to use

- **Any form field using the label + input + message pattern** — `fd-field` eliminates manual `for`/`id` wiring.
- **Forms with many fields** — the auto-wiring saves significant boilerplate and prevents mismatched IDs.

## When not to use

- **Non-input form controls** — `fd-field` currently discovers `fd-input` children only. For `fd-selector`, `fd-checkbox`, or `fd-radio-group`, use manual `for`/`id` wiring.
- **Custom layouts** — if you need non-standard spacing or ordering between label/input/message, compose them manually.

## Examples

<StoryEmbed
  storyId="supporting-primitives-field--docs-overview"
  linkStoryId="supporting-primitives-field--auto-wiring"
  height="320"
  caption="fd-field overview — auto-wiring, preserved explicit IDs, and supporting composition patterns."
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

## Public contract

- **Category:** supporting standalone primitive
- **Public API shape:** `fd-field` has no public attributes, properties, slots, or events of its own. Its contract is the direct-child composition model.
- **Supported children:** one direct `fd-label`, one direct `fd-input`, and one direct `fd-message`
- **What it owns:** ID generation, `for`/`id` wiring, and layout spacing
- **What it does not own:** validation, message content, labeling semantics, or child prop proxying

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
- [Message](/components/message) — provides helper, error, warning, and success content inside the field pattern
