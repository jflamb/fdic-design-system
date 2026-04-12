# Confirmation Record

`fd-confirmation-record` standardizes the completion and record-keeping shell for consequential submissions. It gives the workflow one reusable place for completion messaging, confirmation or receipt numbers, next steps, and actions such as print or return links.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Supporting primitive</span>
  <p><code>fd-confirmation-record</code> is content-first and platform-neutral. It does not infer business state, submit transport, or workflow routing; the page authors the content and actions explicitly.</p>
</div>

## When to use

- **A submission creates a durable record** — Show the completion state and the reference to keep.
- **The person needs next-step guidance** — Use it when the workflow should explain what happens after submission.
- **The page needs authored follow-up actions** — Put print, download, or return actions in the `actions` slot.

## When not to use

- **Do not use it for transient success toasts** — This is for consequential completion and receipt content.
- **Do not use it to infer status from an API response shape** — Map application state into the component props explicitly.
- **Do not hide workflow-specific policy text** — Keep policy or trust guidance in the page when it needs fuller explanation.

## Examples

<StoryEmbed
  storyId="supporting-primitives-confirmation-record--docs-overview"
  linkStoryId="supporting-primitives-confirmation-record--playground"
  height="520"
  caption="Confirmation record overview — completion message, reference to keep, next steps, and authored actions."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `heading` | `string` | `Submission complete` | Primary completion heading. |
| `summary` | `string | undefined` | `undefined` | Optional completion summary. |
| `reference-label` | `string` | `"Confirmation number"` | Label shown above the reference value. |
| `reference-value` | `string | undefined` | `undefined` | Reference or receipt value to keep. |
| `next-steps` | `string | undefined` | `undefined` | What happens after submission. |
| `record-note` | `string | undefined` | `undefined` | Record-keeping note shown after the actions. |
| `variant` | `"confirmation"` | `"receipt"` | `confirmation` | Presentation variant. |
| `status` | `"success"` | `"pending"` | `success` | Visual completion status. |

## Slots

| Name | Description |
|---|---|
| `actions` | Authored follow-up actions such as print, download, or return links. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Outer confirmation shell. |
| `heading` | Completion heading. |
| `summary` | Completion summary. |
| `reference` | Reference block wrapper. |
| `reference-label` | Reference label. |
| `reference-value` | Reference value. |
| `next-steps` | Next-steps copy. |
| `actions` | Wrapper around the actions slot. |
| `record-note` | Record-keeping note. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- `fd-confirmation-record` uses a semantic section with a visible heading and structured follow-up content.
- Reference information is presented as ordinary text, so it remains selectable, printable, and easy to copy.
- Actions remain authored links or buttons in the `actions` slot. The component does not add hidden behavior or change their semantics.

## Known limitations

- The `actions` slot is always available; omit slot content when no follow-up actions are needed.
- This component does not own success alerts, navigation, or print behavior.
- `variant` and `status` control presentation only. They do not represent a workflow engine.

## Related components

- [Form Workflows](/guide/form-workflows) — workflow-level rules for confirmation, receipts, and record-keeping
- [Review List](/components/review-list) — review-before-submit pattern that typically precedes this confirmation state
