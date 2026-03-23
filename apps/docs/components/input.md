# Input

A text input field for user-entered text, with support for labels, hints, error states, and character limits.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-input</code> with <code>fd-label</code> and <code>fd-message</code> to build accessible form fields with labeling, description text, validation messages, and character counting.</p>
</div>

## When to use

- **Single-line text entry** — names, account numbers, email addresses, phone numbers, search terms.
- **Fields that need validation feedback** — error, warning, or success states with an associated message.
- **Fields with character limits** — comments, descriptions, or other bounded text entry.
- **Any form field requiring an accessible label + hint + error message pattern.**

## When not to use

- **Multi-line text** — use a future `fd-textarea` component instead.
- **Structured selection** — use `fd-selector` for dropdown/select patterns.
- **Toggle/boolean input** — use `fd-checkbox` or `fd-radio-group`.
- **Numeric identifiers** — do not use `type="number"` for routing numbers, account numbers, ZIP codes, or SSNs. Use `type="text"` with `inputmode="numeric"` instead.

## Examples

<StoryEmbed
  storyId="components-input--docs-overview"
  linkStoryId="components-input--playground"
  height="900"
  caption="Input variants — default, with description, error state, character count, disabled, and read-only. Open Storybook for interactive controls."
/>

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use visible, descriptive labels</h4>
    <p>Every input must have a visible <code>fd-label</code>. Labels should use plain language and describe exactly what information is expected.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Rely on placeholder text as a label</h4>
    <p>Placeholder text disappears on input and is not reliably announced by all screen readers. Use it only for format examples.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Write specific, actionable error messages</h4>
    <p>"Enter a 9-digit routing number" tells users exactly what to fix. Where relevant, explain why the value failed.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use generic error text</h4>
    <p>"Invalid input" or "This field is required" forces users to guess what went wrong.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Preserve entered values after validation</h4>
    <p>Never clear a field when showing an error. Users should be able to see and correct what they entered.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Show errors before interaction</h4>
    <p>Don't mark empty required fields as invalid until the user has attempted to submit or leave the field.</p>
  </div>
</div>

## Content guidelines

- **Use plain-language labels.** Government and financial forms require clarity over brevity.
- **Explain why sensitive information is needed** in the description text when relevant (e.g., "We use your routing number to verify your bank").
- **Mark required fields** with the `fd-label required` attribute. If most fields are required, consider marking optional fields with "(optional)" in the label instead.
- **Character counts show remaining** for screen readers ("42 characters remaining") while the visual display uses a compact format ("208 / 250").
- **Do not put critical instructions in placeholder text** — use `fd-label`'s `description` attribute for persistent instructions.

## Accessibility

- `fd-input` renders a native `<input>` in **shadow DOM** and participates in form submission via `ElementInternals` (form-associated custom element).
- **Labeling:** Pair with `fd-label` using matching `for`/`id` attributes. `fd-label` renders a native `<label>` in light DOM for real click-to-focus and screen reader name computation.
- **Description wiring:** `fd-input` is the **single owner** of `aria-describedby` on the inner `<input>`. It discovers associated `fd-label` and `fd-message` siblings via their `for` attributes and reads their stable public getters (`descriptionId`, `messageId`) to assemble the description.
- **Error state:** When an associated `fd-message` has `state="error"`, `fd-input` sets `aria-invalid="true"` on the inner input and applies the error border style. `fd-message` uses `role="alert"` for error messages to ensure immediate screen reader announcement.
- **Character count:** A visible count updates on every keystroke. A screen-reader-only live region announces remaining characters at meaningful thresholds (80% used, 100% reached, and on blur).
- **Focus ring:** Standard pattern — `outline: 2px solid`, `outline-offset: 2px`, `border-radius: 2px`.
- **Minimum target size:** 44px input height per WCAG 2.5.8.
- **Forced colors:** Borders use system colors; error/warning/success borders use `forced-color-adjust: none`.
- **Same-root limitation:** `fd-label`, `fd-input`, and `fd-message` must share the same DOM root tree for the `for`/`id` discovery to work.

## Known limitations

- **No prefix/suffix slots** — leading icons and trailing action buttons inside the input field are deferred to a future version.
- **No input masking** — phone number, SSN, or other format masking must be handled by the consumer.
- **No built-in validation timing** — the component does not automatically validate on blur or input. Consumers control when to show/hide `fd-message`.
- **Three-component composition** — consumers must assemble `fd-label` + `fd-input` + `fd-message` with matching `for`/`id` attributes. This provides flexibility but requires more markup than a single compound component.
- **axe-core and FACE** — automated accessibility tools like axe-core cannot follow `<label for>` through a form-associated custom element's shadow DOM. Manual screen reader testing (NVDA, JAWS, VoiceOver) is recommended for verification.

## Related components

- [Label](/components/label) — provides accessible name, description/hint text, and InfoTip for form inputs
- [Selector](/components/selector) — dropdown/select pattern for structured selection
- [Radio Group](/components/radio-group) — grouped radio inputs with built-in legend
- [Checkbox Group](/components/checkbox-group) — grouped checkboxes with built-in legend
