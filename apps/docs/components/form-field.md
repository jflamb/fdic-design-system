# Form Field

`fd-form-field` is the default wrapper-based field-shell primitive for new form work. It gives text-entry and grouped controls one wrapper contract for label, description, error, required or optional affordance, and field spacing without turning the design system into a form framework.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Supporting primitive</span>
  <p><code>fd-form-field</code> keeps the shell contract consistent across <code>fd-input</code>, <code>fd-textarea</code>, <code>fd-selector</code>, <code>fd-radio-group</code>, <code>fd-checkbox-group</code>, and <code>fd-file-input</code>. It does not own submit behavior, validation timing, or transport, and it is not a promise that every control family should be wrapped the same way.</p>
</div>

## When to use

- **You want one field-shell API across control families** — Use it when the workflow mixes text-entry and grouped controls.
- **The page needs explicit label, description, and error authorship** — Keep those surfaces on the wrapper rather than scattering shell markup across each control family.
- **You are building a new wrapper-based form shell** — Prefer `fd-form-field` for new composition work that mixes supported control families.

## When not to use

- **Do not use it to change submit behavior** — Native `<form>` and native `<button type="submit">` still own submission.
- **Do not use it as a validation engine** — The page decides when `invalid` and `error` become visible.
- **Do not replace simple existing `fd-field` use just for text-entry sugar** — `fd-field` remains supported for the narrow direct-child text recipe, especially when the authored label and message markup needs to stay visible before upgrade.

## Examples

<StoryEmbed
  storyId="supporting-primitives-form-field--docs-overview"
  linkStoryId="supporting-primitives-form-field--playground"
  height="520"
  caption="Form field overview — one preferred shell contract across text-entry and grouped controls."
/>

## Usage

### Text entry

```html
<fd-form-field
  label="Routing number"
  description="Enter the 9-digit number used for this transfer report."
  error="Enter the 9-digit routing number."
  required
>
  <fd-input name="routing-number" value="12345"></fd-input>
</fd-form-field>
```

### Grouped control

```html
<fd-form-field
  label="Preferred follow-up method"
  description="Choose the method you monitor during the filing window."
  error="Select how we should contact you if a reviewer needs clarification."
  required
  invalid
>
  <fd-radio-group>
    <fd-radio name="contact-method" value="email">Email</fd-radio>
    <fd-radio name="contact-method" value="phone">Phone</fd-radio>
    <fd-radio name="contact-method" value="secure-message">
      Secure message
    </fd-radio>
  </fd-radio-group>
</fd-form-field>
```

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `` | Visible field label or grouped-control legend text. |
| `description` | `string | undefined` | `undefined` | Supporting help text for the field. |
| `error` | `string | undefined` | `undefined` | Inline error text to show when the field is invalid. |
| `required` | `boolean` | `false` | Marks the field as required. |
| `optional` | `boolean` | `false` | Adds an optional affordance when `required` is false. |
| `invalid` | `boolean` | `false` | Turns on the managed invalid affordance. Pair this with authored `error` text. |
| `for` | `string | undefined` | `undefined` | Preferred control ID to wire for text-entry controls. |
| `field-id` | `string | undefined` | `undefined` | Alias for the managed control ID when `for` is not supplied. |
| `layout` | `"stacked"` | `"inline-compact"` | `stacked` | Field shell spacing density. |
| `control-type` | `"text"` | `"textarea"` | `"select"` | `"choice"` | `"file"` | `"custom"` | `undefined` | `undefined` | Reserved narrowing hook for future control-family overrides. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- For `fd-input` and `fd-textarea`, `fd-form-field` creates real `fd-label` and `fd-message` siblings with explicit `for` and `id` wiring.
- For grouped controls and `fd-selector`, `fd-form-field` projects the authored label, description, and error through each child control family's existing public API.
- The wrapper does not move focus, decide when a field is invalid, or replace inline control semantics.
- Because those managed label and message nodes are injected by the component, use [`fd-field`](/components/field) instead when you need authored text-entry markup to remain visible in server-rendered HTML before upgrade.

## Known limitations

- `fd-form-field` currently uses properties for label, description, and error content. It does not yet support fully custom slotted shell markup for those regions.
- `invalid` is a visibility affordance, not a validator. Provide matching error text when the field blocks progress.
- `fd-field` remains the simpler choice for text-entry-only direct-child sugar. `fd-form-field` is the broader default wrapper for new mixed-control shells, not a forced migration requirement for every existing field.

## Related components

- [Field](/components/field) — narrow direct-child text-entry helper that remains supported
- [Input](/components/input)
- [Text Area](/components/textarea)
- [Radio Group](/components/radio-group)
- [Checkbox Group](/components/checkbox-group)
- [Selector](/components/selector)
- [File Input](/components/file-input)
