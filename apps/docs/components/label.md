# Label

Labels identify form inputs and provide optional description text and contextual help.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-label</code> to label form inputs with a native <code>&lt;label&gt;</code> element, optional required indicator, description/hint text, and an InfoTip disclosure button for supplementary contextual help.</p>
</div>

## When to use

- **Labeling standalone form inputs** — text inputs, selects, textareas, date pickers, and file inputs that are not inside a group component.
- **A field needs hint text** — description text explains format, constraints, or purpose without cluttering the label.
- **Supplementary contextual help** — use the InfoTip when definitions or "why we ask" explanations are useful but would overwhelm if always visible.

## When not to use

- **Don't use for grouped inputs** — `fd-radio-group` and `fd-checkbox-group` have their own built-in legend and description slots.
- **Don't hide critical instructions in the InfoTip** — if users need the information to complete the field correctly, make it always-visible hint text.
- **Don't use without a `for` attribute** — every `fd-label` should point to the `id` of its associated input.

## Examples

<StoryEmbed
  storyId="components-label--docs-overview"
  linkStoryId="components-label--playground"
  height="680"
  caption="Label variants — basic, required with description, with InfoTip, and full-featured. Open Storybook for interactive controls."
/>

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Write self-explanatory labels in plain language</h4>
    <p>Labels should use everyday words. Avoid internal jargon or abbreviations without context.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use vague or abbreviated labels</h4>
    <p>Labels like "ID" or "No." force users to guess what information is expected.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use hint text for format requirements</h4>
    <p>Always-visible hint text like "Format: XXX-XX-XXXX" prevents errors before submission.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Hide format requirements in the InfoTip</h4>
    <p>If users need the information to fill in the field correctly, it should be visible without an extra click.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use InfoTip for supplementary definitions</h4>
    <p>Regulatory terms, eligibility criteria, or "why we ask" explanations are good InfoTip content.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use InfoTip for compliance-critical information</h4>
    <p>If misunderstanding the help content could create compliance risk, keep it visible or use a linked disclosure.</p>
  </div>
</div>

## Content guidelines

- **Use plain-language labels.** Government and financial forms require clarity.
- **Mark required or optional fields.** Use the `required` attribute on `fd-label` and the matching `required` attribute on the input. Include a visible page-level instruction explaining the asterisk convention (e.g., "Fields marked with * are required").
- **Keep hint text to one sentence.** Screen readers announce the full `aria-describedby` content on focus.
- **Make InfoTip labels field-specific.** The component auto-generates "More information about [label text]" by default. Override with `infotip-label` when more precision is needed.

## Accessibility

- `fd-label` renders a native `<label>` element in **light DOM**, giving a real `for`/`id` association with the target input. Click-to-focus and screen reader name computation work natively.
- The required indicator uses a visual asterisk (`aria-hidden="true"`) paired with visually-hidden text "(required)" for screen readers. The input itself must also have the `required` or `aria-required` attribute.
- Description text is auto-wired via `aria-describedby` on the target input. `fd-label` appends its description ID, preserves existing tokens, and cleans up only its own ID on disconnect.
- The InfoTip uses a disclosure/toggletip pattern: `<button>` with `aria-expanded` and `aria-controls`. No `role="status"` or live region. Escape closes the panel and returns focus to the trigger.
- **Same-root limitation:** The target control must share the same DOM root tree as `fd-label`. If the input lives inside another component's shadow root, the `for`/`id` association will not cross that boundary.

## Known limitations

- **Light DOM rendering** — `fd-label` renders without a shadow root to enable native label association. This means host-page styles can bleed into the component. Styles are scoped via tag-qualified selectors (`fd-label [part="..."]`) and rendered as an inline `<style>` tag.
- **No error slot** — Error display stays in consuming form controls where it is coupled to validation state. `fd-label` is a labeling primitive, not a form field wrapper.
- **InfoTip content is plain text only in v1** — The `infotip` attribute accepts a string. Rich content with links or interactive elements would require a dialog pattern and is out of scope.
- **Popover support** — The InfoTip panel uses `popover="auto"` with a fallback for browsers that do not support the Popover API.

## Related components

- [Radio Group](/components/radio-group) — has built-in legend and description for grouped radio inputs
- [Checkbox Group](/components/checkbox-group) — has built-in legend and description for grouped checkboxes
- [Selector](/components/selector) — has built-in label and description for select-like inputs
