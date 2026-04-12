# Error Summary

`fd-error-summary` is the submit-scoped navigation surface for blocked forms. Use it after a failed submit when the page must preserve entered values, show inline errors at the correction point, and give people a short list of real correction targets near the top of the page.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Supporting primitive</span>
  <p><code>fd-error-summary</code> standardizes the heading, optional intro, and linked error list for blocked-submit recovery. It does not discover errors, validate fields, or decide when submission should fail.</p>
</div>

## When to use

- **Blocked submit needs a top-of-page recovery surface** — Use it when the workflow reveals multiple blocking errors after submit.
- **The workflow already provides inline errors** — The summary complements inline field or group messaging; it does not replace it.
- **Focus should move once after submit fails** — Use `autofocus` when people need immediate confirmation that submission did not complete.

## When not to use

- **Do not use it for blur-only validation** — A page-level summary is for blocked submit, not every field interaction.
- **Do not use it as the only error surface** — Keep inline field or group errors visible where correction happens.
- **Do not ask it to own validation logic** — Build the `items` array in application code and decide when `open` becomes true.

## Examples

<StoryEmbed
  storyId="supporting-primitives-error-summary--docs-overview"
  linkStoryId="supporting-primitives-error-summary--playground"
  height="360"
  caption="Error summary overview — blocked-submit heading, optional intro, linked correction targets, and focus guidance."
/>

## Usage

```ts
const summary = document.querySelector("fd-error-summary");

summary.items = [
  { href: "#routing-number", text: "Enter the 9-digit routing number." },
  {
    href: "#contact-method-group",
    text: "Select how we should contact you if a reviewer needs clarification.",
  },
];
summary.open = true;
summary.autofocus = true;
```

Keep the link targets real:

- point single-field errors at the invalid control
- point grouped-control errors at the first practical correction target, such as the fieldset wrapper or first invalid sub-field
- keep the inline field or group error copy aligned with the summary copy

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `heading` | `string` | `Fix the following before you continue` | Visible summary heading. |
| `intro` | `string | undefined` | `undefined` | Optional supporting text displayed between the heading and the error links. |
| `open` | `boolean` | `false` | Shows the summary when true. Closed summaries render nothing. |
| `autofocus` | `boolean` | `false` | Moves focus to the summary when it opens. |
| `focus-target` | `"container"` | `"heading"` | `"container"` | Selects whether focus lands on the summary container or heading when `autofocus` is true. |
| `items` | `Array<{ href: string; text: string }>` | `[]` | Authored correction targets. Set this as a JavaScript property, not a string attribute. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-error-summary-background` | `var(--fdic-color-bg-container, #f5f5f7)` | Summary background surface. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Focusable summary section. |
| `heading` | Summary heading. |
| `intro` | Optional supporting text. |
| `list` | List wrapper for error links. |
| `item` | Individual list item. |
| `link` | Authored correction link. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- `fd-error-summary` renders a semantic `<section>` labelled by its heading.
- The container is programmatically focusable so blocked-submit flows can move focus once without adding extra tabindex management around it.
- `focus-target="heading"` is available when the workflow wants focus on the heading instead of the container.
- The component renders only authored links. It does not guess correction targets or override page navigation behavior.

## Known limitations

- `items` is a property, not a string attribute. Author the list from JavaScript or framework bindings.
- `fd-error-summary` does not scroll or focus the linked field for you after link activation. Leave that behavior to the page if it is needed.
- This component does not manage validation timing, server error mapping, or summary dismissal.

## Related components

- [Form Workflows](/guide/form-workflows) — workflow-level guidance for blocked-submit recovery and summary targeting
- [Message](/components/message) — inline helper and error messaging that remains the primary correction surface
- [Alert](/components/alert) — page-level status messaging for non-field failures that do not belong in a field error summary
