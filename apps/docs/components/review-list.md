# Review List

`fd-review-list` standardizes the repeated review-before-submit shell for consequential submissions. It presents label and value pairs, with optional change links, without taking over workflow progression, attestation, or submit behavior.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Supporting primitive</span>
  <p><code>fd-review-list</code> turns repeated review markup into one semantic description-list pattern. Keep change targets, attestation copy, and final submit actions outside the component.</p>
</div>

## When to use

- **A workflow needs review-before-submit** — Use it when the person should confirm values before creating an official record.
- **The review state repeats the same label and value shell** — Standardize that structure instead of hand-authoring it every time.
- **You need optional change actions** — Provide explicit change links only when the editing path exists.

## When not to use

- **Do not use it as a summary card for unrelated metrics** — This component is for review-before-submit content.
- **Do not use it to store workflow state** — Build the `items` array from the page or application state.
- **Do not hide key review protections inside it** — Attestation, warnings, and submit controls still belong to the workflow page.

## Examples

<StoryEmbed
  storyId="supporting-primitives-review-list--docs-overview"
  linkStoryId="supporting-primitives-review-list--playground"
  height="420"
  caption="Review list overview — semantic review rows with optional change links."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `heading` | `string | undefined` | `undefined` | Optional review heading. |
| `heading-level` | `2` | `3` | `4` | `2` | Heading level used when `heading` is present. |
| `density` | `"default"` | `"compact"` | `default` | Vertical density for the review rows. |
| `dividers` | `boolean` | `false` | Adds row dividers. |
| `items` | `Array<{ label: string; value?: string; href?: string; changeLabel?: string; emptyText?: string }>` | `[]` | Review rows to render. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-review-list-gap` | `var(--fdic-spacing-md, 16px)` | Gap between the optional heading and the list. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Outer review section. |
| `heading` | Optional review heading. |
| `list` | Description list wrapper. |
| `term` | Review row label. |
| `detail` | Review row value cell. |
| `detail-layout` | Layout wrapper inside each detail cell. |
| `value` | Review value text. |
| `value-empty` | Empty-value treatment. |
| `change-link` | Optional change action. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- `fd-review-list` renders a semantic `<dl>` so label and value pairs stay associated for assistive technologies.
- Change links remain authored anchors. The component does not intercept or reroute them.
- Use concise labels and complete review values so the list is understandable out of context.

## Known limitations

- `items` is a JavaScript property rather than a string attribute.
- This component does not currently support fully custom row markup inside the shell.
- Review orchestration, attestation, and submit actions stay outside the component by design.

## Related components

- [Form Workflows](/guide/form-workflows) — workflow-level rules for when review-before-submit is required
- [Confirmation Record](/components/confirmation-record) — completion and receipt pattern for the step after review
